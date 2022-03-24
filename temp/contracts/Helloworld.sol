// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract HelloWorld {
    
    // Define a string variable
    string public name;
    
    // Modifies the value of string variable (name)
    function inputUser(string memory _name) public {
        name = _name;
    }
    
    // Validated that the string variable (name) holds the updated value
    function dispUser() public view returns(string memory){
        return string(abi.encodePacked("Hello world! My name is ",' ',name));
    }

    // A public function that accepts a string argument
    // and updates the `message` storage variable.
    function update(string memory newMessage) public {
        name = newMessage;
    }
}
