import React from 'react';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';

import "../App.css";

export default class AddVoter extends React.Component {

    constructor(props) {
        super(props);
    }

    sendNewVOter = async () => {
        this.props.getNewVoter(document.getElementById("voterAddress").value);
        document.getElementById("voterAddress").value=" ";
        };


    render(){
        if(this.props.state == 0){
            return(
                <Form>
                    <Form.Group className="FormLabel">
                        <Form.Label>Add a voter</Form.Label>
                        <Form.Control type="text" id="voterAddress"/>
                        <Button onClick={this.sendNewVOter} variant="primary">Add</Button>
                    </Form.Group>
                    
                </Form>
            );
        } else {
            return (
                <fieldset disabled>
                    <Form.Group className="FormLabel">
                        <Form.Label>Add a voter</Form.Label>
                        <Form.Control/>
                        <Button>Add</Button>
                    </Form.Group>
                </fieldset>
            );
          }
    }

}