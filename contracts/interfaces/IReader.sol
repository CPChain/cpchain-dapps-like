// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IReader {
    event LikeLink(string url, address sender, uint256 amount);
    event Dislike(string url, address sender);

    function getOwnerFromUrl(string url)
        external
        view
        returns (
            address,
            uint32,
            uint256
        );

    function isLiked(string url) external view returns (bool);

    function likeLink(string url) external payable;

    function dislike(string url) external;
}
