(function() {
  'use strict';

  var chato = angular.module('chato', []);

  chato.directive('chatoApp', function () {
      return {
          restrict: 'E',
          scope: {},
          replace: true,
          template:
                  '<div class="chato-app">' +
                      '<chato-connect-form' +
                          ' connection-state="connectionState"' +
                          ' on-connect-submit="onConnectSubmit"' +
                          ' on-disconnect-submit="onDisconnectSubmit">' +
                      '</chato-connect-form>' +
                      '<div ng-if="connectionState.isConnected">' +
                          '<chato-thread-form on-thread-submit="onThreadSubmit">' +
                          '</chato-thread-form>' +
                          '<hr />' +
                          '<chato-thread thread="thread"' +
                              ' username="connectionState.username"' +
                              ' url="connectionState.url"' +
                              ' ng-repeat="thread in threads">' +
                          '</chato-thread>' +
                      '</div>' +
                  '</div>',
          controller: function ($scope, $http) {
              var threadPollingRef;
              $scope.connectionState = {
                  url: 'http://localhost/api',
                  username: '',
                  isConnected: false,
                  isConnecting: false
              };
              $scope.threads = [];
              $scope.onConnectSubmit = function () {
                  if ($scope.connectionState.url === '' || $scope.connectionState.username === '') {
                      return;
                  }
                  $scope.connectionState.isConnecting = true;
                  $http.get($scope.connectionState.url + '/threads')
                          .success(function (threads) {
                              var i = 0, len = threads.length, thread;
                              $scope.threads = [];
                              for (; i < len; i += 1) {
                                  thread = {title: threads[i], messages: []};
                                  $scope.threads.push(thread);
                              }
                              $scope.connectionState.isConnecting = false;
                              $scope.connectionState.isConnected = true;

                              threadPollingRef = setInterval(function () {
                                  $http.get($scope.connectionState.url + '/threads')
                                          .success(function (currentThreads) {
                                              var i = 0, len = currentThreads.length, thread;
                                              $scope.threads = $scope.threads.filter(function(thread) {
                                                  return currentThreads.some(function(t) {return t === thread.title;});
                                              });
                                              for (; i < len; i += 1) {
                                                  thread = currentThreads[i];
                                                  if (!$scope.threads.some(function(t) {return t.title === thread;})) {
                                                      $scope.threads.push({title: thread, messages: []});
                                                  }
                                              }
                                          });
                              }, 3000);
                          });
              };
              $scope.onDisconnectSubmit = function () {
                  $scope.connectionState.isConnected = false;
                  $scope.threads = [];
                  clearInterval(threadPollingRef);
              };
              $scope.onThreadSubmit = function (threadName) {
                  $http.post($scope.connectionState.url + '/threads', {threadName: threadName});
                  $scope.threads.push({title: threadName, messages: []});
              };
              $scope.$on('$destroy', function() {
                  clearInterval(threadPollingRef);
              });
              $scope.onConnectSubmit();
          }
      };
  });

  chato.directive('chatoConnectForm', function () {
      return {
          restrict: 'E',
          scope: {
              connectionState: '=',
              onConnectSubmit: '=',
              onDisconnectSubmit: '='
          },
          replace: true,
          template:
                  '<div class="chato-connect-form" ng-class="{\'connected\':connectionState.isConnected}">' +
                      '<div ng-if="!connectionState.isConnected">' +
                          '<label>URL:</label>' +
                          '<input ng-model="connectionState.url" placeholder="URL" ng-disabled="connectionState.isConnecting"></input>' +
                          '<label>Username:</label>' +
                          '<input ng-model="connectionState.username" placeholder="Username" ng-disabled="connectionState.isConnecting"></input>' +
                          '<button ng-click="connect()" ng-disabled="connectionState.isConnecting">' +
                              '<span ng-if="!connectionState.isConnecting">Connect</span>' +
                              '<span ng-if="connectionState.isConnecting">Connecting...</span>' +
                          '</button>' +
                      '</div>' +
                      '<div ng-if="connectionState.isConnected">' +
                          'Connected at "{{connectionState.url}}" as "{{connectionState.username}}".' +
                          '<button ng-click="disconnect()">Disconnect</button>' +
                      '</div>' +
                  '</div>',
          controller: function ($scope) {
              $scope.connect = function () {
                  $scope.onConnectSubmit();
              };
              $scope.disconnect = function () {
                  $scope.onDisconnectSubmit();
              };
          }
      };
  });

  chato.directive('chatoThreadForm', function () {
      return {
          restrict: 'E',
          state: {
              onThreadSubmit: '='
          },
          replace: true,
          template:
                  '<div class="chato-thread-form">' +
                      '<label>Thread name:</label>' +
                      '<input ng-model="threadName" placeholder="Thread name"></input>' +
                      '<button ng-click="submitThread()">Create new thread</button>' +
                  '</div>',
          controller: function ($scope) {
              $scope.threadName = '';
              $scope.submitThread = function () {
                  $scope.onThreadSubmit($scope.threadName);
              };
          }
      };
  });

  chato.directive('chatoThread', function () {
      return {
          restrict: 'E',
          scope: {
              thread: '=',
              url: '=',
              username: '='
          },
          replace: true,
          template:
                  '<div class="chato-thread">' +
                      '<chato-title title="thread.title"></chato-title>' +
                      '<chato-messages messages="thread.messages"></chato-messages>' +
                      '<chato-message-form on-message-submit="onMessageSubmit"></chato-form>' +
                  '</div>',
          controller: function ($scope, $http) {
              var pollingRef, pollingFn;
              $scope.onMessageSubmit = function (message) {
                  var data = {username: $scope.username, message: message};
                  $scope.thread.messages.push($scope.username + ': ' + message);
                  $http.post($scope.url + '/threads/' + encodeURIComponent($scope.thread.title), data);
              };
              pollingFn = function () {
                  $http.get($scope.url + '/threads/' + encodeURIComponent($scope.thread.title))
                          .success(function (messages) {
                              $scope.thread.messages = messages;
                          });
              };
              pollingRef = setInterval(pollingFn, 2000);
              pollingFn();
              $scope.$on('$destroy', function () {
                  clearInterval(pollingRef);
              });
          }
      };
  });

  chato.directive('chatoTitle', function () {
      return {
          restrict: 'E',
          scope: {
              title: '='
          },
          replace: true,
          template:
                  '<div class="chato-title"><h1>{{title}}</h1></div>'
      };
  });

  chato.directive('chatoMessages', function () {
      return {
          restrict: 'E',
          scope: {
              messages: '='
          },
          replace: true,
          template:
                  '<div class="chato-messages">' +
                      '<p ng-repeat="message in messages track by $index">{{message}}</p>' +
                  '</div>'
      };
  });

  chato.directive('chatoMessageForm', function () {
      return {
          restrict: 'E',
          scope: {
              onMessageSubmit: '='
          },
          replace: true,
          template:
                  '<div class="chato-message-form">' +
                      '<form ng-submit="submitMessage()">' +
                        '<input ng-model="message" placeholder="Type your message ..."></input>' +
                        '<button type="submit">Send</button>' +
                      '</form>' +
                  '</div>',
          controller: function ($scope) {
              $scope.message = '';
              $scope.submitMessage = function () {
                  $scope.onMessageSubmit($scope.message);
                  $scope.message = '';
              };
          }
      };
  });

}());
