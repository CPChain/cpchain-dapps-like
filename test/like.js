const Like = artifacts.require("Like");
const urlStart = 'https://'
const address_0 = '0x0000000000000000000000000000000000000000'
contract("Test like for Like", (accounts) => {
    it("should register success for " + accounts[0], async () => {
        const instance = await Like.deployed()
        await instance.registerLink(urlStart + accounts[0])
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[0], accounts[0])


    })

    it("should like success for " + accounts[0], async () => {
        const instance = await Like.deployed()
        await instance.likeLink(urlStart + accounts[0])
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[1], 1)
    })

    it("like count should not increase ", async () => {
        const instance = await Like.deployed()
        await instance.likeLink(urlStart + accounts[0])
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[1], 1)
    })

    it("like count should increase ", async () => {
        const instance = await Like.deployed()
        await instance.likeLink(urlStart + accounts[0], { from: accounts[1] })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author[1], 2)
    })

    it("should get donationAmount ", async () => {
        const instance = await Like.deployed()
        await instance.likeLink(urlStart + accounts[0], { from: accounts[1], value: web3.utils.toWei(new web3.utils.BN(2)) })
        const author = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(web3.utils.fromWei(author[2]), 2)

        await instance.likeLink(urlStart + accounts[0], { from: accounts[2], value: web3.utils.toWei(new web3.utils.BN(3)) })
        const author2 = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(web3.utils.fromWei(author2[2]), 5)

        assert.equal(author2[1], 3)
    })

    it("should receive donation ", async () => {
        const balance = await web3.eth.getBalance(accounts[0])
        assert.ok(web3.utils.fromWei(balance) > 100)
    })

    it("should cancel like success ", async () => {
        const instance = await Like.deployed()
        await instance.dislike(urlStart + accounts[0], { from: accounts[1] })
        const author2 = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author2[1], 2)
    })

    it("should cancel like failed ", async () => {
        const instance = await Like.deployed()
        await instance.dislike(urlStart + accounts[0], { from: accounts[1] })
        const author2 = await instance.getOwnerFromUrl(urlStart + accounts[0])
        assert.equal(author2[1], 2)
    })

    it("should like failed beacuse value is to large", async () => {
        try {
            const instance = await Like.deployed()
            await instance.setMaxDonationLimit(web3.utils.toWei(new web3.utils.BN(20)))
            await instance.likeLink(urlStart + accounts[0], { from: accounts[3], value: web3.utils.toWei(new web3.utils.BN(50)) })

        } catch (error) {
            assert.ok(error.toString())
        }

    })
})
