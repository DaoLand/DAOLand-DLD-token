import BigNumber from "bignumber.js";
import hre, { network, ethers } from "hardhat";
import { Bytes, Contract, Signer } from "ethers";
import { Artifact, HardhatRuntimeEnvironment } from "hardhat/types";
import { Address } from "cluster";
const Web3 = require("web3");

var chai = require("chai");
var chaiAsPromised = require("chai-as-promised");

chai.use(chaiAsPromised);
var expect = chai.expect;

describe("TEST - DLD Token", function () {
	let addr: any;
	let DLD: Contract;

	it("1: deploy token", async function () {
		addr = await ethers.getSigners();
		const Token = await ethers.getContractFactory("TokenDLD");
		DLD = await Token.deploy(
			"DLD Token",
			"DLD");
	});



	it("2: balanceOf DLD", async function () {
		expect(await DLD.balanceOf(addr[0].address)).to.equal(ethers.utils.parseEther("100000000"));
	});

	it("4: details DLD", async function () {
		expect(await DLD.totalSupply()).to.equal(ethers.utils.parseEther("100000000"));
		expect(await DLD.name()).to.equal('DLD Token');
		expect(await DLD.symbol()).to.equal('DLD');
	});


	it("7: transfer DLD", async function () {
		await DLD.connect(addr[0]).transfer(addr[1].address, ethers.utils.parseEther("100"));
	});

	it("8: balanceOf DLD", async function () {
		expect(await DLD.balanceOf(addr[0].address)).to.equal(ethers.utils.parseEther('99999900'));
		expect(await DLD.balanceOf(addr[1].address)).to.equal(ethers.utils.parseEther('100'));
	});

	it("9: approve DLD", async function () {
		await DLD.connect(addr[0]).approve(addr[3].address, ethers.utils.parseEther("22"));
		await DLD.connect(addr[1]).approve(addr[4].address, ethers.utils.parseEther("11"));
	});

	it("10: allowance DLD", async function () {
		expect(await DLD.allowance(addr[0].address, addr[3].address)).to.equal('22000000000000000000');
		expect(await DLD.allowance(addr[0].address, addr[2].address)).to.equal('0');
		expect(await DLD.allowance(addr[1].address, addr[4].address)).to.equal('11000000000000000000');
	});

	it("11: decreaseAllowance DLD", async function () {
		await DLD.connect(addr[0]).decreaseAllowance(addr[3].address, '17000000000000000000');
		await DLD.connect(addr[1]).decreaseAllowance(addr[4].address, '3000000000000000000');
	});

	it("12: allowance DLD", async function () {
		expect(await DLD.allowance(addr[0].address, addr[3].address)).to.equal('5000000000000000000');
		expect(await DLD.allowance(addr[0].address, addr[2].address)).to.equal('0');
		expect(await DLD.allowance(addr[1].address, addr[4].address)).to.equal('8000000000000000000');
	});

	it("13: transferFrom DLD", async function () {
		await DLD.connect(addr[3]).transferFrom(addr[0].address, addr[3].address, ethers.utils.parseEther('3'));
		await DLD.connect(addr[4]).transferFrom(addr[1].address, addr[5].address, ethers.utils.parseEther('4'));
	});

	it("14: allowance DLD", async function () {
		expect(await DLD.allowance(addr[0].address, addr[3].address)).to.equal('2000000000000000000');
		expect(await DLD.allowance(addr[0].address, addr[2].address)).to.equal('0');
		expect(await DLD.allowance(addr[1].address, addr[4].address)).to.equal('4000000000000000000');
	});

	it("15: balanceOf DLD", async function () {
		expect(await DLD.balanceOf(addr[0].address)).to.equal(ethers.utils.parseEther('99999897'));
		expect(await DLD.balanceOf(addr[1].address)).to.equal(ethers.utils.parseEther('96'));
		expect(await DLD.balanceOf(addr[2].address)).to.equal('0');
		expect(await DLD.balanceOf(addr[3].address)).to.equal(ethers.utils.parseEther('3'));
		expect(await DLD.balanceOf(addr[4].address)).to.equal(ethers.utils.parseEther('0'));
		expect(await DLD.balanceOf(addr[5].address)).to.equal(ethers.utils.parseEther('4'));
	});

	it("14: pause DLD", async function () {
		await DLD.setPause(true);
	});

	it("14: pause transfer", async function () {
		await expect( DLD.connect(addr[0]).transfer(addr[1].address, ethers.utils.parseEther("100"))).to.be.revertedWith('Only whitelisted users can transfer while token paused!');
		await DLD.connect(addr[0]).setWhiteStatus(addr[0].address,true);
		await DLD.connect(addr[0]).transfer(addr[1].address, ethers.utils.parseEther("100"));
		expect(await DLD.balanceOf(addr[0].address)).to.equal(ethers.utils.parseEther('99999797'));
		expect(await DLD.balanceOf(addr[1].address)).to.equal(ethers.utils.parseEther('196'));
	});
	it("14: pause DLD", async function () {
		await DLD.setPause(false);

		await DLD.connect(addr[1]).transfer(addr[0].address, ethers.utils.parseEther("100"));
		expect(await DLD.balanceOf(addr[0].address)).to.equal(ethers.utils.parseEther('99999897'));
		expect(await DLD.balanceOf(addr[1].address)).to.equal(ethers.utils.parseEther('96'));
	});






});