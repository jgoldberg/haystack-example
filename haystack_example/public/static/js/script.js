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
  var TF_Core = HE.module('TF_Core');

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

  TF_Public.init_router = function(clazz) {
    TF_Public.router = new clazz;
  }

  TF_Public.init_view = function(view_name, clazz, options) {
    options = options || {};
    TF_Public.views[view_name] = new clazz(options);
  };

  TF_Core.init_model = function(model_name, clazz, options) {
    options = options || {};
    TF_Core.models[model_name] = new clazz(options);
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

  TF_Core.init_model('user', UserModel);
  TF_Core.init_model('search', SearchModel);

})(HE.module("TF_Core"));

/////////////////////////////////////////////////////////////////////////////
// TF Public
/////////////////////////////////////////////////////////////////////////////

(function(TF_Public) {

  var TF_Core = HE.module("TF_Core");

  // URL Routing
  var TF_Router = Backbone.Router.extend({
      routes: {
        "user/:username":        "page_user",
        "search/:query":         "page_search",
        "*actions":              "page_home"
      },

      page_search: function(query) {
          this.render_view('searchView', function (model) {
              model.set({'query': query}, {silent: true});
              model.fetch();
          });
      },

      page_user: function(username) {
          this.render_view('userView', function (model) {
              model.set({'username': username}, {silent: true});
              model.fetch();
          });
      },

      page_home: function () {
          this.render_view('homeView', function (model) {
              model.set({'query': ""}, {silent: true});
              model.fetch();
          });
      }
  });

  // Master Layout Display
  var LayoutView = Backbone.View.extend({

    el : $('header'),

    search_input : 'input[name="q"]',
    search_button : 'button',

    events: {
      'search': "onSearch"
    },

    initialize: function () {
        this.render();
    },

    render: function() {
        console.log("Rendering Layout");
        $(this.el).empty();

        $(this.el).append($('#template-header').tmpl());

        this.$(this.search_input).keydown(_.bind(function (e) {
            if (e.keyCode == 13) {
                $(this.el).trigger('search');
            }
        }, this));

        this.$(this.search_button).click(_.bind(function () {
            $(this.el).trigger('search');
        }, this));

        return this;
    },

    onSearch: function() {
        var query = encodeURIComponent(this.$(this.search_input).val());
        TF_Public.router.navigate("search/" + query, true);
    }

  });

  // Display a Tweet Stream
  var StreamView = Backbone.View.extend({

    id : 'search-view-page',

    events: {
        'click a.link-user': "onChangeUser"
    },

    initialize: function () {
        this.model.bind('change', this.render, this);
    },

    render: function() {
        console.log("Render");
        $(this.el).empty();

        $(this.el).append($('#template-stream-page').tmpl());

        var tweets = this.model.get('tweets');
        for (var i=0; i<tweets.length; i++) {
            _.defer(_.bind(function (i) {
                var tweet = tweets[i];
                this.$('.stream').append($('#template-item-tweet').tmpl({
                    message: tweet.msg,
                    author: tweet.created_by
                }));
            }, this, i));
        }

        //this.delegateEvents();
    },

    onChangeUser: function (e) {
        e.preventDefault();
        var username = $(e.currentTarget).data('username');
        TF_Public.router.navigate("user/" + username, true);
    }

  });

  // Initialize
  TF_Public.init_router(TF_Router);

  TF_Public.init_view('layoutView', LayoutView);
  TF_Public.init_view('searchView', StreamView, {model: TF_Core.models.search});
  TF_Public.init_view('userView', StreamView, {model: TF_Core.models.user});
  TF_Public.init_view('homeView', StreamView, {model: TF_Core.models.search});

})(HE.module("TF_Public"));

/////////////////////////////////////////////////////////////////////////////
// Bootstrap
/////////////////////////////////////////////////////////////////////////////

$(document).ready( function () {
   Backbone.history.start({pushState:true});
});