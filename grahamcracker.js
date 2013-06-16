Players = new Meteor.Collection('players');
Rounds = new Meteor.Collection('rounds');
Hashtags = new Meteor.Collection('hashtags');
Prompts = new Meteor.Collection('prompts');

if (Meteor.isClient) {
  Handlebars.registerHelper('debugger', function() {
    debugger;
  });

  Template.App.username = function(){
    return Session.get('username');
  };

  Template.App.rounds = function(){
    return Rounds.find().count() > 0;
  };

  Template.App.enoughPlayers = function(){
    return Players.find().count() > 1;
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


  Template.judgeBoard.prompts = function(){
    return Rounds.findOne({id: Rounds.find().count() - 1}).prompta;
  };

  Template.judgeBoard.submissions = function(){
    var submissions = Rounds.findOne({id: Rounds.find().count() - 1}).submissions;
    return submissions;
  };

  Template.judgeBoard.remains = function(){
    var submissions = Rounds.findOne({id: Rounds.find().count() - 1}).submissions;
    return Players.find().count() - submissions.length -1;
  };

  Template.search.prompts = function(){
    return Rounds.findOne({id: Rounds.find().count() - 1}).prompta;
  };

  Template.search.hasher = function() {
    return Session.get('search');
  };

  Template.search.accessToken = function() {
    return Players.findOne({username: Session.get('username')}).accessToken;
  };

  Template.search.getImages = function() {
    var hashtagQuery = Session.get('search');
    var accessToken = Players.findOne({username: Session.get('username')}).accessToken;
    console.log('hash', hashtagQuery);
    console.log('tok', accessToken);
    return $.ajax({
      url: 'https://api.instagram.com/v1/tags/'+hashtagQuery+'/media/recent?access_token='+accessToken,
      dataType: 'jsonp',
      success: function(response) {
        console.log(response);
        var $div = $('.images');
        $div.empty();
        $.each(response.data, function(index, item) {
          var $img = $('<img>').attr('src', item.images.low_resolution.url);
          $div.append($img);
        });
      },
      error: function(error) {
        return error;
      }
    });
  };

  Template.playerBoard.prompts = function(){
    return Rounds.findOne({id: Rounds.find().count() - 1}).prompta;
  };

  Template.playerBoard.submissions = function(){
    var submissions = Rounds.findOne({id: Rounds.find().count() - 1}).submissions;
    return submissions;
  };

  Template.playerBoard.remains = function(){
    var submissions = Rounds.findOne({id: Rounds.find().count() - 1}).submissions;
    return (Players.find().count() - 1) - submissions.length;
  };

  Template.image.url = function(){
    console.log(this);
  };

  Template.App.search = function() {
    var searchVal = Session.get('search');
    if(searchVal){
      return true;
    } else {
      return false;
    }
  };

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


  Template.playerBoard.judger = function(){
    return Players.findOne({isJudge: true}).username;
  }

  Template.playerBoard.chosen = function(){
    var round = Rounds.findOne({id: Rounds.find().count() - 1})
    var submissions = round.submissions
    for(var i = 0; i < submissions.length; i ++){
      if(submissions[i].username === Session.get('username')){
        return true;
      }
    }
    return false;
  };

  Template.search.events({
    'click img': function(e) {
      var submissionURL = $(e.target).attr('src');
      Meteor.call('setSubmission', submissionURL, Session.get('search'), Session.get('username'));
      Session.set('search', null);
    }
  });

  Template.playerBoard.events({
    'click button': function(e){
      var card = e.target.innerHTML.slice(1);
      Session.set('search', card);
    }
  });

  Template.judgeBoard.events({
    'click img': function(){
      var user = this.username;
      var oldJ = Players.findOne({username: Session.get('username')})
      var oldJID = oldJ._id;
      Players.update({_id: oldJID}, {isJudge: false});
      Meteor.call('updateScore', user);
      Meteor.call('getPrompt', function(error, result){
        prompt = result;
        Rounds.insert({
          id: Rounds.find().count(),
          prompta: prompt,
          submissions: [],
          winner: {}
        });
        Meteor.call('setFirstJudge');
      });
    }
  });

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
          isJudge: false
        });
      });
    }
  });

  Template.start.events({
    'click button': function(){

      Meteor.call('getPrompt', function(error, result){
        prompt = result;
        Rounds.insert({
          id: Rounds.find().count(),
          prompta: prompt,
          submissions: [],
          winner: {}
        });
        Meteor.call('setFirstJudge');
      });
    }
  });
}

Meteor.methods({
  updateScore: function (user) {
    Players.update({username: user}, {$inc: {score:1}});
  },
  setFirstJudge: function () {
    var roundNum = Rounds.find().count() - 1;
    var playerNum = Players.find().count();
    var currentJ = roundNum%playerNum;
    Players.update({id: currentJ}, {$set: {isJudge: true}});
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
  },
  setSubmission: function(imgurl, hash, username) {
    var submissions = Rounds.findOne({id: Rounds.find().count() - 1}).submissions;
    var submission = {url: imgurl, hashtag: hash, username: username};
    submissions.push(submission);
    Rounds.update({id: Rounds.find().count() - 1}, {$set: {submissions: submissions}});
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
