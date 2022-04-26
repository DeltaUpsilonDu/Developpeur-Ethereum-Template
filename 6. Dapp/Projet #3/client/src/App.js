// Import libraries
import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import Card from 'react-bootstrap/Card';


// Import contract
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";

// Import components
import AdminDashboard from "./Components/AdminDashboard.js";
import VoterDashboard from "./Components/VoterDashboard.js";
import WinningVote from "./Components/WinningVote.js";

import "./App.css";

class App extends Component {
  state = { owned:false, registered:false, hasVoted:false, voteID:0, workFlowStatus:0, whitelist: null, proposals: null, winningVote: null, listEventsVoted: null, web3: null, accounts: null, contract: null };

  componentDidMount = async () => {
    try {
      // Get network provider and web3 instance.
      const web3 = await getWeb3();

      // Use web3 to get the user's accounts.
      const accounts = await web3.eth.getAccounts();

      // Get the contract instance.
      const networkId = await web3.eth.net.getId();
      const deployedNetwork = VotingContract.networks[networkId];

      const instance = new web3.eth.Contract(
        VotingContract.abi,
        deployedNetwork && deployedNetwork.address,
      );

      // Get the contract owner address
      const owner = await instance.methods.owner().call();
      console.log(owner);
      let owned = accounts[0]==owner;
      console.log(owned);

      // Get the voter object
      let voter = await instance.methods.getVoter(accounts[0]).call({from : owner});
      let registered = voter[0];
      let hasVoted = voter[1];
      let voteID = voter[2];
      console.log(registered);
      console.log(hasVoted);
      console.log(voteID);

      const workFlowStatus = await instance.methods.workflowStatus().call();
      console.log(workFlowStatus);

      // Get the whitelist and the proposals
      let whitelist;
      let proposals = null;
      if(registered) 
        {
          whitelist= await instance.methods.getWhiteList().call({from : accounts[0]});
          if(workFlowStatus >= 1) {proposals= await instance.methods.getProposals().call({from : accounts[0]});}
        }
      
      // Get the winning vote
      let winningVote;
      if(workFlowStatus == 5) {winningVote = await instance.methods.getWinner().call({from : accounts[0]});}
      console.log(winningVote);

      // Setup the options and get the events
      let options = {
        fromBlock: 0,              
        toBlock: 'latest'
      };
      const listEventsVoted = await instance.getPastEvents('Voted', options);

      // Set web3, accounts, and contract to the state.
      this.setState({ owned, registered, hasVoted, voteID, workFlowStatus, whitelist, proposals, winningVote, listEventsVoted, web3, accounts, contract: instance });

      window.ethereum.on('accountsChanged', () => {
        window.location.reload();
      })

    } catch (error) {
      // Catch any errors for any of the above operations.
      alert(
        `Failed to load web3, accounts, or contract. Check console for details.`,
      );
      console.error(error);
    }
  };

  addNewVoter = async (adr) => {  
    const { accounts, contract } = this.state;  
    console.log(adr);
    await contract.methods.addVoter(adr).send({from: accounts[0]});
    //window.location.reload();
    const whitelist = await contract.methods.getWhiteList().call({from : accounts[0]});
    this.setState({ whitelist: whitelist });
  };

  addNewProposal = async (proposal) => {  
    const { accounts, contract } = this.state;  
    console.log(proposal);
    await contract.methods.addProposal(proposal).send({from: accounts[0]});
    const proposals = await contract.methods.getProposals().call({from : accounts[0]});
    this.setState({ proposals: proposals });
  };

  saveVote = async (voteID) => {  
    const { accounts, contract } = this.state;  
    console.log(voteID);
    await contract.methods.setVote(voteID).send({from: accounts[0]});
    const voter = await contract.methods.getVoter(accounts[0]).call({from : accounts[0]});
    this.setState({hasVoted:voter[1], voteID:voter[2]});
  };

  nextStatus= async () => {  
    const { accounts, contract} = this.state;  
    if(this.state.workFlowStatus < 5) {
      await contract.methods.nextStatus().send({from: accounts[0]});

      // Get the winning vote
      if(this.state.workFlowStatus == 4) {
        let winningVote;
        winningVote = await contract.methods.getWinner().call({from : accounts[0]});
        this.setState({ winningVote: winningVote});
        console.log("Check winner");
      }
     
    } else {
      await contract.methods.reset().send({from: accounts[0]});
      console.log("Reset requested");
      // Refresh the whitelist and the proposals
      const whitelist = await contract.methods.getWhiteList().call({from : accounts[0]});
      const proposals = null;
      this.setState({whitelist: whitelist ,proposals: proposals});
      //window.location.reload();
    }
    const workFlowStatus = await contract.methods.workflowStatus().call();
    this.setState({ workFlowStatus: workFlowStatus});
    console.log(workFlowStatus);
  };
 
  render() {
    const statusText = ["Voters registration", "Proposals registration", "End of proposal registration", "Voting session", "End of voting session", "Votes tallied"];
    if (!this.state.web3) {
      return <div>Loading Web3, accounts, and contract...</div>;
    }
    return (
      <div className="App">
        <div className="Account">Connected wallet: {this.state.accounts[0]}</div>
        <br></br>
       <div style={{display: 'flex', justifyContent: 'center'}}>
        <Card style={{ width: '50rem' }}>
            <Card.Header><h1>VOTING PROJECT #3</h1><p>{statusText[this.state.workFlowStatus]}</p></Card.Header>
            <Card.Body>
              <AdminDashboard 
                own={this.state.owned} 
                state={this.state.workFlowStatus} 
                getNewVoter={this.addNewVoter}
                adminEvent={this.nextStatus}
              />
              <br></br>
              <VoterDashboard 
                register={this.state.registered} 
                vote={this.state.voteID}
                didVote={this.state.hasVoted}
                state={this.state.workFlowStatus} 
                list={this.state.whitelist}
                proposal={this.state.proposals}
                getNewProposal={this.addNewProposal}
                getVote={this.saveVote}
              />
              <WinningVote 
                state={this.state.workFlowStatus} 
                winningVote={this.state.winningVote}
                eventsVoted={this.state.listEventsVoted} 
              />
            </Card.Body>
          </Card>
      </div>
      </div>
    );
  }
}

export default App;
