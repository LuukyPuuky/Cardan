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

let timeInterval;
let seconds = 0;
let minutes = 0;
let simulationStarted = false;

const formSection = document.querySelector(".form-section");
const formInputs = document.querySelectorAll(".form-section input");
const timeDisplay = document.getElementById("tijd");
const sendButton = document.getElementById("verzenden");

function initGame() {
  setupInputFields();
  setupSendButton();
  createStartButton();
  dropdown();
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

  simulationStarted = false;

  formSection.classList.remove("simulation-active");

  const startButton = document.querySelector(".start-button");
  if (startButton) {
    startButton.textContent = "Start Simulatie";
    startButton.classList.remove("active");
    startButton.disabled = false;
  }
}

function setupInputFields() {
  formInputs.forEach((input) => {
    input.addEventListener("focus", () => {
      if (simulationStarted) {
        input.addEventListener("input", handleInputChange);
      }
    });

    input.addEventListener("blur", () => {
      if (simulationStarted) {
        input.removeEventListener("input", handleInputChange);
      }
    });
  });
}

function handleInputChange(e) {
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
        `Formulier verzonden! Dit was een simulatie van Multiple Sclerose.\n\nJe hebt het formulier ingevuld in: ${formattedTime}`
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

document.addEventListener("DOMContentLoaded", initGame);
