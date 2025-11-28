const hre = require("hardhat");

async function main() {
  const Contract = await hre.ethers.getContractFactory("ContentAuthenticity");
  const contract = await Contract.deploy();

  await contract.waitForDeployment();

  console.log("ContentAuthenticity deployed to:", await contract.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
//0x29f6F56238395bE436C600F7d251b5b8dbABe6b2