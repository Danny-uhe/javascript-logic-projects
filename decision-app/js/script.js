let currentAnswer = {};
let currentDecision = null;
let decisionHistory = [];

// Questions
const questions = [
  {
    id: "money",
    text: "Do you have enough money?",
    options: ["Yes", "A little", "No"],
  },
  {
    id: "time",
    text: "Do you have free time?",
    options: ["Yes", "Busy", "Very Busy"],
  },
  {
    id: "mood",
    text: "How is your mood?",
    options: ["Happy", "Tired", "Motivated", "Stressed"],
  },
  // {id: "health", text: "How is your health?", options:["Good", "Average", "Poor"] },
  // {id: "social", text: "How is your social life?", options:["Active", "Moderate", "Quiet"] },
  // {id: "energy", text: "How is your energy level?", options:["High", "Medium", "Low"] },
  {
    id: "weather",
    text: "What is the weather like?",
    options: ["Sunny", "Rainy", "Cold", "Hot"],
  },
  // {id: "location", text: "Where are you?", options:["Home", "Work", "Outdoors", "Traveling"] },
  // {id: "company", text: "Who are you with?", options:["Alone", "Friends", "Family", "Colleagues"] },
  // {id: "hobby", text: "What is your favorite hobby?", options:["Sports", "Arts", "Gaming", "Cooking"] },
  // {id: "goal", text: "What is your main goal?", options:["Relaxation", "Productivity", "Socializing", "Adventure"] },
  // {id: "stress", text: "How stressed are you?", options:["Not at all", "A little", "Moderately", "Very"] },
  // {id: "sleep", text: "How well did you sleep?", options:["Well", "Average", "Poor"] },
  // {id: "exercise", text: "How often do you exercise?", options:["Regularly", "Occasionally", "Rarely"] },
  // {id: "diet", text: "How is your diet?", options:["Healthy", "Average", "Unhealthy"] },
  // {id: "happiness", text: "How happy are you?", options:["Very Happy", "Happy", "Neutral", "Unhappy"] },
  // {id: "productivity", text: "How productive are you feeling?", options:["Very Productive", "Productive", "Neutral", "Unproductive"] },
  { id: "priority", text: "Important work tomorrow?", options: ["Yes", "No"] },
];

// ================== LOGIC ==================

function analyzeDecision() {
  let score = 0;

  if (currentAnswers.money === "Yes") score += 25;
  if (currentAnswers.time === "Yes") score += 25;
  if (currentAnswers.mood === "Happy" || currentAnswers.mood === "Motivated")
    score += 20;
  if (currentAnswers.wheather === "Good") score += 15;
  if (currentAnswers.priority === "No") score += 15;

  let decisionText, emoji, explanation, advice;
  if (score >= 70) {
    decisionText = "You should go out";
    emoji = "🎉";
    explanation =
      "Conditions look good. You have money, time and positive mood.";
    advice = "Enjoy your day and take action!";
  } else if (score >= 45) {
    decisionText = " proceed with caution";
    emoji = "⚠️";
    explanation =
      "Some factors are favorable, but there are also some challenges.";
    advice = "Consider the risks and benefits before deciding.";
  } else {
    decisionText = "Stay Home today";
    emoji = "🏠";
    explanation =
      "Conditions are not ideal. You may be low on money, time or energy.";
    advice = "Focus on self-care and rest today.";
  }

  currentDecision = {
    date: new Date().toLocaleDateString("en-AFRICA", { weekday: "long" }),
    decision: decisionText,
    emoji: emoji,
    explanation: explanation,
    advice: advice,
  };
  showResult();
}

//======================= UI FUNCTIONS =========================

function startDecision() {
  currentAnswers = {};
  document.getElementById("main-screen").classList.add("hidden");
  document.getElementById("questions-screen").classList.remove("hidden");
  renderQuestions();
}

function renderQuestions() {
  const container = document.getElementById("question-container");
  container.innerHTML = "";

  questions.forEach((question) => {
    let html = `<div class="question">
                <label>${question.text}</label>
                <div class="options">`;

    question.options.forEach((option) => {
      const isActive = currentAnswers[question.id] === option ? "active" : "";
      html += `
                    <button onclick="selectAnswer('${question.id}', '${option}')"
                    class="option-btn ${isActive}">
                    ${option}
                    </button>
                    `;
    });
    html += `</div></div>`;
    container.innerHTML += html;
  });
}

function selectAnswer(id, value) {
  currentAnswers[id] = value;
  renderQuestions(); //Refresh to show active button
}

function showResult() {
  document.getElementById("questions-screen").classList.add("hidden");
  document.getElementById("result-screen").classList.remove("hidden");

  document.getElementById("decision-emoji").textContent = currentDecision.emoji;
  document.getElementById("main-decision").textContent =
    currentDecision.decision;
  document.getElementById("confidence").textContent =
    currentDecision.confidence;
  document.getElementById("explanation").textContent =
    currentDecision.explanation;
  document.getElementById("advice").textContent = currentDecision.advice;
}

function saveCurrentDecision() {
  if (!currentDecision) return;
  decisionHistory.unshift(currentDecision);
  if (decisionHistory.length > 17) decisionHistory.pop();
  alert("✅ Decision saved!");
}

function newDecision() {
  document.getElementById("result-screen").classList.add("hidden");
  document.getElementById("main-screen").classList.remove("hidden");
}


function toggleHistory() {
  const panel = document.getElementById("history-panel");
  panel.classList.toggle("hidden");
  renderHistory();
}

function renderHistory() {
  const container = document.getElementById("history-list");
  container.innerHTML = "";

  decisionHistory.forEach((item) => {
    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML = `
            <div>
            <strong>${item.date}</strong><br>
            ${item.decision}
            </div>
            <span style="font-size: 40px;">${item.emoji}</span>
        `;
    container.appendChild(historyItem);
  });
}

// Save history to browser storage
function saveToLocalStorage() {
  localStorage.setItem("lifeLogicHistory", JSON.stringify(decisionHistory));
}

// Load history from browser storage
function loadFromLocalStorage() {
  const saved = localStorage.getItem("lifeLogicHistory");
  if (saved) {
    decisionHistory = JSON.parse(saved);
  }
}

// Update saveCurrentDecision function
function saveCurrentDecision() {
  if (!currentDecision) return;

  decisionHistory.unshift(currentDecision); // Add to beginning
  if (decisionHistory.length > 15) decisionHistory.pop(); // Limit to 15

  saveToLocalStorage();
  alert("✅ Decision saved successfully!");
}

// Update toggleHistory to load data
function toggleHistory() {
  const panel = document.getElementById("history-panel");
  panel.classList.toggle("hidden");

  if (!panel.classList.contains("hidden")) {
    renderHistory();
  }
}

// Save history to browser storage on page unload
function saveToLocalStorage() {
  localStorage.setItem('lifeLogicHistory', JSON.stringify(decisionHistory));
}

// Load history from browser storage on page load
function loadFromLocalStorage() {
  const saved = localStorage.getItem('lifeLogicHistory');
  if (saved) {
    decisionHistory = JSON.parse(saved);
  }
}

//update toggleHistory to load data

function toggleHistory() {
  const panel = document.getElementById('history-panel');
  panel.classList.toggle('hidden');

  if (!panel.classList.contains('hidden')) {
    renderHistory();
  }
}

// initialize App
window.onload = function() {
  loadFromLocalStorage();
  console.log("%cLife Logic Decision App Started Successfully!", "color: #38bdf8; font-size: 14px");
}