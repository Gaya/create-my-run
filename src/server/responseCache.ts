interface CacheValue<T> {
  validUntil: number;
  data: T;
}

interface CacheValues<T> {
  [cacheKey: string]: CacheValue<T>;
}

interface Cache<T> {
  get(key: string): T;
  has(key: string): boolean;
  set(key: string, data: T, validUntil?: number): void;
}

const cacheEnabled = Boolean(process.env.ENABLE_CACHE);

function isValid<T>(cacheValue: CacheValue<T>): boolean {
  return cacheValue.validUntil > +new Date();
}

function createResponseCache<T>(
  options = {
    // one hour
    defaultValidUntil: 1000 * 60 * 60,
    // every 15 minutes
    cleanInterval: 1000 * 60 * 15,
  },
): Cache<T> {
  // return fake cache when cache is disabled
  if (!cacheEnabled) {
    return {
      get(): T {
        throw new Error('Cache is disabled');
      },
      has(): boolean {
        return false;
      },
      set(): void {
        return undefined;
      },
    };
  }

  const cache: CacheValues<T> = {};

  function cleanUp(): void {
    Object.entries(cache).forEach(([key, value]) => {
      if (!isValid(value)) {
        delete cache[key];
      }
    });

    setTimeout(cleanUp, options.cleanInterval);
  }

  // start clean up routine
  cleanUp();

  return {
    get(key: string): T {
      if (!this.has(key)) {
        throw new Error(`${key} was not found in cache`);
      }

      return cache[key].data;
    },
    has(key: string): boolean {
      return cache[key] && cache[key].data && isValid(cache[key]);
    },
    set(key: string, data: T, validUntil = +new Date() + options.defaultValidUntil): void {
      cache[key] = {
        validUntil,
        data,
      };
    },
  };
}

export default createResponseCache;
