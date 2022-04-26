// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.13;

import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

/// @title A decentralized voting system
/// @author Sébastien Dupertuis
/// @notice V2, Topic of the third project for Alyra school. The V2 takes into account the good practices and comments from the first correction.
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

    /// @notice Variable to contain the current status. V2: changed to public (was private)
    WorkflowStatus public workflowStatus;
    /// @notice Mapping of voters
    mapping (address => Voter) voters;
    /// @notice Table of voters addresses (used to reset the voting)
    address[] private _whitelist;
    /// @notice Table of proposals
    Proposal[] private _proposals;
    /// @notice Variable containing the winning proposal ID
    uint private _winningProposalId;

    //------------------------------------------------------------------------------------
    // ------------------------------------Events-----------------------------------------
    //------------------------------------------------------------------------------------

    /// @notice Event raised when a new voter has registered
    event VoterRegistered(address _voterAddress);
    /// @notice Event raised when the admin modified the current status of the voting procedure
    event WorkflowStatusChange(WorkflowStatus _previousStatus, WorkflowStatus _newStatus);
    /// @notice Event raised when a voter registered a proposal
    event ProposalRegistered(uint _proposalId);
    /// @notice Event raised when voter has voted
    event Voted (address _voter, uint _proposalId);
 
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
        require(workflowStatus != WorkflowStatus.VotesTallied, "The voting has already ended.");    // Make sure the voting is not finished
        
        uint _oldStatusID = uint(workflowStatus);           // Save the current status as old status
        workflowStatus = WorkflowStatus(_oldStatusID+1);    // Update the status 
    
        emit WorkflowStatusChange(WorkflowStatus(_oldStatusID),workflowStatus);  // Raise the event to log the status change 
    }

    /// @notice This function allows the owner to add a voter in the whitelist
    /// @dev Function to be called by the admin through the front end
    /// @param _address The address to be added in the whitelist
    function addVoter(address _address) public onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters,"The registering period is over.");      // Make sure the registration phase is still in progress
        require(_address != address(0),"The address needs to be different from zero.");             // Make sure the address is valid
        require(voters[_address].isRegistered == false,"This voter has been already registered.");   // Revert if the voter was already registered (to aboid unnecessary actions)

        // Add the voter in the whitelist (mapping and array)
        //voters[_address] = Voter(true,false,0); // V2: correction to not assign the values that are already equal to 0 by default.
        voters[_address].isRegistered = true;
        _whitelist.push(_address);

        emit VoterRegistered(_address);  // Raise the event to log the new voter registration 
    }

    /// @notice This function allows the voters to place a proposal
    /// @dev Function to be called by the voters through the front end
    /// @param _description The description of the proposal
    function addProposal(string memory _description) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted,"The proposal registering period is over or has not started yet.");      // Make sure the proposal registration phase is in progress
    
        // Push the new proposal in the array
        Proposal memory proposal = Proposal(_description, 0);
        _proposals.push(proposal);

        emit ProposalRegistered(_proposals.length-1);  // Raise the event to log the new proposal registration 
    }

    /// @notice This function allows the voters to vote for a single proposal. V2: calculate live the winning proposal (to avoid the for loop and then the DoS)
    /// @dev Function to be called by the voters through the front end
    /// @param _proposalID The proposal ID that receive a vote
    function setVote(uint _proposalID) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted,"The proposal voting period is over or has not started yet.");      // Make sure the voting phase is in progress
        require(voters[msg.sender].hasVoted == false,"This voter has already voted.");   // Revert if the voter has already voted
        require(_proposalID <= _proposals.length-1,"The proposal ID is not valid.");

        _proposals[_proposalID].voteCount += 1;  // Increment the vote count of the given proposal

        voters[msg.sender].hasVoted = true;                 // This voter has now voted
        voters[msg.sender].votedProposalId = _proposalID;   // Save the choice of the voter

        // 
        if(_proposals[_proposalID].voteCount > _proposals[_winningProposalId].voteCount) {
            _winningProposalId = _proposalID;
        }

        emit Voted(msg.sender,_proposalID);  // Raise the event to log vote and voter address
    }

    /// @notice This function used to calculate the voting result. V2: removed in order to avoid a DoS - Gas Limit
    /// @dev Function to be called by the admin through the front end
    /*function calculateResult() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded,"The voting is still in progress or has not started yet.");        // Make sure the voting is finished
        require(_proposals.length > 0,"There are no proposals in the list.");                            // Make sure there is at least one proposal in the list

        for(uint i=1;i<_proposals.length;i++) {
            if(_proposals[i].voteCount > _proposals[_winningProposalId].voteCount) {
                _winningProposalId = i;
            }
        }
    }*/

    /// @notice This function returns the voting result. The result is opened to anyone
    /// @dev Function to be called by anyone through the front end
    /// @return Returns the winning proposal ID, his description and the amount of votes
    function getWinner() external view returns (uint,string memory,uint) {
        require(workflowStatus == WorkflowStatus.VotesTallied,"The voting is still in progress.");      // Make sure the voting is finished

        return (_winningProposalId,_proposals[_winningProposalId].description,_proposals[_winningProposalId].voteCount);
    }

/*
    /// @notice This function allows the voters to see what the other voters have voted. V2: code optimization, this function is not needed anymore
    /// @dev Function to be called by the voters through the front end
    /// @param _address The address to check the vote
    /// @return Returns the voted ID of the given voter defined by _address
    function getVotedID(address _address) external view onlyVoters returns (uint) {
        require(workflowStatus >= WorkflowStatus.VotingSessionStarted,"The voting period did not start yet.");      // Make sure the voting phase has started
        require(_address != address(0),"The address needs to be different from zero.");             // Make sure the address is valid
        require(voters[_address].isRegistered == true,"This address does not belong to the whitelist.");
        require(voters[_address].hasVoted == true,"This voter has not voted yet.");   // Revert if the voter has not voted yet
    
        return voters[_address].votedProposalId;    // Return the vote of the requested voter
    }*/

    /// @notice This function resets the voting once closed
    /// @dev Function to be called by the admin through the front end
    function reset() external onlyOwner{
        require(workflowStatus == WorkflowStatus.VotesTallied, "The voting is still ongoing.");    // Make sure the voting is finished

        workflowStatus = WorkflowStatus.RegisteringVoters;  // Reset status
        emit WorkflowStatusChange(WorkflowStatus(WorkflowStatus.VotesTallied),workflowStatus);  // Raise the event to log the status change 

        _winningProposalId = 0;                      // Reset winning ID

        // Reset proposal table
        uint proposalsTabSize=_proposals.length;
        for (uint i=proposalsTabSize; i>0; i--){
            _proposals.pop();
        }

        // Reset voters mapping
        uint whiteListSize=_whitelist.length;
        address  tempAddress;
        for (uint i=whiteListSize; i>0; i--){
            tempAddress=_whitelist[i-1];
            voters[tempAddress] = Voter(false,false,0); 
            _whitelist.pop();
        }

        addVoter(msg.sender);   // Re-add admin as a voter
    }

    /// @notice This function allows the voters to see what the other voters have voted
    /// @dev Function to be called by the owner through the front end
    /// @param _address The address to become the new owner
    function changeOwner(address _address) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters,"The registering period is over.");      // Make sure the registration phase is still in progress
        require(_address != address(0),"The address needs to be different from zero.");             // Make sure the address is valid
        
        voters[msg.sender].isRegistered == false ;      // Remove the rights to the old owner (the new one can still add him, in case)
        _whitelist[0] = _address;                        // Replace the old admin by the new one in the whitelist table
        voters[_address].isRegistered == true ; 

        emit VoterRegistered(_address);                 // Raise the event to log the new voter registration 

        transferOwnership(_address);                    // Call the function to effectively change the owner
    }

    // ::::::::::::: V2: NEW GETTERS to help with the creation of the DApp::::::::::::: //

    /// @notice This function returns a list of registered voters, only for the voters
    /// @dev Function to be called by the voters through the front end
    /// @return Returns a list of addresses
    function getWhiteList() external onlyVoters view returns(address[] memory){
       return _whitelist;
    }

    function getVoter(address _address) external onlyVoters view returns (Voter memory) {
        require(_address != address(0),"The address needs to be different from zero.");             // Make sure the address is valid

        return voters[_address];
    }

    /// @notice This function returns a list of registered voters, only for the voters
    /// @dev Function to be called by the voters through the front end
    /// @return Returns a list of addresses
    function getProposals() external onlyVoters view returns(Proposal[] memory){
        require(workflowStatus >= WorkflowStatus.ProposalsRegistrationStarted,"The proposal registering period has not started yet.");      // Make sure the proposal registration phase has started
       
        return _proposals;
    }
}
