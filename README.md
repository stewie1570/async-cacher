# async-cacher

[![Build](https://travis-ci.org/stewie1570/async-cacher.svg)](https://travis-ci.org/stewie1570/async-cacher)
[![npm version](https://badge.fury.io/js/async-cacher.svg)](https://badge.fury.io/js/async-cacher)

You can use this small tool to cache any request for data.

This tool allows you to:
 - Configure control TTL of cache key/value 
 - Control scope of cache key/values
 - Prevent calls to a data source not only when a cached result is available but also prevent calls to a data source when a request to that data source is already in-flight.

 **Usage**
 
```jsx
const result1 = await cache.get({ dataSource, key: "key 1" }); //The default TTL is 1 minute
const result2 = await cache.get({ dataSource, key: "key 1", millisecondsToLive: 1000 })
```

*(In this example, dataSource is a function that returns a promise of the result)*
