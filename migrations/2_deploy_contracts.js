// Deploy Example
var Like = artifacts.require("./Like.sol");

module.exports = function (deployer) {
        deployer.deploy(Like); //"参数在第二个变量携带"
};
