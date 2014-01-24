# Sara.js

A JavaScript framework that unites the server and client.

## What makes Sara so great?

Well, she's...

+ a single app that runs in servers and browsers (isomorphic)
+ SEO-friendly (pre-renders your views)
+ skinny (20kb client-side)
+ a node framework at heart (`npm install sara --save`)

## Example

How about a todo list app with...

+ AngularJS views
+ Data persistence
+ RethinkDB storage
+ SEO pre-rendering
+ WebSocket synchronization

See [the sara-angular example](https://github.com/JacksonGariety/Sara/tree/master/examples/sara-angular-example).

## Antipatterns

Due to the originality of Sara's client/server realtionship, there are a few "gotchas" when building apps with her.

1. NEVER include inline nor external scripts in your templates. All logic should be `require()`'d from within your Sara app.

## Development

To start the example app from a clone of this repo:

1. `$ npm install` to install Sara's dependencies
2. `cd examples/sara-angular-example; npm install;` to install the example's dependencies
3. ` cd ../..; gulp;` to serve the example app

## Testing

Lint/test your code by running...

    $ gulp

...from inside of the repo.
