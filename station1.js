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

document.addEventListener('DOMContentLoaded', function() {
    // Initialize the seat grid
    const seatGrid = document.getElementById('seatGrid');
    const rows = 5;
    const seatsPerRow = 8;
    
    // Create seats with some random pre-reserved seats
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < seatsPerRow; j++) {
            const seat = document.createElement('div');
            seat.className = 'seat';
            
            // Randomly reserve some seats (around 30%)
            const isReserved = Math.random() < 0.3;
            if (isReserved) {
                seat.classList.add('reserved');
            }
            
            // Add seat ID for accessibility
            const seatId = `${String.fromCharCode(65 + i)}${j + 1}`;
            seat.setAttribute('data-seat-id', seatId);
            seat.setAttribute('aria-label', `Seat ${seatId} ${isReserved ? 'reserved' : 'available'}`);
            seat.setAttribute('role', 'button');
            seat.setAttribute('tabindex', '0');
            
            // Add event listener for seat selection
            seat.addEventListener('click', function() {
                handleSeatClick(this);
            });
            
            // Add keyboard support for accessibility
            seat.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSeatClick(this);
                }
            });
            
            seatGrid.appendChild(seat);
        }
    }
    
    // Handle seat click events
    function handleSeatClick(seat) {
        if (seat.classList.contains('reserved')) {
            // Create and show error popup when clicking reserved seat
            showErrorPopup(seat);
        } else {
            // Toggle selection for available seats
            seat.classList.toggle('selected');
            if (seat.classList.contains('selected')) {
                seat.setAttribute('aria-label', `Seat ${seat.getAttribute('data-seat-id')} selected`);
            } else {
                seat.setAttribute('aria-label', `Seat ${seat.getAttribute('data-seat-id')} available`);
            }
        }
    }
    
    // Error popup for reserved seats
    function showErrorPopup(seat) {
        // Remove any existing popups
        const existingPopup = document.querySelector('.error-popup');
        if (existingPopup) {
            existingPopup.remove();
        }
        
        // Create the popup
        const popup = document.createElement('div');
        popup.className = 'error-popup';
        popup.innerHTML = `
            <div class="popup-content">
                <h3>Fout!</h3>
                <p>Deze stoel (${seat.getAttribute('data-seat-id')}) is al bezet. Kies een andere stoel.</p>
                <button class="close-popup">OK</button>
            </div>
        `;
        
        // Add to body
        document.body.appendChild(popup);
        
        // Focus on the button for accessibility
        setTimeout(() => {
            popup.querySelector('.close-popup').focus();
        }, 100);
        
        // Close button event
        popup.querySelector('.close-popup').addEventListener('click', function() {
            popup.remove();
        });
        
        // Also close on escape key
        window.addEventListener('keydown', function closeOnEscape(e) {
            if (e.key === 'Escape') {
                popup.remove();
                window.removeEventListener('keydown', closeOnEscape);
            }
        });
        
        // Auto close after 3 seconds
        setTimeout(() => {
            if (document.body.contains(popup)) {
                popup.remove();
            }
        }, 3000);
    }
    
    // Filter functionality
    const filterRadios = document.querySelectorAll('input[name="filter"]');
    filterRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Remove all filters first
            document.body.classList.remove('protanopia', 'tritanopia', 'achromatopsia');
            
            // Apply selected filter if not "none"
            if (this.value !== 'none') {
                document.body.classList.add(this.value);
            }
        });
    });
    
    // Tab functionality
    const colorblindTab = document.getElementById('colorblindness-tab');
    const blindnessTab = document.getElementById('blindness-tab');
    
    colorblindTab.addEventListener('click', function() {
        // Enable colorblindness mode
        document.body.classList.remove('blindness-mode');
        document.querySelectorAll('.blindness-overlay').forEach(el => el.remove());
        // Enable filter selection
        document.querySelector('.filters').style.display = 'flex';
    });
    
    blindnessTab.addEventListener('click', function() {
        // Enable blindness mode
        document.body.classList.add('blindness-mode');
        // Disable any color filters
        document.body.classList.remove('protanopia', 'tritanopia', 'achromatopsia');
        document.querySelectorAll('input[name="filter"]')[0].checked = true;
        // Hide filter selection
        document.querySelector('.filters').style.display = 'none';
        
        // Create blindness overlay if it doesn't exist
        if (!document.querySelector('.blindness-overlay')) {
            const overlay = document.createElement('div');
            overlay.className = 'blindness-overlay';
            document.querySelector('.main-content').appendChild(overlay);
            
            // Add hint text for blind users
            const hint = document.createElement('div');
            hint.className = 'blindness-hint';
            hint.textContent = 'Gebruik tab en enter om door stoelen te navigeren';
            document.querySelector('.main-content').appendChild(hint);
        }
    });
    
    // Next button functionality
    const nextButton = document.querySelector('.next');
    nextButton.addEventListener('click', function() {
        const selectedSeats = document.querySelectorAll('.seat.selected');
        if (selectedSeats.length === 0) {
            alert('Selecteer eerst een stoel om te reserveren!');
        } else {
            alert(`Bedankt! U heeft ${selectedSeats.length} stoel(en) gereserveerd.`);
            // Here you could navigate to the next page
            // window.location.href = 'next-page.html';
        }
    });
});