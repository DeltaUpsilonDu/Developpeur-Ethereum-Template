// Import libraries
import React from 'react';
import Card from 'react-bootstrap/Card';
import ListGroup from 'react-bootstrap/ListGroup';
import Table from 'react-bootstrap/Table';

import "../App.css";

export default class VoterList extends React.Component {

    constructor(props) {
        super(props);
    }

    render(){
        if(this.props.state < 5){
            return(

                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card style={{ width: '50rem' }}>
                    <Card.Header><h4>VOTERS</h4></Card.Header>
                    <Card.Body>
                        <ListGroup variant="flush">
                        <ListGroup.Item>
                            <Table striped bordered hover>
                                <thead>
                                <tr>
                                    <th>Addresses of registered voters</th>
                                </tr>
                                </thead>
                                <tbody>
                                    {this.props.list !== null && this.props.list.map((a) => <tr><td>{a}</td></tr>)}
                                </tbody>
                            </Table>
                        </ListGroup.Item>
                        </ListGroup>
                    </Card.Body>
                    <Card.Footer><p>There are {this.props.list.length} voter(s) registered.</p></Card.Footer>
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