// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;

contract Whitelist {
    mapping (address => bool) whitelist;

    struct Person {
        string name;
        uint age;
    }

    event Authorized(address _address);

    /*function addPerson(string memory _name,uint _age) public {
       Person memory person = Person(_name,_age);
    }*/
    Person[] public people;

    function add(string memory _name,uint _age) public {
        Person memory person = Person(_name,_age);
        people.push(person);
    }

    function remove() public {
        people.pop();
    }

    function authorize(address _address) public {
        whitelist[_address] = true;
        emit Authorized(_address);
    } 
}