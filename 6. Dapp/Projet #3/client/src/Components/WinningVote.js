// Import libraries
import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

// Import components

import "../App.css";

export default class WinningVote extends React.Component {
    
    constructor(props) {
        super(props);
    }
   
    render(){
        if(this.props.state == 5 ){
            return(
                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card style={{ width: '50rem' }}>
                    <Card.Header><h4>VOTE RESULT</h4></Card.Header>
                    <Card.Body>
                        <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                <th>Winning proposal</th><th>Votes count</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {<tr><td>{this.props.winningVote[1]}</td><td>{this.props.winningVote[2]}</td></tr>}
                                </tbody>
                            </Table>
                        </ListGroup.Item>
                        </ListGroup>
                        <br></br>
                        <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Addresses that have voted</th><th>Vote ID</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {this.props.eventsVoted !== null && this.props.eventsVoted.map((a) => 
                                        <tr>
                                            <td>{a.returnValues._voter}</td>
                                            <td>{a.returnValues._proposalId}</td>
                                        </tr>)}
                                </tbody>
                            </Table>
                        </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
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