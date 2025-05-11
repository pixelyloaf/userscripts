// ==UserScript==
// @name         screw 9minecraft
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  9minecraft is known to being unsafe so im dealing with this problem by making this
// @match        *://*.9minecraft.net/*
// @match        *://9minecraft.net/*
// @match        *://pixelyloaf.github.io/userscripts/*
// @grant        GM_registerMenuCommand
// @grant        GM_unregisterMenuCommand
// @grant        GM_getValue
// @grant        GM_setValue
// @run-at       document-start
// ==/UserScript==

(function() {
  'use strict';

  const PLATFORMS = ['modrinth', 'curseforge'];
  const DEFAULT   = 'modrinth';
  let platform    = GM_getValue('platform', DEFAULT);
  let idCurrent, idSwitch;

  function registerMenu() {
    // remove old menu entries if present
    if (idCurrent) GM_unregisterMenuCommand(idCurrent);
    if (idSwitch ) GM_unregisterMenuCommand(idSwitch);

    // current-platform (clickable to switch platform)
    idCurrent = GM_registerMenuCommand(
      `Current: ${platform}`,
      () => {
        const i = PLATFORMS.indexOf(platform);
        platform = PLATFORMS[(i + 1) % PLATFORMS.length];
        GM_setValue('platform', platform);
        registerMenu();
        doRedirect();
      },
      'platform'
    );
  }

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
      curseforge: "https://files.minecraftforge.net/net/minecraftforge/forge/"
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
    }
  };

  function doRedirect() {
    if (location.hostname === 'pixelyloaf.github.io') return;
    const url = redirects[location.pathname]?.[platform];
    if (url) location.replace(url);
    else showBanner();
  }

  function showBanner() {
    const d = document, b = d.createElement('div');
    b.textContent = 'please just use alternatives';
    b.style.cssText = 'position:fixed;top:0;left:0;right:0;padding:8px;font:14px sans-serif;'
      + 'background:#c00;color:#fff;text-align:center;z-index:9999;';
    d.documentElement.style.marginTop = '32px';
    d.body.appendChild(b);
  }

  registerMenu();
  doRedirect();

})();
