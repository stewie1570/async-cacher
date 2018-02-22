export class Cache {
    constructor({ timeProvider }) {
        this.data = [];
        this.timeProvider = timeProvider;
    }

    get({ dataSource, cacheKey, millisecondsToLive }) {
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
        const hasCachedResult = cachedResult && this.timeProvider() < cachedResult.expiration;
        
        return hasCachedResult ? Promise.resolve(cachedResult.getData) : getFromDataSource();
    }
}