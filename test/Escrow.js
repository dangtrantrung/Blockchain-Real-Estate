const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

//Mocha tests
describe("Escrow", () => {
  it("save the addresses", async () => {
    //Deploy Real Estate contract
    const RealEstate = await ethers.getContractFactory("RealEstate");
    const realEstate = await RealEstate.deploy();
    console.log(realEstate.address);
    //Mint
    let transaction = await realEstate.mint(
      "https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS"
    );
  });
});
