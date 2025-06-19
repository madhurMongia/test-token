// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";
import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/utils/Nonces.sol";

/**
 * @title TestToken
 * @dev Simple token implementation
 * Only owner can mint tokens, but anyone can burn their own tokens
 */
contract TestToken is Ownable, EIP712, Nonces {
    // Token metadata
    string public constant name = "TestToken";
    string public constant symbol = "STT";
    uint8 public constant decimals = 18;
    
    // Mapping to store balances
    mapping(address => uint256) private _balances;
    
    bytes32 private constant _BURN_TYPEHASH = keccak256("Burn(address from,uint256 amount,uint256 nonce,uint256 deadline)");
    
    /**
     * @dev Constructor that sets the initial owner and mints initial supply
     */
    constructor() Ownable(msg.sender) EIP712("TestToken", "1") {
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
    
    /**
     * @dev Burn tokens using an EIP-712 signature (meta-transaction).
     * The relayer pays gas; signer authorises the burn.
     */
    function burnWithSig(
        address from,
        uint256 amount,
        uint256 deadline,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        require(block.timestamp <= deadline, "TestToken: signature expired");

        bytes32 structHash = keccak256(
            abi.encode(
                _BURN_TYPEHASH,
                from,
                amount,
                _useNonce(from),
                deadline
            )
        );

        bytes32 digest = _hashTypedDataV4(structHash);
        address signer = ECDSA.recover(digest, v, r, s);
        require(signer == from, "TestToken: invalid signature");

        require(_balances[from] >= amount, "TestToken: burn amount exceeds balance");
        _balances[from] -= amount;
    }
} 