# SESSION_HMAC_SECRET rotation

HMAC cookies (`rr_session`, `rr_ai_sess`) are **not JWTs**. Rotation uses dual secrets.

1. Copy current `SESSION_HMAC_SECRET` into `SESSION_HMAC_SECRET_PREVIOUS`.
2. Generate a new ≥32 character `SESSION_HMAC_SECRET`.
3. Restart / roll Backend so all instances load both.
4. New cookies are signed only with the current secret; old cookies verify against previous.
5. After the longest cookie TTL (14 days for AI guest), remove `SESSION_HMAC_SECRET_PREVIOUS`.

Never claim JWT key rotation for this stack.
