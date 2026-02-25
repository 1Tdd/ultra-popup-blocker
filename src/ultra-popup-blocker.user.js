// ==UserScript==
// @name         Ultra Popup Blocker v2
// @description  A smart popup blocker with strict mode and advanced redirect protection.
// @namespace    https://github.com/1Tdd
// @author       1Tdd
// @version      2.1
// @license      MIT
// @icon         data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIyczgtNCA4LTEwVjVsLTgtMy04IDN2N2MwIDYgOCAxMCA4IDEweiIvPjxwYXRoIGQ9Ik05IDEybDIgMiA0LTQiLz48L3N2Zz4=
// @compatible   firefox Tampermonkey / Violentmonkey
// @compatible   chrome Tampermonkey / Violentmonkey
// @match        *://*/*
// @run-at       document-start
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// ==/UserScript==

(function () {
    'use strict';

    // Constants and Configuration
    const CONSTANTS = {
        TIMEOUT_SECONDS: 15,
        TOAST_DURATION_MS: 2500,
        MODAL_WIDTH_PC: '550px',
        LOGO_SVG: "data:image/svg+xml;base64,PHN2ZyB2aWV3Qm94PSIwIDAgMjQgMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbD0ibm9uZSIgc3Ryb2tlPSIjZTBlMGUwIiBzdHJva2Utd2lkdGg9IjIiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCI+PHBhdGggZD0iTTEyIDIyczgtNCA4LTEwVjVsLTgtMy04IDN2N2MwIDYgOCAxMCA4IDEweiIvPjxwYXRoIGQ9Ik05IDEybDIgMiA0LTQiLz48L3N2Zz4=",
        STORAGE_KEYS: {
            ALL: "allow_",
            DEN: "deny_",
            IDX: "upb_idx_v7",
            CONFIG: "upb_config"
        }
    };

    const globalScope = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const originalOpen = globalScope.open;

    // CSS Styles
    const STYLES = `
        .upb-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;height:32px!important;padding:0 14px!important;margin:0!important;box-sizing:border-box!important;border-radius:2px!important;font-size:12px!important;font-weight:400!important;cursor:pointer!important;transition:background 0.1s,color 0.1s!important;line-height:1!important;outline:0!important;white-space:nowrap!important;font-family:monospace,"Courier New",Courier,sans-serif!important;text-transform:uppercase!important;letter-spacing:0.5px!important;-webkit-appearance:none!important;appearance:none!important;}
        .upb-allow{background:transparent!important;color:#E0E0E0!important;border:1px solid #E0E0E0!important}
        .upb-allow:hover{background:#E0E0E0!important;color:#000!important}
        .upb-trust{background:transparent!important;color:#E0E0E0!important;border:1px solid #E0E0E0!important}
        .upb-trust:hover{background:#E0E0E0!important;color:#000!important}
        .upb-deny{background:transparent!important;color:#E0E0E0!important;border:1px solid #E0E0E0!important;font-weight:bold!important}
        .upb-deny:hover{background:#E0E0E0!important;color:#000!important}
        .upb-denyTemp{background:transparent!important;color:#999!important;border:1px dashed #999!important}
        .upb-denyTemp:hover{background:#999!important;color:#000!important}
        .upb-neutral{background:transparent!important;color:#888!important;border:1px solid #444!important}
        .upb-neutral:hover{background:#444!important;color:#E0E0E0!important}
        
        #upb-bar{position:fixed!important;bottom:20px!important;left:50%!important;transform:translateX(-50%)!important;z-index:2147483647!important;width:auto!important;max-width:95%!important;padding:10px 14px!important;display:none;align-items:center!important;gap:15px!important;font-family:monospace,"Courier New",Courier,sans-serif!important;font-size:12px!important;color:#E0E0E0!important;background:#000!important;border:1px solid #444!important}
        
        #upb-modal{position:fixed!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;width:${CONSTANTS.MODAL_WIDTH_PC}!important;z-index:2147483647!important;font-family:monospace,"Courier New",Courier,sans-serif!important;color:#E0E0E0!important;background:#000!important;border:1px solid #444!important;overflow:hidden!important;display:flex;flex-direction:column;max-height:85vh!important}
        
        #upb-head{padding:12px 16px!important;font-size:13px!important;text-transform:uppercase!important;letter-spacing:1px!important;border-bottom:1px dashed #444!important;background:#0A0A0A!important;display:flex;align-items:center;gap:10px}
        #upb-body{padding:20px 16px!important;display:flex!important;justify-content:space-between!important;gap:20px!important;overflow-y:auto}
        .upb-col{width:48%}
        #upb-foot{padding:12px 16px!important;text-align:right!important;border-top:1px dashed #444!important;background:#0A0A0A!important}
        
        .upb-inp{flex:1!important;height:32px!important;padding:0 10px!important;margin:0!important;background:#0B0B0B!important;border:1px solid #444!important;border-radius:2px!important;color:#E0E0E0!important;font-size:12px!important;font-family:monospace,"Courier New",Courier,sans-serif!important;box-sizing:border-box!important;outline:none!important;-webkit-appearance:none!important;appearance:none!important;}
        .upb-inp:focus{border-color:#888!important;background:#111!important}
        .upb-list{margin:0!important;padding:0!important;list-style:none!important;max-height:200px!important;overflow-y:auto!important;background:#080808!important;border:1px solid #444!important}
        .upb-item{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:6px 10px!important;border-bottom:1px solid #222!important;font-size:12px!important}
        .upb-item:last-child{border-bottom:none!important}
        .upb-del{color:#666!important;cursor:pointer!important;font-size:14px!important;display:flex!important;align-items:center!important;justify-content:center!important;width:20px!important;height:20px!important;border-radius:4px!important;transition:all 0.1s!important}
        .upb-del:hover{color:#FFF!important;background:#333!important}
        
        .upb-actions{display:flex;gap:8px;border-left:1px dashed #444;padding-left:15px}
        .upb-info{display:flex;align-items:center;gap:10px;text-transform:none!important;}
        .upb-toast{position:fixed!important;bottom:20px!important;right:20px!important;background:#000!important;border:1px solid #444!important;color:#E0E0E0!important;padding:10px 14px!important;z-index:2147483647!important;font-family:monospace,"Courier New",Courier,sans-serif!important;font-size:12px!important;transition:opacity .2s ease-out!important;pointer-events:none!important}
        
        .upb-toggle-row { display: flex; justify-content: space-between; align-items: center; padding: 12px 0; border-bottom: 1px dotted #444; }
        .upb-toggle-label { font-size: 12px; color: #AAA; }
        .upb-toggle-switch { position: relative; display: inline-block; width: 34px; height: 18px; border: 1px solid #444; background: #080808; cursor: pointer; flex-shrink: 0; box-sizing: content-box; }
        .upb-toggle-switch input { position: absolute; opacity: 0; width: 0; height: 0; margin: 0; padding: 0; pointer-events: none; }
        .upb-slider { position: absolute; top: 50%; left: 2px; width: 14px; height: 14px; background-color: #444; will-change: transform; transform: translateY(-50%); transition: transform .1s, background-color .1s; }
        input:checked + .upb-slider { background-color: #E0E0E0; transform: translate(16px, -50%); }

        /* SCROLLBARS */
        .upb-list::-webkit-scrollbar { width: 6px; }
        .upb-list::-webkit-scrollbar-track { background: #000; border-left: 1px solid #222; }
        .upb-list::-webkit-scrollbar-thumb { background: #444; border: 1px solid #000; }
        .upb-list::-webkit-scrollbar-thumb:hover { background: #666; }

        /* CUSTOM HEADER TEXT OVERRIDE */
        h3 { font-family: monospace,"Courier New",Courier,sans-serif !important; font-size: 11px !important; text-transform: uppercase !important; color: #888 !important; font-weight: normal !important; letter-spacing: 1px; }

        /* MOBILE OPTIMIZATION */
        @media (max-width: 700px) {
            #upb-bar { flex-direction: column !important; width: 90% !important; padding: 12px !important; bottom: 15px !important; align-items: stretch !important; gap: 10px !important; }
            .upb-info { justify-content: flex-start; margin-bottom: 4px; }
            .upb-actions { border-left: none !important; padding-left: 0 !important; display: grid !important; grid-template-columns: 1fr 1fr; gap: 8px !important; }
            .upb-actions button:last-child { grid-column: span 2; }
            #upb-modal { width: 92% !important; max-height: 85vh !important; }
            #upb-body { flex-direction: column !important; padding: 16px !important; }
            .upb-col { width: 100% !important; margin-bottom: 16px; }
        }
    `;

    // FakeWindow proxy — mimics a real window object to fool anti-adblock scripts
    const FakeWindow = (() => {
        const handler = {
            get: (target, prop) => {
                if (typeof prop === 'symbol') return undefined; // Prevent proxying symbols
                if (prop === 'closed') return false; // Trick scripts into thinking the popup is open
                if (prop === 'opener') return new Proxy({}, handler);
                if (prop === 'document') return new Proxy({}, handler);
                if (prop === 'location') return new Proxy({}, handler);
                if (prop === 'focus' || prop === 'blur' || prop === 'close') return () => { };
                if (prop === 'postMessage') return () => { };
                if (typeof prop === 'string' && prop.startsWith('on')) return null;

                return new Proxy(function () { }, handler);
            },
            set: () => true,
            apply: () => undefined,
            construct: () => new Proxy({}, handler)
        };
        return new Proxy(function () { }, handler);
    })();

    // Event Bus
    const Events = {
        listeners: {},
        on(event, callback) { (this.listeners[event] = this.listeners[event] || []).push(callback); },
        emit(event, data) { if (this.listeners[event]) this.listeners[event].forEach(cb => cb(data)); }
    };

    // Domain Manager — handles allowing/denying domains and storage interactions
    class DomainManager {
        static async getIndex() {
            const data = await GM.getValue(CONSTANTS.STORAGE_KEYS.IDX);
            return (data && data.a) ? data : { a: [], d: [] };
        }

        static async getConfig() {
            const defaults = { strictMode: false, notifications: true };
            const config = await GM.getValue(CONSTANTS.STORAGE_KEYS.CONFIG);
            return { ...defaults, ...config };
        }

        static async setConfig(newConfig) {
            const current = await this.getConfig();
            await GM.setValue(CONSTANTS.STORAGE_KEYS.CONFIG, { ...current, ...newConfig });
            Events.emit("configChange");
        }

        static parseDomain(url) {
            try {
                if (url.includes('localhost')) return 'localhost';
                let hostname = url.includes("//") ? new URL(url).hostname : url;
                hostname = hostname.trim().toLowerCase().replace(/^www\./, '');

                if (!hostname.includes('.')) return hostname;

                // If the last two segments are both short (<=3 chars), treat as compound TLD
                const parts = hostname.split('.');
                const last = parts[parts.length - 1];
                const secondLast = parts.length > 1 ? parts[parts.length - 2] : '';

                if (parts.length > 2 && last.length <= 3 && secondLast.length <= 3) {
                    return parts.slice(-3).join('.');
                }
                return parts.slice(-2).join('.');
            } catch { return null; }
        }

        static async getDomainState(domain) {
            if (!domain) return "ask";

            // Check exact match first
            if (await GM.getValue(CONSTANTS.STORAGE_KEYS.ALL + domain)) return "allow";
            if (await GM.getValue(CONSTANTS.STORAGE_KEYS.DEN + domain)) return "deny";

            // Check config for strict mode
            const config = await this.getConfig();
            if (config.strictMode) return "deny";

            return "ask";
        }

        static async modifyDomain(domain, type) {
            const index = await this.getIndex();

            // Remove from both lists first to ensure no duplicates
            index.a = index.a.filter(x => x !== domain);
            index.d = index.d.filter(x => x !== domain);

            await GM.deleteValue(CONSTANTS.STORAGE_KEYS.ALL + domain);
            await GM.deleteValue(CONSTANTS.STORAGE_KEYS.DEN + domain);

            if (type === 'allow') {
                index.a.push(domain);
                await GM.setValue(CONSTANTS.STORAGE_KEYS.ALL + domain, 1);
            } else if (type === 'deny') {
                index.d.push(domain);
                await GM.setValue(CONSTANTS.STORAGE_KEYS.DEN + domain, 1);
            }

            await GM.setValue(CONSTANTS.STORAGE_KEYS.IDX, index);
            Events.emit("change");
        }
    }

    // UI Utilities
    const createButton = (text, className, onClick) => {
        const btn = document.createElement("button");
        btn.className = `upb-btn upb-${className}`;

        const [t1, t2] = text.split(/ (.*)/s);
        const span1 = document.createElement("span");
        span1.textContent = t1;
        btn.appendChild(span1);
        if (t2) {
            const span2 = document.createElement("span");
            span2.textContent = t2;
            btn.appendChild(span2);
        }
        btn.onclick = onClick;
        return btn;
    };

    // Toast Notification
    class Toast {
        constructor() {
            this.element = null;
            this.timer = null;
            this.notificationsEnabled = true;

            Events.on("configChange", async () => {
                const config = await DomainManager.getConfig();
                this.notificationsEnabled = config.notifications;
            });
        }

        async init() {
            const config = await DomainManager.getConfig();
            this.notificationsEnabled = config.notifications;
        }

        show(message) {
            if (!this.notificationsEnabled) return;

            if (this.element) this.element.remove();
            if (!document.body) return;

            this.element = document.createElement("div");
            this.element.className = "upb-toast";
            this.element.textContent = message;
            this.element.style.opacity = "0";
            this.element.style.transform = "translateY(10px)";

            document.body.appendChild(this.element);

            requestAnimationFrame(() => {
                if (this.element) {
                    this.element.style.opacity = "1";
                    this.element.style.transform = "translateY(0)";
                }
            });

            if (this.timer) clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                if (this.element) this.element.remove();
                this.element = null;
            }, CONSTANTS.TOAST_DURATION_MS);
        }
    }

    // Action Bar (Bottom Bar)
    class NotificationBar {
        constructor() {
            this.element = null;
            this.timer = null;
            this.count = CONSTANTS.TIMEOUT_SECONDS;
        }

        show(url) {
            url = url ? String(url) : "about:blank";

            if (!this.element) {
                this.element = document.createElement("div");
                this.element.id = "upb-bar";
                document.body.appendChild(this.element);
            }

            this.count = CONSTANTS.TIMEOUT_SECONDS;
            if (this.timer) clearInterval(this.timer);

            this.element.style.display = "flex";
            this.element.innerHTML = '';
            Shield.arm();

            const domain = DomainManager.parseDomain(location.hostname);
            const denyBtn = createButton(`[ Deny (${this.count}) ]`, "denyTemp", () => this.hide());

            const info = document.createElement("div");
            info.className = "upb-info";
            const displayUrl = url.length > 40 ? url.substring(0, 40) + '...' : url;
            const escapedUrl = url.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            const escapedDisplayUrl = displayUrl.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
            info.innerHTML = `<img src="${CONSTANTS.LOGO_SVG}" style="width:20px;height:20px"><span>Blocked popup to <a href="${escapedUrl}" target="_blank" style="color:#64D2FF;text-decoration:none">${escapedDisplayUrl}</a></span>`;

            const actions = document.createElement("div");
            actions.className = "upb-actions";
            actions.append(
                createButton("[ Allow ]", "allow", () => {
                    this.hide();
                    Shield.pass(() => originalOpen(url));
                }),
                createButton("[ Trust ]", "trust", () => {
                    this.hide();
                    DomainManager.modifyDomain(domain, 'allow');
                }),
                createButton("[ Block ]", "deny", () => {
                    if (confirm(`Permanently block ${domain}?`)) {
                        this.hide();
                        DomainManager.modifyDomain(domain, 'deny');
                    }
                }),
                denyBtn,
                createButton("[ Settings ]", "neutral", () => ConfigUI.show())
            );

            this.element.append(info, actions);

            this.timer = setInterval(() => {
                this.count--;
                const span = denyBtn.querySelector("span:last-child");
                if (span) span.textContent = `[ Deny (${this.count}) ]`;
                if (this.count <= 0) this.hide();
            }, 1000);
        }

        hide() {
            Shield.disarm();
            if (this.timer) clearInterval(this.timer);
            if (this.element) {
                this.element.remove();
                this.element = null;
            }
        }
    }

    // Configuration UI
    class ConfigManager {
        constructor() {
            this.element = null;
            this.escapeHandler = null;

            Events.on("change", () => this.element && this.refreshLists());
            Events.on("configChange", () => this.element && this.refreshConfig());
        }

        show() {
            if (this.element) return this.hide();
            InputShield.arm();

            this.element = document.createElement("div");
            this.element.id = "upb-modal";
            this.element.innerHTML = `
                <div id="upb-head"><img src="${CONSTANTS.LOGO_SVG}" style="width:24px">Ultra Popup Blocker</div>
                <div style="padding: 10px 16px 0 16px;">
                    <div class="upb-toggle-row">
                        <span class="upb-toggle-label">Strict Mode (Block All by Default)</span>
                        <label class="upb-toggle-switch">
                            <input type="checkbox" id="upb-strict-mode">
                            <span class="upb-slider"></span>
                        </label>
                    </div>
                    <div class="upb-toggle-row">
                        <span class="upb-toggle-label">Show Toast Notifications</span>
                        <label class="upb-toggle-switch">
                            <input type="checkbox" id="upb-notifications">
                            <span class="upb-slider"></span>
                        </label>
                    </div>
                </div>
                <div id="upb-body"></div>
                <div id="upb-foot"></div>
            `;

            const body = this.element.querySelector("#upb-body");
            body.append(this.createColumn("Allowed", "allow"), this.createColumn("Denied", "deny"));

            this.element.querySelector("#upb-foot").appendChild(createButton("Close", "neutral", () => this.hide()));

            document.body.appendChild(this.element);

            this.refreshLists();
            this.bindConfigEvents();

            this.escapeHandler = e => { if (e.key === 'Escape') this.hide(); };
            window.addEventListener('keydown', this.escapeHandler);
        }

        hide() {
            InputShield.disarm();
            if (this.element) this.element.remove();
            this.element = null;
            if (this.escapeHandler) {
                window.removeEventListener('keydown', this.escapeHandler);
                this.escapeHandler = null;
            }
        }

        async bindConfigEvents() {
            const config = await DomainManager.getConfig();
            const strictCheck = this.element.querySelector('#upb-strict-mode');
            const notifyCheck = this.element.querySelector('#upb-notifications');

            if (strictCheck) {
                strictCheck.checked = config.strictMode;
                strictCheck.onchange = e => DomainManager.setConfig({ strictMode: e.target.checked });
            }
            if (notifyCheck) {
                notifyCheck.checked = config.notifications;
                notifyCheck.onchange = e => DomainManager.setConfig({ notifications: e.target.checked });
            }
        }

        createColumn(title, type) {
            const col = document.createElement("div");
            col.className = "upb-col";

            const input = document.createElement("input");
            input.className = "upb-inp";
            input.placeholder = "domain.com";
            input.setAttribute("autocorrect", "off");
            input.setAttribute("autocapitalize", "off");
            input.setAttribute("spellcheck", "false");
            input.setAttribute("data-upb-input", "true");

            const list = document.createElement("ul");
            list.className = `upb-list upb-l-${type}`;

            const addBtn = createButton("Add", "trust", () => {
                const domain = DomainManager.parseDomain(input.value);
                if (domain) {
                    input.value = "";
                    DomainManager.modifyDomain(domain, type);
                }
            });

            input.onkeydown = e => e.key === "Enter" && addBtn.click();

            const header = document.createElement("h3");
            header.textContent = title;
            header.style.cssText = "margin:0 0 10px 0;text-align:center";

            const form = document.createElement("div");
            form.style.cssText = "display:flex;gap:8px;margin-bottom:10px;align-items:stretch;";
            form.append(input, addBtn);

            col.append(header, form, list);
            return col;
        }

        async refreshLists() {
            const index = await DomainManager.getIndex();

            const updateList = (selector, items) => {
                const ul = this.element.querySelector(selector);
                if (!ul) return;
                ul.innerHTML = '';
                (items || []).sort().forEach(domain => {
                    const li = document.createElement("li");
                    li.className = "upb-item";
                    const span = document.createElement("span");
                    span.textContent = domain;
                    li.appendChild(span);

                    const delBtn = document.createElement("div");
                    delBtn.className = "upb-del";
                    delBtn.textContent = "×";
                    delBtn.onclick = () => DomainManager.modifyDomain(domain, 'remove');

                    li.appendChild(delBtn);
                    ul.appendChild(li);
                });
            };

            updateList('.upb-l-allow', index.a);
            updateList('.upb-l-deny', index.d);
        }

        async refreshConfig() {
            // Re-bind to update UI state if changed externally
            this.bindConfigEvents();
        }
    }

    // Redirect Shield — prevents pages from redirecting when a popup is blocked
    const Shield = {
        active: false,
        passing: false,
        boundHandler: null,
        handler(e) {
            if (!this.passing) {
                e.preventDefault();
                e.returnValue = "";
                return "";
            }
        },
        arm() {
            if (this.active) return;
            this.boundHandler = this.handler.bind(this);
            window.addEventListener("beforeunload", this.boundHandler, true);
            this.active = true;
        },
        disarm() {
            if (!this.active) return;
            window.removeEventListener("beforeunload", this.boundHandler, true);
            this.active = false;
        },
        pass(callback) {
            this.passing = true;
            if (callback) callback();
            setTimeout(() => this.passing = false, 500);
        }
    };

    // Input Shield — protects UPB input fields from hostile sites that block keyboard events
    const InputShield = {
        active: false,
        eventTypes: ['keydown', 'keypress', 'keyup', 'input', 'beforeinput'],

        handler(e) {
            const target = e.target;
            // Check if the event target is a UPB input field
            if (target && target.hasAttribute && target.hasAttribute('data-upb-input')) {
                // Stop the event from reaching hostile site listeners
                e.stopPropagation();
                e.stopImmediatePropagation();
            }
        },

        arm() {
            if (this.active) return;
            this.boundHandler = this.handler.bind(this);
            this.eventTypes.forEach(type => {
                // Use capturing phase with highest priority
                document.addEventListener(type, this.boundHandler, true);
            });
            this.active = true;
        },

        disarm() {
            if (!this.active) return;
            this.eventTypes.forEach(type => {
                document.removeEventListener(type, this.boundHandler, true);
            });
            this.active = false;
        }
    };

    // --- INITIALIZATION & MAIN LOGIC ---
    const ConfigUI = new ConfigManager();
    const Notification = new NotificationBar();
    const toast = new Toast();
    let CurrentState = "ask";
    let DenyToastDebounce = 0;

    // Known-good popup destinations (OAuth, payments, etc.)
    const POPUP_ALLOWLIST = [
        /accounts\.google\.com/,
        /login\.microsoftonline\.com/,
        /github\.com\/login\/oauth/,
        /api\.twitter\.com\/oauth/,
        /appleid\.apple\.com/,
        /checkout\.stripe\.com/,
        /paypal\.com/,
    ];

    // Sites where link clicks should never be blocked (search engines, etc.)
    const SEARCH_ENGINE_ORIGINS = [
        /^(www\.)?google\.[a-z.]{2,}$/,
        /^(www\.)?bing\.com$/,
        /^(www\.)?yahoo\.com$/,
        /^(www\.)?duckduckgo\.com$/,
        /^(www\.)?startpage\.com$/,
        /^(www\.)?ecosia\.org$/,
        /^(www\.)?search\.brave\.com$/,
        /^(www\.)?yandex\.(com|ru)$/,
    ];

    function isOnSearchEngine() {
        return SEARCH_ENGINE_ORIGINS.some(p => p.test(location.hostname));
    }

    function isLegitimatePopup(url) {
        if (!url) return false;
        try {
            if (typeof url === 'string' && (url.startsWith('blob:') || url.startsWith('data:'))) return true;

            const parsed = new URL(url, location.href);
            if (parsed.origin === location.origin) return true;
            return POPUP_ALLOWLIST.some(pattern => pattern.test(parsed.href));
        } catch {
            return false;
        }
    }

    async function loadState() {
        const domain = DomainManager.parseDomain(location.hostname);
        CurrentState = await DomainManager.getDomainState(domain);
    }

    function handleDeny() {
        Shield.arm();
        lastDenyTime = Date.now();
        const now = lastDenyTime;
        if (now - DenyToastDebounce > 1000) {
            toast.show("[ Popup Blocked ]");
            DenyToastDebounce = now;
        }
        return FakeWindow;
    }

    // When a popup was just blocked, also block fallback redirects for a short window
    let lastDenyTime = 0;
    const REDIRECT_COOLDOWN_MS = 2000;
    function isRedirectCooldown() {
        return (Date.now() - lastDenyTime) < REDIRECT_COOLDOWN_MS;
    }

    function trapEvent(e) {
        if (CurrentState === "allow") return;
        if (isOnSearchEngine() && e.isTrusted) return; // Don't block user clicks on search engines

        // In deny mode, block programmatic (untrusted) click events
        if (!e.isTrusted && CurrentState === "deny") return handleDeny();

        let isPopup = false;
        let url = "";

        if (e.type === "click" || e.type === "auxclick") {
            const target = e.target;
            const link = (target && typeof target.closest === 'function') ? target.closest("a") : null;
            if (link && link.href) {
                // Block javascript: href links (common popup vector)
                if (link.href.startsWith('javascript:') && CurrentState === "deny") {
                    e.preventDefault();
                    e.stopImmediatePropagation();
                    return handleDeny();
                }

                if (!link.hasAttribute('download')) {
                    const isBlank = link.target === "_blank" || (document.querySelector('base[target="_blank"]') && link.target !== "_self");
                    const isMiddleClick = e.type === "auxclick" && e.button === 1;

                    if (isBlank || isMiddleClick) {
                        isPopup = true;
                        url = link.href;
                    }
                }
            }
        } else if (e.type === "submit") {
            const form = e.target.closest("form");
            if (form && form.target === "_blank") {
                isPopup = true;
                url = form.action || location.href;
            }
        }

        if (isPopup) {
            if (isLegitimatePopup(url)) return;

            e.preventDefault();
            e.stopPropagation();
            e.stopImmediatePropagation();

            if (CurrentState === "deny") handleDeny();
            else Notification.show(url);
        }
    }

    // Shared handler for window.open — used by both top window and iframes
    function openHandler(url) {
        url = url ? String(url) : "about:blank";

        if (CurrentState === "allow") return originalOpen.apply(this, arguments);
        if (isLegitimatePopup(url)) return originalOpen.apply(this, arguments);
        if (CurrentState === "deny") return handleDeny();

        Notification.show(url);
        return FakeWindow;
    }

    let openOverridden = false;

    function overrideOpen() {
        if (openOverridden) return;

        const handler = {
            value: openHandler,
            writable: false,
            configurable: false
        };

        try {
            Object.defineProperty(globalScope, 'open', handler);
            openOverridden = true;
        } catch {
            if (globalScope.open === originalOpen) {
                globalScope.open = handler.value;
            }
            openOverridden = true;
        }
    }

    // Hook HTMLFormElement.prototype.submit to catch programmatic bypasses
    let formProtected = false;
    function protectFormSubmit() {
        if (formProtected) return;
        try {
            const origSubmit = HTMLFormElement.prototype.submit;
            HTMLFormElement.prototype.submit = function () {
                if (this.target === "_blank") {
                    const url = this.action || location.href;
                    if (!isLegitimatePopup(url)) {
                        if (CurrentState === "deny") {
                            handleDeny();
                            return;
                        } else if (CurrentState === "ask") {
                            Notification.show(url);
                            return;
                        }
                    }
                }
                return origSubmit.apply(this, arguments);
            };
            formProtected = true;
        } catch { /* ignore */ }
    }

    // Patch iframe contentWindow.open and block malicious iframe src attributes
    function patchIframes() {
        if (CurrentState === "allow") return;

        const iframes = document.querySelectorAll('iframe');
        iframes.forEach(iframe => {
            // Block javascript: and data: src on iframes (popup/ad injection vector)
            if (CurrentState === "deny" && iframe.src) {
                const src = iframe.src.trim().toLowerCase();
                if (src.startsWith('javascript:') || (src.startsWith('data:') && src.includes('text/html'))) {
                    iframe.removeAttribute('src');
                    iframe.srcdoc = '';
                    return;
                }
            }

            // Override contentWindow.open on each iframe
            try {
                const cw = iframe.contentWindow;
                if (!cw) return;

                // Checking if already patched
                let isPatched = false;
                try {
                    isPatched = (cw.open === openHandler);
                } catch {
                    isPatched = true; // Cross-origin, we can't patch anyway
                }

                if (isPatched) return;

                try {
                    Object.defineProperty(cw, 'open', {
                        value: openHandler,
                        writable: false,
                        configurable: false
                    });
                } catch {
                    try { cw.open = openHandler; } catch { /* cross-origin, skip */ }
                }
            } catch { /* cross-origin iframe, skip */ }
        });
    }

    // Intercept location.assign/replace/href to block redirect-style popups
    let locationProtected = false;
    function protectLocation() {
        if (locationProtected) return;
        try {
            const origAssign = location.assign.bind(location);
            const origReplace = location.replace.bind(location);

            Object.defineProperty(location, 'assign', {
                value: function (url) {
                    if (CurrentState === "deny" && (!isLegitimatePopup(url) || isRedirectCooldown())) return handleDeny();
                    return origAssign(url);
                },
                writable: false, configurable: false
            });

            Object.defineProperty(location, 'replace', {
                value: function (url) {
                    if (CurrentState === "deny" && (!isLegitimatePopup(url) || isRedirectCooldown())) return handleDeny();
                    return origReplace(url);
                },
                writable: false, configurable: false
            });

            locationProtected = true;
        } catch {
            // Some browsers restrict overriding location methods
        }

        // Trap location.href setter
        try {
            const loc = globalScope.location;
            const origDescriptor = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(loc), 'href');
            if (origDescriptor && origDescriptor.set) {
                const origSetter = origDescriptor.set;
                Object.defineProperty(loc, 'href', {
                    get: origDescriptor.get,
                    set: function (url) {
                        if (CurrentState === "deny" && (!isLegitimatePopup(url) || isRedirectCooldown())) {
                            handleDeny();
                            return;
                        }
                        origSetter.call(this, url);
                    },
                    configurable: false
                });
            }
        } catch {
            // Some environments don't allow overriding location.href
        }
    }

    // Block meta http-equiv="refresh" redirect injections
    function sanitizeMetaRefresh() {
        if (CurrentState !== "deny") return;
        const metas = document.querySelectorAll('meta[http-equiv="refresh" i]');
        metas.forEach(meta => {
            const content = meta.getAttribute('content') || '';
            // Only block if it has a URL redirect (not just a timer)
            if (/url\s*=/i.test(content)) {
                meta.remove();
                handleDeny();
            }
        });
    }

    // Main Entry Point
    (async () => {
        await toast.init();

        await loadState();
        overrideOpen();
        protectLocation();
        protectFormSubmit();

        function initUI() {
            // Inject CSS
            if (!document.getElementById('upb-css')) {
                const style = document.createElement("style");
                style.id = 'upb-css';
                style.textContent = STYLES;
                (document.head || document.documentElement).appendChild(style);
            }

            // Event Listeners
            window.addEventListener("click", trapEvent, true);
            window.addEventListener("auxclick", trapEvent, true); // Middle click support
            window.addEventListener("submit", trapEvent, true);

            // Universal pointerdown for robust mobile/PC interaction
            window.addEventListener("pointerdown", e => {
                const link = e.target.closest('a');
                if (link && link.href && link.target !== '_blank' && !link.href.startsWith('javascript:')) {
                    Shield.pass();
                }
            }, true);

            // Observer — re-applies open override, patches newly added iframes/metas instantly
            let observerTimer = null;
            const observer = new MutationObserver((mutations) => {
                let instantPatch = false;
                for (let i = 0; i < mutations.length; i++) {
                    const mut = mutations[i];
                    if (mut.addedNodes.length > 0) {
                        for (let j = 0; j < mut.addedNodes.length; j++) {
                            const node = mut.addedNodes[j];
                            if (node.tagName === 'IFRAME' || node.tagName === 'META') {
                                instantPatch = true;
                                break;
                            } else if (node.querySelectorAll && node.querySelector('iframe, meta[http-equiv]')) {
                                instantPatch = true;
                                break;
                            }
                        }
                    }
                    if (instantPatch) break;
                }

                if (instantPatch) {
                    patchIframes();
                    sanitizeMetaRefresh();
                }

                if (observerTimer) return;
                observerTimer = setTimeout(() => {
                    observerTimer = null;
                    if (globalScope.open === originalOpen) {
                        openOverridden = false;
                        overrideOpen();
                    }
                    patchIframes();
                    sanitizeMetaRefresh();
                }, 500);
            });

            const root = document.body || document.documentElement;
            if (root) observer.observe(root, { childList: true, subtree: true });
            patchIframes();
            sanitizeMetaRefresh();

            // Register Menu Command
            GM.registerMenuCommand("[ UPB Settings ]", () => ConfigUI.show());
        }

        // Defer UI init until DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initUI, { once: true });
        } else {
            initUI();
        }

        // Listen for state changes
        Events.on("change", async () => {
            await loadState();
        });

        Events.on("configChange", async () => {
            await loadState();
        });
    })();
})();
