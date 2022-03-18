// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;

contract Bank {
    mapping (address => uint) _balances;

    function deposit(uint _amount) public {
        require(_amount > 0,"Please deposit an amount superior to zero.");
        require(msg.sender != address(0),"Address 0 cannot deposit any value."); // On peut aussi vérifier ça (correction)
        _balances[msg.sender] += _amount;
    }

    function transfer(address payable _recipient, uint _amount) public payable{
        require(_amount > 0,"Please transfer an amount superior to zero.");
        require(_recipient != address(0),"Please define a valid address."); // On peut aussi vérifier ça (correction)
        require(_balances[msg.sender] >= _amount,"Your balance is not sufficient!");
        
        // CORRECTION
        _balances[msg.sender] -= _amount;
        _balances[_recipient] += _amount;
        
        /* Ces lignes ne sont pas nécessaires puisque l'on peut rester en interne du contrat
        //(bool sent,) = _recipient.call{value:_amount}(" "); Cette ligne est uniquement 
        //require(sent,"The transfer could not proceed.");
        */
    }

    function balanceOf(address _address) public view returns(uint) {
        return _balances[_address];
    }

}