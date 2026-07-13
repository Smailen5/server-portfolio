import { beforeEach, describe, expect, it, vi } from "vitest";
import { InMemoryCache } from "./cache.js";

describe("InMemoryCache", () => {
  let cache: InMemoryCache;

  beforeEach(() => {
    cache = new InMemoryCache();
    vi.useRealTimers();
  });

  describe("set() e get()", () => {
    it("memorizza e recupera dati stringa", () => {
      cache.set("key1", "value1", 1000);
      expect(cache.get("key1")).toBe("value1");
    });

    it("memorizza e recupera dati oggetto", () => {
      const obj = { name: "test", count: 42 };
      cache.set("obj", obj, 1000);
      expect(cache.get("obj")).toEqual(obj);
    });

    it("memorizza e recupera dati array", () => {
      const arr = [1, 2, 3];
      cache.set("arr", arr, 1000);
      expect(cache.get("arr")).toEqual(arr);
    });

    it("memorizza e recupera dati numerici", () => {
      cache.set("num", 123, 1000);
      expect(cache.get("num")).toBe(123);
    });

    it("sovrascrive valori esistenti per la stessa chiave", () => {
      cache.set("key", "first", 1000);
      cache.set("key", "second", 1000);
      expect(cache.get("key")).toBe("second");
    });
  });

  describe("get() con chiave inesistente", () => {
    it("restituisce null per chiave mai impostata", () => {
      expect(cache.get("inesistente")).toBeNull();
    });

    it("restituisce null per chiave dopo invalidate()", () => {
      cache.set("key", "value", 1000);
      cache.invalidate("key");
      expect(cache.get("key")).toBeNull();
    });
  });

  describe("get() con chiave scaduta", () => {
    it("restituisce null quando il TTL è scaduto", () => {
      vi.useFakeTimers();
      cache.set("key", "value", 1000);
      expect(cache.get("key")).toBe("value");

      vi.advanceTimersByTime(1001);
      expect(cache.get("key")).toBeNull();
    });

    it("restituisce il dato prima della scadenza", () => {
      vi.useFakeTimers();
      cache.set("key", "value", 1000);

      vi.advanceTimersByTime(999);
      expect(cache.get("key")).toBe("value");
    });

    it("rimuove la chiave scaduta dalla cache", () => {
      vi.useFakeTimers();
      cache.set("key", "value", 1000);

      vi.advanceTimersByTime(1001);
      cache.get("key");

      vi.advanceTimersByTime(1000);
      expect(cache.get("key")).toBeNull();
    });
  });

  describe("invalidate()", () => {
    it("rimuove una chiave esistente", () => {
      cache.set("key", "value", 1000);
      cache.invalidate("key");
      expect(cache.get("key")).toBeNull();
    });

    it("non causa errori se la chiave non esiste", () => {
      expect(() => cache.invalidate("inesistente")).not.toThrow();
    });

    it("rimuove solo la chiave specificata", () => {
      cache.set("key1", "value1", 1000);
      cache.set("key2", "value2", 1000);
      cache.invalidate("key1");
      expect(cache.get("key1")).toBeNull();
      expect(cache.get("key2")).toBe("value2");
    });
  });

  describe("clear()", () => {
    it("svuota completamente la cache", () => {
      cache.set("key1", "value1", 1000);
      cache.set("key2", "value2", 1000);
      cache.set("key3", "value3", 1000);
      cache.clear();
      expect(cache.get("key1")).toBeNull();
      expect(cache.get("key2")).toBeNull();
      expect(cache.get("key3")).toBeNull();
    });

    it("non causa errori su cache già vuota", () => {
      expect(() => cache.clear()).not.toThrow();
    });

    it("permette di riutilizzare la cache dopo lo svuotamento", () => {
      cache.set("key", "value1", 1000);
      cache.clear();
      cache.set("key", "value2", 1000);
      expect(cache.get("key")).toBe("value2");
    });
  });
});
