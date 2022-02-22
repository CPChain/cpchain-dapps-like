// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface ILike {
    event SetMaxDonationLimit(uint256 limit);

    function setMaxDonationLimit(uint256 limit) external;

    function disableLinkByAdmin(string url) external;

    function enableLinkByAdmin(string url) external;  
     
}
