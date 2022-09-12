import NodeCache from "node-cache";

/**
 * @description doc https://www.npmjs.com/package/node-cache
 */

export default class LightCache {
	protected readonly nodeCache;
	protected static readonly stdTTL = 100;
	protected static readonly checkperiod = 120;

	constructor(options: NodeCache.Options = {}) {
		this.nodeCache = new NodeCache({
			stdTTL: LightCache.stdTTL,
			checkperiod: LightCache.checkperiod,
			useClones: false,
			...options,
		});
	}

	public static getNewNameSpace(options: NodeCache.Options = {}) {
		return new LightCache(options);
	}

	public set<T>(key: NodeCache.Key, value: T, ttl?: string | number | null): boolean {
		return this.nodeCache.set<T>(key, value, ttl ?? LightCache.stdTTL);
	}

	public mset<T>(keyValueSet: NodeCache.ValueSetItem<T>[]): boolean {
		return this.nodeCache.mset<T>(keyValueSet);
	}

	public get<T>(key: NodeCache.Key): T | undefined {
		return this.nodeCache.get<T>(key);
	}

	public mget<T>(keys: NodeCache.Key[]): { [key: string]: T } {
		return this.nodeCache.mget<T>(keys);
	}

	public del(keys: NodeCache.Key | NodeCache.Key[]): number {
		return this.nodeCache.del(keys);
	}
}
