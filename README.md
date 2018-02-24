# async-cacher

[![Build](https://travis-ci.org/stewie1570/async-cacher.svg)](https://travis-ci.org/stewie1570/async-cacher)
[![npm version](https://badge.fury.io/js/async-cacher.svg)](https://badge.fury.io/js/async-cacher)

You can use this small, simple and extremley light-weight tool to cache any request for data.

This tool will:
 - Prevent requests for data that is already available in the cache (obviously)
 - Prevent simultaneous in-flight calls on the same key.
    - (For example, say it takes one second to resovle a data request but there were 10 requests for data on the same key within that second. This would result in one request for that data and it would be resolved for all 10 requests. The request would be issued immediately on the first of the 10 requests)

This tool allows for you too:
 - Control TTL of cache key/value 
 - Control scope of cache key/values

 **Usage**
 
```jsx
const result1 = await cache.get({ dataSource, key: "key 1" }); //The default TTL is 1 minute
const result2 = await cache.get({ dataSource, key: "key 1", millisecondsToLive: 1000 })
```

*(In this example, dataSource is a function that returns a promise of the result)*
