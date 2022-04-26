// Import libraries
import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

import "../App.css";

export default class EventTable extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        if(this.props.state >=3){
            return(

                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card style={{ width: '50rem' }}>
                    <Card.Header><h4>EVENTS</h4></Card.Header>
                    <Card.Body>
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
            return(
                <ListGroup variant="flush">
                    <ListGroup.Item>
                        <Table striped bordered hover>
                            <thead>
                            <tr>
                                <th>Addresses of registered voters</th>{/*}<th>Vote ID</th>{*/}
                            </tr>
                            </thead>
                            <tbody>
                                {this.props.list !== null && this.props.list.map((a,i) => 
                                <tr>
                                    <td>{a}</td>
                                    {/*}<td>{voteIDs[i]}</td>{*/}
                                </tr>)}
                            </tbody>
                        </Table>
                    </ListGroup.Item>
                </ListGroup>
            );
          }
    }

}