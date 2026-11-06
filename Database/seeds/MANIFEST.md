# Seed manifest

| File | Purpose | Notes |
| --- | --- | --- |
| `regions-v1.sql` | Map / region meta | Safe to load without WHMCS |
| `demo-catalog-v1.json` | Offline demo catalog snapshot | **Not** live prices — WHMCS is SoR |
| `content-stub-v1.sql` | Placeholder content_sections + AI blurbs (`ai-blurb-*`) | Expand from Frontend inventory export |

Record SHA-256 after each export:

```bash
# PowerShell
Get-FileHash Database/seeds/*.sql, Database/seeds/*.json -Algorithm SHA256
```
