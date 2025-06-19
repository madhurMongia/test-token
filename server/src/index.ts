import app from './app';
import { signer } from './blockchain';
import { config } from './config';

// Start server
app.listen(config.port, () => {
  console.log(`🚀 TestToken API Server running on port ${config.port}`);
  console.log(`📊 Health check: http://localhost:${config.port}/health`);
  console.log(`🔗 Contract: ${config.contractAddress}`);
  console.log(`👤 Owner: ${signer.address}`);
});

export default app; 