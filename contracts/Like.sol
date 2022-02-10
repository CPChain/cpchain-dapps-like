// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;
import "./Enable.sol";

contract Like is Enable {
    event RegisterSuccess(string url, address sender);
    event Unregister(string url, address sender);
    event RecoverLink(string url, address sender);
    event LikeLink(string url, address sender, uint256 amount);
    event Dislike(string url, address sender);
    event SetMaxDonationLimit(uint256 limit);

    uint256 public maxDonationLimit = 1000 ether;

    struct Link {
        address author;
        uint32 likeCount;
        uint256 donationAmount;
        bool disable;
        bool deleted;
        mapping(address => bool) likedAddress;
    }

    mapping(string => Link) urlToAuthor;

    modifier onlyAuthor(string memory url) {
        require(urlToAuthor[url].author == msg.sender);
        _;
    }

    modifier onlyActivated(string memory url) {
        require(!urlToAuthor[url].deleted && !urlToAuthor[url].disable);
        _;
    }

    function setMaxDonationLimit(uint256 limit) public onlyOwner {
        require(limit >= 1 ether);
        maxDonationLimit = limit;
        emit SetMaxDonationLimit(limit);
    }

    function disableLinkByAdmin(string memory url) public onlyOwner {
        urlToAuthor[url].disable = true;
    }

    function enableLinkByAdmin(string memory url) public onlyOwner {
        urlToAuthor[url].disable = false;
    }

    function registerLink(string memory url) public onlyEnabled {
        require(urlToAuthor[url].author == address(0));
        urlToAuthor[url].author = msg.sender;
        emit RegisterSuccess(url, msg.sender);
    }

    function getOwnerFromUrl(string memory url)
        public
        view
        onlyEnabled
        returns (
            address,
            uint32,
            uint256
        )
    {
        Link storage link = urlToAuthor[url];
        if (link.deleted) {
            return (address(0), 0, 0);
        }
        return (link.author, link.likeCount, link.donationAmount);
    }

    function unregisterLink(string memory url)
        public
        onlyEnabled
        onlyAuthor(url)
    {
        urlToAuthor[url].deleted = true;
        emit Unregister(url, msg.sender);
    }

    function recoverLink(string memory url) public onlyEnabled onlyAuthor(url) {
        urlToAuthor[url].deleted = false;
        emit RecoverLink(url, msg.sender);
    }

    function likeLink(string memory url)
        public
        payable
        onlyEnabled
        onlyActivated(url)
    {
        require(msg.value <= maxDonationLimit);
        Link storage link = urlToAuthor[url];
        bool liked = link.likedAddress[msg.sender];
        if (!liked) {
            link.likeCount++;
            link.likedAddress[msg.sender] = true;
        }

        if (msg.value > 0) {
            link.author.transfer(msg.value);
            link.donationAmount += msg.value;
        }

        emit LikeLink(url, msg.sender, msg.value);
    }

    function dislike(string memory url) public onlyEnabled onlyActivated(url) {
        Link storage link = urlToAuthor[url];
        bool liked = link.likedAddress[msg.sender];
        //  如果已经dislike，交易不成功
        require(liked);
        link.likeCount--;
        link.likedAddress[msg.sender] = false;
        emit Dislike(url, msg.sender);
    }
}
