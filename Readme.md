# TestToken - Meta-Transaction Burn Implementation

A complete implementation of an ERC-20-like token with gasless burning functionality using EIP-712 meta-transactions.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │  Smart Contract │
│   (Browser)     │◄──►│   (Express.js)  │◄──►│   (Solidity)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

- **Smart Contract**: TestToken with mint/burn + meta-transaction burn
- **Backend API**: Express.js server with ethers.js integration
- **Frontend**: Simple HTML/JS interface for testing

## Features

- ✅ **Token Operations**: Mint (owner only), Burn (token holders)
- ✅ **Meta-Transactions**: Gasless burning via EIP-712 signatures
- ✅ **Access Control**: OpenZeppelin Ownable integration
- ✅ **RESTful API**: Express.js backend with comprehensive endpoints
- ✅ **Frontend Interface**: Browser-based testing interface
- ✅ **Request Logging**: Detailed server-side request/response logging

---

## 🚀 Deployment Guide

### 1. Contract Deployment

#### Prerequisites
```bash
cd contract/
npm install
```

#### Local Development (Hardhat Network)
```bash
# Terminal 1: Start local blockchain
npx hardhat node

# Terminal 2: Deploy contract
npx hardhat run scripts/deploy.ts --network localhost
```

#### Testnet Deployment (Sepolia)
```bash
# Set environment variables
cp .env.example .env
# Edit .env with your PRIVATE_KEY and RPC_URL

# Deploy to Sepolia
npx hardhat run scripts/deploy.ts --network sepolia
```

#### Save Deployment Info
After deployment, note the contract address from the output:
```
TestToken deployed to: 0xYourContractAddress
```

### 2. Backend Setup

#### Install Dependencies
```bash
cd server/
npm install
```

#### Configuration
```bash
# Copy environment template
cp .env.example .env

# Edit .env file with your values:
RPC_URL=http://127.0.0.1:8545                    # Local or testnet RPC
CONTRACT_ADDRESS=0xYourContractAddressFromStep1   # From contract deployment
PRIVATE_KEY=0xYourPrivateKey                      # Owner wallet private key
PORT=4000                                         # API server port
```

#### Start Backend Server
```bash
# Development mode (auto-restart)
npm run dev

# Production mode
npm start
```

**Expected Output:**
```
🚀 TestToken API Server running on port 4000
📊 Health check: http://localhost:4000/health
🔗 Contract: 0xYourContractAddress
👤 Owner: 0xYourOwnerAddress
```

### 3. Frontend Setup

#### Update Configuration
Edit `frontend/index.html` and update the contract address:
```javascript
const contractAddress = '0xYourContractAddressFromStep1';
```

#### Serve Frontend
```bash
# Option 1: Simple HTTP server (Python)
cd frontend/
python3 -m http.server 8080

# Option 2: Node.js serve
npx serve frontend/

# Option 3: Just open in browser
open frontend/index.html
```

#### Access Frontend
Open browser to: `http://localhost:8080`

---

## 📋 Testing the Complete Flow

### 1. Test Backend API (curl)

#### Mint tokens to a user:
```bash
curl -X POST http://localhost:4000/api/mint \
  -H "Content-Type: application/json" \
  -d '{"to": "0x40D58d09e83342c6a5Ea7ce84D47617B35dC6e5E", "amount": 50}'
```

#### Check balance:
```bash
curl http://localhost:4000/api/balance/0x40D58d09e83342c6a5Ea7ce84D47617B35dC6e5E
```

### 2. Test Frontend Interface

1. **Connect Wallet**: Click "Connect Wallet" → MetaMask popup
2. **Check Balance**: Should show your token balance
3. **Set Deadline**: Click "Set Deadline (+1 hour)"
4. **Enter Amount**: Type amount to burn (e.g., "10")
5. **Sign & Send**: Click button → MetaMask signature → Backend call

### 3. Verify Transaction

Check the server logs for request details:
```
[2024-01-15T10:30:15.123Z] POST /api/burn - IP: 127.0.0.1
[2024-01-15T10:30:15.123Z] Request Body: {
  "from": "0x742d35Cc...",
  "amount": "10",
  "deadline": 1705312215,
  "v": 28,
  "r": "0x1234567890...",
  "s": "0xabcdef1234..."
}
[2024-01-15T10:30:15.456Z] Response: 200 OK
[2024-01-15T10:30:15.456Z] Response Body: {"message":"Tokens burned successfully","transactionHash":"0x..."}
```

---

## 🔧 API Endpoints

### Health Check
```bash
GET /health
```

### Token Operations
```bash
# Get balance
GET /api/balance/:address

# Mint tokens (owner only)
POST /api/mint
{
  "to": "0xRecipientAddress",
  "amount": 50
}

# Burn tokens (meta-transaction)
POST /api/burn  
{
  "from": "0xUserAddress",
  "amount": "10",
  "deadline": 1705312215,
  "v": 28,
  "r": "0x...",
  "s": "0x..."
}
```

---

## 🧪 Running Tests

### Contract Tests
```bash
cd contract/
npm test
```

### Test Coverage
```bash
cd contract/
npm run coverage
```

---

## 🔐 Meta-Transaction Flow

The gasless burn process works as follows:

1. **User Signs**: Creates EIP-712 signature authorizing burn
2. **Frontend Submits**: Sends signature to backend API
3. **Backend Relays**: Calls `burnWithSig()` paying gas fees
4. **Contract Verifies**: Validates signature and burns user's tokens

### EIP-712 Signature Structure
```javascript
const domain = {
  name: "TestToken",
  version: "1", 
  chainId: 31337,
  verifyingContract: "0xContractAddress"
};

const types = {
  Burn: [
    { name: "from", type: "address" },
    { name: "amount", type: "uint256" },
    { name: "nonce", type: "uint256" },
    { name: "deadline", type: "uint256" }
  ]
};
```

---

## 🛠️ Development Commands

### Contract Development
```bash
cd contract/
npm run compile     # Compile contracts
npm run test        # Run tests
npm run coverage    # Test coverage
npm run clean       # Clean artifacts
```

### Backend Development  
```bash
cd server/
npm run dev         # Development server
npm run build       # Build TypeScript
npm start           # Production server
```

---

## 📁 Project Structure

```
test-token/
├── contract/                 # Smart contracts
│   ├── contracts/
│   │   └── TestToken.sol    # Main token contract
│   ├── test/                # Contract tests
│   ├── scripts/             # Deployment scripts
│   └── hardhat.config.ts    # Hardhat configuration
├── server/                  # Backend API
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── routes/          # Express routes
│   │   ├── middleware/      # Custom middleware
│   │   └── blockchain.ts    # Ethereum integration
│   └── package.json
├── frontend/                # Frontend interface
│   └── index.html          # Single-page application
└── README.md               # This file
```

---

## 🔒 Security Considerations

- **Private Keys**: Never commit private keys to version control
- **Environment Variables**: Use `.env` files for sensitive configuration
- **Signature Validation**: Contract validates all EIP-712 signatures
- **Nonce Protection**: Prevents signature replay attacks
- **Deadline Enforcement**: Signatures expire after deadline

---

## 🚨 Troubleshooting

### Common Issues

**"Endpoint not found"**
- Ensure backend is running on correct port
- Check API endpoints include `/api/` prefix

**"Network does not support ENS"**
- Fixed in frontend by using `eth_accounts` instead of `getAddress()`

**"Invalid signature"**
- Verify contract address matches in frontend
- Check EIP-712 domain parameters
- Ensure correct nonce is used

**Contract deployment fails**
- Check you have sufficient ETH for gas
- Verify RPC URL is correct
- Ensure private key has proper permissions

### Debug Mode
Enable detailed logging by checking server console output for request/response details.

---

## 📄 License

MIT License - feel free to use this code for learning and development purposes. 