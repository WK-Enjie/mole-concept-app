const DATA = {
    basic: [
        { id: 'mass', title: 'Mass & Mr', formula: 'n = m / Mr' },
        { id: 'gas', title: 'Gas Volume', formula: 'n = V / 24' }
    ],
    intermediate: [
        { id: 'yield', title: 'Yield %', formula: 'Act/Theo x 100' },
        { id: 'emp', title: 'Empirical', formula: 'Simplest Ratio' }
    ],
    advanced: [
        { id: 'titrate', title: 'Titration', formula: 'C1V1 = C2V2' },
        { id: 'redox', title: 'Redox', formula: 'Oxidation States' }
    ]
};

let currentTier = 'basic';
let activeAns = null;
let stats = { pts: 0, tries: 0, hits: 0, streak: 0 };
let quizList = [], quizStep = 0;

function showPanel(e, id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(e) e.target.classList.add('active');
    if(id === 'learn-section') updateTier(currentTier);
}

function updateTier(t) {
    currentTier = t;
    document.querySelectorAll('.tier-link').forEach(l => l.classList.remove('active'));
    event.target.classList.add('active');
    
    const grid = document.getElementById('learning-grid');
    grid.innerHTML = DATA[t].map(item => `
        <div class="interactive-card">
            <h3>${item.title}</h3>
            <p>${item.formula}</p>
            <button class="btn-primary" onclick="startTask('${item.id}')">Practice</button>
        </div>
    `).join('');
}

function startTask(id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.getElementById('practice-section').classList.add('active');
    generateLogic(id);
}

function generateRandomTask() {
    const keys = ['mass', 'gas', 'titrate', 'redox'];
    generateLogic(keys[Math.floor(Math.random()*keys.length)]);
}


function generateLogic(id) {
    const box = document.getElementById('practice-box');
    let q = "", unit = "", isText = false;

    if(id === 'titrate') {
        const v1 = 25, c1 = 0.1, v2 = (Math.random()*10 + 20).toFixed(1);
        q = `25cm³ of 0.1M HCl neutralizes ${v2}cm³ of NaOH. Calculate [NaOH].`;
        activeAns = (2.5 / v2).toFixed(3); unit = "M";
    } else if(id === 'redox') {
        const ions = [{n:'MnO₄⁻', e:'Mn', a:'+7'}, {n:'Cr₂O₇²⁻', e:'Cr', a:'+6'}];
        const choice = ions[Math.floor(Math.random()*ions.length)];
        q = `What is the oxidation state of ${choice.e} in ${choice.n}?`;
        activeAns = choice.a; isText = true;
    } else {
        const m = (Math.random()*10 + 2).toFixed(1);
        q = `Calculate moles in ${m}g of NaOH (Mr=40).`;
        activeAns = (m/40).toFixed(2); unit = "mol";
    }

    box.innerHTML = `<h3>${q}</h3>
        <input type="${isText?'text':'number'}" id="u-ans" class="input-field" placeholder="Answer...">
        <div id="fb"></div>
        <button class="btn-primary" onclick="checkAns('${id}')">Check Answer</button>`;
}


function checkAns(id) {
    const val = document.getElementById('u-ans').value.trim();
    const isCorrect = (val == activeAns || Math.abs(val - activeAns) < 0.02);
    
    stats.tries++;
    if(isCorrect) {
        stats.pts += 10; stats.hits++; stats.streak++;
        document.getElementById('fb').innerHTML = "✅ Correct!";
        setTimeout(() => generateLogic(id), 1200);
    } else {
        stats.streak = 0;
        document.getElementById('fb').innerHTML = `❌ Wrong. Ans: ${activeAns}`;
    }
    updateUI();
}

function updateUI() {
    document.getElementById('points').innerText = stats.pts;
    document.getElementById('streak').innerText = stats.streak;
    const acc = stats.tries ? Math.round((stats.hits/stats.tries)*100) : 0;
    document.getElementById('accuracy').innerText = acc + "%";
}

// QUIZ LOADER
async function loadQuizFile() {
    const file = document.getElementById('quiz-file').value;
    try {
        const res = await fetch(`./worksheets/${file}.json`);
        const data = await res.json();
        quizList = data.questions; quizStep = 0;
        runQuiz();
    } catch(e) { document.getElementById('quiz-msg').innerText = "Not found."; }
}

function runQuiz() {
    const box = document.getElementById('active-quiz-area');
    box.style.display = 'block';
    const q = quizList[quizStep];
    box.innerHTML = `<h3>Q${quizStep+1}: ${q.question}</h3>
        <input id="q-ans" class="input-field">
        <button class="btn-primary" onclick="nextQuiz()">Submit</button>`;
}

function nextQuiz() {
    quizStep++;
    if(quizStep < quizList.length) runQuiz();
    else document.getElementById('active-quiz-area').innerHTML = "<h2>Finished!</h2>";
}
