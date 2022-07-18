// SPDX-License-Identifier: AGPL-3.0-or-later
pragma solidity =0.8.7;

import "./interfaces/IBlocklist.sol";
import "prepo-shared-contracts/contracts/SafeOwnable.sol";

contract Blocklist is IBlocklist, SafeOwnable {
  uint256 private _resetIndex;
  mapping(uint256 => mapping(address => bool)) private _resetIndexToAccountToBlocked;

  constructor(address _nominatedOwner) {
    transferOwnership(_nominatedOwner);
  }

  function set(address[] calldata _accounts, bool[] calldata _blocked)
    external
    override
    onlyOwner
  {}

  function reset(address[] calldata _accountsToBlock) external override onlyOwner {}

  function isBlocked(address _account) external view override returns (bool) {
    return _resetIndexToAccountToBlocked[_resetIndex][_account];
  }
}