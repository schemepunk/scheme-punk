[![Build Status](https://travis-ci.org/thebruce/scheme-punk.svg?branch=master)](https://travis-ci.org/thebruce/scheme-punk)
[![Coverage Status](https://coveralls.io/repos/github/thebruce/scheme-punk/badge.svg?branch=master)](https://coveralls.io/github/thebruce/scheme-punk?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)

# Scheme Punk - Changing the world one schema at a time.

[![Greenkeeper badge](https://badges.greenkeeper.io/thebruce/scheme-punk.svg)](https://greenkeeper.io/)

## What is it?

Scheme Punk on NPM (Scheme Punk)[https://www.npmjs.com/package/scheme-punk]

Scheme Punk is a promise based object transformation module that
uses a mixin approach that favors composition for its read, write and
transform behaviors. It can use the config module to specify how it should connect
and use these behaviors on objects.

## Where did it come from?

Scheme Punk originated from the need to reduce repetitive and error prone
authoring tasks in JSON Schema [http://json-schema.org/] as well as the need to rewrite that schema
in other JSON formats (open API)[https://www.openapis.org/] and to use that same schema to inform and
interpret for even more JSON based utilities (postman collections)[https://www.getpostman.com/docs/collections].

## Example uses:

* Use it to fill out json schema hyper properties like enums, and regex properties based on information already in the JSON schema. (Ex: using field properties to inform query parameters)

* Use it to transform a json schema document into a json schema hyper document based on expected API behavior, paths, and information contained in your base json schema document.

* Create Open API documents from a JSON schema document.

* Use a single object format and perform different transformations to different destinations to create any number of different objects from a single source.

Even though its origin is in schema transformation, its highly configurable
behaviors can be used in any object transformation.

## How to use scheme Punk:

You create a Scheme Punk object to run a `scheme`. A scheme is made up of 3
components:

1. A source: which can be an object, an object property, or a file (quite a lot is possible through custom plugins.)
2. A transformation: prepending a value, appending a value, reducing an object to an array of keys, passing through, turning an array into a regex (again, quite a lot is possible through plugins)
3. A destination: an object, a string, a property in an existing object. (yet again, much is possible through plugins.)

```js
// require SchemePunk
const SchemePunk = require('scheme-punk');
var obj = {
  test: 'this',
  nextTest: {
    item1: 'yarp',
    item2: ['that','melchoir']
  },
  existForTesting: {
    enum: []
  }
};

// We create a scheme which is where we will operate.
// Schemes consist of the originalScheme, the activeScheme where we perform
// transformations and a newScheme the result of those transformations.
const schemePunkScheme = SchemePunk.createScheme({
  originalScheme: obj,
  activeScheme: obj
});

// See explanation of options below, but basically we want to manipulate the
// originalSchemeSource's nextTest property, an object. We want the keys from
// that object and we are going to write that to existForTesting.enum
var options = {
  source: {
    target: 'nextTest',
    plugin: 'originalSchemeSource'
  },
  destination: {
    target: 'existForTesting.enum'
  },
  transform: {
    plugin: 'objectKeysTransform'
  }
};

// We are going to perform the scheme indicated by our options against the
// scheme we are passing in. We use the enhance function to take our source
// apply the transformations we indicated and then write the result to the
// destination.
var schemePromise = new SchemePunk(options).enhance(schemePunkScheme)
.then(
  console.log(schemePunkScheme.newScheme);
)

// Result uses the objectKeysTransform transformation on the source at
// nextTest in the obj object and then writes the result to the destination.

// The Destination would look like this:
//  {
//    test: 'this',
//    nextTest: {
//      item1: 'yarp',
//      item2: ['that','melchoir']
//    },
//    existForTesting: {
//      enum: [
//        "item1",
//        "item2"
//     ]
//   }
// };
```

### Options
You specify the details of a scheme through an options object you pass to scheme punk when you instantiate the scheme punk class. Options provide information to the source, transform and destination plugins about their composition and targets.

# Example Options
```
var options = {
  source: {
    target: 'properties.data.properties.attributes.properties',
    plugin: 'originalSchemeSource'
  },
  transform: {
    plugin: 'objectKeysTransform'
  },
  destination: {
    target: 'links[1].schema.properties.fields.enum'
  }
};
```

In the above example we see that we have details for source, destination, and transform behaviors.

*Example: options.source*
In the above example we specify that we would like the source to have the plugin `originalSchemeSource` behavior (among several behaviors provided with this module) we also specify that the target for the source originalSchemeSource behavior is `properties.data.properties.attributes.properties`. We will be passing an object and this is a property, the target must relate to the kind of source you have.

*Example: options.transform*
In the above example we specify that we want the plugin `objectKeysTransform` behavior for our transform (among several behaviors provide with this module). This transform takes an object and returns keys. In this case the object at the source. There is no target needed for transforms though. It will take the source at `properties.data.properties.attributes.properties` and because of the behavior of the transform plugin `objectKeysTransform` it will turn it into an array of keys for that object.

*Example: options.destination*
In the above example we specify the default behavior for our destination which is to set the transformed value to the target we provided `'links[1].schema.properties.fields.enum'`.

You can use any of the provided behaviors for sources, transforms, or destinations or use the config module [https://github.com/lorenwest/node-config] to specify the use of other collections of behaviors in modules created by you or others.

"Laugh your life, there ain't much to cry for." -- Joe Strummer
