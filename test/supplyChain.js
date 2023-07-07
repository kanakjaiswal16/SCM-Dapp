const { ethers } = require("hardhat");
const { expect } = require("chai");

describe("SupplyChain", () => {
  let contract;

  beforeEach(async () => {
    const Contract = await ethers.getContractFactory("SupplyChain");
    contract = await Contract.deploy();
    await contract.deployed();
    [owner, user1, user2] = await ethers.getSigners();
  });

  it("constructor", async () => {
    expect(await contract.owner()).to.equal(
      await ethers.provider.getSigner(0).getAddress()
    );
    expect(await contract.id()).to.equal(1000);
  });

  it("assignProduct", async () => {
    const name = "Rice";
    const quantity = 100;

    await contract.connect(user1).assignProduct(name, quantity);

    const data = await contract.IdTOProduct(1000);

    expect(data.productID).to.equal(1000);
    expect(data.productName).to.equal(name);
    expect(data.productQuantity).to.equal(quantity);
    expect(data.productOwner).to.equal(user1.address);

    expect(await contract.id()).to.equal(1001);

    const history = await contract.ownerHistory(1000);
    expect(history[0]).to.equal(user1.address);
  });

  it("getProductDetails", async () => {
    await contract.connect(user1).assignProduct("Rice", 100);
    await contract
      .connect(user1)
      .sellProduct(1000, user2.address, 10, 10000, "location", "hash");

    const data = await contract.getProductDetails(1000);

    expect(data.productID).to.equal(1000);
    expect(data.productName).to.equal("Rice");
    expect(data.productQuantity).to.equal(10);
    expect(data.productOwner).to.equal(user2.address);
    expect(data.productPrice[0]).to.equal(10000);
    expect(data.productLocation[0]).to.equal("location");
    expect(await contract.pdfHash("hash")).to.equal(true);

    await contract.connect(user2).assignProduct("Mango", 1000);
    await expect(contract.getProductDetails(1001)).to.be.revertedWith(
      "Product not Sell"
    );
  });

  it("NotOwner", async () => {
    await contract.connect(user1).assignProduct("Rice", 100);

    await expect(
      contract
        .connect(owner)
        .sellProduct(1000, user2.address, 10, 10000, "location", "hash")
    ).to.be.revertedWith("NotOwner");
  });

  it("ID", async () => {
    await contract.connect(user1).assignProduct("Rice", 100);
    await contract
      .connect(user1)
      .sellProduct(1000, user2.address, 10, 10000, "location", "hash");

    await expect(contract.getProductDetails(10001)).to.be.revertedWith(
      "Invalid product ID"
    );

    await expect(contract.getProductDetails(11)).to.be.revertedWith(
      "Invalid product ID"
    );
  });

  it("blockUser", async () => {
    await contract.blockUser(user1.address);
    await expect(
      contract.connect(user1).assignProduct("wheat", 1000)
    ).to.be.revertedWith("Blocked");

    await contract.connect(user2).assignProduct("rice", 1000);
    await contract.blockUser(user2.address);
    await expect(
      contract
        .connect(user2)
        .sellProduct(1000, owner.address, 10, 10000, "loc", "hash")
    ).to.be.revertedWith("Blocked");

    await expect(
      contract.connect(user1).blockUser(user2.address)
    ).to.be.revertedWith("NotOwner");
  });

  it("stopListing", async () => {
    await contract.stopListing();
    await expect(
      contract.connect(user1).assignProduct("wheat", 10)
    ).to.be.revertedWith("Paused");

    await expect(contract.connect(user1).stopListing()).to.be.revertedWith(
      "NotOwner"
    );
  });

  it("deriveLastId", async () => {
    await contract.connect(user1).assignProduct("wheat", 100);
    await contract.connect(user1).assignProduct("rice", 10);
    expect(await contract.connect(user1).deriveLastId()).to.equal(1001);
  });

  it("getproductQuant", async () => {
    await contract.connect(user1).assignProduct("wheat", 100);
    await contract
      .connect(user1)
      .sellProduct(1000, user2.address, 10, 10000, "location", "hash");

    const data = await contract.getproductQuant(1000);

    expect(data[0]).to.equal(100);
    expect(data[1]).to.equal(10);
  });
});
//0x67db2A54DdE97Ff6b83da6899AcC520cB0Ef9979
