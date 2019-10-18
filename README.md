# async-cacher

[![Build](https://travis-ci.org/stewie1570/async-cacher.svg)](https://travis-ci.org/stewie1570/async-cacher)
[![npm version](https://badge.fury.io/js/async-cacher.svg)](https://badge.fury.io/js/async-cacher)

Use Cases:
 - Prevent requests for data that is already available in the cache (obviously)
 - Prevent simultaneous in-flight calls on the same key.
    - (For example, say it takes one second to resovle a data request but there were 10 requests for data on the same key within that second. This would result in one request for that data and it would be resolved for all 10 requests. The request would be issued immediately on the first of the 10 requests)

Allows for:
 - Control TTL of cache key/value 
 - Control scope of cache key/values

 **Usage** *(In this example, dataSource is a function that returns a promise of the result)*
 
```jsx
import { Cache } from 'async-cacher'

var cache = new Cache();

const result1 = await cache.get({ dataSource, key: "key 1" }); //The default TTL is 1 minute
const result2 = await cache.get({ dataSource, key: "key 1", millisecondsToLive: 1000 });
```

You can also force a key to refresh via the get request or clear a key so the next request will refresh the cache key.
```jsx
const result1 = await cache.get({ dataSource, key: "key 1", forceRefresh: true });
cache.clear({ key: "key 1" });
```