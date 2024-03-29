# Scheme Punk - Configuration based transaformation library

[![Build Status](https://travis-ci.org/schemepunk/scheme-punk.svg?branch=master)](https://travis-ci.org/schemepunk/scheme-punk)
[![Coverage Status](https://coveralls.io/repos/github/schemepunk/scheme-punk/badge.svg?branch=master)](https://coveralls.io/github/thebruce/scheme-punk?branch=master)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Greenkeeper badge](https://badges.greenkeeper.io/schemepunk/scheme-punk.svg)](https://greenkeeper.io/)
[![Maintainability](https://api.codeclimate.com/v1/badges/d7751dc122844ec69e2e/maintainability)](https://codeclimate.com/github/schemepunk/scheme-punk/maintainability)


## What is it?

Scheme Punk on NPM [SchemePunk](https://www.npmjs.com/package/@schemepunk/scheme-punk)

Scheme Punk is an extensible mapping and transformation library for js objects that you control with configuration not code (js objects or json).

It is easy to extend schemePunk with your own plugins too!

## Where did it come from?

Scheme Punk originated from the need to reduce repetitive and error prone
authoring tasks in JSON Schema [http://json-schema.org/] as well as the need to rewrite that schema
in other JSON formats [https://www.openapis.org/](open API) and to use that same schema to inform and
interpret for even more JSON based utilities [https://www.getpostman.com/docs/collections](postman collections).



## Example uses:

From it's humble roots as a JSON Schema Preprocessor SchemePunk is now it's in place in a wide variety of use cases:

* Transforming JS Objects into JSON Schema
* Transforming and mapping user submitted form data to conform to a different shape.
* Altering the results of one version of an API to a different spec for another version of the API.
* Transforming JSON Schema into Open API/Swagger docs.
* Transforming JSON Schema into postman collections.

## How to use scheme Punk:

You create a Scheme Punk object to run a `scheme`. A scheme is made up of 3
components:

1. A source: which can be an object, an object property, or a file (quite a lot is possible through custom plugins.)
2. A transformation: prepending a value, appending a value, reducing an object to an array of keys, passing through, turning an array into a regex (again, quite a lot is possible through plugins)
3. A destination: an object, a string, a property in an existing object. (yet again, much is possible through plugins.)

```js
// require SchemePunk
const { SchemePunk } = require('@schemepunk/scheme-punk');
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
