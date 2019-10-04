import { Cache } from '.'

const promiseToResolve = (theData: any) => new Promise(resolve => setTimeout(() => resolve(theData), 1));
const promiseToReject = (theData: any) => new Promise((resolve, reject) => setTimeout(() => reject(theData), 1));

describe("Cache", () => {
    it("should return data from the source", async () => {
        var dataSource = () => promiseToResolve("the data");
        expect(await new Cache().get({ dataSource })).toBe("the data");
    });

    it("should not cache rejected promises (errors)", async () => {
        let callCount = 0;
        const theError = new Error("The error...");
        let successfullDataSource = () => {
            callCount++;

            return promiseToResolve("the data");
        };
        let failedDataSource = () => {
            callCount++;

            return promiseToReject(theError);
        };
        let cache = new Cache();

        let receivedError = undefined;
        try {
            await cache.get({ dataSource: failedDataSource, key: "key 1" });
        }
        catch (error) {
            receivedError = error;
        }
        expect(receivedError).toBe(theError);
        expect(await cache.get({ dataSource: successfullDataSource, key: "key 1" })).toBe("the data");
        expect(callCount).toBe(2);
    });

    it("should only request once per key", async () => {
        var callCount = 0;
        var dataSource = () => {
            callCount++;

            return promiseToResolve("the data");
        };
        var cache = new Cache();

        expect(await cache.get({ dataSource, key: "key 1" })).toBe("the data");
        expect(await cache.get({ dataSource, key: "key 1" })).toBe("the data");
        expect(callCount).toBe(1);
    });

    it("should request twice (once per key)", async () => {
        var callCount = 0;
        var dataSource = () => {
            callCount++;

            return promiseToResolve(`the data${callCount}`);
        };
        var cache = new Cache();

        expect(await cache.get({ dataSource, key: "key 1" })).toBe("the data1");
        expect(await cache.get({ dataSource, key: "key 2" })).toBe("the data2");
        expect(callCount).toBe(2);
    });

    it("should allow forcing a key to refresh", async () => {
        var callCount = 0;
        var dataSource = () => {
            callCount++;

            return promiseToResolve(`the data${callCount}`);
        };
        var cache = new Cache();

        expect(await cache.get({ dataSource, key: "key 1" })).toBe("the data1");
        expect(await cache.get({ dataSource, key: "key 1", forceRefresh: true })).toBe("the data2");
        expect(callCount).toBe(2);
    });

    it("should allow clearing a key", async () => {
        var callCount = 0;
        var dataSource = () => {
            callCount++;

            return promiseToResolve(`the data${callCount}`);
        };
        var cache = new Cache();

        expect(await cache.get({ dataSource, key: "key 1" })).toBe("the data1");
        cache.clear({ key: "key 1" });
        expect(await cache.get({ dataSource, key: "key 1" })).toBe("the data2");
        expect(callCount).toBe(2);
    });

    it("should default expiration of cache keys to one minute", async () => {
        var callCount = 0;
        var dataSource = () => {
            callCount++;

            return promiseToResolve(`the data${callCount}`);
        };
        var currentTime = new Date("01/01/2000 12:00 am");
        var cache = new Cache({ timeProvider: () => currentTime });

        expect(await cache.get({ dataSource, key: "key 1" })).toBe("the data1");
        currentTime = new Date("01/01/2000 12:01 am");
        expect(await cache.get({ dataSource, key: "key 1" })).toBe("the data2");
        expect(callCount).toBe(2);
    });

    it("should use configured cache key expiration", async () => {
        var callCount = 0;
        var dataSource = () => {
            callCount++;

            return promiseToResolve(`the data${callCount}`);
        };
        var currentTime = new Date("01/01/2000 12:00 am");
        var cache = new Cache({ timeProvider: () => currentTime });

        expect(await cache.get({ dataSource, key: "key 1", millisecondsToLive: 1000 })).toBe("the data1");
        currentTime = new Date("01/01/2000 12:00:01 am");
        expect(await cache.get({ dataSource, key: "key 1" })).toBe("the data2");
        expect(callCount).toBe(2);
    });

    it("should delete expired keys", async () => {
        var callCount = 0;
        let logs = [];
        var dataSource = () => {
            callCount++;

            return promiseToResolve(`the data${callCount}`);
        };
        var currentTime = new Date("01/01/2000 12:00 am");
        var cache = new Cache({ timeProvider: () => currentTime, logger: log => logs.push(log) });

        await cache.get({ dataSource, key: "key 1", millisecondsToLive: 1000 });
        currentTime = new Date("01/01/2000 12:00:01 am");
        await cache.get({ dataSource, key: "key 1" });
        expect(logs).toEqual([
            'deleted "key 1"'
        ]);
    });

    it("should not make another request while another request for the same key is in-flight", async () => {
        var callCount = 0;
        var dataSource = () => {
            callCount++;

            return promiseToResolve("the data");
        };
        var cache = new Cache();

        const firstResult = cache.get({ dataSource, key: "key 1" });
        const secondResult = cache.get({ dataSource, key: "key 1" });
        expect(await Promise.all([firstResult, secondResult])).toEqual(["the data", "the data"]);
        expect(callCount).toBe(1);
    });
});