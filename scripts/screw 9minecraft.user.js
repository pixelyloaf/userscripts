// ==UserScript==
// @name         screw 9minecraft
// @namespace    http://tampermonkey.net/
// @version      2.0.0
// @description  9minecraft is known to being unsafe so I'm handling it by redirecting to safer sources
// @author       pixelyloaf
// @match        *://*.9minecraft.net/*
// @match        *://9minecraft.net/*
// @match        *://pixelyloaf.github.io/userscripts/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    // priorities for settings
    const DEFAULT_PRIORITY = ['modrinth', 'website', 'github', 'curseforge'];
    let priority = GM_getValue('priority', null);

    if (!Array.isArray(priority)) {
        priority = [...DEFAULT_PRIORITY];
    } else {
        for (const plt of DEFAULT_PRIORITY) {
            if (!priority.includes(plt)) {
                priority.push(plt);
            }
        }
    }

    let menuIds = [];
    // redirects
    const redirects = {
        "/optifine-hd/": {
            modrinth: "https://optifine.net/home",
            curseforge: "https://optifine.net/home"
        },
        "/quilt-installer/": {
            modrinth: "https://quiltmc.org/",
            curseforge: "https://quiltmc.org/"
        },
        "/neoforge-installer/": {
            modrinth: "https://neoforged.net/",
            curseforge: "https://neoforged.net/"
        },
        "/modrinth-launcher/": {
            modrinth: "https://modrinth.com/app",
            curseforge: "https://modrinth.com/app"
        },
        "/fabric-loader/": {
            modrinth: "https://fabricmc.net/",
            curseforge: "https://fabricmc.net/"
        },
        "/minecraft-forge/": {
            modrinth: "https://files.minecraftforge.net/net/minecraftforge/forge/",
            curseforge: "https://files.minecraftforge.net/net/minecraftforge/forge/",
            website: "https://files.minecraftforge.net/net/minecraftforge/forge/"
        },
        "/fabric-api/": {
            modrinth: "https://modrinth.com/mod/fabric-api",
            curseforge: "https://www.curseforge.com/minecraft/mc-mods/fabric-api"
        },
        "/xaeros-minimap/": {
            modrinth: "https://modrinth.com/mod/xaeros-minimap",
            curseforge: "https://www.curseforge.com/minecraft/mc-mods/xaeros-minimap"
        },
        "/just-enough-items-mod/": {
            modrinth: "https://modrinth.com/mod/jei",
            curseforge: "https://www.curseforge.com/minecraft/mc-mods/jei"
        },
        "/sodium-mod/": {
            modrinth: "https://modrinth.com/mod/sodium",
            curseforge: "https://www.curseforge.com/minecraft/mc-mods/sodium"
        },
        "/repo-heads-mod/": {
            modrinth: "https://modrinth.com/mod/repo-heads",
            curseforge: "https://modrinth.com/mod/repo-heads"
        },
        "/minecraft-java-bedrock-edition-launcher/": {
            modrinth: "https://minecraft.net/download",
            curseforge: "https://minecraft.net/download"
        },
        "/optifabric-mod/": {
            modrinth: "https://www.curseforge.com/minecraft/mc-mods/optifabric",
            curseforge: "https://www.curseforge.com/minecraft/mc-mods/optifabric"
        },
        "/bsl-shaders/": {
            modrinth: "https://modrinth.com/shader/bsl-shaders",
            curseforge: "https://www.curseforge.com/minecraft/shaders/bsl-shaders"
        },
        "/emi-mod/": {
            modrinth: "https://modrinth.com/mod/emi",
            curseforge: "https://www.curseforge.com/minecraft/mc-mods/emi",
            github: "https://github.com/emilyploszaj/emi"
        },
        "/oculus-mod/": {
            modrinth: "https://modrinth.com/mod/oculus",
            curseforge: "https://www.curseforge.com/minecraft/mc-mods/oculus"
        },
        "/fresh-animations-resource-pack": {
            modrinth: "https://modrinth.com/resourcepack/fresh-animations",
            curseforge: "https://www.curseforge.com/minecraft/texture-packs/fresh-animations"
        }
    };

    function saveAndUpdate() {
        GM_setValue('priority', priority);
        registerMenu();
        doRedirect();
    }

    function registerMenu() {
        menuIds.forEach(id => GM_unregisterMenuCommand(id));
        menuIds = [
            GM_registerMenuCommand('Edit Redirect Priority', showPriorityEditor, 'edit')
        ];
    }

    function doRedirect() {
        if (location.hostname === 'pixelyloaf.github.io') return;

        const entry = redirects[location.pathname];
        if (!entry) return showBanner();

        for (const plt of priority) {
            if (entry[plt]) {
                location.replace(entry[plt]);
                return;
            }
        }

        showBanner();
    }

    function showBanner() {
        const d = document;
        const b = d.createElement('div');
        b.textContent = 'please just use something else';
        b.style.cssText = `
            position:fixed;top:0;left:0;right:0;z-index:9999;
            padding:12px; font:15px sans-serif;
            background:#c00; color:#fff; text-align:center;
        `;
        d.documentElement.style.marginTop = '48px';
        d.body.appendChild(b);
    }

    function showPriorityEditor() {
        const overlay = document.createElement('div');
        overlay.style = `
            position:fixed;top:0;left:0;right:0;bottom:0;
            background:rgba(0,0,0,0.7);z-index:99999;
            display:flex;align-items:center;justify-content:center;padding:10px;
        `;

        const box = document.createElement('div');
        box.style = `
            background:#1e1e1e;padding:20px;
            border-radius:12px;max-width:360px;width:100%;
            color:#eee;font-family:sans-serif;
            max-height:90vh;overflow-y:auto;
        `;

        box.innerHTML = `<h2 style="margin-top:0;text-align:center;">Redirect Priority</h2>`;

        const list = document.createElement('ul');
        list.style = 'list-style:none;padding:0;';

        priority.forEach((plt, i) => {
            const li = document.createElement('li');
            li.style = 'display:flex;align-items:center;justify-content:space-between;margin:8px 0;';

            const label = document.createElement('span');
            label.textContent = plt;
            label.style = 'flex:1;font-weight:bold;';

            const up = document.createElement('button');
            up.textContent = '↑';
            up.disabled = i === 0;
            const down = document.createElement('button');
            down.textContent = '↓';
            down.disabled = i === priority.length - 1;

            [up, down].forEach(btn => btn.style.cssText = `
                background:#3a3a3a;color:#fff;border:none;
                padding:6px 10px;margin-left:6px;border-radius:6px;
                cursor:pointer;transition:background .2s;
            `);

            up.onclick = () => {
                [priority[i - 1], priority[i]] = [priority[i], priority[i - 1]];
                overlay.remove(); showPriorityEditor(); saveAndUpdate();
            };
            down.onclick = () => {
                [priority[i], priority[i + 1]] = [priority[i + 1], priority[i]];
                overlay.remove(); showPriorityEditor(); saveAndUpdate();
            };

            li.append(label, up, down);
            list.appendChild(li);
        });

        box.appendChild(list);

        const footer = document.createElement('div');
        footer.style = 'margin-top:20px;display:flex;gap:10px;flex-wrap:wrap;';

        const reset = document.createElement('button');
        reset.textContent = 'Reset to Default';
        const close = document.createElement('button');
        close.textContent = 'Close';

        [reset, close].forEach(btn => btn.style.cssText = `
            flex:1;padding:10px;border:none;border-radius:8px;
            font-weight:bold;cursor:pointer;
        `);

        reset.style.background = '#444'; reset.style.color = '#fff';
        reset.onclick = () => {
            priority = [...DEFAULT_PRIORITY];
            saveAndUpdate();
            overlay.remove();
        };

        close.style.background = '#007acc'; close.style.color = '#fff';
        close.onclick = () => overlay.remove();

        footer.append(reset, close);
        box.appendChild(footer);

        overlay.appendChild(box);
        document.body.appendChild(overlay);
    }

    registerMenu();
    doRedirect();
})();
