pragma solidity ^0.4.2;


contract Election {
    struct Candidate{
        uint id;
        string name;
        uint voteCount;
    }

    mapping(uint => Candidate) public candidates;
    uint public candidatesCount;

    function addCandidate(string _name) private {
        candidatesCount++;
        candidates[candidateCount] = Candidate(candidateCount, _name, 0);
    }

    function Election() public {
        candidate = 'Candidate1';
    }
}
