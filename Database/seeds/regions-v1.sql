-- Fallback region meta (map UI). Live pricing still comes from WHMCS sync.
INSERT INTO region_meta (id, label, country_code, group_id) VALUES
  ('us', 'United States', 'us', 'north-america'),
  ('ca', 'Canada', 'ca', 'north-america'),
  ('gb', 'United Kingdom', 'gb', 'europe'),
  ('nl', 'Netherlands', 'nl', 'europe'),
  ('de', 'Germany', 'de', 'europe'),
  ('sg', 'Singapore', 'sg', 'asia-pacific'),
  ('au', 'Australia', 'au', 'asia-pacific'),
  ('jp', 'Japan', 'jp', 'asia-pacific')
ON CONFLICT (id) DO UPDATE SET
  label = EXCLUDED.label,
  country_code = EXCLUDED.country_code,
  group_id = EXCLUDED.group_id;
