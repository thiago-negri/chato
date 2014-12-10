(function() {
  'use strict';

  var ThreadMessage = Backbone.Model.extend({

      }),
      ThreadMessages = Backbone.Collection.extend({
        initialize: function(options) {
          this.threadName = options.threadName;
        },
        model: ThreadMessage,
        url: function() {
          return 'http://localhost/api/threads/' + encodeURIComponent(this.threadName);
        }
      }),

      ChatThread = Backbone.Model.extend({
        initialize: function(options) {
          this.threadName = options.threadName;
          this.messages = new ThreadMessages({threadName: this.threadName});
        },
        urlRoot: 'http://localhost/api/threads'
      }),
      ChatThreads = Backbone.Collection.extend({
        model: ChatThread,
        url: 'http://localhost/api/threads'
      }),

      ChatoApp = Backbone.View.extend({
        className: 'chato-app',
        template: _.template('Hello, World!'),
        render: function() {
          this.$el.html(this.template());
          return this;
        }
      }),
      chatoAppElement = document.getElementById('chatoApp'),
      chatoApp = new ChatoApp({el: chatoAppElement}),
      chatThreads = new ChatThreads();

  chatoApp.render();

  chatThreads.fetch();

  var fooThread = chatThreads.create({threadName: 'foo'});

  setTimeout(function() { fooThread.fetch(); }, 1000);
  setTimeout(function() { fooThread.save({username: 'thiagon', message: 'Hello, world!'}, {patch: true}); }, 2000);
  setTimeout(function() { fooThread.save({username: 'thiagon', message: 'Hello, fuckers!'}, {patch: true}); }, 3000);
  setTimeout(function() { console.log(fooThread.get('username')); }, 4000);
  setTimeout(function() { console.log(fooThread.get('messages')); }, 4500);
}());
