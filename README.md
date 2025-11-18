<div align="center">

<img src="https://raw.githubusercontent.com/1Tdd/ultra-popup-blocker/main/img/upb_logo.svg" width="100" height="100" alt="UPB Logo">

# Ultra Popup Blocker
### The Universal Solution for a Cleaner Web

[![Version](https://img.shields.io/badge/version-6.0-007AFF.svg?style=for-the-badge)](https://github.com/1Tdd/ultra-popup-blocker/releases)
[![License](https://img.shields.io/badge/license-MIT-34C759.svg?style=for-the-badge)](LICENSE)
[![Platform](https://img.shields.io/badge/platform-Universal-5856D6.svg?style=for-the-badge)]()

<br>

**Ultra Popup Blocker (UPB)** is a lightweight, high-performance userscript designed to neutralize modern popup techniques, redirects, and overlay advertisements. Built with a state-of-the-art interception engine, it operates silently in the background, protecting your browsing experience without breaking legitimate websites.

[**💿 Install Now**](https://github.com/1Tdd/ultra-popup-blocker/releases/latest/download/ultra-popup-blocker.user.js) &nbsp;&nbsp;&nbsp; [**🐞 Report Bug**](https://github.com/1Tdd/ultra-popup-blocker/issues)

</div>

---

## ✨ Key Highlights

### 🎨 Apple-Inspired Glassmorphism UI
A stunning, blur-backed interface that feels native to modern operating systems. It adapts intelligently to your device:
*   **Desktop:** A sleek, unobtrusive notification bar.
*   **Mobile:** A touch-optimized control grid designed for thumbs.

<div align="center">
  <img src="https://github.com/user-attachments/assets/1db69d47-818a-4e10-8d22-3b761fd324f9" alt="Ultra Popup Blocker UI Preview" width="100%" style="border-radius: 10px; box-shadow: 0 10px 30px rgba(0,0,0,0.2);">
  <br><em>(The responsive interface adapting to user interaction)</em>
</div>

### 🛡️ Advanced Security Core (v6.0)
*   **The "Black Hole" Proxy:** Uses a recursive `FakeWindow` proxy that absorbs detection attempts. It tricks anti-adblock scripts into thinking a popup opened successfully, preventing site breakage while keeping the popup blocked.
*   **State-Caching Architecture:** Domain status checks are now **O(1)** (instant). Zero lag, even on the heaviest web pages.
*   **CSP Compliance:** Strict "No `innerHTML`" policy ensuring compatibility with security-hardened websites (like GitHub, Twitter, banking sites).

### ⚡ Intelligent Defense Layers
1.  **Trap:** Intercepts `window.open`, `target="_blank"`, and simulated mouse events.
2.  **Shield:** Monitors `beforeunload` events to prevent sites from redirecting your current tab in retaliation for a blocked popup.
3.  **Filter:** Distinguishes between malicious popups and legitimate user actions (like `download` links).

---

## 📦 Installation

### Step 1: Get a Userscript Manager
You need a browser extension to run this script.
*   **Desktop (Chrome, Firefox, Edge):** [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
*   **Android:** Firefox Nightly or Kiwi Browser with Tampermonkey.
*   **iOS (iPhone/iPad):** The "Userscripts" extension for Safari.

### Step 2: Install the Script
Click the button below. Your manager will ask for confirmation.

<div align="center">

[![Install Ultra Popup Blocker](https://img.shields.io/badge/⬇_INSTALL_SCRIPT-Click_Here-007AFF.svg?style=for-the-badge&logo=tampermonkey)](https://github.com/1Tdd/ultra-popup-blocker/releases/latest/download/ultra-popup-blocker.user.js)

</div>

---

## ⚙️ How to Use

UPB works out of the box. When a popup is blocked, you are in control:

| Action | Description |
| :--- | :--- |
| **✅ Allow Once** | Opens the blocked popup just this one time. Useful for login windows. |
| **💙 Trust Site** | Whitelists the domain. Popups will never be blocked here again. |
| **❌ Block Site** | Adds the domain to the **Deny List**. Future attempts will be blocked silently (with a subtle toast notification). |
| **⚙️ Config** | Opens the dashboard to manage your Allowed/Denied lists. |

> **Pro Tip:** On mobile devices, the inputs are optimized to prevent auto-correct and auto-capitalization, making domain entry frustration-free.

---

## 📜 Credits & Acknowledgments

This project is an evolution of the original concept, rebuilt for the modern web.

*   **Lead Developer:** [1Tdd](https://github.com/1Tdd) - Core architecture rewrite, UI design, mobile optimization, and stealth systems.
*   **Original Inspiration:** [Eskander](https://github.com/Eskander) - Author of the original *Popup Blocker Script*, whose foundational logic paved the way for this enhanced edition.

---

<div align="center">
<sub>Distributed under the MIT License. Code is provided "as is" without warranty.</sub>
</div>
