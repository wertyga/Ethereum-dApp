pragma solidity ^0.4.2;


contract Election {
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    //Store account that have voted
    mapping(address => bool) public voters;

    mapping(uint => Candidate) public candidates;

    uint public candidatesCount;

    //voted event
    event votedEvent(
        uint indexed _candidatedId
    );

    function addCandidate(string _name) private {
        candidatesCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }

    function Election() public {
        addCandidate('Candidate1');
        addCandidate('Candidate2');
    }

    function vote(uint _candidateId) public {
        require(!voters[msg.sender]);
        require(_candidateId > 0 && _candidateId <= candidatesCount);

        voters[msg.sender] = true;

        candidates[_candidateId].voteCount++;

        votedEvent(_candidateId);
    }
}
