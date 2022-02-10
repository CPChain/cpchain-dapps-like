const Like = artifacts.require("Like");
const truffleAssert = require('truffle-assertions');
const address_0 = '0x0000000000000000000000000000000000000000'

contract("Test Owner for Like contract", (accounts) => {
    it("owner should be:" + accounts[0], async () => {
        const instance = await Like.deployed()
        const owner = await instance.owner()
        assert.equal(owner, accounts[0])
    })

    it("can not change owner to:  0x0", async () => {
        try {
            const instance = await Like.deployed()
            await instance.transferOwnership(address_0)
        } catch (error) {
            assert.ok(error.toString())
        }
    })
    it("should change owner to:" + accounts[1], async () => {
        const instance = await Like.deployed()
        const result = await instance.transferOwnership(accounts[1])
        const owner = await instance.owner()
        assert.equal(owner, accounts[1])
        truffleAssert.eventEmitted(result, 'OwnershipTransferred', (ev) => {
            return ev.previousOwner === accounts[0] && ev.newOwner === accounts[1]
        });
    })

    it("should change owner failed", async () => {
        try {
            const instance = await Like.deployed()
            await instance.transferOwnership(accounts[2])
        } catch (error) {
            assert.ok(error.toString())
        }
    })

    it("new owner can change owner ", async () => {
        const instance = await Like.deployed()
        await instance.transferOwnership(accounts[0], { from: accounts[1] })
        const owner = await instance.owner()
        assert.equal(owner, accounts[0])
    })


    it("default donation limit should be 1000 ether", async () => {
        const instance = await Like.deployed()
        const maxLimit = await instance.maxDonationLimit()
        assert.equal(web3.utils.fromWei(maxLimit), 1000)
    })

    it("set donation limit 2000 ether", async () => {
        const instance = await Like.deployed()
        const result = await instance.setMaxDonationLimit(web3.utils.toWei(new web3.utils.BN(2000)))
        const maxLimit = await instance.maxDonationLimit()
        assert.equal(web3.utils.fromWei(maxLimit), 2000)
        truffleAssert.eventEmitted(result, 'SetMaxDonationLimit', (ev) => {
            return web3.utils.fromWei(ev.limit) == 2000
        });
    })
    it("set max donation limit should be failed when called by any account other than the owner", async () => {
        try {
            const instance = await Like.deployed()
            await instance.setMaxDonationLimit(web3.utils.toWei(new web3.utils.BN(3000)), { from: accounts[1] })
        } catch (error) {
            assert.ok(error.toString())
        }
    })
    it("set max donation limit should be failed because limit is less than 1 ether", async () => {
        try {
            const instance = await Like.deployed()
            await instance.setMaxDonationLimit(web3.utils.toWei(new web3.utils.BN(0.1)))
        } catch (error) {
            assert.ok(error.toString())
        }
    })
})
