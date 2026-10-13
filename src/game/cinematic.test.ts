import assert from "node:assert/strict";
import { describe, it } from "node:test";
import {
  CINE_END_MS,
  CINEMATIC_VERSION,
  SCENES,
  markIntroComplete,
  progressOf,
  sceneAt,
  shouldForceIntro,
} from "./cinematic.ts";

describe("cinematic system", () => {
  it("recorre al Viejo: Santa Cristina → Flacko → grieta → Voidcrown", () => {
    assert.ok(SCENES.length >= 8);
    assert.equal(SCENES[0].id, "santa");
    assert.ok(SCENES.some((s) => s.id === "flacko"));
    assert.ok(SCENES.some((s) => s.id === "grieta"));
    assert.ok(SCENES.some((s) => s.id === "nave"));
    assert.ok(SCENES.at(-1)?.id === "turno");
    assert.ok(SCENES.every((s) => s.audio.endsWith(".mp3")));
    let t = 0;
    for (const s of SCENES) {
      assert.equal(s.at, t);
      t += s.dur;
    }
    assert.ok(CINE_END_MS >= t - 500);
  });

  it("elige la escena según el reloj", () => {
    assert.equal(sceneAt(0).id, "santa");
    assert.equal(sceneAt(20000).id, "teoria");
    assert.equal(sceneAt(30000).id, "grieta");
    assert.equal(sceneAt(50000).id, "nave");
    assert.equal(progressOf(0), 0);
    assert.equal(progressOf(CINE_END_MS), 1);
  });

  it("obliga la intro la primera vez y si cambia de versión", () => {
    assert.equal(shouldForceIntro({ version: 0, seen: false, skipped: false, seenAt: null }), true);
    const done = markIntroComplete(false);
    assert.equal(done.seen, true);
    assert.equal(done.version, CINEMATIC_VERSION);
    assert.equal(shouldForceIntro(done), false);
    assert.equal(shouldForceIntro({ ...done, version: 0 }), true);
  });
});
