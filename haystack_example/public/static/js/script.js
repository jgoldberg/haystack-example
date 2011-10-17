var HE = {
 module: function() {
    var modules = {};

    return function(name) {
      if (modules[name]) {
        return modules[name];
      }

      return modules[name] = { Views: {}, models: {} };
    };
  }()
};

(function(TweetFeed) {

  var TweetFeedRouter = Backbone.Router.extend({
      routes: {
        "user/:username":        "user",
        "*actions":              "home"
      },

      user: function(username) {
          TweetFeed.models.user = new UserModel({username: username});
          TweetFeed.userView = new UserView({model:TweetFeed.models.user});
          TweetFeed.models.user.fetch();

          $('#main').append(TweetFeed.userView.el);
      },

      home: function () {
          this.navigate("user/jbieber", true);
      }
  });

  TweetFeed.router = new TweetFeedRouter;

  var UserModel = Backbone.Model.extend({
    defaults: {},

    url : function () {
        return '/ajax/user/' + this.get('username');
    }
  });

  var UserView = Backbone.View.extend({

    el : $('#main-content'),

    events: {
      //"click .icon":          "open",
      //"click .button.edit":   "openEditDialog",
      //"click .button.delete": "destroy"
    },

    initialize: function () {
        this.model.bind('change', this.render, this);
    },

    render: function() {
        json = this.model.toJSON();

        $(this.el).append($('#template-page-user').tmpl());

        for (var i=0; i<json.tweets.length; i++) {
            var tweet = json.tweets[i];
            
            var data = {
                message: tweet.msg,
                options: tweet.created_by
            }
            
            $(this.el).find('.stream').append($('#template-item-tweet').tmpl(data));
        }

        //return this;
    }

  });

})(HE.module("TweetFeed"));

$(document).ready( function () {
   Backbone.history.start({pushState: true});
   TweetFeed = HE.module("TweetFeed");
});