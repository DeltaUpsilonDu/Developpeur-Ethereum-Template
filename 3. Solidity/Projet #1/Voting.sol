// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title A decentralized voting system
/// @author Sébastien Dupertuis
/// @notice 
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

    WorkflowStatus private status;
    mapping (address => Voter) voters;
    address[] private whitelist;
    Proposal[] public proposals;


    //------------------------------------------------------------------------------------
    // ------------------------------------Events-----------------------------------------
    //------------------------------------------------------------------------------------

    /// @notice Event raised when a new voter has registered*********************************************
    event VoterRegistered(address voterAddress);
    /// @notice Event raised when the admin modified the current status of the voting procedure
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    /// @notice Event raised when a voter registered a proposal
    event ProposalRegistered(uint proposalId);
    /// @notice Event raised when voter has voted
    event Voted (address voter, uint proposalId);

    // Constructor
    // Modifier
    // Functions

    /// @notice This funciton allows the owner to add a voter in the whitelist
    /// @dev 
    /// @param _address The address to be added in the whitelist
    function addVoter(address _address) external onlyOwner {
        require(_address != address(0),"The address needs to be different from zero.");             // Make sure the address is valid
        require(status == WorkflowStatus.RegisteringVoters,"The registering period is over.");      // Make sure the registration phase is still in progress
        require(voters[_address].isRegistered == false,"This voter has been already registered");   // Revert if the voter was already registered (to aboid unnecessary actions)

        voters[_address] = Voter(true,false,0);
        whitelist.push(_address);
    }




    function changeStatus(WorkflowStatus _status) public onlyOwner {
        status = _status;
    }

    function getCurrentStatus() public view onlyOwner returns (WorkflowStatus) {
        return status;
    }
}