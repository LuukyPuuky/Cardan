const textContainer = document.getElementById("dyslexiaText");
const checkButton = document.getElementById("checkButton");
const answerInput = document.getElementById("answer");
const result = document.getElementById("result");
const attemptsCounter = document.getElementById("attempts");
const timerDisplay = document.getElementById("tijd");
const intensitySelect = document.getElementById("intensity");
const question = document.querySelector(".question");

let attempts = 0;
let timeInterval;
let seconds = 0;
let minutes = 0;
let timer;
let allScenarios = [];
let currentScenarioIndex = 0;
let questionsAnswered = 0;
const maxQuestions = 5;

function createStartButton() {
  const startButton = document.getElementById("simulatiebutton");
  startButton.textContent = "Start Simulatie";
  startButton.classList.add("start-button");

  const timeElement = document.getElementById("tijd");
  timeElement.parentNode.insertBefore(startButton, timeElement.nextSibling);

  startButton.addEventListener("click", () => {
    if (!simulationStarted) {
      simulationStarted = true;
      startTimer();

      startButton.textContent = "Simulatie Actief";
      startButton.classList.add("active");
      startButton.disabled = true;

      formSection.classList.add("simulation-active");
      formSection.classList.add("highlight");
      setTimeout(() => {
        formSection.classList.remove("highlight");
      }, 1000);
    }
  });
}

function startTimer() {
  timeInterval = setInterval(() => {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    timerDisplay.textContent = `Tijd: ${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

function renderText(text, intensity) {
  textContainer.innerHTML = "";
  for (let char of text) {
    const span = document.createElement("span");
    span.textContent = char;
    span.style.animationDelay = `${Math.random() * 2}s`;
    span.style.animationName = intensity === "high" ? "moveHigh" : "moveLow";
    textContainer.appendChild(span);
  }
}

async function getScenarios() {
  try {
    const response = await fetch("scenarios.json");
    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }
    allScenarios = await response.json();
    loadNextScenario();
  } catch (error) {
    console.error("Fout bij het laden van scenario's:", error.message);
  }
}

function loadNextScenario() {
  if (questionsAnswered >= maxQuestions) {
    textContainer.innerHTML = "Je hebt alle vragen beantwoord!";
    question.textContent = "";
    clearInterval(timer);
    return;
  }

  answerInput.value = "";
  result.textContent = "";
  startTimer();

  const rng = Math.floor(Math.random() * allScenarios.length);
  currentScenarioIndex = rng;

  const scenario = allScenarios[rng];
  renderText(scenario.text, intensitySelect.value);
  question.textContent = scenario.question;
}

checkButton.addEventListener("click", () => {
  const userAnswer = answerInput.value.toLowerCase();
  attempts++;
  attemptsCounter.textContent = `Aantal pogingen: ${attempts}`;

  const expected = allScenarios[currentScenarioIndex].answers;
  const isCorrect = expected.some((answer) => userAnswer.includes(answer));

  result.textContent = isCorrect ? "✅ Correct!" : "❌ Probeer het opnieuw.";
  result.style.color = isCorrect ? "green" : "red";

  if (isCorrect) {
    questionsAnswered++;
    setTimeout(() => loadNextScenario(), 1000);
  }
});

intensitySelect.addEventListener("change", () => {
  const scenario = allScenarios[currentScenarioIndex];
  renderText(scenario.text, intensitySelect.value);
});

function dropdown() {
  const infoCards = document.querySelectorAll(".info-card");
  infoCards.forEach((card) => {
    card.addEventListener("click", () => {
      card.classList.toggle("expanded");
      const content = card.querySelector(".info-content");
      const arrow = card.querySelector(".arrow");
      content.classList.toggle("hidden");
      arrow.classList.toggle("rotated");
    });
  });
}

dropdown();
createStartButton();

// Init
document.addEventListener("DOMContentLoaded", getScenarios);
