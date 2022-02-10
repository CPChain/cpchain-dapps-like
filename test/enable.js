const Like = artifacts.require("Like");
const urlStart = 'https://'
const truffleAssert = require('truffle-assertions');
contract("Test like for Like", (accounts) => {
    it("contract enabled should be true ", async () => {
        const instance = await Like.deployed()
        const enabled = await instance.enabled()
        assert.equal(enabled, true)
    })
    it("should register success for " + accounts[1], async () => {
        const instance = await Like.deployed()
        await instance.registerLink(urlStart + accounts[1], { from: accounts[1] })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[1])
        assert.equal(author[0], accounts[1])
    })

    it("should like success for " + accounts[2], async () => {
        const instance = await Like.deployed()
        await instance.likeLink(urlStart + accounts[1], { from: accounts[2], value: 10 })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[1])
        assert.equal(author[1], 1)
    })
    it("should like success for " + accounts[3], async () => {
        const instance = await Like.deployed()
        await instance.likeLink(urlStart + accounts[1], { from: accounts[3], value: 10 })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[1])
        assert.equal(author[1], 2)
    })
    it("should cancel like success for " + accounts[3], async () => {
        const instance = await Like.deployed()
        await instance.dislike(urlStart + accounts[1], { from: accounts[3] })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[1])
        assert.equal(author[1], 1)
    })
    it("contract disabled by admin", async () => {
        const instance = await Like.deployed()
        const result = await instance.disableContract()
        const enabled = await instance.enabled()
        assert.equal(enabled, false)

        truffleAssert.eventEmitted(result, 'EnableStatusChanged', (ev) => {
            return ev.enabled === false
        });
    })

    it("should register failed because disabled by admin for " + accounts[4], async () => {
        try {
            const instance = await Like.deployed()
            await instance.registerLink(urlStart + accounts[4])
        } catch (error) {
            assert.ok(error.toString())
        }
    })
    it("should like failed because disabled by admin for " + accounts[4], async () => {
        try {
            const instance = await Like.deployed()
            await instance.likeLink(urlStart + accounts[1], { from: accounts[4], value: 10 })
        } catch (error) {
            assert.ok(error.toString())
        }

    })

    it("should cancel like failed because disabled by admin for " + accounts[2], async () => {
        try {
            const instance = await Like.deployed()
            await instance.dislike(urlStart + accounts[1], { from: accounts[2] })
        } catch (error) {
            assert.ok(error.toString())
        }

    })

    it("contract enabled by admin", async () => {
        const instance = await Like.deployed()
        const result = await instance.enableContract()
        const enabled = await instance.enabled()
        assert.equal(enabled, true)
        truffleAssert.eventEmitted(result, 'EnableStatusChanged', (ev) => {
            return ev.enabled === true
        });
    })

    it("should register success for " + accounts[4], async () => {
        const instance = await Like.deployed()
        await instance.registerLink(urlStart + accounts[4], { from: accounts[4] })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[4])
        assert.equal(author[0], accounts[4])
    })

    it("should like success for " + accounts[5], async () => {
        const instance = await Like.deployed()
        await instance.likeLink(urlStart + accounts[1], { from: accounts[5], value: 10 })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[1])
        assert.equal(author[1], 2)
    })
    it("should cancel like success for " + accounts[5], async () => {
        const instance = await Like.deployed()
        await instance.dislike(urlStart + accounts[1], { from: accounts[5] })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[1])
        assert.equal(author[1], 1)
    })

    it("disable link faild because sender is not admin ", async () => {
        try {
            const instance = await Like.deployed()
            await instance.disableLinkByAdmin(urlStart + accounts[1], { from: accounts[5] })
        } catch (error) {
            assert.ok(error.toString())
        }
    })

    it("disable link by admin", async () => {
        const instance = await Like.deployed()
        await instance.disableLinkByAdmin(urlStart + accounts[1])
    })


    it("can not like because link is disable by admin", async () => {
        try {
            const instance = await Like.deployed()
            await instance.likeLink(urlStart + accounts[1], { from: accounts[6], value: 10 })
        } catch (error) {
            assert.ok(error.toString())
        }
    })

    it("can not cancel like because link is disable by admin", async () => {
        try {
            const instance = await Like.deployed()
            await instance.dislike(urlStart + accounts[1], { from: accounts[2] })
        } catch (error) {
            assert.ok(error.toString())
        }
    })

    it("enable link by admin", async () => {
        const instance = await Like.deployed()
        await instance.enableLinkByAdmin(urlStart + accounts[1])
    })

    it("can   like because link is disable by admin", async () => {
        const instance = await Like.deployed()
        await instance.likeLink(urlStart + accounts[1], { from: accounts[6], value: 10 })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[1])
        assert.equal(author[1], 2)
    })

    it("can  cancel like because link is disable by admin", async () => {
        const instance = await Like.deployed()
        await instance.dislike(urlStart + accounts[1], { from: accounts[6] })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[1])
        assert.equal(author[1], 1)
    })
})
