import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers'
import { ethers } from 'hardhat'
import { expect } from 'chai'

import BigNumber from 'bignumber.js'
BigNumber.config({ EXPONENTIAL_AT: 60 })

import { TokenDLS, TokenDLD } from '../typechain'

import config from '../config'
const DLD_INITIAL_SUPPLY = new BigNumber(config.DLD_INITIAL_SUPPLY).toString()
const DLS_SUPPLY = new BigNumber('1000000000').shiftedBy(18).toString() // 1_000_000_000

let dls: TokenDLS
let dld: TokenDLD

let owner: SignerWithAddress
let user0: SignerWithAddress
let user1: SignerWithAddress

async function reDeploy() {
	[owner, user0, user1] = await ethers.getSigners()
	let TokenDLS = await ethers.getContractFactory('TokenDLS')
	let TokenDLD = await ethers.getContractFactory('TokenDLD')
	dls = await TokenDLS.deploy('TokenDLS', 'DLS') as TokenDLS
	await dls.mint(owner.address, DLS_SUPPLY);
	dld = await TokenDLD.deploy('TokenDLD', 'DLD') as TokenDLD
}

describe('Tokens', () => {
	it('check name, symbol and balance', async () => {
		await reDeploy()
		const [
			nameDLS,
			symbolDLS,
			balanceOwnerDLS,
			nameDLD,
			symbolDLD,
			balanceOwnerDLD,
		] = await Promise.all([
			dls.name(),
			dls.symbol(),
			dls.balanceOf(owner.address),
			dld.name(),
			dld.symbol(),
			dld.balanceOf(owner.address),
		])
		expect(nameDLS).to.equal('TokenDLS')
		expect(nameDLD).to.equal('TokenDLD')
		expect(symbolDLS).to.equal('DLS')
		expect(symbolDLD).to.equal('DLD')
		expect(balanceOwnerDLS).to.equal(DLS_SUPPLY)
		expect(balanceOwnerDLD).to.equal(DLD_INITIAL_SUPPLY)
	})
	it('Send random token to DLS and withdraw back, and also should revert if caller is not admin', async () => {
		await reDeploy()
		const initBalance = (await dld.balanceOf(owner.address)).toString()
		const amount = new BigNumber('1000').shiftedBy(18).toString()
		await dld.transfer(dls.address, amount);
		const balance = (await dld.balanceOf(dls.address)).toString();
		expect(balance).to.equal(amount)
		const ADMIN_ROLE = await dls.ADMIN_ROLE()
		try {
			await dls.connect(user0).withdrawToken(dld.address, amount)
		} catch (e: any) {
			expect(e.message.toLowerCase()).to.equal(`VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${user0.address} is missing role ${ADMIN_ROLE}'`.toLowerCase())
		}
		await dls.withdrawToken(dld.address, amount)
		const finalBalance = (await dld.balanceOf(owner.address)).toString()
		expect(finalBalance).to.equal(initBalance)
	})
	it('Send random token to DLD and withdraw back, and also should revert if caller is not admin', async () => {
		await reDeploy()
		const initBalance = (await dls.balanceOf(owner.address)).toString()
		const amount = new BigNumber('1000').shiftedBy(18).toString()
		await dls.transfer(dld.address, amount);
		const balance = (await dls.balanceOf(dld.address)).toString();
		expect(balance).to.equal(amount)
		const ADMIN_ROLE = await dld.ADMIN_ROLE()
		try {
			await dld.connect(user0).withdrawToken(dls.address, amount)
		} catch (e: any) {
			expect(e.message.toLowerCase()).to.equal(`VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${user0.address} is missing role ${ADMIN_ROLE}'`.toLowerCase())
		}
		await dld.withdrawToken(dls.address, amount)
		const finalBalance = (await dls.balanceOf(owner.address)).toString()
		expect(finalBalance).to.equal(initBalance)
	})
	it('DLS burn and mint, and also should revert if caller is not admin', async () => {
		await reDeploy()
		const BURNER_ROLE = await dls.BURNER_ROLE()
		const MINTER_ROLE = await dls.MINTER_ROLE()

		try {
			await dls.connect(user0).burn(owner.address, 1)
		} catch (e: any) {
			expect(e.message.toLowerCase()).to.equal(`VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${user0.address} is missing role ${BURNER_ROLE}'`.toLowerCase())
		}
		try {
			await dls.connect(user0).mint(owner.address, 1)
		} catch (e: any) {
			expect(e.message.toLowerCase()).to.equal(`VM Exception while processing transaction: reverted with reason string 'AccessControl: account ${user0.address} is missing role ${MINTER_ROLE}'`.toLowerCase())
		}

		await dls.grantRole(BURNER_ROLE, owner.address)
		await dls.grantRole(MINTER_ROLE, owner.address)
		const amount = '1000'
		await dls.burn(owner.address, amount)
		let supply = (await dls.totalSupply()).toString()
		expect(supply).to.equal('999999999999999999999999000')
		await dls.mint(owner.address, amount)
		supply = (await dls.totalSupply()).toString()
		expect(supply).to.equal('1000000000000000000000000000')
	})
})