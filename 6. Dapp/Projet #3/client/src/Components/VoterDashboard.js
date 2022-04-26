// Import libraries
import React from 'react';
import Card from 'react-bootstrap/Card';

// Import components
import VoterList from "./VoterList.js";
import Proposals from "./Proposals.js";

import "../App.css";

export default class VoterDashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    getNewProposal = async (proposal) => {
        this.props.getNewProposal(proposal);
    };

    getVote = async (voteID) => {
        this.props.getVote(voteID);
    };

    render(){
        if(this.props.register){
            return(
                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card style={{ width: '50rem' }}>
                    <Card.Header><h3>VOTER DASHBOARD</h3></Card.Header>
                    <Card.Body>
                        <VoterList 
                            state={this.props.state} 
                            list={this.props.list}
                        />
                        <br></br>
                        <Proposals 
                            state={this.props.state} 
                            proposal={this.props.proposal}
                            getNewProposal={this.getNewProposal}
                            vote={this.props.vote}
                            didVote={this.props.didVote}
                            getVote={this.getVote}
                        />
                    </Card.Body>
                </Card>
                </div>
                
            );
        } else {
            return (
                <p>Not a voter</p>
            );
          }
    }

}