// Tab switching
document.getElementById('colorblindness-tab').addEventListener('click', () => {
    document.getElementById('colorblindness-sim').style.display = 'block';
    document.getElementById('blindness-sim').style.display = 'none';
});

document.getElementById('blindness-tab').addEventListener('click', () => {
    document.getElementById('colorblindness-sim').style.display = 'none';
    document.getElementById('blindness-sim').style.display = 'block';
});

// Filter simulation
const colorblindnessSim = document.getElementById('colorblindness-sim');
document.querySelectorAll('input[name="filter"]').forEach(input => {
    input.addEventListener('change', (e) => {
        colorblindnessSim.className = e.target.value !== 'none' ? e.target.value : '';
    });
});

// Generate seat grid
const seatGrid = document.getElementById('seatGrid');
for (let i = 0; i < 64; i++) {
    const seat = document.createElement('div');
    seat.classList.add('seat', 'available');
    seat.addEventListener('click', () => {
        seat.classList.toggle('reserved');
    });
    seatGrid.appendChild(seat);
}
