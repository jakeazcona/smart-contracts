// const hre = require("hardhat");
// const {expect} = require("chai");

// const commands = [
//     "DevFee",
//     "AdminFee",
//     // "Owner",
//     "ReinvestReward"
// ];

// const camelToSnake = str => str.replace(/[A-Z]/g, (letter, index) => index == 0 ? letter.toLowerCase() : '_'+ letter.toLowerCase());

// const { timelockContractAddress } = require("../constants/addresses");
// const { ethers } = require("hardhat");
// const farm = "0x06404FC9C69F8333DC24D4C856E2c8Db7983EB8a";

// // test 1: propose a change and make sure it can't be set straight away.
// let test1 = async (command) => {
//     let value = 123; // example value for fees

//     await hre.network.provider.request({
//         method: "hardhat_impersonateAccount",
//         params: ["0xdcedf06fd33e1d7b6eb4b309f779a0e9d3172e44"]
//     });

//     const signer = hre.ethers.provider.getSigner("0xdcedf06fd33e1d7b6eb4b309f779a0e9d3172e44");
//     const ABI = require("../abis/YakTimelockForDexStrategyV3");
//     const timelockContract = new ethers.Contract(timelockContractAddress, ABI, signer);

//     let tx = await timelockContract["propose"+command](farm, value);
//     await tx.wait(1);

//     let pendingChange = await timelockContract["pending"+command+"s"](farm);
//     expect(pendingChange, "error in the pending change").to.eq(value); // pending change should be equal to value provided

//     let ableToBypassTimelock = async () => {
//         return !await timelockContract["set"+command](farm).catch(err=> "Error: VM Exception" == err.toString().slice(0,19)); 
//     };
//     expect(await ableToBypassTimelock(), "timelock avoided").to.be.false; // we should get an exception when "setting" and we should not bypass the timelock.

//     return pendingChange == value;
// }

// // test 2: If i propose a value and wait 8hrs I should be able to set the value
// let test2 = async (command) => {
//     let value = 123; // example value for fees
    
//     await hre.network.provider.request({
//         method: "hardhat_impersonateAccount",
//         params: ["0xdcedf06fd33e1d7b6eb4b309f779a0e9d3172e44"]
//     });

//     const signer = hre.ethers.provider.getSigner("0xdcedf06fd33e1d7b6eb4b309f779a0e9d3172e44");
//     const ABI = require("../abis/YakTimelockForDexStrategyV3");
//     const farmABI = require("../abis/DexStrategyV5");
//     const timelockContract = new ethers.Contract(timelockContractAddress, ABI, signer);
//     const farmContract = new ethers.Contract(farm, farmABI, ethers.provider);

//     // propose change
//     let tx1 = await timelockContract["propose"+command](farm, value);
//     await tx1.wait(1);

//     // wait 8hrs
//     await hre.network.provider.send("evm_increaseTime", [28801]);

//     // set change
//     let ableToBypassTimelock = async () => {
//         return !await timelockContract["set"+command](farm).then(res=>false).catch(err=> "Error: VM Exception" == err.toString().slice(0,19));
//     };
    
//     expect(await ableToBypassTimelock(), "timelock avoided").to.be.true; // we should be able to bypass the timelock since 8hrs have passed
    
//     let pendingChange = await timelockContract["pending"+command+"s"](farm);
    
//     expect(pendingChange).to.eq(0); // any pending changes should be gone and applied to the farm

//     let completedChange = await farmContract[camelToSnake(command).toUpperCase()+"_BIPS"]();

//     expect(completedChange).to.eq(value);

//     return (pendingChange == 0) && (completedChange == value);
// }
 
// commands.forEach(async command => {
//     console.log(`Test 1: Command: ${command} ==>`, await test1(command) ? "passed" : "failed");
//     console.log(`Test 2: Command: ${command} ==>`, await test2(command) ? "passed" : "failed");
// })