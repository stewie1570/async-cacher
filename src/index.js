export class Cache {
    constructor(config) {
        this.data = [];
        this.timeProvider = (config && config.timeProvider) || (() => new Date());
    }

    get({ dataSource, key, millisecondsToLive, forceRefresh }) {
        var cachedResult = this.data[key];
        var adjust = ({ time, milliseconds }) => {
            var newTime = new Date(time.valueOf());
            newTime.setMilliseconds(milliseconds);
            return newTime;
        };
        var getFromDataSource = async () => {
            var getData = dataSource();
            this.data[key] = {
                getData,
                expiration: adjust({ time: this.timeProvider(), milliseconds: millisecondsToLive || 60000 })
            };

            try {
                const data = await getData;

                return data;
            }
            catch (error) {
                this.data[key] = undefined;
                throw error;
            }
        };
        const useCachedResult = cachedResult
            && !forceRefresh
            && this.timeProvider() < cachedResult.expiration;

        return useCachedResult ? cachedResult.getData : getFromDataSource();
    }

    clear({ key }) {
        this.data[key] = undefined;
    }
}