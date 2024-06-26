const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("TimeZone", function () {
  async function deployFixture() {
    const [player, owner] = await hre.ethers.getSigners();

    const LibraryContract = await ethers.deployContract("LibraryContract");
    await LibraryContract.waitForDeployment();
    const LibraryContractAddr = LibraryContract.target;
    console.log("Адрес библиотечного контракта:", LibraryContractAddr);

    const Preservation = await ethers.deployContract("Preservation", [
      LibraryContractAddr,
      owner,
    ]);
    await Preservation.waitForDeployment();
    const PreservationAddr = Preservation.target;
    console.log("Адрес основного контракта:", PreservationAddr);

    return { Preservation, player };
  }

  it("hack", async function () {
    const { Preservation, player } = await loadFixture(deployFixture);

    // напишите свой контракт и тесты, чтобы получить нужное состояние контракта
    const TimeZoneAttack = await ethers.deployContract("TimeZoneAttack");
    await TimeZoneAttack.waitForDeployment();

    await TimeZoneAttack.delegateCallAttack(Preservation);
    // теперь владелец контракта player, а не owner
    expect(await Preservation.owner()).to.equal(player);
  });
});
