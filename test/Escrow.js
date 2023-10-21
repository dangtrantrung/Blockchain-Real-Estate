const { expect } = require("chai");
const { ethers } = require("hardhat");

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), "ether");
};

//Mocha tests
describe("Escrow", () => {
  let buyer, seller, inspector, lender;
  let realEstate, escrow;
  // before each test run;
  beforeEach(async () => {
    //setup accounts
    [buyer, seller, inspector, lender] = await ethers.getSigners();
    /* console.log(signers);
    const buyer = signers[0];
    const seller = signers[1]; */

    //Deploy Real Estate contract
    const RealEstate = await ethers.getContractFactory("RealEstate");
    realEstate = await RealEstate.deploy();
    console.log(realEstate.address);
    //Mint
    let transaction = await realEstate
      .connect(seller)
      .mint(
        "https://ipfs.io/ipfs/QmTudSYeM7mz3PkYEWXWqPjomRPHogcMFSq7XAvsvsgAPS"
      );
    await transaction.wait();

    //Deploy Escrow contract
    const Escrow = await ethers.getContractFactory("Escrow");
    escrow = await Escrow.deploy(
      realEstate.address,
      seller.address,
      inspector.address,
      lender.address
    );
    //Approve property
    transaction = await realEstate.connect(seller).approve(escrow.address, 1);
    await transaction.wait();
    //List property
    transaction = await escrow.connect(seller).list(1);
    await transaction.wait();
  });

  //test chai mocha conditions
  describe("Deployment", () => {
    it("Return NFT address", async () => {
      const result = await escrow.nftAddress();
      expect(result).to.be.equal(realEstate.address);
    });
    it("Return seller address", async () => {
      const result = await escrow.seller();
      expect(result).to.be.equal(seller.address);
    });

    it("Return inspector address", async () => {
      const result = await escrow.inspector();
      expect(result).to.be.equal(inspector.address);
    });
    /*  it("Return buyer address", async () => {
      const result = await escrow.buyer();
      expect(result).to.be.equal(buyer.address);
    }); */
    it("return lender address", async () => {
      const result = await escrow.lender();
      expect(result).to.be.equal(lender.address);
    });

    /* it("get signers & save the addresses", async () => {}); */
  });

  describe("Listing", () => {
    it("Update Ownership", async () => {
      expect(await realEstate.ownerOf(1)).to.be.equal(escrow.address);
    });
  });
});
