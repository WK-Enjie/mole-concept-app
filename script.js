// Data Constants
const TOPICS = {
    basic: [{id:'moles-mass', title:'Moles from Mass', desc:'n = m/Mr', icon:'⚖️'}],
    intermediate: [{id:'concentration', title:'Concentration', desc:'n = c × V', icon:'🧪'}],
    advanced: [{id:'yield', title:'Percentage Yield', desc:'%', icon:'📈'}]
};

const LESSONS = {
    'moles-mass': `<h2>Moles from Mass</h2><p>The formula is <b>n = m / Mr</b>.</p>`
};

let stats = {correct: 0, total: 0, streak: 0};
let quizzes = [];

// Tab Logic
function openTab(evt, tabId) {
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    evt.currentTarget.classList.add('active');
}

// Subfolder JSON Loader
async function loadFromSubfolder() {
    const filename = document.getElementById('url-inp').value;
    const msg = document.getElementById('url-msg');
    
    // Assumes your JSON files are in a folder named 'worksheets'
    const path = `./worksheets/${filename}`;

    try {
        const response = await fetch(path);
        if (!response.ok) throw new Error("File not found in /worksheets");
        const data = await response.json();
        addQuiz(data, filename);
        msg.innerHTML = "✅ Loaded!";
        msg.style.color = "#22c55e";
    } catch (err) {
        msg.innerHTML = "❌ Error: " + err.message;
        msg.style.color = "#ef4444";
    }
}

function addQuiz(quiz, title) {
    quizzes.push({ title: quiz.title || title, questions: quiz.questions });
    renderLibrary();
}

function renderLibrary() {
    const lib = document.getElementById('quiz-lib');
    lib.innerHTML = quizzes.map((q, i) => `
        <div class="stat-card" style="margin-bottom:10px; text-align:left;">
            <strong>${q.title}</strong> (${q.questions.length} Qs)
            <button onclick="startWorksheet(${i})" style="float:right;">Start</button>
        </div>
    `).join('');
}

// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Basic initialization
    const list = document.getElementById('topic-list');
    list.innerHTML = TOPICS.basic.map(t => `<div class="topic-card"><h3>${t.title}</h3><p>${t.desc}</p></div>`).join('');
});
