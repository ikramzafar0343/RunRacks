/**
 * Product, setup, and login categories from the training sheet.
 */
import {
  CHEAP,
  CONTACT,
  DEMO,
  LINUX_NOTE,
  RDP_NOTE,
  WINDOWS_NOTE,
  firstMatch,
  say,
} from "./trainingFacts.js";

function linux(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/what is a linux vps/, "A Linux VPS in this catalog is a virtual server with full root access."],
      [/ubuntu|debian|almalinux|alma linux/, "Linux cards name Ubuntu, Debian, and AlmaLinux. They do not list versions."],
      [/rocky|centos|fedora|arch|custom linux iso|kali|freebsd/, "That distribution is not listed on the Linux cards."],
      [/root access/, "Linux cards say full root access."],
      [/kvm|openvz|virtualization/, "The cards do not say KVM or OpenVZ."],
      [/docker|kubernetes|kernel|nested|desktop environment|gui/, "Root access means you can try to install it yourself. I will not claim it is supported."],
      [/cpanel|plesk|cyberpanel|aapanel|webmin|hestia|cloudpanel/, "Those panels are not included. A license is not priced here."],
      [/openvpn|wireguard|mail server|mysql|postgres|mongodb|redis|node|python|telegram|discord|lamp|lemp/, "You can install your own software on a root server. I will not promise mail deliverability or a one-click app."],
      [/multiple websites/, "Root access lets you host more than one site. I will not promise a site count."],
      [/swap|guaranteed|dedicated or shared|disk i\/o|port speed|ipv6/, "Swap, a dedicated-versus-shared CPU claim, disk I/O, and IPv6 are not on the card. Linux cards label a 1 Gbps port and 30 TB traffic."],
      [/how do i connect|ssh port|ssh key|root password|vnc|console|iso/, "Connect with SSH as root. I do not know your port or password, and I will not ask you to paste them."],
      [/production|pre-install|firewall|one-click/, "Nothing is promised as pre-installed. A production fit is your choice from the published specs."],
    ],
    LINUX_NOTE,
  );
  return say(lead, LINUX_NOTE, CHEAP, CONTACT);
}

function windows(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/what is a windows vps/, "A Windows VPS is a Windows Server virtual machine with administrator access."],
      [/2019|2022|2025|windows 10|windows 11|language|time zone/, WINDOWS_NOTE],
      [/license|activated|bring my own/, "I will not say the license is included or that you can bring your own."],
      [/administrator access|how do i connect|rdp port|from a mac|android|iphone/, "Connect with Remote Desktop using the administrator account. I do not know the port or password."],
      [/how many users|rds|cal|multiple users/, "I cannot promise a concurrent-user count or that RDS CALs are included."],
      [/metatrader|mt4|mt5|office|sql server|asp\.net|iis|chrome|browser|game server|antivirus|defender|windows update|automation|selenium|puppeteer/, "You can install software you are licensed to use. That is not a performance promise and not a managed install."],
      [/more expensive/, "Windows VPS 1 is $8.99/mo demo and Linux VPS 1 is $4.49/mo demo. I will not invent a license explanation for the gap."],
      [/how long|setup take|gpu|audio|copy and paste|drag and drop|map my local|disk space does windows/, "Setup time, GPU, audio, and how much disk Windows itself uses are not on the card."],
    ],
    WINDOWS_NOTE,
  );
  return say(lead, WINDOWS_NOTE, CHEAP, CONTACT);
}

function rdp(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/what is rdp|difference between your rdp|windows vps/, "Admin RDP is the remote-desktop plan. Windows VPS is the Windows server plan. They are different cards."],
      [/shared or private|admin access/, RDP_NOTE],
      [/which windows version/, WINDOWS_NOTE],
      [/how do i log|which app|on windows|on mac|on mobile/, "Use Microsoft Remote Desktop or the Remote Desktop client on your device. I do not know your address or password."],
      [/torrent|mining|email sending|scraping|gaming|youtube|streaming|downloading|social media|browser|freelanc|upwork|fiverr|banking|paypal/, "I will not say that workload is allowed. The acceptable-use policy is not published."],
      [/dedicated|country|us ip|uk ip|residential|internet speed|bandwidth/, "You pick a region from the eight countries. I will not promise a residential IP, a city, or an unmetered port."],
      [/24\/7|stay on|after i disconnect|programs keep running/, "I will not promise that a desktop session or a program keeps running after you disconnect."],
      [/how many rdp sessions|multiple people|another user/, "I cannot promise extra users or CALs."],
      [/password/, "Do not paste the password here. I cannot reset it from chat."],
      [/instantly|how long|activate/, "I will not promise instant Admin RDP delivery."],
      [/safe|hacked|secure my rdp/, "I cannot promise it cannot be broken into. Use a long unique password and do not share it in chat."],
      [/upgrade my rdp to a windows/, "Compare a Windows VPS card. I cannot convert a plan from chat."],
    ],
    RDP_NOTE,
  );
  return say(lead, RDP_NOTE, `Regions: United States, United Kingdom, Canada, Netherlands, Germany, Singapore, Australia, and Japan.`, CHEAP, CONTACT);
}

function setup(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/how long|instant|pending|hours|weekends|ready to use|showing offline|can.t i ping/, "Linux cards label delivery as about 15 minutes. That is not proof your server is being built, and I cannot see a pending order."],
      [/login details|welcome email|didn.t receive|not working|username/, "I cannot see or resend a welcome email. Do not paste a password here."],
      [/after payment|automatic/, "Payment is not connected, so I cannot say setup starts after a charge."],
      [/pre-install|set up my server|setup help|wordpress|cpanel|domain|migrate|migration|mt4|vpn|configure/, "I cannot install software, migrate a site, or configure a domain for you."],
      [/first after|secure my new|update my server|setup guide|video/, "First step on Linux is SSH as root, and on Windows it is Remote Desktop. I do not have a video tutorial to send."],
      [/hostname/, "I cannot change a hostname from chat."],
    ],
    "I cannot see whether a server is in setup.",
  );
  return say(lead, DEMO, CONTACT);
}

function access(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/ssh|putty|termius|mac or linux|connection refused|timed out|access denied|too many authentication/, "Use SSH for Linux. Connection refused, timeout, and access denied have to be checked on the server. I cannot see it."],
      [/reset my server password|reset my root|reset the rdp password|change the rdp password|you reset/, "I cannot reset a password from chat. Do not paste one here."],
      [/firewall|locked myself|vnc|web console|whitelist|ip is blocked/, "I cannot open a console or a firewall for you. Contact is the path if you are locked out."],
      [/rdp|credentials|can.t connect|internal error|network level|disconnects|very slow|black after|wrong characters|resolution|copy-paste/, "Use Remote Desktop for Windows. I cannot see the session or your password."],
      [/filezilla|sftp|winscp|transfer files|upload|copy files/, "SFTP or the Remote Desktop clipboard is how people move files. I cannot upload them for you."],
      [/root login disabled|sudo|ssh keys|password login/, "Linux cards say full root access. I will not claim root login is disabled by default."],
      [/multiple devices|time out|screen or tmux|after i disconnect|browser/, "I will not promise session length or that a process keeps running. screen and tmux are tools you install yourself."],
      [/do you have access/, "Do not assume staff access, and do not paste credentials here."],
    ],
    "Linux uses SSH. Windows VPS and Admin RDP use Remote Desktop.",
  );
  return say(lead, "Linux uses SSH. Windows VPS and Admin RDP use Remote Desktop.", CONTACT);
}

function os(m: string): string {
  const lead = firstMatch(
    m,
    [
      [/delete my data|wipe|losing/, "Reinstalling an OS normally erases the disk. I cannot promise a second disk or the IP survives."],
      [/how do i reinstall|how long|how many times|myself|for me|stuck|can.t log in/, "Reinstall is not a live action from this chat. I cannot start one or see a stuck job."],
      [/switch from linux|switch from windows|fee to switch/, "Switching family means a different card. I will not quote a switch fee or promise data is kept."],
      [/templates|new os|own iso|not in the list|kali|freebsd|pfsense|mikrotik|proxmox|truenas|windows 10|windows 7|32-bit/, "Only the OS names on the cards are confirmed: Ubuntu, Debian, AlmaLinux, and Windows Server chosen at order."],
      [/ip change|password change|language|upgrade ubuntu|upgrade windows|kept up to date|minimal|bloatware|control panel during|default username/, "I will not promise the IP, password, language, or a clean image. You patch the OS yourself."],
      [/backup before/, "Take your own copy first. Backup inclusion is not verified."],
      [/which os version|check which/, "Linux cards do not pin Ubuntu, Debian, or AlmaLinux versions."],
      [/rescue|boot order/, "Rescue mode and boot order are not confirmed as a button I can press."],
    ],
    "OS reinstall is not something this chat can run.",
  );
  return say(lead, LINUX_NOTE, WINDOWS_NOTE, CONTACT);
}

export function hostCategory(category: string, matching: string): string | null {
  const c = category.toLowerCase();
  if (c.startsWith("linux")) return linux(matching);
  if (c.startsWith("windows")) return windows(matching);
  if (c.startsWith("rdp")) return rdp(matching);
  if (c.startsWith("setup")) return setup(matching);
  if (c.startsWith("server access")) return access(matching);
  if (c.startsWith("operating")) return os(matching);
  return null;
}
