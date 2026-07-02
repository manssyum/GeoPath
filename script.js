// ===== ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ =====
let xp = 0;
let level = 1;
let unlockedAchievements = new Set();

// ===== ДОБАВЛЕНИЕ ОПЫТА И ПРОВЕРКА УРОВНЯ =====
function addXP(count) {
    xp += count;

    if (xp >= level * 50) {
        level++;
    }

    checkAchievements();
    document.getElementById("xp").innerText = xp;
    document.getElementById("level").innerText = level;
}

// ===== ПЕРЕМЕШИВАНИЕ МАССИВА =====
function shuffle(arr) {
    const a = arr.slice(); // копия, чтобы не менять оригинал
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}

// ===== ПРОВЕРКА ДОСТИЖЕНИЙ =====
function checkAchievements() {
    const achievements = [
        { name: "Начинающий геолог",   emoji: "🪨", xp: 50  },
        { name: "Полевой исследователь",emoji: "🔨", xp: 150 },
        { name: "Хранитель слоёв",     emoji: "📐", xp: 300 },
        { name: "Мастер земных недр",  emoji: "⛰️", xp: 500 }
    ];

    achievements.forEach(a => {
        if (xp >= a.xp && !unlockedAchievements.has(a.name)) {
            unlockedAchievements.add(a.name);
            alert("🏅 Достижение разблокировано: " + a.emoji + " " + a.name + "!");
        }
    });
}

// ===== ДОСТИЖЕНИЯ — экран отображения =====
function showAchievements() {
    const achievements = [
        { name: "Начинающий геолог",   emoji: "🪨", xp: 50  },
        { name: "Полевой исследователь",emoji: "🔨", xp: 150 },
        { name: "Хранитель слоёв",     emoji: "📐", xp: 300 },
        { name: "Мастер земных недр",  emoji: "⛰️", xp: 500 }
    ];

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

// ===== ТЕОРИЯ =====
function showTheory() {
    let html = `
        <div class="card">
            <h2>📚 Таблица твёрдости Мооса</h2>
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
            <h2>🏔️ Осадочные породы</h2>
            <ul>${theory.sedimentary.map(r => `<li style="margin:6px 0;">${r}</li>`).join("")}</ul>
        </div>

        <div class="card">
            <h2>🌋 Магматические породы</h2>
            <ul>${theory.magmatic.map(r => `<li style="margin:6px 0;">${r}</li>`).join("")}</ul>
        </div>

        <div class="card">
            <h2>🔮 Метаморфические породы</h2>
            <ul>${theory.metamorphic.map(r => `<li style="margin:6px 0;">${r}</li>`).join("")}</ul>
        </div>
    `;
    document.getElementById("game").innerHTML = html;
}

// ===== ВИКТОРИНА =====
function startQuiz() {
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

// ===== НАЙДИ ОШИБКУ =====
// ИСПРАВЛЕНО: убраны одинарные кавычки из onclick, чтобы не ломался
// если в тексте объяснения встретится апостроф.
// Теперь данные хранятся в window.currentErrorQuestion.
function startFindError() {
    const q = findError[Math.floor(Math.random() * findError.length)];
    window.currentErrorQuestion = q; // сохраняем весь объект

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
    const q = window.currentErrorQuestion;
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

// ===== НАЙДИ ЛИШНЕЕ =====
// ИСПРАВЛЕНО: объяснение тоже сохраняется через window, без onclick-строки
function startFindOdd() {
    const q = findOdd[Math.floor(Math.random() * findOdd.length)];
    window.currentOddQuestion = q;

    let html = `<div class="card"><h2>🧩 Найди лишнее</h2><p style="margin:10px 0;">Выберите лишнее слово:</p>`;
    q.items.forEach((item, i) => {
        html += `<button class="answer" onclick="checkOdd(this, ${i})">${item}</button>`;
    });
    html += `<div id="odd-explanation" style="margin-top:15px;padding:12px;border-radius:8px;display:none;"></div></div>`;
    document.getElementById("game").innerHTML = html;
}

function checkOdd(btn, user) {
    const q = window.currentOddQuestion;
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

// ===== СОРТИРОВКА =====
function startSort() {
    // Берём случайные 6 элементов из общего списка, чтобы не перегружать экран
    const picked = shuffle([...sorting]).slice(0, 6);
    window.sortData = picked;
    window.sortCorrect = 0;
    window.sortAnswered = 0;

    const classes = [...new Set(sorting.map(s => s.type))]; // уникальные типы

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
    // Блокируем все кнопки в этой строке
    const row = document.getElementById("sort-row-" + idx);
    row.querySelectorAll(".answer").forEach(b => b.disabled = true);

    const feedback = document.getElementById("sort-feedback-" + idx);
    window.sortAnswered++;

    if (realType === chosenType) {
        btn.classList.add("correct");
        feedback.innerHTML = "✅ Верно!";
        feedback.style.color = "#2e7d32";
        window.sortCorrect++;
        addXP(5);
    } else {
        btn.classList.add("wrong");
        // подсветим правильный вариант
        row.querySelectorAll(".answer").forEach(b => {
            if (b.textContent === realType) b.classList.add("correct");
        });
        feedback.innerHTML = "❌ Правильно: " + realType;
        feedback.style.color = "#c62828";
    }

    document.getElementById("sortScore").innerText = window.sortCorrect;

    // Когда ответили на все — предлагаем сыграть ещё
    if (window.sortAnswered === window.sortData.length) {
        setTimeout(() => {
            const retry = document.createElement("button");
            retry.className = "answer";
            retry.textContent = "🔄 Сыграть ещё раз";
            retry.onclick = startSort;
            document.querySelector(".card").appendChild(retry);
        }, 500);
    }
}

// ===== СООТНЕСЕНИЕ =====
// ИСПРАВЛЕНО: сохраняем shuffled-версию в window.matchData,
// чтобы проверка шла в том же порядке, что и строки на экране
function startMatch() {
    const shuffledData = shuffle([...matching]);
    window.matchData = shuffledData; // ← ИСПРАВЛЕНО (было: window.matchData = matching)

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
    const data = window.matchData;
    let correct = 0;

    data.forEach((m, i) => {
        const sel = document.getElementById("match-" + i);
        const result = document.getElementById("match-result-" + i);
        if (sel.value === m.use) {
            correct++;
            result.innerHTML = "✅";
        } else {
            result.innerHTML = "❌";
            // показываем правильный ответ прямо в select
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

// ===== ОПРЕДЕЛИ ПО ОПИСАНИЮ =====
function startImageQuiz() {
    const q = imageQuiz[Math.floor(Math.random() * imageQuiz.length)];
    const shuffledOptions = shuffle([...q.options]);
    const correctName = q.options[q.correct];

    let html = `
        <div class="card">
            <h2>🖼️ Определи по описанию</h2>
            <div style="background:#f5f5f5;border-radius:10px;padding:15px;margin:15px 0;font-size:15px;">
                ${q.desc}
            </div>
            <p style="font-size:14px;color:#666;margin-bottom:10px;">Какой это минерал?</p>
    `;
    shuffledOptions.forEach(o => {
        html += `<button class="answer" onclick="checkImageAnswer(this, '${o}', '${correctName}')">${o}</button>`;
    });
    html += `</div>`;
    document.getElementById("game").innerHTML = html;
}

function checkImageAnswer(btn, chosen, correctName) {
    const buttons = document.querySelectorAll(".answer");
    buttons.forEach(b => b.disabled = true);

    if (chosen === correctName) {
        btn.classList.add("correct");
        addXP(15);
    } else {
        btn.classList.add("wrong");
        buttons.forEach(b => {
            if (b.textContent === correctName) b.classList.add("correct");
        });
    }
    setTimeout(() => startImageQuiz(), 1800);
}

// ===== ШКАЛА ТВЁРДОСТИ =====
// ИСПРАВЛЕНО: теперь проверка идёт по тому же перемешанному массиву,
// который использовался при отрисовке (window.shuffledHardness)
function startHardnessTest() {
    window.shuffledHardness = shuffle([...hardnessScale]); // сохраняем перемешанный

    let html = `
        <div class="card">
            <h2>📏 Шкала твёрдости Мооса</h2>
            <p style="margin:10px 0;">Введите твёрдость (1–10) для каждого минерала:</p>
            <p style="font-size:13px;color:#666;margin-bottom:12px;">1 = самый мягкий, 10 = самый твёрдый</p>
    `;

    window.shuffledHardness.forEach((m, i) => {
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
    const scale = window.shuffledHardness; // ← ИСПРАВЛЕНО: используем тот же массив
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
