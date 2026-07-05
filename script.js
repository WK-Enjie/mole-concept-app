/* =========================================================
   MOLE MASTER PRO — script.js
   O Level Chemistry (6092) | Fully Optimised
   ========================================================= */

'use strict';

// ─── Constants ────────────────────────────────────────────
const CHEMICALS = [
    { name: "NaOH",     mr: 40    },
    { name: "H₂SO₄",   mr: 98    },
    { name: "CaCO₃",   mr: 100   },
    { name: "HCl",      mr: 36.5  },
    { name: "CO₂",      mr: 44    },
    { name: "MgO",      mr: 40.3  },
    { name: "H₂O",      mr: 18    },
    { name: "NH₃",      mr: 17    },
    { name: "Fe₂O₃",   mr: 159.7 },
    { name: "CuSO₄",   mr: 159.5 },
    { name: "NaCl",     mr: 58.5  },
    { name: "Zn",       mr: 65.4  },
    { name: "Pb(NO₃)₂",mr: 331.2 },
    { name: "KI",       mr: 166   },
    { name: "PbI₂",    mr: 461   },
    { name: "Mg",       mr: 24.3  },
    { name: "CaO",      mr: 56    },
    { name: "K₂CO₃",   mr: 138.2 },
    { name: "Na₂CO₃",  mr: 106   },
    { name: "FeSO₄",   mr: 152   },
];

const TOPIC_META = {
    mass:       { title: 'Moles & Mass',              icon: '⚖️',  desc: 'Calculate moles from mass and vice versa' },
    gas:        { title: 'Gas Volumes at RTP',         icon: '💨',  desc: 'Calculate gas volumes using 24 dm³/mol' },
    conc:       { title: 'Solution Concentration',     icon: '🧪',  desc: 'Calculate concentration in mol/dm³' },
    limit:      { title: 'Limiting Reactant',          icon: '⚗️',  desc: 'Identify limiting reactant and excess' },
    titration:  { title: 'Titration Calculations',     icon: '🔬',  desc: 'Neutralisation and acid-base titrations' },
    ions:       { title: 'Ions in Solution',           icon: '⚡',  desc: 'Calculate moles of ions from concentration' },
    yield:      { title: 'Percentage Yield',           icon: '📈',  desc: 'Calculate efficiency of reactions' },
    purity:     { title: 'Percentage Purity',          icon: '✨',  desc: 'Calculate purity of impure samples' },
    empirical:  { title: 'Empirical Formula',          icon: '🔣',  desc: 'Determine formulae from composition' },
    hydration:  { title: 'Water of Crystallisation',   icon: '💧',  desc: 'Calculate water molecules in hydrated salts' },
    reacting:   { title: 'Reacting Masses',            icon: '⚖️',  desc: 'Use balanced equations to calculate masses' },
    integrated: { title: 'Integrated Problems',        icon: '🧩',  desc: 'Multi-step problems combining concepts' },
};

const TOPIC_IDS = Object.keys(TOPIC_META);

const DIFFICULTY_TOPICS = {
    easy:   ['mass', 'gas', 'conc'],
    medium: ['limit', 'titration', 'ions', 'reacting'],
    hard:   ['yield', 'purity', 'empirical', 'hydration', 'integrated'],
};

// Points awarded per difficulty
const POINTS = { easy: 10, medium: 15, hard: 20 };

// ─── State ────────────────────────────────────────────────
const state = {
    score:          0,
    streak:         0,
    bestStreak:     0,
    totalQuestions: 0,
    correctAnswers: 0,
    wrongAnswers:   0,
    currentTopic:   null,
    currentMode:    null,   // 'random' | 'topic' | 'custom'
    currentQ:       null,
    qCount:         0,
    difficulty:     'easy',
    customQuizData: [],
    customQIndex:   0,
    toastTimer:     null,
};

// ─── DOM Helpers ──────────────────────────────────────────
const $  = id  => document.getElementById(id);
const $$ = sel => document.querySelectorAll(sel);

/** Safely set innerHTML; falls back gracefully */
function setHTML(id, html)  { const el = $(id); if (el) el.innerHTML = html; }
function setText(id, text)  { const el = $(id); if (el) el.textContent = text; }
function show(id)           { const el = $(id); if (el) el.classList.remove('hidden'); }
function hide(id)           { const el = $(id); if (el) el.classList.add('hidden'); }
function enable(id)         { const el = $(id); if (el) el.disabled = false; }
function disable(id)        { const el = $(id); if (el) el.disabled = true; }

// ─── Init ─────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    renderTopics();
    setupNavigation();
    setupControls();
    updateStats();
    updateDifficultyBadge();
});

// ─── Navigation ───────────────────────────────────────────
function setupNavigation() {
    $('nav-learn').onclick  = () => switchView('view-topics');
    $('nav-random').onclick = () => { switchView('view-random'); startRandomPractice(); };
    $('nav-quiz').onclick   = () => switchView('view-quiz');

    $('btn-exit').onclick        = () => switchView('view-topics');
    $('btn-exit-topic').onclick  = () => switchView('view-topics');
    $('btn-exit-quiz').onclick   = () => switchView('view-topics');
    $('btn-exit-custom').onclick = () => switchView('view-topics');

    $('btn-home').onclick  = () => switchView('view-topics');
    $('btn-retry').onclick = () => retryLastMode();
}

function switchView(viewId) {
    $$('.view').forEach(v => v.classList.add('hidden'));
    show(viewId);

    $$('.nav-btn').forEach(b => b.classList.remove('active'));
    const navMap = {
        'view-topics':      'nav-learn',
        'view-random':      'nav-random',
        'view-practice':    'nav-learn',
        'view-quiz':        'nav-quiz',
        'view-custom-quiz': 'nav-quiz',
        'view-results':     null,
    };
    const navId = navMap[viewId];
    if (navId) $(navId)?.classList.add('active');
}

// ─── Controls Setup ───────────────────────────────────────
function setupControls() {
    // Random mode
    $('btn-submit').onclick   = () => checkAnswer('random');
    $('btn-next').onclick     = () => nextRandomQuestion();
    $('btn-hint').onclick     = () => show('hint-box');

    // Topic mode
    $('btn-submit-topic').onclick = () => checkAnswer('topic');
    $('btn-next-topic').onclick   = () => nextTopicQuestion();
    $('btn-hint-topic').onclick   = () => show('hint-box-topic');

    // Custom quiz mode
    $('btn-submit-custom').onclick = () => checkAnswer('custom');
    $('btn-next-custom').onclick   = () => nextCustomQuestion();
    $('btn-hint-custom').onclick   = () => show('hint-box-custom');

    // Quiz loader
    $('btn-load-quiz').onclick  = loadCustomQuiz;
    $('btn-clear-quiz').onclick = clearQuizLoader;

    // Enter key support
    $('user-input').addEventListener('keydown',        e => { if (e.key === 'Enter') checkAnswer('random'); });
    $('user-input-topic').addEventListener('keydown',  e => { if (e.key === 'Enter') checkAnswer('topic'); });
    $('user-input-custom').addEventListener('keydown', e => { if (e.key === 'Enter') checkAnswer('custom'); });

    // File picker label update
    $('quiz-file').addEventListener('change', e => {
        const name = e.target.files[0]?.name ?? 'No file selected';
        setText('file-name', name);
        hide('quiz-status');
    });

    // Difficulty radio
    $$('input[name="difficulty"]').forEach(radio => {
        radio.addEventListener('change', e => {
            state.difficulty = e.target.value;
            updateDifficultyBadge();
        });
    });
}

// ─── Difficulty Badge ─────────────────────────────────────
function updateDifficultyBadge() {
    const badge = $('difficulty-badge');
    if (!badge) return;
    const d = state.difficulty;
    badge.textContent = d.charAt(0).toUpperCase() + d.slice(1);
    badge.className = `badge ${d}`;
}

// ─── Topics Grid ──────────────────────────────────────────
function renderTopics() {
    const grid = $('topics-grid');
    if (!grid) return;
    grid.innerHTML = TOPIC_IDS.map(id => {
        const m = TOPIC_META[id];
        return `
        <div class="topic-card" onclick="startPractice('${id}')"
             role="button" tabindex="0"
             onkeydown="if(event.key==='Enter'||event.key===' ')startPractice('${id}')">
            <span class="topic-icon">${m.icon}</span>
            <h3>${m.title}</h3>
            <p>${m.desc}</p>
        </div>`;
    }).join('');
}

// ─── Stats ────────────────────────────────────────────────
function updateStats() {
    const accuracy = state.totalQuestions > 0
        ? Math.round((state.correctAnswers / state.totalQuestions) * 100)
        : 0;

    animateStat('score',    state.score);
    animateStat('streak',   state.streak);
    setText('accuracy', `${accuracy}%`);
}

function animateStat(id, value) {
    const el = $(id);
    if (!el) return;
    el.textContent = value;
    const pill = el.closest('.stat-pill');
    if (pill) {
        pill.classList.remove('updated');
        void pill.offsetWidth; // reflow
        pill.classList.add('updated');
    }
}

// ─── Toast ────────────────────────────────────────────────
function showToast(msg, type = '', duration = 3000) {
    const toast = $('toast');
    if (!toast) return;
    clearTimeout(state.toastTimer);
    toast.textContent = msg;
    toast.className = `toast ${type}`.trim();
    toast.classList.remove('hidden');
    state.toastTimer = setTimeout(() => toast.classList.add('hidden'), duration);
}

// ─── Generic Question Renderer ────────────────────────────
/**
 * suffix: 'random' | 'topic' | 'custom'
 * idMap provides element IDs for that mode.
 */
const MODE_IDS = {
    random: {
        count:    'q-count',
        qText:    'q-text',
        unit:     'unit-label',
        hintText: 'hint-text',
        solCont:  'solution-content',
        mistake:  'common-mistake',
        input:    'user-input',
        feedback: 'feedback',
        hintBox:  'hint-box',
        solBox:   'solution-box',
        submit:   'btn-submit',
        next:     'btn-next',
    },
    topic: {
        count:    'q-count-topic',
        qText:    'q-text-topic',
        unit:     'unit-label-topic',
        hintText: 'hint-text-topic',
        solCont:  'solution-content-topic',
        mistake:  'common-mistake-topic',
        input:    'user-input-topic',
        feedback: 'feedback-topic',
        hintBox:  'hint-box-topic',
        solBox:   'solution-box-topic',
        submit:   'btn-submit-topic',
        next:     'btn-next-topic',
    },
    custom: {
        count:    'q-count-custom',
        qText:    'q-text-custom',
        unit:     'unit-label-custom',
        hintText: 'hint-text-custom',
        solCont:  'solution-content-custom',
        mistake:  'common-mistake-custom',
        input:    'user-input-custom',
        feedback: 'feedback-custom',
        hintBox:  'hint-box-custom',
        solBox:   'solution-box-custom',
        submit:   'btn-submit-custom',
        next:     'btn-next-custom',
    },
};

function renderQuestion(mode, q) {
    const ids = MODE_IDS[mode];
    state.qCount++;
    state.totalQuestions++;

    setText(ids.count, state.qCount);
    setHTML(ids.qText, q.text);
    setText(ids.unit, q.unit || '');
    setText(ids.hintText, q.hint || '');

    // Solution — wrap in a div with class for styling
    setHTML(ids.solCont, `<div class="solution-steps">${q.solution || ''}</div>`);

    // Common mistake
    const mistakeEl = $(ids.mistake);
    if (mistakeEl) {
        if (q.commonMistake) {
            mistakeEl.textContent = q.commonMistake;
            mistakeEl.classList.remove('hidden');
        } else {
            mistakeEl.classList.add('hidden');
        }
    }

    // Reset input
    const input = $(ids.input);
    if (input) {
        input.value = '';
        input.disabled = false;
        setTimeout(() => input.focus(), 50);
    }

    // Reset UI elements
    const fb = $(ids.feedback);
    if (fb) { fb.classList.add('hidden'); fb.className = 'feedback hidden'; }
    hide(ids.hintBox);
    hide(ids.solBox);
    enable(ids.submit);
    disable(ids.next);
}

// ─── Random Practice ──────────────────────────────────────
function startRandomPractice() {
    state.currentMode = 'random';
    state.qCount = 0;
    updateDifficultyBadge();
    nextRandomQuestion();
}

function nextRandomQuestion() {
    const availableTopics = DIFFICULTY_TOPICS[state.difficulty] || DIFFICULTY_TOPICS.easy;
    const topic = choice(availableTopics);
    const q = generateQuestion(topic, state.difficulty);
    state.currentQ = q;
    renderQuestion('random', q);
}

// ─── Topic Practice ───────────────────────────────────────
function startPractice(topicId) {
    if (!TOPIC_META[topicId]) return;
    state.currentTopic = topicId;
    state.currentMode  = 'topic';
    state.qCount = 0;
    switchView('view-practice');

    const meta = TOPIC_META[topicId];
    setText('topic-title', `${meta.icon} ${meta.title}`);
    nextTopicQuestion();
}

function nextTopicQuestion() {
    const q = generateQuestion(state.currentTopic);
    state.currentQ = q;
    renderQuestion('topic', q);
}

// ─── Custom Quiz ──────────────────────────────────────────
function loadCustomQuiz() {
    const fileInput = $('quiz-file');
    const file = fileInput?.files[0];

    if (!file) {
        showQuizStatus('Please select a JSON file first!', 'error');
        return;
    }

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const data = JSON.parse(e.target.result);

            if (!Array.isArray(data) || data.length === 0) {
                showQuizStatus('JSON must be a non-empty array of question objects.', 'error');
                return;
            }

            // Validate each question object
            const required = ['text', 'answer', 'unit', 'hint', 'solution'];
            const invalid = data.findIndex(q =>
                required.some(k => q[k] === undefined || q[k] === null)
            );

            if (invalid !== -1) {
                showQuizStatus(
                    `Question ${invalid + 1} is missing required fields: ${required.join(', ')}`,
                    'error'
                );
                return;
            }

            state.customQuizData = data;
            state.customQIndex   = 0;

            showQuizStatus(`✅ Loaded ${data.length} question${data.length > 1 ? 's' : ''} successfully!`, 'success');

            // Auto-start after short delay
            setTimeout(() => startCustomQuiz(), 800);

        } catch {
            showQuizStatus('Invalid JSON format. Please check the file for syntax errors.', 'error');
        }
    };

    reader.onerror = () => showQuizStatus('Failed to read file. Please try again.', 'error');
    reader.readAsText(file);
}

function showQuizStatus(msg, type) {
    const el = $('quiz-status');
    if (!el) return;
    el.textContent = msg;
    el.className = `quiz-status ${type}`;
    el.classList.remove('hidden');
}

function clearQuizLoader() {
    const fileInput = $('quiz-file');
    if (fileInput) fileInput.value = '';
    setText('file-name', 'No file selected');
    hide('quiz-status');
    state.customQuizData = [];
    state.customQIndex   = 0;
}

function startCustomQuiz() {
    if (!state.customQuizData.length) return;
    state.currentMode = 'custom';
    state.qCount = 0;
    state.customQIndex = 0;
    setText('custom-quiz-title', '📁 Custom Quiz');
    setText('q-total-custom', state.customQuizData.length);
    switchView('view-custom-quiz');
    nextCustomQuestion();
}

function nextCustomQuestion() {
    const data = state.customQuizData;
    if (!data.length) return;

    if (state.customQIndex >= data.length) {
        showResults();
        return;
    }

    const q = data[state.customQIndex];
    state.currentQ = q;
    state.customQIndex++;
    renderQuestion('custom', q);
    setText('q-count-custom', state.customQIndex);
    setText('q-total-custom', data.length);
}

// ─── Answer Checking ──────────────────────────────────────
function checkAnswer(mode) {
    const ids = MODE_IDS[mode];
    const input = $(ids.input);
    if (!input) return;

    const val = parseFloat(input.value);
    if (isNaN(val)) {
        showToast('⚠️ Please enter a valid number.', 'error', 2500);
        input.focus();
        return;
    }

    const q = state.currentQ;
    if (!q) return;

    const correct   = parseFloat(q.answer);
    const tolerance = Math.max(Math.abs(correct * 0.02), 0.001); // 2% tolerance, min 0.001
    const isCorrect = Math.abs(val - correct) <= tolerance;

    const fb = $(ids.feedback);
    if (fb) {
        fb.classList.remove('hidden', 'correct', 'wrong');
        void fb.offsetWidth; // reflow for animation restart
    }

    if (isCorrect) {
        state.correctAnswers++;
        const pts = (POINTS[state.difficulty] ?? 10) + state.streak;
        state.score  += pts;
        state.streak++;
        if (state.streak > state.bestStreak) state.bestStreak = state.streak;

        if (fb) {
            fb.textContent = `✅ Correct! +${pts} pts`;
            fb.classList.add('correct');
        }

        if (state.streak > 1) {
            showToast(`🔥 ${state.streak} in a row! Keep going!`, 'streak');
        }
    } else {
        state.wrongAnswers++;
        state.streak = 0;

        const displayAnswer = Number.isInteger(correct)
            ? correct.toString()
            : correct.toPrecision(4);

        if (fb) {
            fb.innerHTML = `❌ Incorrect. Answer: <b>${displayAnswer} ${q.unit || ''}</b>`;
            fb.classList.add('wrong');
        }
    }

    updateStats();

    // Show solution
    show(ids.solBox);
    input.disabled = true;
    disable(ids.submit);
    enable(ids.next);
    $(ids.next)?.focus();
}

// ─── Results Screen ───────────────────────────────────────
function showResults() {
    const accuracy = state.totalQuestions > 0
        ? Math.round((state.correctAnswers / state.totalQuestions) * 100)
        : 0;

    setText('result-score',    state.score);
    setText('result-correct',  state.correctAnswers);
    setText('result-wrong',    state.wrongAnswers);
    setText('result-accuracy', `${accuracy}%`);
    setText('result-streak',   state.bestStreak);

    // Performance message
    let msg = '';
    if (accuracy >= 90)      msg = '🏆 Outstanding! You have mastered these concepts. Excellent exam preparation!';
    else if (accuracy >= 75) msg = '🎯 Great work! A few more practice sessions and you\'ll be ready for your exam.';
    else if (accuracy >= 50) msg = '📚 Good effort! Review the solutions carefully and try again.';
    else                     msg = '💪 Keep practising! Chemistry takes time — review your notes and try again.';

    setText('result-message', msg);
    switchView('view-results');
}

function retryLastMode() {
    // Reset session stats
    state.score          = 0;
    state.streak         = 0;
    state.bestStreak     = 0;
    state.totalQuestions = 0;
    state.correctAnswers = 0;
    state.wrongAnswers   = 0;
    updateStats();

    switch (state.currentMode) {
        case 'random': switchView('view-random'); startRandomPractice(); break;
        case 'topic':  startPractice(state.currentTopic); break;
        case 'custom': startCustomQuiz(); break;
        default:       switchView('view-topics');
    }
}

// ─── Utility ──────────────────────────────────────────────
/** Random float between min and max, rounded to dec decimal places */
const r       = (min, max, dec = 0) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));
/** Random integer between min and max (inclusive) */
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
/** Random element from array */
const choice  = arr => arr[Math.floor(Math.random() * arr.length)];

// ─── Question Generator ───────────────────────────────────
function generateRandomQuestion(difficulty) {
    const topics = DIFFICULTY_TOPICS[difficulty] || DIFFICULTY_TOPICS.easy;
    return generateQuestion(choice(topics), difficulty);
}

function generateQuestion(topic, difficulty = 'easy') {
    const chem = choice(CHEMICALS);

    switch (topic) {

        // ════════════════════════════════════════
        //  EASY TOPICS
        // ════════════════════════════════════════

        case 'mass': {
            const variant = randInt(1, 3);

            if (variant === 1) {
                // Mass → Moles
                const m   = r(10, 100, 1);
                const ans = m / chem.mr;
                return {
                    text: `Calculate the number of moles in <b>${m} g</b> of <b>${chem.name}</b>.<br>(M<sub>r</sub> = ${chem.mr})`,
                    answer: ans,
                    unit: 'mol',
                    hint: 'Formula: n = m ÷ Mᵣ',
                    solution: `n = m ÷ Mᵣ<br>n = ${m} ÷ ${chem.mr}<br><b>n = ${ans.toFixed(3)} mol</b>`,
                    commonMistake: 'Students often multiply instead of dividing. Remember: moles = mass ÷ Mᵣ.',
                };
            }

            if (variant === 2) {
                // Moles → Mass
                const n   = r(0.5, 5, 2);
                const ans = n * chem.mr;
                return {
                    text: `What is the mass of <b>${n} mol</b> of <b>${chem.name}</b>?<br>(M<sub>r</sub> = ${chem.mr})`,
                    answer: ans,
                    unit: 'g',
                    hint: 'Rearrange: m = n × Mᵣ',
                    solution: `m = n × Mᵣ<br>m = ${n} × ${chem.mr}<br><b>m = ${ans.toFixed(2)} g</b>`,
                    commonMistake: 'Check you are using the correct Mᵣ — look up the formula carefully.',
                };
            }

            // Particles → Moles
            const n2   = r(0.5, 5, 1);
            const part = (n2 * 6.02).toFixed(2);
            return {
                text: `A sample contains <b>${part} × 10²³</b> particles. How many moles is this?`,
                answer: n2,
                unit: 'mol',
                hint: 'Divide the number of particles by the Avogadro constant (6.02 × 10²³ mol⁻¹)',
                solution: `n = particles ÷ Lₐ<br>n = (${part} × 10²³) ÷ (6.02 × 10²³)<br><b>n = ${n2} mol</b>`,
                commonMistake: 'The Avogadro constant is 6.02 × 10²³ mol⁻¹ — do not forget the ×10²³ part.',
            };
        }

        case 'gas': {
            if (randInt(1, 2) === 1) {
                // Volume → Moles
                const v   = r(12, 120, 1);
                const ans = v / 24;
                return {
                    text: `A gas occupies <b>${v} dm³</b> at room temperature and pressure (RTP).<br>Calculate the number of moles of gas.`,
                    answer: ans,
                    unit: 'mol',
                    hint: 'At RTP, 1 mole of any gas occupies 24 dm³. So n = V ÷ 24.',
                    solution: `n = V ÷ 24 (molar volume at RTP)<br>n = ${v} ÷ 24<br><b>n = ${ans.toFixed(3)} mol</b>`,
                    commonMistake: 'This applies at RTP (24 dm³/mol). At STP the molar volume is 22.4 dm³/mol.',
                };
            }

            // Mass → Volume
            const gases = [
                { n: 'CO₂', mr: 44  },
                { n: 'O₂',  mr: 32  },
                { n: 'N₂',  mr: 28  },
                { n: 'SO₂', mr: 64  },
                { n: 'Cl₂', mr: 71  },
                { n: 'CH₄', mr: 16  },
            ];
            const gas  = choice(gases);
            const m2   = r(10, 100, 0);
            const mol  = m2 / gas.mr;
            const ans2 = mol * 24;
            return {
                text: `Calculate the volume occupied by <b>${m2} g</b> of <b>${gas.n}</b> at RTP.<br>(M<sub>r</sub> = ${gas.mr})`,
                answer: ans2,
                unit: 'dm³',
                hint: 'Step 1: moles = mass ÷ Mᵣ   Step 2: volume = moles × 24',
                solution: `Step 1: n = ${m2} ÷ ${gas.mr} = ${mol.toFixed(3)} mol<br>Step 2: V = n × 24 = ${mol.toFixed(3)} × 24<br><b>V = ${ans2.toFixed(2)} dm³</b>`,
                commonMistake: 'Always convert mass to moles first. Never multiply mass directly by 24.',
            };
        }

        case 'conc': {
            const variant = randInt(1, 3);

            if (variant === 1) {
                // Moles from concentration + volume
                const c   = r(0.1, 2.0, 2);
                const v2  = randInt(50, 500);
                const ans = c * (v2 / 1000);
                return {
                    text: `Calculate the number of moles of solute in <b>${v2} cm³</b> of a <b>${c} mol/dm³</b> solution of ${chem.name}.`,
                    answer: ans,
                    unit: 'mol',
                    hint: 'Convert cm³ → dm³ first (÷ 1000), then use n = c × V',
                    solution: `V = ${v2} ÷ 1000 = ${(v2/1000).toFixed(3)} dm³<br>n = c × V = ${c} × ${(v2/1000).toFixed(3)}<br><b>n = ${ans.toFixed(4)} mol</b>`,
                    commonMistake: 'Forgetting to convert cm³ to dm³ is the most common error. 1 dm³ = 1000 cm³.',
                };
            }

            if (variant === 2) {
                // Concentration from moles + volume
                const n  = r(0.05, 1.0, 3);
                const v2 = randInt(100, 500);
                const ans = n / (v2 / 1000);
                return {
                    text: `<b>${n.toFixed(3)} mol</b> of ${chem.name} is dissolved to make <b>${v2} cm³</b> of solution.<br>Calculate the concentration in mol/dm³.`,
                    answer: ans,
                    unit: 'mol/dm³',
                    hint: 'c = n ÷ V (volume in dm³)',
                    solution: `V = ${v2} ÷ 1000 = ${(v2/1000).toFixed(3)} dm³<br>c = n ÷ V = ${n.toFixed(3)} ÷ ${(v2/1000).toFixed(3)}<br><b>c = ${ans.toFixed(3)} mol/dm³</b>`,
                    commonMistake: 'Dividing by cm³ instead of dm³ gives an answer 1000× too small.',
                };
            }

            // Mass → concentration
            const m2  = r(1, 20, 1);
            const v2  = randInt(100, 1000);
            const mol = m2 / chem.mr;
            const ans = mol / (v2 / 1000);
            return {
                text: `<b>${m2} g</b> of <b>${chem.name}</b> (M<sub>r</sub> = ${chem.mr}) is dissolved to make <b>${v2} cm³</b> of solution.<br>Calculate the concentration.`,
                answer: ans,
                unit: 'mol/dm³',
                hint: 'Step 1: n = m ÷ Mᵣ   Step 2: c = n ÷ V(dm³)',
                solution: `Step 1: n = ${m2} ÷ ${chem.mr} = ${mol.toFixed(3)} mol<br>Step 2: V = ${v2/1000} dm³<br>c = ${mol.toFixed(3)} ÷ ${v2/1000}<br><b>c = ${ans.toFixed(3)} mol/dm³</b>`,
                commonMistake: 'Two-step problem: mass → moles first, THEN calculate concentration.',
            };
        }

        // ════════════════════════════════════════
        //  MEDIUM TOPICS
        // ════════════════════════════════════════

        case 'limit': {
            // Use 2H₂ + O₂ → 2H₂O  with clean numbers
            const h2 = r(2, 10, 1);
            const o2 = r(1, 8,  1);
            // O₂ needed for all H₂ to react
            const neededO2 = h2 / 2;

            let limiting, excessReagent, excessMol;

            if (o2 >= neededO2) {
                // H₂ is limiting
                limiting       = 'H₂';
                excessReagent  = 'O₂';
                excessMol      = parseFloat((o2 - neededO2).toFixed(3));
            } else {
                // O₂ is limiting
                limiting       = 'O₂';
                excessReagent  = 'H₂';
                const neededH2 = o2 * 2;
                excessMol      = parseFloat((h2 - neededH2).toFixed(3));
            }

            excessMol = Math.max(0, excessMol);

            return {
                text: `<b>2H₂ + O₂ → 2H₂O</b><br><br>
                       <b>${h2} mol</b> of H₂ is mixed with <b>${o2} mol</b> of O₂ and ignited.<br><br>
                       (a) State the limiting reactant.<br>
                       (b) Calculate the moles of <b>excess reactant</b> remaining after complete reaction.`,
                answer: excessMol,
                unit: 'mol',
                hint: `Mole ratio H₂ : O₂ = 2 : 1. 
                       For ${h2} mol H₂ you need ${neededO2.toFixed(2)} mol O₂. 
                       Compare to what is available.`,
                solution: `Ratio H₂ : O₂ = 2 : 1<br>
                           O₂ required for ${h2} mol H₂ = ${h2} ÷ 2 = ${neededO2.toFixed(2)} mol<br>
                           O₂ available = ${o2} mol<br>
                           Limiting reactant = <b>${limiting}</b><br>
                           Excess ${excessReagent} = ${excessMol.toFixed(3)} mol<br>
                           <b>Answer = ${excessMol.toFixed(3)} mol</b>`,
                commonMistake: 'Always identify the limiting reactant BEFORE calculating excess. Never guess — show the comparison.',
            };
        }

        case 'titration': {
            // Support 1:1 and 1:2 acid:base ratios
            const reactions = [
                {
                    acid: 'HCl',   base: 'NaOH',
                    eq: 'HCl + NaOH → NaCl + H₂O',
                    ratio: 1,
                    acidName: 'hydrochloric acid', baseName: 'sodium hydroxide',
                },
                {
                    acid: 'H₂SO₄', base: 'NaOH',
                    eq: 'H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O',
                    ratio: 2,   // 1 mol acid : 2 mol base
                    acidName: 'sulfuric acid', baseName: 'sodium hydroxide',
                },
                {
                    acid: 'HCl', base: 'Na₂CO₃',
                    eq: '2HCl + Na₂CO₃ → 2NaCl + H₂O + CO₂',
                    ratio: 0.5, // 2 mol acid : 1 mol base → acid:base = 2:1, base = acid/2
                    acidName: 'hydrochloric acid', baseName: 'sodium carbonate',
                },
            ];
            const rxn = choice(reactions);
            const c1  = r(0.1, 1.0, 2);
            const v1  = r(20, 50, 1);
            const v2  = r(20, 50, 1);

            const molAcid = c1 * (v1 / 1000);
            const molBase = molAcid * rxn.ratio;
            const c2      = molBase / (v2 / 1000);

            return {
                text: `In a titration, <b>${v1} cm³</b> of <b>${c1} mol/dm³</b> ${rxn.acidName} 
                       exactly neutralises <b>${v2} cm³</b> of ${rxn.baseName} solution.<br><br>
                       <b>${rxn.eq}</b><br><br>
                       Calculate the concentration of the ${rxn.baseName} solution.`,
                answer: c2,
                unit: 'mol/dm³',
                hint: `Step 1: moles of ${rxn.acid} = c × V(dm³)
                       Step 2: use the mole ratio from the equation
                       Step 3: c(${rxn.base}) = n ÷ V(dm³)`,
                solution: `n(${rxn.acid}) = ${c1} × (${v1}/1000) = ${molAcid.toFixed(4)} mol<br>
                           Mole ratio ${rxn.acid}:${rxn.base} from equation<br>
                           n(${rxn.base}) = ${molAcid.toFixed(4)} × ${rxn.ratio} = ${molBase.toFixed(4)} mol<br>
                           c(${rxn.base}) = ${molBase.toFixed(4)} ÷ (${v2}/1000)<br>
                           <b>c = ${c2.toFixed(3)} mol/dm³</b>`,
                commonMistake: 'Using c₁V₁ = c₂V₂ blindly ignores the mole ratio. Always check the balanced equation first!',
            };
        }

        case 'ions': {
            const salts = [
                { f: 'MgCl₂',   ion: 'Cl⁻',  n: 2, ionName: 'chloride'  },
                { f: 'AlCl₃',   ion: 'Cl⁻',  n: 3, ionName: 'chloride'  },
                { f: 'Na₂SO₄',  ion: 'Na⁺',  n: 2, ionName: 'sodium'    },
                { f: 'CaCl₂',   ion: 'Cl⁻',  n: 2, ionName: 'chloride'  },
                { f: 'FeCl₃',   ion: 'Cl⁻',  n: 3, ionName: 'chloride'  },
                { f: 'K₂SO₄',   ion: 'K⁺',   n: 2, ionName: 'potassium' },
                { f: 'Al₂(SO₄)₃', ion: 'SO₄²⁻', n: 3, ionName: 'sulfate' },
            ];
            const salt   = choice(salts);
            const vol    = randInt(100, 500);
            const conc2  = r(0.1, 2.0, 2);
            const molSalt = conc2 * (vol / 1000);
            const ans    = molSalt * salt.n;

            return {
                text: `Calculate the moles of <b>${salt.ionName} ions (${salt.ion})</b> in 
                       <b>${vol} cm³</b> of <b>${conc2} mol/dm³</b> ${salt.f} solution.`,
                answer: ans,
                unit: 'mol',
                hint: `Step 1: n(${salt.f}) = c × V(dm³)   Step 2: multiply by ions per formula unit`,
                solution: `n(${salt.f}) = ${conc2} × (${vol}/1000) = ${molSalt.toFixed(4)} mol<br>
                           ${salt.f} → ${salt.n} ${salt.ion} per formula unit<br>
                           n(${salt.ion}) = ${molSalt.toFixed(4)} × ${salt.n}<br>
                           <b>n = ${ans.toFixed(4)} mol</b>`,
                commonMistake: `Don't forget to multiply by ${salt.n} — each formula unit of ${salt.f} releases ${salt.n} ${salt.ion} ions.`,
            };
        }

        case 'reacting': {
            // Variety of reacting mass reactions
            const reactions = [
                {
                    eq:  '2Mg + O₂ → 2MgO',
                    rA:  { name: 'Mg',  mr: 24.3 }, rAMol: 1,
                    pB:  { name: 'MgO', mr: 40.3 }, pBMol: 1,
                    context: 'A student burns magnesium ribbon in excess oxygen.',
                    question: 'Calculate the maximum mass of magnesium oxide produced.',
                    notes: '(Ar: Mg = 24.3, O = 16)',
                },
                {
                    eq:  'CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂',
                    rA:  { name: 'CaCO₃', mr: 100 }, rAMol: 1,
                    pB:  { name: 'CO₂',   mr: 44  }, pBMol: 1,
                    context: 'Excess hydrochloric acid is added to calcium carbonate.',
                    question: 'Calculate the maximum mass of CO₂ produced.',
                    notes: '(Mr: CaCO₃ = 100, CO₂ = 44)',
                },
                {
                    eq:  '2Fe + 3Cl₂ → 2FeCl₃',
                    rA:  { name: 'Fe',    mr: 55.8 }, rAMol: 1,
                    pB:  { name: 'FeCl₃', mr: 162.2 }, pBMol: 1,
                    context: 'Iron reacts with excess chlorine gas.',
                    question: 'Calculate the maximum mass of iron(III) chloride produced.',
                    notes: '(Ar: Fe = 55.8, Cl = 35.5)',
                },
            ];
            const rxn    = choice(reactions);
            const massA  = r(5, 50, 1);
            const molA   = massA / rxn.rA.mr;
            const molB   = molA * (rxn.pBMol / rxn.rAMol);
            const ans    = molB * rxn.pB.mr;

            return {
                text: `<b>${rxn.eq}</b><br><br>${rxn.context}<br>
                       Starting with <b>${massA} g</b> of <b>${rxn.rA.name}</b>.<br>
                       ${rxn.question}<br>${rxn.notes}`,
                answer: ans,
                unit: 'g',
                hint: 'Use the mole method: Mass(A) → Moles(A) → Moles(B) using ratio → Mass(B)',
                solution: `Step 1: n(${rxn.rA.name}) = ${massA} ÷ ${rxn.rA.mr} = ${molA.toFixed(3)} mol<br>
                           Step 2: Ratio ${rxn.rA.name} : ${rxn.pB.name} = ${rxn.rAMol} : ${rxn.pBMol}<br>
                           Step 3: n(${rxn.pB.name}) = ${molA.toFixed(3)} × (${rxn.pBMol}/${rxn.rAMol}) = ${molB.toFixed(3)} mol<br>
                           Step 4: m(${rxn.pB.name}) = ${molB.toFixed(3)} × ${rxn.pB.mr}<br>
                           <b>m = ${ans.toFixed(2)} g</b>`,
                commonMistake: 'Show the mole ratio step explicitly — examiners expect to see it even when the ratio is 1:1.',
            };
        }

        // ════════════════════════════════════════
        //  HARD TOPICS
        // ════════════════════════════════════════

        case 'yield': {
            // Realistic reaction context
            const contexts = [
                { product: 'copper(II) sulfate crystals', formula: 'CuSO₄·5H₂O' },
                { product: 'aspirin',                     formula: 'C₉H₈O₄'     },
                { product: 'calcium carbonate precipitate', formula: 'CaCO₃'    },
                { product: 'iron(III) oxide',             formula: 'Fe₂O₃'      },
            ];
            const ctx  = choice(contexts);
            const theo = r(20, 100, 1);
            const pct  = r(55, 97, 1);
            const act  = parseFloat((theo * pct / 100).toFixed(1));
            const ans  = (act / theo) * 100;

            return {
                text: `A student prepared <b>${ctx.product}</b> (${ctx.formula}).<br>
                       The theoretical yield was <b>${theo} g</b>.<br>
                       After purification, <b>${act} g</b> of product was obtained.<br><br>
                       Calculate the percentage yield.`,
                answer: ans,
                unit: '%',
                hint: '% yield = (actual yield ÷ theoretical yield) × 100',
                solution: `% yield = (actual ÷ theoretical) × 100<br>
                           = (${act} ÷ ${theo}) × 100<br>
                           <b>= ${ans.toFixed(1)}%</b>`,
                commonMistake: 'Dividing theoretical by actual gives a result >100%, which is impossible. Actual yield always goes on top.',
            };
        }

        case 'purity': {
            const sampleMass = r(10, 60, 1);
            const purity     = r(70, 98, 1);
            const pureMass   = sampleMass * (purity / 100);
            const mol        = pureMass / chem.mr;

            return {
                text: `A <b>${sampleMass} g</b> sample of impure <b>${chem.name}</b> 
                       is <b>${purity}%</b> pure by mass. The impurities are inert.<br>
                       (M<sub>r</sub> = ${chem.mr})<br><br>
                       Calculate the moles of pure <b>${chem.name}</b> in the sample.`,
                answer: mol,
                unit: 'mol',
                hint: 'Step 1: mass of pure compound = sample mass × (purity% ÷ 100)   Step 2: n = m ÷ Mᵣ',
                solution: `Step 1: m(pure) = ${sampleMass} × ${purity}/100 = ${pureMass.toFixed(2)} g<br>
                           Step 2: n = ${pureMass.toFixed(2)} ÷ ${chem.mr}<br>
                           <b>n = ${mol.toFixed(4)} mol</b>`,
                commonMistake: 'Using the total impure sample mass in the mole calculation gives an answer that is too large.',
            };
        }

        case 'empirical': {
            // Wider variety of empirical/molecular formula problems
            const compounds = [
                // { elements, ratios, empirical, molecular multiplier }
                { e: ['C','H'],   r: [1,2],  ef: 'CH₂',   mf: 'C₃H₆',  mfMass: 42,  mr: [12,1]  },
                { e: ['C','H'],   r: [1,4],  ef: 'CH₄',   mf: 'CH₄',   mfMass: 16,  mr: [12,1]  },
                { e: ['C','H','O'], r:[1,2,1], ef:'CH₂O', mf:'C₂H₄O₂', mfMass: 60,  mr: [12,1,16]},
                { e: ['Na','O','H'], r:[1,1,1],ef:'NaOH', mf:'NaOH',   mfMass: 40,  mr: [23,16,1]},
                { e: ['Fe','O'],  r: [2,3],  ef: 'Fe₂O₃', mf:'Fe₂O₃', mfMass: 160, mr: [55.8,16]},
            ];
            const cpd    = choice(compounds);
            const efMass = cpd.e.reduce((s, _, i) => s + cpd.mr[i] * cpd.r[i], 0);
            const mult   = Math.round(cpd.mfMass / efMass);

            // Build % composition string
            const pcts = cpd.e.map((el, i) => {
                const p = ((cpd.mr[i] * cpd.r[i]) / efMass * 100).toFixed(1);
                return `${el}: ${p}%`;
            });

            return {
                text: `A compound has the following percentage composition by mass:<br>
                       <b>${pcts.join('&nbsp;&nbsp;&nbsp;')}</b><br><br>
                       (a) Determine the empirical formula.<br>
                       (b) Given that the molar mass is <b>${cpd.mfMass} g/mol</b>, find the molecular formula.<br><br>
                       Enter the molar mass of the molecular formula (${cpd.mfMass}).`,
                answer: cpd.mfMass,
                unit: 'g/mol',
                hint: 'Assume 100 g → find moles of each element → divide by smallest → get ratio',
                solution: `Assume 100 g sample:<br>
                           ${cpd.e.map((el,i) => `n(${el}) = ${((cpd.mr[i]*cpd.r[i])/efMass*100).toFixed(1)} ÷ ${cpd.mr[i]} = ${cpd.r[i]} mol`).join('<br>')}<br>
                           Ratio: ${cpd.e.map((el,i)=>`${el}:${cpd.r[i]}`).join(' = ')}<br>
                           Empirical formula = <b>${cpd.ef}</b> (mass = ${efMass})<br>
                           Multiplier = ${cpd.mfMass} ÷ ${efMass} = ${mult}<br>
                           <b>Molecular formula = ${cpd.mf}</b>`,
                commonMistake: 'Always check whether the empirical formula IS the molecular formula. Only scale up if the molar mass is larger.',
            };
        }

        case 'hydration': {
            // Extended range of hydrated salts for variety
            const salts = [
                { name: 'CuSO₄',   mr: 159.5, salt: 'copper(II) sulfate',    xTrue: choice([3,5])   },
                { name: 'MgSO₄',   mr: 120.4, salt: 'magnesium sulfate',      xTrue: choice([1,7])   },
                { name: 'Na₂SO₄',  mr: 142.1, salt: 'sodium sulfate',         xTrue: 10              },
                { name: 'Na₂CO₃',  mr: 106,   salt: 'sodium carbonate',       xTrue: 10              },
                { name: 'CoCl₂',   mr: 129.8, salt: 'cobalt(II) chloride',    xTrue: choice([2,6])   },
                { name: 'FeSO₄',   mr: 151.9, salt: 'iron(II) sulfate',       xTrue: 7               },
            ];
            const salt      = choice(salts);
            const xTrue     = salt.xTrue;
            const mrHydrated = salt.mr + xTrue * 18;

            // Work backwards from real x to generate consistent masses
            const molSalt   = r(0.05, 0.20, 3);
            const anhydrous = parseFloat((molSalt * salt.mr).toFixed(2));
            const hydrated  = parseFloat((molSalt * mrHydrated).toFixed(2));
            const waterLost = parseFloat((hydrated - anhydrous).toFixed(2));
            const molWater  = waterLost / 18;
            const ratio     = molWater / molSalt;

            return {
                text: `<b>Determining Water of Crystallisation</b><br><br>
                       A student heated <b>${hydrated} g</b> of hydrated ${salt.salt}, 
                       ${salt.name}·xH₂O, until constant mass.<br>
                       The anhydrous residue weighed <b>${anhydrous} g</b>.<br>
                       (M<sub>r</sub>: ${salt.name} = ${salt.mr}, H₂O = 18)<br><br>
                       Determine the value of <b>x</b>.`,
                answer: xTrue,
                unit: '',
                hint: '1. Mass of H₂O lost = hydrated − anhydrous   2. n(H₂O) and n(salt)   3. x = n(H₂O) ÷ n(salt)',
                solution: `Mass of H₂O lost = ${hydrated} − ${anhydrous} = ${waterLost} g<br>
                           n(H₂O) = ${waterLost} ÷ 18 = ${molWater.toFixed(3)} mol<br>
                           n(${salt.name}) = ${anhydrous} ÷ ${salt.mr} = ${molSalt.toFixed(3)} mol<br>
                           x = ${molWater.toFixed(3)} ÷ ${molSalt.toFixed(3)} = ${ratio.toFixed(1)} ≈ <b>${xTrue}</b><br>
                           Formula: ${salt.name}·${xTrue}H₂O`,
                commonMistake: 'Comparing masses instead of moles is wrong. The ratio of MOLES gives x, not the ratio of masses.',
            };
        }

        case 'integrated': {
            const scenarios = [
                // Scenario A: Purity + reacting mass + gas volume
                () => {
                    const sampleMass = r(5, 30, 1);
                    const purity     = r(70, 98, 1);
                    const pureMass   = sampleMass * (purity / 100);
                    const molCaCO3   = pureMass / 100;
                    const volCO2     = molCaCO3 * 24;
                    return {
                        text: `<b>CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂</b><br><br>
                               A <b>${sampleMass} g</b> sample of impure limestone is <b>${purity}%</b> CaCO₃ by mass.<br>
                               It reacts completely with excess dilute HCl.<br>
                               (M<sub>r</sub>: CaCO₃ = 100; molar volume at RTP = 24 dm³/mol)<br><br>
                               Calculate the volume of CO₂ produced at RTP.`,
                        answer: volCO2,
                        unit: 'dm³',
                        hint: '4 steps: ① purity → pure mass   ② mass → moles   ③ mole ratio   ④ moles → volume',
                        solution: `Step 1: m(CaCO₃) = ${sampleMass} × ${purity}/100 = ${pureMass.toFixed(2)} g<br>
                                   Step 2: n(CaCO₃) = ${pureMass.toFixed(2)} ÷ 100 = ${molCaCO3.toFixed(3)} mol<br>
                                   Step 3: n(CO₂) = ${molCaCO3.toFixed(3)} mol (1:1 ratio)<br>
                                   Step 4: V = ${molCaCO3.toFixed(3)} × 24 = <b>${volCO2.toFixed(2)} dm³</b>`,
                        commonMistake: 'Forgetting purity, using wrong gas volume (22.4 instead of 24 at RTP), or skipping the mole ratio step.',
                    };
                },
                // Scenario B: Titration + mole ratio + yield
                () => {
                    const c1     = r(0.1, 0.5, 2);
                    const v1     = r(20, 40, 1);
                    const molHCl = c1 * (v1 / 1000);
                    const molNaOH = molHCl; // 1:1
                    const massNaCl_theo = molNaOH * 58.5;
                    const pctYield = r(70, 95, 1);
                    const massNaCl_act = parseFloat((massNaCl_theo * pctYield / 100).toFixed(2));
                    return {
                        text: `<b>HCl + NaOH → NaCl + H₂O</b><br><br>
                               <b>${v1} cm³</b> of <b>${c1} mol/dm³</b> HCl reacts with excess NaOH.<br>
                               The theoretical yield of NaCl is first calculated, then the student 
                               recovers <b>${massNaCl_act} g</b> of dry NaCl crystals.<br>
                               (M<sub>r</sub>: NaCl = 58.5)<br><br>
                               Calculate the percentage yield of NaCl.`,
                        answer: pctYield,
                        unit: '%',
                        hint: 'Step 1: n(HCl) = c×V   Step 2: n(NaCl) from ratio   Step 3: m(NaCl) theoretical   Step 4: % yield',
                        solution: `Step 1: n(HCl) = ${c1} × (${v1}/1000) = ${molHCl.toFixed(4)} mol<br>
                                   Step 2: n(NaCl) = ${molHCl.toFixed(4)} mol (1:1 ratio)<br>
                                   Step 3: m(NaCl) theoretical = ${molHCl.toFixed(4)} × 58.5 = ${massNaCl_theo.toFixed(2)} g<br>
                                   Step 4: % yield = (${massNaCl_act} ÷ ${massNaCl_theo.toFixed(2)}) × 100<br>
                                   <b>= ${pctYield.toFixed(1)}%</b>`,
                        commonMistake: 'Multi-step problems require you to track each calculation carefully. Show all working for full marks.',
                    };
                },
            ];
            return choice(scenarios)();
        }

        default:
            return {
                text: '⚠️ Question generation error. Please try another topic.',
                answer: 0,
                unit: '',
                hint: '',
                solution: '',
                commonMistake: '',
            };
    }
}