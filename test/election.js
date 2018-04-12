const Election = artifacts.require('./Election');

contract("Election", function(accounts) {
    let electionEnstance;

    it("Initialize with two candidates", function() {
        return Election.deployed().then(instance => {
            return instance.candidatesCount();
        }).then(count => {
            assert.equal(count, 2);
        });
    });

    it("Initialize candidates with correct properties", function() {
        Election.deployed().then(instance => {
            electionEnstance = instance;
            return electionEnstance.candidates(1);
        }).then(candidate => {
            assert.equal(candidate[0], 1, "contains correct id");
            assert.equal(candidate[1], "Candidate 1", "contains correct name");
            assert.equal(candidate[2], 0, "contains correct votes count");

            return electionEnstance.candidates(2);
        }).then(candidate => {
            assert.equal(candidate[0], 1, "contains correct id");
            assert.equal(candidate[1], "Candidate 2", "contains correct name");
            assert.equal(candidate[2], 0, "contains correct votes count");
        })

    });
});