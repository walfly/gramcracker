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
                    'jj_forum',
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
                    'jj',
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
                    'hot',
                    'baby',
                    'instagramers',
                    'black',
                    'art',
                    'instalove',
                    'zaynmalik',
                    'party',
                    'night',
                    'best',
                    'music',
                    'louistomlinson',
                    'beach',
                    'nature',
                    'liampayne',
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
                    'onedirection',
                    'adorable',
                    'white',
                    'birthday',
                    'followback',
                    'friend',
                    '10likes',
                    'likeforlike',
                    'gang_family',
                    'boyfriend'];
      for(var i = 0; i < hashes.length; i++){
        Hashtags.insert({id: i, hashtag: hashes[i]});
      }
    }
  });
}
