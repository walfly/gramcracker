Players = new Meteor.Collection('players');
Rounds = new Meteor.Collection('rounds');
Hashtags = new Meteor.Collection('hashtags');
Prompts = new Meteor.Collection('prompts');

if (Meteor.isClient) {


  Template.App.username = function(){
    return Session.get('username');
  };

  Template.App.rounds = function(){
    return Rounds.find().count() > 0;
  };

  Template.App.enoughPlayers = function(){
    return Players.find().count() > 3;
  };

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

  Template.judgeBoard.submissions = function(){
    var submissions = Rounds.findOne({id: Rounds.find().count() - 1}).submissions;
    return submissions;
  }
  
  Template.judgeBoard.remains = function(){
    var submissions = Rounds.findOne({id: Rounds.find().count() - 1}).submissions;
    return Players.find().count() - submissions.length;
  }

  Template.image.url = function(){
    console.log(this);
  }

  Template.playerBoard.hashterg = function(){
    var playershashers = Players.findOne({username: Session.get('username')}).hashes;
    var result = [];
    for(var i in playershashers){
      if(playershashers[i]){
        result.push(i);
      }
    }
    console.log(result);
    return result;
  };


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
          isJudge: false});
      });
    }
  });

  Template.start.events({
    'click button': function(){

      Meteor.call('getPrompt', function(error, result){
        prompt = result;
        Rounds.insert({
          id: Rounds.find().count(),
          prompt: prompt,
          submissions: [],
          winner: {}
        });
      });
      Meteor.call('setFirstJudge');
    }
  });

}

Meteor.methods({
  setFirstJudge: function () {
    Players.update({id: 0}, {$set: {isJudge: true}});
  },
  deal: function() {
    var tags = Hashtags.findOne().hashtags;
    var hand = {};
    for(var i = 0; i < 5; i++){
      hand[tags.pop()] = true;
    }
    Hashtags.update({}, {$set: {hashtags: tags}});
    return hand;
  },
  getPrompt: function() {
    var prompts = Prompts.findOne().prompts;
    prompt = prompts.pop();
    Prompts.update({}, {$set: {prompts: prompts}});
    return prompt;
  }
});

if (Meteor.isServer) {
  Meteor.startup(function () {
    Players.remove({});
    Rounds.remove({});
    Hashtags.remove({});
    Prompts.remove({});

    if (Prompts.find().count() === 0) {
      var prompts = [
        "Why can't I sleep at night?",
        "What's that smell?",
        "What ended my last relationship?",
        "MTV's new reality show features eight washed-up celebrities living with _____",
        "During sex, I like to think about _____",
        "What are my parents hiding from me?",
        "What will I bring back in time to convince people that I am a powerful wizard?",
        "But before I kill you, Mr. Bond, I must show you _____",
        "What did Vin Diesel eat for dinner?",
        "Why am I sticky?",
        "What's the new fad diet?",
        "What's my anti-drug?",
        "What never fails to liven up the party?",
        "What am I giving up for lent?",
        "In Michael Jackson's final moments, he thought about _____",
        "Daddy, why is Mommy crying?"
      ];
      Prompts.insert({prompts: prompts});
    }

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
