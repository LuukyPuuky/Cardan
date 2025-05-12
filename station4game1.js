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

let gameActive = false;
let timeInterval;
let seconds = 0;
let minutes = 0;
let cursorOriginalPosition = { x: 0, y: 0 };
let isMouseInFormSection = false;
let simulationStarted = false;

const formSection = document.querySelector(".form-section");
const customCursor = document.getElementById("cursor");
const formInputs = document.querySelectorAll(".form-section input");
const timeDisplay = document.getElementById("tijd");
const sendButton = document.getElementById("verzenden");

function initGame() {
  setupFormSectionTracking();
  setupSendButton();
  createStartButton();
  dropdown();
  timeDisplay.textContent = "Tijd: 00:00";

  document.addEventListener("mousemove", (e) => {
    if (!simulationStarted || !isMouseInFormSection) {
      customCursor.style.display = "none";
      document.body.classList.remove("hide-cursor");
      return;
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

  customCursor.style.display = "none";
  document.body.classList.remove("hide-cursor");
  gameActive = false;
  isMouseInFormSection = false;
  simulationStarted = false;

  document.removeEventListener("mousemove", handleMouseMove);

  formSection.classList.remove("game-active");
  formSection.classList.remove("simulation-active");

  const subtitle = document.querySelector(".subtitle");
  const title = document.querySelector(".title");
  subtitle.textContent =
    "Tijdens het selecteren van de verschillende invulvakken beweegt je muis alle kanten op.";
  title.textContent = "Ervaar hoe het is om een Cerebrale Parese te hebben";

  const startButton = document.querySelector(".start-button");
  if (startButton) {
    startButton.textContent = "Start Simulatie";
    startButton.classList.remove("active");
    startButton.disabled = false;
  }
}

function setupFormSectionTracking() {
  formSection.addEventListener("mouseenter", () => {
    isMouseInFormSection = true;
    if (simulationStarted) {
      document.addEventListener("mousemove", handleMouseMove);
      formSection.classList.add("game-active");
    }
  });

  formSection.addEventListener("mouseleave", () => {
    isMouseInFormSection = false;
    if (simulationStarted) {
      document.removeEventListener("mousemove", handleMouseMove);
      customCursor.style.display = "none";
      document.body.classList.remove("hide-cursor");
      formSection.classList.remove("game-active");
    }
  });

  let scrollTimeout;
  window.addEventListener("scroll", () => {
    if (simulationStarted && isMouseInFormSection) {
      customCursor.style.display = "none";
    }
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      if (simulationStarted && isMouseInFormSection) {
        gameActive = false;
      }
    }, 100);
  });
}

function handleMouseMove(e) {
  if (!isMouseInFormSection) return;

  if (!gameActive) {
    cursorOriginalPosition.x = e.clientX;
    cursorOriginalPosition.y = e.clientY;
    gameActive = true;
  }

  const randomOffsetX = (Math.random() - 0.5) * 60;
  const randomOffsetY = (Math.random() - 0.5) * 60;
  const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
  const scrollY = window.pageYOffset || document.documentElement.scrollTop;

  customCursor.style.display = "block";
  customCursor.style.left = `${e.clientX + randomOffsetX + scrollX}px`;
  customCursor.style.top = `${e.clientY + randomOffsetY + scrollY}px`;

  document.body.classList.add("hide-cursor");
}

function setupSendButton() {
  sendButton.addEventListener("click", () => {
    if (simulationStarted) {
      clearInterval(timeInterval);
      const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
      alert(
        `Formulier verzonden! Dit was een simulatie van Cerebrale Parese.\n\nJe hebt het formulier ingevuld in: ${formattedTime}`
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
