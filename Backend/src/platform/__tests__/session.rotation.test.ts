import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { signSession, verifySession } from "../session.js";

const CURRENT = "current-session-hmac-secret-min-32-chars!!";
const PREVIOUS = "previous-session-hmac-secret-min-32-chars!";

describe("session HMAC rotation", () => {
  it("verifies cookies signed with the current secret", () => {
    const token = signSession(
      { whmcsClientId: 42, exp: Math.floor(Date.now() / 1000) + 3600 },
      CURRENT,
    );
    const payload = verifySession(token, CURRENT, PREVIOUS);
    assert.equal(payload?.whmcsClientId, 42);
  });

  it("verifies cookies signed with the previous secret", () => {
    const token = signSession(
      { whmcsClientId: 7, exp: Math.floor(Date.now() / 1000) + 3600 },
      PREVIOUS,
    );
    const payload = verifySession(token, CURRENT, PREVIOUS);
    assert.equal(payload?.whmcsClientId, 7);
  });

  it("rejects unknown secrets", () => {
    const token = signSession(
      { whmcsClientId: 1, exp: Math.floor(Date.now() / 1000) + 3600 },
      "other-session-hmac-secret-min-32-chars!!!!",
    );
    assert.equal(verifySession(token, CURRENT, PREVIOUS), null);
  });
});
