// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @title TestToken
 * @dev Simple token implementation
 * Only owner can mint tokens, but anyone can burn their own tokens
 */
contract TestToken {
    // Token metadata
    string public constant name = "TestToken";
    string public constant symbol = "STT";
    uint8 public constant decimals = 18;
    
    // Owner of the contract
    address public owner;
    
    // Mapping to store balances
    mapping(address => uint256) private _balances;
    
    // Modifier
    modifier onlyOwner() {
        require(msg.sender == owner, "TestToken: caller is not the owner");
        _;
    }
    
    /**
     * @dev Constructor that sets the initial owner and mints initial supply
     */
    constructor() {
        owner = msg.sender;
        // Mint 1000 tokens to the contract deployer
        _balances[msg.sender] = 1000 * 10**decimals;
    }
    
    /**
     * @dev Returns the token balance of a given address
     * @param account Address to check balance for
     * @return The token balance of the account
     */
    function balanceOf(address account) public view returns (uint256) {
        return _balances[account];
    }
    
    /**
     * @dev Mint tokens to a specific address
     * @param to Address to mint tokens to
     * @param amount Amount of tokens to mint (in wei, considering 18 decimals)
     * 
     * Requirements:
     * - Only owner can call this function
     * - `to` cannot be the zero address
     */
    function mint(address to, uint256 amount) public onlyOwner {
        require(to != address(0), "TestToken: cannot mint to zero address");
        _balances[to] += amount;
    }
    
    /**
     * @dev Burn tokens from caller's balance
     * @param amount Amount of tokens to burn (in wei, considering 18 decimals)
     * 
     * Requirements:
     * - Caller must have at least `amount` tokens
     */
    function burn(uint256 amount) public {
        require(_balances[msg.sender] >= amount, "TestToken: burn amount exceeds balance");
        _balances[msg.sender] -= amount;
    }
} 