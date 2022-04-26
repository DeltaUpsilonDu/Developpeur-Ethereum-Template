// Import libraries
import React from 'react';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';
import FormCheck from 'react-bootstrap/FormCheck'
import Button from 'react-bootstrap/Button';

// Import components
import AddProposal from "./AddProposal.js";

import "../App.css";

export default class Proposals extends React.Component {
    state = { voteID:0,voteSelected:false};

    constructor(props) {
        super(props);
    }
   
    getNewProposal = async (proposal) => {
        this.props.getNewProposal(proposal);
    };

    sendVote = async (voteID) => {
        this.props.getVote(this.state.voteID);
    };

    handleChange = async (event) => {
        this.setState({ voteID: event.target.value, voteSelected:true});
    };

    render(){
        if(this.props.state == 1 || this.props.state == 2){
            return(
                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card style={{ width: '50rem' }}>
                    <Card.Header><h4>PROPOSALS</h4></Card.Header>
                    <Card.Body>
                        <AddProposal
                            state={this.props.state} 
                            getNewProposal={this.getNewProposal}
                        />
                        <br></br>
                        <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                <th>ID</th><th>List of proposals</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {this.props.proposal !== null && this.props.proposal.map((a,i) => <tr><td>{i}</td><td>{a.description}</td></tr>)}
                                </tbody>
                            </Table>
                        </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                </Card>
                </div>
            );
        } else if(this.props.state == 3 && !this.props.didVote){
            return(
                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card style={{ width: '50rem' }}>
                    <Card.Header><h4>PROPOSALS</h4></Card.Header>
                    <Card.Body>
                        <AddProposal
                            state={this.props.state} 
                            getNewProposal={this.getNewProposal}
                        />
                        <br></br>
                        <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                <th>ID</th><th>List of proposals</th><th>Proposal selection</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {this.props.proposal !== null && this.props.proposal.map((a,i) => 
                                    <tr>
                                        <td>{i}</td>
                                        <td>{a.description}</td>
                                        <td><Form.Check onChange={this.handleChange} name='group1' type='radio' id='voteSelect' aria-label='option 1' value={i}/></td>
                                    </tr>)}
                                </tbody>
                            </Table>
                        </ListGroup.Item>
                        </ListGroup>
                        <Button onClick={this.sendVote} variant="primary" disabled={!this.state.voteSelected}>Submit</Button>
                    </Card.Body>
                </Card>
                </div>
            );
        } else if((this.props.state == 3 || this.props.state == 4) && this.props.didVote){
            return(
                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card style={{ width: '50rem' }}>
                    <Card.Header><h4>PROPOSALS</h4></Card.Header>
                    <Card.Body>
                        <AddProposal
                            state={this.props.state} 
                            getNewProposal={this.getNewProposal}
                        />
                        <br></br>
                        <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                <th>ID</th><th>List of proposals</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {this.props.proposal !== null && this.props.proposal.map((a,i) => 
                                    <tr>
                                        <td>{i}</td>
                                        <td>{a.description}</td>
                                    </tr>)}
                                </tbody>
                            </Table>
                        </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    <Card.Footer>
                        <p>You have voted for proposal number {this.props.vote}</p>
                    </Card.Footer>
                </Card>
                </div>
            );
        } else {
            return (
                null
            );
          }
    }

}