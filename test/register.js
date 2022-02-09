const Like = artifacts.require("Like");
const urlStart = 'https://'
const address_0 = '0x0000000000000000000000000000000000000000'
contract("Test Register for Like", (accounts) => {
    it("should register success for " + accounts[0], async () => {
        const instance = await Like.deployed()
        await instance.registerLink(urlStart + accounts[0])
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[0], accounts[0])
    })

    it("should like success for " + accounts[1], async () => {
        const instance = await Like.deployed()
        await instance.likeLink(urlStart + accounts[0], { from: accounts[1], value: 10 })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[1], 1)
    })
    it("should like success for " + accounts[3], async () => {
        const instance = await Like.deployed()
        await instance.likeLink(urlStart + accounts[0], { from: accounts[3], value: 10 })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[1], 2)
    })
   
    it("should cancel like success for " + accounts[3], async () => {
        const instance = await Like.deployed()
        await instance.dislike(urlStart + accounts[0], { from: accounts[3] })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[1], 1)
    })

    it("should register failed because url has be registered", async () => {
        try {
            const instance = await Like.deployed()
            await instance.registerLink(urlStart + accounts[0], { from: accounts[1] })
        } catch (error) {
            assert.ok(error.toString())
        }
    })
    it("should unregister failed because sender is not author", async () => {
        try {
            const instance = await Like.deployed()
            await instance.unregisterLink(urlStart + accounts[0], { from: accounts[1] })
        } catch (error) {
            assert.ok(error.toString())
        }
    })
    it("should unregister success for author", async () => {
        const instance = await Like.deployed()
        await instance.unregisterLink(urlStart + accounts[0])
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[0], address_0)
    })

    it("should like failed because url is deleted " + accounts[4], async () => {
        try {
            const instance = await Like.deployed()
            await instance.likeLink(urlStart + accounts[0], { from: accounts[4], value: 10 })
        } catch (error) {
            assert.ok(error.toString())
        }

    })

    it("should cancel like failed because disabled by admin for " + accounts[1], async () => {
        try {
            const instance = await Like.deployed()
            await instance.dislike(urlStart + accounts[0], { from: accounts[1] })
        } catch (error) {
            assert.ok(error.toString())
        }

    })


    it("should recover success for author", async () => {
        const instance = await Like.deployed()
        await instance.recoverLink(urlStart + accounts[0])
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[0], accounts[0])
    })

    it("should like success for " + accounts[3], async () => {
        const instance = await Like.deployed()
        await instance.likeLink(urlStart + accounts[0], { from: accounts[3], value: 10 })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[1], 2)
    })
   
    it("should cancel like success for " + accounts[3], async () => {
        const instance = await Like.deployed()
        await instance.dislike(urlStart + accounts[0], { from: accounts[3] })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[1], 1)
    })
})
