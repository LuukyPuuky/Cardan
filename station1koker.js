// Sterk kokervisie-effect
const canvas = document.getElementById('tunnelVisionCanvas');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Sterker effect: kleiner zichtgat
const radius = 60; // Verklein dit voor sterker effect
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

function drawTunnelVision() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Zwart scherm
  ctx.fillStyle = 'rgba(0, 0, 0, 0.92)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Maak zichtbaar gebied transparant
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, radius, 0, Math.PI * 2, false);
  ctx.fill();
  ctx.restore();

  requestAnimationFrame(drawTunnelVision);
}

canvas.addEventListener('mousemove', function (e) {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

drawTunnelVision();
