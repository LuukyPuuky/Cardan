const textContainer = document.getElementById("dyslexiaText");
const checkButton = document.getElementById("checkButton");
const answerInput = document.getElementById("answer");
const result = document.getElementById("result");
const attemptsCounter = document.getElementById("attempts");
const timerDisplay = document.getElementById("tijd");
const intensitySelect = document.getElementById("intensity");
const question = document.querySelector(".question");
const formSection = document.querySelector(".form-section");
const correctCounter = document.getElementById("correctCounter");

let attempts = 0;
let timeInterval;
let seconds = 0;
let minutes = 0;
let simulationStarted = false;
let allScenarios = [];
let currentScenarioIndex = 0;
let questionsAnswered = 0;
const maxQuestions = 5;

// Shuffle the scenarios
let shuffledScenarios = [];
let currentShuffledIndex = 0;

function createStartButton() {
  const startButton = document.getElementById("simulatiebutton");
  startButton.textContent = "Start Simulatie";
  startButton.classList.add("start-button");

  const timeElement = document.getElementById("tijd");
  timeElement.parentNode.insertBefore(startButton, timeElement.nextSibling);

  startButton.addEventListener("click", () => {
    if (!simulationStarted) {
      simulationStarted = true;
      questionsAnswered = 0;
      attempts = 0;
      seconds = 0;
      minutes = 0;
      timerDisplay.textContent = "Tijd: 00:00";
      attemptsCounter.textContent = "Aantal pogingen: 0";

      // Shuffle scenarios
      shuffledScenarios = [...allScenarios];
      shuffleArray(shuffledScenarios);
      currentShuffledIndex = 0;
      startTimer();
      loadNextScenario();

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
  clearInterval(timeInterval); // Prevent overlapping timers
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

function stopTimer() {
  clearInterval(timeInterval);
}

function resetTimer() {
  stopTimer();
  seconds = 0;
  minutes = 0;
  timerDisplay.textContent = "Tijd: 00:00";
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
    // Do NOT load scenario yet — wait for Simulatie click
  } catch (error) {
    console.error("Fout bij het laden van scenario's:", error.message);
  }
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function loadNextScenario() {
  // Check if all scenarios have been answered

  if (questionsAnswered >= maxQuestions) {
    textContainer.innerHTML = "Je hebt alle vragen beantwoord!";
    question.textContent = "";
    resetTimer();
    alert("Goed gedaan! Je hebt alle vragen beantwoord.");
    const startButton = document.getElementById("simulatiebutton");
    startButton.textContent = "Start Simulatie";
    startButton.classList.remove("active");
    startButton.disabled = false;
    simulationStarted = false;
    return;
  }

  answerInput.value = "";
  result.textContent = "";

  // use the next scenario from the shuffle list

  const scenario = shuffledScenarios[currentShuffledIndex];
  currentScenarioIndex = allScenarios.indexOf(scenario);
  renderText(scenario.text, intensitySelect.value);
  question.textContent = scenario.question;
  currentShuffledIndex++;
}

checkButton.addEventListener("click", () => {
  if (!simulationStarted) return;

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
  if (!simulationStarted) return;
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

// Init
document.addEventListener("DOMContentLoaded", () => {
  timerDisplay.textContent = "Tijd: 00:00";
  getScenarios();
  createStartButton();
  dropdown();
});
