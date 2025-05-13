// Update the JavaScript to work with the new navigation buttons
// Remove the old tab switching code
/* Remove or comment out these lines: 
document.getElementById('colorblindness-tab').addEventListener('click', () => {
    document.getElementById('colorblindness-sim').style.display = 'block';
    document.getElementById('blindness-sim').style.display = 'none';
});

document.getElementById('blindness-tab').addEventListener('click', () => {
    document.getElementById('colorblindness-sim').style.display = 'none';
    document.getElementById('blindness-sim').style.display = 'block';
});
*/

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

// Add event listener to the Reserveren button
document.addEventListener('DOMContentLoaded', function() {
    // Get the reserveren button
    const reserveButton = document.querySelector('.reserveren');
    
    // Add event listener for the reserve button
    if (reserveButton) {
        reserveButton.addEventListener('click', function() {
            // Check if there are any selected seats
            const selectedSeats = document.querySelectorAll('.seat.selected');
            
            if (selectedSeats.length === 0) {
                // Show error if no seats are selected
                showErrorMessage('Selecteer eerst een stoel om te reserveren!');
            } else {
                // Show success popup if seats are selected
                showSuccessPopup(selectedSeats.length);
            }
        });
    }
    
    // Add a border around the minigame area
    addBorderToMinigame();
});

// Function to show success popup
function showSuccessPopup(seatCount) {
    // Remove any existing popups
    const existingPopup = document.querySelector('.success-popup, .error-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create the popup
    const popup = document.createElement('div');
    popup.className = 'success-popup';
    popup.innerHTML = `
        <div class="popup-content success">
            <h3>Succes!</h3>
            <p>U heeft ${seatCount} stoel${seatCount !== 1 ? 'en' : ''} succesvol gereserveerd.</p>
            <p>Bedankt voor uw reservering!</p>
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
        
        // Reset selected seats after successful reservation
        document.querySelectorAll('.seat.selected').forEach(seat => {
            seat.classList.remove('selected');
            seat.classList.add('reserved');
            seat.setAttribute('aria-label', `Seat ${seat.getAttribute('data-seat-id')} reserved`);
        });
    });
    
    // Also close on escape key
    window.addEventListener('keydown', function closeOnEscape(e) {
        if (e.key === 'Escape') {
            popup.remove();
            window.removeEventListener('keydown', closeOnEscape);
        }
    });
}

// Function to show error message
function showErrorMessage(message) {
    // Remove any existing popups
    const existingPopup = document.querySelector('.success-popup, .error-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // Create the popup
    const popup = document.createElement('div');
    popup.className = 'error-popup';
    popup.innerHTML = `
        <div class="popup-content">
            <h3>Fout!</h3>
            <p>${message}</p>
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

// Function to add border around the minigame
function addBorderToMinigame() {
    // Create a wrapper div for the minigame area
    const mainContent = document.querySelector('.main-content');
    
    if (mainContent) {
        // Find the elements we want to include in the border
        const elementsToInclude = [
            '.labels-section:first-of-type',
            '.grid',
            '.reserveren',
            '.filters'  // Include the filter buttons
        ];
        
        // Create the border container
        const borderContainer = document.createElement('div');
        borderContainer.className = 'minigame-border';
        
        // Find all elements that should be inside the border
        elementsToInclude.forEach(selector => {
            const element = mainContent.querySelector(selector);
            if (element) {
                // Mark the element to be moved
                element.setAttribute('data-move-to-border', 'true');
            }
        });
        
        // Insert the border container before the first element to be moved
        const firstElement = mainContent.querySelector('[data-move-to-border="true"]');
        if (firstElement) {
            firstElement.parentNode.insertBefore(borderContainer, firstElement);
            
            // Move all marked elements inside the border
            document.querySelectorAll('[data-move-to-border="true"]').forEach(element => {
                borderContainer.appendChild(element);
                element.removeAttribute('data-move-to-border');
            });
        }
    }
}