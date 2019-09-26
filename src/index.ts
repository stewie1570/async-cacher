type Request = {
    dataSource: () => Promise<object> | object,
    key?: string,
    millisecondsToLive?: number,
    forceRefresh?: boolean
};

export class Cache {
    data: { [key: string]: any };
    timeProvider: any;

    constructor(config?: any) {
        this.data = [];
        this.timeProvider = (config && config.timeProvider) || (() => new Date());
    }

    get({ dataSource, key, millisecondsToLive, forceRefresh }: Request) {
        const cachedResult = this.data[key || ""];
        const adjust = ({ time, milliseconds }: { time: Date, milliseconds: number }) => {
            var newTime = new Date(time.valueOf());
            newTime.setMilliseconds(milliseconds);
            return newTime;
        };
        const getFromDataSource = async () => {
            var getData = dataSource();
            this.data[key || ""] = {
                getData,
                expiration: adjust({ time: this.timeProvider(), milliseconds: millisecondsToLive || 60000 })
            };

            try {
                const data = await getData;

                return data;
            }
            catch (error) {
                this.data[key || ""] = undefined;
                throw error;
            }
        };
        const useCachedResult = cachedResult
            && !forceRefresh
            && this.timeProvider() < cachedResult.expiration;

        return useCachedResult ? cachedResult.getData : getFromDataSource();
    }

    clear({ key }: { key: string }) {
        this.data[key] = undefined;
    }
}