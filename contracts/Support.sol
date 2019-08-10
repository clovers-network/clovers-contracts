pragma solidity ^0.4.18;

import "./ClubTokenController.sol";

contract Support {
    function() public payable {
        support();
    }

    bool public done;
    bool public active;
    uint256 public totalContributions;
    uint256 public remainingTokens;
    uint256 public totalTokens;
    uint256 public limit;
    address public owner;
    mapping(address => bool) public withdrawn;
    mapping(address => bool) public whitelist;
    mapping(address => uint256) public contributions;
    ClubTokenController public bondingCurve;

    modifier onlyOwner() {
        require(owner == msg.sender, "Only Owner");
        _;
    }
    modifier isWhitelisted() {
        require(whitelist[msg.sender], "Must be a whitelisted address");
        _;
    }
    modifier isDone() {
        require(done, "Must be done");
        _;
    }
    modifier isNotDone() {
        require(!done, "Must not yet be done");
        _;
    }
    modifier isActive() {
        require(active, "Must be active");
        _;
    }
    modifier isNotActive() {
        require(!active, "Must not be active");
        _;
    }
    constructor(uint256 _limit, ClubTokenController _bondingCurve) public {
        owner = msg.sender;
        limit = _limit;
        bondingCurve = _bondingCurve;
    }

    function addToWhitelist(address whitelisted) public onlyOwner {
        whitelist[whitelisted] = true;
    }

    function onWhitelist(address whitelisted) public view returns(bool) {
        return whitelist[whitelisted];
    }

    function hasWithdrawn(address whitelisted) public view returns(bool) {
        return withdrawn[whitelisted];
    }

    function currentContribution(address whitelisted) public view returns(uint256) {
        return contributions[whitelisted];
    }

    function removeFromWhitelist(address blacklisted) public onlyOwner {
        whitelist[blacklisted] = false;
        msg.sender.transfer(contributions[blacklisted]);
        totalContributions -= contributions[blacklisted];
        contributions[blacklisted] = 0;
    }

    function support() public payable isNotDone isActive isWhitelisted {
        require(contributions[msg.sender] + msg.value <= limit, "Not allowed to contribute more than limit");

        contributions[msg.sender] += msg.value;
        totalContributions += msg.value;
    }

    function setActive(bool _active) public onlyOwner isNotDone {
        active = _active;
    }

    function setLimit(uint256 _limit) public onlyOwner isNotDone {
        limit = _limit;
    }

    function makeBuy() public onlyOwner isNotDone isNotActive{
        bondingCurve.buy.value(address(this).balance)(address(this));
        totalTokens = IClubToken(bondingCurve.clubToken()).balanceOf(address(this));
        remainingTokens = totalTokens;
        done = true;
    }

    function withdraw() public isDone isWhitelisted {
        require(!withdrawn[msg.sender], "Must not have withdrawn already");
        withdrawn[msg.sender] = true;
        uint256 percentage = (contributions[msg.sender] * totalTokens) / totalContributions;
        if (percentage > remainingTokens) {
            percentage = remainingTokens;
        }
        remainingTokens = remainingTokens - percentage;
        ClubTokenController(bondingCurve).transferFrom(address(this), msg.sender, percentage);
    }
}
