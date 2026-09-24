import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync } from "node:fs";
import { paths, routeFor, titles, type RouteKey } from "../lib/routes.ts";

test("every address has a page and maps back to its route", () => {
  for (const [key, path] of Object.entries(paths)) {
    const folder =
      key === "welcome" ? path.slice(1) : `(sinif)${path === "/" ? "/" : path}`;
    const page = new URL(`../app/${folder}page.tsx`, import.meta.url);
    assert.ok(existsSync(page), `${path} has no page file`);
    if (key !== "welcome") {
      assert.equal(routeFor(path), key);
      assert.equal(routeFor(path.replace(/\/$/, "")), key);
      assert.ok(titles[key as RouteKey]);
    }
  }
  assert.equal(routeFor("/bilinmeyen/"), "aquarium");
});
