// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/**
 * @title GradEscrow
 * @dev Milestone-Based Smart Contract with Adaptive Dispute Windows
 * Designed by Rudraksh Choudhary and Ayush Abhinav
 */
contract GradEscrow {
    address public client;
    address public freelancer;
    address public arbiter;

    uint256 public initialDisputeWindow; // W0 in seconds
    uint256 public decayPercentage; // k in percentage (e.g., 10 for 10% decay per milestone)
    uint256 public successfulMilestones;
    uint256 public minimumDisputeWindow = 1 days; // Cap the minimum window

    enum MilestoneStatus { Created, Funded, Submitted, Approved, Disputed, Resolved }

    struct Milestone {
        string description;
        uint256 amount;
        MilestoneStatus status;
        uint256 submittedTime;
    }

    Milestone[] public milestones;
    uint256 public totalFunded;

    event MilestoneCreated(uint256 id, string description, uint256 amount);
    event Funded(uint256 amount);
    event WorkSubmitted(uint256 milestoneId);
    event WorkApproved(uint256 milestoneId, uint256 amount);
    event DisputeTriggered(uint256 milestoneId);
    event DisputeResolved(uint256 milestoneId, bool inFavorOfFreelancer);

    modifier onlyClient() { require(msg.sender == client, "Only client"); _; }
    modifier onlyFreelancer() { require(msg.sender == freelancer, "Only freelancer"); _; }
    modifier onlyArbiter() { require(msg.sender == arbiter, "Only arbiter"); _; }

    /**
     * @param _freelancer The address of the freelancer
     * @param _arbiter Neutral third party for resolving disputes
     * @param _initialWindowDays Initial dispute window W0 in days (e.g. 7)
     * @param _decayPercentage Decay constant k in percentage (e.g. 20 for 20%)
     */
    constructor(
        address _freelancer, 
        address _arbiter, 
        uint256 _initialWindowDays, 
        uint256 _decayPercentage
    ) payable {
        client = msg.sender;
        freelancer = _freelancer;
        arbiter = _arbiter;
        initialDisputeWindow = _initialWindowDays * 1 days;
        decayPercentage = _decayPercentage;
        if (msg.value > 0) {
            totalFunded += msg.value;
            emit Funded(msg.value);
        }
    }

    function addMilestone(string memory _description, uint256 _amount) external onlyClient {
        milestones.push(Milestone({
            description: _description,
            amount: _amount,
            status: MilestoneStatus.Created,
            submittedTime: 0
        }));
        emit MilestoneCreated(milestones.length - 1, _description, _amount);
    }

    function fundContract() external payable onlyClient {
        totalFunded += msg.value;
        emit Funded(msg.value);
    }

    function submitWork(uint256 _milestoneId) external onlyFreelancer {
        require(milestones[_milestoneId].status == MilestoneStatus.Created, "Milestone not pending");
        milestones[_milestoneId].status = MilestoneStatus.Submitted;
        milestones[_milestoneId].submittedTime = block.timestamp;
        emit WorkSubmitted(_milestoneId);
    }

    /**
     * @dev Implementation of Window(n) = W0 * (1 - k*n)
     * Calculates the current dispute window based on accumulated verified trust.
     */
    function getCurrentDisputeWindow() public view returns (uint256) {
        uint256 totalDecay = decayPercentage * successfulMilestones;
        
        // If decay exceeds 100%, return the minimum window to ensure basic safety
        if (totalDecay >= 100) {
            return minimumDisputeWindow;
        }

        uint256 currentWindow = (initialDisputeWindow * (100 - totalDecay)) / 100;
        
        // Ensure the window never drops below the absolute minimum
        return currentWindow > minimumDisputeWindow ? currentWindow : minimumDisputeWindow;
    }

    function approveWork(uint256 _milestoneId) external onlyClient {
        require(milestones[_milestoneId].status == MilestoneStatus.Submitted, "Work not submitted");
        _releaseFunds(_milestoneId);
    }

    function autoFinalize(uint256 _milestoneId) external onlyFreelancer {
        require(milestones[_milestoneId].status == MilestoneStatus.Submitted, "Work not submitted");
        uint256 currentWindow = getCurrentDisputeWindow();
        require(block.timestamp >= milestones[_milestoneId].submittedTime + currentWindow, "Dispute window is still active");

        _releaseFunds(_milestoneId);
    }

    function triggerDispute(uint256 _milestoneId) external onlyClient {
        require(milestones[_milestoneId].status == MilestoneStatus.Submitted, "Work not submitted");
        uint256 currentWindow = getCurrentDisputeWindow();
        require(block.timestamp < milestones[_milestoneId].submittedTime + currentWindow, "Dispute window closed");

        milestones[_milestoneId].status = MilestoneStatus.Disputed;
        emit DisputeTriggered(_milestoneId);
    }

    function resolveDispute(uint256 _milestoneId, bool _inFavorOfFreelancer) external onlyArbiter {
        require(milestones[_milestoneId].status == MilestoneStatus.Disputed, "Milestone not disputed");
        milestones[_milestoneId].status = MilestoneStatus.Resolved;

        if (_inFavorOfFreelancer) {
            _releaseFunds(_milestoneId);
        } else {
            // Refund the milestone amount to the client
            payable(client).transfer(milestones[_milestoneId].amount);
            emit DisputeResolved(_milestoneId, false);
        }
    }

    function _releaseFunds(uint256 _milestoneId) internal {
        milestones[_milestoneId].status = MilestoneStatus.Approved;
        successfulMilestones++;
        payable(freelancer).transfer(milestones[_milestoneId].amount);
        emit WorkApproved(_milestoneId, milestones[_milestoneId].amount);
    }
    
    function getMilestonesCount() external view returns (uint256) {
        return milestones.length;
    }
}
