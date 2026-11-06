# Frontend content inventory (preservation)

Do **not** delete these Frontend modules until Backend dual-read + parity are green.

| Area | Path | Destination |
| --- | --- | --- |
| Demo VPS catalog | `Frontend/src/features/vps-pricing/model/` | WHMCS sync → `catalog_*` cache; seed fallback `seeds/demo-catalog-v1.json` |
| Network / map | `Frontend/src/features/product-hosting/model/networkLocations.ts` | `region_meta` |
| Admin RDP copy | `Frontend/src/features/admin-rdp/` | `content_sections` |
| Why Choose | `Frontend/src/features/why-choose/` | `content_sections` |
| How We Work | `Frontend/src/features/how-we-work/` | `content_sections` |
| Support / FAQ / home | respective `Frontend/src/features/*` | `content_sections` |
| Contact UI | `Frontend/src/features/contact/` | `contact_inquiries` via API |
| Cart / checkout UI | `Frontend/src/features/cart|checkout/` | intents in DB; money/services via WHMCS |

**Checksums:** record SHA-256 of seed files in `seeds/MANIFEST.md` when exporting.
