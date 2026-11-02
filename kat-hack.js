
(() => {
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
                minimized: false
            };
        } catch {
            return { speed: 1, noclip: false, godzilla: false, spin: false, minimized: false };
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
                width: 290px;
                background: linear-gradient(180deg, #322044, #170e22);
                border: 3px solid #e0b8ff;
                color: #f7edff;
                box-shadow: 0 8px 0 #0b0711, inset 0 0 0 2px #503363;
                padding: 14px;
                display: flex;
                flex-direction: column;
                gap: 8px;
            }

            .kat-header-native {
                display: flex;
                justify-content: space-between;
                align-items: flex-start;
                border-bottom: 2px solid #503363;
                padding-bottom: 8px;
                margin-bottom: 2px;
            }

            .kat-kicker-native {
                color: #e0b8ff;
                font-size: 10px;
                font-weight: bold;
                letter-spacing: 0.1em;
                margin: 0 0 4px;
                text-transform: uppercase;
            }

            .kat-title-native {
                margin: 0;
                font-size: 15px;
                font-weight: bold;
                color: #f7edff;
                text-shadow: 2px 2px 0 #0b0711;
            }

            .kat-btn-group {
                display: flex;
                gap: 6px;
            }

            .kat-btn-native {
                background: #241432;
                border: 2px solid #503363;
                color: #f7edff;
                box-shadow: 0 3px 0 #0b0711;
                padding: 7px 10px;
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
                padding: 4px 8px;
                font-size: 11px;
                color: #e0b8ff;
                font-weight: bold;
            }
            .kat-speed-btn {
                background: #241432;
                border: 1px solid #503363;
                color: #f7edff;
                cursor: pointer;
                padding: 3px 8px;
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
                padding: 6px;
                font-family: "Courier New", Courier, monospace;
                font-size: 11px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 3px 0 #0b0711;
            }
            .kat-select-native:hover {
                border-color: #e0b8ff;
            }

            .kat-footer-text {
                font-size: 9px;
                color: #bfa4cf;
                text-align: center;
                margin: 4px 0 0;
                border-top: 1px solid #3c254d;
                padding-top: 6px;
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
                    <div class="kat-kicker-native">TERMINAL FINAL // DEBUG</div>
                    <h2 class="kat-title-native">KAT-OS // ROOT_MENU</h2>
                </div>
                <div class="kat-btn-group">
                    <button id="kn-min" class="kat-btn-native" style="padding: 2px 7px; font-size: 13px;">_</button>
                    <button id="kn-close" class="kat-btn-native" style="padding: 2px 7px; font-size: 13px; color: #ff6666;">✕</button>
                </div>
            </div>

            <button id="kn-solve" class="kat-btn-native kat-btn-action">
                <span>🧠 Auto-Resolver Portugol</span> <span>▶</span>
            </button>
            <button id="kn-win" class="kat-btn-native kat-btn-action">
                <span>⚡ Concluir Desafio da Sala</span> <span>✔</span>
            </button>
            <button id="kn-talk" class="kat-btn-native">
                <span>🗣️ Conversar com NPC</span> <span>[E]</span>
            </button>

            <button id="kn-noclip" class="kat-btn-native ${currentSettings.noclip ? 'is-active' : ''}">
                <span>👻 Modo Fantasma (Noclip)</span>
                <span>${currentSettings.noclip ? 'ON' : 'OFF'}</span>
            </button>

            <div class="kat-speed-bar">
                <span>⚡ VELOCIDADE:</span>
                <div style="display:flex; gap: 4px;">
                    <button class="kat-speed-btn ${currentSettings.speed === 1 ? 'is-active' : ''}" data-s="1">1x</button>
                    <button class="kat-speed-btn ${currentSettings.speed === 3 ? 'is-active' : ''}" data-s="3">3x</button>
                    <button class="kat-speed-btn ${currentSettings.speed === 6 ? 'is-active' : ''}" data-s="6">6x</button>
                </div>
            </div>

            <button id="kn-godzilla" class="kat-btn-native ${currentSettings.godzilla ? 'is-active' : ''}">
                <span>🦖 Gato Godzilla (300px)</span>
                <span>${currentSettings.godzilla ? 'ON' : 'OFF'}</span>
            </button>

            <button id="kn-spin" class="kat-btn-native ${currentSettings.spin ? 'is-active' : ''}">
                <span>🌀 Gato Pião (360°)</span>
                <span>${currentSettings.spin ? 'ON' : 'OFF'}</span>
            </button>

            <button id="kn-save" class="kat-btn-native" style="border-color:#ffaa00; color:#ffcc66;">
                <span>👑 Save 100% (Modo Deus)</span> <span>★</span>
            </button>

            <div style="display: flex; gap: 4px;">
                <button id="kn-chaos" class="kat-btn-native" style="flex:1;">
                    <span>📦 Spam Caixas</span>
                </button>
                <button id="kn-clear" class="kat-btn-native" style="flex:1;">
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
                Shift + Clique = Teleporte Instantâneo
            </div>
        `;

        root.appendChild(panel);

        panel.querySelector("#kn-min").onclick = () => {
            currentSettings.minimized = true;
            saveSettings(currentSettings);
            renderUI();
        };
        panel.querySelector("#kn-close").onclick = () => root.remove();

        panel.querySelector("#kn-solve").onclick = autoSolvePortugol;
        panel.querySelector("#kn-win").onclick = instantWin;
        panel.querySelector("#kn-talk").onclick = talkRemote;

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
            alert("👑 Save 100% aplicado!");
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

    document.body.appendChild(root);
    renderUI();

    setTimeout(() => {
        if (currentSettings.speed > 1) applySpeed(currentSettings.speed);
        if (currentSettings.noclip) applyNoclip(true);
        if (currentSettings.godzilla) applyGodzilla(true);
        if (currentSettings.spin) applySpin(true);
    }, 150);

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

    console.log("%c[KAT-HAKI]", "color: #e0b8ff; font-weight: bold; font-size: 14px; background: #21132e; padding: 4px;");
})();
