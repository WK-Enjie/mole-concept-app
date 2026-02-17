/* =========================================
   1. CONSTANTS & DATA
   ========================================= */
const CHEMICALS = [
    { name: "NaOH", mr: 40 }, { name: "H₂SO₄", mr: 98 }, { name: "CaCO₃", mr: 100 },
    { name: "HCl", mr: 36.5 }, { name: "CO₂", mr: 44 }, { name: "MgO", mr: 40 },
    { name: "H₂O", mr: 18 }, { name: "NH₃", mr: 17 }, { name: "Fe₂O₃", mr: 160 }
];

const TOPICS = [
    { id: 'mass', title: 'Moles & Mass', desc: 'm = n × Mr conversions' },
    { id: 'gas', title: 'Gas Volumes', desc: 'RTP & STP Calculations' },
    { id: 'conc', title: 'Concentration', desc: 'c = n / V calculations' },
    { id: 'limit', title: 'Limiting Reagents', desc: 'Find excess & theoretical yield' },
    { id: 'yield', title: '% Yield & Purity', desc: 'Efficiency calculations' },
    { id: 'empirical', title: 'Formulae', desc: 'Empirical & Molecular' },
    { id: 'titration', title: 'Titration', desc: 'Neutralization c₁V₁ = c₂V₂' },
    { id: 'ions', title: 'Ions & Stoichiometry', desc: 'Ions in solution & reacting masses' }
];

/* =========================================
   2. STATE
   ========================================= */
let state = {
    score: 0,
    streak: 0,
    currentTopic: null,
    currentQ: null,
    qCount: 0
};

/* =========================================
   3. INIT & NAVIGATION
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
    renderTopics();
    
    // Nav Buttons
    document.getElementById('nav-learn').onclick = () => switchView('view-topics');
    document.getElementById('nav-random').onclick = () => startPractice('random');
    document.getElementById('nav-quiz').onclick = () => switchView('view-quiz');
    document.getElementById('btn-exit').onclick = () => switchView('view-topics');

    // Controls
    document.getElementById('btn-submit').onclick = checkAnswer;
    document.getElementById('btn-next').onclick = nextQuestion;
    document.getElementById('btn-hint').onclick = () => document.getElementById('hint-box').classList.remove('hidden');
    
    // Enter Key
    document.getElementById('user-input').addEventListener('keypress', (e) => {
        if(e.key === 'Enter') checkAnswer();
    });
});

function switchView(viewId) {
    document.querySelectorAll('section').forEach(s => s.classList.add('hidden'));
    document.getElementById(viewId).classList.remove('hidden');
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    if(viewId === 'view-topics') document.getElementById('nav-learn').classList.add('active');
    if(viewId === 'view-quiz') document.getElementById('nav-quiz').classList.add('active');
}

function renderTopics() {
    const grid = document.getElementById('topics-grid');
    grid.innerHTML = TOPICS.map(t => `
        <div class="topic-card" onclick="startPractice('${t.id}')">
            <h3>${t.title}</h3>
            <p>${t.desc}</p>
        </div>
    `).join('');
}

/* =========================================
   4. CORE GAMEPLAY
   ========================================= */
function startPractice(topicId) {
    state.currentTopic = topicId;
    state.qCount = 0;
    
    switchView('view-practice');
    
    if(topicId === 'random') {
        document.getElementById('topic-title').textContent = "Random Practice";
        document.getElementById('nav-random').classList.add('active');
    } else {
        const t = TOPICS.find(x => x.id === topicId);
        document.getElementById('topic-title').textContent = t.title;
    }
    
    nextQuestion();
}

function nextQuestion() {
    // Determine Topic
    let activeTopic = state.currentTopic;
    if (activeTopic === 'random') {
        activeTopic = TOPICS[Math.floor(Math.random() * TOPICS.length)].id;
    }

    // Generate Question
    const q = generateQuestion(activeTopic);
    state.currentQ = q;
    state.qCount++;

    // Update UI
    document.getElementById('q-count').textContent = state.qCount;
    document.getElementById('q-text').innerHTML = q.text;
    document.getElementById('unit-label').textContent = q.unit;
    document.getElementById('hint-text').textContent = q.hint;
    document.getElementById('solution-content').innerHTML = q.solution;

    // Reset UI State
    document.getElementById('user-input').value = '';
    document.getElementById('user-input').disabled = false;
    document.getElementById('user-input').focus();
    
    document.getElementById('feedback').classList.add('hidden');
    document.getElementById('feedback').className = 'feedback hidden';
    document.getElementById('hint-box').classList.add('hidden');
    document.getElementById('solution-box').classList.add('hidden');
    
    document.getElementById('btn-submit').disabled = false;
    document.getElementById('btn-next').disabled = true;
}

function checkAnswer() {
    const input = document.getElementById('user-input');
    const val = parseFloat(input.value);
    
    if(isNaN(val)) return;

    const correct = state.currentQ.answer;
    // 5% Tolerance
    const tolerance = Math.max(Math.abs(correct * 0.05), 0.01); 
    const isCorrect = Math.abs(val - correct) <= tolerance;

    const fb = document.getElementById('feedback');
    fb.classList.remove('hidden');

    if(isCorrect) {
        state.score += 10 + state.streak;
        state.streak++;
        fb.textContent = `✅ Correct! (+${10 + state.streak} pts)`;
        fb.classList.add('correct');
    } else {
        state.streak = 0;
        fb.innerHTML = `❌ Incorrect. Answer: <b>${correct.toPrecision(4)}</b>`;
        fb.classList.add('wrong');
    }

    document.getElementById('score').textContent = state.score;
    document.getElementById('streak').textContent = state.streak;
    
    // Show solution
    document.getElementById('solution-box').classList.remove('hidden');
    input.disabled = true;
    document.getElementById('btn-submit').disabled = true;
    document.getElementById('btn-next').disabled = false;
    document.getElementById('btn-next').focus();
}

/* =========================================
   5. QUESTION GENERATOR LOGIC
   ========================================= */
const r = (min, max, dec=0) => parseFloat((Math.random() * (max - min) + min).toFixed(dec));
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const choice = (arr) => arr[Math.floor(Math.random() * arr.length)];

function generateQuestion(topic) {
    const chem = choice(CHEMICALS);

    switch(topic) {
        case 'mass':
            // 3 Variations
            const subTypeM = randInt(1, 3);
            if (subTypeM === 1) { // Mass -> Moles
                const m = r(1, 100, 1);
                const ans = m / chem.mr;
                return {
                    text: `Calculate moles in <b>${m} g</b> of <b>${chem.name}</b> (Mr=${chem.mr}).`,
                    answer: ans, unit: 'mol', hint: 'n = m / Mr',
                    solution: `n = ${m} / ${chem.mr} = <b>${ans.toFixed(3)}</b>`
                };
            } else if (subTypeM === 2) { // Moles -> Mass
                const n = r(0.1, 5, 2);
                const ans = n * chem.mr;
                return {
                    text: `Calculate mass of <b>${n} mol</b> of <b>${chem.name}</b>.`,
                    answer: ans, unit: 'g', hint: 'm = n × Mr',
                    solution: `m = ${n} × ${chem.mr} = <b>${ans.toFixed(1)}</b>`
                };
            } else { // Particles -> Moles
                const n = r(0.5, 3, 1);
                const parts = (n * 6.02).toFixed(2);
                return {
                    text: `How many moles are in <b>${parts} × 10²³</b> particles?`,
                    answer: n, unit: 'mol', hint: 'Divide by Avogadro (6.02)',
                    solution: `${parts} / 6.02 = <b>${n}</b>`
                };
            }

        case 'ions': 
            // 3 Variations: Mass Reacting, Ions from Conc, Precipitate
            const subTypeI = randInt(1, 3);
            
            if (subTypeI === 1) { // IONS IN SOLUTION
                const salts = [
                    {f:'MgCl₂', ions: 3, name:'Chloride', ionSymbol:'Cl⁻', nIon:2},
                    {f:'AlCl₃', ions: 4, name:'Chloride', ionSymbol:'Cl⁻', nIon:3},
                    {f:'Na₂SO₄', ions: 3, name:'Sodium', ionSymbol:'Na⁺', nIon:2},
                    {f:'Fe(NO₃)₃', ions: 4, name:'Nitrate', ionSymbol:'NO₃⁻', nIon:3}
                ];
                const s = choice(salts);
                const vol = r(100, 500, 0); // cm3
                const conc = r(0.1, 2.0, 1); // mol/dm3
                const molSalt = conc * (vol/1000);
                const ans = molSalt * s.nIon;
                
                return {
                    text: `Calculate the moles of <b>${s.name} ions (${s.ionSymbol})</b> in <b>${vol} cm³</b> of <b>${conc} mol/dm³ ${s.f}</b>.`,
                    answer: ans, unit: 'mol ions', 
                    hint: '1. Find moles of salt (n=cV). 2. Multiply by ion ratio.',
                    solution: `n(${s.f}) = ${conc} × (${vol}/1000) = ${molSalt.toFixed(3)} mol.<br>Ratio is 1:${s.nIon}.<br>n(ions) = ${molSalt.toFixed(3)} × ${s.nIon} = <b>${ans.toFixed(3)}</b>`
                };
            } 
            else if (subTypeI === 2) { // PRECIPITATE REACTION
                // Pb2+ + 2I- -> PbI2
                const volPb = r(20, 100, 0);
                const concPb = r(0.1, 0.5, 2);
                const molPb = (volPb/1000) * concPb;
                // Assume excess Iodide
                const ans = molPb * 461; // Mr PbI2 = 461
                
                return {
                    text: `<b>Pb(NO₃)₂ + 2KI → PbI₂ + 2KNO₃</b><br>Excess KI is added to <b>${volPb} cm³</b> of <b>${concPb} M Pb(NO₃)₂</b>.<br>Calculate mass of precipitate (Mr PbI₂ = 461).`,
                    answer: ans, unit: 'g',
                    hint: '1. Find moles Pb(NO₃)₂. 2. Ratio 1:1 to PbI₂. 3. Mass.',
                    solution: `n(Pb) = ${concPb} × (${volPb}/1000) = ${molPb} mol.<br>m = ${molPb} × 461 = <b>${ans.toFixed(2)}</b>`
                };
            } 
            else { // REACTING MASSES
                 // 2Mg + O2 -> 2MgO
                 const massMg = r(10, 50, 1);
                 const molMg = massMg / 24.3;
                 const ans = molMg * 40.3; // MgO
                 return {
                     text: `<b>2Mg + O₂ → 2MgO</b>.<br>Calculate mass of MgO produced from <b>${massMg} g</b> of Mg.<br>(Ar: Mg=24.3, O=16)`,
                     answer: ans, unit: 'g', hint: 'Mass -> Moles -> Ratio -> Mass',
                     solution: `n(Mg) = ${massMg}/24.3 = ${molMg.toFixed(2)} mol.<br>1:1 ratio.<br>m = ${molMg.toFixed(2)} × 40.3 = <b>${ans.toFixed(2)}</b>`
                 };
            }

        case 'gas':
            const subTypeG = randInt(1, 2);
            if(subTypeG === 1) {
                const v = r(12, 100, 1);
                return {
                    text: `Moles in <b>${v} dm³</b> gas at RTP?`,
                    answer: v/24, unit: 'mol', hint: 'n = V/24',
                    solution: `${v}/24 = <b>${(v/24).toFixed(3)}</b>`
                };
            } else {
                const m = r(10, 100, 0); // mass
                const gas = choice([{n:'CO₂', mr:44}, {n:'O₂', mr:32}, {n:'N₂', mr:28}]);
                const mol = m / gas.mr;
                const ans = mol * 24;
                return {
                    text: `Volume of <b>${m} g</b> of <b>${gas.n}</b> at RTP?`,
                    answer: ans, unit: 'dm³', hint: 'Find moles first, then V = n × 24',
                    solution: `n = ${m}/${gas.mr} = ${mol.toFixed(2)}.<br>V = ${mol.toFixed(2)} × 24 = <b>${ans.toFixed(2)}</b>`
                };
            }

        case 'conc':
            const c = r(0.1, 2.0, 2);
            const v = r(25, 500, 0);
            return {
                text: `Moles in <b>${v} cm³</b> of <b>${c} mol/dm³</b> solution?`,
                answer: c * (v/1000), unit: 'mol', hint: 'n = c × (V/1000)',
                solution: `${c} × (${v}/1000) = <b>${(c*(v/1000)).toFixed(4)}</b>`
            };

        case 'limit':
            // 2H2 + O2 -> 2H2O
            const h2 = r(2, 10, 1);
            const o2 = r(1, 10, 1);
            const neededO2 = h2 / 2;
            const excess = o2 > neededO2 ? (o2 - neededO2) : (h2 - (o2*2));
            const isO2Limit = o2 < neededO2;
            const leftover = isO2Limit ? 'H₂' : 'O₂';
            return {
                text: `<b>2H₂ + O₂ → 2H₂O</b><br>Reacting <b>${h2} mol H₂</b> with <b>${o2} mol O₂</b>.<br>Calculate moles of excess reactant remaining.`,
                answer: Math.max(0, excess), unit: 'mol', 
                hint: 'Ratio is 2:1. Check which runs out first.',
                solution: `${isO2Limit ? 'O₂' : 'H₂'} limits.<br>Remaining ${leftover} = <b>${excess.toFixed(2)}</b>`
            };

        case 'yield':
            const theo = r(20, 100, 1);
            const act = r(theo*0.5, theo*0.9, 1);
            return {
                text: `Theoretical: <b>${theo}g</b>. Actual: <b>${act}g</b>.<br>Calculate % Yield.`,
                answer: (act/theo)*100, unit: '%', hint: '(Actual/Theo) * 100',
                solution: `${act}/${theo} * 100 = <b>${((act/theo)*100).toFixed(1)}</b>`
            };
            
        case 'titration':
            // c1v1 = c2v2
            const c1 = r(0.1, 1.0, 2);
            const v1 = r(20, 50, 1);
            const v2 = r(20, 50, 1);
            const c2 = (c1*v1)/v2;
            return {
                text: `<b>${v1} cm³</b> of <b>${c1} M HCl</b> neutralizes <b>${v2} cm³</b> NaOH.<br>Calculate [NaOH].`,
                answer: c2, unit: 'mol/dm³', hint: 'c₁V₁ = c₂V₂',
                solution: `(${c1}×${v1}) / ${v2} = <b>${c2.toFixed(3)}</b>`
            };
            
        case 'empirical':
            const x = randInt(1, 4);
            const mr = 12 + x;
            const pc = (12/mr)*100;
            const ph = (x/mr)*100;
            return {
                text: `Hydrocarbon: <b>${pc.toFixed(1)}% C</b>, <b>${ph.toFixed(1)}% H</b>.<br>Find <b>x</b> in CHₓ.`,
                answer: x, unit: '', hint: 'Divide % by Ar (C=12, H=1)',
                solution: `Ratio 1:${x}. x = <b>${x}</b>`
            };

        default:
             return { text: "Error", answer: 0 };
    }
}
