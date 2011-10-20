/////////////////////////////////////////////////////////////////////////////
// HE master namespace
/////////////////////////////////////////////////////////////////////////////

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

/////////////////////////////////////////////////////////////////////////////
// TF Extensions
/////////////////////////////////////////////////////////////////////////////

(function(TF_Extensions) {

  var TF_Public = HE.module('TF_Public');

  Backbone.Router.prototype.render_view = function(view_name, callback) {
    if (!TF_Public.views[view_name]) { console.log(view_name + " view not defined"); return; }

    if (TF_Public.currentView !== TF_Public.views[view_name]) {
        TF_Public.currentView = TF_Public.views[view_name];
        $('#main').empty().append(TF_Public.currentView.el);
    }
    
    if (!TF_Public.currentView.model) {
      callback.call(this);
    } else {
      callback.call(this, TF_Public.currentView.model);
    }
  };
    
})(HE.module("TF_Extensions"));


/////////////////////////////////////////////////////////////////////////////
// TF Core
/////////////////////////////////////////////////////////////////////////////

(function(TF_Core) {

  var UserModel = Backbone.Model.extend({
    defaults: {},
    idAttribute: 'username',
    urlRoot : '/ajax/user/'
  });

  var SearchModel = Backbone.Model.extend({
    defaults: {},
    idAttribute: 'query',
    urlRoot : '/ajax/search/'
  });

  TF_Core.models.user = new UserModel();
  TF_Core.models.search = new SearchModel();

})(HE.module("TF_Core"));

/////////////////////////////////////////////////////////////////////////////
// TF Public
/////////////////////////////////////////////////////////////////////////////

(function(TF_Public) {

  var TF_Core = HE.module("TF_Core");

  // URL Routing
  var TF_Router = Backbone.Router.extend({
      routes: {
        "user/:username":        "user",
        "search/:query":         "search",
        "*actions":              "home"
      },

      search: function(query) {
          this.render_view('searchView', function (model) {
              model.set({'query': query}, {silent: true});
              model.fetch();console.log(this);
          });
      },

      user: function(username) {
          this.render_view('userView', function (model) {
              model.set({'username': username}, {silent: true});
              model.fetch();
          });
      },

      home: function () {
          this.navigate("user/jbieber", true);
      }
  });

  // Master Layout Display
  var LayoutView = Backbone.View.extend({

    el : $('header'),

    search_input : 'input[name="q"]',
    search_button : 'button',

    events: {
      'onSearch': "search"
    },

    initialize: function () {
        this.render();
    },

    render: function() {
        $(this.el).empty();

        $(this.el).append($('#template-header').tmpl());

        this.$(this.search_input).keydown(_.bind(function (e) {
            if (e.keyCode == 13) {
                $(this.el).trigger('onSearch');
            }
        }, this));

        this.$(this.search_button).click(_.bind(function () {
            $(this.el).trigger('onSearch');
        }, this));

        return this;
    },

    search: function() {
        var route = "search/" + encodeURIComponent(this.$(this.search_input).val());
        TF_Public.router.navigate(route, true);
    }

  });

  // Display a Tweet Stream
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
            _.defer(_.bind(function (i) {
                var tweet = tweets[i];
                this.$('.stream').append($('#template-item-tweet').tmpl({
                    message: tweet.msg,
                    options: tweet.created_by
                }));
            }, this, i));
        }

        return this;
    }

  });

  // Initialize
  TF_Public.router = new TF_Router;
  TF_Public.views.layoutView = new LayoutView();
  TF_Public.views.searchView = new StreamView({model: TF_Core.models.search});
  TF_Public.views.userView = new StreamView({model: TF_Core.models.user});

})(HE.module("TF_Public"));

/////////////////////////////////////////////////////////////////////////////
// Bootstrap
/////////////////////////////////////////////////////////////////////////////

$(document).ready( function () {
   Backbone.history.start({pushState: true});
});