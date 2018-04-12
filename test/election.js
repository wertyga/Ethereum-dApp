const Election = artifacts.require('./Election');

contract("Election", function(accounts) {
    let electionInstance;

    it("Initialize with two candidates", function() {
        return Election.deployed().then(instance => {
            return instance.candidatesCount();
        }).then(count => {
            assert.equal(count, 2);
        });
    });

    it("Initialize candidates with correct properties", function() {
        Election.deployed().then(instance => {
            electionInstance = instance;
            return electionInstance.candidates(1);
        }).then(candidate => {
            assert.equal(candidate[0], 1, "contains correct id");
            assert.equal(candidate[1], "Candidate 1", "contains correct name");
            assert.equal(candidate[2], 0, "contains correct votes count");

            return electionInstance.candidates(2);
        }).then(candidate => {
            assert.equal(candidate[0], 1, "contains correct id");
            assert.equal(candidate[1], "Candidate 2", "contains correct name");
            assert.equal(candidate[2], 0, "contains correct votes count");
        })
    });

    it('Allows a voter to cast a vote', function() {
        return Election.deployed().then(instance => {
            electionInstance = instance;
            candidateId = 1;
            return electionInstance.vote(candidateId, { from: accounts[0] })
        })
            .then(receipt => {
                return electionInstance.voters(accounts[0])
            })
            .then(voted => {
                assert(voted, 'the voter was marked as voted');
                return electionInstance.candidates(candidateId);
            })
            .then(candidate => {
                let voteCount = candidate[2];
                assert.equal(voteCount, 1, "increments the candidate's vote count");
            })
    });

    it('Throw an exception for invalid candidates', function() {
        return Election.deployed().then(instance => {
            electionInstance = instance;
            return electionInstance.vote(99, { from: accounts[1] })
        }).then(assert.fail).catch(err => {
            assert(err.message.indexOf('revert') >= 0, 'error message must contain revert');
            return electionInstance.candidates(1);
        }).then(candidate1 => {
            const voteCount = candidate1[2];
            assert.equal(voteCount, 1, 'Candidate1 did not receive any votes');
            return electionInstance.candidates(2);
        }).then(candidate2 => {
            const voteCount = candidate2[2];
            assert.equal(voteCount, 0, 'Candidate2 did not receive any votes');
        })
    });
});