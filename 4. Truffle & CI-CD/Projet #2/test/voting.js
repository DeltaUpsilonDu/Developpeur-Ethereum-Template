const voting = artifacts.require("./voting.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('voting', accounts => {
    const owner = accounts[0];
    const voter1 = accounts[1];
    const voter2 = accounts[2];
    const voter3 = accounts[3];
    const voter4 = accounts[4];

    let votingInstance;

    describe("Status management test", function () {
        describe("startProposalsRegistering function test", function () {
            beforeEach(async function () {
                votingInstance = await voting.new({from:owner});
            });

            it("should revert when the caller is different than the owner.", async () => {
                await expectRevert(votingInstance.startProposalsRegistering.call({ from: voter1 }), 'Ownable: caller is not the owner');
            });

            it("should revert when current status is ProposalsRegistrationStarted (1).", async () => {
                votingInstance.workflowStatus = 1;
                await expectRevert(votingInstance.startProposalsRegistering.call({ from: owner }), 'Registering proposals cant be started now');
            });

            it("should revert when current status is ProposalsRegistrationEnded (2).", async () => {
                votingInstance.workflowStatus = 2;
                await expectRevert(votingInstance.startProposalsRegistering.call({ from: owner }), 'Registering proposals cant be started now');
            });

            it("should revert when current status is VotingSessionStarted (3).", async () => {
                votingInstance.workflowStatus = 3;
                await expectRevert(votingInstance.startProposalsRegistering.call({ from: owner }), 'Registering proposals cant be started now');
            });

            it("should revert when current status is VotingSessionEnded (4).", async () => {
                votingInstance.workflowStatus = 4;
                await expectRevert(votingInstance.startProposalsRegistering.call({ from: owner }), 'Registering proposals cant be started now');
            });

            it("should revert when current status is VotesTallied (5).", async () => {
                votingInstance.workflowStatus = 5;
                await expectRevert(votingInstance.startProposalsRegistering.call({ from: owner }), 'Registering proposals cant be started now');
            });

            it("should change the current status to ProposalsRegistrationStarted (1).", async () => {
                await votingInstance.startProposalsRegistering.call({ from: owner });
                expect(new BN(votingInstance.workflowStatus)).to.be.bignumber.equal(new BN(1));
            });

            it("should raise an event giving the previous and the new status", async () => {
                const findEvent = await votingInstance.startProposalsRegistering.call({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange" ,{previousStatus: new BN(0), newStatus: new BN(1)});
            });
        });

        describe("endProposalsRegistering function test", function () {
            beforeEach(async function () {
                votingInstance = await voting.new({from:owner});
            });

            it("should revert when the caller is different than the owner.", async () => {
                await expectRevert(votingInstance.endProposalsRegistering.call({ from: voter1 }), 'Ownable: caller is not the owner');
            });

            it("should revert when current status is RegisteringVoters (0).", async () => {
                await expectRevert(votingInstance.endProposalsRegistering.call({ from: owner }), 'Registering proposals havent started yet');
            });

            it("should revert when current status is ProposalsRegistrationEnded (2).", async () => {
                votingInstance.workflowStatus = 2;
                await expectRevert(votingInstance.endProposalsRegistering.call({ from: owner }), 'Registering proposals havent started yet');
            });

            it("should revert when current status is VotingSessionStarted (3).", async () => {
                votingInstance.workflowStatus = 3;
                await expectRevert(votingInstance.endProposalsRegistering.call({ from: owner }), 'Registering proposals havent started yet');
            });

            it("should revert when current status is VotingSessionEnded (4).", async () => {
                votingInstance.workflowStatus = 4;
                await expectRevert(votingInstance.endProposalsRegistering.call({ from: owner }), 'Registering proposals havent started yet');
            });

            it("should revert when current status is VotesTallied (5).", async () => {
                votingInstance.workflowStatus = 5;
                await expectRevert(votingInstance.endProposalsRegistering.call({ from: owner }), 'Registering proposals havent started yet');
            });

            it("should change the current status to ProposalsRegistrationEnded (2).", async () => {
                await votingInstance.endProposalsRegistering.call({ from: owner });
                expect(new BN(votingInstance.workflowStatus)).to.be.bignumber.equal(new BN(2));
            });

            it("should raise an event giving the previous and the new status", async () => {
                const findEvent = await votingInstance.endProposalsRegistering.call({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange" ,{previousStatus: new BN(1), newStatus: new BN(2)});
            });
        });

        describe("startVotingSession function test", function () {
            beforeEach(async function () {
                votingInstance = await voting.new({from:owner});
            });

            it("should revert when the caller is different than the owner.", async () => {
                await expectRevert(votingInstance.startVotingSession.call({ from: voter1 }), 'Ownable: caller is not the owner');
            });

            it("should revert when current status is RegisteringVoters (0).", async () => {
                await expectRevert(votingInstance.startVotingSession.call({ from: owner }), 'Registering proposals phase is not finished');
            });

            it("should revert when current status is ProposalsRegistrationStarted (1).", async () => {
                votingInstance.workflowStatus = 1;
                await expectRevert(votingInstance.startVotingSession.call({ from: owner }), 'Registering proposals phase is not finished');
            });

            it("should revert when current status is VotingSessionStarted (3).", async () => {
                votingInstance.workflowStatus = 3;
                await expectRevert(votingInstance.startVotingSession.call({ from: owner }), 'Registering proposals phase is not finished');
            });

            it("should revert when current status is VotingSessionEnded (4).", async () => {
                votingInstance.workflowStatus = 4;
                await expectRevert(votingInstance.startVotingSession.call({ from: owner }), 'Registering proposals phase is not finished');
            });

            it("should revert when current status is VotesTallied (5).", async () => {
                votingInstance.workflowStatus = 5;
                await expectRevert(votingInstance.startVotingSession.call({ from: owner }), 'Registering proposals phase is not finished');
            });

            it("should change the current status to VotingSessionStarted (3).", async () => {
                await votingInstance.startVotingSession.call({ from: owner });
                expect(new BN(votingInstance.workflowStatus)).to.be.bignumber.equal(new BN(3));
            });

            it("should raise an event giving the previous and the new status", async () => {
                const findEvent = await votingInstance.startVotingSession.call({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange" ,{previousStatus: new BN(2), newStatus: new BN(3)});
            });
        });

        describe("endVotingSession function test", function () {
            beforeEach(async function () {
                votingInstance = await voting.new({from:owner});
            });

            it("should revert when the caller is different than the owner.", async () => {
                await expectRevert(votingInstance.endVotingSession.call({ from: voter1 }), 'Ownable: caller is not the owner');
            });

            it("should revert when current status is RegisteringVoters (0).", async () => {
                await expectRevert(votingInstance.endVotingSession.call({ from: owner }), 'Voting session havent started yet');
            });

            it("should revert when current status is ProposalsRegistrationStarted (1).", async () => {
                votingInstance.workflowStatus = 1;
                await expectRevert(votingInstance.endVotingSession.call({ from: owner }), 'Voting session havent started yet');
            });

            it("should revert when current status is ProposalsRegistrationEnded (2).", async () => {
                votingInstance.workflowStatus = 2;
                await expectRevert(votingInstance.endVotingSession.call({ from: owner }), 'Voting session havent started yet');
            });

            it("should revert when current status is VotingSessionEnded (4).", async () => {
                votingInstance.workflowStatus = 4;
                await expectRevert(votingInstance.endVotingSession.call({ from: owner }), 'Voting session havent started yet');
            });

            it("should revert when current status is VotesTallied (5).", async () => {
                votingInstance.workflowStatus = 5;
                await expectRevert(votingInstance.endVotingSession.call({ from: owner }), 'Voting session havent started yet');
            });

            it("should change the current status to VotingSessionEnded (4).", async () => {
                await votingInstance.endVotingSession.call({ from: owner });
                expect(new BN(votingInstance.workflowStatus)).to.be.bignumber.equal(new BN(4));
            });

            it("should raise an event giving the previous and the new status", async () => {
                const findEvent = await votingInstance.endVotingSession.call({ from: owner });
                expectEvent(findEvent,"WorkflowStatusChange" ,{previousStatus: new BN(3), newStatus: new BN(4)});
            });
        });

    });
    
    describe("Voters registration tests", function () {
        before(async function () {
            votingInstance = await voting.new({from:owner});
        });

        it("should revert when the caller is different than the owner.", async () => {
            await expectRevert(votingInstance.addVoter(voter2,{ from: voter1 }), 'Ownable: caller is not the owner');
        });

        it("should revert when current status is ProposalsRegistrationStarted (1).", async () => {
            votingInstance.workflowStatus = 1;
            await expectRevert(votingInstance.addVoter(voter1,{ from: owner }), 'Voters registration is not open yet');
        });

        it("should revert when current status is ProposalsRegistrationEnded (2).", async () => {
            votingInstance.workflowStatus = 2;
            await expectRevert(votingInstance.addVoter(voter1,{ from: owner }), 'Voters registration is not open yet');
        });

        it("should revert when current status is VotingSessionStarted (3).", async () => {
            votingInstance.workflowStatus = 3;
            await expectRevert(votingInstance.addVoter(voter1,{ from: owner }), 'Voters registration is not open yet');
        });

        it("should revert when current status is VotingSessionEnded (4).", async () => {
            votingInstance.workflowStatus = 4;
            await expectRevert(votingInstance.addVoter(voter1,{ from: owner }), 'Voters registration is not open yet');
        });

        it("should revert when current status is VotesTallied (5).", async () => {
            votingInstance.workflowStatus = 5;
            await expectRevert(votingInstance.addVoter(voter1,{ from: owner }), 'Voters registration is not open yet');
        });

        it("should register the new voter.", async () => {
            votingInstance.workflowStatus = 0;
            await votingInstance.addVoter(voter3,{ from: owner });
            const newVoter = await votingInstance.getVoter(voter3,{ from: voter3 });
            expect(newVoter.isRegistered).to.be.true;
        });

        it("should revert when a voter was already registered.", async () => {
            await expectRevert(votingInstance.addVoter(voter3,{ from: owner }), 'Already registered');
        });

        it("should raise an event returning the new registered address", async () => {
            const findEvent = await votingInstance.addVoter(voter4,{ from: owner });
            expectEvent(findEvent,"VoterRegistered" ,{voterAddress: voter4});
        });        
    });

    describe("Voter and proposal getters tests", function () {
        before(async function () {
            votingInstance = await voting.new({from:owner});
            await votingInstance.addVoter(voter1,{ from: owner });
            votingInstance.workflowStatus = 1;
            await votingInstance.addProposal("My proposal 1.",{ from: voter1 });
        });

        it("should revert when the caller is not a voter.", async () => {
            await expectRevert(votingInstance.getVoter(voter1,{ from: voter2 }), "You're not a voter");
        });

        // This test will anyway return something (mapping of address). Check if the object is a voter (through the isRegistration boolean)
        it("should return a voter object.", async () => {
            const isVoter = await votingInstance.getVoter(voter1,{ from: voter1 });
            expect(isVoter.isRegistered).to.be.true;
        });

        it("should return a voter object even if it is not registered.", async () => {
            const isVoter = await votingInstance.getVoter(voter2,{ from: voter1 });
            expect(isVoter.isRegistered).to.be.false;
        });

        it("should revert when the caller is not a voter.", async () => {
            await expectRevert(votingInstance.getOneProposal(0,{ from: voter2 }), "You're not a voter");
        });

        it("should return a proposal object when the id is in the correct range.", async () => {
            const prop = await votingInstance.getOneProposal(0,{ from: voter1 });
            expect(prop.description).to.equal("My proposal 1.");
        });

        it("should revert when the proposal id is out of range", async () => {
            await expectRevert.unspecified(await votingInstance.getOneProposal(1,{ from: voter1 }));
        });
    });

    describe("Proposal registration test", function () {
        before(async function () {
            votingInstance = await voting.new({from:owner});
            await votingInstance.addVoter(voter1,{ from: owner });
            votingInstance.workflowStatus = 1;
        });

        it("should revert when the caller is not a voter.", async () => {
            await expectRevert(await votingInstance.addProposal("My proposal 1.",{ from: voter2 }), "You're not a voter");
        });

        it("should revert when current status is RegisteringVoters (0).", async () => {
            votingInstance.workflowStatus = 0;
            await expectRevert(votingInstance.addProposal("My proposal 1.",{ from: voter1 }), 'Proposals are not allowed yet');
        });

        it("should revert when current status is ProposalsRegistrationEnded (2).", async () => {
            votingInstance.workflowStatus = 2;
            await expectRevert(votingInstance.addProposal("My proposal 1.",{ from: voter1 }), 'Proposals are not allowed yet');
        });

        it("should revert when current status is VotingSessionStarted (3).", async () => {
            votingInstance.workflowStatus = 3;
            await expectRevert(votingInstance.addProposal("My proposal 1.",{ from: voter1 }), 'Proposals are not allowed yet');
        });

        it("should revert when current status is VotingSessionEnded (4).", async () => {
            votingInstance.workflowStatus = 4;
            await expectRevert(votingInstance.addProposal("My proposal 1.",{ from: voter1 }), 'Proposals are not allowed yet');
        });

        it("should revert when current status is VotesTallied (5).", async () => {
            votingInstance.workflowStatus = 5;
            await expectRevert(votingInstance.addProposal("My proposal 1.",{ from: voter1 }), 'Proposals are not allowed yet');
        });

        it("should revert when the proposal is empty.", async () => {
            votingInstance.workflowStatus = 1;
            await expectRevert(votingInstance.addProposal("",{ from: voter1 }), 'Vous ne pouvez pas ne rien proposer');
        });

        it("should raise an event returning the new proposal id", async () => {
            const findEvent = await votingInstance.addProposal("My proposal 1.",{ from: voter1 });
            expectEvent(findEvent,"ProposalRegistered" ,{proposalId: new BN(0)});
        }); 

    });

    describe.skip("Voting test", function () {

    });

    describe.skip("Vote tally test", function () {

    });

});
