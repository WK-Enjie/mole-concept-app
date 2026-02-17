/**
 * MOLE MASTER - ADVANCED STOICHIOMETRY
 */

const TOPICS = {
    basic: [{ id: 'm-mr', title: 'Mass & Mr', desc: 'n = m / Mr' }, { id: 'gas', title: 'Gas Volume', desc: 'n = V / 24' }],
    intermediate: [{ id: 'yield', title: '% Yield', desc: 'Actual vs Theo' }, { id: 'emp', title: 'Empirical', desc: 'Simplest ratio' }],
    advanced: [
        { id: 'titration', title: 'Titration', desc: 'Acid-Base neutralisation' },
        { id: 'redox', title: 'Redox States', desc: 'Oxidation numbers' },
        { id: 'ions', title: 'Ion Molarity', desc: 'Salt dissociation' }
    ]
};

let currentTier = 'advanced', currentAnswer = null, stats = { pts: 0, count: 0, correct: 0 };
let quizQs = [], quizIdx = 0;

function navigate(e, id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    if(e) e.currentTarget.classList.add('active');
}

function setTier(t) {
    currentTier = t;
    document.querySelectorAll('.tier-link').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderGrid();
}

function renderGrid() {
    const grid = document.getElementById('topic-grid');
    grid.innerHTML = TOPICS[currentTier].map(t => `
        <div class="topic-card">
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
            <button class="btn-cta" onclick="startLearn('${t.id}')">Practice</button>
        </div>
    `).join('');
}

// LOGIC GENERATOR
function generateLogic(id, target) {
    const box = document.getElementById(target);
    let q = "", u = "", type = "number";

    if (id === 'titration') {
        const v1 = 25; const c1 = (Math.random() * 0.2 + 0.1).toFixed(2);
        const v2 = (Math.random() * 10 + 20).toFixed(1);
        q = `In a titration, <b>${v1}cm³</b> of <b>${c1}M HCl</b> neutralises <b>${v2}cm³</b> of NaOH. Find the concentration of NaOH.`;
        currentAnswer = ((c1 * v1) / v2).toFixed(3); u = "M";
    } 
    else if (id === 'redox') {
        const species = [
            { f: "KMnO₄", el: "Mn", a: "+7" }, { f: "K₂Cr₂O₇", el: "Cr", a: "+6" },
            { f: "SO₄²⁻", el: "S", a: "+6" }, { f: "ClO₃⁻", el: "Cl", a: "+5" }
        ];
        const s = species[Math.floor(Math.random()*species.length)];
        q = `What is the oxidation state of <b>${s.el}</b> in <b>${s.f}</b>? (Include + or -)`;
        currentAnswer = s.a; type = "text";
    }
    else {
        q = "Find moles in 10g of NaOH (Mr=40)";
        currentAnswer = "0.25"; u = "mol";
    }

    box.innerHTML = `<h3>${q}</h3>
        <div class="input-row"><input type="${type}" id="ans-inp"><span style="color:#a855f7">${u}</span></div>
        <div id="fb" style="margin-bottom:10px; height:20px;"></div>
        <button class="btn-cta" onclick="checkAns('${target}', '${id}')">Submit</button>`;
}

function startLearn(id) {
    navigate(null, 'practice');
    generateLogic(id, 'random-question-box');
}

function generateMegaRandomQuestion() {
    const ids = ['titration', 'redox', 'ions', 'm-mr', 'gas'];
    const r = ids[Math.floor(Math.random()*ids.length)];
    generateLogic(r, 'random-question-box');
}



function checkAns(boxId, id) {
    const user = document.getElementById('ans-inp').value.trim();
    const fb = document.getElementById('fb');
    let correct = false;

    if(isNaN(currentAnswer)) {
        correct = (user.toLowerCase() === currentAnswer.toLowerCase());
    } else {
        correct = (Math.abs(parseFloat(user) - parseFloat(currentAnswer)) < 0.01);
    }

    if(correct) {
        fb.innerHTML = "<span style='color:#22c55e'>Correct!</span>";
        stats.pts += 10; stats.correct++;
        setTimeout(() => generateLogic(id, boxId), 1500);
    } else {
        fb.innerHTML = `<span style='color:#ef4444'>Incorrect. Answer: ${currentAnswer}</span>`;
    }
    stats.count++;
    updateUI();
}

function updateUI() {
    document.getElementById('points').innerText = stats.pts;
    const acc = stats.count > 0 ? Math.round((stats.correct/stats.count)*100) : 0;
    document.getElementById('accuracy').innerText = acc + "%";
}

// QUIZ LOADER
async function fetchQuizJSON() {
    const file = document.getElementById('quiz-input').value;
    const status = document.getElementById('quiz-status');
    try {
        const res = await fetch(`./worksheets/${file}.json`);
        const data = await res.json();
        quizQs = data.questions; quizIdx = 0;
        status.innerText = "✅ Quiz Ready!";
        renderQuiz();
    } catch(e) { status.innerText = "❌ File not found!"; }
}

function renderQuiz() {
    const area = document.getElementById('active-quiz-area');
    area.style.display = 'block';
    const q = quizQs[quizIdx];
    area.innerHTML = `<h3>Quiz: Question ${quizIdx + 1}</h3><p style="margin:15px 0">${q.question}</p>
        <div class="input-row"><input id="q-ans"></div>
        <button class="btn-cta" onclick="nextQuiz()">Next</button>`;
}

function nextQuiz() {
    quizIdx++;
    if(quizIdx < quizQs.length) renderQuiz();
    else document.getElementById('active-quiz-area').innerHTML = "<h2>Quiz Finished!</h2>";
}

renderGrid();
