// SPDX-License-Identifier: GPL-3.0

pragma solidity 0.8.12;

contract HelloWorld {
    string myString = "Hello World!";

    function hello() public view returns (string memory) {
        return myString;
    }
}