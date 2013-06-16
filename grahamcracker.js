Players = new Meteor.Collection('players');
Rounds = new Meteor.Collection('rounds');
Hashtags = new Meteor.Collection('hashtags');
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
  
  Template.judgeBoard.prompt = function(){
    return Rounds.findOne({id: Rounds.find().count() - 1}).prompt;
  }

  Template.login.events({
    'click button': function(){
      var username = document.getElementById("submitUsername").value;
      var hand;
      Meteor.call('deal', function(error, result){
        hand = result;
        Session.set("username", username);
        Players.insert({
          id: Players.find().count(),
          username: username, 
          score: 0,
          hashes: hand, 
          accessToken: '44947478.9bc60db.7d906225574340669fc0f9b21a6e9523', 
          isJudge: false})
      });
    } 
  });

  Template.start.events({
    'click button': function(){
      Rounds.insert({
        submissions: {},
        winner: {}
      });
      Meteor.call('setFirstJudge');
    }
  })

}

Meteor.methods({
  setFirstJudge: function () {
    Players.update({id: 0}, {$set: {isJudge: true}});
  },
  deal: function(){
    var tags = Hashtags.findOne().hashtags;
    var hand = {};
    for(var i = 0; i < 5; i++){
      hand[tags.pop()] = true;
    }
    Hashtags.update({}, {$set: {hashtags: tags}});
    return hand;
  }
})

if (Meteor.isServer) {
  Meteor.startup(function () {
    Players.remove({});
    Rounds.remove({});
    Hashtags.remove({});

    if(Hashtags.find().count() === 0) {
      var hashes = [ 'love',
                    'instagood',
                    'me',
                    'cute',
                    'tbt',
                    'eyes',
                    'statigram',
                    'throwbackthursday',
                    'photooftheday',
                    'nice',
                    'follow',
                    'beautiful',
                    'happy',
                    'all_shots',
                    'harrystyles',
                    'girl',
                    'instamood',
                    'picoftheday',
                    'instadaily',
                    'niallhoran',
                    'instago',
                    'igers',
                    'yolo',
                    'like',
                    'followme',
                    'fashion',
                    'fun',
                    'smile',
                    'bestoftheday',
                    'iphonesia',
                    'summer',
                    'nofilter',
                    'food',
                    'friends',
                    'lol',
                    'sun',
                    'instagramhub',
                    'iphoneonly',
                    'sky',
                    'webstagram',
                    'pretty',
                    'picstitch',
                    'tweegram',
                    'my',
                    'hair',
                    'hack',
                    'bored',
                    'life',
                    'swag',
                    'cool',
                    'funny',
                    'igdaily',
                    'family',
                    'repost',
                    'photo',
                    'pink',
                    'amazing',
                    'blue',
                    'girls',
                    'dawg',
                    'baby',
                    'instagramers',
                    'black',
                    'art',
                    'instalove',
                    'marilynmanson',
                    'party',
                    'night',
                    'best',
                    'music',
                    'dude',
                    'beach',
                    'nature',
                    'indaclub',
                    'i',
                    'awesome',
                    'instacollage',
                    'blonde',
                    'bestfriends',
                    '1d',
                    'puppy',
                    'dog',
                    'flowers',
                    'work',
                    'style',
                    'red',
                    'instacool',
                    'makeup',
                    'shoes',
                    'insta',
                    'surf',
                    'adorable',
                    'white',
                    'birthday',
                    'followback',
                    'friend',
                    '10likes',
                    'likeforlike',
                    'gang_family',
                    'boyfriend'];
      Hashtags.insert({hashtags: hashes});
    }
  });
}
