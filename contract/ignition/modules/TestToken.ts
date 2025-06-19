import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const TestTokenModule = buildModule("TestTokenModule", (m) => {
  // Deploy the TestToken contract (no constructor parameters needed)
  const testToken = m.contract("TestToken", []);

  return { testToken };
});

export default TestTokenModule; 