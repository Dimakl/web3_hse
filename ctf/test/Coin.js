const { expect } = require("chai");
const {
  loadFixture,
} = require("@nomicfoundation/hardhat-toolbox/network-helpers");
const { ethers } = require("hardhat");

describe("Coin", function () {
  async function deployFixture() {
    const [player, second_account] = await hre.ethers.getSigners();

    const Coin = await ethers.deployContract("Coin");
    await Coin.waitForDeployment();
    const CoinAddr = Coin.target;
    console.log("Адрес Coin токена:", CoinAddr);
    console.log("Ваш баланс:", await Coin.balanceOf(player));

    return { Coin, player, second_account };
  }

  it("hack", async function () {
    const { Coin, player, second_account } = await loadFixture(deployFixture);

    // напишите свой контракт и тесты, чтобы получить нужное состояние контракта
    let playerBalance = await Coin.balanceOf(player)

    await Coin.approve(player, playerBalance)
    await Coin.transferFrom(player, second_account, playerBalance)

    // баланс контракта прокси в токене HSE должен стать 0
    expect(await Coin.balanceOf(player)).to.equal(0);
  });
});
