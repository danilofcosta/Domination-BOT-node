import { LRUCache } from 'lru-cache';


export const haremCache = new LRUCache<string, any>({
  max: 1000,
  ttl: 1000 * 60 * 5
});

export function getHarem(userId: number) {
  return haremCache.get(`harem:${userId}`);
}

export function setHarem(userId: number, data: any) {
  haremCache.set(`harem:${userId}`, data);
}