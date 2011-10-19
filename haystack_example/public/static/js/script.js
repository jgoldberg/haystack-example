var HE = {
 module: function() {
    var modules = {};

    return function(name) {
      if (modules[name]) {
        return modules[name];
      }

      return modules[name] = { views: {}, models: {} };
    };
  }()
};

(function(TF_Core) {

  var UserModel = Backbone.Model.extend({
    defaults: {},

    url : function () {
        return '/ajax/user/' + encodeURIComponent(this.get('username'));
    }
  });

  var SearchModel = Backbone.Model.extend({
    defaults: {},

    url : function () {
        return '/ajax/search/' + encodeURIComponent(this.get('query'));
    }
  });

  TF_Core.models.user = new UserModel();
  TF_Core.models.search = new SearchModel();

})(HE.module("TF_Core"));

(function(TF_Public) {

  var TF_Core = HE.module("TF_Core");

  var TF_Router = Backbone.Router.extend({
      routes: {
        "user/:username":        "user",
        "search/:query":         "search",
        "*actions":              "home"
      },

      search: function(query) {
          var model = TF_Core.models.search.set({'query': query});

          TF_Public.views.searchView = new StreamView({model: model});

          model.fetch();
          
          $('#main').empty().append(TF_Public.views.searchView.el);
      },

      user: function(username) {
          var model = TF_Core.models.user.set({'username': username});

          TF_Public.views.userView = new StreamView({model: model});

          model.fetch();

          $('#main').empty().append(TF_Public.views.userView.el);
      },

      home: function () {
          this.navigate("user/jbieber", true);
      }
  });

  var LayoutView = Backbone.View.extend({

    el : $('header'),

    _search_input : 'input[name="q"]',
    _search_button : 'button',

    events: {
      'onSearch': "search"
    },

    initialize: function () {},

    render: function() {
        $(this.el).empty();

        $(this.el).append($('#template-header').tmpl());

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
        var route = "search/" + encodeURIComponent(this.$(this._search_input).val());
        TF_Public.router.navigate(route, true);
    }

  });

  var StreamView = Backbone.View.extend({

    id : 'search-view-page',

    events: {},

    initialize: function () {
        this.model.bind('change', this.render, this);
    },

    render: function() {
        $(this.el).empty();

        $(this.el).append($('#template-stream-page').tmpl());

        var tweets = this.model.get('tweets');
        for (var i=0; i<tweets.length; i++) {
            var tweet = tweets[i];
            
            this.$('.stream').append($('#template-item-tweet').tmpl({
                message: tweet.msg,
                options: tweet.created_by
            }));
        }

        return this;
    }

  });

  TF_Public.router = new TF_Router;
  TF_Public.views.layoutView = new LayoutView();
  TF_Public.views.layoutView.render();

})(HE.module("TF_Public"));

$(document).ready( function () {
   Backbone.history.start({pushState: true});
});