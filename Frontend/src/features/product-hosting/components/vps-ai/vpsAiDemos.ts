/**
 * VPS AI assistance demos — copy + DOM sequence scripts (Mode 2 reconstruction).
 * Set up heading/description match the reference screenshot verbatim.
 */
import type { DemoState } from "./vpsAiTypes";

export const VPS_AI_DEMOS: readonly DemoState[] = [
  {
    id: "troubleshoot",
    tabLabel: "Troubleshoot",
    heading: "Get help troubleshooting issues",
    description:
      "Ask the assistant to review logs, interpret errors, identify likely causes, and suggest or help apply repairs in the server console.",
    durationMs: 9000,
    sequence: [
      {
        atMs: 0,
        terminalLines: [
          "root@vps:~# systemctl status nginx",
          "● nginx.service - A high performance web server",
          "     Active: failed (Result: exit-code)",
          "Oct 21 08:12 nginx[412]: bind() to 0.0.0.0:80 failed (98: Address already in use)",
        ],
        agentMessages: [
          {
            from: "user",
            text: "Nginx won’t start after reboot. Can you check what’s wrong?",
          },
        ],
      },
      {
        atMs: 2200,
        terminalLines: [
          "root@vps:~# systemctl status nginx",
          "● nginx.service - A high performance web server",
          "     Active: failed (Result: exit-code)",
          "Oct 21 08:12 nginx[412]: bind() to 0.0.0.0:80 failed (98: Address already in use)",
          "root@vps:~# ss -tlnp | grep :80",
          'LISTEN 0 128 0.0.0.0:80 0.0.0.0:* users:(("apache2",pid=901))',
        ],
        agentMessages: [
          {
            from: "user",
            text: "Nginx won’t start after reboot. Can you check what’s wrong?",
          },
          {
            from: "agent",
            text: "Port 80 is held by apache2. I’ll stop Apache and restart Nginx. Apply fix?",
          },
        ],
        confirmPrompt: "Apply fix?",
      },
      {
        atMs: 5200,
        terminalLines: [
          "root@vps:~# systemctl stop apache2",
          "root@vps:~# systemctl start nginx",
          "root@vps:~# systemctl status nginx --no-pager",
          "● nginx.service - A high performance web server",
          "     Active: active (running) since Wed 08:14:02 UTC",
        ],
        agentMessages: [
          {
            from: "user",
            text: "Nginx won’t start after reboot. Can you check what’s wrong?",
          },
          {
            from: "agent",
            text: "Nginx is healthy again. Apache was occupying port 80 — stopped and restarted Nginx.",
          },
        ],
      },
    ],
  },
  {
    id: "setup",
    tabLabel: "Set up",
    heading: "Get your server ready",
    description:
      "Describe what you want to run, and get help installing and configuring what you need, from web servers to Docker.",
    durationMs: 9000,
    sequence: [
      {
        atMs: 0,
        terminalLines: ["root@vps:~#"],
        agentMessages: [
          {
            from: "user",
            text: "Set up a LAMP stack on this server and make sure Apache and MySQL start automatically on reboot.",
          },
        ],
      },
      {
        atMs: 1600,
        terminalLines: [
          "Setting up apache2 (2.4.58) ...",
          "Setting up mysql-server (8.0.39) ...",
        ],
        agentMessages: [
          {
            from: "user",
            text: "Set up a LAMP stack on this server and make sure Apache and MySQL start automatically on reboot.",
          },
          {
            from: "agent",
            text: "I’ll install Apache, MySQL, and PHP, then enable them to start on reboot. Install LAMP stack?",
          },
        ],
        confirmPrompt: "Install LAMP stack?",
      },
      {
        atMs: 3800,
        terminalLines: [
          "Setting up apache2 (2.4.58) ...",
          "Setting up mysql-server (8.0.39) ...",
          "Setting up php (8.3) ...",
          "root@vps:~# systemctl enable apache2 mysql",
          "Synchronizing state of apache2.service",
        ],
        agentMessages: [
          {
            from: "user",
            text: "Set up a LAMP stack on this server and make sure Apache and MySQL start automatically on reboot.",
          },
          {
            from: "agent",
            text: "I’ll install Apache, MySQL, and PHP, then enable them to start on reboot. Install LAMP stack?",
          },
        ],
        confirmPrompt: "Install LAMP stack?",
      },
      {
        atMs: 6200,
        terminalLines: [
          "Setting up apache2 (2.4.58) ...",
          "Setting up mysql-server (8.0.39) ...",
          "Setting up php (8.3) ...",
          "root@vps:~# systemctl enable apache2 mysql",
          "Synchronizing state of apache2.service",
          "Created symlink /etc/systemd/system/multi-user.target.wants/apache2.service",
          "root@vps:~# systemctl is-enabled apache2 mysql",
          "enabled",
          "enabled",
        ],
        agentMessages: [
          {
            from: "user",
            text: "Set up a LAMP stack on this server and make sure Apache and MySQL start automatically on reboot.",
          },
          {
            from: "agent",
            text: "LAMP is installed. Apache and MySQL are enabled for reboot.",
          },
        ],
      },
    ],
  },
  {
    id: "deploy",
    tabLabel: "Deploy",
    heading: "Bring your project online",
    description:
      "Help publish a web project or application to the VPS, including configuration, command execution, and resolving deployment errors.",
    durationMs: 9000,
    sequence: [
      {
        atMs: 0,
        terminalLines: ["root@vps:~/app#"],
        agentMessages: [
          {
            from: "user",
            text: "Deploy my Node app from main and keep it running after logout.",
          },
        ],
      },
      {
        atMs: 2000,
        terminalLines: [
          "root@vps:~/app# git pull origin main",
          "Updating a1b2c3d..e4f5a6b",
          "Fast-forward",
          "root@vps:~/app# npm ci && npm run build",
        ],
        agentMessages: [
          {
            from: "user",
            text: "Deploy my Node app from main and keep it running after logout.",
          },
          {
            from: "agent",
            text: "I’ll pull main, install deps, build, then start with a process manager. Deploy now?",
          },
        ],
        confirmPrompt: "Deploy now?",
      },
      {
        atMs: 5200,
        terminalLines: [
          "root@vps:~/app# git pull origin main",
          "Updating a1b2c3d..e4f5a6b",
          "Fast-forward",
          "root@vps:~/app# npm ci && npm run build",
          "> app@1.4.0 build",
          "✓ Built in 3.8s",
          "root@vps:~/app# pm2 start dist/server.js --name web",
          "[PM2] App [web] launched",
          "root@vps:~/app# curl -I http://127.0.0.1:3000",
          "HTTP/1.1 200 OK",
        ],
        agentMessages: [
          {
            from: "user",
            text: "Deploy my Node app from main and keep it running after logout.",
          },
          {
            from: "agent",
            text: "App is running under PM2 and responding with HTTP 200.",
          },
        ],
      },
    ],
  },
  {
    id: "secure",
    tabLabel: "Secure",
    heading: "Strengthen your server's security",
    description:
      "Improve VPS security with guided hardening, updates and other protective changes directly in the console.",
    durationMs: 9000,
    sequence: [
      {
        atMs: 0,
        terminalLines: ["root@vps:~#"],
        agentMessages: [
          {
            from: "user",
            text: "Harden this VPS: updates, firewall, and SSH basics.",
          },
        ],
      },
      {
        atMs: 2000,
        terminalLines: [
          "root@vps:~# apt-get update && apt-get upgrade -y",
          "Reading package lists... Done",
          "root@vps:~# ufw allow OpenSSH && ufw enable",
        ],
        agentMessages: [
          {
            from: "user",
            text: "Harden this VPS: updates, firewall, and SSH basics.",
          },
          {
            from: "agent",
            text: "I’ll apply updates, enable UFW for SSH, and verify the firewall. Continue?",
          },
        ],
        confirmPrompt: "Continue?",
      },
      {
        atMs: 5500,
        terminalLines: [
          "root@vps:~# apt-get update && apt-get upgrade -y",
          "Reading package lists... Done",
          "root@vps:~# ufw allow OpenSSH && ufw enable",
          "Firewall is active and enabled on system startup",
          "root@vps:~# ufw status verbose",
          "Status: active",
          "To                         Action      From",
          "22/tcp                     ALLOW IN    Anywhere",
          'root@vps:~# echo "Security checks complete."',
          "Security checks complete.",
        ],
        agentMessages: [
          {
            from: "user",
            text: "Harden this VPS: updates, firewall, and SSH basics.",
          },
          {
            from: "agent",
            text: "Updates applied and UFW is active with SSH allowed. Security checks complete.",
          },
        ],
      },
    ],
  },
];
