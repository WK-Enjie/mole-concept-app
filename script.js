// ============================================
// MOLE CALCULATIONS MASTER
// ============================================

// DATA
const TOPICS = {
    basic: [
        {id:'moles-mass', title:'Moles from Mass', desc:'Using n = m/Mr', icon:'⚖️'},
        {id:'gas-volume', title:'Gas Volume', desc:'Volume at RTP', icon:'💨'},
        {id:'concentration', title:'Concentration', desc:'Solutions', icon:'🧪'},
        {id:'mass-calc', title:'Mass from Moles', desc:'Using m = n × Mr', icon:'📊'},
        {id:'limiting', title:'Limiting Reagent', desc:'Find limiting reagent', icon:'⚗️'}
    ],
    intermediate: [
        {id:'crystallisation', title:'Water of Crystallisation', desc:'Hydrated salts', icon:'💎'},
        {id:'ionic', title:'Moles of Ions', desc:'Ions in compounds', icon:'⚡'},
        {id:'titration', title:'Titration', desc:'Acid-base', icon:'🧫'},
        {id:'redox', title:'Redox', desc:'Electron transfer', icon:'🔋'}
    ],
    advanced: [
        {id:'yield', title:'Percentage Yield', desc:'Actual vs theoretical', icon:'📈'},
        {id:'purity', title:'Percentage Purity', desc:'Sample purity', icon:'✨'},
        {id:'empirical', title:'Empirical Formula', desc:'From composition', icon:'📐'},
        {id:'multi', title:'Multi-Step', desc:'Complex problems', icon:'🧩'}
    ]
};

const LESSONS = {
    'moles-mass': `
        <h2 class="lesson-title">Moles from Mass</h2>
        <div class="visual-section">
            <h4>The Mole Concept</h4>
            <p>1 mole = 6.02 × 10²³ particles</p>
            <div class="atoms-display">
                <div class="atom-item"><div class="atom-ball c">C</div><small>12g = 1mol</small></div>
                <div class="atom-item"><div class="atom-ball o">O</div><small>16g = 1mol</small></div>
                <div class="atom-item"><div class="atom-ball h">H</div><small>1g = 1mol</small></div>
            </div>
        </div>
        <div class="formula-section">
            <div class="label">KEY FORMULA</div>
            <div class="formula">n = m / Mr</div>
            <div class="desc">n = moles | m = mass (g) | Mr = relative molecular mass</div>
        </div>
        <div class="example-section">
            <h4>📝 Worked Example</h4>
            <p><b>Calculate moles in 88g CO₂ (Mr = 44)</b></p>
            <ul class="steps-list">
                <li><b>Step 1:</b> m = 88g, Mr = 44</li>
                <li><b>Step 2:</b> n = m/Mr = 88/44</li>
                <li><b>Step 3:</b> n = <b>2 mol</b></li>
            </ul>
        </div>
        <div class="calc-section">
            <h4>🧮 Try It</h4>
            <div class="calc-row">
                <div class="calc-field"><label>Mass (g)</label><input type="number" id="c-mass" oninput="doCalc()"></div>
                <div class="calc-field"><label>Mr</label><input type="number" id="c-mr" oninput="doCalc()"></div>
            </div>
            <div class="calc-result" id="c-result">Enter values</div>
        </div>
        <table class="data-table">
            <tr><th>Compound</th><th>Formula</th><th>Mr</th></tr>
            <tr><td>Water</td><td>H₂O</td><td>18</td></tr>
            <tr><td>Carbon Dioxide</td><td>CO₂</td><td>44</td></tr>
            <tr><td>Sodium Chloride</td><td>NaCl</td><td>58.5</td></tr>
            <tr><td>Calcium Carbonate</td><td>CaCO₃</td><td>100</td></tr>
        </table>
    `,
    'gas-volume': `
        <h2 class="lesson-title">Gas Volume at RTP</h2>
        <div class="visual-section">
            <h4>Molar Gas Volume</h4>
            <p style="font-size:2rem;">💨</p>
            <p>At RTP (25°C, 1 atm): <b>1 mole = 24 dm³</b></p>
        </div>
        <div class="formula-section">
            <div class="label">KEY FORMULA</div>
            <div class="formula">n = V / 24</div>
            <div class="desc">V = volume in dm³</div>
        </div>
        <div class="example-section">
            <h4>📝 Worked Example</h4>
            <p><b>Calculate moles in 72 dm³ O₂</b></p>
            <ul class="steps-list">
                <li><b>Step 1:</b> V = 72 dm³</li>
                <li><b>Step 2:</b> n = 72/24 = <b>3 mol</b></li>
            </ul>
        </div>
    `,
    'concentration': `
        <h2 class="lesson-title">Concentration</h2>
        <div class="visual-section">
            <p style="font-size:2rem;">🧪</p>
            <p>Concentration = moles per dm³</p>
        </div>
        <div class="formula-section">
            <div class="label">KEY FORMULAS</div>
            <div class="formula">n = c × V</div>
            <div class="desc">c = mol/dm³ | V = dm³</div>
        </div>
        <div class="example-section">
            <h4>📝 Worked Example</h4>
            <p><b>Moles in 250cm³ of 0.5 mol/dm³ HCl</b></p>
            <ul class="steps-list">
                <li><b>Step 1:</b> V = 250/1000 = 0.25 dm³</li>
                <li><b>Step 2:</b> n = 0.5 × 0.25 = <b>0.125 mol</b></li>
            </ul>
        </div>
    `
};

// QUESTION BANK
const QUESTIONS = {
    basic: [
        () => {
            const compounds = [{n:'H₂O',mr:18},{n:'CO₂',mr:44},{n:'NaCl',mr:58.5},{n:'CaCO₃',mr:100},{n:'NaOH',mr:40}];
            const c = compounds[Math.floor(Math.random()*compounds.length)];
            const mol = +(Math.random()*2+0.2).toFixed(2);
            const mass = +(mol*c.mr).toFixed(1);
            return {type:'numeric', level:'basic', question:`Calculate moles in <b>${mass}g ${c.n}</b> (Mr=${c.mr})`, answer:mol, unit:'mol', tol:0.02, hint:'n = m/Mr', solution:`n = ${mass}/${c.mr} = ${mol}`};
        },
        () => {
            const gases = ['O₂','CO₂','H₂','N₂'];
            const g = gases[Math.floor(Math.random()*gases.length)];
            const mol = +(Math.random()*3+0.5).toFixed(2);
            const vol = +(mol*24).toFixed(1);
            return {type:'numeric', level:'basic', question:`Calculate moles in <b>${vol} dm³ ${g}</b> at RTP`, answer:mol, unit:'mol', tol:0.02, hint:'n = V/24', solution:`n = ${vol}/24 = ${mol}`};
        },
        () => {
            const c = +(Math.random()*0.8+0.1).toFixed(2);
            const v = [25,50,100,250][Math.floor(Math.random()*4)];
            const mol = +(c*(v/1000)).toFixed(4);
            return {type:'numeric', level:'basic', question:`Moles of HCl in <b>${v}cm³</b> of <b>${c} mol/dm³</b>`, answer:mol, unit:'mol', tol:0.001, hint:'Convert to dm³, then n=c×V', solution:`n = ${c} × ${v/1000} = ${mol}`};
        }
    ],
    intermediate: [
        () => {
            const v1 = [20,25,30][Math.floor(Math.random()*3)];
            const c2 = [0.1,0.2,0.5][Math.floor(Math.random()*3)];
            const v2 = [15,20,25][Math.floor(Math.random()*3)];
            const mol = c2*(v2/1000);
            const c1 = +(mol/(v1/1000)).toFixed(3);
            return {type:'numeric', level:'intermediate', equation:'NaOH + HCl → NaCl + H₂O', question:`${v1}cm³ NaOH neutralised by ${v2}cm³ of ${c2} mol/dm³ HCl. Find [NaOH].`, answer:c1, unit:'mol/dm³', tol:0.01, hint:'1:1 ratio', solution:`Mol HCl = ${mol.toFixed(4)}\n[NaOH] = ${mol.toFixed(4)}/${v1/1000} = ${c1}`};
        },
        () => {
            const data = [{f:'CaCl₂',mol:0.5,ion:'Cl⁻',mult:2},{f:'Na₂SO₄',mol:0.25,ion:'Na⁺',mult:2}];
            const d = data[Math.floor(Math.random()*data.length)];
            const ans = +(d.mol*d.mult).toFixed(2);
            return {type:'numeric', level:'intermediate', question:`Moles of <b>${d.ion}</b> in <b>${d.mol} mol ${d.f}</b>`, answer:ans, unit:'mol', tol:0.01, hint:'Check subscripts', solution:`${d.mol} × ${d.mult} = ${ans}`};
        }
    ],
    advanced: [
        () => {
            const yields = [70,75,80,85,90];
            const y = yields[Math.floor(Math.random()*yields.length)];
            const mass = [10,20,25,50][Math.floor(Math.random()*4)];
            const mol = mass/100;
            const th = mol*56;
            const actual = +(th*y/100).toFixed(2);
            return {type:'numeric', level:'advanced', equation:'CaCO₃ → CaO + CO₂', question:`${mass}g CaCO₃ gives ${actual}g CaO. % yield?`, answer:y, unit:'%', tol:1, hint:'% = (actual/theoretical)×100', solution:`Theoretical = ${th}g\n% = (${actual}/${th})×100 = ${y}%`};
        },
        () => {
            const formulas = [{c:40,h:6.67,o:53.33,ans:'CH2O'},{c:75,h:25,o:0,ans:'CH4'}];
            const f = formulas[Math.floor(Math.random()*formulas.length)];
            return {type:'text', level:'advanced', question:`Compound: ${f.c}% C, ${f.h}% H${f.o?', '+f.o+'% O':''}. Empirical formula?`, answer:f.ans, hint:'Convert % to moles', solution:`Divide by Ar → ${f.ans}`};
        }
    ]
};

// STATE
let learnLevel = 'basic';
let practiceLevel = 'basic';
let currentQ = null;
let stats = {correct:0, total:0, streak:0};

let testConfig = {diff:'basic', count:10, time:10};
let testState = {qs:[], curr:0, ans:[], timer:null, start:null};

let quizzes = [];
let serverQuizzes = JSON.parse(localStorage.getItem('serverQuizzes')||'[]');
let customState = {quiz:null, curr:0, ans:[], timer:null};

// INIT
document.addEventListener('DOMContentLoaded', function() {
    loadTopics();
    genPracticeQ();
    renderServerList();
    
    // Drag and drop
    const uploadArea = document.getElementById('upload-area');
    uploadArea.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.classList.add('dragover');
    });
    uploadArea.addEventListener('dragleave', function() {
        this.classList.remove('dragover');
    });
    uploadArea.addEventListener('drop', function(e) {
        e.preventDefault();
        this.classList.remove('dragover');
        if (e.dataTransfer.files[0]) loadFileData(e.dataTransfer.files[0]);
    });
});

// TAB SWITCHING
function openTab(tabId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.target.classList.add('active');
}

// LEARN TAB
function setLearnLevel(level) {
    learnLevel = level;
    document.querySelectorAll('#learn .lvl-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`#learn .lvl-btn.${level === 'intermediate' ? 'inter' : level === 'advanced' ? 'adv' : 'basic'}`).classList.add('active');
    loadTopics();
}

function loadTopics() {
    const list = document.getElementById('topic-list');
    const topics = TOPICS[learnLevel] || [];
    list.innerHTML = topics.map(t => `
        <div class="topic-card" onclick="openLesson('${t.id}')">
            <div class="icon">${t.icon}</div>
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
        </div>
    `).join('');
}

function openLesson(id) {
    const content = LESSONS[id];
    if (!content) {
        alert('Coming soon!');
        return;
    }
    document.getElementById('lesson-body').innerHTML = content;
    document.getElementById('lesson-modal').classList.add('show');
}

function closeLesson() {
    document.getElementById('lesson-modal').classList.remove('show');
}

function doCalc() {
    const m = parseFloat(document.getElementById('c-mass')?.value);
    const mr = parseFloat(document.getElementById('c-mr')?.value);
    const res = document.getElementById('c-result');
    if (m && mr) {
        res.innerHTML = `n = ${m}/${mr} = <b>${(m/mr).toFixed(4)} mol</b>`;
    } else {
        res.textContent = 'Enter values';
    }
}

// PRACTICE TAB
function setPracticeLevel(level) {
    practiceLevel = level;
    document.querySelectorAll('#practice .lvl-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`#practice .lvl-btn.${level === 'intermediate' ? 'inter' : level === 'advanced' ? 'adv' : 'basic'}`).classList.add('active');
    genPracticeQ();
}

function genPracticeQ() {
    const bank = QUESTIONS[practiceLevel] || QUESTIONS.basic;
    currentQ = bank[Math.floor(Math.random()*bank.length)]();
    renderQuestion('practice-box', currentQ, true);
}

function renderQuestion(containerId, q, showBtns) {
    const box = document.getElementById(containerId);
    
    let answerHTML = '';
    if (q.type === 'mcq' && q.options) {
        answerHTML = `<div class="mcq-list">${q.options.map((o,i) => 
            `<div class="mcq-item" onclick="selectMCQ(this,${i})" data-idx="${i}">
                <span class="mcq-letter">${String.fromCharCode(65+i)}</span>
                <span>${o}</span>
            </div>`).join('')}</div>`;
    } else {
        answerHTML = `<div class="answer-row">
            <input type="${q.type==='text'?'text':'number'}" id="ans-inp" placeholder="Your answer">
            ${q.unit ? `<span class="unit-box">${q.unit}</span>` : ''}
        </div>`;
    }
    
    box.innerHTML = `
        <div class="q-header">
            <span class="q-badge ${q.level||practiceLevel}">${(q.level||practiceLevel).toUpperCase()}</span>
        </div>
        ${q.equation ? `<div class="q-equation">${q.equation}</div>` : ''}
        <div class="q-text">${q.question}</div>
        ${answerHTML}
        <div class="hint-box" id="hint-box"><b>💡 Hint:</b> ${q.hint||'No hint'}</div>
        <div class="feedback-box" id="feedback-box"></div>
        <div class="solution-box" id="solution-box"><b>📖 Solution:</b><pre>${q.solution||''}</pre></div>
        ${showBtns ? `
        <div class="btn-row">
            <button class="btn btn-warning" onclick="showHint()">💡 Hint</button>
            <button class="btn btn-primary" onclick="checkAns()">Check</button>
            <button class="btn btn-ghost" onclick="showSol()">Solution</button>
            <button class="btn btn-success" onclick="nextQ()">Next →</button>
        </div>` : ''}
    `;
    
    const inp = document.getElementById('ans-inp');
    if (inp) {
        inp.focus();
        inp.onkeypress = e => { if (e.key === 'Enter') checkAns(); };
    }
}

function selectMCQ(el, idx) {
    document.querySelectorAll('.mcq-item').forEach(m => m.classList.remove('selected'));
    el.classList.add('selected');
}

function showHint() { document.getElementById('hint-box').classList.add('show'); }
function showSol() { document.getElementById('solution-box').classList.add('show'); }

function checkAns() {
    const fb = document.getElementById('feedback-box');
    let correct = false;
    
    if (currentQ.type === 'mcq') {
        const sel = document.querySelector('.mcq-item.selected');
        if (sel) {
            const idx = parseInt(sel.dataset.idx);
            correct = idx === currentQ.answer;
            document.querySelectorAll('.mcq-item').forEach((m,i) => {
                if (i === currentQ.answer) m.classList.add('correct');
                else if (i === idx && !correct) m.classList.add('wrong');
            });
        }
    } else if (currentQ.type === 'text') {
        const inp = document.getElementById('ans-inp');
        const val = inp.value.trim().toLowerCase().replace(/\s/g,'');
        correct = val === currentQ.answer.toLowerCase().replace(/\s/g,'');
        inp.classList.add(correct ? 'correct' : 'wrong');
    } else {
        const inp = document.getElementById('ans-inp');
        const val = parseFloat(inp.value);
        if (!isNaN(val)) {
            correct = Math.abs(val - currentQ.answer) <= (currentQ.tol || 0.01);
        }
        inp.classList.add(correct ? 'correct' : 'wrong');
    }
    
    stats.total++;
    if (correct) {
        stats.correct++;
        stats.streak++;
        fb.innerHTML = `🎉 Correct! ${stats.streak > 1 ? '🔥 ' + stats.streak + ' streak!' : ''}`;
        fb.className = 'feedback-box correct show';
    } else {
        stats.streak = 0;
        fb.innerHTML = `❌ Wrong. Answer: ${currentQ.answer} ${currentQ.unit||''}`;
        fb.className = 'feedback-box wrong show';
        showSol();
    }
    
    updateStats();
}

function updateStats() {
    document.getElementById('score').textContent = stats.correct * 10;
    document.getElementById('streak').textContent = stats.streak;
    document.getElementById('p-correct').textContent = stats.correct;
    document.getElementById('p-total').textContent = stats.total;
    document.getElementById('p-streak').textContent = stats.streak;
    const acc = stats.total > 0 ? Math.round(stats.correct / stats.total * 100) : 0;
    document.getElementById('p-acc').textContent = acc + '%';
}

function nextQ() { genPracticeQ(); }

// TEST TAB
function setTestDiff(btn, diff) {
    document.querySelectorAll('.setup-section .opt-btn').forEach(b => {
        if (b.dataset && b.onclick.toString().includes('setTestDiff')) b.classList.remove('active');
    });
    btn.classList.add('active');
    testConfig.diff = diff;
}

function setTestTime(btn, time) {
    document.querySelectorAll('.setup-section .opt-btn').forEach(b => {
        if (b.onclick.toString().includes('setTestTime')) b.classList.remove('active');
    });
    btn.classList.add('active');
    testConfig.time = time;
}

function startTest() {
    testConfig.count = parseInt(document.getElementById('q-slider').value);
    testState.qs = [];
    testState.ans = [];
    testState.curr = 0;
    
    const levels = testConfig.diff === 'mixed' ? ['basic','intermediate','advanced'] : [testConfig.diff];
    
    for (let i = 0; i < testConfig.count; i++) {
        const lvl = levels[i % levels.length];
        const bank = QUESTIONS[lvl] || QUESTIONS.basic;
        const q = bank[Math.floor(Math.random() * bank.length)]();
        q.level = lvl;
        testState.qs.push(q);
        testState.ans.push(null);
    }
    
    document.getElementById('test-setup').style.display = 'none';
    document.getElementById('test-active').style.display = 'block';
    document.getElementById('test-result').style.display = 'none';
    
    document.getElementById('total-q').textContent = testState.qs.length;
    
    if (testConfig.time > 0) {
        testState.start = Date.now();
        updateTimer();
        testState.timer = setInterval(updateTimer, 1000);
    } else {
        document.getElementById('timer').textContent = '∞';
    }
    
    showTestQ();
}

function updateTimer() {
    const elapsed = Math.floor((Date.now() - testState.start) / 1000);
    const remaining = testConfig.time * 60 - elapsed;
    
    if (remaining <= 0) {
        clearInterval(testState.timer);
        endTest();
        return;
    }
    
    const min = Math.floor(remaining / 60);
    const sec = remaining % 60;
    const el = document.getElementById('timer');
    el.textContent = `${min}:${sec.toString().padStart(2,'0')}`;
    
    el.classList.remove('warning','danger');
    if (remaining <= 60) el.classList.add('danger');
    else if (remaining <= 180) el.classList.add('warning');
}

function showTestQ() {
    const q = testState.qs[testState.curr];
    document.getElementById('curr-q').textContent = testState.curr + 1;
    document.getElementById('prog-fill').style.width = `${(testState.curr/testState.qs.length)*100}%`;
    
    document.getElementById('next-btn').style.display = testState.curr < testState.qs.length - 1 ? 'inline-block' : 'none';
    document.getElementById('finish-btn').style.display = testState.curr === testState.qs.length - 1 ? 'inline-block' : 'none';
    
    const box = document.getElementById('test-box');
    box.innerHTML = `
        <div class="q-header"><span class="q-badge ${q.level}">${q.level.toUpperCase()}</span></div>
        ${q.equation ? `<div class="q-equation">${q.equation}</div>` : ''}
        <div class="q-text">${q.question}</div>
        ${q.type === 'mcq' && q.options ? `
            <div class="mcq-list">${q.options.map((o,i) => 
                `<div class="mcq-item ${testState.ans[testState.curr]===i?'selected':''}" onclick="testSelectMCQ(${i})" data-idx="${i}">
                    <span class="mcq-letter">${String.fromCharCode(65+i)}</span>
                    <span>${o}</span>
                </div>`).join('')}</div>
        ` : `
            <div class="answer-row">
                <input type="${q.type==='text'?'text':'number'}" id="test-inp" value="${testState.ans[testState.curr]||''}" placeholder="Your answer">
                ${q.unit ? `<span class="unit-box">${q.unit}</span>` : ''}
            </div>
        `}
    `;
    
    const inp = document.getElementById('test-inp');
    if (inp) {
        inp.focus();
        inp.oninput = () => { testState.ans[testState.curr] = inp.value; };
    }
}

function testSelectMCQ(idx) {
    testState.ans[testState.curr] = idx;
    showTestQ();
}

function testPrev() {
    if (testState.curr > 0) { testState.curr--; showTestQ(); }
}

function testNext() {
    if (testState.curr < testState.qs.length - 1) { testState.curr++; showTestQ(); }
}

function endTest() {
    clearInterval(testState.timer);
    
    let correct = 0;
    const results = testState.qs.map((q, i) => {
        let ok = false;
        const a = testState.ans[i];
        
        if (q.type === 'mcq') {
            ok = a === q.answer;
        } else if (q.type === 'text') {
            ok = (a||'').trim().toLowerCase() === q.answer.toLowerCase();
        } else {
            const v = parseFloat(a);
            ok = !isNaN(v) && Math.abs(v - q.answer) <= (q.tol || 0.01);
        }
        
        if (ok) correct++;
        return {q, a, ok};
    });
    
    const pct = Math.round(correct / testState.qs.length * 100);
    let grade, cls;
    if (pct >= 90) { grade = 'Excellent'; cls = 'excellent'; }
    else if (pct >= 70) { grade = 'Good'; cls = 'good'; }
    else if (pct >= 50) { grade = 'Average'; cls = 'average'; }
    else { grade = 'Needs Work'; cls = 'poor'; }
    
    document.getElementById('test-active').style.display = 'none';
    const res = document.getElementById('test-result');
    res.style.display = 'block';
    
    res.innerHTML = `
        <div class="result-box">
            <div class="score-circle ${cls}">
                <div class="percent">${pct}%</div>
                <div class="grade">${grade}</div>
            </div>
            <h2>Test Complete!</h2>
            <div class="result-stats">
                <div class="result-stat"><div class="val">${correct}</div><div class="lbl">Correct</div></div>
                <div class="result-stat"><div class="val">${testState.qs.length - correct}</div><div class="lbl">Wrong</div></div>
            </div>
            <div class="review-section">
                <h3>Review</h3>
                ${results.map((r,i) => `
                    <div class="review-item ${r.ok?'correct':'wrong'}">
                        <b>Q${i+1}</b> <span class="q-badge ${r.q.level}">${r.q.level}</span>
                        <div class="q-short">${r.q.question.substring(0,60)}...</div>
                        <div class="answers">Your: <b>${r.a||'—'}</b> | Answer: <b>${r.q.answer} ${r.q.unit||''}</b></div>
                    </div>
                `).join('')}
            </div>
            <div class="btn-row">
                <button class="btn btn-primary" onclick="resetTest()">New Test</button>
            </div>
        </div>
    `;
}

function resetTest() {
    document.getElementById('test-setup').style.display = 'block';
    document.getElementById('test-active').style.display = 'none';
    document.getElementById('test-result').style.display = 'none';
}

// CUSTOM TAB
function loadFile(e) {
    const file = e.target.files[0];
    if (file) loadFileData(file);
}

function loadFileData(file) {
    const reader = new FileReader();
    reader.onload = e => {
        try {
            const quiz = JSON.parse(e.target.result);
            addQuiz(quiz, file.name);
        } catch (err) {
            alert('Invalid JSON');
        }
    };
    reader.readAsText(file);
}

async function loadURL() {
    const url = document.getElementById('url-inp').value.trim();
    const msg = document.getElementById('url-msg');
    
    if (!url) { msg.textContent = 'Enter URL'; msg.className = 'error'; return; }
    
    msg.textContent = 'Loading...';
    msg.className = '';
    
    try {
        const base = document.getElementById('base-url').value.trim();
        const fullUrl = base && !url.startsWith('http') ? base + url : url;
        const res = await fetch(fullUrl);
        if (!res.ok) throw new Error('HTTP ' + res.status);
        const quiz = await res.json();
        addQuiz(quiz, url);
        msg.textContent = '✓ Loaded!';
        msg.className = 'success';
        document.getElementById('url-inp').value = '';
    } catch (err) {
        msg.textContent = '✗ ' + err.message;
        msg.className = 'error';
    }
}

function addQuiz(quiz, src) {
    if (!quiz.questions || !Array.isArray(quiz.questions)) {
        alert('Invalid quiz format');
        return;
    }
    quiz.id = Date.now();
    quiz.title = quiz.title || 'Untitled';
    quiz.source = src;
    quizzes.push(quiz);
    renderQuizLib();
}

function renderQuizLib() {
    const lib = document.getElementById('quiz-lib');
    if (quizzes.length === 0) {
        lib.innerHTML = '<p class="empty">No quizzes loaded</p>';
        return;
    }
    lib.innerHTML = quizzes.map((q,i) => `
        <div class="quiz-card">
            <h4>${q.title}</h4>
            <p>${q.questions.length} questions</p>
            <div class="quiz-card-btns">
                <button class="start-btn" onclick="startCustomQuiz(${i})">▶ Start</button>
                <button class="del-btn" onclick="deleteQuiz(${i})">🗑</button>
            </div>
        </div>
    `).join('');
}

function deleteQuiz(i) {
    quizzes.splice(i, 1);
    renderQuizLib();
}

function addServerQuiz() {
    const name = document.getElementById('sq-name').value.trim();
    const path = document.getElementById('sq-path').value.trim();
    if (!name || !path) return;
    
    serverQuizzes.push({name, path});
    localStorage.setItem('serverQuizzes', JSON.stringify(serverQuizzes));
    renderServerList();
    
    document.getElementById('sq-name').value = '';
    document.getElementById('sq-path').value = '';
}

function renderServerList() {
    const list = document.getElementById('server-list');
    if (serverQuizzes.length === 0) { list.innerHTML = ''; return; }
    
    list.innerHTML = serverQuizzes.map((s,i) => `
        <div class="server-item">
            <span>${s.name}</span>
            <div>
                <button onclick="loadServerQ(${i})">Load</button>
                <button class="del-btn" onclick="delServerQ(${i})">✕</button>
            </div>
        </div>
    `).join('');
}

async function loadServerQ(i) {
    const s = serverQuizzes[i];
    const base = document.getElementById('base-url').value.trim();
    const url = base ? base + s.path : s.path;
    
    try {
        const res = await fetch(url);
        const quiz = await res.json();
        addQuiz(quiz, s.name);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

function delServerQ(i) {
    serverQuizzes.splice(i, 1);
    localStorage.setItem('serverQuizzes', JSON.stringify(serverQuizzes));
    renderServerList();
}

function startCustomQuiz(i) {
    const quiz = quizzes[i];
    customState.quiz = quiz;
    customState.curr = 0;
    customState.ans = new Array(quiz.questions.length).fill(null);
    
    // Hide main content, show quiz
    document.querySelector('#custom h2').style.display = 'none';
    document.querySelector('#custom > p').style.display = 'none';
    document.querySelector('.custom-sections').style.display = 'none';
    document.querySelector('.library-section').style.display = 'none';
    
    const area = document.getElementById('custom-quiz-area');
    area.style.display = 'block';
    
    if (quiz.timeLimit) {
        customState.start = Date.now();
        customState.timeLimit = quiz.timeLimit;
    }
    
    showCustomQ();
}

function showCustomQ() {
    const quiz = customState.quiz;
    const q = quiz.questions[customState.curr];
    const area = document.getElementById('custom-quiz-area');
    
    const isLast = customState.curr === quiz.questions.length - 1;
    
    area.innerHTML = `
        <div class="test-top">
            <div class="timer">${quiz.timeLimit ? (quiz.timeLimit + ':00') : '∞'}</div>
            <div class="progress-info">
                Question ${customState.curr + 1} / ${quiz.questions.length}
                <div class="prog-bar"><div class="prog-fill" style="width:${(customState.curr/quiz.questions.length)*100}%"></div></div>
            </div>
            <button class="btn btn-ghost" onclick="exitCustomQuiz()">✕ Exit</button>
        </div>
        <div class="question-box">
            <div class="q-text">${q.question}</div>
            ${q.type === 'mcq' && q.options ? `
                <div class="mcq-list">${q.options.map((o,j) => 
                    `<div class="mcq-item ${customState.ans[customState.curr]===j?'selected':''}" onclick="customSelectMCQ(${j})" data-idx="${j}">
                        <span class="mcq-letter">${String.fromCharCode(65+j)}</span>
                        <span>${o}</span>
                    </div>`).join('')}</div>
            ` : `
                <div class="answer-row">
                    <input type="${q.type==='text'?'text':'number'}" id="cust-inp" value="${customState.ans[customState.curr]||''}" placeholder="Answer">
                    ${q.unit ? `<span class="unit-box">${q.unit}</span>` : ''}
                </div>
            `}
        </div>
        <div class="nav-btns">
            <button onclick="customPrev()">← Prev</button>
            <button onclick="${isLast ? 'finishCustomQuiz()' : 'customNext()'}">${isLast ? '✓ Finish' : 'Next →'}</button>
        </div>
    `;
    
    const inp = document.getElementById('cust-inp');
    if (inp) {
        inp.focus();
        inp.oninput = () => { customState.ans[customState.curr] = inp.value; };
    }
}

function customSelectMCQ(j) {
    customState.ans[customState.curr] = j;
    showCustomQ();
}

function customPrev() {
    if (customState.curr > 0) { customState.curr--; showCustomQ(); }
}

function customNext() {
    if (customState.curr < customState.quiz.questions.length - 1) { customState.curr++; showCustomQ(); }
}

function finishCustomQuiz() {
    const quiz = customState.quiz;
    let correct = 0;
    
    quiz.questions.forEach((q, i) => {
        const a = customState.ans[i];
        let ok = false;
        
        if (q.type === 'mcq') ok = a === q.answer;
        else if (q.type === 'text') ok = (a||'').trim().toLowerCase() === (q.answer+'').toLowerCase();
        else {
            const v = parseFloat(a);
            ok = !isNaN(v) && Math.abs(v - q.answer) <= (q.tolerance || 0.01);
        }
        
        if (ok) correct++;
    });
    
    const pct = Math.round(correct / quiz.questions.length * 100);
    let grade, cls;
    if (pct >= 90) { grade = 'Excellent'; cls = 'excellent'; }
    else if (pct >= 70) { grade = 'Good'; cls = 'good'; }
    else if (pct >= 50) { grade = 'Average'; cls = 'average'; }
    else { grade = 'Needs Work'; cls = 'poor'; }
    
    document.getElementById('custom-quiz-area').innerHTML = `
        <div class="result-box">
            <div class="score-circle ${cls}">
                <div class="percent">${pct}%</div>
                <div class="grade">${grade}</div>
            </div>
            <h2>${quiz.title} - Complete!</h2>
            <div class="result-stats">
                <div class="result-stat"><div class="val">${correct}</div><div class="lbl">Correct</div></div>
                <div class="result-stat"><div class="val">${quiz.questions.length}</div><div class="lbl">Total</div></div>
            </div>
            <div class="btn-row">
                <button class="btn btn-primary" onclick="exitCustomQuiz()">Back</button>
            </div>
        </div>
    `;
}

function exitCustomQuiz() {
    document.querySelector('#custom h2').style.display = '';
    document.querySelector('#custom > p').style.display = '';
    document.querySelector('.custom-sections').style.display = '';
    document.querySelector('.library-section').style.display = '';
    document.getElementById('custom-quiz-area').style.display = 'none';
}

function showHelp() {
    document.getElementById('help-modal').classList.add('show');
}

function closeHelp() {
    document.getElementById('help-modal').classList.remove('show');
}

// Close modals on background click
document.querySelectorAll('.modal').forEach(m => {
    m.onclick = e => {
        if (e.target === m) m.classList.remove('show');
    };
});