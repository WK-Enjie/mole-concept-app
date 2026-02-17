// ============================================
// MOLE MASTER - FIXED RANDOM PRACTICE
// ============================================

// --- CHEMICAL DATABASE ---
const CHEMICALS = [
    { name: "NaOH", mr: 40, fullName: "Sodium Hydroxide" },
    { name: "H₂SO₄", mr: 98, fullName: "Sulfuric Acid" },
    { name: "CaCO₃", mr: 100, fullName: "Calcium Carbonate" },
    { name: "HCl", mr: 36.5, fullName: "Hydrochloric Acid" },
    { name: "CO₂", mr: 44, fullName: "Carbon Dioxide" },
    { name: "MgO", mr: 40, fullName: "Magnesium Oxide" },
    { name: "NaCl", mr: 58.5, fullName: "Sodium Chloride" },
    { name: "H₂O", mr: 18, fullName: "Water" },
    { name: "NH₃", mr: 17, fullName: "Ammonia" },
    { name: "KOH", mr: 56, fullName: "Potassium Hydroxide" },
    { name: "CuSO₄", mr: 160, fullName: "Copper Sulfate" },
    { name: "Fe₂O₃", mr: 160, fullName: "Iron(III) Oxide" },
    { name: "Mg", mr: 24, fullName: "Magnesium" },
    { name: "Zn", mr: 65, fullName: "Zinc" },
    { name: "Cu", mr: 64, fullName: "Copper" },
    { name: "Al₂O₃", mr: 102, fullName: "Aluminium Oxide" },
    { name: "Na₂CO₃", mr: 106, fullName: "Sodium Carbonate" },
    { name: "KNO₃", mr: 101, fullName: "Potassium Nitrate" }
];

// --- 8 CONCEPTS ---
const CONCEPTS = [
    { 
        id: 'mass', 
        title: '1. Moles & Mass', 
        desc: 'Calculate moles from mass and molar mass',
        formula: 'n = m / Mᵣ',
        questions: 5
    },
    { 
        id: 'gas', 
        title: '2. Gas Volume', 
        desc: 'Molar volume at RTP (24 dm³/mol)',
        formula: 'n = V / 24',
        questions: 4
    },
    { 
        id: 'conc', 
        title: '3. Concentration', 
        desc: 'Solutions and molarity calculations',
        formula: 'n = c × V',
        questions: 5
    },
    { 
        id: 'limit', 
        title: '4. Limiting Reagent', 
        desc: 'Identify limiting and excess reactants',
        formula: 'Compare mole ratios',
        questions: 4
    },
    { 
        id: 'yield', 
        title: '5. Percentage Yield & Purity', 
        desc: 'Actual vs theoretical calculations',
        formula: '% = (actual/theo) × 100',
        questions: 5
    },
    { 
        id: 'empirical', 
        title: '6. Empirical & Molecular Formula', 
        desc: 'Find simplest whole number ratios',
        formula: 'Divide by smallest',
        questions: 5
    },
    { 
        id: 'titration', 
        title: '7. Titration Calculations', 
        desc: 'Acid-base neutralization',
        formula: 'n₁/n₂ = ratio',
        questions: 5
    },
    { 
        id: 'stoich', 
        title: '8. Stoichiometry & Reacting Masses', 
        desc: 'Mole ratios in balanced equations',
        formula: 'Use coefficients',
        questions: 5
    }
];

// --- APP STATE ---
const state = {
    score: 0,
    total: 0,
    correct: 0,
    streak: 0,
    currentAnswer: null,
    currentUnit: '',
    currentHint: '',
    currentSolution: '',
    activeMode: null,
    questionNumber: 0,
    quizData: [],
    quizIndex: 0,
    quizScore: 0
};

// --- INITIALIZATION ---
document.addEventListener('DOMContentLoaded', function() {
    console.log('Initializing Mole Master...');
    renderTopics();
    setupEventListeners();
    console.log('Mole Master ready!');
});

function setupEventListeners() {
    // Navigation buttons - FIXED
    document.querySelectorAll('.nav-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const tab = this.dataset.tab;
            console.log('Nav clicked:', tab);
            
            if (tab === 'practice') {
                // Directly start random practice
                startPractice('random');
            } else {
                switchTab(tab);
            }
        });
    });
    
    // Practice buttons
    document.getElementById('submit-btn').addEventListener('click', checkAnswer);
    document.getElementById('next-btn').addEventListener('click', nextQuestion);
    document.getElementById('hint-btn').addEventListener('click', showHint);
    document.getElementById('back-btn').addEventListener('click', function() {
        state.activeMode = null;
        switchTab('learn');
    });
    
    // Quiz buttons
    document.getElementById('load-quiz-btn').addEventListener('click', loadQuiz);
    document.getElementById('quiz-next-btn').addEventListener('click', submitQuizAnswer);
    
    // Enter key support
    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            checkAnswer();
        }
    });
    
    document.getElementById('quiz-input').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            submitQuizAnswer();
        }
    });
}

function renderTopics() {
    const container = document.getElementById('topics-container');
    container.innerHTML = CONCEPTS.map(c => `
        <button class="topic-btn" data-mode="${c.id}">
            <h4>${c.title}</h4>
            <p>${c.desc}</p>
            <span class="formula">${c.formula}</span>
        </button>
    `).join('');
    
    // Add click handlers to topic buttons
    container.querySelectorAll('.topic-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const mode = this.dataset.mode;
            console.log('Topic clicked:', mode);
            startPractice(mode);
        });
    });
}

// --- NAVIGATION --- FIXED
function switchTab(tabId) {
    console.log('Switching to tab:', tabId);
    
    // Hide all tabs
    document.querySelectorAll('.tab-content').forEach(el => {
        el.classList.remove('active');
    });
    
    // Show selected tab
    const targetTab = document.getElementById(tabId);
    if (targetTab) {
        targetTab.classList.add('active');
    }
    
    // Update nav buttons
    document.querySelectorAll('.nav-btn').forEach(el => {
        el.classList.remove('active');
    });
    
    const targetBtn = document.querySelector(`.nav-btn[data-tab="${tabId}"]`);
    if (targetBtn) {
        targetBtn.classList.add('active');
    }
}

function startPractice(mode) {
    console.log('Starting practice mode:', mode);
    
    state.activeMode = mode;
    state.questionNumber = 0;
    
    // Switch to practice tab
    switchTab('practice');
    
    // Update header
    if (mode === 'random') {
        document.getElementById('mode-title').textContent = 'Random Practice';
        document.getElementById('topic-tag').textContent = 'All Topics';
    } else {
        const concept = CONCEPTS.find(c => c.id === mode);
        if (concept) {
            document.getElementById('mode-title').textContent = concept.title;
            document.getElementById('topic-tag').textContent = concept.formula;
        }
    }
    
    // Generate first question
    nextQuestion();
}

// ============================================
// QUESTION GENERATION - FIXED
// ============================================

function nextQuestion() {
    console.log('Generating next question, mode:', state.activeMode);
    
    // Reset UI
    document.getElementById('user-input').value = '';
    document.getElementById('user-input').focus();
    document.getElementById('feedback-area').textContent = '';
    document.getElementById('feedback-area').className = 'feedback-msg';
    document.getElementById('solution-area').style.display = 'none';
    document.getElementById('hint-box').style.display = 'none';
    document.getElementById('submit-btn').disabled = false;
    
    state.questionNumber++;
    document.getElementById('q-number').textContent = state.questionNumber;
    
    // Determine which mode to use
    let mode = state.activeMode;
    
    // For random mode, pick a random concept
    if (mode === 'random' || !mode) {
        const randomIndex = Math.floor(Math.random() * CONCEPTS.length);
        mode = CONCEPTS[randomIndex].id;
        console.log('Random selected concept:', mode);
    }
    
    // Generate question based on mode
    let questionData;
    
    try {
        switch(mode) {
            case 'mass':
                questionData = generateMassQuestion();
                break;
            case 'gas':
                questionData = generateGasQuestion();
                break;
            case 'conc':
                questionData = generateConcQuestion();
                break;
            case 'limit':
                questionData = generateLimitQuestion();
                break;
            case 'yield':
                questionData = generateYieldQuestion();
                break;
            case 'empirical':
                questionData = generateEmpiricalQuestion();
                break;
            case 'titration':
                questionData = generateTitrationQuestion();
                break;
            case 'stoich':
                questionData = generateStoichQuestion();
                break;
            default:
                console.log('Unknown mode, defaulting to mass');
                questionData = generateMassQuestion();
        }
        
        console.log('Generated question:', questionData);
        
        // Apply to UI
        document.getElementById('q-text').innerHTML = questionData.question;
        document.getElementById('unit-display').textContent = questionData.unit;
        document.getElementById('hint-text').textContent = questionData.hint;
        
        state.currentAnswer = questionData.answer;
        state.currentUnit = questionData.unit;
        state.currentHint = questionData.hint;
        state.currentSolution = questionData.solution;
        
    } catch (error) {
        console.error('Error generating question:', error);
        document.getElementById('q-text').innerHTML = 'Error generating question. Click Next to try again.';
    }
}

// ========================================
// CONCEPT 1: MOLES & MASS (5 question types)
// ========================================
function generateMassQuestion() {
    const chem = randomChoice(CHEMICALS);
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            const mass = randomNum(5, 100, 1);
            const answer = mass / chem.mr;
            return {
                question: `Calculate the number of moles in <b>${mass} g</b> of <b>${chem.name}</b>.<br><small>Mᵣ of ${chem.name} = ${chem.mr}</small>`,
                answer: answer,
                unit: 'mol',
                hint: 'Use: n = m ÷ Mᵣ',
                solution: `n = m ÷ Mᵣ = ${mass} ÷ ${chem.mr} = <b>${answer.toFixed(4)} mol</b>`
            };
        }
        case 2: {
            const moles = randomNum(0.1, 5, 2);
            const answer = moles * chem.mr;
            return {
                question: `Calculate the mass of <b>${moles} mol</b> of <b>${chem.name}</b>.<br><small>Mᵣ of ${chem.name} = ${chem.mr}</small>`,
                answer: answer,
                unit: 'g',
                hint: 'Rearrange to: m = n × Mᵣ',
                solution: `m = n × Mᵣ = ${moles} × ${chem.mr} = <b>${answer.toFixed(2)} g</b>`
            };
        }
        case 3: {
            const moles = randomNum(0.5, 4, 2);
            const mass = moles * chem.mr;
            return {
                question: `A sample contains <b>${moles} mol</b> and has mass <b>${mass.toFixed(1)} g</b>.<br>Calculate the molar mass (Mᵣ).`,
                answer: chem.mr,
                unit: 'g/mol',
                hint: 'Rearrange to: Mᵣ = m ÷ n',
                solution: `Mᵣ = m ÷ n = ${mass.toFixed(1)} ÷ ${moles} = <b>${chem.mr} g/mol</b>`
            };
        }
        case 4: {
            const moles = randomNum(0.1, 2, 2);
            const particles = moles * 6.02;
            return {
                question: `A sample contains <b>${particles.toFixed(2)} × 10²³</b> particles.<br>How many moles is this?<br><small>Avogadro's number = 6.02 × 10²³</small>`,
                answer: moles,
                unit: 'mol',
                hint: 'n = particles ÷ Avogadro\'s number',
                solution: `n = ${particles.toFixed(2)} × 10²³ ÷ 6.02 × 10²³ = <b>${moles.toFixed(2)} mol</b>`
            };
        }
        case 5: {
            const mass = randomNum(10, 50, 0);
            const moles = mass / chem.mr;
            const particles = moles * 6.02;
            return {
                question: `How many particles (×10²³) are in <b>${mass} g</b> of <b>${chem.name}</b>?<br><small>Mᵣ = ${chem.mr}, Nₐ = 6.02 × 10²³</small>`,
                answer: particles,
                unit: '×10²³',
                hint: 'First find moles, then multiply by 6.02',
                solution: `n = ${mass} ÷ ${chem.mr} = ${moles.toFixed(3)} mol<br>Particles = ${moles.toFixed(3)} × 6.02 = <b>${particles.toFixed(2)} × 10²³</b>`
            };
        }
        default:
            return generateMassQuestion();
    }
}

// ========================================
// CONCEPT 2: GAS VOLUME (4 question types)
// ========================================
function generateGasQuestion() {
    const type = randomInt(1, 4);
    
    switch(type) {
        case 1: {
            const volume = randomNum(6, 120, 1);
            const answer = volume / 24;
            return {
                question: `Calculate the moles in <b>${volume} dm³</b> of gas at RTP.<br><small>Molar volume at RTP = 24 dm³/mol</small>`,
                answer: answer,
                unit: 'mol',
                hint: 'At RTP: n = V ÷ 24',
                solution: `n = V ÷ 24 = ${volume} ÷ 24 = <b>${answer.toFixed(3)} mol</b>`
            };
        }
        case 2: {
            const moles = randomNum(0.25, 5, 2);
            const answer = moles * 24;
            return {
                question: `What volume does <b>${moles} mol</b> of gas occupy at RTP?<br><small>Molar volume = 24 dm³/mol</small>`,
                answer: answer,
                unit: 'dm³',
                hint: 'V = n × 24',
                solution: `V = n × 24 = ${moles} × 24 = <b>${answer.toFixed(2)} dm³</b>`
            };
        }
        case 3: {
            const volume = randomNum(11.2, 112, 1);
            const answer = volume / 22.4;
            return {
                question: `Calculate moles in <b>${volume} dm³</b> of gas at STP.<br><small>Molar volume at STP = 22.4 dm³/mol</small>`,
                answer: answer,
                unit: 'mol',
                hint: 'At STP: n = V ÷ 22.4',
                solution: `n = V ÷ 22.4 = ${volume} ÷ 22.4 = <b>${answer.toFixed(3)} mol</b>`
            };
        }
        case 4: {
            const gases = [
                { name: "O₂", mr: 32 },
                { name: "CO₂", mr: 44 },
                { name: "N₂", mr: 28 },
                { name: "H₂", mr: 2 },
                { name: "Cl₂", mr: 71 }
            ];
            const gas = randomChoice(gases);
            const mass = randomNum(5, 50, 1);
            const moles = mass / gas.mr;
            const answer = moles * 24;
            return {
                question: `What volume does <b>${mass} g</b> of <b>${gas.name}</b> occupy at RTP?<br><small>Mᵣ = ${gas.mr}, Molar volume = 24 dm³/mol</small>`,
                answer: answer,
                unit: 'dm³',
                hint: 'First find moles (n = m/Mᵣ), then volume (V = n × 24)',
                solution: `n = ${mass} ÷ ${gas.mr} = ${moles.toFixed(4)} mol<br>V = ${moles.toFixed(4)} × 24 = <b>${answer.toFixed(2)} dm³</b>`
            };
        }
        default:
            return generateGasQuestion();
    }
}

// ========================================
// CONCEPT 3: CONCENTRATION (5 question types)
// ========================================
function generateConcQuestion() {
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            const conc = randomNum(0.1, 2, 2);
            const vol = randomNum(25, 250, 0);
            const answer = conc * (vol / 1000);
            return {
                question: `Calculate the moles in <b>${vol} cm³</b> of <b>${conc} mol/dm³</b> solution.`,
                answer: answer,
                unit: 'mol',
                hint: 'n = c × V (convert cm³ to dm³ by ÷1000)',
                solution: `V = ${vol} ÷ 1000 = ${(vol/1000).toFixed(4)} dm³<br>n = ${conc} × ${(vol/1000).toFixed(4)} = <b>${answer.toFixed(4)} mol</b>`
            };
        }
        case 2: {
            const moles = randomNum(0.01, 0.2, 3);
            const vol = randomNum(100, 500, 0);
            const answer = moles / (vol / 1000);
            return {
                question: `<b>${moles} mol</b> of solute is in <b>${vol} cm³</b> of solution.<br>Calculate the concentration.`,
                answer: answer,
                unit: 'mol/dm³',
                hint: 'c = n ÷ V (V in dm³)',
                solution: `V = ${vol} ÷ 1000 = ${(vol/1000).toFixed(3)} dm³<br>c = ${moles} ÷ ${(vol/1000).toFixed(3)} = <b>${answer.toFixed(3)} mol/dm³</b>`
            };
        }
        case 3: {
            const conc = randomNum(0.1, 1, 2);
            const moles = randomNum(0.02, 0.1, 3);
            const answer = (moles / conc) * 1000;
            return {
                question: `What volume (cm³) of <b>${conc} mol/dm³</b> solution contains <b>${moles} mol</b>?`,
                answer: answer,
                unit: 'cm³',
                hint: 'V = n ÷ c (then ×1000 for cm³)',
                solution: `V = ${moles} ÷ ${conc} = ${(moles/conc).toFixed(4)} dm³<br>= <b>${answer.toFixed(1)} cm³</b>`
            };
        }
        case 4: {
            const chem = randomChoice(CHEMICALS);
            const conc = randomNum(0.1, 1, 2);
            const answer = conc * chem.mr;
            return {
                question: `A solution of <b>${chem.name}</b> has concentration <b>${conc} mol/dm³</b>.<br>Express in g/dm³.<br><small>Mᵣ = ${chem.mr}</small>`,
                answer: answer,
                unit: 'g/dm³',
                hint: 'g/dm³ = mol/dm³ × Mᵣ',
                solution: `c = ${conc} × ${chem.mr} = <b>${answer.toFixed(2)} g/dm³</b>`
            };
        }
        case 5: {
            const chem = randomChoice(CHEMICALS);
            const concGram = randomNum(10, 100, 0);
            const answer = concGram / chem.mr;
            return {
                question: `A solution of <b>${chem.name}</b> has concentration <b>${concGram} g/dm³</b>.<br>Convert to mol/dm³.<br><small>Mᵣ = ${chem.mr}</small>`,
                answer: answer,
                unit: 'mol/dm³',
                hint: 'mol/dm³ = g/dm³ ÷ Mᵣ',
                solution: `c = ${concGram} ÷ ${chem.mr} = <b>${answer.toFixed(3)} mol/dm³</b>`
            };
        }
        default:
            return generateConcQuestion();
    }
}

// ========================================
// CONCEPT 4: LIMITING REAGENT (4 question types)
// ========================================
function generateLimitQuestion() {
    const scenarios = [
        { eq: '2H₂ + O₂ → 2H₂O', A: 'H₂', rA: 2, B: 'O₂', rB: 1, P: 'H₂O', rP: 2 },
        { eq: 'N₂ + 3H₂ → 2NH₃', A: 'N₂', rA: 1, B: 'H₂', rB: 3, P: 'NH₃', rP: 2 },
        { eq: '2Mg + O₂ → 2MgO', A: 'Mg', rA: 2, B: 'O₂', rB: 1, P: 'MgO', rP: 2 },
        { eq: '2Al + 3Cl₂ → 2AlCl₃', A: 'Al', rA: 2, B: 'Cl₂', rB: 3, P: 'AlCl₃', rP: 2 }
    ];
    
    const s = randomChoice(scenarios);
    const mA = randomNum(1, 6, 1);
    const mB = randomNum(1, 6, 1);
    
    // Determine limiting reagent
    const neededB = (mA / s.rA) * s.rB;
    const limitingIsB = mB < neededB;
    const limiting = limitingIsB ? s.B : s.A;
    const excess = limitingIsB ? s.A : s.B;
    
    const limitMoles = limitingIsB ? mB : mA;
    const limitRatio = limitingIsB ? s.rB : s.rA;
    const excessMoles = limitingIsB ? mA : mB;
    const excessRatio = limitingIsB ? s.rA : s.rB;
    
    const usedExcess = (limitMoles / limitRatio) * excessRatio;
    const remaining = excessMoles - usedExcess;
    const product = (limitMoles / limitRatio) * s.rP;
    
    const type = randomInt(1, 4);
    
    switch(type) {
        case 1: {
            return {
                question: `<b>${s.eq}</b><br><br>You have <b>${mA} mol ${s.A}</b> and <b>${mB} mol ${s.B}</b>.<br><br>How many moles of <b>${excess}</b> remain unreacted?`,
                answer: remaining,
                unit: 'mol',
                hint: 'Find limiting reagent first, then calculate excess used',
                solution: `${limiting} is limiting.<br>Used ${excess} = ${usedExcess.toFixed(2)} mol<br>Remaining = ${excessMoles} - ${usedExcess.toFixed(2)} = <b>${remaining.toFixed(2)} mol</b>`
            };
        }
        case 2: {
            return {
                question: `<b>${s.eq}</b><br><br>You react <b>${mA} mol ${s.A}</b> with <b>${mB} mol ${s.B}</b>.<br><br>How many moles of <b>${s.P}</b> form?`,
                answer: product,
                unit: 'mol',
                hint: 'Find limiting reagent, then use mole ratio',
                solution: `${limiting} is limiting (${limitMoles} mol).<br>Product = (${limitMoles} ÷ ${limitRatio}) × ${s.rP} = <b>${product.toFixed(2)} mol</b>`
            };
        }
        case 3: {
            const ansNum = limiting === s.A ? 1 : 2;
            return {
                question: `<b>${s.eq}</b><br><br>You have <b>${mA} mol ${s.A}</b> and <b>${mB} mol ${s.B}</b>.<br><br>Which is limiting? Enter <b>1</b> for ${s.A} or <b>2</b> for ${s.B}`,
                answer: ansNum,
                unit: '',
                hint: 'Compare actual ratio to required ratio',
                solution: `Required ratio ${s.A}:${s.B} = ${s.rA}:${s.rB}<br>Limiting reagent is <b>${limiting}</b> (answer: ${ansNum})`
            };
        }
        case 4: {
            const needed = limitingIsB ? (neededB - mB) : ((mB / s.rB) * s.rA - mA);
            return {
                question: `<b>${s.eq}</b><br><br>You have <b>${mA} mol ${s.A}</b> and <b>${mB} mol ${s.B}</b>.<br><br>How many more moles of <b>${limiting}</b> needed for complete reaction?`,
                answer: Math.abs(needed),
                unit: 'mol',
                hint: 'Calculate how much limiting reagent would be needed',
                solution: `Additional ${limiting} needed = <b>${Math.abs(needed).toFixed(2)} mol</b>`
            };
        }
        default:
            return generateLimitQuestion();
    }
}

// ========================================
// CONCEPT 5: PERCENTAGE YIELD & PURITY
// ========================================
function generateYieldQuestion() {
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            const theo = randomNum(10, 100, 1);
            const actual = randomNum(theo * 0.5, theo * 0.95, 1);
            const answer = (actual / theo) * 100;
            return {
                question: `Theoretical yield: <b>${theo} g</b><br>Actual yield: <b>${actual} g</b><br><br>Calculate percentage yield.`,
                answer: answer,
                unit: '%',
                hint: '% yield = (actual ÷ theoretical) × 100',
                solution: `% = (${actual} ÷ ${theo}) × 100 = <b>${answer.toFixed(1)}%</b>`
            };
        }
        case 2: {
            const theo = randomNum(20, 80, 0);
            const percent = randomNum(60, 95, 0);
            const answer = (percent / 100) * theo;
            return {
                question: `Theoretical yield: <b>${theo} g</b><br>Percentage yield: <b>${percent}%</b><br><br>Find actual yield.`,
                answer: answer,
                unit: 'g',
                hint: 'Actual = (% ÷ 100) × theoretical',
                solution: `Actual = (${percent} ÷ 100) × ${theo} = <b>${answer.toFixed(1)} g</b>`
            };
        }
        case 3: {
            const actual = randomNum(15, 60, 1);
            const percent = randomNum(55, 90, 0);
            const answer = (actual / percent) * 100;
            return {
                question: `Actual yield: <b>${actual} g</b><br>Percentage yield: <b>${percent}%</b><br><br>Find theoretical yield.`,
                answer: answer,
                unit: 'g',
                hint: 'Theoretical = actual ÷ (% ÷ 100)',
                solution: `Theoretical = ${actual} ÷ ${(percent/100).toFixed(2)} = <b>${answer.toFixed(1)} g</b>`
            };
        }
        case 4: {
            const total = randomNum(50, 200, 0);
            const pure = randomNum(total * 0.7, total * 0.98, 1);
            const answer = (pure / total) * 100;
            return {
                question: `Sample mass: <b>${total} g</b><br>Pure substance: <b>${pure} g</b><br><br>Calculate percentage purity.`,
                answer: answer,
                unit: '%',
                hint: '% purity = (pure ÷ total) × 100',
                solution: `% = (${pure} ÷ ${total}) × 100 = <b>${answer.toFixed(1)}%</b>`
            };
        }
        case 5: {
            const total = randomNum(100, 500, 0);
            const purity = randomNum(80, 98, 0);
            const answer = (purity / 100) * total;
            return {
                question: `Sample mass: <b>${total} g</b><br>Purity: <b>${purity}%</b><br><br>Find mass of pure substance.`,
                answer: answer,
                unit: 'g',
                hint: 'Pure mass = (% ÷ 100) × total',
                solution: `Pure = (${purity} ÷ 100) × ${total} = <b>${answer.toFixed(1)} g</b>`
            };
        }
        default:
            return generateYieldQuestion();
    }
}

// ========================================
// CONCEPT 6: EMPIRICAL & MOLECULAR FORMULA
// ========================================
function generateEmpiricalQuestion() {
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            const formulas = [
                { pC: 80, pH: 20, x: 3, emp: 'CH₃' },
                { pC: 75, pH: 25, x: 4, emp: 'CH₄' },
                { pC: 85.7, pH: 14.3, x: 2, emp: 'CH₂' },
                { pC: 92.3, pH: 7.7, x: 1, emp: 'CH' }
            ];
            const f = randomChoice(formulas);
            return {
                question: `A hydrocarbon: <b>${f.pC}%</b> Carbon, <b>${f.pH}%</b> Hydrogen.<br><br>Find <b>x</b> in empirical formula <b>CHₓ</b>.`,
                answer: f.x,
                unit: '',
                hint: 'Divide % by Aᵣ (C=12, H=1), simplify ratio',
                solution: `C: ${f.pC}/12 = ${(f.pC/12).toFixed(2)}<br>H: ${f.pH}/1 = ${f.pH}<br>x = <b>${f.x}</b> (${f.emp})`
            };
        }
        case 2: {
            const formulas = [
                { pC: 40, pH: 6.7, pO: 53.3, hCount: 2, emp: 'CH₂O' },
                { pC: 52.2, pH: 13, pO: 34.8, hCount: 6, emp: 'C₂H₆O' }
            ];
            const f = randomChoice(formulas);
            return {
                question: `Compound: <b>${f.pC}%</b> C, <b>${f.pH}%</b> H, <b>${f.pO}%</b> O.<br><br>How many H atoms in empirical formula?`,
                answer: f.hCount,
                unit: '',
                hint: 'Divide each % by Aᵣ, find simplest ratio',
                solution: `Empirical formula: <b>${f.emp}</b><br>H atoms = <b>${f.hCount}</b>`
            };
        }
        case 3: {
            const data = [
                { emp: 'CH₂O', empMr: 30, actMr: 60, n: 2 },
                { emp: 'CH₂O', empMr: 30, actMr: 180, n: 6 },
                { emp: 'CH₂', empMr: 14, actMr: 42, n: 3 },
                { emp: 'CH', empMr: 13, actMr: 78, n: 6 }
            ];
            const d = randomChoice(data);
            return {
                question: `Empirical formula: <b>${d.emp}</b> (Mᵣ = ${d.empMr})<br>Actual Mᵣ: <b>${d.actMr}</b><br><br>Find <b>n</b> in (${d.emp})ₙ`,
                answer: d.n,
                unit: '',
                hint: 'n = Actual Mᵣ ÷ Empirical Mᵣ',
                solution: `n = ${d.actMr} ÷ ${d.empMr} = <b>${d.n}</b>`
            };
        }
        case 4: {
            const compounds = [
                { formula: 'CH₄', mr: 16 },
                { formula: 'H₂O', mr: 18 },
                { formula: 'CO₂', mr: 44 },
                { formula: 'NH₃', mr: 17 },
                { formula: 'C₂H₆', mr: 30 }
            ];
            const c = randomChoice(compounds);
            return {
                question: `Calculate the Mᵣ of <b>${c.formula}</b>.<br><small>Aᵣ: C=12, H=1, O=16, N=14</small>`,
                answer: c.mr,
                unit: '',
                hint: 'Add (Aᵣ × number of atoms) for each element',
                solution: `Mᵣ of ${c.formula} = <b>${c.mr}</b>`
            };
        }
        case 5: {
            const data = [
                { name: 'H₂O', mr: 18, el: 'O', mass: 16 },
                { name: 'CO₂', mr: 44, el: 'C', mass: 12 },
                { name: 'NaCl', mr: 58.5, el: 'Na', mass: 23 },
                { name: 'NH₃', mr: 17, el: 'N', mass: 14 }
            ];
            const d = randomChoice(data);
            const answer = (d.mass / d.mr) * 100;
            return {
                question: `Calculate % by mass of <b>${d.el}</b> in <b>${d.name}</b>.<br><small>Mᵣ = ${d.mr}</small>`,
                answer: answer,
                unit: '%',
                hint: '% = (mass of element ÷ Mᵣ) × 100',
                solution: `% = (${d.mass} ÷ ${d.mr}) × 100 = <b>${answer.toFixed(1)}%</b>`
            };
        }
        default:
            return generateEmpiricalQuestion();
    }
}

// ========================================
// CONCEPT 7: TITRATION
// ========================================
function generateTitrationQuestion() {
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            const cA = randomNum(0.05, 0.2, 3);
            const vA = randomNum(20, 30, 1);
            const vB = randomNum(15, 35, 1);
            const answer = (cA * vA) / vB;
            return {
                question: `<b>HCl + NaOH → NaCl + H₂O</b> (1:1)<br><br><b>${vA} cm³</b> of <b>${cA} mol/dm³ HCl</b> neutralizes <b>${vB} cm³</b> NaOH.<br><br>Find [NaOH].`,
                answer: answer,
                unit: 'mol/dm³',
                hint: 'c₁V₁ = c₂V₂ for 1:1 ratio',
                solution: `[NaOH] = (${cA} × ${vA}) ÷ ${vB} = <b>${answer.toFixed(4)} mol/dm³</b>`
            };
        }
        case 2: {
            const cA = randomNum(0.1, 0.3, 2);
            const cB = randomNum(0.1, 0.2, 2);
            const vB = randomNum(20, 30, 0);
            const answer = (cB * vB) / cA;
            return {
                question: `What volume of <b>${cA} mol/dm³ HCl</b> neutralizes <b>${vB} cm³</b> of <b>${cB} mol/dm³ NaOH</b>?`,
                answer: answer,
                unit: 'cm³',
                hint: 'V₁ = c₂V₂ ÷ c₁',
                solution: `V = (${cB} × ${vB}) ÷ ${cA} = <b>${answer.toFixed(1)} cm³</b>`
            };
        }
        case 3: {
            const cA = randomNum(0.05, 0.15, 3);
            const vA = randomNum(20, 30, 1);
            const vB = randomNum(25, 40, 1);
            const answer = (2 * cA * vA) / vB;
            return {
                question: `<b>H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O</b><br><br><b>${vA} cm³</b> of <b>${cA} mol/dm³ H₂SO₄</b> neutralizes <b>${vB} cm³</b> NaOH.<br><br>Find [NaOH].`,
                answer: answer,
                unit: 'mol/dm³',
                hint: 'Ratio 1:2, so n(NaOH) = 2 × n(H₂SO₄)',
                solution: `n(H₂SO₄) = ${cA} × ${(vA/1000).toFixed(4)}<br>n(NaOH) = 2 × n(H₂SO₄)<br>[NaOH] = <b>${answer.toFixed(4)} mol/dm³</b>`
            };
        }
        case 4: {
            const c = randomNum(0.1, 0.25, 3);
            const v = randomNum(20, 35, 1);
            const answer = c * (v / 1000);
            return {
                question: `In a titration, <b>${v} cm³</b> of <b>${c} mol/dm³</b> acid was used.<br><br>Calculate moles of acid.`,
                answer: answer,
                unit: 'mol',
                hint: 'n = c × V (convert cm³ to dm³)',
                solution: `n = ${c} × ${(v/1000).toFixed(4)} = <b>${answer.toFixed(5)} mol</b>`
            };
        }
        case 5: {
            const cA = randomNum(0.1, 0.2, 2);
            const vA = randomNum(20, 30, 1);
            const moles = cA * (vA / 1000);
            const answer = moles * 40;
            return {
                question: `<b>${vA} cm³</b> of <b>${cA} mol/dm³ HCl</b> neutralizes NaOH.<br><br>Find mass of NaOH.<br><small>Mᵣ NaOH = 40</small>`,
                answer: answer,
                unit: 'g',
                hint: 'Find moles from titration, then m = n × Mᵣ',
                solution: `n = ${cA} × ${(vA/1000).toFixed(4)} = ${moles.toFixed(5)} mol<br>m = ${moles.toFixed(5)} × 40 = <b>${answer.toFixed(3)} g</b>`
            };
        }
        default:
            return generateTitrationQuestion();
    }
}

// ========================================
// CONCEPT 8: STOICHIOMETRY
// ========================================
function generateStoichQuestion() {
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            const rxns = [
                { eq: 'MnO₄⁻ + 5Fe²⁺ → Mn²⁺ + 5Fe³⁺', A: 'MnO₄⁻', B: 'Fe²⁺', r: 5 },
                { eq: 'N₂ + 3H₂ → 2NH₃', A: 'N₂', B: 'H₂', r: 3 },
                { eq: '2H₂ + O₂ → 2H₂O', A: 'O₂', B: 'H₂O', r: 2 },
                { eq: 'C + O₂ → CO₂', A: 'C', B: 'CO₂', r: 1 }
            ];
            const rx = randomChoice(rxns);
            const mol = randomNum(0.1, 3, 2);
            const answer = mol * rx.r;
            return {
                question: `<b>${rx.eq}</b><br><br>If <b>${mol} mol</b> ${rx.A} reacts, how many moles of ${rx.B}?`,
                answer: answer,
                unit: 'mol',
                hint: 'Use coefficients for mole ratio',
                solution: `Ratio ${rx.A}:${rx.B} = 1:${rx.r}<br>Moles = ${mol} × ${rx.r} = <b>${answer.toFixed(3)} mol</b>`
            };
        }
        case 2: {
            const rxns = [
                { eq: '2Mg + O₂ → 2MgO', R: 'Mg', mrR: 24, P: 'MgO', mrP: 40, rR: 2, rP: 2 },
                { eq: 'CaCO₃ → CaO + CO₂', R: 'CaCO₃', mrR: 100, P: 'CaO', mrP: 56, rR: 1, rP: 1 }
            ];
            const rx = randomChoice(rxns);
            const massR = randomNum(10, 50, 1);
            const molR = massR / rx.mrR;
            const molP = (molR / rx.rR) * rx.rP;
            const answer = molP * rx.mrP;
            return {
                question: `<b>${rx.eq}</b><br><br>Mass of <b>${rx.P}</b> from <b>${massR} g</b> ${rx.R}?<br><small>Mᵣ: ${rx.R}=${rx.mrR}, ${rx.P}=${rx.mrP}</small>`,
                answer: answer,
                unit: 'g',
                hint: 'mass → moles → ratio → moles → mass',
                solution: `n(${rx.R}) = ${massR}/${rx.mrR} = ${molR.toFixed(4)}<br>n(${rx.P}) = ${molP.toFixed(4)}<br>m = ${molP.toFixed(4)} × ${rx.mrP} = <b>${answer.toFixed(2)} g</b>`
            };
        }
        case 3: {
            const mP = randomNum(20, 100, 0);
            const molP = mP / 56;
            const answer = molP * 100;
            return {
                question: `<b>CaCO₃ → CaO + CO₂</b><br><br>Mass of CaCO₃ needed for <b>${mP} g</b> CaO?<br><small>Mᵣ: CaCO₃=100, CaO=56</small>`,
                answer: answer,
                unit: 'g',
                hint: 'Work backwards from product',
                solution: `n(CaO) = ${mP}/56 = ${molP.toFixed(4)}<br>n(CaCO₃) = ${molP.toFixed(4)} (1:1)<br>m = ${molP.toFixed(4)} × 100 = <b>${answer.toFixed(1)} g</b>`
            };
        }
        case 4: {
            const mass = randomNum(5, 25, 1);
            const moles = mass / 34;
            const molesO2 = moles / 2;
            const answer = molesO2 * 24;
            return {
                question: `<b>2H₂O₂ → 2H₂O + O₂</b><br><br>Volume of O₂ (RTP) from <b>${mass} g</b> H₂O₂?<br><small>Mᵣ H₂O₂ = 34</small>`,
                answer: answer,
                unit: 'dm³',
                hint: 'mass → moles → ratio → moles O₂ → volume',
                solution: `n(H₂O₂) = ${mass}/34 = ${moles.toFixed(4)}<br>n(O₂) = ${moles.toFixed(4)}/2 = ${molesO2.toFixed(4)}<br>V = ${molesO2.toFixed(4)} × 24 = <b>${answer.toFixed(2)} dm³</b>`
            };
        }
        case 5: {
            const rxns = [
                { eq: 'CaCO₃ → CaO + CO₂', pMr: 56, tMr: 100 },
                { eq: '2Mg + O₂ → 2MgO', pMr: 80, tMr: 80 }
            ];
            const rx = randomChoice(rxns);
            const answer = (rx.pMr / rx.tMr) * 100;
            return {
                question: `<b>${rx.eq}</b><br><br>Calculate atom economy.<br><small>Mᵣ useful product = ${rx.pMr}, Total Mᵣ reactants = ${rx.tMr}</small>`,
                answer: answer,
                unit: '%',
                hint: 'Atom economy = (Mᵣ product ÷ Mᵣ reactants) × 100',
                solution: `% = (${rx.pMr} ÷ ${rx.tMr}) × 100 = <b>${answer.toFixed(1)}%</b>`
            };
        }
        default:
            return generateStoichQuestion();
    }
}

// ============================================
// ANSWER CHECKING
// ============================================
function checkAnswer() {
    const input = document.getElementById('user-input').value.trim();
    const userVal = parseFloat(input);
    const feedback = document.getElementById('feedback-area');
    const solution = document.getElementById('solution-area');
    
    if (input === '' || isNaN(userVal)) {
        feedback.innerHTML = '⚠️ Please enter a valid number';
        feedback.style.color = 'var(--warning)';
        return;
    }
    
    const correct = state.currentAnswer;
    const tolerance = Math.max(Math.abs(correct * 0.05), 0.01);
    const isCorrect = Math.abs(userVal - correct) <= tolerance;
    
    state.total++;
    
    if (isCorrect) {
        state.correct++;
        state.streak++;
        const bonus = Math.min(state.streak, 5);
        state.score += 10 + bonus;
        feedback.innerHTML = `✅ Correct! +${10 + bonus} points`;
        feedback.className = 'feedback-msg correct';
    } else {
        state.streak = 0;
        feedback.innerHTML = `❌ Incorrect. Answer: <b>${correct.toFixed(4)} ${state.currentUnit}</b>`;
        feedback.className = 'feedback-msg incorrect';
    }
    
    solution.innerHTML = `<h5>📝 Working:</h5>${state.currentSolution}`;
    solution.style.display = 'block';
    document.getElementById('submit-btn').disabled = true;
    
    updateStats();
}

function showHint() {
    document.getElementById('hint-box').style.display = 'block';
}

function updateStats() {
    document.getElementById('score').textContent = state.score;
    document.getElementById('streak').textContent = state.streak;
    const acc = state.total === 0 ? 0 : Math.round((state.correct / state.total) * 100);
    document.getElementById('accuracy').textContent = acc + '%';
}

// ============================================
// QUIZ LOADER
// ============================================
async function loadQuiz() {
    const filename = document.getElementById('quiz-filename').value.trim();
    const status = document.getElementById('quiz-status');
    
    if (!filename) {
        status.textContent = '⚠️ Enter a filename';
        status.style.color = 'var(--warning)';
        return;
    }
    
    try {
        const path = `./worksheets/${filename.endsWith('.json') ? filename : filename + '.json'}`;
        const res = await fetch(path);
        if (!res.ok) throw new Error('File not found');
        
        const data = await res.json();
        state.quizData = data.questions || [];
        state.quizIndex = 0;
        state.quizScore = 0;
        
        if (state.quizData.length === 0) throw new Error('No questions');
        
        status.textContent = `✅ Loaded ${state.quizData.length} questions!`;
        status.style.color = 'var(--success)';
        document.getElementById('quiz-display').style.display = 'block';
        showQuizQuestion();
    } catch (e) {
        status.textContent = `❌ ${e.message}`;
        status.style.color = 'var(--error)';
    }
}

function showQuizQuestion() {
    const q = state.quizData[state.quizIndex];
    const total = state.quizData.length;
    
    document.getElementById('quiz-progress-text').textContent = `Question ${state.quizIndex + 1} of ${total}`;
    document.getElementById('quiz-progress-bar').style.width = `${((state.quizIndex + 1) / total) * 100}%`;
    document.getElementById('quiz-q-text').textContent = q.question;
    document.getElementById('quiz-unit').textContent = q.unit || '';
    document.getElementById('quiz-input').value = '';
    document.getElementById('quiz-input').style.display = 'block';
    document.getElementById('quiz-feedback').textContent = '';
    document.getElementById('quiz-next-btn').style.display = 'block';
    document.getElementById('quiz-next-btn').textContent = state.quizIndex === total - 1 ? 'Finish' : 'Submit';
}

function submitQuizAnswer() {
    const input = document.getElementById('quiz-input').value.trim();
    const feedback = document.getElementById('quiz-feedback');
    const q = state.quizData[state.quizIndex];
    
    if (!input) {
        feedback.textContent = '⚠️ Enter answer';
        return;
    }
    
    const tol = Math.abs(parseFloat(q.answer) * 0.05) + 0.01;
    const correct = Math.abs(parseFloat(input) - parseFloat(q.answer)) <= tol;
    
    feedback.textContent = correct ? '✅ Correct!' : `❌ Answer: ${q.answer}`;
    
