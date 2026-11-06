INSERT INTO content_sections (id, title, body) VALUES
  (
    'why-choose-admin-rdp',
    'Why choose Admin RDP',
    '{"note":"Preserved in Frontend until full export; this stub proves content READ API"}'::jsonb
  ),
  (
    'how-we-work',
    'How we work',
    '{"note":"Preserved in Frontend until full export"}'::jsonb
  ),
  (
    'ai-blurb-linux-vps',
    'Linux VPS (AI knowledge)',
    '{"summary":"RunRacks Linux VPS for general workloads. Point visitors to /pricing for labeled demo or WHMCS-synced prices — never invent amounts.","href":"/pricing"}'::jsonb
  ),
  (
    'ai-blurb-windows-vps',
    'Windows VPS (AI knowledge)',
    '{"summary":"Windows VPS options for GUI and Windows-native apps. Confirm plans on Pricing; Contact for migrations.","href":"/pricing"}'::jsonb
  ),
  (
    'ai-blurb-admin-rdp',
    'Admin RDP (AI knowledge)',
    '{"summary":"Admin RDP plans for remote desktop workloads. Use Pricing and Contact — no fabricated invoices or tickets.","href":"/admin-rdp"}'::jsonb
  )
ON CONFLICT (id) DO UPDATE SET
  title = EXCLUDED.title,
  body = EXCLUDED.body,
  updated_at = now();
