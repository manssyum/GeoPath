// === СОСТОЯНИЕ (загружаем из localStorage) ===
let xp = Number(localStorage.getItem("geo_xp")) || 0;
let level = Number(localStorage.getItem("geo_level")) || 1;
let unlockedAchievements = new Set(JSON.parse(localStorage.getItem("geo_achievements") || "[]"));

// === ОБЩЕЕ СОСТОЯНИЕ ДЛЯ ИГР ===
const state = {
    currentErrorQuestion: null,
    currentOddQuestion: null,
    sortData: null,
    sortCorrect: 0,
    sortAnswered: 0,
    matchData: null,
    currentImageQuestion: null,
    currentImageOptions: null,
    shuffledHardness: null,
    currentLabMineral: null
};

// === ПОДСВЕТКА АКТИВНОГО РАЗДЕЛА ===
function setActiveNav(id) {
    document.querySelectorAll("nav button").forEach(b => b.classList.remove("active"));
    document.getElementById(id).classList.add("active");
}

// === ОБНОВЛЕНИЕ ИНТЕРФЕЙСА ===
function updateStats() {
    document.getElementById("xp").innerText = xp;
    document.getElementById("level").innerText = level;
    const needed = level * 50 - xp;
    document.getElementById("xpToNext").innerText = needed;
}

// === ДОБАВЛЕНИЕ ОПЫТА ===
function addXP(count) {
    xp += count;

    while (xp >= level * 50) {
        level++;
    }

    checkAchievements();

    // сохраняем прогресс
    localStorage.setItem("geo_xp", xp);
    localStorage.setItem("geo_level", level);
    localStorage.setItem("geo_achievements", JSON.stringify([...unlockedAchievements]));

    updateStats();
}

// === ПЕРЕМЕШИВАНИЕ МАССИВА ===
function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// === ПРОВЕРКА ДОСТИЖЕНИЙ ===
function checkAchievements() {
    const achievements = achievementsList;

    achievements.forEach(a => {
        if (xp >= a.xp && !unlockedAchievements.has(a.name)) {
            unlockedAchievements.add(a.name);
            alert("🏅 Достижение разблокировано: " + a.emoji + " " + a.name + "!");
        }
    });
}

// === ДОСТИЖЕНИЯ — экран отображения ===
function showAchievements() {
    setActiveNav("nav-achievements");

    const achievements = achievementsList;

    let html = `<div class="card"><h2>🏅 Достижения</h2>`;
    achievements.forEach(a => {
        const unlocked = unlockedAchievements.has(a.name);
        html += `
            <div class="achievement" style="${unlocked
                ? "border-left-color:gold;background:#fffde7;"
                : "border-left-color:#bbb;opacity:0.6;"}">
                <span style="font-size:24px;">${a.emoji}</span>
                <b>${a.name}</b><br>
                ${unlocked ? "✅ Получено!" : "🔒 Нужно " + a.xp + " XP (у вас " + xp + ")"}
            </div>
        `;
    });
    html += `<p style="margin-top:15px;">⭐ Всего опыта: ${xp}</p></div>`;
    document.getElementById("game").innerHTML = html;
}

// === ТЕОРИЯ ===
function showTheory() {
    setActiveNav("nav-theory");

    const order = ['igneous', 'sedimentary', 'metamorphic', 'metasomatic'];
    const icons = { igneous: '🌋', sedimentary: '🏖️', metamorphic: '🔮', metasomatic: '⚗️' };
    
    let catalogHtml = '';
    
    order.forEach(type => {
        const items = rockCatalog
            .filter(r => r.type === type)
            .sort((a, b) => a.name.localeCompare(b.name, 'ru'));
        
        catalogHtml += `
            <div style="margin-bottom:15px;">
                <h3 style="font-size:16px;margin-bottom:5px;">${icons[type]} ${rockTypeLabels[type]}</h3>
                <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(200px,1fr));gap:6px;padding-left:10px;">
                    ${items.map(r => `
                        <div style="margin:2px 0;font-size:13px;padding:4px 8px;background:#f5f5f5;border-radius:4px;">
                            <b>${r.name}</b> — <span style="color:#555;font-size:12px;">${r.desc}</span>
                        </div>
                    `).join("")}
                </div>
            </div>
        `;
    });

    let html = `
        <div class="card">
            <h2>📚 Каталог горных пород</h2>
            <hr style="margin:15px 0;">
            ${catalogHtml}
        </div>
        
        <div class="card">
            <h2>📏 Шкала твёрдости Мооса</h2>
            <table style="width:100%;border-collapse:collapse;margin-top:10px;">
                <tr style="background:#eceff1;">
                    <th style="padding:8px;border:1px solid #ddd;text-align:center;">Твёрдость</th>
                    <th style="padding:8px;border:1px solid #ddd;text-align:left;">Минерал</th>
                    <th style="padding:8px;border:1px solid #ddd;text-align:left;">Описание</th>
                </tr>
                ${hardnessScale.map(m => `
                    <tr>
                        <td style="padding:8px;border:1px solid #ddd;text-align:center;">${m.hardness}</td>
                        <td style="padding:8px;border:1px solid #ddd;">${m.name}</td>
                        <td style="padding:8px;border:1px solid #ddd;font-size:14px;color:#555;">${m.description}</td>
                    </tr>
                `).join("")}
            </table>
        </div>

        <div class="card">
            <h2>🔬 Порядок определения твёрдости</h2>
            <ul>
                ${theory.hardnessTest.map(item => `<li style="margin:8px 0;">${item}</li>`).join("")}
            </ul>
        </div>

        <div class="card">
            <h2>🧱 Текстуры горных пород</h2>
            <ul>
                ${theory.textures.map(item => `<li style="margin:8px 0;">${item}</li>`).join("")}
            </ul>
        </div>

        <div class="card">
            <h2>🔬 Структуры горных пород</h2>
            <ul>
                ${theory.structures.map(item => `<li style="margin:8px 0;">${item}</li>`).join("")}
            </ul>
        </div>
    `;
    document.getElementById("game").innerHTML = html;
}

// === ВИКТОРИНА ===
function startQuiz() {
    setActiveNav("nav-quiz");

    const q = quiz[Math.floor(Math.random() * quiz.length)];
    let html = `<div class="card"><h2>❓ Викторина</h2><p style="font-size:16px;margin:15px 0;">${q.question}</p>`;
    q.answers.forEach((a, i) => {
        html += `<button class="answer" onclick="checkAnswer(this, ${i}, ${q.correct})">${a}</button>`;
    });
    html += `</div>`;
    document.getElementById("game").innerHTML = html;
}

function checkAnswer(btn, user, correct) {
    const buttons = document.querySelectorAll(".answer");
    buttons.forEach(b => b.disabled = true);

    if (user === correct) {
        btn.classList.add("correct");
        addXP(10);
        setTimeout(() => startQuiz(), 1000);
    } else {
        btn.classList.add("wrong");
        buttons[correct].classList.add("correct");
        setTimeout(() => startQuiz(), 1800);
    }
}

// === НАЙДИ ОШИБКУ ===
function startFindError() {
    setActiveNav("nav-error");

    const q = findError[Math.floor(Math.random() * findError.length)];
    state.currentErrorQuestion = q;

    document.getElementById("game").innerHTML = `
        <div class="card">
            <h2>🔍 Найди ошибку</h2>
            <p style="margin:15px 0;font-size:16px;">${q.text}</p>
            <button class="answer" onclick="answerError(this, true)">Есть ошибка</button>
            <button class="answer" onclick="answerError(this, false)">Ошибки нет</button>
            <div id="error-explanation" style="margin-top:15px;padding:12px;border-radius:8px;display:none;"></div>
        </div>
    `;
}

function answerError(btn, userSaysHasError) {
    const q = state.currentErrorQuestion;
    const buttons = document.querySelectorAll(".answer");
    buttons.forEach(b => b.disabled = true);

    const expDiv = document.getElementById("error-explanation");
    expDiv.style.display = "block";

    const isCorrect = (userSaysHasError === q.hasError);

    if (isCorrect) {
        btn.classList.add("correct");
        expDiv.style.background = "#e8f5e9";
        expDiv.style.color = "#2e7d32";
        expDiv.style.borderLeft = "4px solid #4caf50";
        expDiv.innerHTML = "✅ Правильно!<br>" + q.explanation;
        addXP(15);
    } else {
        btn.classList.add("wrong");
        expDiv.style.background = "#ffebee";
        expDiv.style.color = "#c62828";
        expDiv.style.borderLeft = "4px solid #f44336";
        expDiv.innerHTML = "❌ Неправильно.<br>" + q.explanation;
    }

    setTimeout(() => startFindError(), 3000);
}

// === НАЙДИ ЛИШНЕЕ ===
function startFindOdd() {
    setActiveNav("nav-odd");

    const q = findOdd[Math.floor(Math.random() * findOdd.length)];
    state.currentOddQuestion = q;

    let html = `<div class="card"><h2>🧩 Найди лишнее</h2><p style="margin:10px 0;">Выберите лишнее слово:</p>`;
    q.items.forEach((item, i) => {
        html += `<button class="answer" onclick="checkOdd(this, ${i})">${item}</button>`;
    });
    html += `<div id="odd-explanation" style="margin-top:15px;padding:12px;border-radius:8px;display:none;"></div></div>`;
    document.getElementById("game").innerHTML = html;
}

function checkOdd(btn, user) {
    const q = state.currentOddQuestion;
    const buttons = document.querySelectorAll(".answer");
    buttons.forEach(b => b.disabled = true);

    const expDiv = document.getElementById("odd-explanation");
    expDiv.style.display = "block";

    if (user === q.correct) {
        btn.classList.add("correct");
        expDiv.style.background = "#e8f5e9";
        expDiv.style.color = "#2e7d32";
        expDiv.style.borderLeft = "4px solid #4caf50";
        expDiv.innerHTML = "✅ Правильно! " + q.explanation;
        addXP(12);
    } else {
        btn.classList.add("wrong");
        buttons[q.correct].classList.add("correct");
        expDiv.style.background = "#ffebee";
        expDiv.style.color = "#c62828";
        expDiv.style.borderLeft = "4px solid #f44336";
        expDiv.innerHTML = "❌ Неправильно. " + q.explanation;
    }

    setTimeout(() => startFindOdd(), 3000);
}

// === СОРТИРОВКА ===
function startSort() {
    setActiveNav("nav-sort");

    const picked = shuffle([...sorting]).slice(0, 6);
    state.sortData = picked;
    state.sortCorrect = 0;
    state.sortAnswered = 0;

    const classes = [...new Set(sorting.map(s => s.type))];

    let html = `
        <div class="card">
            <h2>📊 Сортировка</h2>
            <p style="margin:10px 0;">К какому классу относится минерал?</p>
            <p style="font-size:13px;color:#666;margin-bottom:12px;">Правильно: <span id="sortScore">0</span> из ${picked.length}</p>
            <div id="sort-list">
    `;

    picked.forEach((s, idx) => {
        html += `
            <div id="sort-row-${idx}" style="margin:10px 0;padding:10px;background:#f5f5f5;border-radius:8px;">
                <b style="display:block;margin-bottom:6px;">${s.name}</b>
                <div style="display:flex;flex-wrap:wrap;gap:6px;">
                    ${classes.map(c => `
                        <button class="answer" style="width:auto;padding:5px 12px;font-size:13px;display:inline-block;"
                            onclick="sortAnswer(this, ${idx}, '${s.type}', '${c}')">${c}</button>
                    `).join("")}
                </div>
                <span id="sort-feedback-${idx}" style="font-size:13px;margin-top:4px;display:block;"></span>
            </div>
        `;
    });

    html += `</div></div>`;
    document.getElementById("game").innerHTML = html;
}

function sortAnswer(btn, idx, realType, chosenType) {
    const row = document.getElementById("sort-row-" + idx);
    row.querySelectorAll(".answer").forEach(b => b.disabled = true);

    const feedback = document.getElementById("sort-feedback-" + idx);
    state.sortAnswered++;

    if (realType === chosenType) {
        btn.classList.add("correct");
        feedback.innerHTML = "✅ Верно!";
        feedback.style.color = "#2e7d32";
        state.sortCorrect++;
        addXP(5);
    } else {
        btn.classList.add("wrong");
        row.querySelectorAll(".answer").forEach(b => {
            if (b.textContent === realType) b.classList.add("correct");
        });
        feedback.innerHTML = "❌ Правильно: " + realType;
        feedback.style.color = "#c62828";
    }

    document.getElementById("sortScore").innerText = state.sortCorrect;

    if (state.sortAnswered === state.sortData.length) {
        setTimeout(() => {
            const retry = document.createElement("button");
            retry.className = "answer";
            retry.textContent = "🔄 Сыграть ещё раз";
            retry.onclick = startSort;
            document.querySelector(".card").appendChild(retry);
        }, 500);
    }
}

// === СООТНЕСЕНИЕ ===
function startMatch() {
    setActiveNav("nav-match");

    const shuffledData = shuffle([...matching]);
    state.matchData = shuffledData;

    const uses = matching.map(m => m.use);

    let html = `
        <div class="card">
            <h2>🔗 Соотнеси минерал и применение</h2>
            <p style="margin:10px 0;">Выберите правильное применение для каждого минерала:</p>
    `;

    shuffledData.forEach((m, idx) => {
        html += `
            <div style="display:flex;align-items:center;justify-content:space-between;
                padding:10px;margin:6px 0;background:#f5f5f5;border-radius:8px;flex-wrap:wrap;gap:6px;">
                <b style="min-width:110px;">${m.mineral}</b>
                <select id="match-${idx}"
                    style="padding:6px 10px;border-radius:6px;border:1px solid #ccc;font-size:14px;flex:1;min-width:180px;">
                    <option value="">-- Выберите --</option>
                    ${uses.map(u => `<option value="${u}">${u}</option>`).join("")}
                </select>
                <span id="match-result-${idx}" style="font-size:16px;"></span>
            </div>
        `;
    });

    html += `
        <button class="answer" onclick="checkAllMatches()" style="margin-top:10px;">✅ Проверить</button>
        <div id="match-feedback"></div>
        </div>
    `;
    document.getElementById("game").innerHTML = html;
}

function checkAllMatches() {
    const data = state.matchData;
    let correct = 0;

    data.forEach((m, i) => {
        const sel = document.getElementById("match-" + i);
        const result = document.getElementById("match-result-" + i);
        if (sel.value === m.use) {
            correct++;
            result.innerHTML = "✅";
        } else {
            result.innerHTML = "❌";
            sel.style.borderColor = "#f44336";
        }
    });

    const feedback = document.getElementById("match-feedback");
    if (correct === data.length) {
        feedback.innerHTML = `
            <div style="margin-top:12px;padding:12px;border-radius:8px;
                background:#e8f5e9;color:#2e7d32;font-weight:bold;border-left:4px solid #4caf50;">
                🎉 Отлично! Все пары верны! +25 XP
            </div>`;
        addXP(25);
    } else {
        feedback.innerHTML = `
            <div style="margin-top:12px;padding:12px;border-radius:8px;
                background:#ffebee;color:#c62828;font-weight:bold;border-left:4px solid #f44336;">
                Правильно: ${correct} из ${data.length}. Попробуйте ещё раз.
            </div>`;
    }
}

// === ОПРЕДЕЛИ ПО ОПИСАНИЮ ===
function startImageQuiz() {
    setActiveNav("nav-image");

    const q = imageQuiz[Math.floor(Math.random() * imageQuiz.length)];
    const shuffledOptions = shuffle([...q.options]);

    state.currentImageQuestion = q;
    state.currentImageOptions = shuffledOptions;

    let html = `
        <div class="card">
            <h2>🖼️ Определи по описанию</h2>
            <div style="background:#f5f5f5;border-radius:10px;padding:15px;margin:15px 0;font-size:15px;">
                ${q.desc}
            </div>
            <p style="font-size:14px;color:#666;margin-bottom:10px;">
                Какой это минерал?
            </p>
    `;

    shuffledOptions.forEach((o, i) => {
        html += `
            <button class="answer"
                onclick="checkImageAnswer(this, ${i})">
                ${o}
            </button>
        `;
    });

    html += `</div>`;
    document.getElementById("game").innerHTML = html;
}

function checkImageAnswer(btn, index) {
    const buttons = document.querySelectorAll(".answer");
    buttons.forEach(b => b.disabled = true);

    const chosen = state.currentImageOptions[index];
    const correct = state.currentImageQuestion.options[state.currentImageQuestion.correct];

    if (chosen === correct) {
        btn.classList.add("correct");
        addXP(15);
    } else {
        btn.classList.add("wrong");
        buttons.forEach(b => {
            if (b.textContent.trim() === correct) {
                b.classList.add("correct");
            }
        });
    }

    setTimeout(() => startImageQuiz(), 1800);
}

// === ШКАЛА ТВЁРДОСТИ ===
function startHardnessTest() {
    setActiveNav("nav-hardness");

    state.shuffledHardness = shuffle([...hardnessScale]);

    let html = `
        <div class="card">
            <h2>📏 Шкала твёрдости Мооса</h2>
            <p style="margin:10px 0;">Введите твёрдость (1–10) для каждого минерала:</p>
            <p style="font-size:13px;color:#666;margin-bottom:12px;">1 = самый мягкий, 10 = самый твёрдый</p>
    `;

    state.shuffledHardness.forEach((m, i) => {
        html += `
            <div style="display:flex;align-items:center;gap:12px;padding:8px 12px;
                margin:4px 0;background:#f9f9f9;border-radius:6px;flex-wrap:wrap;">
                <span style="min-width:100px;"><b>${m.name}</b></span>
                <input type="number" min="1" max="10" id="hard-${i}" placeholder="1-10"
                    style="width:70px;padding:5px 8px;border-radius:4px;border:1px solid #ccc;
                           font-size:14px;text-align:center;">
                <span id="hard-result-${i}"></span>
            </div>
        `;
    });

    html += `
        <button class="answer" onclick="checkHardness()" style="margin-top:12px;">✅ Проверить</button>
        <div id="hard-feedback"></div>
        </div>
    `;
    document.getElementById("game").innerHTML = html;
}

function checkHardness() {
    const scale = state.shuffledHardness;
    let correct = 0;

    scale.forEach((m, i) => {
        const input = document.getElementById("hard-" + i);
        const result = document.getElementById("hard-result-" + i);

        if (input && parseInt(input.value) === m.hardness) {
            correct++;
            result.innerHTML = "✅";
            input.style.borderColor = "#4caf50";
        } else if (input) {
            result.innerHTML = "❌ (" + m.hardness + ")";
            input.style.borderColor = "#f44336";
        }
    });

    const feedback = document.getElementById("hard-feedback");
    if (correct === scale.length) {
        feedback.innerHTML = `
            <div style="margin-top:12px;padding:12px;border-radius:8px;
                background:#e8f5e9;color:#2e7d32;font-weight:bold;border-left:4px solid #4caf50;">
                🎉 Идеально! +30 XP
            </div>`;
        addXP(30);
    } else {
        feedback.innerHTML = `
            <div style="margin-top:12px;padding:12px;border-radius:8px;
                background:#ffebee;color:#c62828;font-weight:bold;border-left:4px solid #f44336;">
                Правильно: ${correct} из ${scale.length}. Попробуйте ещё раз.
            </div>`;
    }
}

// === ЛАБОРАТОРИЯ ТВЁРДОСТИ ===
function startHardnessLab() {
    setActiveNav("nav-lab");

    state.currentLabMineral = labMinerals[Math.floor(Math.random() * labMinerals.length)];
    const mineral = state.currentLabMineral;

    let html = `
        <div class="card">
            <h2>🔬 Лаборатория твёрдости</h2>
            <p style="margin:10px 0;font-size:14px;color:#666;">
                Выберите инструмент и попробуйте поцарапать минерал или горную породу.
                <br>Царапина появится, если инструмент <b>твёрже</b> образца.
            </p>

            <div style="display:flex;gap:30px;align-items:center;flex-wrap:wrap;margin:15px 0;justify-content:center;">
                <!-- Минерал -->
                <div style="text-align:center;">
                    <div style="width:220px;height:220px;border-radius:15px;
                        border:3px solid #333;
                        background:#fff;
                        display:flex;flex-direction:column;
                        align-items:center;justify-content:center;
                        position:relative;overflow:hidden;">
                        <img src="${mineral.image}" 
                             alt="${mineral.name}"
                             style="width:100%;height:100%;object-fit:cover;border-radius:12px;"
                             onerror="this.style.display='none';this.parentElement.innerHTML='<span style=\\'font-size:48px;\\'>🪨</span><br><span style=\\'font-size:14px;color:#888;\\'>нет фото</span>';">
                        <div id="scratch-layer" style="position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;overflow:hidden;border-radius:12px;"></div>
                    </div>
                    <p style="margin-top:8px;font-size:18px;font-weight:bold;">${mineral.name}</p>
                    <p style="font-size:13px;color:#555;">Твёрдость: ${mineral.hardness}</p>
                </div>

                <!-- Инструменты -->
                <div style="display:flex;flex-direction:column;gap:8px;min-width:180px;">
                    <p style="font-weight:bold;margin-bottom:5px;">Инструменты:</p>
                    ${labTools.map((t, i) => `
                        <button class="answer lab-tool-btn"
                            style="width:auto;padding:10px 18px;display:inline-block;font-size:14px;"
                            onclick="useTool(${i})">
                            ${t.name} (твёрдость ${t.hardness})
                        </button>
                    `).join("")}
                </div>
            </div>

            <div id="lab-result" style="margin-top:15px;padding:15px;border-radius:8px;background:#f5f5f5;min-height:60px;">
                <p style="color:#777;">Нажмите на инструмент, чтобы проверить твёрдость</p>
            </div>

            <div style="display:flex;gap:10px;flex-wrap:wrap;margin-top:12px;">
                <button class="answer" style="width:auto;display:inline-block;padding:8px 20px;" onclick="startHardnessLab()">🔄 Другой образец</button>
            </div>
        </div>
    `;
    document.getElementById("game").innerHTML = html;
}

function useTool(toolIndex) {
    const tool = labTools[toolIndex];
    const mineral = state.currentLabMineral;

    const scratchLayer = document.getElementById("scratch-layer");
    const resultDiv = document.getElementById("lab-result");

    // Создаём царапину по центру
    const x = 70 + Math.random() * 80;
    const y = 70 + Math.random() * 80;
    const angle = Math.random() * 360;
    const length = 40 + Math.random() * 30;

    let willScratch = false;
    let resultText = '';

    if (tool.hardness > mineral.hardness) {
        willScratch = true;
        resultText = `
            ${tool.name} (твёрдость ${tool.hardness})
            оставил царапину на ${mineral.name} (твёрдость ${mineral.hardness})
            <br>✅ Инструмент твёрже образца.
        `;
    } else if (tool.hardness === mineral.hardness) {
        resultText = `
            ${tool.name} (твёрдость ${tool.hardness})
            на ${mineral.name} (твёрдость ${mineral.hardness})
            <br>➖ Твёрдость примерно равна — царапина едва заметна или её нет.
        `;
    } else {
        resultText = `
            ${tool.name} (твёрдость ${tool.hardness})
            на ${mineral.name} (твёрдость ${mineral.hardness})
            <br>❌ Царапины нет — образец твёрже инструмента.
        `;
    }

    if (willScratch) {
        const scratch = document.createElement("div");
        scratch.style.cssText = `
            position:absolute;
            left:${x}px;
            top:${y}px;
            width:${length}px;
            height:4px;
            background:#ffffff;
            border-bottom:3px solid #ffffff;
            transform:rotate(${angle}deg);
            border-radius:4px;
            box-shadow:0 0 12px rgba(255,255,255,0.9);
        `;
        scratchLayer.appendChild(scratch);
    }

    document.querySelectorAll('.lab-tool-btn').forEach(b => b.disabled = true);

    resultDiv.innerHTML = `
        <div style="padding:15px;border-radius:8px;border-left:5px solid ${willScratch ? '#4caf50' : '#f44336'};background:#f9f9f9;font-size:15px;line-height:1.8;">
            ${resultText.replace(/\n/g, '<br>')}
        </div>
    `;

    setTimeout(() => {
        const resetBtn = document.createElement("button");
        resetBtn.className = "answer";
        resetBtn.style.cssText = "width:auto;display:inline-block;padding:8px 16px;margin-top:10px;";
        resetBtn.textContent = "Попробовать ещё раз с этим образцом";
        resetBtn.onclick = function() {
            document.getElementById("scratch-layer").innerHTML = "";
            document.querySelectorAll('.lab-tool-btn').forEach(b => b.disabled = false);
            document.getElementById("lab-result").innerHTML = `<p style="color:#777;">Нажмите на инструмент, чтобы проверить твёрдость</p>`;
            this.remove();
        };
        resultDiv.appendChild(resetBtn);
    }, 500);
}

// === ИНИЦИАЛИЗАЦИЯ ===
// Восстанавливаем состояние при загрузке
updateStats();
