// ==UserScript==
// @name         KAT-OS Ultimate Cheat Engine
// @namespace    https://coratech-projects.github.io/
// @version      4.0
// @description  Menu nativo completo: Laser, Pulo, Buraco Negro, Rickroll, Skins, Noclip e Execucao do Terminal Final.
// @author       Antigravity
// @match        https://coratech-projects.github.io/KAT/*
// @match        http://coratech-projects.github.io/KAT/*
// @match        *://coratech-projects.github.io/KAT/*
// @grant        none
// @run-at       document-idle
// ==/UserScript==

(function () {
    'use strict';

    if (document.getElementById("kat-native-hack-root")) {
        document.getElementById("kat-native-hack-root").remove();
    }

    const SETTINGS_KEY = "kat_hack_settings";
    function loadSettings() {
        try {
            return JSON.parse(localStorage.getItem(SETTINGS_KEY)) || {
                speed: 1,
                noclip: false,
                godzilla: false,
                spin: false,
                minimized: false,
                skin: "gato",
                rave: false,
                crown: false,
                crt: false,
                laser: true,
                boss: false
            };
        } catch {
            return { speed: 1, noclip: false, godzilla: false, spin: false, minimized: false, skin: "gato", rave: false, crown: false, crt: false, laser: true, boss: false };
        }
    }
    function saveSettings(s) {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
    }
    const currentSettings = loadSettings();

    const ANSWERS = {
        1: ["ALGORITMO", "LOCALIZAR_NPC", "MOSTRAR_NPC"],
        2: ["alvo", "PORTA", "REPARAR(FERRAMENTA)"],
        3: ["-", ">", "E"],
        4: ["LIBERAR_PORTAL", "SENÃO"],
        5: ["VERDADEIRO", "MOSTRAR_ARQUIVO"],
        6: ["4", "TELETRANSPORTAR", "FIM_PARA"],
        7: ["==", "PLATAFORMA_VERDE", "SENÃO"],
        8: ["ALGORITMO", "INSERIR_CODIGO(fragmentos[i])", "4"],
        9: ["<=", "REPARAR(arquivo)", "+ 1"],
        10: ["E", "REPARAR_CAMINHO", "ABRIR_SAIDA()", "SENÃO"]
    };

    function getCat() {
        if (typeof framer !== "undefined" && framer && framer.character_main_scene && framer.character_main_scene.character_dom) {
            return framer.character_main_scene.character_dom;
        }
        return document.getElementById("Gato") || document.getElementById("gato") || document.querySelector("[id*='ato']");
    }

    if (!document.getElementById("kat-native-theme")) {
        const style = document.createElement("style");
        style.id = "kat-native-theme";
        style.textContent = `
            @keyframes katSpinAnim {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }
            @keyframes katRaveAnim {
                0% { filter: hue-rotate(0deg) saturate(2); }
                50% { filter: hue-rotate(180deg) saturate(4) brightness(1.2); }
                100% { filter: hue-rotate(360deg) saturate(2); }
            }
            .kat-rave-active {
                animation: katRaveAnim 0.7s linear infinite !important;
            }

            @keyframes katCrtScan {
                0% { background-position: 0 0; }
                100% { background-position: 0 100%; }
            }
            .kat-crt-active::after {
                content: " ";
                display: block;
                position: fixed;
                top: 0; left: 0; bottom: 0; right: 0;
                background: linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.35) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.05), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.05));
                z-index: 9999990;
                background-size: 100% 4px, 6px 100%;
                pointer-events: none;
            }

            @keyframes katCrownFloat {
                0%, 100% { transform: translate(-50%, -100%) translateY(-10px); }
                50% { transform: translate(-50%, -100%) translateY(-16px); }
            }
            .kat-crown-tag {
                position: absolute;
                top: 0;
                left: 50%;
                transform: translate(-50%, -100%) translateY(-10px);
                animation: katCrownFloat 1.6s ease-in-out infinite;
                font-size: 10px;
                font-weight: bold;
                color: #ffd700;
                text-shadow: 0 0 6px #ff8800, 2px 2px 0 #000;
                background: rgba(16, 10, 22, 0.85);
                border: 1px solid #ffd700;
                padding: 2px 6px;
                white-space: nowrap;
                pointer-events: none;
                z-index: 999999;
                font-family: "Courier New", monospace;
            }

            @keyframes katLaserPulse {
                0%, 100% { box-shadow: 0 0 10px #00ff66, 0 0 20px #00ff66; }
                50% { box-shadow: 0 0 18px #00ffaa, 0 0 35px #00ffaa; }
            }
            .kat-laser-bolt {
                position: fixed;
                width: 14px;
                height: 14px;
                background: #00ff66;
                border: 2px solid #ffffff;
                border-radius: 50%;
                z-index: 9999995;
                pointer-events: none;
                animation: katLaserPulse 0.2s infinite;
            }

            @keyframes katVortexSpin {
                0% { transform: translate(-50%, -50%) rotate(0deg) scale(1); }
                50% { transform: translate(-50%, -50%) rotate(180deg) scale(1.3); }
                100% { transform: translate(-50%, -50%) rotate(360deg) scale(1); }
            }
            .kat-vortex-hole {
                position: fixed;
                width: 120px;
                height: 120px;
                border-radius: 50%;
                border: 4px dashed #ff00ff;
                box-shadow: 0 0 35px #ff00ff, inset 0 0 30px #9900ff;
                background: radial-gradient(circle, #000 30%, transparent 70%);
                z-index: 9999994;
                pointer-events: none;
                animation: katVortexSpin 0.7s linear infinite;
            }

            #kat-boss-bar {
                position: fixed;
                top: 14px;
                left: 50%;
                transform: translateX(-50%);
                width: min(90vw, 520px);
                background: rgba(15, 8, 20, 0.95);
                border: 3px solid #ff3333;
                box-shadow: 0 6px 0 #000, 0 0 20px rgba(255, 50, 50, 0.5);
                padding: 6px 12px;
                z-index: 9999998;
                font-family: "Courier New", monospace;
                user-select: none;
            }
            .kat-boss-name {
                display: flex;
                justify-content: space-between;
                font-size: 11px;
                font-weight: bold;
                color: #ff9999;
                margin-bottom: 4px;
                letter-spacing: 1px;
            }
            .kat-boss-track {
                width: 100%;
                height: 14px;
                background: #250a0a;
                border: 2px solid #551111;
                overflow: hidden;
            }
            .kat-boss-fill {
                height: 100%;
                width: 100%;
                background: linear-gradient(90deg, #ff2222, #ff7700);
                transition: width 0.15s ease-out;
            }

            #kat-native-hack-root {
                position: fixed;
                top: 14px;
                right: 14px;
                z-index: 9999999;
                font-family: "Courier New", Courier, monospace;
                user-select: none;
            }

            .kat-min-badge {
                background: linear-gradient(180deg, #322044, #1c1029);
                border: 3px solid #e0b8ff;
                box-shadow: 0 5px 0 #0b0711, inset 0 0 0 2px #503363;
                color: #e0b8ff;
                padding: 8px 14px;
                cursor: pointer;
                font-weight: bold;
                font-size: 13px;
                letter-spacing: 1px;
                display: flex;
                align-items: center;
                gap: 8px;
                transition: all 120ms;
            }
            .kat-min-badge:hover {
                border-color: #a7f3b4;
                color: #a7f3b4;
                transform: translateY(-2px);
            }

            .kat-panel-native {
                width: 320px;
                max-height: 88vh;
                overflow-y: auto;
                background: linear-gradient(180deg, #322044, #170e22);
                border: 3px solid #e0b8ff;
                color: #f7edff;
                box-shadow: 0 8px 0 #0b0711, inset 0 0 0 2px #503363;
                padding: 12px;
                display: flex;
                flex-direction: column;
                gap: 6px;
            }

            .kat-panel-native::-webkit-scrollbar {
                width: 6px;
            }
            .kat-panel-native::-webkit-scrollbar-thumb {
                background: #503363;
                border: 1px solid #e0b8ff;
            }

            .kat-header-native {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-bottom: 2px solid #503363;
                padding-bottom: 6px;
                margin-bottom: 2px;
            }

            .kat-kicker-native {
                color: #e0b8ff;
                font-size: 10px;
                font-weight: bold;
                letter-spacing: 0.1em;
                margin: 0 0 3px;
                text-transform: uppercase;
            }

            .kat-title-native {
                margin: 0;
                font-size: 14px;
                font-weight: bold;
                color: #f7edff;
                text-shadow: 2px 2px 0 #0b0711;
            }

            .kat-section-label {
                font-size: 9px;
                color: #a7f3b4;
                font-weight: bold;
                letter-spacing: 1px;
                margin-top: 4px;
                text-transform: uppercase;
                border-bottom: 1px solid #3c254d;
                padding-bottom: 2px;
            }

            .kat-btn-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 5px;
            }

            .kat-btn-native {
                background: #241432;
                border: 2px solid #503363;
                color: #f7edff;
                box-shadow: 0 3px 0 #0b0711;
                padding: 6px 8px;
                font-family: "Courier New", Courier, monospace;
                font-size: 11px;
                font-weight: bold;
                cursor: pointer;
                text-align: left;
                transition: background 120ms, border-color 120ms, transform 80ms;
                display: flex;
                align-items: center;
                justify-content: space-between;
                border-radius: 0;
            }
            .kat-btn-native:hover {
                border-color: #e0b8ff;
                background: #322044;
                transform: translateY(-1px);
            }
            .kat-btn-native:active {
                transform: translateY(2px);
                box-shadow: 0 1px 0 #0b0711;
            }

            .kat-btn-native.is-active {
                border-color: #a7f3b4 !important;
                background: #1d3828 !important;
                color: #a7f3b4 !important;
            }

            .kat-btn-action {
                background: #21132e;
                border-color: #8e64a6;
                color: #e0b8ff;
            }
            .kat-btn-action:hover {
                border-color: #a7f3b4;
                color: #a7f3b4;
                background: #1d3828;
            }

            .kat-speed-bar {
                display: flex;
                align-items: center;
                justify-content: space-between;
                background: #1a0f25;
                border: 2px solid #503363;
                padding: 3px 6px;
                font-size: 10px;
                color: #e0b8ff;
                font-weight: bold;
            }
            .kat-speed-btn {
                background: #241432;
                border: 1px solid #503363;
                color: #f7edff;
                cursor: pointer;
                padding: 2px 6px;
                font-family: inherit;
                font-size: 10px;
                font-weight: bold;
            }
            .kat-speed-btn.is-active {
                border-color: #a7f3b4;
                background: #1d3828;
                color: #a7f3b4;
            }

            .kat-select-native {
                background: #241432;
                border: 2px solid #503363;
                color: #e0b8ff;
                padding: 5px;
                font-family: "Courier New", Courier, monospace;
                font-size: 10px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 2px 0 #0b0711;
                width: 100%;
            }

            .kat-footer-text {
                font-size: 9px;
                color: #bfa4cf;
                text-align: center;
                margin: 4px 0 0;
                border-top: 1px solid #3c254d;
                padding-top: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    function applySpeed(multiplier) {
        currentSettings.speed = multiplier;
        saveSettings(currentSettings);

        if (typeof framer !== "undefined" && framer && framer.character_main_scene) {
            const cat = framer.character_main_scene;
            if (!cat._origWalk) {
                cat._origWalk = cat.walk;
                cat.walk = function (top, left, direction, spriteIndex) {
                    if (currentSettings.speed > 1) {
                        const extra = (currentSettings.speed - 1) * 5;
                        if (direction === "top") top -= extra;
                        else if (direction === "bottom") top += extra;
                        else if (direction === "left") left -= extra;
                        else if (direction === "right") left += extra;

                        const h = this.character_dom ? this.character_dom.offsetHeight : 130;
                        const w = this.character_dom ? this.character_dom.offsetWidth : 130;
                        top = Math.max(0, Math.min(top, window.innerHeight - h));
                        left = Math.max(0, Math.min(left, window.innerWidth - w));

                        if (this.framer) {
                            this.framer.characterPosition = { top, left };
                        }
                    }
                    return cat._origWalk.call(this, top, left, direction, spriteIndex);
                };
            }
        }
    }

    function applyNoclip(active) {
        currentSettings.noclip = active;
        saveSettings(currentSettings);

        if (typeof framer !== "undefined" && framer) {
            window._origHitsGlitches = window._origHitsGlitches || framer.hitsGlitches;
            window._origHitsPlace = window._origHitsPlace || framer.hitsCreatedPlaceObject;
            if (framer.sceneManager) {
                window._origCanMove = window._origCanMove || framer.sceneManager.canMove;
            }

            if (active) {
                framer.hitsGlitches = () => false;
                framer.hitsCreatedPlaceObject = () => false;
                framer.controlsDisabled = false;
                if (framer.sceneManager) framer.sceneManager.canMove = () => true;
            } else {
                if (window._origHitsGlitches) framer.hitsGlitches = window._origHitsGlitches;
                if (window._origHitsPlace) framer.hitsCreatedPlaceObject = window._origHitsPlace;
                if (framer.sceneManager && window._origCanMove) {
                    framer.sceneManager.canMove = window._origCanMove;
                }
            }
        }
    }

    function applyGodzilla(active) {
        currentSettings.godzilla = active;
        saveSettings(currentSettings);
        const cat = getCat();
        if (!cat) return;

        if (active) {
            cat.style.width = "300px";
            cat.style.height = "300px";
            cat.style.filter = "drop-shadow(0 0 16px #ff4444)";
        } else {
            cat.style.width = "130px";
            cat.style.height = "130px";
            cat.style.filter = "";
        }
    }

    function applySpin(active) {
        currentSettings.spin = active;
        saveSettings(currentSettings);
        const cat = getCat();
        if (!cat) return;

        cat.style.transformOrigin = "center center";
        cat.style.animation = active ? "katSpinAnim 0.25s linear infinite" : "";
    }

    function applyRave(active) {
        currentSettings.rave = active;
        saveSettings(currentSettings);
        document.body.classList.toggle("kat-rave-active", active);
    }

    function applyCrt(active) {
        currentSettings.crt = active;
        saveSettings(currentSettings);
        document.body.classList.toggle("kat-crt-active", active);
    }

    function applyCrown(active) {
        currentSettings.crown = active;
        saveSettings(currentSettings);
        const cat = getCat();
        if (!cat) return;

        let tag = cat.querySelector(".kat-crown-tag");
        if (active && !tag) {
            tag = document.createElement("div");
            tag.className = "kat-crown-tag";
            tag.textContent = "👑 ROOT_ADMIN";
            cat.appendChild(tag);
        } else if (!active && tag) {
            tag.remove();
        }
    }

    function applySkin(name) {
        currentSettings.skin = name;
        saveSettings(currentSettings);

        if (typeof framer === "undefined" || !framer || !framer.character_main_scene) return;
        const cat = framer.character_main_scene;

        if (name === "gato") {
            cat.sprite = {
                idle: 'assets/sprites/gato/idle.png',
                walk_front: ['assets/sprites/gato/walking_1.png', 'assets/sprites/gato/walking_2.png'],
                walk_back: ['assets/sprites/gato/walking_back_1.png', 'assets/sprites/gato/walking_back_2.png'],
                walk_side: ['assets/sprites/gato/walking_side_1.png', 'assets/sprites/gato/walking_side_2.png'],
                walk_otherside: ['assets/sprites/gato/walking_otherside_1.png', 'assets/sprites/gato/walking_otherside_2.png'],
                walk_sound: 'assets/sprites/SpriteSheets/walk.wav'
            };
        } else if (name === "ben") {
            cat.sprite = {
                idle: 'assets/sprites/ben/idle.png',
                walk_front: ['assets/sprites/ben/walking_1.png', 'assets/sprites/ben/walking_2.png'],
                walk_back: ['assets/sprites/ben/walking_back_1.png', 'assets/sprites/ben/walking_back_2.png'],
                walk_side: ['assets/sprites/ben/walking_side_1.png', 'assets/sprites/ben/walking_side_2.png'],
                walk_otherside: ['assets/sprites/ben/walking_otherside_1.png', 'assets/sprites/ben/walking_otherside_2.png'],
                walk_sound: 'assets/sprites/SpriteSheets/walk.wav'
            };
        } else {
            cat.sprite = {
                idle: `assets/sprites/${name}/animation_1.png`,
                walk_front: [`assets/sprites/${name}/animation_2.png`, `assets/sprites/${name}/animation_3.png`],
                walk_back: [`assets/sprites/${name}/animation_1.png`, `assets/sprites/${name}/animation_2.png`],
                walk_side: [`assets/sprites/${name}/animation_2.png`, `assets/sprites/${name}/animation_3.png`],
                walk_otherside: [`assets/sprites/${name}/animation_2.png`, `assets/sprites/${name}/animation_3.png`],
                walk_sound: 'assets/sprites/SpriteSheets/walk.wav'
            };
        }
        cat.set_sprite(cat.sprite.idle);
    }

    let congaActive = false;
    function toggleConga() {
        congaActive = !congaActive;
        if (typeof framer !== "undefined" && framer) {
            if (congaActive) {
                framer.npcs.forEach((npc) => {
                    framer.character_follow_main_character(npc);
                });
            } else {
                framer.followingCharacters = framer.followingCharacters.filter(f => f.character && f.character.name === "Ben");
            }
        }
    }

    let clones = [];
    function toggleClones() {
        const cat = getCat();
        if (!cat) return;
        if (clones.length > 0) {
            clones.forEach(c => c.remove());
            clones = [];
            return;
        }
        for (let i = 0; i < 8; i++) {
            const clone = cat.cloneNode(true);
            clone.id = `kat-clone-${i}`;
            clone.style.pointerEvents = "none";
            clone.style.opacity = "0.75";
            clone.style.filter = `hue-rotate(${i * 45}deg)`;
            clone.style.zIndex = "998";
            document.body.appendChild(clone);
            clones.push(clone);
        }
        function updateClones() {
            if (clones.length === 0) return;
            const curTop = parseFloat(cat.style.top) || 0;
            const curLeft = parseFloat(cat.style.left) || 0;
            clones.forEach((clone, idx) => {
                const angle = (idx / clones.length) * 2 * Math.PI;
                const radius = 80;
                clone.style.top = (curTop + Math.sin(angle) * radius) + "px";
                clone.style.left = (curLeft + Math.cos(angle) * radius) + "px";
                clone.style.backgroundImage = cat.style.backgroundImage;
                clone.style.width = cat.style.width;
                clone.style.height = cat.style.height;
            });
            requestAnimationFrame(updateClones);
        }
        requestAnimationFrame(updateClones);
    }

    function doJump() {
        const cat = getCat();
        if (!cat || cat._isJumping) return;
        cat._isJumping = true;

        if (window.katSound) window.katSound.play("teleport");

        let t = 0;
        const jumpHeight = 70;
        const duration = 28;

        function jumpFrame() {
            t++;
            const progress = t / duration;
            if (progress <= 1) {
                const offset = Math.sin(progress * Math.PI) * jumpHeight;
                cat.style.transform = `translateY(-${offset}px)`;
                requestAnimationFrame(jumpFrame);
            } else {
                cat.style.transform = "";
                cat._isJumping = false;
            }
        }
        requestAnimationFrame(jumpFrame);
    }

    function shootLaser() {
        const cat = getCat();
        if (!cat) return;

        const bolt = document.createElement("div");
        bolt.className = "kat-laser-bolt";

        const dir = (framer && framer.character_main_scene && framer.character_main_scene.facingDirection) || "bottom";
        let x = (parseFloat(cat.style.left) || 0) + (cat.offsetWidth / 2) - 7;
        let y = (parseFloat(cat.style.top) || 0) + (cat.offsetHeight / 2) - 7;

        bolt.style.left = x + "px";
        bolt.style.top = y + "px";
        document.body.appendChild(bolt);

        if (window.katSound) window.katSound.play("terminal");

        let vx = 0;
        let vy = 0;
        const speed = 18;
        if (dir === "top") vy = -speed;
        else if (dir === "bottom") vy = speed;
        else if (dir === "left") vx = -speed;
        else if (dir === "right") vx = speed;

        let frames = 0;
        function moveLaser() {
            frames++;
            x += vx;
            y += vy;
            bolt.style.left = x + "px";
            bolt.style.top = y + "px";

            if (framer && framer.npcs) {
                for (let npc of framer.npcs) {
                    const el = npc.character_dom;
                    if (el) {
                        const r = el.getBoundingClientRect();
                        if (x > r.left && x < r.right && y > r.top && y < r.bottom) {
                            bolt.remove();
                            damageBoss(npc);
                            el.style.filter = "brightness(3) saturate(0) drop-shadow(0 0 15px red)";
                            setTimeout(() => { el.style.filter = ""; }, 180);
                            return;
                        }
                    }
                }
            }

            if (frames < 60 && x > 0 && x < window.innerWidth && y > 0 && y < window.innerHeight) {
                requestAnimationFrame(moveLaser);
            } else {
                bolt.remove();
            }
        }
        requestAnimationFrame(moveLaser);
    }

    let bossActive = false;
    let bossHp = 1000;
    function toggleBoss() {
        bossActive = !bossActive;
        currentSettings.boss = bossActive;
        saveSettings(currentSettings);

        let bar = document.getElementById("kat-boss-bar");
        if (bossActive) {
            bossHp = 1000;
            if (!bar) {
                bar = document.createElement("div");
                bar.id = "kat-boss-bar";
                bar.innerHTML = `
                    <div class="kat-boss-name">
                        <span>⚔️ CHROMICOS — GUARDIÃO DO PORTUGOL</span>
                        <span id="kat-boss-hp-text">1000 / 1000</span>
                    </div>
                    <div class="kat-boss-track">
                        <div class="kat-boss-fill" id="kat-boss-hp-fill" style="width: 100%;"></div>
                    </div>
                `;
                document.body.appendChild(bar);
            }
        } else {
            if (bar) bar.remove();
        }
    }

    function damageBoss(npc) {
        if (!bossActive) return;
        bossHp = Math.max(0, bossHp - 65);
        const fill = document.getElementById("kat-boss-hp-fill");
        const text = document.getElementById("kat-boss-hp-text");
        if (fill && text) {
            fill.style.width = (bossHp / 10) + "%";
            text.textContent = `${bossHp} / 1000`;
        }
        if (bossHp <= 0) {
            alert("👑 VITÓRIA! O Guardião do Portugol foi derrotado!");
            toggleBoss();
            triggerRickroll();
        }
    }

    let vortexEl = null;
    let vortexRunning = false;
    function startVortex(e) {
        vortexRunning = true;
        vortexEl = document.createElement("div");
        vortexEl.className = "kat-vortex-hole";
        vortexEl.style.left = e.clientX + "px";
        vortexEl.style.top = e.clientY + "px";
        document.body.appendChild(vortexEl);

        function suckFrame() {
            if (!vortexRunning) return;
            const targetX = parseFloat(vortexEl.style.left) || 0;
            const targetY = parseFloat(vortexEl.style.top) || 0;

            if (framer && framer.npcs) {
                framer.npcs.forEach((npc) => {
                    const el = npc.character_dom;
                    if (el) {
                        let curX = parseFloat(el.style.left) || 0;
                        let curY = parseFloat(el.style.top) || 0;
                        el.style.left = (curX + (targetX - curX) * 0.08) + "px";
                        el.style.top = (curY + (targetY - curY) * 0.08) + "px";
                    }
                });
            }

            document.querySelectorAll(".place-object").forEach((box) => {
                let curX = parseFloat(box.style.left) || 0;
                let curY = parseFloat(box.style.top) || 0;
                box.style.left = (curX + (targetX - curX) * 0.08) + "px";
                box.style.top = (curY + (targetY - curY) * 0.08) + "px";
            });

            requestAnimationFrame(suckFrame);
        }
        requestAnimationFrame(suckFrame);
    }

    function stopVortex() {
        vortexRunning = false;
        if (vortexEl) {
            vortexEl.remove();
            vortexEl = null;
        }
    }

    window.addEventListener("contextmenu", (e) => {
        if (e.target.closest("#kat-native-hack-root")) return;
        e.preventDefault();
    });

    window.addEventListener("mousedown", (e) => {
        if (e.button === 2 && !e.target.closest("#kat-native-hack-root")) {
            startVortex(e);
        }
    });
    window.addEventListener("mouseup", (e) => {
        if (e.button === 2) {
            stopVortex();
        }
    });

    function triggerRickroll() {
        if (document.getElementById("kat-rickroll-modal")) return;

        const modal = document.createElement("div");
        modal.id = "kat-rickroll-modal";
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0, 0, 0, 0.95); z-index: 99999999;
            display: flex; flex-direction: column; align-items: center; justify-content: center;
        `;

        modal.innerHTML = `
            <div style="text-align: center; margin-bottom: 15px;">
                <h1 style="color: #ff3366; font-family: 'Courier New', monospace; font-size: 24px; margin: 0; text-shadow: 0 0 10px #ff0055;">
                    🕺 VOCÊ FOI RICKROLLADO! 🕺
                </h1>
                <p style="color: #a7f3b4; font-family: 'Courier New', monospace; font-size: 14px; margin: 5px 0 0;">
                    Never Gonna Give Portugol Up...
                </p>
            </div>
            <div style="width: min(90vw, 720px); height: min(60vh, 405px); border: 4px solid #e0b8ff; box-shadow: 0 0 30px #e0b8ff;">
                <iframe width="100%" height="100%" src="https://www.youtube-nocookie.com/embed/dQw4w9WgXcQ?autoplay=1&controls=1" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
            </div>
            <button id="kat-close-rick" style="margin-top: 18px; background: #241432; border: 2px solid #e0b8ff; color: #f7edff; padding: 10px 24px; font-family: 'Courier New', monospace; font-size: 14px; font-weight: bold; cursor: pointer;">
                ✕ FECHAR TROLL
            </button>
        `;

        document.body.appendChild(modal);
        modal.querySelector("#kat-close-rick").onclick = () => modal.remove();
    }

    function forceFinalTerminal() {
        const lines = [
            "ALGORITMO \"final_commit\"",
            "",
            "FUNCAO ABRIR_SAIDA()",
            "    VALIDAR_CODIGO",
            "    EXECUTAR_SAIDA",
            "FIM_FUNCAO",
            "",
            "INICIO",
            "    LIGAR_TERMINAL",
            "    sinal <- VERDE",
            "    energia <- 2",
            "    SE sinal == VERDE E energia >= 2 ENTÃO",
            "        PARA i DE 1 ATE 2 FACA",
            "            REPARAR_CAMINHO",
            "        FIM_PARA",
            "        ABRIR_SAIDA()",
            "    SENÃO",
            "        MOSTRAR_DICA(\"Verifique o sinal!\")",
            "    FIM_SE",
            "FIMALGORITMO"
        ];

        if (window.finalTerminal && typeof window.finalTerminal.run === "function") {
            window.finalTerminal.run(lines).then(() => {
                setTimeout(triggerRickroll, 2000);
            }).catch((err) => {
                console.error("Falha ao rodar terminal final", err);
            });
        } else {
            alert("Vá até a sala final (final-commit.html) para disparar o terminal!");
        }
    }

    function playSound(type) {
        const audios = {
            gato: "assets/sprites/SpriteSheets/gato_talk.wav",
            celio: "assets/sprites/SpriteSheets/celio_talk.mp3",
            chromicos: "assets/sprites/SpriteSheets/chromicos_talk.mp3",
            biro: "assets/sprites/SpriteSheets/biro_talk.mp3",
            ben: "assets/sprites/SpriteSheets/ben_talk.wav",
            win: "assets/effects/game_end.mp3"
        };
        if (audios[type]) {
            new Audio(audios[type]).play().catch(() => {});
        }
    }

    if (!window._katKeyHooksInstalled) {
        window._katKeyHooksInstalled = true;
        window.addEventListener("keydown", (e) => {
            if (e.target.matches("input, textarea, select")) return;
            if (e.code === "KeyM") {
                playSound("gato");
            } else if (e.code === "Space") {
                e.preventDefault();
                doJump();
            } else if (e.code === "KeyF") {
                e.preventDefault();
                shootLaser();
            }
        });
    }

    function trollDialog() {
        const msgs = [
            "ALERTA DO SISTEMA: O Portugol foi oficialmente banido por violar a Convenção de Genebra.",
            "KAT: 'Cansei de Portugol, reescrevi o sistema inteiro em Rust.'",
            "Célio: 'Promoção! Troco 10 scripts de Portugol por um sachê de Whiskas.'",
            "Chromicos: 'Erro 404: Lógica do Portugol não encontrada.'",
            "KAT: 'Quem precisa de Portugol quando se tem ROOT ACCESS?'"
        ];
        const text = msgs[Math.floor(Math.random() * msgs.length)];
        const box = document.querySelector(".dialog-box");
        const nameEl = document.querySelector("#dialog-character-name");
        const contentEl = document.querySelector("#dialog-content");
        if (box && nameEl && contentEl) {
            box.classList.remove("closed");
            nameEl.textContent = "KAT_ROOT";
            contentEl.textContent = text;
            if (window.katSound) window.katSound.play("terminal");
        }
    }

    let timerRunning = false;
    let timerStart = 0;
    let timerInterval = null;
    function toggleTimer() {
        let hud = document.getElementById("kat-timer-hud");
        if (hud) {
            hud.remove();
            clearInterval(timerInterval);
            timerRunning = false;
            return;
        }
        hud = document.createElement("div");
        hud.id = "kat-timer-hud";
        hud.style.cssText = `
            position: fixed; top: 14px; left: 50%; transform: translateX(-50%);
            background: rgba(16, 10, 22, 0.95); border: 2px solid #a7f3b4;
            box-shadow: 0 4px 0 #0b0711; color: #a7f3b4; font-family: 'Courier New', monospace;
            font-size: 15px; font-weight: bold; padding: 6px 14px; z-index: 9999999;
            display: flex; gap: 8px; align-items: center; user-select: none;
        `;
        hud.innerHTML = `<span>⏱️ SPEEDRUN:</span> <span id="kat-timer-time">00:00.00</span>`;
        document.body.appendChild(hud);

        timerStart = performance.now();
        timerRunning = true;
        timerInterval = setInterval(() => {
            const diff = performance.now() - timerStart;
            const m = Math.floor(diff / 60000).toString().padStart(2, '0');
            const s = Math.floor((diff % 60000) / 1000).toString().padStart(2, '0');
            const ms = Math.floor((diff % 1000) / 10).toString().padStart(2, '0');
            const el = document.getElementById("kat-timer-time");
            if (el) el.textContent = `${m}:${s}.${ms}`;
        }, 16);
    }

    function autoSolvePortugol() {
        const launcher = document.querySelector(".challenge-launcher");
        const overlay = document.querySelector(".challenge-overlay");

        if (launcher && (!overlay || overlay.hidden)) {
            launcher.click();
        }

        setTimeout(() => {
            const kicker = document.querySelector(".challenge-kicker");
            if (!kicker) {
                alert("Nenhum desafio aberto nesta sala!");
                return;
            }

            const match = kicker.textContent.match(/DESAFIO (\d+) DE 10/);
            if (!match) return;
            const id = parseInt(match[1]);
            const answers = ANSWERS[id];
            if (!answers) return;

            const groups = document.querySelectorAll(".challenge-choice-group");
            groups.forEach((group, index) => {
                const targetAnswer = answers[index];
                if (!targetAnswer) return;
                const radios = group.querySelectorAll("input[type='radio']");
                radios.forEach((radio) => {
                    if (radio.value.trim() === targetAnswer.trim()) {
                        radio.checked = true;
                        radio.click();
                        radio.dispatchEvent(new Event("change", { bubbles: true }));
                    }
                });
            });

            setTimeout(() => {
                const runBtn = document.querySelector(".challenge-action");
                if (runBtn) runBtn.click();
            }, 250);
        }, 120);
    }

    function instantWin() {
        const state = JSON.parse(localStorage.getItem("assets") || "{}");
        state.completedChallenges = state.completedChallenges || [];
        const nextId = state.completedChallenges.length + 1;
        if (nextId <= 10 && !state.completedChallenges.includes(nextId)) {
            state.completedChallenges.push(nextId);
        }
        if (nextId === 2) state["have-repair-tool"] = true;
        state["have-admin-file"] = true;
        state["admin-access-lost"] = false;
        localStorage.setItem("assets", JSON.stringify(state));

        document.dispatchEvent(new CustomEvent("kat:challenge-complete", { detail: { id: nextId } }));
        alert(`Desafio ${nextId}/10 concluído!`);

        const closeBtn = document.querySelector(".challenge-close");
        if (closeBtn) closeBtn.click();
    }

    function talkRemote() {
        if (typeof framer !== "undefined" && framer.sceneManager && framer.npcs && framer.npcs.length > 0) {
            framer.controlsDisabled = false;
            framer.sceneManager.handleInteraction(framer.npcs[0]);
        } else {
            alert("Nenhum NPC disponível nesta sala!");
        }
    }

    const root = document.createElement("div");
    root.id = "kat-native-hack-root";

    function renderUI() {
        root.replaceChildren();

        if (currentSettings.minimized) {
            const badge = document.createElement("div");
            badge.className = "kat-min-badge";
            badge.innerHTML = `<span>🐱</span> <span>KAT-OS // ROOT</span>`;
            badge.onclick = () => {
                currentSettings.minimized = false;
                saveSettings(currentSettings);
                renderUI();
            };
            root.appendChild(badge);
            return;
        }

        const panel = document.createElement("div");
        panel.className = "kat-panel-native";
        panel.innerHTML = `
            <div class="kat-header-native">
                <div>
                    <div class="kat-kicker-native">TERMINAL // ROOT_ACCESS</div>
                    <h2 class="kat-title-native">KAT-OS // CHEAT_ENGINE</h2>
                </div>
                <div style="display:flex; gap: 4px;">
                    <button id="kn-min" class="kat-btn-native" style="padding: 2px 7px;">_</button>
                    <button id="kn-close" class="kat-btn-native" style="padding: 2px 7px; color: #ff6666;">✕</button>
                </div>
            </div>

            <div class="kat-section-label">⚡ DESAFIOS & FINAL</div>
            <button id="kn-exec-final" class="kat-btn-native kat-btn-action" style="border-color:#ff3366; color:#ff99bb;">
                <span>▶ EXECUTAR TERMINAL FINAL</span> <span>🚀</span>
            </button>
            <button id="kn-solve" class="kat-btn-native kat-btn-action">
                <span>🧠 Auto-Resolver Portugol</span> <span>▶</span>
            </button>
            <button id="kn-win" class="kat-btn-native kat-btn-action">
                <span>⚡ Concluir Desafio Atual</span> <span>✔</span>
            </button>
            <button id="kn-talk" class="kat-btn-native">
                <span>🗣️ Conversar com NPC</span> <span>[E]</span>
            </button>

            <div class="kat-section-label">🎮 ARMAS & FÍSICA (NOVOS!)</div>
            <div class="kat-btn-grid">
                <button id="kn-laser" class="kat-btn-native kat-btn-action">
                    <span>🔫 Atirar Laser</span> <span>[F]</span>
                </button>
                <button id="kn-jump" class="kat-btn-native kat-btn-action">
                    <span>🦘 Pular</span> <span>[ESPAÇO]</span>
                </button>
            </div>
            <div class="kat-btn-grid">
                <button id="kn-crown" class="kat-btn-native ${currentSettings.crown ? 'is-active' : ''}">
                    <span>👑 Tag VIP</span> <span>${currentSettings.crown ? 'ON' : 'OFF'}</span>
                </button>
                <button id="kn-boss" class="kat-btn-native ${currentSettings.boss ? 'is-active' : ''}">
                    <span>⚔️ Boss Bar</span> <span>${currentSettings.boss ? 'ON' : 'OFF'}</span>
                </button>
            </div>
            <button id="kn-rick" class="kat-btn-native" style="border-color:#ff0055; color:#ff77aa;">
                <span>🕺 RICKROLL TROLL</span> <span>▶</span>
            </button>

            <div class="kat-section-label">👻 MOVIMENTO & FANTASMA</div>
            <button id="kn-noclip" class="kat-btn-native ${currentSettings.noclip ? 'is-active' : ''}">
                <span>👻 Modo Fantasma (Noclip)</span>
                <span>${currentSettings.noclip ? 'ON' : 'OFF'}</span>
            </button>

            <div class="kat-speed-bar">
                <span>VELOCIDADE:</span>
                <div style="display:flex; gap: 4px;">
                    <button class="kat-speed-btn ${currentSettings.speed === 1 ? 'is-active' : ''}" data-s="1">1x</button>
                    <button class="kat-speed-btn ${currentSettings.speed === 3 ? 'is-active' : ''}" data-s="3">3x</button>
                    <button class="kat-speed-btn ${currentSettings.speed === 6 ? 'is-active' : ''}" data-s="6">6x</button>
                </div>
            </div>

            <div class="kat-btn-grid">
                <button id="kn-godzilla" class="kat-btn-native ${currentSettings.godzilla ? 'is-active' : ''}">
                    <span>🦖 Godzilla</span> <span>${currentSettings.godzilla ? 'ON' : 'OFF'}</span>
                </button>
                <button id="kn-spin" class="kat-btn-native ${currentSettings.spin ? 'is-active' : ''}">
                    <span>🌀 Pião</span> <span>${currentSettings.spin ? 'ON' : 'OFF'}</span>
                </button>
            </div>

            <div class="kat-section-label">🎭 SKINS & ZUEIRA</div>
            <select id="kn-skin" class="kat-select-native">
                <option value="gato" ${currentSettings.skin === 'gato' ? 'selected' : ''}>Skin: KAT (Gato)</option>
                <option value="ben" ${currentSettings.skin === 'ben' ? 'selected' : ''}>Skin: Ben (Aprendiz)</option>
                <option value="celio" ${currentSettings.skin === 'celio' ? 'selected' : ''}>Skin: Célio (Robô)</option>
                <option value="chromicos" ${currentSettings.skin === 'chromicos' ? 'selected' : ''}>Skin: Chromicos (Mago)</option>
                <option value="biro" ${currentSettings.skin === 'biro' ? 'selected' : ''}>Skin: Biro (Refúgio)</option>
            </select>

            <div class="kat-btn-grid">
                <button id="kn-conga" class="kat-btn-native ${congaActive ? 'is-active' : ''}">
                    <span>🚂 Centopeia NPCs</span>
                </button>
                <button id="kn-clones" class="kat-btn-native ${clones.length > 0 ? 'is-active' : ''}">
                    <span>👥 Clones (8x)</span>
                </button>
            </div>

            <div class="kat-btn-grid">
                <button id="kn-rave" class="kat-btn-native ${currentSettings.rave ? 'is-active' : ''}">
                    <span>🌈 Modo Rave</span>
                </button>
                <button id="kn-crt" class="kat-btn-native ${currentSettings.crt ? 'is-active' : ''}">
                    <span>📺 Visual CRT</span>
                </button>
            </div>

            <div class="kat-btn-grid">
                <button id="kn-troll" class="kat-btn-native">
                    <span>💬 Diálogo Troll</span>
                </button>
                <button id="kn-meow" class="kat-btn-native">
                    <span>🐱 Miar [Tecla M]</span>
                </button>
            </div>

            <div class="kat-section-label">👑 MODO DEUS & MAPA</div>
            <button id="kn-timer" class="kat-btn-native ${timerRunning ? 'is-active' : ''}">
                <span>⏱️ Cronômetro Speedrun HUD</span> <span>▶</span>
            </button>
            <button id="kn-save" class="kat-btn-native" style="border-color:#ffaa00; color:#ffcc66;">
                <span>👑 Save 100% (Modo Deus)</span> <span>★</span>
            </button>

            <div class="kat-btn-grid">
                <button id="kn-chaos" class="kat-btn-native">
                    <span>📦 Spam Caixas</span>
                </button>
                <button id="kn-clear" class="kat-btn-native">
                    <span>🧹 Limpar Mapa</span>
                </button>
            </div>

            <select id="kn-warp" class="kat-select-native">
                <option value="">🚀 Teleportar de Sala...</option>
                <option value="refuge.html">Refúgio</option>
                <option value="binary-room.html">Sala Binária</option>
                <option value="marketplace.html">Bazar Oculto</option>
                <option value="garden.html">Jardim</option>
                <option value="deepstrech.html">Lacuna Profunda</option>
                <option value="laboratorio.html">Laboratório</option>
                <option value="teleport.html">Plataformas</option>
                <option value="final-commit.html">Terminal Final</option>
            </select>

            <div class="kat-footer-text">
                Botão Direito = Buraco Negro | Shift + Clique = Teleporte
            </div>
        `;

        root.appendChild(panel);

        panel.querySelector("#kn-min").onclick = () => {
            currentSettings.minimized = true;
            saveSettings(currentSettings);
            renderUI();
        };
        panel.querySelector("#kn-close").onclick = () => root.remove();

        panel.querySelector("#kn-exec-final").onclick = forceFinalTerminal;
        panel.querySelector("#kn-solve").onclick = autoSolvePortugol;
        panel.querySelector("#kn-win").onclick = instantWin;
        panel.querySelector("#kn-talk").onclick = talkRemote;

        panel.querySelector("#kn-laser").onclick = shootLaser;
        panel.querySelector("#kn-jump").onclick = doJump;
        panel.querySelector("#kn-rick").onclick = triggerRickroll;

        panel.querySelector("#kn-crown").onclick = () => {
            applyCrown(!currentSettings.crown);
            renderUI();
        };

        panel.querySelector("#kn-boss").onclick = () => {
            toggleBoss();
            renderUI();
        };

        panel.querySelector("#kn-noclip").onclick = () => {
            applyNoclip(!currentSettings.noclip);
            renderUI();
        };

        panel.querySelectorAll(".kat-speed-btn").forEach((btn) => {
            btn.onclick = () => {
                applySpeed(parseFloat(btn.dataset.s));
                renderUI();
            };
        });

        panel.querySelector("#kn-godzilla").onclick = () => {
            applyGodzilla(!currentSettings.godzilla);
            renderUI();
        };

        panel.querySelector("#kn-spin").onclick = () => {
            applySpin(!currentSettings.spin);
            renderUI();
        };

        panel.querySelector("#kn-skin").onchange = (e) => {
            applySkin(e.target.value);
        };

        panel.querySelector("#kn-conga").onclick = () => {
            toggleConga();
            renderUI();
        };

        panel.querySelector("#kn-clones").onclick = () => {
            toggleClones();
            renderUI();
        };

        panel.querySelector("#kn-rave").onclick = () => {
            applyRave(!currentSettings.rave);
            renderUI();
        };

        panel.querySelector("#kn-crt").onclick = () => {
            applyCrt(!currentSettings.crt);
            renderUI();
        };

        panel.querySelector("#kn-troll").onclick = trollDialog;
        panel.querySelector("#kn-meow").onclick = () => playSound("gato");
        panel.querySelector("#kn-timer").onclick = () => {
            toggleTimer();
            renderUI();
        };

        panel.querySelector("#kn-save").onclick = () => {
            const state = JSON.parse(localStorage.getItem("assets") || "{}");
            state.started = true;
            state["have-admin-file"] = true;
            state["admin-key-available"] = true;
            state["admin-access-lost"] = false;
            state["have-ben"] = true;
            state["have-repair-tool"] = true;
            state["ben-taked"] = true;
            state.encryptedFiles = [1, 2, 3, 4];
            state.completedChallenges = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
            localStorage.setItem("assets", JSON.stringify(state));
            alert("Save 100% aplicado!");
            location.reload();
        };

        panel.querySelector("#kn-chaos").onclick = () => {
            if (typeof framer !== "undefined" && framer.placeApi) {
                const types = ["caixa", "bola", "caminho", "parede"];
                for (let i = 0; i < 15; i++) {
                    const type = types[Math.floor(Math.random() * types.length)];
                    framer.placeApi.criar[type]({
                        x: Math.random() * (window.innerWidth - 120),
                        y: Math.random() * (window.innerHeight - 120)
                    });
                }
            }
        };

        panel.querySelector("#kn-clear").onclick = () => {
            if (typeof framer !== "undefined" && framer.placeApi) {
                framer.placeApi.deletar.tudo();
            }
        };

        panel.querySelector("#kn-warp").onchange = (e) => {
            if (e.target.value) {
                const state = JSON.parse(localStorage.getItem("assets") || "{}");
                state.started = true;
                localStorage.setItem("assets", JSON.stringify(state));
                window.location.href = e.target.value;
            }
        };
    }

    function init() {
        document.body.appendChild(root);
        renderUI();

        setTimeout(() => {
            if (currentSettings.speed > 1) applySpeed(currentSettings.speed);
            if (currentSettings.noclip) applyNoclip(true);
            if (currentSettings.godzilla) applyGodzilla(true);
            if (currentSettings.spin) applySpin(true);
            if (currentSettings.skin && currentSettings.skin !== "gato") applySkin(currentSettings.skin);
            if (currentSettings.rave) applyRave(true);
            if (currentSettings.crt) applyCrt(true);
            if (currentSettings.crown) applyCrown(true);
            if (currentSettings.boss) toggleBoss();
        }, 150);
    }

    if (!window._katNativeTeleportHooked) {
        window._katNativeTeleportHooked = true;
        window.addEventListener("click", (e) => {
            if (!e.shiftKey) return;
            const cat = getCat();
            if (cat && typeof framer !== "undefined") {
                const top = e.pageY - ((cat.offsetHeight || 130) / 2);
                const left = e.pageX - ((cat.offsetWidth || 130) / 2);
                framer.characterPosition = { top, left };
                cat.style.top = top + "px";
                cat.style.left = left + "px";
            }
        });
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => setTimeout(init, 200));
    } else {
        setTimeout(init, 200);
    }

})();
