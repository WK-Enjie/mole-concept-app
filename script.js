const DATA = {
    basic: [
        { id: 'm-mr', title: 'Mass/Mr', formula: 'n = m / Mr', tags: ['mass', 'mr'] },
        { id: 'vol', title: 'Gas Volume', formula: 'V = n × 24', tags: ['rtp'] },
        { id: 'conc', title: 'Concentration', formula: 'n = c × V', tags: ['solution'] }
    ],
    intermediate: [
        { id: 'emp', title: 'Empirical Formula', formula: 'Ratios', tags: ['empirical'] },
        { id: 'yield', title: '% Yield & Purity', formula: 'Actual/Theo', tags: ['yield'] }
    ],
    advanced: [
        { id: 'ions', title: 'Ion Concentration', formula: 'Dissociation', tags: ['ions'] },
        { id: 'limit', title: 'Limiting Reagent', formula: 'Stoichiometry', tags: ['excess'] }
    ]
};

const QuestionEngine = {
    'm-mr': () => {
        const compounds = [{n:'NaOH', mr:40}, {n:'CaCO₃', mr:100}, {n:'H₂SO₄', mr:98}];
        const c = compounds[Math.floor(Math.random()*compounds.length)];
        const mass = (Math.random() * 200 + 10).toFixed(1);
        const ans = (mass / c.mr).toFixed(2);
        return { q: `How many moles are in ${mass}g of ${c.n}? (Mr = ${c.mr})`, a: ans, u: 'mol' };
    },
    'vol': () => {
        const mol = (Math.random() * 5 + 0.1).toFixed(2);
        return { q: `What is the volume of ${mol} moles of CO₂ at RTP?`, a: (mol * 24).toFixed(1), u: 'dm³' };
    },
    'conc': () => {
        const c = (Math.random() * 2 + 0.1).toFixed(2);
        const v = 250;
        const ans = (c * (v/1000)).toFixed(3);
        return { q: `Find moles in ${v}cm³ of ${c} mol/dm³ solution.`, a: ans, u: 'mol' };
    },
    'emp': () => {
        return { q: "Compound: 40% C, 6.7% H, 53.3% O. (Ar: C=12, H=1, O=16). Find Empirical Formula.", a: "CH2O", type: 'text' };
    },
    'ions': () => {
        const c = 0.2;
        return { q: `Find [Cl⁻] in 0.2 mol/dm³ of MgCl₂.`, a: (c * 2).toFixed(1), u: 'mol/dm³' };
    },
    'limit': () => {
        return { q: "2 moles of H₂ react with 2 moles of O₂. Which is the limiting reagent? (2H₂ + O₂ → 2H₂O)", a: "H2", type: "text" };
    }
};

let currentLvl = 'basic';
let activeTopic = 'm-mr';
let stats = { score: 0, total: 0, correct: 0 };

function setLvl(lvl) {
    currentLvl = lvl;
    document.querySelectorAll('.lvl-btn').forEach(b => b.classList.remove('active'));
    event.target.classList.add('active');
    renderTopics();
}

function renderTopics() {
    const container = document.getElementById('topic-list');
    container.innerHTML = DATA[currentLvl].map(t => `
        <div class="topic-card" onclick="startPractice('${t.id}')">
            <h3>${t.title}</h3>
            <p>${t.formula}</p>
        </div>
    `).join('');
}

function startPractice(id) {
    activeTopic = id;
    openTab(null, 'practice');
    generateQuestion();
}

function generateQuestion() {
    const qData = QuestionEngine[activeTopic]();
    window.currentAnswer = qData.a;
    const box = document.getElementById('practice-box');
    box.innerHTML = `
        <p class="q-text">${qData.q}</p>
        <div class="answer-row">
            <input type="${qData.type || 'number'}" id="user-ans">
            <span>${qData.u || ''}</span>
        </div>
        <div id="feedback" class="feedback-box"></div>
        <button class="btn-primary" onclick="checkAnswer()">Submit</button>
    `;
}

function checkAnswer() {
    const user = document.getElementById('user-ans').value.toString().toLowerCase().replace(/\s/g, '');
    const correct = window.currentAnswer.toString().toLowerCase().replace(/\s/g, '');
    const fb = document.getElementById('feedback');
    
    stats.total++;
    if (user == correct || Math.abs(parseFloat(user) - parseFloat(correct)) < 0.05) {
        stats.correct++;
        stats.score += 10;
        fb.innerHTML = "Correct! Well done.";
        fb.className = "feedback-box correct";
        setTimeout(generateQuestion, 1500);
    } else {
        fb.innerHTML = `Incorrect. The answer was ${window.currentAnswer}`;
        fb.className = "feedback-box wrong";
    }
    document.getElementById('score').innerText = stats.score;
    document.getElementById('p-acc').innerText = Math.round((stats.correct/stats.total)*100) + "%";
}

function openTab(evt, tabId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    if(evt) evt.currentTarget.classList.add('active');
}

async function loadFromSubfolder() {
    const file = document.getElementById('url-inp').value;
    try {
        const res = await fetch(`./worksheets/${file}`);
        const data = await res.json();
        alert("Worksheet Loaded: " + data.title);
    } catch (e) {
        document.getElementById('url-msg').innerText = "File not found in /worksheets/";
    }
}

// Start
renderTopics();
