// Import libraries
import React from 'react';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

// Import components
import AddVoter from "./AddVoter.js";

import "../App.css";

export default class AdminDashboard extends React.Component {

    constructor(props) {
        super(props);
    }

    getNewVoter = async (adr) => {
        this.props.getNewVoter(adr);
        };

    adminEvent = async () => {
        this.props.adminEvent();
        };

    render(){
        if(this.props.own){
            return(
                <div style={{display: 'flex', justifyContent: 'center'}}>
                <Card style={{ width: '50rem' }}>
                    <Card.Header><h3>ADMIN DASHBOARD</h3></Card.Header>
                    <Card.Body>
                        <AddVoter 
                        state={this.props.state} 
                        getNewVoter={this.getNewVoter}
                        />
                    </Card.Body>
                    <Card.Footer>
                        <Button onClick={this.adminEvent} variant="primary">{this.props.state >=5 ? 'Reset' : 'Next Step'}</Button>
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