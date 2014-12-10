CHATO
=====

Comparing JavaScript frameworks to develop the frontend of a chat-like application.

Architecture
------------

The application is quite simple in order to focus the efforts on testing the JavaScript frameworks.

All chat state is served by a REST API.

- `GET /api/threads` will list all thread names.
- `GET /api/threads/{threadName}` will list all messages in this thread.
- `POST /api/threads '{"threadName":"foo"}'` will create a new thread with the name "foo".
- `POST /api/threads/{threadName} '{"username":"foo","message":"bar"}'` will add a new message "bar" by user "foo" at thread `{threadName}`.

Running
-------

Run from the command line: `mvn clean package exec:java`

Only AngularJS implementation is available yet. Check it out at [localhost/angular/chato-angular.html](http://localhost:80/angular/chato-angular.html).

Restrictions
------------

The code for the application should be self-contained and easy to add to an existing page:

1. Single JavaScript file to include, no extra files.
2. Should not add anything to the global object, the code may bind itself to an element by `id` if needed.
