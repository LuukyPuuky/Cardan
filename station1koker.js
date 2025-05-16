// Tunnel vision simulation
const canvas = document.getElementById("tunnelVisionCanvas");
const ctx = canvas.getContext("2d");
let mouseX = 0;
let mouseY = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  drawTunnelVision();
});

function drawTunnelVision() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Donker maken
  ctx.fillStyle = "rgba(0,0,0,0.85)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Cirkel uitsnede voor zicht
  const radius = 100;
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.globalCompositeOperation = "source-over";
}

resizeCanvas();

document.addEventListener("DOMContentLoaded", function () {
  const products = document.querySelectorAll(".product");

  products.forEach((product) => {
    product.addEventListener("click", function () {
      const selected = product.getAttribute("data-product");

      if (selected === "Rode handdoek") {
        showTunnelVisionPopup("success", "Goed gedaan! Je hebt de juiste handdoek gekozen.");
      } else {
        showTunnelVisionPopup("error", "Oeps! Dit is niet de juiste handdoek.");
      }
    });
  });
});

function showTunnelVisionPopup(type, message) {
  // Verwijder bestaande popup als die er is
  const existing = document.querySelector(".popup-tunnelvision");
  if (existing) existing.remove();

  // Maak popup element
  const popup = document.createElement("div");
  popup.className = `popup-tunnelvision ${type}`;
  popup.innerHTML = `
    <h3>${message}</h3>
    <button class="close-popup">Sluiten</button>
  `;

  // Voeg popup toe aan body
  document.body.appendChild(popup); 

  // Sluitknop event
  popup.querySelector(".close-popup").addEventListener("click", function () {
    popup.remove();
  });
}


