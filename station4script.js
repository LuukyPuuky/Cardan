// Initialize global variables
let gameActive = false;
let currentGame = "Cerebrale"; // Default game
let timeInterval;
let seconds = 0;
let minutes = 0;
let simulationStarted = false;

// DOM Elements
const tabs = document.querySelectorAll(".tab");
const formSection = document.querySelector(".form-section");
const customCursor = document.getElementById("cursor");
const formInputs = document.querySelectorAll(".form-section input");
const timeDisplay = document.getElementById("tijd");
const sendButton = document.getElementById("verzenden");

let cursorX = 0;
let cursorY = 0;
let jitterOffsetX = 0;
let jitterOffsetY = 0;

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

function initGame() {
  tabs[0].classList.add("active");
  setupTabs();
  setupFormSectionTracking();
  setupInputFields();
  setupSendButton();
  createStartButton();
  timeDisplay.textContent = "Tijd: 00:00";
}

function startTimer() {
  timeInterval = setInterval(() => {
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
    }
    timeDisplay.textContent = `Tijd: ${minutes
      .toString()
      .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }, 1000);
}

function setupTabs() {
  tabs.forEach((tab, index) => {
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      currentGame = index === 0 ? "Cerebrale" : "multipleSclerosis";
      resetGameState();
    });
  });
}

function resetGameState() {
  if (simulationStarted) {
    resetSimulation();
    return;
  }

  seconds = 0;
  minutes = 0;
  timeDisplay.textContent = "Tijd: 00:00";

  formInputs.forEach((input) => {
    input.value = "";
  });

  customCursor.style.display = "none";
  document.body.style.cursor = "auto";
  gameActive = false;

  formSection.classList.remove("game-active");
  formSection.classList.remove("simulation-active");

  const subtitle = document.querySelector(".subtitle");
  const title = document.querySelector(".title");

  if (currentGame === "Cerebrale") {
    subtitle.textContent =
      "Tijdens het selecteren van de verschillende invulvakken beweegt je muis alle kanten op.";
    title.textContent =
      "Ervaar hoe het voelt om een aandoening te hebben die het moeilijk maakt om je muis te bedienen. (Cerebrale Parese)";
  } else {
    subtitle.textContent =
      "Tijdens het typen in de invulvakken verschijnen er random letters, waardoor het moeilijker is om te typen.";
    title.textContent =
      "Ervaar hoe het voelt om een aandoening te hebben die het moeilijk maakt om te typen. (Multiple Sclerose)";
  }
}

function setupFormSectionTracking() {
  formSection.addEventListener("mouseenter", () => {
    if (simulationStarted && currentGame === "Cerebrale") {
      document.body.style.cursor = "none";
      customCursor.style.display = "block";
      gameActive = true;
      formSection.classList.add("game-active");
      requestAnimationFrame(animateCursor);
    }
  });

  formSection.addEventListener("mouseleave", () => {
    gameActive = false;
    customCursor.style.display = "none";
    document.body.style.cursor = "auto";
    formSection.classList.remove("game-active");
  });

  document.addEventListener("mousemove", (e) => {
    cursorX = e.clientX + window.pageXOffset;
    cursorY = e.clientY + window.pageYOffset;
  });
}

function animateCursor() {
  if (!gameActive || !simulationStarted || currentGame !== "Cerebrale") return;

  jitterOffsetX = (Math.random() - 0.5) * 30;
  jitterOffsetY = (Math.random() - 0.5) * 30;

  customCursor.style.left = `${cursorX + jitterOffsetX}px`;
  customCursor.style.top = `${cursorY + jitterOffsetY}px`;

  requestAnimationFrame(animateCursor);
}

function setupInputFields() {
  formInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      if (simulationStarted && currentGame === "multipleSclerosis") {
        input.addEventListener("input", handleInputChange);
      }
    });

    input.addEventListener("blur", () => {
      if (simulationStarted && currentGame === "multipleSclerosis") {
        input.removeEventListener("input", handleInputChange);
      }
    });
  });
}

function handleInputChange(e) {
  if (currentGame !== "multipleSclerosis") return;

  const currentValue = e.target.value;

  if (Math.random() > 0.7) {
    const randomChar = String.fromCharCode(97 + Math.floor(Math.random() * 26));
    const cursorPos = e.target.selectionStart;
    const newValue =
      currentValue.slice(0, cursorPos) +
      randomChar +
      currentValue.slice(cursorPos);
    e.target.value = newValue;
    e.target.setSelectionRange(cursorPos + 1, cursorPos + 1);
  }
}

function setupSendButton() {
  sendButton.addEventListener("click", () => {
    if (simulationStarted) {
      clearInterval(timeInterval);
      const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
      alert(
        `Formulier verzonden! Dit was een simulatie van ${
          currentGame === "Cerebrale" ? "Cerebrale Parese" : "Multiple Sclerose"
        }.\n\nJe hebt het formulier ingevuld in: ${formattedTime}`
      );
      resetSimulation();
    } else {
      alert("Start eerst de simulatie voordat je het formulier verzendt.");
    }
  });
}

function resetSimulation() {
  resetGameState();
  simulationStarted = false;
  clearInterval(timeInterval);
  seconds = 0;
  minutes = 0;
  timeDisplay.textContent = "Tijd: 00:00";

  const startButton = document.querySelector(".start-button");
  if (startButton) {
    startButton.textContent = "Start Simulatie";
    startButton.classList.remove("active");
    startButton.disabled = false;
  }

  formSection.classList.remove("simulation-active");
  document.body.style.cursor = "auto";
  customCursor.style.display = "none";
}

document.querySelector(".next-button").addEventListener("click", () => {
  if (simulationStarted) {
    if (
      confirm(
        "Wil je de simulatie beëindigen? Je voortgang wordt niet opgeslagen."
      )
    ) {
      resetSimulation();
      alert(
        "Dit is het einde van deze simulatie. Klik op een andere station om verder te gaan."
      );
    }
  } else {
    alert(
      "Dit is het einde van deze simulatie. Klik op een andere station om verder te gaan."
    );
  }
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
document.addEventListener("DOMContentLoaded", initGame);
