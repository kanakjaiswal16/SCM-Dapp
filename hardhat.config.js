require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks: {
    hardhat: {
      chaidId: 1337,
    },
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [SEPOLIA_PRIVATE_KEY],
      chainId: 11155111,
    },
  },
  paths: {
    artifacts: "./supply-chain-management/src/artifacts",
  },
};
