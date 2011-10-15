var TweetFeed = {
 module: function() {
    var modules = {};

    return function(name) {
      if (modules[name]) {
        return modules[name];
      }

      return modules[name] = { Views: {} };
    };
  }()
};

(function(ViewUser) {

  var AppRouter = Backbone.Router.extend({
      routes: {
        "user/:username":        "user",
        "*actions":         "defaultRoute"
      },

      user: function(username) {
          console.log(username);
          $('#main').html(username);
      },

      defaultRoute: function () {
          console.log("test");
          $('#main').html('home');
      }
  });

    var app_router = new AppRouter;
})(TweetFeed.module("ViewUser"));

$(document).ready( function () {
   Backbone.history.start({pushState: true});
});