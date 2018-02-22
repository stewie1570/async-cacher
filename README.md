# async-cache

You can use this small tool to cache any request for data.

This tool allows you to:
 - Configure control TTL of cache key/value 
 - Control scope of cache key/values
 - Prevent calls to a data source not only when a cached result is available but also prevent calls to a data source when a request to that data source is already in-flight.

 **Usage**
     const result = cache.get({ dataSource, key: "key 1" });

*(In this example, dataSource is a function that returns a promise of the result)*