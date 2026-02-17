// ==========================================
// MOLE MASTER - COMPLETE SCRIPT
// ==========================================

// ==========================================
// DATA
// ==========================================
const CHEMICALS = [
    { name: "NaOH", mr: 40 },
    { name: "HCl", mr: 36.5 },
    { name: "H₂SO₄", mr: 98 },
    { name: "CaCO₃", mr: 100 },
    { name: "MgO", mr: 40 },
    { name: "NaCl", mr: 58.5 },
    { name: "CO₂", mr: 44 },
    { name: "H₂O", mr: 18 },
    { name: "NH₃", mr: 17 },
    { name: "KOH", mr: 56 },
    { name: "CuSO₄", mr: 160 },
    { name: "Mg", mr: 24 },
    { name: "Zn", mr: 65 },
    { name: "Fe₂O₃", mr: 160 }
];

const TOPICS = [
    { id: "mass", title: "1. Moles & Mass", desc: "Calculate moles from mass and molar mass", formula: "n = m / Mr" },
    { id: "gas", title: "2. Gas Volume", desc: "Molar volume at RTP (24 dm³/mol)", formula: "n = V / 24" },
    { id: "conc", title: "3. Concentration", desc: "Solution calculations", formula: "n = c × V" },
    { id: "limit", title: "4. Limiting Reagent", desc: "Find limiting and excess reactants", formula: "Compare ratios" },
    { id: "yield", title: "5. Percentage Yield", desc: "Actual vs theoretical yield", formula: "% = (act/theo) × 100" },
    { id: "empirical", title: "6. Empirical Formula", desc: "Find simplest whole number ratio", formula: "Divide by smallest" },
    { id: "titration", title: "7. Titration", desc: "Acid-base calculations", formula: "c₁V₁ = c₂V₂" },
    { id: "stoich", title: "8. Stoichiometry", desc: "Reacting masses and mole ratios", formula: "Use coefficients" }
];

// ==========================================
// STATE
// ==========================================
const state = {
    score: 0,
    streak: 0,
    total: 0,
    correct: 0,
    questionNum: 0,
    currentAnswer: 0,
    currentUnit: "mol",
    currentHint: "",
    currentSolution: "",
    currentTopic: "random",
    quizQuestions: [],
    quizIndex: 0,
    quizScore: 0
};

// ==========================================
// DOM ELEMENTS
// ==========================================
let elements = {};

// ==========================================
// INITIALIZATION
// ==========================================
document.addEventListener("DOMContentLoaded", function() {
    console.log("Mole Master initializing...");
    
    // Cache DOM elements
    elements = {
        // Stats
        score: document.getElementById("score"),
        streak: document.getElementById("streak"),
        accuracy: document.getElementById("accuracy"),
        
        // Navigation
        navLearn: document.getElementById("nav-learn"),
        navRandom: document.getElementById("nav-random"),
        navQuiz: document.getElementById("nav-quiz"),
        
        // Tabs
        tabLearn: document.getElementById("tab-learn"),
        tabPractice: document.getElementById("tab-practice"),
        tabQuiz: document.getElementById("tab-quiz"),
        
        // Topics
        topicsGrid: document.getElementById("topics-grid"),
        
        // Practice
        practiceTitle: document.getElementById("practice-title"),
        topicBadge: document.getElementById("topic-badge"),
        qNum: document.getElementById("q-num"),
        qText: document.getElementById("q-text"),
        hintBox: document.getElementById("hint-box"),
        hintText: document.getElementById("hint-text"),
        answerInput: document.getElementById("answer-input"),
        unitLabel: document.getElementById("unit-label"),
        feedback: document.getElementById("feedback"),
        solution: document.getElementById("solution"),
        solutionText: document.getElementById("solution-text"),
        btnHint: document.getElementById("btn-hint"),
        btnSubmit: document.getElementById("btn-submit"),
        btnNext: document.getElementById("btn-next"),
        btnBack: document.getElementById("btn-back"),
        
        // Quiz
        quizFilename: document.getElementById("quiz-filename"),
        btnLoadQuiz: document.getElementById("btn-load-quiz"),
        quizStatus: document.getElementById("quiz-status"),
        quizArea: document.getElementById("quiz-area"),
        quizNum: document.getElementById("quiz-num"),
        quizTotal: document.getElementById("quiz-total"),
        quizProgress: document.getElementById("quiz-progress"),
        quizText: document.getElementById("quiz-text"),
        quizInput: document.getElementById("quiz-input"),
        quizUnit: document.getElementById("quiz-unit"),
        quizFeedback: document.getElementById("quiz-feedback"),
        btnQuizSubmit: document.getElementById("btn-quiz-submit")
    };
    
    // Render topics
    renderTopics();
    
    // Setup event listeners
    setupEventListeners();
    
    console.log("Mole Master ready!");
});

// ==========================================
// RENDER TOPICS
// ==========================================
function renderTopics() {
    elements.topicsGrid.innerHTML = "";
    
    TOPICS.forEach(function(topic) {
        const card = document.createElement("div");
        card.className = "topic-card";
        card.innerHTML = `
            <h3>${topic.title}</h3>
            <p>${topic.desc}</p>
            <code>${topic.formula}</code>
        `;
        card.addEventListener("click", function() {
            startPractice(topic.id);
        });
        elements.topicsGrid.appendChild(card);
    });
}

// ==========================================
// EVENT LISTENERS
// ==========================================
function setupEventListeners() {
    // Navigation
    elements.navLearn.addEventListener("click", function() {
        showTab("learn");
    });
    
    elements.navRandom.addEventListener("click", function() {
        startPractice("random");
    });
    
    elements.navQuiz.addEventListener("click", function() {
        showTab("quiz");
    });
    
    // Practice buttons
    elements.btnHint.addEventListener("click", showHint);
    elements.btnSubmit.addEventListener("click", submitAnswer);
    elements.btnNext.addEventListener("click", nextQuestion);
    elements.btnBack.addEventListener("click", function() {
        showTab("learn");
    });
    
    // Enter key for answer input
    elements.answerInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            submitAnswer();
        }
    });
    
    // Quiz
    elements.btnLoadQuiz.addEventListener("click", loadQuiz);
    elements.btnQuizSubmit.addEventListener("click", submitQuizAnswer);
    
    elements.quizInput.addEventListener("keypress", function(e) {
        if (e.key === "Enter") {
            submitQuizAnswer();
        }
    });
}

// ==========================================
// NAVIGATION
// ==========================================
function showTab(tabName) {
    // Hide all tabs
    elements.tabLearn.classList.remove("active");
    elements.tabPractice.classList.remove("active");
    elements.tabQuiz.classList.remove("active");
    
    // Remove active from nav
    elements.navLearn.classList.remove("active");
    elements.navRandom.classList.remove("active");
    elements.navQuiz.classList.remove("active");
    
    // Show selected tab and nav
    if (tabName === "learn") {
        elements.tabLearn.classList.add("active");
        elements.navLearn.classList.add("active");
    } else if (tabName === "practice") {
        elements.tabPractice.classList.add("active");
    } else if (tabName === "quiz") {
        elements.tabQuiz.classList.add("active");
        elements.navQuiz.classList.add("active");
    }
}

function startPractice(topicId) {
    console.log("Starting practice:", topicId);
    
    state.currentTopic = topicId;
    state.questionNum = 0;
    
    // Update title
    if (topicId === "random") {
        elements.practiceTitle.textContent = "Random Practice";
        elements.navRandom.classList.add("active");
    } else {
        const topic = TOPICS.find(function(t) { return t.id === topicId; });
        elements.practiceTitle.textContent = topic ? topic.title : "Practice";
        elements.navLearn.classList.add("active");
    }
    
    // Show practice tab
    showTab("practice");
    
    // If specific topic, keep learn nav active
    if (topicId !== "random") {
        elements.navLearn.classList.add("active");
    }
    
    // Generate first question
    nextQuestion();
}

// ==========================================
// QUESTION GENERATION
// ==========================================
function nextQuestion() {
    console.log("Generating question for:", state.currentTopic);
    
    // Reset UI
    elements.answerInput.value = "";
    elements.hintBox.classList.remove("show");
    elements.feedback.classList.remove("show", "correct", "wrong");
    elements.solution.classList.remove("show");
    elements.btnSubmit.disabled = false;
    
    // Increment question number
    state.questionNum++;
    elements.qNum.textContent = state.questionNum;
    
    // Pick topic
    let topic = state.currentTopic;
    if (topic === "random") {
        const randomIndex = Math.floor(Math.random() * TOPICS.length);
        topic = TOPICS[randomIndex].id;
    }
    
    // Update badge
    const topicObj = TOPICS.find(function(t) { return t.id === topic; });
    elements.topicBadge.textContent = topicObj ? topicObj.title : topic;
    
    // Generate question based on topic
    let question;
    
    switch(topic) {
        case "mass":
            question = generateMassQuestion();
            break;
        case "gas":
            question = generateGasQuestion();
            break;
        case "conc":
            question = generateConcQuestion();
            break;
        case "limit":
            question = generateLimitQuestion();
            break;
        case "yield":
            question = generateYieldQuestion();
            break;
        case "empirical":
            question = generateEmpiricalQuestion();
            break;
        case "titration":
            question = generateTitrationQuestion();
            break;
        case "stoich":
            question = generateStoichQuestion();
            break;
        default:
            question = generateMassQuestion();
    }
    
    // Display question
    elements.qText.innerHTML = question.text;
    elements.unitLabel.textContent = question.unit;
    elements.hintText.textContent = question.hint;
    
    // Store answer
    state.currentAnswer = question.answer;
    state.currentUnit = question.unit;
    state.currentHint = question.hint;
    state.currentSolution = question.solution;
    
    // Focus input
    elements.answerInput.focus();
}

// ==========================================
// QUESTION GENERATORS
// ==========================================

// Helper functions
function randomChoice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

function randomNum(min, max, decimals) {
    const num = Math.random() * (max - min) + min;
    return parseFloat(num.toFixed(decimals));
}

function randomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 1. MOLES & MASS
function generateMassQuestion() {
    const chem = randomChoice(CHEMICALS);
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            // Mass to moles
            const mass = randomNum(5, 80, 1);
            const ans = mass / chem.mr;
            return {
                text: `Calculate the number of moles in <b>${mass} g</b> of <b>${chem.name}</b>.<br><small>Mr of ${chem.name} = ${chem.mr}</small>`,
                answer: ans,
                unit: "mol",
                hint: "Use the formula: n = m ÷ Mr",
                solution: `n = m ÷ Mr<br>n = ${mass} ÷ ${chem.mr}<br>n = <b>${ans.toFixed(4)} mol</b>`
            };
        }
        case 2: {
            // Moles to mass
            const moles = randomNum(0.2, 4, 2);
            const ans = moles * chem.mr;
            return {
                text: `Calculate the mass of <b>${moles} mol</b> of <b>${chem.name}</b>.<br><small>Mr of ${chem.name} = ${chem.mr}</small>`,
                answer: ans,
                unit: "g",
                hint: "Rearrange to: m = n × Mr",
                solution: `m = n × Mr<br>m = ${moles} × ${chem.mr}<br>m = <b>${ans.toFixed(2)} g</b>`
            };
        }
        case 3: {
            // Find Mr
            const moles = randomNum(0.5, 3, 2);
            const mass = parseFloat((moles * chem.mr).toFixed(1));
            return {
                text: `A substance contains <b>${moles} mol</b> and has mass <b>${mass} g</b>.<br>Calculate the molar mass (Mr).`,
                answer: chem.mr,
                unit: "g/mol",
                hint: "Rearrange to: Mr = m ÷ n",
                solution: `Mr = m ÷ n<br>Mr = ${mass} ÷ ${moles}<br>Mr = <b>${chem.mr} g/mol</b>`
            };
        }
        case 4: {
            // Particles to moles
            const moles = randomNum(0.2, 2, 2);
            const particles = parseFloat((moles * 6.02).toFixed(2));
            return {
                text: `A sample contains <b>${particles} × 10²³</b> particles.<br>How many moles is this?<br><small>Avogadro's number = 6.02 × 10²³</small>`,
                answer: moles,
                unit: "mol",
                hint: "n = particles ÷ Avogadro's number",
                solution: `n = ${particles} × 10²³ ÷ 6.02 × 10²³<br>n = <b>${moles} mol</b>`
            };
        }
        case 5: {
            // Mass to particles
            const mass = randomNum(10, 40, 0);
            const moles = mass / chem.mr;
            const particles = parseFloat((moles * 6.02).toFixed(2));
            return {
                text: `How many particles (× 10²³) are in <b>${mass} g</b> of <b>${chem.name}</b>?<br><small>Mr = ${chem.mr}, Avogadro = 6.02 × 10²³</small>`,
                answer: particles,
                unit: "× 10²³",
                hint: "First find moles, then × 6.02",
                solution: `n = ${mass} ÷ ${chem.mr} = ${moles.toFixed(3)} mol<br>Particles = ${moles.toFixed(3)} × 6.02<br>= <b>${particles} × 10²³</b>`
            };
        }
    }
}

// 2. GAS VOLUME
function generateGasQuestion() {
    const type = randomInt(1, 4);
    
    switch(type) {
        case 1: {
            // Volume to moles (RTP)
            const vol = randomNum(12, 96, 1);
            const ans = vol / 24;
            return {
                text: `Calculate the moles in <b>${vol} dm³</b> of gas at RTP.<br><small>Molar volume at RTP = 24 dm³/mol</small>`,
                answer: ans,
                unit: "mol",
                hint: "At RTP: n = V ÷ 24",
                solution: `n = V ÷ 24<br>n = ${vol} ÷ 24<br>n = <b>${ans.toFixed(3)} mol</b>`
            };
        }
        case 2: {
            // Moles to volume (RTP)
            const moles = randomNum(0.5, 4, 2);
            const ans = moles * 24;
            return {
                text: `What volume does <b>${moles} mol</b> of gas occupy at RTP?<br><small>Molar volume = 24 dm³/mol</small>`,
                answer: ans,
                unit: "dm³",
                hint: "V = n × 24",
                solution: `V = n × 24<br>V = ${moles} × 24<br>V = <b>${ans.toFixed(2)} dm³</b>`
            };
        }
        case 3: {
            // Volume to moles (STP)
            const vol = randomNum(22.4, 112, 1);
            const ans = vol / 22.4;
            return {
                text: `Calculate moles in <b>${vol} dm³</b> of gas at STP.<br><small>Molar volume at STP = 22.4 dm³/mol</small>`,
                answer: ans,
                unit: "mol",
                hint: "At STP: n = V ÷ 22.4",
                solution: `n = V ÷ 22.4<br>n = ${vol} ÷ 22.4<br>n = <b>${ans.toFixed(3)} mol</b>`
            };
        }
        case 4: {
            // Mass to volume
            const gases = [
                { name: "O₂", mr: 32 },
                { name: "CO₂", mr: 44 },
                { name: "N₂", mr: 28 },
                { name: "H₂", mr: 2 },
                { name: "Cl₂", mr: 71 }
            ];
            const gas = randomChoice(gases);
            const mass = randomNum(5, 40, 1);
            const moles = mass / gas.mr;
            const ans = moles * 24;
            return {
                text: `What volume does <b>${mass} g</b> of <b>${gas.name}</b> occupy at RTP?<br><small>Mr of ${gas.name} = ${gas.mr}</small>`,
                answer: ans,
                unit: "dm³",
                hint: "First find moles, then × 24",
                solution: `n = ${mass} ÷ ${gas.mr} = ${moles.toFixed(4)} mol<br>V = ${moles.toFixed(4)} × 24<br>V = <b>${ans.toFixed(2)} dm³</b>`
            };
        }
    }
}

// 3. CONCENTRATION
function generateConcQuestion() {
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            // Find moles from c and V
            const conc = randomNum(0.1, 1.5, 2);
            const vol = randomInt(25, 250);
            const ans = conc * (vol / 1000);
            return {
                text: `Calculate moles in <b>${vol} cm³</b> of <b>${conc} mol/dm³</b> solution.`,
                answer: ans,
                unit: "mol",
                hint: "n = c × V (convert cm³ to dm³ first)",
                solution: `V in dm³ = ${vol} ÷ 1000 = ${(vol/1000).toFixed(4)}<br>n = ${conc} × ${(vol/1000).toFixed(4)}<br>n = <b>${ans.toFixed(4)} mol</b>`
            };
        }
        case 2: {
            // Find concentration
            const moles = randomNum(0.01, 0.15, 3);
            const vol = randomInt(100, 500);
            const ans = moles / (vol / 1000);
            return {
                text: `<b>${moles} mol</b> of solute is dissolved in <b>${vol} cm³</b>.<br>Calculate the concentration.`,
                answer: ans,
                unit: "mol/dm³",
                hint: "c = n ÷ V (V in dm³)",
                solution: `V in dm³ = ${(vol/1000).toFixed(3)}<br>c = ${moles} ÷ ${(vol/1000).toFixed(3)}<br>c = <b>${ans.toFixed(3)} mol/dm³</b>`
            };
        }
        case 3: {
            // Find volume
            const conc = randomNum(0.2, 1, 2);
            const moles = randomNum(0.02, 0.1, 3);
            const ans = (moles / conc) * 1000;
            return {
                text: `What volume (cm³) of <b>${conc} mol/dm³</b> solution contains <b>${moles} mol</b>?`,
                answer: ans,
                unit: "cm³",
                hint: "V = n ÷ c (then × 1000 for cm³)",
                solution: `V = ${moles} ÷ ${conc} = ${(moles/conc).toFixed(4)} dm³<br>V = ${(moles/conc).toFixed(4)} × 1000<br>V = <b>${ans.toFixed(1)} cm³</b>`
            };
        }
        case 4: {
            // mol/dm³ to g/dm³
            const chem = randomChoice(CHEMICALS);
            const conc = randomNum(0.1, 1, 2);
            const ans = conc * chem.mr;
            return {
                text: `A solution of <b>${chem.name}</b> has concentration <b>${conc} mol/dm³</b>.<br>Express in g/dm³.<br><small>Mr of ${chem.name} = ${chem.mr}</small>`,
                answer: ans,
                unit: "g/dm³",
                hint: "g/dm³ = mol/dm³ × Mr",
                solution: `c (g/dm³) = ${conc} × ${chem.mr}<br>c = <b>${ans.toFixed(2)} g/dm³</b>`
            };
        }
        case 5: {
            // g/dm³ to mol/dm³
            const chem = randomChoice(CHEMICALS);
            const concG = randomNum(10, 80, 0);
            const ans = concG / chem.mr;
            return {
                text: `A solution of <b>${chem.name}</b> has concentration <b>${concG} g/dm³</b>.<br>Convert to mol/dm³.<br><small>Mr = ${chem.mr}</small>`,
                answer: ans,
                unit: "mol/dm³",
                hint: "mol/dm³ = g/dm³ ÷ Mr",
                solution: `c = ${concG} ÷ ${chem.mr}<br>c = <b>${ans.toFixed(3)} mol/dm³</b>`
            };
        }
    }
}

// 4. LIMITING REAGENT
function generateLimitQuestion() {
    const scenarios = [
        { eq: "2H₂ + O₂ → 2H₂O", A: "H₂", rA: 2, B: "O₂", rB: 1, P: "H₂O", rP: 2 },
        { eq: "N₂ + 3H₂ → 2NH₃", A: "N₂", rA: 1, B: "H₂", rB: 3, P: "NH₃", rP: 2 },
        { eq: "2Mg + O₂ → 2MgO", A: "Mg", rA: 2, B: "O₂", rB: 1, P: "MgO", rP: 2 },
        { eq: "2Al + 3Cl₂ → 2AlCl₃", A: "Al", rA: 2, B: "Cl₂", rB: 3, P: "AlCl₃", rP: 2 }
    ];
    
    const s = randomChoice(scenarios);
    const mA = randomNum(1, 5, 1);
    const mB = randomNum(1, 5, 1);
    
    // Find limiting reagent
    const neededB = (mA / s.rA) * s.rB;
    const isBlimiting = mB < neededB;
    const limiting = isBlimiting ? s.B : s.A;
    const excess = isBlimiting ? s.A : s.B;
    
    const limitMoles = isBlimiting ? mB : mA;
    const limitRatio = isBlimiting ? s.rB : s.rA;
    const excessMoles = isBlimiting ? mA : mB;
    const excessRatio = isBlimiting ? s.rA : s.rB;
    
    const usedExcess = (limitMoles / limitRatio) * excessRatio;
    const remaining = excessMoles - usedExcess;
    const productMoles = (limitMoles / limitRatio) * s.rP;
    
    const type = randomInt(1, 3);
    
    switch(type) {
        case 1: {
            // Find remaining excess
            return {
                text: `<b>${s.eq}</b><br><br>You have <b>${mA} mol ${s.A}</b> and <b>${mB} mol ${s.B}</b>.<br><br>How many moles of <b>${excess}</b> remain unreacted?`,
                answer: remaining,
                unit: "mol",
                hint: "Find limiting reagent first, then calculate excess used",
                solution: `${limiting} is limiting.<br>Used ${excess} = ${usedExcess.toFixed(2)} mol<br>Remaining = ${excessMoles} - ${usedExcess.toFixed(2)}<br>= <b>${remaining.toFixed(2)} mol</b>`
            };
        }
        case 2: {
            // Find product formed
            return {
                text: `<b>${s.eq}</b><br><br>You react <b>${mA} mol ${s.A}</b> with <b>${mB} mol ${s.B}</b>.<br><br>How many moles of <b>${s.P}</b> are formed?`,
                answer: productMoles,
                unit: "mol",
                hint: "Find limiting reagent, then use mole ratio",
                solution: `${limiting} is limiting (${limitMoles} mol).<br>Moles ${s.P} = (${limitMoles} ÷ ${limitRatio}) × ${s.rP}<br>= <b>${productMoles.toFixed(2)} mol</b>`
            };
        }
        case 3: {
            // Identify limiting (1 or 2)
            const ansNum = limiting === s.A ? 1 : 2;
            return {
                text: `<b>${s.eq}</b><br><br>You have <b>${mA} mol ${s.A}</b> and <b>${mB} mol ${s.B}</b>.<br><br>Which is the limiting reagent?<br>Enter <b>1</b> for ${s.A} or <b>2</b> for ${s.B}`,
                answer: ansNum,
                unit: "",
                hint: "Compare mole ratios to equation ratios",
                solution: `Required ratio ${s.A}:${s.B} = ${s.rA}:${s.rB}<br>Actual ratio = ${mA}:${mB}<br>Limiting reagent: <b>${limiting}</b> (answer: ${ansNum})`
            };
        }
    }
}

// 5. PERCENTAGE YIELD
function generateYieldQuestion() {
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            // Calculate % yield
            const theo = randomNum(15, 80, 1);
            const actual = randomNum(theo * 0.5, theo * 0.95, 1);
            const ans = (actual / theo) * 100;
            return {
                text: `Theoretical yield: <b>${theo} g</b><br>Actual yield: <b>${actual} g</b><br><br>Calculate the percentage yield.`,
                answer: ans,
                unit: "%",
                hint: "% yield = (actual ÷ theoretical) × 100",
                solution: `% yield = (${actual} ÷ ${theo}) × 100<br>= <b>${ans.toFixed(1)}%</b>`
            };
        }
        case 2: {
            // Find actual from %
            const theo = randomInt(25, 70);
            const percent = randomInt(60, 95);
            const ans = (percent / 100) * theo;
            return {
                text: `Theoretical yield: <b>${theo} g</b><br>Percentage yield: <b>${percent}%</b><br><br>Calculate the actual yield.`,
                answer: ans,
                unit: "g",
                hint: "Actual = (% ÷ 100) × theoretical",
                solution: `Actual = (${percent} ÷ 100) × ${theo}<br>= <b>${ans.toFixed(1)} g</b>`
            };
        }
        case 3: {
            // Find theoretical
            const actual = randomNum(15, 50, 1);
            const percent = randomInt(60, 90);
            const ans = (actual / percent) * 100;
            return {
                text: `Actual yield: <b>${actual} g</b><br>Percentage yield: <b>${percent}%</b><br><br>Calculate the theoretical yield.`,
                answer: ans,
                unit: "g",
                hint: "Theoretical = actual ÷ (% ÷ 100)",
                solution: `Theoretical = ${actual} ÷ (${percent}/100)<br>= ${actual} ÷ ${(percent/100).toFixed(2)}<br>= <b>${ans.toFixed(1)} g</b>`
            };
        }
        case 4: {
            // % purity
            const total = randomInt(50, 150);
            const pure = randomNum(total * 0.7, total * 0.98, 1);
            const ans = (pure / total) * 100;
            return {
                text: `Sample mass: <b>${total} g</b><br>Pure substance: <b>${pure} g</b><br><br>Calculate percentage purity.`,
                answer: ans,
                unit: "%",
                hint: "% purity = (pure ÷ total) × 100",
                solution: `% purity = (${pure} ÷ ${total}) × 100<br>= <b>${ans.toFixed(1)}%</b>`
            };
        }
        case 5: {
            // Find pure mass
            const total = randomInt(100, 300);
            const purity = randomInt(80, 98);
            const ans = (purity / 100) * total;
            return {
                text: `Sample mass: <b>${total} g</b><br>Purity: <b>${purity}%</b><br><br>Calculate mass of pure substance.`,
                answer: ans,
                unit: "g",
                hint: "Pure mass = (% ÷ 100) × total",
                solution: `Pure = (${purity} ÷ 100) × ${total}<br>= <b>${ans.toFixed(1)} g</b>`
            };
        }
    }
}

// 6. EMPIRICAL FORMULA
function generateEmpiricalQuestion() {
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            // Hydrocarbon CHx
            const formulas = [
                { pC: 80, pH: 20, x: 3, emp: "CH₃" },
                { pC: 75, pH: 25, x: 4, emp: "CH₄" },
                { pC: 85.7, pH: 14.3, x: 2, emp: "CH₂" },
                { pC: 92.3, pH: 7.7, x: 1, emp: "CH" }
            ];
            const f = randomChoice(formulas);
            return {
                text: `A hydrocarbon contains <b>${f.pC}%</b> Carbon and <b>${f.pH}%</b> Hydrogen.<br><br>Find <b>x</b> in the empirical formula <b>CHₓ</b>.`,
                answer: f.x,
                unit: "",
                hint: "Divide each % by atomic mass (C=12, H=1)",
                solution: `C: ${f.pC}/12 = ${(f.pC/12).toFixed(2)}<br>H: ${f.pH}/1 = ${f.pH}<br>Ratio C:H = 1:${f.x}<br>Formula: <b>${f.emp}</b>, x = <b>${f.x}</b>`
            };
        }
        case 2: {
            // C, H, O compound
            const formulas = [
                { pC: 40, pH: 6.7, pO: 53.3, h: 2, emp: "CH₂O" },
                { pC: 52.2, pH: 13, pO: 34.8, h: 6, emp: "C₂H₆O" }
            ];
            const f = randomChoice(formulas);
            return {
                text: `A compound contains <b>${f.pC}%</b> C, <b>${f.pH}%</b> H, <b>${f.pO}%</b> O.<br><br>How many H atoms in the empirical formula?`,
                answer: f.h,
                unit: "",
                hint: "Divide each % by Ar, find simplest ratio",
                solution: `Empirical formula: <b>${f.emp}</b><br>H atoms = <b>${f.h}</b>`
            };
        }
        case 3: {
            // Molecular formula multiplier
            const data = [
                { emp: "CH₂O", empMr: 30, actMr: 60, n: 2 },
                { emp: "CH₂O", empMr: 30, actMr: 180, n: 6 },
                { emp: "CH₂", empMr: 14, actMr: 42, n: 3 },
                { emp: "CH", empMr: 13, actMr: 78, n: 6 }
            ];
            const d = randomChoice(data);
            return {
                text: `Empirical formula: <b>${d.emp}</b> (Mr = ${d.empMr})<br>Actual Mr: <b>${d.actMr}</b><br><br>Find <b>n</b> in molecular formula (${d.emp})ₙ`,
                answer: d.n,
                unit: "",
                hint: "n = Actual Mr ÷ Empirical Mr",
                solution: `n = ${d.actMr} ÷ ${d.empMr}<br>n = <b>${d.n}</b>`
            };
        }
        case 4: {
            // Calculate Mr
            const compounds = [
                { formula: "CH₄", mr: 16 },
                { formula: "H₂O", mr: 18 },
                { formula: "CO₂", mr: 44 },
                { formula: "NH₃", mr: 17 },
                { formula: "C₂H₆", mr: 30 },
                { formula: "C₂H₅OH", mr: 46 }
            ];
            const c = randomChoice(compounds);
            return {
                text: `Calculate the Mr of <b>${c.formula}</b>.<br><small>Ar: C=12, H=1, O=16, N=14</small>`,
                answer: c.mr,
                unit: "",
                hint: "Add up all the atomic masses",
                solution: `Mr of ${c.formula} = <b>${c.mr}</b>`
            };
        }
        case 5: {
            // % composition
            const data = [
                { name: "H₂O", mr: 18, el: "O", mass: 16 },
                { name: "CO₂", mr: 44, el: "C", mass: 12 },
                { name: "NaCl", mr: 58.5, el: "Na", mass: 23 },
                { name: "NH₃", mr: 17, el: "N", mass: 14 },
                { name: "CaCO₃", mr: 100, el: "Ca", mass: 40 }
            ];
            const d = randomChoice(data);
            const ans = (d.mass / d.mr) * 100;
            return {
                text: `Calculate the percentage by mass of <b>${d.el}</b> in <b>${d.name}</b>.<br><small>Mr of ${d.name} = ${d.mr}</small>`,
                answer: ans,
                unit: "%",
                hint: "% = (mass of element ÷ Mr) × 100",
                solution: `% ${d.el} = (${d.mass} ÷ ${d.mr}) × 100<br>= <b>${ans.toFixed(1)}%</b>`
            };
        }
    }
}

// 7. TITRATION
function generateTitrationQuestion() {
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            // Find [base] - 1:1 ratio
            const cA = randomNum(0.05, 0.2, 3);
            const vA = randomNum(20, 30, 1);
            const vB = randomNum(20, 35, 1);
            const ans = (cA * vA) / vB;
            return {
                text: `<b>HCl + NaOH → NaCl + H₂O</b> (1:1 ratio)<br><br><b>${vA} cm³</b> of <b>${cA} mol/dm³ HCl</b> neutralizes <b>${vB} cm³</b> of NaOH.<br><br>Calculate [NaOH].`,
                answer: ans,
                unit: "mol/dm³",
                hint: "For 1:1 ratio: c₁V₁ = c₂V₂",
                solution: `[NaOH] = (c₁ × V₁) ÷ V₂<br>= (${cA} × ${vA}) ÷ ${vB}<br>= <b>${ans.toFixed(4)} mol/dm³</b>`
            };
        }
        case 2: {
            // Find volume
            const cA = randomNum(0.1, 0.25, 2);
            const cB = randomNum(0.1, 0.2, 2);
            const vB = randomInt(20, 30);
            const ans = (cB * vB) / cA;
            return {
                text: `What volume of <b>${cA} mol/dm³ HCl</b> neutralizes <b>${vB} cm³</b> of <b>${cB} mol/dm³ NaOH</b>?`,
                answer: ans,
                unit: "cm³",
                hint: "V₁ = c₂V₂ ÷ c₁",
                solution: `V = (${cB} × ${vB}) ÷ ${cA}<br>= <b>${ans.toFixed(1)} cm³</b>`
            };
        }
        case 3: {
            // 2:1 ratio (H₂SO₄)
            const cA = randomNum(0.05, 0.15, 3);
            const vA = randomNum(20, 30, 1);
            const vB = randomNum(25, 40, 1);
            const ans = (2 * cA * vA) / vB;
            return {
                text: `<b>H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O</b><br><br><b>${vA} cm³</b> of <b>${cA} mol/dm³ H₂SO₄</b> neutralizes <b>${vB} cm³</b> of NaOH.<br><br>Calculate [NaOH].`,
                answer: ans,
                unit: "mol/dm³",
                hint: "Ratio 1:2, so n(NaOH) = 2 × n(H₂SO₄)",
                solution: `n(H₂SO₄) = ${cA} × ${(vA/1000).toFixed(4)}<br>n(NaOH) = 2 × n(H₂SO₄)<br>[NaOH] = <b>${ans.toFixed(4)} mol/dm³</b>`
            };
        }
        case 4: {
            // Find moles
            const c = randomNum(0.1, 0.25, 3);
            const v = randomNum(20, 35, 1);
            const ans = c * (v / 1000);
            return {
                text: `In a titration, <b>${v} cm³</b> of <b>${c} mol/dm³</b> acid was used.<br><br>Calculate the moles of acid.`,
                answer: ans,
                unit: "mol",
                hint: "n = c × V (convert cm³ to dm³)",
                solution: `n = ${c} × (${v}/1000)<br>n = ${c} × ${(v/1000).toFixed(4)}<br>= <b>${ans.toFixed(5)} mol</b>`
            };
        }
        case 5: {
            // Find mass from titration
            const cA = randomNum(0.1, 0.2, 2);
            const vA = randomNum(20, 30, 1);
            const moles = cA * (vA / 1000);
            const ans = moles * 40; // NaOH Mr = 40
            return {
                text: `<b>${vA} cm³</b> of <b>${cA} mol/dm³ HCl</b> neutralizes a sample of NaOH.<br><br>Calculate the mass of NaOH.<br><small>Mr of NaOH = 40</small>`,
                answer: ans,
                unit: "g",
                hint: "Find moles from titration, then m = n × Mr",
                solution: `n(HCl) = n(NaOH) = ${cA} × ${(vA/1000).toFixed(4)}<br>= ${moles.toFixed(5)} mol<br>m = ${moles.toFixed(5)} × 40<br>= <b>${ans.toFixed(3)} g</b>`
            };
        }
    }
}

// 8. STOICHIOMETRY
function generateStoichQuestion() {
    const type = randomInt(1, 5);
    
    switch(type) {
        case 1: {
            // Basic mole ratio
            const rxns = [
                { eq: "N₂ + 3H₂ → 2NH₃", A: "N₂", B: "NH₃", r: 2 },
                { eq: "2H₂ + O₂ → 2H₂O", A: "O₂", B: "H₂O", r: 2 },
                { eq: "C + O₂ → CO₂", A: "C", B: "CO₂", r: 1 },
                { eq: "2Mg + O₂ → 2MgO", A: "Mg", B: "MgO", r: 1 }
            ];
            const rx = randomChoice(rxns);
            const mol = randomNum(0.5, 3, 2);
            const ans = mol * rx.r;
            return {
                text: `<b>${rx.eq}</b><br><br>If <b>${mol} mol</b> of ${rx.A} reacts, how many moles of ${rx.B} form?`,
                answer: ans,
                unit: "mol",
                hint: "Use the mole ratio from coefficients",
                solution: `Ratio ${rx.A}:${rx.B} = 1:${rx.r}<br>Moles ${rx.B} = ${mol} × ${rx.r}<br>= <b>${ans.toFixed(2)} mol</b>`
            };
        }
        case 2: {
            // Mass to mass (Mg + O₂)
            const mass = randomNum(10, 40, 1);
            // 2Mg + O₂ → 2MgO (Mg=24, MgO=40)
            const mol = mass / 24;
            const ans = mol * 40;
            return {
                text: `<b>2Mg + O₂ → 2MgO</b><br><br>Calculate mass of MgO formed from <b>${mass} g</b> of Mg.<br><small>Mr: Mg = 24, MgO = 40</small>`,
                answer: ans,
                unit: "g",
                hint: "mass → moles → ratio → mass",
                solution: `n(Mg) = ${mass} ÷ 24 = ${mol.toFixed(3)} mol<br>n(MgO) = ${mol.toFixed(3)} mol (1:1)<br>m(MgO) = ${mol.toFixed(3)} × 40<br>= <b>${ans.toFixed(2)} g</b>`
            };
        }
        case 3: {
            // CaCO₃ decomposition
            const mass = randomInt(25, 80);
            // CaCO₃ → CaO + CO₂ (100 → 56)
            const mol = mass / 100;
            const ans = mol * 56;
            return {
                text: `<b>CaCO₃ → CaO + CO₂</b><br><br>Mass of CaO from <b>${mass} g</b> of CaCO₃?<br><small>Mr: CaCO₃ = 100, CaO = 56</small>`,
                answer: ans,
                unit: "g",
                hint: "mass → moles → ratio → mass",
                solution: `n(CaCO₃) = ${mass} ÷ 100 = ${mol.toFixed(2)} mol<br>n(CaO) = ${mol.toFixed(2)} mol (1:1)<br>m(CaO) = ${mol.toFixed(2)} × 56<br>= <b>${ans.toFixed(2)} g</b>`
            };
        }
        case 4: {
            // Volume of gas from mass
            const mass = randomNum(10, 30, 1);
            // 2H₂O₂ → 2H₂O + O₂ (Mr H₂O₂ = 34)
            const mol = mass / 34;
            const molO2 = mol / 2;
            const ans = molO2 * 24;
            return {
                text: `<b>2H₂O₂ → 2H₂O + O₂</b><br><br>Volume of O₂ (at RTP) from <b>${mass} g</b> of H₂O₂?<br><small>Mr of H₂O₂ = 34</small>`,
                answer: ans,
                unit: "dm³",
                hint: "mass → moles → ratio → moles O₂ → volume",
                solution: `n(H₂O₂) = ${mass} ÷ 34 = ${mol.toFixed(3)} mol<br>n(O₂) = ${mol.toFixed(3)} ÷ 2 = ${molO2.toFixed(4)} mol<br>V = ${molO2.toFixed(4)} × 24<br>= <b>${ans.toFixed(2)} dm³</b>`
            };
        }
        case 5: {
            // Atom economy
            const rxns = [
                { eq: "CaCO₃ → CaO + CO₂", pMr: 56, tMr: 100 },
                { eq: "2Mg + O₂ → 2MgO", pMr: 80, tMr: 80 },
                { eq: "Fe₂O₃ + 3CO → 2Fe + 3CO₂", pMr: 112, tMr: 244 }
            ];
            const rx = randomChoice(rxns);
            const ans = (rx.pMr / rx.tMr) * 100;
            return {
                text: `<b>${rx.eq}</b><br><br>Calculate the atom economy.<br><small>Mr of useful product = ${rx.pMr}<br>Total Mr of reactants = ${rx.tMr}</small>`,
                answer: ans,
                unit: "%",
                hint: "Atom economy = (Mr product ÷ Mr reactants) × 100",
                solution: `Atom economy = (${rx.pMr} ÷ ${rx.tMr}) × 100<br>= <b>${ans.toFixed(1)}%</b>`
            };
        }
    }
}

// ==========================================
// ANSWER CHECKING
// ==========================================
function submitAnswer() {
    const input = elements.answerInput.value.trim();
    const userVal = parseFloat(input);
    
    if (input === "" || isNaN(userVal)) {
        alert("Please enter a valid number!");
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
        elements.feedback.textContent = `✅ Correct! +${10 + bonus} points`;
        elements.feedback.className = "feedback show correct";
    } else {
        state.streak = 0;
        elements.feedback.textContent = `❌ Incorrect. Answer: ${correct.toFixed(4)} ${state.currentUnit}`;
        elements.feedback.className = "feedback show wrong";
    }
    
    // Show solution
    elements.solutionText.innerHTML = state.currentSolution;
    elements.solution.classList.add("show");
    
    // Disable submit
    elements.btnSubmit.disabled = true;
    
    // Update stats
    updateStats();
}

function showHint() {
    elements.hintBox.classList.add("show");
}

function updateStats() {
    elements.score.textContent = state.score;
    elements.streak.textContent = state.streak;
    const acc = state.total === 0 ? 0 : Math.round((state.correct / state.total) * 100);
    elements.accuracy.textContent = acc + "%";
}

// ==========================================
// QUIZ FUNCTIONS
// ==========================================
async function loadQuiz() {
    const filename = elements.quizFilename.value.trim();
    
    if (!filename) {
        elements.quizStatus.textContent = "⚠️ Please enter a filename";
        elements.quizStatus.style.color = "#fbbf24";
        return;
    }
    
    try {
        const path = `./worksheets/${filename}.json`;
        const response = await fetch(path);
        
        if (!response.ok) {
            throw new Error("File not found");
        }
        
        const data = await response.json();
        state.quizQuestions = data.questions || [];
        state.quizIndex = 0;
        state.quizScore = 0;
        
        if (state.quizQuestions.length === 0) {
            throw new Error("No questions in file");
        }
        
        elements.quizStatus.textContent = `✅ Loaded ${state.quizQuestions.length} questions`;
        elements.quizStatus.style.color = "#4ade80";
        
        elements.quizArea.classList.add("show");
        elements.quizTotal.textContent = state.quizQuestions.length;
        
        showQuizQuestion();
        
    } catch (error) {
        elements.quizStatus.textContent = `❌ Error: ${error.message}`;
        elements.quizStatus.style.color = "#f87171";
    }
}

function showQuizQuestion() {
    const q = state.quizQuestions[state.quizIndex];
    const total = state.quizQuestions.length;
    
    elements.quizNum.textContent = state.quizIndex + 1;
    elements.quizProgress.style.width = `${((state.quizIndex + 1) / total) * 100}%`;
    elements.quizText.textContent = q.question;
    elements.quizUnit.textContent = q.unit || "";
    elements.quizInput.value = "";
    elements.quizInput.style.display = "block";
    elements.quizFeedback.classList.remove("show");
    elements.btnQuizSubmit.disabled = false;
    elements.btnQuizSubmit.style.display = "block";
    elements.btnQuizSubmit.textContent = state.quizIndex === total - 1 ? "Finish Quiz" : "Submit Answer";
}

function submitQuizAnswer() {
    const input = elements.quizInput.value.trim();
    
    if (!input) {
        alert("Please enter an answer!");
        return;
    }
    
    const q = state.quizQuestions[state.quizIndex];
    const userVal = parseFloat(input);
    const correct = parseFloat(q.answer);
    const tolerance = Math.max(Math.abs(correct * 0.05), 0.01);
    const isCorrect = Math.abs(userVal - correct) <= tolerance;
    
    if (isCorrect) {
        state.quizScore++;
        elements.quizFeedback.textContent = "✅ Correct!";
        elements.quizFeedback.className = "feedback show correct";
    } else {
        elements.quizFeedback.textContent = `❌ Answer: ${correct}`;
        elements.quizFeedback.className = "feedback show wrong";
    }
    
    elements.btnQuizSubmit.disabled = true;
    
    setTimeout(function() {
        state.quizIndex++;
        
        if (state.quizIndex < state.quizQuestions.length) {
            showQuizQuestion();
        } else {
            // Quiz complete
            elements.quizText.innerHTML = `<b>Quiz Complete!</b><br><br>Score: ${state.quizScore} / ${state.quizQuestions.length}`;
            elements.quizInput.style.display = "none";
            elements.btnQuizSubmit.style.display = "none";
            elements.quizFeedback.classList.remove("show");
        }
    }, 1500);
}
