let simulationStarted = false;
let adhdDistractionInterval;
let adhdTimerInterval;
let adhdSeconds = 0;
let adhdMinutes = 0;
const distractionAudio = document.getElementById("distractionSound");

const adhdDistractions = [
  "Wat ga je vanavond eten?",
  "Instagram checken?",
  "Oh kijk! Een vogel buiten!",
  "Heb je je huiswerk wel gedaan?",
  "Even Spotify aanzetten?",
  "Was dat een notificatie?",
  "Ben je iets vergeten?",
  "Netflix pauze?",
  "Hoe laat is het eigenlijk?",
];

function startAdhdTimer() {
  const timerEl = document.getElementById("tijd");
  adhdTimerInterval = setInterval(() => {
    adhdSeconds++;
    if (adhdSeconds >= 60) {
      adhdSeconds = 0;
      adhdMinutes++;
    }
    const min = String(adhdMinutes).padStart(2, "0");
    const sec = String(adhdSeconds).padStart(2, "0");
    timerEl.textContent = `Tijd: ${min}:${sec}`;
  }, 1000);
}

function startAdhdDistractions() {
  adhdDistractionInterval = setInterval(() => {
    const div = document.createElement("div");
    div.className = "distraction";
    div.innerText =
      adhdDistractions[Math.floor(Math.random() * adhdDistractions.length)];
    div.style.top = Math.random() * window.innerHeight * 0.8 + "px";
    div.style.left = Math.random() * window.innerWidth * 0.8 + "px";
    document.body.appendChild(div);

    try {
      distractionAudio.currentTime = 0;
      distractionAudio.play();
    } catch (err) {
      console.warn("Audio could not play:", err);
    }

    setTimeout(() => div.remove(), 3000);
  }, Math.random() * 1500 + 800); // 0.8 to 2.3 sec
}

function resetAdhdSimulation() {
  clearInterval(adhdDistractionInterval);
  clearInterval(adhdTimerInterval);
  adhdSeconds = 0;
  adhdMinutes = 0;
  document.getElementById("tijd").textContent = "Tijd: 00:00";
}

function startAdhdSimulation() {
  resetAdhdSimulation();
  startAdhdTimer();
  startAdhdDistractions();
}

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("simulatiebutton");
  startBtn.addEventListener("click", () => {
    if (!simulationStarted) {
      simulationStarted = true;
      startBtn.disabled = true;
      startBtn.textContent = "Simulatie Actief";
      startAdhdSimulation();
    }
  });

  // Accordion toggle logic
  const cards = document.querySelectorAll(".info-card");
  cards.forEach((card) => {
    const arrow = card.querySelector(".arrow");
    const content = card.querySelector(".info-content");
    card.addEventListener("click", () => {
      content.classList.toggle("hidden");
      arrow.classList.toggle("rotated");
    });
  });
});
