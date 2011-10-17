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
        "search/:query":         "search",
        "*actions":              "home"
      },

      search: function(query) {
          //TweetFeed.models.user = new UserModel({username: username});
          //TweetFeed.userView = new UserView({model:TweetFeed.models.user});
          //TweetFeed.models.user.fetch();
          $('#main').contents().detach();
          $('#main').html(query);//l;.append(TweetFeed.userView.el);
      },

      user: function(username) {
          TweetFeed.models.user = new UserModel({username: username});
          TweetFeed.userView = new UserView({model:TweetFeed.models.user});
          TweetFeed.models.user.fetch();

          $('#main').contents().detach();
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

    _search_input : 'input[name="q"]',
    _search_button : 'button',

    events: {
      'onSearch': "search"
    },

    initialize: function () {
        this.model.bind('change', this.render, this);
    },

    render: function() {
        $(this.el).empty();

        $(this.el).append($('#template-page-user').tmpl());

        var tweets = this.model.get('tweets');
        for (var i=0; i<tweets.length; i++) {
            var tweet = tweets[i];

            this.$('.stream').append($('#template-item-tweet').tmpl({
                message: tweet.msg,
                options: tweet.created_by
            }));
        }

        // Custom Events
        var self = this;

        this.$(this._search_input).keydown(function (e) {
            if (e.keyCode == 13) {
                $(self.el).trigger('onSearch');
            }
        });

        this.$(this._search_button).click(function () {
            $(self.el).trigger('onSearch');
        });

        return this;
    },

    search: function() {
        var route = "search/" + this.$(this._search_input).val();
        TweetFeed.router.navigate(route, true);
    }

  });

})(HE.module("TweetFeed"));

$(document).ready( function () {
   Backbone.history.start({pushState: true});
   TweetFeed = HE.module("TweetFeed");
});