// ==UserScript==
// @name         Ultra Popup Blocker
// @description  A sleek, modern popup blocker with an Apple-inspired glassmorphism UI and advanced redirect protection.
// @namespace    https://github.com/1Tdd
// @author       1Tdd
// @version      6.0
// @include      *
// @license      MIT
// @homepage     https://github.com/1Tdd/ultra-popup-blocker
// @supportURL   https://github.com/1Tdd/ultra-popup-blocker/issues/new
// @icon         data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhdXJvcmEtZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM1ODU2RDYiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGMkQ1NSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGOTgwQSIvPjwvbGluZWFyR3JhZGllbnQ+PG1hc2sgaWQ9InRleHQtbWFzayI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTMlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0Rm9udCwgJ1NlZ29lIFVJJywgUm9ib3RvLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iYmxhY2siPlVQQjwvdGV4dD48L21hc2s+PC9kZWZzPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMjIiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSIyMiIgZmlsbD0idXJsKCNhdXJvcmEtZ3JhZGllbnQpIiBtYXNrPSJ1cmwoI3RleHQtbWFzaykiIC8+PC9zdmc+
// @compatible   firefox Tampermonkey / Violentmonkey
// @compatible   chrome Tampermonkey / Violentmonkey
// @run-at       document-start
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM.deleteValue
// @grant        GM.registerMenuCommand
// ==/UserScript==

(function() {
    'use strict';

    const C = {
        TIMEOUT: 15,
        TOAST_TIME: 2500,
        MODAL_W_PC: '550px',
        LOGO: "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgdmlld0JveD0iMCAwIDEwMCAxMDAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PGxpbmVhckdyYWRpZW50IGlkPSJhdXJvcmEtZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjEwMCUiIHgyPSIxMDAlIiB5Mj0iMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM1ODU2RDYiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGMkQ1NSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3R5bGU9InN0b3AtY29sb3I6I0ZGOTgwQSIvPjwvbGluZWFyR3JhZGllbnQ+PG1hc2sgaWQ9InRleHQtbWFzayI+PHJlY3Qgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9IndoaXRlIiAvPjx0ZXh0IHg9IjUwJSIgeT0iNTMlIiBkb21pbmFudC1iYXNlbGluZT0ibWlkZGxlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBmb250LWZhbWlseT0iLWFwcGxlLXN5c3RlbSwgQmxpbmtNYWNTeXN0Rm9udCwgJ1NlZ29lIFVJJywgUm9ib3RvLCBIZWx2ZXRpY2EsIEFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjQwIiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0iYmxhY2siPlVQQjwvdGV4dD48L21hc2s+PC9kZWZzPjxyZWN0IHg9IjEwIiB5PSIxMCIgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiByeD0iMjIiIGZpbGw9IiMwMDAwMDAiIC8+PHJlY3QgeD0iMTAiIHk9IjEwIiB3aWR0aD0iODAiIGhlaWdodD0iODAiIHJ4PSIyMiIgZmlsbD0idXJsKCNhdXJvcmEtZ3JhZGllbnQpIiBtYXNrPSJ1cmwoI3RleHQtbWFzaykiIC8+PC9zdmc+"
    };

    const global = typeof unsafeWindow !== 'undefined' ? unsafeWindow : window;
    const realOpen = global.open;

    // --- RESPONSIVE CSS ---
    const CSS = `
        .upb-btn{display:inline-flex!important;align-items:center!important;justify-content:center!important;gap:8px!important;padding:10px 20px!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.1)!important;font-size:14px!important;font-weight:600!important;cursor:pointer!important;transition:all .2s ease-out!important;line-height:1.2!important;outline:0!important;white-space:nowrap!important}
        .upb-btn:hover{filter:brightness(1.1);transform:translateY(-1px)}.upb-btn:active{transform:scale(.96);filter:brightness(.95)}
        .upb-allow{background:linear-gradient(to right,#24D169,#23C15D)!important;color:#003D11!important;border:0!important}
        .upb-trust{background:linear-gradient(to right,#0B84FF,#3DA0FF)!important;color:#fff!important;border:0!important}
        .upb-deny{background:linear-gradient(to right,#FF3B30,#FF453A)!important;color:#fff!important;border:0!important}
        .upb-denyTemp{background:linear-gradient(to right,#5856D6,#6B69D6)!important;color:#fff!important;border:0!important}
        .upb-neutral{background:rgba(118,118,128,.3)!important;color:#fff!important;border-color:rgba(255,255,255,.15)!important}
        .upb-neutral:hover{background:rgba(118,118,128,.5)!important}
        
        #upb-bar{position:fixed!important;bottom:20px!important;left:50%!important;transform:translateX(-50%)!important;z-index:2147483647!important;width:auto!important;max-width:95%!important;padding:12px!important;border-radius:20px!important;display:none;align-items:center!important;gap:15px!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif!important;font-size:14px!important;color:#F5F5F7!important;background:rgba(28,28,30,.85)!important;-webkit-backdrop-filter:blur(25px)!important;backdrop-filter:blur(25px)!important;border:1px solid rgba(255,255,255,.15)!important;box-shadow:0 12px 40px 0 rgba(0,0,0,.4),inset 0 0 0 1px rgba(255,255,255,.15)}
        
        #upb-modal{position:fixed!important;top:50%!important;left:50%!important;transform:translate(-50%,-50%)!important;width:${C.MODAL_W_PC}!important;z-index:2147483647!important;border-radius:24px!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif!important;color:#F5F5F7!important;background:rgba(28,28,30,.9)!important;-webkit-backdrop-filter:blur(25px)!important;backdrop-filter:blur(25px)!important;border:1px solid rgba(255,255,255,.15)!important;box-shadow:0 12px 40px 0 rgba(0,0,0,.4);overflow:hidden!important;display:flex;flex-direction:column;max-height:90vh!important}
        
        #upb-head{padding:16px!important;text-align:center!important;font-size:18px!important;font-weight:600!important;border-bottom:1px solid rgba(255,255,255,.15)!important;background:rgba(255,255,255,.05)!important;display:flex;align-items:center;justify-content:center;gap:10px}
        #upb-body{padding:20px!important;display:flex!important;justify-content:space-between!important;gap:20px!important;overflow-y:auto}
        .upb-col{width:48%}
        #upb-foot{padding:10px 20px!important;text-align:center!important;border-top:1px solid rgba(255,255,255,.15)!important;background:rgba(0,0,0,.1)!important}
        
        .upb-inp{width:100%!important;padding:10px!important;background:rgba(118,118,128,.24)!important;border:1px solid rgba(118,118,128,.32)!important;border-radius:8px!important;color:#F5F5F7!important;font-size:14px!important;box-sizing:border-box!important}
        .upb-list{margin:0!important;padding:0!important;list-style:none!important;max-height:250px!important;overflow-y:auto!important;background:rgba(118,118,128,.12)!important;border-radius:12px!important;border:1px solid rgba(255,255,255,.08)!important}
        .upb-item{display:flex!important;align-items:center!important;justify-content:space-between!important;padding:10px 12px!important;border-bottom:1px solid rgba(118,118,128,.12)!important}
        .upb-del{width:22px!important;height:22px!important;border-radius:50%!important;background:rgba(118,118,128,.24)!important;color:#F5F5F7!important;cursor:pointer!important;display:flex!important;align-items:center!important;justify-content:center!important;transition:.2s}
        .upb-del:hover{background:#FF453A!important}
        
        .upb-actions{display:flex;gap:8px;border-left:1px solid rgba(255,255,255,.15);padding-left:15px}
        .upb-info{display:flex;align-items:center;gap:15px}
        .upb-toast{position:fixed!important;bottom:20px!important;right:20px!important;background:rgba(28,28,30,.75)!important;-webkit-backdrop-filter:blur(10px)!important;backdrop-filter:blur(10px)!important;border:1px solid rgba(255,255,255,.1)!important;color:#fff!important;padding:10px 20px!important;border-radius:99px!important;z-index:2147483647!important;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif!important;font-size:14px!important;box-shadow:0 4px 20px rgba(0,0,0,.4)!important;transition:all .3s ease-in-out!important;pointer-events:none!important}

        /* MOBILE OPTIMIZATION */
        @media (max-width: 700px) {
            #upb-bar { flex-direction: column !important; width: 90% !important; padding: 15px !important; bottom: 15px !important; align-items: stretch !important; gap: 12px !important; }
            .upb-info { justify-content: center; margin-bottom: 5px; text-align: center; }
            .upb-actions { border-left: none !important; padding-left: 0 !important; display: grid !important; grid-template-columns: 1fr 1fr; gap: 10px !important; }
            .upb-actions button:last-child { grid-column: span 2; }
            #upb-modal { width: 92% !important; max-height: 85vh !important; }
            #upb-body { flex-direction: column !important; padding: 15px !important; }
            .upb-col { width: 100% !important; margin-bottom: 20px; }
        }
    `;

    // --- THE "BLACK HOLE" FAKE WINDOW (Indestructible) ---
    const FakeWindow = (() => {
        const p = {
            get: (t, r) => r === "closed" ? true : new Proxy(function() {}, p),
            set: () => true,
            apply: () => undefined
        };
        return new Proxy(function() {}, p)
    })();

    const Events = {
        ls: {},
        on(e, f) { (this.ls[e] = this.ls[e] || []).push(f) },
        emit(e, d) { if (this.ls[e]) this.ls[e].forEach(f => f(d)) }
    };

    class DomainMgr {
        static K = { ALL: "allow_", DEN: "deny_", IDX: "upb_idx_v6" };
        static async getIdx() { const d = await GM.getValue(this.K.IDX); return (d && d.a) ? d : { a: [], d: [] }; }
        static parse(u) {
            try {
                let h = u.includes("//") ? new URL(u).hostname : u;
                h = h.trim().toLowerCase().replace(/^www\./, '');
                if (!h.includes('.')) return null;
                const p = h.split('.');
                return (p.length > 2 && ["co.uk", "com.au", "com.br", "gov.uk", "ac.uk", "co.jp"].includes(p.slice(-2).join('.'))) ? p.slice(-3).join('.') : p.slice(-2).join('.');
            } catch { return null; }
        }
        static async state(d) {
            if (!d) return "ask";
            if (await GM.getValue(this.K.ALL + d)) return "allow";
            if (await GM.getValue(this.K.DEN + d)) return "deny";
            return "ask";
        }
        static async mod(d, t) {
            const i = await this.getIdx();
            i.a = i.a.filter(x => x !== d);
            i.d = i.d.filter(x => x !== d);
            await GM.deleteValue(this.K.ALL + d);
            await GM.deleteValue(this.K.DEN + d);
            
            if (t === 'allow') { i.a.push(d); await GM.setValue(this.K.ALL + d, 1); }
            else if (t === 'deny') { i.d.push(d); await GM.setValue(this.K.DEN + d, 1); }
            
            await GM.setValue(this.K.IDX, i);
            Events.emit("change");
        }
    }

    const mkBtn = (txt, cls, fn) => {
        const b = document.createElement("button");
        b.className = `upb-btn upb-${cls}`;
        const [t1, t2] = txt.split(/ (.*)/s);
        b.innerHTML = `<span>${t1}</span>${t2 ? `<span>${t2}</span>` : ''}`;
        b.onclick = fn;
        return b;
    };

    class Toast {
        constructor() { this.el = null; this.tm = null; }
        show(m) {
            if (this.el) this.el.remove();
            if (!document.body) return;
            this.el = document.createElement("div");
            this.el.className = "upb-toast";
            this.el.textContent = m;
            this.el.style.opacity = "0";
            this.el.style.transform = "translateY(10px)";
            document.body.appendChild(this.el);
            requestAnimationFrame(() => { if(this.el) { this.el.style.opacity="1"; this.el.style.transform="translateY(0)"; }});
            this.tm = setTimeout(() => { if(this.el) this.el.remove(); this.el = null; }, C.TOAST_TIME);
        }
    }

    class Notify {
        constructor() { this.el = null; this.tm = null; this.cnt = C.TIMEOUT; }
        show(url) {
            if (!this.el) {
                this.el = document.createElement("div");
                this.el.id = "upb-bar";
                document.body.appendChild(this.el);
            }
            this.cnt = C.TIMEOUT;
            if (this.tm) clearInterval(this.tm);
            
            this.el.style.display = "flex";
            this.el.innerHTML = '';
            Shield.arm();

            const t = DomainMgr.parse(location.hostname);
            const dBtn = mkBtn(`🚫 Deny (${this.cnt})`, "denyTemp", () => this.hide());

            const info = document.createElement("div");
            info.className = "upb-info";
            info.innerHTML = `<img src="${C.LOGO}" style="width:20px;height:20px"><span>Blocked popup to <a href="${url}" target="_blank" style="color:#64D2FF;text-decoration:none">${url.length>40?url.substring(0,40)+'...':url}</a></span>`;

            const act = document.createElement("div");
            act.className = "upb-actions";
            act.append(
                mkBtn("✅ Allow Once", "allow", () => { this.hide(); Shield.pass(() => realOpen(url)); }),
                mkBtn("💙 Trust", "trust", () => { this.hide(); DomainMgr.mod(t, 'allow'); }),
                mkBtn("❌ Block", "deny", () => { if(confirm(`Permanently block ${t}?`)) { this.hide(); DomainMgr.mod(t, 'deny'); } }),
                dBtn,
                mkBtn("⚙️", "neutral", () => Conf.show())
            );

            this.el.append(info, act);
            
            this.tm = setInterval(() => {
                this.cnt--;
                dBtn.querySelector("span:last-child").textContent = `Deny (${this.cnt})`;
                if (this.cnt <= 0) this.hide();
            }, 1000);
        }
        hide() {
            Shield.disarm();
            if (this.tm) clearInterval(this.tm);
            if (this.el) { this.el.remove(); this.el = null; }
        }
    }

    class Config {
        constructor() { this.el = null; Events.on("change", () => this.el && this.fresh()); }
        show() {
            if (this.el) return this.hide();
            this.el = document.createElement("div");
            this.el.id = "upb-modal";
            this.el.innerHTML = `<div id="upb-head"><img src="${C.LOGO}" style="width:24px">Ultra Popup Blocker</div><div id="upb-body"></div><div id="upb-foot"></div>`;
            const b = this.el.querySelector("#upb-body");
            b.append(this.col("Allowed", "allow"), this.col("Denied", "deny"));
            this.el.querySelector("#upb-foot").appendChild(mkBtn("Close", "neutral", () => this.hide()));
            document.body.appendChild(this.el);
            this.fresh();
            this.esc = e => { if(e.key==='Escape') this.hide(); };
            window.addEventListener('keydown', this.esc);
        }
        hide() { if (this.el) this.el.remove(); this.el = null; window.removeEventListener('keydown', this.esc); }
        col(ttl, typ) {
            const c = document.createElement("div"); c.className = "upb-col";
            // Mobile Friendly Inputs
            const i = document.createElement("input"); 
            i.className = "upb-inp"; 
            i.placeholder = "domain.com";
            i.setAttribute("autocorrect", "off");
            i.setAttribute("autocapitalize", "off");
            i.setAttribute("spellcheck", "false");
            
            const ul = document.createElement("ul"); ul.className = `upb-list upb-l-${typ}`;
            const add = mkBtn("Add", "trust", () => { const d = DomainMgr.parse(i.value); if(d){ i.value=""; DomainMgr.mod(d, typ); }});
            i.onkeydown = e => e.key === "Enter" && add.click();
            const h = document.createElement("h3"); h.textContent = ttl; h.style.cssText="margin:0 0 10px 0;text-align:center";
            const f = document.createElement("div"); f.style.cssText="display:flex;gap:8px;margin-bottom:10px"; f.append(i, add);
            c.append(h, f, ul);
            return c;
        }
        async fresh() {
            const idx = await DomainMgr.getIdx();
            const f = (cls, arr) => {
                const ul = this.el.querySelector(cls); ul.innerHTML = '';
                (arr||[]).sort().forEach(d => {
                    const li = document.createElement("li"); li.className="upb-item";
                    li.innerHTML = `<span>${d}</span>`;
                    const x = document.createElement("div"); x.className="upb-del"; x.textContent="×";
                    x.onclick = () => DomainMgr.mod(d, 'remove');
                    li.appendChild(x); ul.appendChild(li);
                });
            };
            f('.upb-l-allow', idx.a);
            f('.upb-l-deny', idx.d);
        }
    }

    const Shield = {
        a: false, p: false,
        h(e) { if(!this.p) { e.preventDefault(); e.returnValue = ""; return ""; } },
        arm() { if(!this.a) { window.addEventListener("beforeunload", this.h.bind(this), true); this.a = true; } },
        disarm() { if(this.a) { window.removeEventListener("beforeunload", this.h.bind(this), true); this.a = false; } },
        pass(cb) { this.p = true; if(cb) cb(); setTimeout(() => this.p = false, 500); }
    };

    // --- INIT & LOGIC ---
    const Conf = new Config();
    const Noti = new Notify();
    let State = "ask";
    let DenyToastDebounce = 0;

    async function loadState() {
        const d = await DomainMgr.parse(location.hostname);
        State = await DomainMgr.state(d);
    }

    function handleDeny() {
        Shield.arm();
        const now = Date.now();
        if (now - DenyToastDebounce > 1000) {
            global._upb_t.show("🚫 Popup Blocked");
            DenyToastDebounce = now;
        }
        return FakeWindow;
    }

    function trap(e) {
        if (State === "allow") return;
        let pop = false, url = "";
        
        if (e.type === "click") {
            const el = e.target.closest("a");
            if (el && el.href && !el.hasAttribute('download')) {
                if (el.target === "_blank" || (document.querySelector('base[target="_blank"]') && el.target !== "_self")) {
                    pop = true; url = el.href;
                }
            }
        } else if (e.type === "submit") {
            const el = e.target.closest("form");
            if (el && el.target === "_blank") { pop = true; url = el.action || location.href; }
        }

        if (pop) {
            e.preventDefault(); e.stopPropagation(); e.stopImmediatePropagation();
            if (State === "deny") handleDeny();
            else Noti.show(url);
        }
    }

    function override() {
        const h = {
            value: function(u, t, f) {
                if (State === "allow") return realOpen.apply(this, arguments);
                if (State === "deny") return handleDeny();
                Noti.show(u);
                return FakeWindow;
            },
            writable: false, configurable: false
        };
        try { Object.defineProperty(global, 'open', h); } 
        catch { global.open = h.value; }
    }

    (async () => {
        global._upb_t = new Toast();
        
        if (!document.getElementById('upb-css')) {
            const s = document.createElement("style");
            s.id = 'upb-css';
            s.textContent = CSS;
            (document.head || document.documentElement).appendChild(s);
        }

        await loadState();
        override();
        
        window.addEventListener("click", trap, true);
        window.addEventListener("submit", trap, true);
        
        // Universal pointerdown for robust mobile/PC interaction
        window.addEventListener("pointerdown", e => {
            const a = e.target.closest('a');
            if(a && a.href && a.target !== '_blank' && !a.href.startsWith('javascript:')) Shield.pass();
        }, true);

        let t;
        const obs = new MutationObserver(() => {
            clearTimeout(t);
            t = setTimeout(() => { if(global.open === realOpen) override(); }, 200);
        });
        if(document.body) obs.observe(document.body, {childList:true, subtree:true});
        
        Events.on("change", async () => { await loadState(); override(); });
        GM.registerMenuCommand("⚙️ Settings", () => Conf.show());
    })();
})();
