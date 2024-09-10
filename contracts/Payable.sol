// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Payable {
  address public owner;

  constructor() payable {
    owner = msg.sender;
  }

  function getContractBalance() public view returns (uint256) {
    return address(this).balance;
  }

  function withdraw(uint256 amount) public {
    require(msg.sender == owner, "Only the owner can withdraw Ether");
    require(address(this).balance >= amount, "Insufficient balance");

    (bool sent, ) = owner.call{value: amount}("");
    require(sent, "Failed to send Ether");
  }

  receive() external payable {}
}
