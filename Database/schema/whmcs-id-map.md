# WHMCS ↔ Postgres id map

| WHMCS concept | Postgres column / table | Notes |
| --- | --- | --- |
| Client | `customers_cache.whmcs_client_id` | SoR; cache only |
| Product / plan | `catalog_products.whmcs_product_id` | Prices from WHMCS |
| Service | `services_cache.whmcs_service_id` | Access/status from WHMCS |
| Order | `payment_operations.whmcs_order_id` | Idempotent create |
| Invoice | `payment_operations.whmcs_invoice_id` | Reconcile ambiguous outcomes |

App session must embed **verified** `whmcs_client_id` only. Never trust body/header client ids.
