(function() {
  'use strict';

  var ThreadMessage = Backbone.Model.extend({

      }),
      ThreadMessages = Backbone.Collection.extend({
        model: ThreadMessage,
        url: function() {
          // Did not work, is sending a GET to undefined
          return 'http://localhost/api/threads/' + encodeURIComponent(this.threadName);
        }
      }),

      ChatThread = Backbone.Model.extend({

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
      chatThreads = new ChatThreads(),
      threadMessages = new ThreadMessages({threadName:'bar'});

  chatoApp.render();

  chatThreads.fetch();

  var fooThread = chatThreads.create({threadName: 'foo'});

  threadMessages.fetch();
}());
