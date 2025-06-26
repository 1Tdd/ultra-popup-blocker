// ==UserScript==
// @name         Ultra Popup Blocker
// @description  Configurable popup blocker that blocks all popup windows by default, with whitelist and blacklist support.
// @namespace    eskander.github.io
// @author       Eskander v. 4.1 & 1Tdd v. 5.0
// @version      5.0
// @include      *
// @license      MIT
// @homepage     https://github.com/Eskander/ultra-popup-blocker
// @supportURL   https://github.com/Eskander/ultra-popup-blocker/issues/new
// @compatible   firefox Tampermonkey / Violentmonkey
// @compatible   chrome Tampermonkey / Violentmonkey
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.listValues
// @grant        GM.registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/387937/Ultra%20Popup%20Blocker.user.js
// @updateURL https://update.greasyfork.org/scripts/387937/Ultra%20Popup%20Blocker.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /* Constants and Globals */
    const CONSTANTS = {
        TIMEOUT_SECONDS: 15,
        TRUNCATE_LENGTH: 50,
        MODAL_WIDTH: '450px'
    }

    const STYLES = {
        modal: `position: fixed !important; top: 50% !important; left: 50% !important; transform: translate(-50%, -50%) !important; background-color: #ffffff !important; color: #000000 !important; width: ${CONSTANTS.MODAL_WIDTH} !important; border: 1px solid #000000 !important; z-index: 2147483647 !important; box-shadow: 0 2px 10px rgba(0,0,0,0.5) !important; margin: 0 !important; padding: 0 !important; font-family: Arial !important; font-size: 14px !important; line-height: 1.5 !important; box-sizing: border-box !important;`,
        modalHeader: `background-color: #000000 !important; padding: 20px 30px !important; color: #ffffff !important; text-align: center !important; margin: 0 !important; font-size: inherit !important; line-height: inherit !important;`,
        modalFooter: `background-color: #000000 !important; padding: 5px 30px !important; color: #ffffff !important; text-align: center !important; margin: 0 !important;`,
        button: `margin-right: 10px !important; padding: 5px !important; cursor: pointer !important; font-family: inherit !important; font-size: inherit !important; line-height: inherit !important; border: 1px solid #000000 !important; background: #ffffff !important; color: #000000 !important; border-radius: 3px !important;`,
        notificationBar: `position: fixed !important; bottom: 0 !important; left: 0 !important; z-index: 2147483646 !important; width: 100% !important; padding: 5px !important; font-family: Arial !important; font-size: 14px !important; line-height: 1.5 !important; background-color: #000000 !important; color: #ffffff !important; display: none !important; margin: 0 !important; box-sizing: border-box !important;`,
        listItem: `padding: 12px 8px 12px 40px !important; font-size: 16px !important; background-color: #ffffff !important; color: #000000 !important; border-bottom: 1px solid #dddddd !important; position: relative !important; transition: 0.2s !important; margin: 0 !important;`,
        removeButton: `cursor: pointer !important; position: absolute !important; right: 0 !important; top: 0 !important; padding: 12px 16px !important; background: transparent !important; border: none !important; color: #000000 !important; font-size: 20px !important;`
    }

    const global = (typeof unsafeWindow !== 'undefined') ? unsafeWindow : window;
    global.upbCounter = 0

    const realWindowOpen = global.open

    const FakeWindow = {
        blur: () => false,
        focus: () => false
    }

    /* Domain Management */
    class DomainManager {
        static async getCurrentTopDomain () {
            const hostname = document.location.hostname;
            const matches = hostname.match(/[^.]+\.[^.]+$/);
            return matches ? matches[0] : hostname;
        }
        static async getPermissionStatus (domain) {
            return await GM.getValue(domain, 'ask');
        }
        static async setPermission (domain, status) {
            await GM.setValue(domain, status);
        }
        static async removePermission (domain) {
            await GM.deleteValue(domain);
        }
        static async getAllPermissions () {
            const keys = await GM.listValues();
            const permissions = [];
            for (const key of keys) {
                const status = await GM.getValue(key);
                if (status === 'allowed' || status === 'denied') {
                    permissions.push({ domain: key, status: status });
                }
            }
            return permissions;
        }
    }

    /* UI Components */
    class UIComponents {
        static createButton (text, id, clickHandler, color) {
            const button = document.createElement('button')
            button.id = `upb-${id}`
            button.innerHTML = text
            button.style.cssText = `${STYLES.button} color: ${color} !important;`
            button.addEventListener('click', clickHandler)
            return button
        }
        static createNotificationBar () {
            const bar = document.createElement('div')
            bar.id = 'upb-notification-bar'
            bar.style.cssText = STYLES.notificationBar
            document.body.appendChild(bar);
            return bar
        }
        static createModalElement () {
            const modal = document.createElement('div')
            modal.id = 'upb-trusted-domains-modal'
            modal.style.cssText = STYLES.modal
            document.body.appendChild(modal);
            return modal
        }
        static updateDenyButtonText (button, timeLeft) {
            if (button) {
                button.innerHTML = `🔴 Deny (${timeLeft})`
            }
        }
    }

    /* Notification Bar */
    class NotificationBar {
        constructor () {
            this.element = null
            this.timeLeft = CONSTANTS.TIMEOUT_SECONDS
            this.denyTimeoutId = null
            this.denyButton = null
        }
        createElement () {
            if (!this.element) {
                this.element = UIComponents.createNotificationBar()
            }
            return this.element
        }
        show (url) {
            if (!this.element) {
                this.createElement()
            }
            this.element.style.display = 'block'
            this.setMessage(url)
            this.addButtons(url)
            this.startDenyTimeout()
        }
        hide () {
            if (this.element) {
                this.element.style.display = 'none'
                if (this.element.parentNode) {
                    this.element.parentNode.removeChild(this.element)
                }
                this.element = null
            }
            global.upbCounter = 0
            this.clearDenyTimeout()
        }
        clearDenyTimeout () {
            if (this.denyTimeoutId) {
                clearInterval(this.denyTimeoutId)
                this.denyTimeoutId = null
            }
        }
        setMessage (url) {
            const truncatedUrl = url.length > CONSTANTS.TRUNCATE_LENGTH
            ? `${url.substring(0, CONSTANTS.TRUNCATE_LENGTH)}..`
            : url
            this.element.innerHTML = `
              Ultra Popup Blocker: This site is attempting to open <b>${global.upbCounter}</b> popup(s).
              <a href="${url}" style="color:yellow;" target="_blank">${truncatedUrl}</a>
            `
        }
        async addButtons (url) {
            const currentDomain = await DomainManager.getCurrentTopDomain()
            this.element.appendChild(
                UIComponents.createButton('🟢 Allow Once', 'allow', () => {
                    realWindowOpen(url, '_blank')
                    this.hide()
                }, 'green')
            )
            this.element.appendChild(
                UIComponents.createButton('🔵 Always Allow', 'trust', async () => {
                    await DomainManager.setPermission(currentDomain, 'allowed')
                    realWindowOpen(url, '_blank')
                    this.hide()
                    await PopupBlocker.initialize()
                }, 'blue')
            )
            this.element.appendChild(
                UIComponents.createButton('🚫 Always Deny', 'deny-always', async () => {
                    await DomainManager.setPermission(currentDomain, 'denied');
                    this.hide();
                    await PopupBlocker.initialize();
                }, '#333')
            );
            this.denyButton = UIComponents.createButton(`🔴 Deny (${CONSTANTS.TIMEOUT_SECONDS})`, 'deny-once', () => {
                this.hide()
            }, 'red')
            this.element.appendChild(this.denyButton)
            const configButton = UIComponents.createButton('🟠 Config', 'config', () => {
                new TrustedDomainsModal().show()
            }, 'orange')
            configButton.style.float = 'right'
            this.element.appendChild(configButton)
        }
        startDenyTimeout () {
            this.timeLeft = CONSTANTS.TIMEOUT_SECONDS
            this.clearDenyTimeout()
            UIComponents.updateDenyButtonText(this.denyButton, this.timeLeft)
            this.denyTimeoutId = setInterval(() => {
                this.timeLeft--
                UIComponents.updateDenyButtonText(this.denyButton, this.timeLeft)
                if (this.timeLeft <= 0) {
                    this.clearDenyTimeout()
                    this.hide()
                }
            }, 1000)
        }
    }

    /* MODIFIED Trusted Domains Modal */
    class TrustedDomainsModal {
        constructor () {
            this.element = document.getElementById('upb-trusted-domains-modal') || this.createElement()
        }
        createElement () {
            const modal = UIComponents.createModalElement()
            const header = document.createElement('div')
            header.style.cssText = STYLES.modalHeader
            header.innerHTML = `<h2 style="color:white !important; margin:0; padding:0;">Ultra Popup Blocker</h2>`
            modal.appendChild(header)
            const listsContainer = document.createElement('div');
            listsContainer.id = 'upb-lists-container';
            listsContainer.style.cssText = 'max-height: 400px; overflow-y: auto;';
            const allowedHeader = document.createElement('h4');
            allowedHeader.innerText = '✅ Allowed Websites (Whitelist)';
            allowedHeader.style.cssText = 'padding: 10px 20px 5px; margin: 0; background: #f0f0f0; color: black;';
            const allowedList = document.createElement('ul');
            allowedList.id = 'upb-allowed-list';
            allowedList.style.cssText = 'margin:0;padding:0;list-style-type:none;';
            const blockedHeader = document.createElement('h4');
            blockedHeader.innerText = '🚫 Denied Websites (Blacklist)';
            blockedHeader.style.cssText = 'padding: 10px 20px 5px; margin: 0; background: #f0f0f0; color: black; border-top: 1px solid #ccc;';
            const deniedList = document.createElement('ul');
            deniedList.id = 'upb-denied-list';
            deniedList.style.cssText = 'margin:0;padding:0;list-style-type:none;';
            listsContainer.appendChild(allowedHeader);
            listsContainer.appendChild(allowedList);
            listsContainer.appendChild(blockedHeader);
            listsContainer.appendChild(deniedList);
            modal.appendChild(listsContainer);
            const footer = document.createElement('div')
            footer.style.cssText = STYLES.modalFooter
            const closeButton = document.createElement('button')
            closeButton.innerText = 'Close'
            closeButton.style.cssText = `background-color:#4CAF50;color:#ffffff;border:none;padding:10px 20px;cursor:pointer;border-radius:3px;`
            closeButton.onclick = () => this.hide()
            footer.appendChild(closeButton)
            modal.appendChild(footer)
            return modal
        }
        show () {
            this.refreshDomainsList()
            this.element.style.display = 'block'
        }
        hide () {
            this.element.style.display = 'none'
        }
        
        async refreshDomainsList () {
            const allowedList = document.getElementById('upb-allowed-list');
            const deniedList = document.getElementById('upb-denied-list');
            allowedList.innerHTML = '';
            deniedList.innerHTML = '';

            const permissions = await DomainManager.getAllPermissions();

            let allowedCount = 0;
            let deniedCount = 0;

            for (const perm of permissions) {
                if (perm.status === 'allowed') {
                    await this.addDomainListItem(allowedList, perm.domain);
                    allowedCount++;
                } else if (perm.status === 'denied') {
                    await this.addDomainListItem(deniedList, perm.domain);
                    deniedCount++;
                }
            }

            if (allowedCount === 0) {
                const message = document.createElement('p');
                message.style.cssText = 'padding: 20px; color: #555; text-align: center;';
                message.innerText = 'No allowed websites.';
                allowedList.appendChild(message);
            }

            if (deniedCount === 0) {
                const message = document.createElement('p');
                message.style.cssText = 'padding: 20px; color: #555; text-align: center;';
                message.innerText = 'No denied websites.';
                deniedList.appendChild(message);
            }
        }

        async addDomainListItem (list, domain) {
            const item = document.createElement('li')
            item.style.cssText = STYLES.listItem
            item.innerText = domain
            item.addEventListener('mouseover', () => { item.style.backgroundColor = '#f1f1f1' })
            item.addEventListener('mouseout', () => { item.style.backgroundColor = 'white' })
            const removeButton = document.createElement('span')
            removeButton.style.cssText = STYLES.removeButton
            removeButton.innerHTML = '×'
            removeButton.addEventListener('mouseover', () => { removeButton.style.backgroundColor = '#f44336'; removeButton.style.color = 'white'; })
            removeButton.addEventListener('mouseout', () => { removeButton.style.backgroundColor = 'transparent'; removeButton.style.color = 'black'; })
            removeButton.addEventListener('click', async () => {
                await DomainManager.removePermission(domain);
                await this.refreshDomainsList();
                await PopupBlocker.initialize();
            })
            item.appendChild(removeButton)
            list.appendChild(item)
        }
    }

    class PopupBlocker {
        static clickHandler = null;

        static async initialize () {
            global.open = realWindowOpen;
            if (this.clickHandler) {
                document.removeEventListener('click', this.clickHandler, true);
                this.clickHandler = null;
            }

            const currentDomain = await DomainManager.getCurrentTopDomain();
            const permission = await DomainManager.getPermissionStatus(currentDomain);

            if (permission === 'allowed') {
                console.log(`[UPB] Whitelisted domain: ${currentDomain}. Popups are allowed.`);
                return;
            }

            const notificationBar = new NotificationBar();

            const windowOpenHandler = (url) => {
                global.upbCounter++;
                console.log(`[UPB] Intercepted window.open popup: ${url}`);
                notificationBar.show(url);
                return FakeWindow;
            };
            const silentWindowOpenHandler = (url) => {
                console.log(`[UPB] Silently blocked window.open on denied domain: ${url}`);
                return FakeWindow;
            };
            
            const clickHandler = (event) => {
                let target = event.target;
                while (target && target.tagName !== 'A') {
                    target = target.parentNode;
                }

                if (target && target.target === '_blank' && target.href) {
                    event.preventDefault();
                    event.stopPropagation();
                    global.upbCounter++;
                    console.log(`[UPB] Intercepted click-based popup: ${target.href}`);
                    notificationBar.show(target.href);
                }
            };
            const silentClickHandler = (event) => {
                 let target = event.target;
                while (target && target.tagName !== 'A') {
                    target = target.parentNode;
                }
                if (target && target.target === '_blank' && target.href) {
                    event.preventDefault();
                    event.stopPropagation();
                    console.log(`[UPB] Silently blocked click-based popup on denied domain: ${target.href}`);
                }
            };

            if (permission === 'denied') {
                console.log(`[UPB] Denied domain: ${currentDomain}. All popups will be silently blocked.`);
                global.open = silentWindowOpenHandler;
                this.clickHandler = silentClickHandler;
                document.addEventListener('click', this.clickHandler, true);
                return;
            }

            console.log(`[UPB] Active on: ${currentDomain}. New popups will trigger a notification.`);
            global.open = windowOpenHandler;
            this.clickHandler = clickHandler;
            document.addEventListener('click', this.clickHandler, true);
        }
    }

    /* Initialize */
    (async function() {
        if (document.body) {
            await PopupBlocker.initialize();
            GM.registerMenuCommand('Ultra Popup Blocker: Manage Permissions', () => {
                new TrustedDomainsModal().show();
            });
        } else {
            window.addEventListener('load', async () => {
                await PopupBlocker.initialize();
                GM.registerMenuCommand('Ultra Popup Blocker: Manage Permissions', () => {
                    new TrustedDomainsModal().show();
                });
            });
        }
    })();

})();
