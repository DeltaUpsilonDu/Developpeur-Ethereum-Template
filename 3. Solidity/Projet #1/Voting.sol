// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A decentralized voting system
/// @author Sébastien Dupertuis
/// @notice Topic of the first smart contract project for Alyra school - Blockchain developper
/// @dev 
contract Voting is Ownable {
    //------------------------------------------------------------------------------------
    // ----------------------------------Variables----------------------------------------
    //------------------------------------------------------------------------------------

    /// @notice This is the structure that contains all the information about a voter
    /// @dev 
    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    /// @notice This is the structure that contains a proposal and how many votes it got
    /// @dev 
    struct Proposal {
        string description;
        uint voteCount;
    }

    /// @notice Enumeration that manages the full voting procedure
    /// @dev 
    enum WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    /// @notice Variable to contain the current status
    WorkflowStatus private status;
    /// @notice Mapping of voters
    mapping (address => Voter) voters;
    /// @notice Table of voters addresses (used to reset the voting)
    address[] private whitelist;
    /// @notice Table of proposals
    Proposal[] private proposals;
    /// @notice Variable containing the winning proposal ID
    uint private winningProposalId;

    //------------------------------------------------------------------------------------
    // ------------------------------------Events-----------------------------------------
    //------------------------------------------------------------------------------------

    /// @notice Event raised when a new voter has registered
    event VoterRegistered(address voterAddress);
    /// @notice Event raised when the admin modified the current status of the voting procedure
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    /// @notice Event raised when a voter registered a proposal
    event ProposalRegistered(uint proposalId);
    /// @notice Event raised when voter has voted
    event Voted (address voter, uint proposalId);
 
    //------------------------------------------------------------------------------------
    // ----------------------------------Constructor--------------------------------------
    //------------------------------------------------------------------------------------

    /// @notice The constructor initializing the admin as a voter
    constructor () {
        addVoter(msg.sender);
    }

    //------------------------------------------------------------------------------------
    // -----------------------------------Modifiers---------------------------------------
    //------------------------------------------------------------------------------------

    /// @notice Modifier to allow only voters
    modifier onlyVoters {
        require(voters[msg.sender].isRegistered == true,"This address does not have the rights to participate.");
        _;
    }

    //------------------------------------------------------------------------------------
    // -----------------------------------Functions---------------------------------------
    //------------------------------------------------------------------------------------

    /// @notice This function allows the owner to manage the voting status
    /// @dev Function to be called by the admin through the front end
    function nextStatus() external onlyOwner {
        require(status != WorkflowStatus.VotesTallied, "The voting has already ended.");    // Make sure the voting is not finished
        
        uint _oldStatusID = uint(status);           // Save the current status as old status
        status = WorkflowStatus(_oldStatusID+1);    // Update the status 
    
        emit WorkflowStatusChange(WorkflowStatus(_oldStatusID),status);  // Raise the event to log the status change 
    }

    /// @notice This function allows the owner to add a voter in the whitelist
    /// @dev Function to be called by the admin through the front end
    /// @param _address The address to be added in the whitelist
    function addVoter(address _address) public onlyOwner {
        require(status == WorkflowStatus.RegisteringVoters,"The registering period is over.");      // Make sure the registration phase is still in progress
        require(_address != address(0),"The address needs to be different from zero.");             // Make sure the address is valid
        require(voters[_address].isRegistered == false,"This voter has been already registered.");   // Revert if the voter was already registered (to aboid unnecessary actions)

        // Add the voter in the whitelist (mapping and array)
        voters[_address] = Voter(true,false,0); 
        whitelist.push(_address);

        emit VoterRegistered(_address);  // Raise the event to log the new voter registration 
    }

    /// @notice This function allows the voters to place a proposal
    /// @dev Function to be called by the voters through the front end
    /// @param _description The description of the proposal
    function addProposal(string memory _description) external onlyVoters {
        require(status == WorkflowStatus.ProposalsRegistrationStarted,"The proposal registering period is over or has not strted yet.");      // Make sure the proposal registration phase is in progress
    
        // Push the new proposal in the array
        Proposal memory proposal = Proposal(_description, 0);
        proposals.push(proposal);

        emit ProposalRegistered(proposals.length-1);  // Raise the event to log the new proposal registration 
    }

    /// @notice This function allows the voters to vote for a single proposal
    /// @dev Function to be called by the voters through the front end
    /// @param _proposalID The proposal ID that receive a vote
    function setVote(uint _proposalID) external onlyVoters {
        require(status == WorkflowStatus.VotingSessionStarted,"The proposal voting period is over or has not started yet.");      // Make sure the voting phase is in progress
        require(voters[msg.sender].hasVoted == false,"This voter has already voted.");   // Revert if the voter has already voted
        require(_proposalID <= proposals.length-1,"The proposal ID is not valid.");

        proposals[_proposalID].voteCount += 1;  // Increment the vote count of the given proposal

        voters[msg.sender].hasVoted = true;                 // This voter has now voted
        voters[msg.sender].votedProposalId = _proposalID;   // Save the choice of the voter

        emit Voted(msg.sender,_proposalID);  // Raise the event to log vote and voter address
    }

    /// @notice This function calculate the voting result.
    /// @dev Function to be called by the admin through the front end
    function calculateResult() external onlyOwner {
        require(status == WorkflowStatus.VotingSessionEnded,"The voting is still in progress or has not started yet.");        // Make sure the voting is finished
        require(proposals.length > 0,"There are no proposals in the list.");                            // Make sure there is at least one proposal in the list

        for(uint i=1;i<proposals.length;i++) {
            if(proposals[i].voteCount > proposals[winningProposalId].voteCount) {
                winningProposalId = i;
            }
        }
    }

    /// @notice This function returns the voting result. The result is opened to anyone
    /// @dev Function to be called by anyone through the front end
    /// @return Returns the winning proposal ID, his description and the amount of votes
    function getWinner() external view returns (uint,string memory,uint) {
        require(status == WorkflowStatus.VotesTallied,"The voting is still in progress.");      // Make sure the voting is finished

        return (winningProposalId,proposals[winningProposalId].description,proposals[winningProposalId].voteCount);
    }

    /// @notice This function allows the voters to see what the other voters have voted
    /// @dev Function to be called by the voters through the front end
    /// @param _address The address to check the vote
    /// @return Returns the voted ID of the given voter defined by _address
    function getVotedID(address _address) external view onlyVoters returns (uint) {
        require(status >= WorkflowStatus.VotingSessionStarted,"The voting period did not start yet.");      // Make sure the voting phase has started
        require(_address != address(0),"The address needs to be different from zero.");             // Make sure the address is valid
        require(voters[_address].isRegistered == true,"This address does not belong to the whitelist.");
        require(voters[_address].hasVoted == true,"This voter has not voted yet.");   // Revert if the voter has not voted yet
    
        return voters[_address].votedProposalId;    // Return the vote of the requested voter
    }

    /// @notice This function resets the voting once closed
    /// @dev Function to be called by the admin through the front end
    function reset() external onlyOwner{
        require(status == WorkflowStatus.VotesTallied, "The voting is still ongoing.");    // Make sure the voting is finished

        status = WorkflowStatus.RegisteringVoters;  // Reset status
        emit WorkflowStatusChange(WorkflowStatus(WorkflowStatus.VotesTallied),status);  // Raise the event to log the status change 

        winningProposalId = 0;                      // Reset winning ID

        // Reset proposal table
        uint proposalsTabSize=proposals.length;
        for (uint i=proposalsTabSize; i>0; i--){
            proposals.pop();
        }

        // Reset voters mapping
        uint whiteListSize=whitelist.length;
        address  tempAddress;
        for (uint i=whiteListSize; i>0; i--){
            tempAddress=whitelist[i-1];
            voters[tempAddress] = Voter(false,false,0); 
            whitelist.pop();
        }

        addVoter(msg.sender);   // Re-add admin as a voter
    }

}