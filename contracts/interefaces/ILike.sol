// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface Like {
    event RegisterSuccess(string url, address sender);
    event Unregister(string url, address sender);
    event RecoverLink(string url, address sender);
    event LikeLink(string url, address sender, uint256 amount);
    event Dislike(string url, address sender);
    event SetMaxDonationLimit(uint256 limit);


    function setMaxDonationLimit(uint256 limit) external;

    function disableLinkByAdmin(string url) external;

    function enableLinkByAdmin(string url) external;

    function registerLink(string url) external;

    function getOwnerFromUrl(string url)
        external
        view
        returns (
            address,
            uint32,
            uint256
        );

    function unregisterLink(string url) external;

    function recoverLink(string url) external;

    function likeLink(string url) external payable;

    function dislike(string url) external;
}
