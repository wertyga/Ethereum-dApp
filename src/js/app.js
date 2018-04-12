App = {
  web3Provider: null,
  contracts: {},

  init: function() {
    return App.initWeb3();
  },

  initWeb3: function() {
    if(typeof web3 !== 'undefined') {
      App.web3Provider = web3.currentProvider;
      web3 = new Web3(web3.currentProvider);
    }


    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Election.json', election => {
      App.contracts.Election = TruffleContract(election);
      App.contracts.Election.setProvider(App.web3Provider);

      return App.render();
    });
  },

  render: function() {
    let electionInstance;
    let loader = $('#loader');
    let content = $('#content');

    loader.show();
    content.hide();

    //Load account data
    web3.eth.getCoinbase((err, account) => {
      if(err === null) {
        App.account = account;
        $('#accountAddress').html('Your account is: ' + account);
      }
    });

    //Load contract data
    App.contracts.Election.deployed().then(instance => {
      electionInstance = instance;
      return electionInstance.candidatesCount();
    }).then(candidatesCount => {
      const candidatesResults = $('#candidatesResults');
      candidatesResults.empty();

      var candidatesSelect = $('#candidatesSelect');
      candidatesSelect.empty();

      for(let i = 1; i <= candidatesCount; i++) {
        electionInstance.candidates(i).then(candidate => {
          let id = candidate[0];
          let name = candidate[1];
          let voteCount = candidate[2];

          // Render candidate Result
          var candidateTemplate = "<tr><th>" + id + "</th><td>" + name + "</td><td>" + voteCount + "</td></tr>";
          candidatesResults.append(candidateTemplate);

          // Render candidate ballot option
          var candidateOption = "<option value='" + id + "' >" + name + "</ option>"
          candidatesSelect.append(candidateOption);
        })
      };

      return electionInstance.voters(App.account);
    })
        .then(hasVoted => {
          if(hasVoted) {
            $('form').hide();
          };

          loader.hide();
          content.show();
        })
        .catch(err => {
          loader.hide();
          console.warn(err);
        })
  },

  castVote: function() {
      let candidateId = $('#candidatesSelect').val();
      App.contracts.Election.deployed()
          .then(instance => {
            return instance.vote(candidateId, { from: App.account })
          })
          .then(result => {
            $('#loader').hide();
            $('#content').show();
          })
          .catch(err => {
            console.error(err);
          })
  }

};

$(function() {
  $(window).load(function() {
    App.init();
  });
});
