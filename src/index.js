export class Cache {
    constructor(config) {
        this.data = [];
        this.timeProvider = (config && config.timeProvider) || (() => new Date());
    }

    get({ dataSource, cacheKey, millisecondsToLive, forceRefresh }) {
        var cachedResult = this.data[cacheKey];
        var adjust = ({ time, milliseconds }) => {
            var newTime = new Date(time.valueOf());
            newTime.setMilliseconds(milliseconds);
            return newTime;
        };
        var getFromDataSource = () => {
            var getData = dataSource();
            this.data[cacheKey] = {
                getData,
                expiration: adjust({ time: this.timeProvider(), milliseconds: millisecondsToLive || 60000 })
            };

            return getData;
        };
        const hasCachedResult = cachedResult
            && !forceRefresh
            && this.timeProvider() < cachedResult.expiration;

        return hasCachedResult ? cachedResult.getData : getFromDataSource();
    }
}