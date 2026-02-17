/* =========================================
MOLE MASTER PRO - O LEVEL CHEMISTRY (6092)
Enhanced Question Generation for Examination Excellence
========================================= */

// ==================== CONSTANTS ====================
const CHEMICALS = [
    { name: "NaOH", mr: 40 }, 
    { name: "H₂SO₄", mr: 98 }, 
    { name: "CaCO₃", mr: 100 },
    { name: "HCl", mr: 36.5 }, 
    { name: "CO₂", mr: 44 }, 
    { name: "MgO", mr: 40 },
    { name: "H₂O", mr: 18 }, 
    { name: "NH₃", mr: 17 }, 
    { name: "Fe₂O₃", mr: 160 },
    { name: "CuSO₄", mr: 159.5 },
    { name: "NaCl", mr: 58.5 },
    { name: "Zn", mr: 65.4 },
    { name: "Pb(NO₃)₂", mr: 331 },
    { name: "KI", mr: 166 },
    { name: "PbI₂", mr: 461 },
    { name: "Mg", mr: 24.3 },
    { name: "CaO", mr: 56 }
];

const TOPICS = [
    { id: 'mass', title: 'Moles & Mass', desc: 'Calculate moles from mass and vice versa' },
    { id: 'gas', title: 'Gas Volumes at RTP', desc: 'Calculate gas volumes using 24 dm³/mol' },
    { id: 'conc', title: 'Solution Concentration', desc: 'Calculate concentration in mol/dm³' },
    { id: 'limit', title: 'Limiting Reactant', desc: 'Identify limiting reactant and excess' },
    { id: 'titration', title: 'Titration Calculations', desc: 'Neutralisation using c₁V₁ = c₂V₂' },
    { id: 'ions', title: 'Ions in Solution', desc: 'Calculate moles of ions from concentration' },
    { id: 'yield', title: 'Percentage Yield', desc: 'Calculate efficiency of reactions' },
    { id: 'purity', title: 'Percentage Purity', desc: 'Calculate purity of impure samples' },
    { id: 'empirical', title: 'Empirical Formula', desc: 'Determine formulae from composition' },
    { id: 'hydration', title: 'Water of Crystallisation', desc: 'Calculate water molecules in hydrated salts' },
    { id: 'reacting', title: 'Reacting Masses', desc: 'Use balanced equations to calculate masses' },
    { id: 'integrated', title: 'Integrated Problems', desc: 'Multi-step problems combining concepts' }
];

// DIFFICULTY MAPPING - STRICT SEPARATION WITH PEDAGOGICAL PROGRESSION
const DIFFICULTY_TOPICS = {
    easy: ['mass', 'gas', 'conc'],              // Single-step, all info given directly
    medium: ['limit', 'titration', 'ions', 'reacting'],  // 2-3 steps, some processing needed
    hard: ['yield', 'purity', 'empirical', 'hydration', 'integrated']  // 4+ steps, integrated, less direct
};

// ==================== STATE ====================
let state = {
    score: 0,
    streak: 0,
    totalQuestions: 0,
    correctAnswers: 0,
    currentTopic: null,
    currentQ: null,
    qCount: 0,
    difficulty: 'easy'
};

// ==================== INIT ====================
document.addEventListener('DOMContentLoaded', function() {
    renderTopics();
    setupNavigation();
    setupControls();
    updateStats();
    updateDifficultyBadge();
});

function setupNavigation() {
    document.getElementById('nav-learn').onclick = function() { switchView('view-topics'); };
    document.getElementById('nav-random').onclick = function() { 
        switchView('view-random'); 
        startRandomPractice(); 
    };
    document.getElementById('nav-quiz').onclick = function() { switchView('view-quiz'); };
    document.getElementById('btn-exit').onclick = function() { switchView('view-topics'); };
    document.getElementById('btn-exit-topic').onclick = function() { switchView('view-topics'); };
}

function setupControls() {
    document.getElementById('btn-submit').onclick = checkAnswer;
    document.getElementById('btn-next').onclick = nextRandomQuestion;
    document.getElementById('btn-hint').onclick = function() {
        document.getElementById('hint-box').classList.remove('hidden');
    };
    
    document.getElementById('btn-submit-topic').onclick = checkAnswerTopic;
    document.getElementById('btn-next-topic').onclick = nextTopicQuestion;
    document.getElementById('btn-hint-topic').onclick = function() {
        document.getElementById('hint-box-topic').classList.remove('hidden');
    };
    
    document.getElementById('btn-load-quiz').onclick = loadCustomQuiz;

    document.getElementById('user-input').addEventListener('keypress', function(e) {
        if(e.key === 'Enter') checkAnswer();
    });
    document.getElementById('user-input-topic').addEventListener('keypress', function(e) {
        if(e.key === 'Enter') checkAnswerTopic();
    });

    document.getElementById('quiz-file').addEventListener('change', function(e) {
        var fileName = e.target.files[0] ? e.target.files[0].name : 'No file selected';
        document.getElementById('file-name').textContent = fileName;
    });

    // Difficulty selector
    var radios = document.querySelectorAll('input[name="difficulty"]');
    for(var i = 0; i < radios.length; i++) {
        radios[i].addEventListener('change', function(e) {
            state.difficulty = e.target.value;
            updateDifficultyBadge();
        });
    }
}

function switchView(viewId) {
    var views = document.querySelectorAll('.view');
    for(var i = 0; i < views.length; i++) {
        views[i].classList.add('hidden');
    }
    document.getElementById(viewId).classList.remove('hidden');
    
    var navBtns = document.querySelectorAll('.nav-btn');
    for(var i = 0; i < navBtns.length; i++) {
        navBtns[i].classList.remove('active');
    }
    
    if(viewId === 'view-topics') document.getElementById('nav-learn').classList.add('active');
    if(viewId === 'view-random') document.getElementById('nav-random').classList.add('active');
    if(viewId === 'view-quiz') document.getElementById('nav-quiz').classList.add('active');
}

function updateDifficultyBadge() {
    var badge = document.getElementById('difficulty-badge');
    if(badge) {
        var label = state.difficulty.charAt(0).toUpperCase() + state.difficulty.slice(1);
        badge.textContent = label;
        badge.className = 'badge ' + state.difficulty;
    }
}

function renderTopics() {
    var grid = document.getElementById('topics-grid');
    var html = '';
    for(var i = 0; i < TOPICS.length; i++) {
        var t = TOPICS[i];
        html += '<div class="topic-card" onclick="startPractice(\'' + t.id + '\')">';
        html += '<h3>' + t.title + '</h3><p>' + t.desc + '</p></div>';
    }
    grid.innerHTML = html;
}

// ==================== RANDOM PRACTICE ====================
function startRandomPractice() {
    state.qCount = 0;
    updateDifficultyBadge();
    nextRandomQuestion();
}

function nextRandomQuestion() {
    var q = generateRandomQuestion(state.difficulty);
    state.currentQ = q;
    state.qCount++;
    state.totalQuestions++;

    document.getElementById('q-count').textContent = state.qCount;
    document.getElementById('q-text').innerHTML = q.text;
    document.getElementById('unit-label').textContent = q.unit;
    document.getElementById('hint-text').textContent = q.hint;
    document.getElementById('solution-content').innerHTML = q.solution;
    
    var mistakeEl = document.getElementById('common-mistake');
    if(mistakeEl && q.commonMistake) {
        mistakeEl.textContent = q.commonMistake;
        mistakeEl.style.display = 'block';
    } else if(mistakeEl) {
        mistakeEl.style.display = 'none';
    }

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
    var input = document.getElementById('user-input');
    var val = parseFloat(input.value);
    if(isNaN(val)) { alert('Please enter a valid number'); return; }

    var correct = state.currentQ.answer;
    var tolerance = Math.max(Math.abs(correct * 0.05), 0.01);
    var isCorrect = Math.abs(val - correct) <= tolerance;

    var fb = document.getElementById('feedback');
    fb.classList.remove('hidden');

    if(isCorrect) {
        state.correctAnswers++;
        state.score += 10 + state.streak;
        state.streak++;
        fb.textContent = '✅ Correct! (+' + (10 + state.streak) + ' pts)';
        fb.classList.add('correct');
        fb.classList.remove('wrong');
    } else {
        state.streak = 0;
        fb.innerHTML = '❌ Incorrect. Answer: <b>' + correct.toPrecision(4) + '</b>';
        fb.classList.add('wrong');
        fb.classList.remove('correct');
    }

    updateStats();
    document.getElementById('solution-box').classList.remove('hidden');
    input.disabled = true;
    document.getElementById('btn-submit').disabled = true;
    document.getElementById('btn-next').disabled = false;
    document.getElementById('btn-next').focus();
}

// ==================== TOPIC PRACTICE ====================
function startPractice(topicId) {
    state.currentTopic = topicId;
    state.qCount = 0;
    switchView('view-practice');

    if(topicId === 'random') {
        document.getElementById('topic-title').textContent = "🎲 Random Practice";
        document.getElementById('nav-random').classList.add('active');
    } else {
        for(var i = 0; i < TOPICS.length; i++) {
            if(TOPICS[i].id === topicId) {
                document.getElementById('topic-title').textContent = TOPICS[i].title;
                break;
            }
        }
    }
    nextTopicQuestion();
}

function nextTopicQuestion() {
    var q = generateQuestion(state.currentTopic);
    state.currentQ = q;
    state.qCount++;
    state.totalQuestions++;

    document.getElementById('q-count-topic').textContent = state.qCount;
    document.getElementById('q-text-topic').innerHTML = q.text;
    document.getElementById('unit-label-topic').textContent = q.unit;
    document.getElementById('hint-text-topic').textContent = q.hint;
    document.getElementById('solution-content-topic').innerHTML = q.solution;
    
    var mistakeEl = document.getElementById('common-mistake-topic');
    if(mistakeEl && q.commonMistake) {
        mistakeEl.textContent = q.commonMistake;
        mistakeEl.style.display = 'block';
    } else if(mistakeEl) {
        mistakeEl.style.display = 'none';
    }

    document.getElementById('user-input-topic').value = '';
    document.getElementById('user-input-topic').disabled = false;
    document.getElementById('user-input-topic').focus();

    document.getElementById('feedback-topic').classList.add('hidden');
    document.getElementById('feedback-topic').className = 'feedback hidden';
    document.getElementById('hint-box-topic').classList.add('hidden');
    document.getElementById('solution-box-topic').classList.add('hidden');

    document.getElementById('btn-submit-topic').disabled = false;
    document.getElementById('btn-next-topic').disabled = true;
}

function checkAnswerTopic() {
    var input = document.getElementById('user-input-topic');
    var val = parseFloat(input.value);
    if(isNaN(val)) { alert('Please enter a valid number'); return; }

    var correct = state.currentQ.answer;
    var tolerance = Math.max(Math.abs(correct * 0.05), 0.01);
    var isCorrect = Math.abs(val - correct) <= tolerance;

    var fb = document.getElementById('feedback-topic');
    fb.classList.remove('hidden');

    if(isCorrect) {
        state.correctAnswers++;
        state.score += 10 + state.streak;
        state.streak++;
        fb.textContent = '✅ Correct! (+' + (10 + state.streak) + ' pts)';
        fb.classList.add('correct');
        fb.classList.remove('wrong');
    } else {
        state.streak = 0;
        fb.innerHTML = '❌ Incorrect. Answer: <b>' + correct.toPrecision(4) + '</b>';
        fb.classList.add('wrong');
        fb.classList.remove('correct');
    }

    updateStats();
    document.getElementById('solution-box-topic').classList.remove('hidden');
    input.disabled = true;
    document.getElementById('btn-submit-topic').disabled = true;
    document.getElementById('btn-next-topic').disabled = false;
    document.getElementById('btn-next-topic').focus();
}

function updateStats() {
    document.getElementById('score').textContent = state.score;
    document.getElementById('streak').textContent = state.streak;
    var accuracy = state.totalQuestions > 0 
        ? Math.round((state.correctAnswers / state.totalQuestions) * 100) 
        : 0;
    document.getElementById('accuracy').textContent = accuracy + '%';
}

// ==================== UTILITY FUNCTIONS ====================
function r(min, max, dec) {
    dec = dec || 0;
    var val = Math.random() * (max - min) + min;
    return parseFloat(val.toFixed(dec));
}
function randInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function choice(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

// ==================== RANDOM QUESTION GENERATOR ====================
function generateRandomQuestion(difficulty) {
    // Get ONLY topics for this difficulty level
    var availableTopics = DIFFICULTY_TOPICS[difficulty] || DIFFICULTY_TOPICS.easy;
    
    // Select random topic from available topics
    var topic = choice(availableTopics);
    
    // Generate question for that topic with appropriate complexity
    return generateQuestion(topic, difficulty);
}

// ==================== QUESTION GENERATOR ====================
function generateQuestion(topic, difficulty) {
    var chem = choice(CHEMICALS);

    switch(topic) {
        // ===== EASY TOPICS (Single-step, all info given) =====
        case 'mass':
            var subTypeM = randInt(1, 3);
            if(subTypeM === 1) {
                var m = r(10, 100, 1);
                var ans = m / chem.mr;
                return {
                    text: 'Calculate the number of moles in <b>' + m + ' g</b> of <b>' + chem.name + '</b>. (Mr = ' + chem.mr + ')',
                    answer: ans,
                    unit: 'mol',
                    hint: 'Use the formula: n = m / Mr',
                    solution: 'n = m / Mr<br>n = ' + m + ' / ' + chem.mr + '<br><b>n = ' + ans.toFixed(3) + ' mol</b>',
                    commonMistake: 'Students often multiply instead of divide. Remember: mass is typically larger than moles for most compounds.'
                };
            } else if(subTypeM === 2) {
                var n = r(0.5, 5, 2);
                var ans2 = n * chem.mr;
                return {
                    text: 'What mass of <b>' + chem.name + '</b> contains <b>' + n + ' moles</b>? (Mr = ' + chem.mr + ')',
                    answer: ans2,
                    unit: 'g',
                    hint: 'Rearrange: m = n × Mr',
                    solution: 'm = n × Mr<br>m = ' + n + ' × ' + chem.mr + '<br><b>m = ' + ans2.toFixed(1) + ' g</b>',
                    commonMistake: 'Don\'t forget to use the correct Mr value. Check the formula of the compound.'
                };
            } else {
                var n2 = r(0.5, 3, 1);
                var parts = (n2 * 6.02).toFixed(2);
                return {
                    text: 'A sample contains <b>' + parts + ' × 10²³</b> particles. How many moles is this?',
                    answer: n2,
                    unit: 'mol',
                    hint: 'Divide by Avogadro constant (6.02 × 10²³)',
                    solution: 'n = particles / Avogadro constant<br>n = ' + parts + ' × 10²³ / 6.02 × 10²³<br><b>n = ' + n2 + ' mol</b>',
                    commonMistake: 'Remember Avogadro constant is 6.02 × 10²³, not 6.02 alone.'
                };
            }

        case 'gas':
            var subTypeG = randInt(1, 2);
            if(subTypeG === 1) {
                var v = r(12, 120, 1);
                return {
                    text: 'A gas occupies <b>' + v + ' dm³</b> at room temperature and pressure (RTP). Calculate the number of moles.',
                    answer: v/24,
                    unit: 'mol',
                    hint: 'At RTP, 1 mole of any gas occupies 24 dm³',
                    solution: 'n = V / 24 (at RTP)<br>n = ' + v + ' / 24<br><b>n = ' + (v/24).toFixed(3) + ' mol</b>',
                    commonMistake: 'This only applies at RTP (24 dm³/mol). At STP, use 22.4 dm³/mol instead.'
                };
            } else {
                var m2 = r(10, 100, 0);
                var gas = choice([{n:'CO₂', mr:44}, {n:'O₂', mr:32}, {n:'N₂', mr:28}]);
                var mol = m2 / gas.mr;
                var ans3 = mol * 24;
                return {
                    text: 'Calculate the volume occupied by <b>' + m2 + ' g</b> of <b>' + gas.n + '</b> at RTP. (Mr = ' + gas.mr + ')',
                    answer: ans3,
                    unit: 'dm³',
                    hint: '1. Find moles from mass  2. Convert to volume using 24 dm³/mol',
                    solution: 'Step 1: n = m/Mr = ' + m2 + '/' + gas.mr + ' = ' + mol.toFixed(2) + ' mol<br>Step 2: V = n × 24 = ' + mol.toFixed(2) + ' × 24<br><b>V = ' + ans3.toFixed(2) + ' dm³</b>',
                    commonMistake: 'Students often skip the mole step. Always go: Mass → Moles → Volume.'
                };
            }

        case 'conc':
            var c = r(0.1, 2.0, 2);
            var v2 = randInt(50, 500);
            return {
                text: 'Calculate the number of moles of solute in <b>' + v2 + ' cm³</b> of <b>' + c + ' mol/dm³</b> solution.',
                answer: c * (v2/1000),
                unit: 'mol',
                hint: 'Remember to convert cm³ to dm³ first (divide by 1000)',
                solution: 'V = ' + v2 + ' cm³ = ' + (v2/1000) + ' dm³<br>n = c × V<br>n = ' + c + ' × ' + (v2/1000) + '<br><b>n = ' + (c*(v2/1000)).toFixed(4) + ' mol</b>',
                commonMistake: 'Most common error: forgetting to convert cm³ to dm³ before calculating. Always check units!'
            };

        // ===== MEDIUM TOPICS (2-3 steps, some processing) =====
        case 'limit':
            var h2 = r(2, 10, 1);
            var o2 = r(1, 10, 1);
            var neededO2 = h2 / 2;
            var excess = o2 > neededO2 ? (o2 - neededO2) : 0;
            var limiting = o2 > neededO2 ? 'H₂' : 'O₂';
            return {
                text: '<b>2H₂ + O₂ → 2H₂O</b><br><br>In an experiment, <b>' + h2 + ' moles</b> of hydrogen gas are mixed with <b>' + o2 + ' moles</b> of oxygen gas and ignited.<br><br>Calculate the number of moles of the <b>excess reactant</b> remaining after the reaction is complete.',
                answer: Math.max(0, excess),
                unit: 'mol',
                hint: '1. Use the mole ratio from the equation (2:1)  2. Determine which reactant limits  3. Calculate excess',
                solution: 'From equation: 2 mol H₂ requires 1 mol O₂<br>For ' + h2 + ' mol H₂, need ' + neededO2.toFixed(2) + ' mol O₂<br>Available O₂ = ' + o2 + ' mol<br>' + (o2 > neededO2 ? 'O₂ is in excess' : 'H₂ is in excess') + '<br>Excess = ' + (o2 > neededO2 ? (o2 + ' - ' + neededO2.toFixed(2)) : (h2 + ' - ' + (o2*2))) + '<br><b>Excess = ' + excess.toFixed(2) + ' mol</b>',
                commonMistake: 'Students calculate excess of the wrong reactant. Always identify the limiting reactant FIRST, then calculate excess of the OTHER reactant.'
            };

        case 'titration':
            var c1 = r(0.1, 1.0, 2);
            var v1 = r(20, 50, 1);
            var v3 = r(20, 50, 1);
            var c2 = (c1*v1)/v3;
            return {
                text: 'In a titration, <b>' + v1 + ' cm³</b> of <b>' + c1 + ' mol/dm³</b> hydrochloric acid exactly neutralizes <b>' + v3 + ' cm³</b> of sodium hydroxide solution.<br><br><b>HCl + NaOH → NaCl + H₂O</b><br><br>Calculate the concentration of the sodium hydroxide solution.',
                answer: c2,
                unit: 'mol/dm³',
                hint: '1. Find moles of HCl  2. Use 1:1 ratio  3. Calculate concentration of NaOH',
                solution: 'n(HCl) = c × V = ' + c1 + ' × (' + v1 + '/1000) = ' + (c1*v1/1000).toFixed(4) + ' mol<br>Ratio HCl:NaOH = 1:1<br>n(NaOH) = ' + (c1*v1/1000).toFixed(4) + ' mol<br>c(NaOH) = n/V = ' + (c1*v1/1000).toFixed(4) + ' / (' + v3 + '/1000)<br><b>c = ' + c2.toFixed(3) + ' mol/dm³</b>',
                commonMistake: 'Using c₁V₁ = c₂V₂ without considering the mole ratio. For 1:1 ratios it works, but always check the balanced equation first.'
            };

        case 'ions':
            var salts = [
                {f:'MgCl₂', name:'chloride', ionSymbol:'Cl⁻', nIon:2},
                {f:'AlCl₃', name:'chloride', ionSymbol:'Cl⁻', nIon:3},
                {f:'Na₂SO₄', name:'sodium', ionSymbol:'Na⁺', nIon:2}
            ];
            var s = choice(salts);
            var vol = randInt(100, 500);
            var conc2 = r(0.1, 2.0, 1);
            var molSalt = conc2 * (vol/1000);
            var ans4 = molSalt * s.nIon;
            return {
                text: 'A solution is prepared by dissolving <b>' + s.f + '</b> in water. Calculate the number of moles of <b>' + s.name + ' ions (' + s.ionSymbol + ')</b> present in <b>' + vol + ' cm³</b> of <b>' + conc2 + ' mol/dm³</b> ' + s.f + ' solution.',
                answer: ans4,
                unit: 'mol',
                hint: '1. Find moles of the salt  2. Consider how many ions per formula unit  3. Multiply',
                solution: 'n(' + s.f + ') = c × V = ' + conc2 + ' × ' + (vol/1000) + ' = ' + molSalt.toFixed(3) + ' mol<br>' + s.f + ' dissociates: ' + s.f + ' → ' + s.nIon + ' ' + s.ionSymbol + ' per formula<br>n(' + s.ionSymbol + ') = ' + molSalt.toFixed(3) + ' × ' + s.nIon + '<br><b>n = ' + ans4.toFixed(3) + ' mol</b>',
                commonMistake: 'Forgetting to multiply by the number of ions per formula unit. MgCl₂ gives 2 Cl⁻ ions, AlCl₃ gives 3 Cl⁻ ions.'
            };

        case 'reacting':
            var massMg = r(10, 50, 1);
            var molMg = massMg / 24.3;
            var ans5 = molMg * 40.3;
            return {
                text: '<b>2Mg + O₂ → 2MgO</b><br><br>A student burns <b>' + massMg + ' g</b> of magnesium ribbon in excess oxygen.<br><br>Calculate the maximum mass of magnesium oxide that could be produced.<br>(Ar: Mg = 24.3, O = 16)',
                answer: ans5,
                unit: 'g',
                hint: 'Use the 5-step method: Mass → Moles → Ratio → Moles → Mass',
                solution: 'Step 1: n(Mg) = ' + massMg + '/24.3 = ' + molMg.toFixed(3) + ' mol<br>Step 2: From equation, ratio Mg:MgO = 2:2 = 1:1<br>Step 3: n(MgO) = ' + molMg.toFixed(3) + ' mol<br>Step 4: Mr(MgO) = 24.3 + 16 = 40.3<br>Step 5: m = ' + molMg.toFixed(3) + ' × 40.3<br><b>m = ' + ans5.toFixed(2) + ' g</b>',
                commonMistake: 'Not using the mole ratio from the balanced equation. Even though this is 1:1, always show the ratio step.'
            };

        // ===== HARD TOPICS (4+ steps, integrated, less direct info) =====
        case 'yield':
            var theo = r(50, 100, 1);
            var act = r(theo*0.6, theo*0.95, 1);
            return {
                text: 'A student carried out a reaction to produce copper(II) sulfate crystals. The maximum theoretical yield calculated was <b>' + theo + ' g</b>. After crystallisation and drying, the student obtained <b>' + act + ' g</b> of pure crystals.<br><br>Calculate the percentage yield of this experiment.',
                answer: (act/theo)*100,
                unit: '%',
                hint: 'Percentage yield compares what was actually obtained to what should have been obtained',
                solution: 'Percentage Yield = (Actual Yield / Theoretical Yield) × 100<br>= (' + act + ' / ' + theo + ') × 100<br><b>= ' + ((act/theo)*100).toFixed(1) + '%</b>',
                commonMistake: 'Students divide theoretical by actual instead of actual by theoretical. Remember: yield is always ≤ 100%, so actual goes on top.'
            };

        case 'purity':
            var sampleMass = r(10, 50, 1);
            var purity = r(75, 98, 1);
            var pureMass = sampleMass * (purity/100);
            var chem2 = choice(CHEMICALS);
            var mol = pureMass / chem2.mr;
            return {
                text: 'A <b>' + sampleMass + ' g</b> sample of impure <b>' + chem2.name + '</b> was analysed and found to be <b>' + purity + '%</b> pure. The impurities do not react.<br><br>Calculate the number of moles of <b>pure ' + chem2.name + '</b> present in this sample. (Mr = ' + chem2.mr + ')',
                answer: mol,
                unit: 'mol',
                hint: '1. First find the mass of pure compound  2. Then convert to moles',
                solution: 'Mass of pure ' + chem2.name + ' = ' + sampleMass + ' × ' + purity + '/100 = ' + pureMass.toFixed(2) + ' g<br>n = m/Mr = ' + pureMass.toFixed(2) + ' / ' + chem2.mr + '<br><b>n = ' + mol.toFixed(3) + ' mol</b>',
                commonMistake: 'Using the impure sample mass directly without adjusting for purity. Always calculate pure mass first!'
            };

        case 'empirical':
            var x = randInt(1, 4);
            var mr2 = 12 + x;
            var pc = (12/mr2)*100;
            return {
                text: 'A hydrocarbon was analysed and found to contain <b>' + pc.toFixed(1) + '%</b> carbon by mass. The remainder is hydrogen.<br><br>(a) Calculate the empirical formula of this hydrocarbon.<br>(b) Given that the molecular mass is <b>' + (mr2*2) + '</b>, deduce the molecular formula.<br><br>Enter the value of x in CHₓ for the molecular formula.',
                answer: x * 2,
                unit: '',
                hint: '1. Assume 100g sample  2. Find moles of each element  3. Find simplest ratio  4. Scale to molecular mass',
                solution: 'Assume 100g: C = ' + pc.toFixed(1) + 'g, H = ' + (100-pc).toFixed(1) + 'g<br>n(C) = ' + pc.toFixed(1) + '/12 = ' + (pc/12).toFixed(2) + ' mol<br>n(H) = ' + (100-pc).toFixed(1) + '/1 = ' + (100-pc).toFixed(1) + ' mol<br>Ratio C:H = 1:' + x + '<br>Empirical formula: CH' + x + ' (mass = ' + mr2 + ')<br>Multiplier = ' + (mr2*2) + '/' + mr2 + ' = 2<br><b>Molecular formula: C₂H' + (x*2) + '</b><br>x = ' + (x*2),
                commonMistake: 'Stopping at empirical formula without finding molecular formula. Always check if molecular mass is given!'
            };

        case 'hydration':
            var hydrated = r(10, 25, 1);
            var anhydrous = r(6, 15, 1);
            var waterLost = hydrated - anhydrous;
            var molWater = waterLost / 18;
            var molSalt = anhydrous / 159.5;
            var x2 = Math.round(molWater / molSalt);
            return {
                text: '<b>Experimental Determination of Water of Crystallisation</b><br><br>A student heated <b>' + hydrated + ' g</b> of hydrated copper(II) sulfate, CuSO₄·xH₂O, in a crucible until constant mass was achieved. The remaining anhydrous CuSO₄ had a mass of <b>' + anhydrous + ' g</b>.<br><br>Calculate the value of <b>x</b> in the formula.<br>(Mr: CuSO₄ = 159.5, H₂O = 18)',
                answer: x2,
                unit: '',
                hint: '1. Find mass of water lost  2. Convert both to moles  3. Find the mole ratio',
                solution: 'Mass of water lost = ' + hydrated + ' - ' + anhydrous + ' = ' + waterLost.toFixed(1) + ' g<br>n(H₂O) = ' + waterLost.toFixed(1) + '/18 = ' + molWater.toFixed(3) + ' mol<br>n(CuSO₄) = ' + anhydrous + '/159.5 = ' + molSalt.toFixed(3) + ' mol<br>Ratio = ' + molWater.toFixed(3) + '/' + molSalt.toFixed(3) + ' = ' + (molWater/molSalt).toFixed(1) + ' ≈ ' + x2 + '<br><b>x = ' + x2 + '</b><br>Formula: CuSO₄·' + x2 + 'H₂O',
                commonMistake: 'Students divide masses instead of moles. The ratio must be in MOLES, not grams! This is the most common error.'
            };

        case 'integrated':
            // Multi-step: Mass → Purity → Moles → Ratio → Gas Volume
            var sampleMass2 = r(5, 30, 1);
            var purity2 = r(70, 95, 1);
            var pureMass2 = sampleMass2 * (purity2/100);
            var mol2 = pureMass2 / 100; // CaCO₃
            var volCO2 = mol2 * 24;
            return {
                text: '<b>Integrated Problem</b><br><br><b>CaCO₃ + 2HCl → CaCl₂ + H₂O + CO₂</b><br><br>A <b>' + sampleMass2 + ' g</b> sample of impure limestone (calcium carbonate) that is <b>' + purity2 + '%</b> pure is reacted with excess dilute hydrochloric acid.<br><br>Calculate the volume of carbon dioxide gas produced at room temperature and pressure.<br>(Mr: CaCO₃ = 100)',
                answer: volCO2,
                unit: 'dm³',
                hint: 'This requires 4 steps: 1. Adjust for purity  2. Find moles of CaCO₃  3. Use mole ratio  4. Convert to gas volume',
                solution: 'Step 1: Pure CaCO₃ = ' + sampleMass2 + ' × ' + purity2 + '/100 = ' + pureMass2.toFixed(2) + ' g<br>Step 2: n(CaCO₃) = ' + pureMass2.toFixed(2) + '/100 = ' + mol2.toFixed(3) + ' mol<br>Step 3: From equation, ratio CaCO₃:CO₂ = 1:1<br>n(CO₂) = ' + mol2.toFixed(3) + ' mol<br>Step 4: V(CO₂) = ' + mol2.toFixed(3) + ' × 24 (at RTP)<br><b>V = ' + volCO2.toFixed(2) + ' dm³</b>',
                commonMistake: 'Multiple errors possible: forgetting purity adjustment, wrong mole ratio, or using wrong gas volume (24 dm³ at RTP, not 22.4).'
            };

        default:
            return {
                text: 'Question generation error',
                answer: 0,
                unit: '',
                hint: '',
                solution: '',
                commonMistake: ''
            };
    }
}

// ==================== CUSTOM QUIZ LOADER ====================
function loadCustomQuiz() {
    var fileInput = document.getElementById('quiz-file');
    var file = fileInput.files[0];

    if(!file) {
        alert('Please select a JSON file first!');
        return;
    }

    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            var customQuiz = JSON.parse(e.target.result);
            alert('Quiz loaded: ' + (customQuiz.title || 'Custom Quiz'));
        } catch(err) {
            alert('Invalid JSON file format!');
        }
    };
    reader.readAsText(file);
}