if (Meteor.isClient) {
  Template.hello.greeting = function () {
    return "Welcome to grahamcracker.";
  };

  Template.hello.events({
    'click input' : function () {
      window.open("https://api.instagram.com/oauth/authorize/?client_id=9bc60db22405424197bb2a287063e5f6&redirect_uri=http://gramcracker.meteor.com/_oauth/instagram&response_type=code", "instagram");
      if (typeof console !== 'undefined')
        console.log("You pressed the button");
    }
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup
  });
}
