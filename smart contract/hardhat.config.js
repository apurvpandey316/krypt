//https://eth-goerli.g.alchemy.com/v2/Pmxb-y4tAF99znxrskHT6U-3PCtbRKQW

require("@nomiclabs/hardhat-waffle");
require("@nomiclabs/hardhat-ethers");
module.exports = {
  solidity: "0.8.0",
  networks: {
    goerli: {
      url: "https://eth-goerli.g.alchemy.com/v2/Pmxb-y4tAF99znxrskHT6U-3PCtbRKQW",
      accounts: [
        "40177bdb2cc5516da2f97e3976fb100c10eeffb76197485710a654a75e6f69ee",
      ],
    },
  },
};
