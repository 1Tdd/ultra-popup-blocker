<p align="center">
  <img src="https://raw.githubusercontent.com/1Tdd/ultra-popup-blocker/main/img/upb_logo.svg" alt="Ultra Popup Blocker Logo" width="150">
</p>

<h1 align="center">Ultra Popup Blocker (Enhanced Edition)</h1>

<p align="center">
  <strong>The popup blocker, re-engineered for the modern web.</strong>
  <br>
  A powerful, intelligent, and elegant userscript that defeats the most aggressive popups, modals, and redirects while providing a seamless user experience.
</p>

<p align="center">
    <img src="https://img.shields.io/badge/version-5.0-blue.svg" alt="Version 5.0">
    <img src="https://img.shields.io/badge/license-MIT-green.svg" alt="License MIT">
    <a href="https://github.com/1Tdd/ultra-popup-blocker/issues">
        <img src="https://img.shields.io/github/issues/1Tdd/ultra-popup-blocker" alt="GitHub issues">
    </a>
</p>

---

## 🚀 Installation

1.  **Install a Userscript Manager:** You need a browser extension like [Tampermonkey](https://www.tampermonkey.net/) (recommended for Chrome) or [Violentmonkey](https://violentmonkey.github.io/) (recommended for Firefox).
2.  **Install the Script:** Click the link below to install the latest version directly from GitHub. Your userscript manager will prompt you to confirm the installation.

    <p align="center">
      <a href="https://github.com/1Tdd/ultra-popup-blocker/releases/latest/download/ultra-popup-blocker.user.js">
        <img src="https://img.shields.io/badge/-Install_Latest_Release-brightgreen?style=for-the-badge&logo=tampermonkey" alt="Install Latest Release">
      </a>
    </p>

---

## 🌟 What Makes This the *Enhanced* Edition?

This script began with the solid foundation of [Eskander's original Ultra Popup Blocker](https://github.com/Eskander/ultra-popup-blocker). This new version, completely re-architected by **1Tdd**, elevates it with powerful new features and a modern architecture to meet the challenges of today's web.

Here’s a comparison of the key enhancements:

| Feature                            | Original by Eskander | Enhanced Edition by 1Tdd                                                              |
| ---------------------------------- | :------------------: | :--------------------------------------------------------------------------------------: |
| **User Interface**                 | Standard Browser UI  | ✨ **Sleek "Glassmorphism" UI** inspired by modern design |
| **Modal & Overlay Blocking**       | Not available        | 🛡️ **Heuristic engine** that detects and neutralizes annoying modal dialogs            |
| **Redirect Protection**            | Not available        | ⚔️ **Powerful `beforeunload` shield** that stops popups from hijacking your main page    |
| **SPA Compatibility**              | Limited              | 🔄 **Full support for modern sites** (Google, Facebook, etc.) via `MutationObserver`   |
| **Storage System**                 | Standard GM Storage  | 🧠 **Resilient, self-indexed storage** that works even on highly restrictive sites   |
| **Configuration**                  | Basic                | ⚙️ **Centralized panel** to manage all allowed/denied sites                               |

---

## ✨ Core Features

### Intelligent 3-State Logic
You are always in control. For every website, you can choose to:
-   🔵 **Allow:** Let all popups through. Perfect for sites you trust.
-   🔴 **Deny:** Silently block all popups without any notification. Ideal for websites you never want to be interrupted by again.
-   ❔ **Ask (Default):** The script blocks the popup and presents a beautiful, non-intrusive notification bar, asking you what to do.

### Advanced Blocking Engine
-   **Window Popups:** Intercepts `window.open` calls, distinguishing between user-initiated actions and aggressive scripts.
-   **Tab Opening Links:** Blocks links and forms designed to open in a new tab (`target="_blank"`).
-   **Modal & Overlay Blocking:** Detects and hides annoying elements that cover the page, like newsletter signups and cookie banners, while automatically re-enabling page scrolling.
-   **Redirect Protection:** A powerful shield activates when a popup is blocked, preventing the original page from being redirected to an unwanted site.

### Modern & User-Friendly
-   **Sleek "Glass" UI:** A beautiful, dark-mode, glassmorphism interface for all notifications and configuration panels.
-   **Custom Logo & Icons:** A polished and professional look and feel.
-   **Escape Hatch:** If our modal blocker ever gets in the way of a legitimate login window, use the "Disable Modal Blocker (1 Tab)" command from your userscript manager's menu to temporarily pause it.

---

## 📸 A Glimpse of the UI

<p align="center">
  <strong>The clean and intuitive configuration panel:</strong>
  <br>
  <img src="https://github.com/user-attachments/assets/1db69d47-818a-4e10-8d22-3b761fd324f9" alt="Configuration Panel Screenshot" width="600">
</p>

<p align="center">
  <strong>The non-intrusive notification bar in action:</strong>
  <br>
  <img src="https://github.com/user-attachments/assets/3df24748-76b1-41aa-b6ec-121bb1f33337" alt="Notification Bar Screenshot" width="700">
</p>

---

## 🔧 How to Use

*   **The Notification Bar:** When a popup is blocked, a sleek bar will appear at the bottom of the screen with clear options.
*   **Configuration Panel:** Access the configuration panel from the "⚙️ Config" button on the notification bar, or through the Tampermonkey menu. Here you can manually add, view, and remove sites from your Allowed and Denied lists.
*   **Toast Notifications:** When on a "Denied" site or when a modal is hidden, you'll receive a discreet, temporary notification in the bottom-right corner.

## ❤️ Credits & Thanks

*   **1Tdd** - Lead developer of the Enhanced Edition.
*   **Eskander** - For creating the original, foundational Ultra Popup Blocker.
