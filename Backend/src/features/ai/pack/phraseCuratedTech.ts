/**
 * Technical and architecture knowledge clusters.
 */
import type { CuratedBlock } from "./phraseCuratedCore.js";

export const CURATED_TECH: CuratedBlock[] = [
  {
    id: "tech_hardware",
    phrases: [
      "what hardware do you use",
      "server hardware specs",
      "what cpu do your servers use",
      "what ssd storage do you use",
      "nvme ssd speed",
      "are your drives nvme",
      "server processors",
      "hardware infrastructure",
      "tell me about your server hardware",
    ],
    answer:
      "RunRacks nodes run on high-frequency enterprise processors (AMD EPYC and Intel Xeon Scalable) paired with DDR4/DDR5 ECC registered memory and pure enterprise-grade NVMe SSD storage in fault-tolerant RAID-10 arrays. This delivers exceptional IOPS and ultra-fast disk reads/writes.",
  },
  {
    id: "tech_root",
    phrases: [
      "do i get full root access",
      "do i have root privileges",
      "is root access included",
      "can i run sudo commands",
      "do i get administrator access",
      "can i install my own software",
      "do i have full control over the server",
      "full access rights",
    ],
    answer:
      "Yes! You receive 100% full root access via SSH on Linux VPS plans, and complete Administrator access via Remote Desktop (RDP) on Windows VPS and Admin RDP plans. You have full permission to install custom packages, configure firewalls, manage services, and tweak system kernel parameters.",
  },
  {
    id: "tech_os",
    phrases: [
      "what operating systems are available",
      "which os can i install",
      "what linux distributions do you support",
      "do you support ubuntu 24",
      "do you have debian 12",
      "do you have almalinux",
      "what windows server versions do you offer",
      "os choices list",
      "available operating systems",
    ],
    answer:
      "RunRacks supports a broad range of 64-bit operating systems:\n• Linux: Ubuntu 24.04 LTS, Ubuntu 22.04 LTS, Debian 12 (Bookworm), AlmaLinux 9, Rocky Linux 9, and CentOS Stream.\n• Windows: Windows Server 2022 Standard and Windows Server 2019 Standard.\nYou can select your preferred OS image during order or rebuild your OS anytime from your management panel.",
  },
  {
    id: "tech_panels",
    phrases: [
      "can i install cpanel",
      "do you support plesk",
      "can i use cyberpanel",
      "can i install aapanel",
      "can i use cloudpanel",
      "what control panels can i use",
      "control panel support",
      "can i install webmin",
      "hosting control panels",
    ],
    answer:
      "Yes! Because you have full root SSH access on Linux VPS, you can install any control panel you wish, including cPanel/WHM, Plesk, CyberPanel (with OpenLiteSpeed), aaPanel, CloudPanel, Webmin, or FastPanel. Simply execute the panel’s installer script on your clean OS instance.",
  },
  {
    id: "tech_db",
    phrases: [
      "can i run mysql database",
      "do you support postgresql",
      "can i install mongodb",
      "can i run redis on vps",
      "database performance",
      "can i host a database server",
      "mariadb support",
      "database hosting on vps",
    ],
    answer:
      "Yes! RunRacks VPS plans are heavily optimized for databases (MySQL, MariaDB, PostgreSQL, MongoDB, Redis, and MSSQL on Windows). With dedicated RAM and high-IOPS NVMe SSD storage in RAID-10, database queries execute with minimal latency.",
  },
  {
    id: "tech_docker",
    phrases: [
      "can i run docker",
      "do you support docker compose",
      "can i host docker containers",
      "kubernetes on vps",
      "is docker supported",
      "containerization support",
      "can i run microservices",
    ],
    answer:
      "Yes! RunRacks utilizes true KVM kernel virtualization, granting you full access to Linux kernel namespaces and cgroups. You can install Docker Engine, Docker Compose, Portainer, Podman, and lightweight Kubernetes (k3s, microk8s) without restrictions.",
  },
  {
    id: "tech_webservers",
    phrases: [
      "can i run nginx",
      "do you support apache",
      "can i host nodejs api",
      "can i run python fastapi",
      "php web hosting",
      "can i run reverse proxy",
      "litespeed support",
    ],
    answer:
      "Yes! You can run Nginx, Apache HTTP Server, LiteSpeed/OpenLiteSpeed, and Caddy. RunRacks VPS easily accommodates modern application runtimes including Node.js, Python (Django/FastAPI/Flask), PHP, Go, Rust, Ruby, and Java.",
  },
  {
    id: "tech_ssh",
    phrases: [
      "how to connect via ssh",
      "how do i connect to my linux vps",
      "ssh login guide",
      "how to use putty with vps",
      "ssh port and credentials",
      "connecting with terminal ssh",
    ],
    answer:
      "To connect to your Linux VPS:\n1. Open your terminal or PuTTY.\n2. Connect to your server’s IP address on port 22 (`ssh root@YOUR_SERVER_IP`).\n3. Enter the root password provided in your provisioning email or use your registered SSH key.\n4. You will immediately have root command-line access.",
  },
  {
    id: "tech_rdp",
    phrases: [
      "how to connect via rdp",
      "how do i connect to windows vps",
      "remote desktop connection guide",
      "how to login to admin rdp",
      "rdp client for mac",
      "rdp login instructions",
    ],
    answer:
      "To connect to your Windows VPS or Admin RDP:\n1. Open the Remote Desktop Connection app (MSTSC on Windows, Microsoft Remote Desktop on macOS/iOS/Android).\n2. Enter your server IP address (e.g. `YOUR_SERVER_IP:3389`).\n3. Enter username `Administrator` and your password from the provisioning email.\n4. Accept the certificate prompt to load your remote desktop.",
  },
];

