import config from '../config'
import { ethers, run } from 'hardhat'

const {
	DLD_NAME,
	DLD_SYMBOL,

	DLS_NAME,
	DLS_SYMBOL,
} = config


async function main() {
	const [
		TokenDLD,
		TokenDLS
	] = await Promise.all([
		ethers.getContractFactory("TokenDLD"),
		ethers.getContractFactory("TokenDLS")
	])
	console.log('start deploy DLD')
	const dld = await TokenDLD.deploy(
		DLD_NAME,
		DLD_SYMBOL
	)
	console.log(`DLD token has been deployed to: ${dld.address}`);
	console.log('start deploy DLS')
	const dls = await TokenDLS.deploy(
		DLS_NAME,
		DLS_SYMBOL
	)
	console.log(`DLS token has been deployed to: ${dls.address}`);

	await dld.deployed()
	await dls.deployed()

	// const dld = TokenDLD.attach(config.rinkeby.DLD_ADDRESS)
	// const dls = TokenDLS.attach(config.rinkeby.DLS_ADDRESS)

	console.log('starting verify TokenDLD...')
	try {
		await run('verify:verify', {
			address: dld!.address,
			constructorArguments: [
				DLD_NAME,
				DLD_SYMBOL
			],
		});
		console.log('verify success')
	} catch (e: any) {
		console.log(e.message)
	}

	console.log('starting verify TokenDLS...')
	try {
		await run('verify:verify', {
			address: dls!.address,
			constructorArguments: [
				DLS_NAME,
				DLS_SYMBOL
			],
			contract: "contracts/tokens/TokenDLS.sol:TokenDLS"
		});
		console.log('verify success')
	} catch (e: any) {
		console.log(e.message)
	}
}

main()
.then(() => process.exit(0))
.catch(error => {
	console.error(error);
	process.exit(1);
});
