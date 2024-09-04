import { ethers } from 'ethers';
import { config } from 'dotenv';

config();

async function main() {
  const artifacts = await hre.artifacts.readArtifact('Faucet');
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_URL);
  const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

  // Create an instance of a Faucet Factory
  const factory = new ethers.ContractFactory(
    artifacts.abi,
    artifacts.bytecode,
    wallet
  );

  const faucet = await factory.deploy();

  console.log('Faucet address:', faucet.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
