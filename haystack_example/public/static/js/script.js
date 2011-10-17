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
        $('#main').html(query);
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

    _search_input : 'input[name="q"]',
    _search_button : 'button',

    events: {
      'onSearch': "search"
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
            
            this.find('.stream').append($('#template-item-tweet').tmpl(data));
        }

        // Custom Events
        var self = this;

        this.find(this._search_input).keydown(function (e) {
            if (e.keyCode == 13) {
                $(self.el).trigger('onSearch');
            }
        });

        this.find(this._search_button).click(function () {
            $(self.el).trigger('onSearch');
        });

        return this;
    },

    search: function() {
        var route = "search/" + this.find(this._search_input).val();
        TweetFeed.router.navigate(route, true);
    }

  });

})(HE.module("TweetFeed"));

$(document).ready( function () {
   Backbone.history.start({pushState: true});
   TweetFeed = HE.module("TweetFeed");
});