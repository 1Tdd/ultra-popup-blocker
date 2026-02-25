<div align="center">

<img src="https://raw.githubusercontent.com/1Tdd/ultra-popup-blocker/main/img/upb_logo.svg" width="100" height="100" alt="UPB Logo">

# Ultra Popup Blocker

[![Version](https://img.shields.io/badge/version-2.1-007AFF.svg?style=flat-square)](https://github.com/1Tdd/ultra-popup-blocker/releases)
[![License](https://img.shields.io/badge/license-MIT-34C759.svg?style=flat-square)](LICENSE)

<br>

**Ultra Popup Blocker (UPB)** is a userscript that stops popups, redirects, and background tabs. It intercepts `window.open` calls and catches hidden link clicks before they execute, letting you decide what gets to open.

[**Install UPB**](https://github.com/1Tdd/ultra-popup-blocker/releases/latest/download/ultra-popup-blocker.user.js) &nbsp;&nbsp;&nbsp; [**Report an Issue**](https://github.com/1Tdd/ultra-popup-blocker/issues)

</div>

---

## What it does

### UI and Behavior
The interface is a minimal monospace console overlay.
*   **Action Bar:** Appears at the bottom of the screen only when a popup is intercepted.
*   **Config Menu:** A basic dashboard (accessible via your script manager) to manage your allow and deny lists.

<div align="center">
  <img src="https://github.com/user-attachments/assets/1db69d47-818a-4e10-8d22-3b761fd324f9" alt="UPB UI Preview" width="100%" style="border-radius: 4px; border: 1px solid #444;">
</div>

### Blocking Mechanics
*   **Proxy Object:** UPB uses a custom proxy to absorb detection scripts. When a site tries to verify if its popup was blocked, the proxy tricks it into thinking the popup opened successfully.
*   **Strict Mode:** A toggle to block all popups across all sites without prompting.
*   **Element Patching:** Watches the DOM and instantly strips malicious `iframe` attributes and `<meta http-equiv="refresh">` tags as they load.
*   **Event Trapping:** Hooks into programmatic `submit` events, silent `target="_blank"` link clicks, and simulated middle-clicks.
*   **Redirection Prevention:** Monitors `beforeunload` and `location.assign/replace` to stop websites from retaliating by redirecting your current tab if their popup fails to open.
*   **Iframe Hooking:** Replaces `contentWindow.open` natively to ensure nested frames cannot bypass the blocker.

---

## Installation

You will need a userscript manager extension installed in your browser.

*   **Desktop (Chrome, Firefox, Edge):** [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/).
*   **Android:** Firefox Nightly or Kiwi Browser with Tampermonkey.
*   **iOS (iPhone/iPad):** "Userscripts" extension for Safari.

Once you have a manager installed, [click here to install the script](https://github.com/1Tdd/ultra-popup-blocker/releases/latest/download/ultra-popup-blocker.user.js).

---

## Usage

When a popup is blocked, a bar will appear at the bottom of your screen for 15 seconds. If you ignore it, the popup is discarded.

* **[ Allow ]**: Opens the blocked popup this one time.
* **[ Trust ]**: Whitelists the domain. Popups from this site will always be allowed.
* **[ Block ]**: Adds the domain to the deny list. Future attempts will be blocked silently.
* **[ Settings ]**: Opens the configuration menu to toggle Strict Mode and edit your domain lists.

Note that some common sites (like standard OAuth login screens or payment processors) are whitelisted by default to prevent breaking normal website functionality.

---

## Credits

*   **Lead Developer:** [1Tdd](https://github.com/1Tdd) - Rewrite, logic patching, and UI.
*   **Original Script:** [Eskander](https://github.com/Eskander) - Author of the original Popup Blocker Script.

---

<div align="center">
<sub>Distributed under the MIT License</sub>
</div>
