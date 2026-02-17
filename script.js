const CHEMICALS = [
    { n: "NaOH", mr: 40 }, { n: "H₂SO₄", mr: 98 }, { n: "FeSO₄", mr: 152 }, { n: "KMnO₄", mr: 158 }
];

const TOPICS = {
    basic: [
        { id: 'mass', title: 'Mass & Mr', desc: 'n = mass / Mr' },
        { id: 'gas', title: 'Gas Volume', desc: 'n = Vol / 24 (RTP)' },
        { id: 'conc', title: 'Concentration', desc: 'n = c × V' }
    ],
    advanced: [
        { id: 'limit', title: 'Limiting & Excess', desc: 'Reactant stoichiometry' },
        { id: 'redox', title: 'Ions & Redox', desc: 'Mole ratios in Redox' },
        { id: 'titrate', title: 'Titration', desc: 'Acid-Base calculations' }
    ]
};

let currentAns = null;
let stats = { pts: 0, tries: 0, hits: 0 };
let currentSessionTopic = 'random';

function navTo(id) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.currentTarget.classList.add('active');
    if(id === 'learn-tab') renderGrid('basic');
}

function setTier(tier) {
    document.querySelectorAll('.tier-btn').forEach(b => b.classList.remove('active'));
    event.currentTarget.classList.add('active');
    renderGrid(tier);
}

function renderGrid(tier) {
    const grid = document.getElementById('topic-grid');
    grid.innerHTML = TOPICS[tier].map(t => `
        <div class="interaction-card">
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
            <button class="cta-btn" onclick="startLearning('${t.id}', '${t.title}')">Learn & Practice</button>
        </div>
    `).join('');
}

function startLearning(id, title) {
    navTo('practice-tab');
    document.getElementById('session-title').innerText = title;
    generateQuestion(id);
}

[attachment_0](attachment)

function generateQuestion(id) {
    const display = document.getElementById('question-display');
    currentSessionTopic = id;
    let q = ""; let unit = "";
    const chem = CHEMICALS[Math.floor(Math.random()*CHEMICALS.length)];

    // Target specific logic based on the ID
    const type = (id === 'random') ? ['mass', 'gas', 'conc', 'limit', 'redox', 'titrate'][Math.floor(Math.random()*6)] : id;

    if(type === 'mass') {
        const m = (Math.random()*20 + 2).toFixed(1);
        q = `How many moles are in ${m}g of ${chem.n} (Mr=${chem.mr})?`;
        currentAns = (m/chem.mr).toFixed(2); unit = "mol";
    } else if(type === 'gas') {
        const v = (Math.random()*12 + 1).toFixed(1);
        q = `What is the amount in moles of ${v}dm³ of CO₂ at RTP?`;
        currentAns = (v/24).toFixed(2); unit = "mol";
    } else if(type === 'conc') {
        const c = 0.5; const v = 250;
        q = `Calculate moles of solute in 250cm³ of a 0.5M solution.`;
        currentAns = 0.125; unit = "mol";
    } else if(type === 'redox') {
        const mol = 0.02;
        q = `In a redox reaction, 1 mol of MnO₄⁻ reacts with 5 mol of Fe²⁺. If you have 0.02 mol of MnO₄⁻, how many moles of Fe²⁺ react?`;
        currentAns = 0.10; unit = "mol";
    } else if(type === 'titrate') {
        q = `25cm³ of 0.1M HCl reacts with 20cm³ of NaOH. Find [NaOH].`;
        currentAns = 0.125; unit = "M";
    } else {
        q = `2 mol of H₂ reacts with 1 mol of O₂. If you have 4 mol of H₂ and 1 mol of O₂, which is limiting? (Enter 1 for H₂, 2 for O₂)`;
        currentAns = 2; unit = "ID";
    }

    display.innerHTML = `
        <p style="font-size:1.1rem; line-height:1.4;">${q}</p>
        <input type="number" id="ans-box" class="ans-input" placeholder="Answer...">
        <div id="fb" style="height:20px; margin-bottom:10px; font-weight:bold;"></div>
        <button class="cta-btn" onclick="checkAns()">Check Answer</button>
    `;
}

function checkAns() {
    const val = document.getElementById('ans-box').value;
    const isCorrect = (Math.abs(parseFloat(val) - parseFloat(currentAns)) < 0.01);
    const fb = document.getElementById('fb');

    stats.tries++;
    if(isCorrect) {
        stats.pts += 10; stats.hits++;
        fb.innerHTML = "<span style='color:#22c55e'>✅ Correct!</span>";
        setTimeout(() => generateQuestion(currentSessionTopic), 1200);
    } else {
        fb.innerHTML = `<span style='color:#ef4444'>❌ Wrong. Answer: ${currentAns}</span>`;
    }
    updateScore();
}

function updateScore() {
    document.getElementById('points').innerText = stats.pts;
    const acc = stats.tries ? Math.round((stats.hits/stats.tries)*100) : 0;
    document.getElementById('accuracy').innerText = acc + "%";
}

// Start-up
renderGrid('basic');
