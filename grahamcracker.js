Players = new Meteor.Collection('players');
Rounds = new Meteor.Collection('rounds');
if (Meteor.isClient) {


  Template.App.username = function(){
    return Session.get('username');
  };

  Template.App.rounds = function(){
    return Rounds.find().count() > 0;
  }

  Template.App.enoughPlayers = function(){
    return Players.find().count() > 3;
  }

  Template.App.player = function(){
    if(Session.get('username')){
      var judge = Players.findOne({username: Session.get('username')});
      if(!judge.isJudge && Rounds.find().count()){
        return true;
      } 
    } else {
      return false;
    }
  };

  Template.App.judge = function(){
    if(Session.get('username')){
      var judge = Players.findOne({username: Session.get('username')});
      if(judge.isJudge){
        return true;
      }
    } else {
      return false;
    }
  };

  Template.login.events({
    'click button': function(){
      var username = document.getElementById("submitUsername").value;
      Session.set("username", username);
      Players.insert({
        id: Players.find().count(),
        username: username, 
        score: 0, 
        accessToken: '44947478.9bc60db.7d906225574340669fc0f9b21a6e9523', 
        isJudge: false});
    }
  });
  Template.start.events({
    'click button': function(){
      Rounds.insert({
        submissions: {},
        winner: {}
      });
      Meteor.call('setFirstJudge', function(){
        console.log(Players.find({isJudge: false}).count());
        console.log(Rounds.find());
      });
    }
  })

}

Meteor.methods({
  setFirstJudge: function () {
    console.log('sup');
    //Players.update({}, {isJudge: false}, {multi: true});
    Players.update({id: 0}, {$set: {isJudge: true}});
  }
})

if (Meteor.isServer) {
  Meteor.startup(function () {
    Players.remove({});
    Rounds.remove({});
    // code to run on server at startup
  });
}
