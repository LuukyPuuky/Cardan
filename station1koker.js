// Tunnel vision simulation
const canvas = document.getElementById("tunnelVisionCanvas");
const ctx = canvas.getContext("2d");
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Parameters for enhanced tunnel vision effect
const radius = 100; // Size of the visible circle
const outsideOpacity = 0.95; // Make outside very dark (0.95 is almost black)

// Toggle variable for tunnel vision effect
let tunnelVisionEnabled = true;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawTunnelVision(); // Redraw after resize
}

window.addEventListener("resize", resizeCanvas);
window.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  drawTunnelVision();
});

function drawTunnelVision() {
  // Clear the canvas first
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Only draw the effect if it's enabled
  if (!tunnelVisionEnabled) return;
  
  // Fill the entire canvas with a very dark overlay
  ctx.fillStyle = `rgba(0, 0, 0, ${outsideOpacity})`;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // Create the clear circle for visibility
  ctx.globalCompositeOperation = "destination-out";
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2, true);
  ctx.fillStyle = "rgba(0, 0, 0, 1)"; // Solid fill for complete visibility
  ctx.fill();
  
  // Reset composite operation
  ctx.globalCompositeOperation = "source-over";
  
  // Optional: Add a subtle border around the vision circle
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.lineWidth = 1;
  ctx.stroke();
}

// Create toggle button for tunnel vision
function createToggleButton() {
  const button = document.createElement("button");
  button.id = "toggle-tunnelvision";
  button.textContent = "Kokervisie Uit";
  button.style.position = "fixed";
  button.style.top = "20px";
  button.style.right = "20px";
  button.style.zIndex = "1000";
  button.style.padding = "8px 16px";
  button.style.backgroundColor = "#007BFF";
  button.style.color = "white";
  button.style.border = "none";
  button.style.borderRadius = "4px";
  button.style.cursor = "pointer";
  button.style.fontWeight = "bold";
  
  button.addEventListener("click", () => {
    tunnelVisionEnabled = !tunnelVisionEnabled;
    button.textContent = tunnelVisionEnabled ? "Kokervisie Uit" : "Kokervisie Aan";
    button.style.backgroundColor = tunnelVisionEnabled ? "#007BFF" : "#28a745";
    drawTunnelVision();
  });
  
  document.body.appendChild(button);
}

// Initialize the canvas when page loads
resizeCanvas();
createToggleButton();

// Continuously update the tunnel vision effect for smoother animation
function animateTunnelVision() {
  drawTunnelVision();
  requestAnimationFrame(animateTunnelVision);
}
animateTunnelVision();

document.addEventListener("DOMContentLoaded", function () {
  const products = document.querySelectorAll(".product");
  const resultMessage = document.getElementById("result");
  
  products.forEach((product) => {
    product.addEventListener("click", function () {
      const selected = product.getAttribute("data-product");
      
      if (selected === "Rode handdoek") {
        if (resultMessage) {
          resultMessage.textContent = "Gefeliciteerd! Je hebt de rode handdoek gevonden!";
          resultMessage.style.color = "green";
        }
        showTunnelVisionPopup("success", "Goed gedaan! Je hebt de juiste handdoek gekozen.");
      } else {
        if (resultMessage) {
          resultMessage.textContent = "Dat is niet de rode handdoek. Probeer nog eens!";
          resultMessage.style.color = "red";
        }
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
  
  // Vereenvoudigde popup met alleen de belangrijkste boodschap
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