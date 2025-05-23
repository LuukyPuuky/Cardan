let simulationStarted = false;
let adhdDistractionInterval;
let adhdTimerInterval;
let adhdSeconds = 0;
let adhdMinutes = 0;

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
  "Ik heb dorst, even wat drinken?",
  "Misschien moet ik mijn planten water geven?",
  "Waar dacht ik ook alweer aan?",
  "Even snel YouTube kijken?",
  "Wat was dat geluid?",
  "Heb ik de deur wel op slot gedaan?",
  "Zou ik even moeten stretchen?",
  "Trilt mijn telefoon?",
  "Moest ik nog iets anders doen?",
  "Wat is er nieuw op TikTok?",
  "Die vlek op de muur, wat is dat?",
  "Even kijken of nog nieuws is.",
  "Is het al lunchtijd?",
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

function playRandomDistractionSound() {
  const distractionSounds = [
    "sounds/mixkit-arrow-whoosh-1491.wav",
    "sounds/mixkit-dog-barking-twice-1.wav",
    "sounds/mixkit-flock-of-wild-geese-20.wav",
  ];

  const sound = new Audio(
    distractionSounds[Math.floor(Math.random() * distractionSounds.length)]
  );
  sound.play().catch((err) => {
    console.warn("Distraction sound could not play:", err);
  });
}

function startAdhdDistractions() {
  const colors = [
    "#e74c3c",
    "#8e44ad",
    "#3498db",
    "#f39c12",
    "#2ecc71",
    "#1abc9c",
  ];

  const container = document.querySelector(".container");
  const containerRect = container.getBoundingClientRect();

  adhdDistractionInterval = setInterval(() => {
    const div = document.createElement("div");
    div.className = "distraction";

    // Add emoji + text
    const emojis = ["🤔", "😵", "🎵", "📱", "📺", "🕊️", "🎮", "📷", "🧠"];
    const randomText =
      adhdDistractions[Math.floor(Math.random() * adhdDistractions.length)];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    div.innerText = `${randomEmoji} ${randomText}`;

    // Random background color
    div.style.backgroundColor =
      colors[Math.floor(Math.random() * colors.length)];

    div.style.position = "absolute";
    container.style.position = "relative";

    container.appendChild(div);

    requestAnimationFrame(() => {
      const divWidth = div.offsetWidth;
      const divHeight = div.offsetHeight;
      const maxX = container.clientWidth - divWidth;
      const maxY = container.clientHeight - divHeight;

      div.style.left = Math.floor(Math.random() * maxX) + "px";
      div.style.top = Math.floor(Math.random() * maxY) + "px";

      div.classList.add("fade-in");
    });

    div.addEventListener("click", () => {
      div.classList.remove("fade-in");
      div.classList.add("fade-out");
      setTimeout(() => div.remove(), 500);
    });

    // Auto-remove after timeout
    setTimeout(() => {
      if (container.contains(div)) {
        div.classList.remove("fade-in");
        div.classList.add("fade-out");
        setTimeout(() => div.remove(), 500);
      }
    }, 3000);

    // Play random sound
    playRandomDistractionSound();
  }, Math.random() * 1500 + 800);
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

document.addEventListener("DOMContentLoaded", () => {
  const startBtn = document.getElementById("simulatiebutton");
  const verzendenBtn = document.getElementById("verzenden");
  const container = document.querySelector(".container");

  const inputs = container.querySelectorAll("input, textarea, select");

  // Enable/disable "Verzenden" based on input validation
  function checkFormValidity() {
    let allFilled = true;
    inputs.forEach((input) => {
      if (!input.value.trim()) {
        allFilled = false;
      }
    });
    verzendenBtn.disabled = !allFilled;
  }

  // Check form on input change
  inputs.forEach((input) => {
    input.addEventListener("input", checkFormValidity);
  });

  // Start simulation
  startBtn.addEventListener("click", () => {
    if (!simulationStarted) {
      simulationStarted = true;
      startBtn.disabled = true;
      startBtn.textContent = "Simulatie Actief";
      startAdhdSimulation();
    }
  });

  // Handle "Verzenden"
  verzendenBtn.addEventListener("click", (e) => {
    e.preventDefault();

    let allValid = true;

    inputs.forEach((input) => {
      if (!input.value.trim()) {
        input.classList.add("field-error");
        allValid = false;
      } else {
        input.classList.remove("field-error");
      }
    });

    if (!allValid) {
      alert("Vul alle velden in voordat je verzendt.");
      return;
    }

    // Stop simulation
    resetAdhdSimulation();
    simulationStarted = false;

    // Remove distraction elements if still visible
    document.querySelectorAll(".distraction").forEach((el) => el.remove());

    // Reset UI
    startBtn.disabled = false;
    startBtn.textContent = "Start Simulatie";
    verzendenBtn.textContent = "Verzenden";
    alert("Je hebt je email verzonden!");
    verzendenBtn.disabled = true;

    // Optional: Reset form
    container.querySelector("form")?.reset();
    checkFormValidity();
  });

  dropdown();
});
