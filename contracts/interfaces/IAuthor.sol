// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

interface IAuthor {
    event RegisterSuccess(string url, address sender);
    event Unregister(string url, address sender);
    event RecoverLink(string url, address sender);

    function registerLink(string url) external;

    function unregisterLink(string url) external;

    function recoverLink(string url) external;
}
