import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import "../App.css";

export default class AddProposal extends React.Component {

    constructor(props) {
        super(props);
    }

    sendNewProposal = async () => {
        this.props.getNewProposal(document.getElementById("proposal").value);
        document.getElementById("proposal").value=" ";
        };

    render(){
        if(this.props.state == 1){
            return(
                <Form>
                    <Form.Group className="FormLabel">
                        <Form.Label>Add a proposal</Form.Label>
                        <Form.Control type="text" id="proposal"/>
                        <Button onClick={this.sendNewProposal} variant="primary">Add</Button>
                    </Form.Group>
                    
                </Form>
            );
        } else {
            return (
                <fieldset disabled>
                    <Form.Group className="FormLabel">
                        <Form.Label>Add a proposal</Form.Label>
                        <Form.Control/>
                        <Button>Add</Button>
                    </Form.Group>
                </fieldset>
            );
          }
    }

}