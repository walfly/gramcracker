if (Meteor.isClient) {


  Template.App.username = function(){
    return Session.get('username');
  };

  Template.App.judge = function(){
    return Session.get('username') === "judge";
  };

  Template.login.events({
    'click button': function(){
      var username = document.getElementById("submitUsername").value;
      Session.set("username", username);
      Session.set("player", true);
    }
  });

}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
