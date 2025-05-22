document.addEventListener('DOMContentLoaded', () => {
    initializeSeatGrid(5, 8);
    initializeFilterControls();
    initializeReserveButton();
    initializeNextButton();
    addBorderToMinigame();
});

function initializeSeatGrid(rows, seatsPerRow) {
    const seatGrid = document.getElementById('seatGrid');

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < seatsPerRow; j++) {
            const seat = createSeat(i, j, Math.random() < 0.3);
            seatGrid.appendChild(seat);
        }
    }
}

function createSeat(row, col, reserved) {
    const seat = document.createElement('div');
    const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;

    seat.className = 'seat';
    if (reserved) seat.classList.add('reserved');

    seat.dataset.seatId = seatId;
    seat.setAttribute('aria-label', `Seat ${seatId} ${reserved ? 'reserved' : 'available'}`);
    seat.setAttribute('role', 'button');
    seat.setAttribute('tabindex', '0');

    seat.addEventListener('click', () => handleSeatClick(seat));
    seat.addEventListener('keydown', (e) => {
        if (['Enter', ' '].includes(e.key)) {
            e.preventDefault();
            handleSeatClick(seat);
        }
    });

    return seat;
}

function handleSeatClick(seat) {
    if (seat.classList.contains('reserved')) {
        showPopup('error', 'Fout!', `Deze stoel (${seat.dataset.seatId}) is al bezet. Kies een andere stoel.`);
    } else {
        seat.classList.toggle('selected');
        const label = seat.classList.contains('selected') ? 'selected' : 'available';
        seat.setAttribute('aria-label', `Seat ${seat.dataset.seatId} ${label}`);
    }
}

function showPopup(type, title, message, callback = null) {
    document.querySelector('.success-popup, .error-popup')?.remove();

    const popup = document.createElement('div');
    popup.className = `${type}-popup`;
    popup.innerHTML = `
        <div class="popup-content ${type}">
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="close-popup">OK</button>
        </div>
    `;
    document.body.appendChild(popup);

    const closeBtn = popup.querySelector('.close-popup');
    closeBtn.focus();
    closeBtn.addEventListener('click', () => {
        popup.remove();
        if (callback) callback();
    });

    const closeOnEscape = (e) => {
        if (e.key === 'Escape') {
            popup.remove();
            window.removeEventListener('keydown', closeOnEscape);
            if (callback) callback();
        }
    };
    window.addEventListener('keydown', closeOnEscape);

    if (type === 'error') {
        setTimeout(() => popup.remove(), 3000);
    }
}

function initializeFilterControls() {
    document.querySelectorAll('input[name="filter"]').forEach(radio => {
        radio.addEventListener('change', () => {
            document.body.classList.remove('protanopia', 'tritanopia', 'achromatopsia');
            if (radio.value !== 'none') {
                document.body.classList.add(radio.value);
            }
        });
    });
}

function initializeReserveButton() {
    const reserveBtn = document.querySelector('.reserveren');
    if (!reserveBtn) return;

    reserveBtn.addEventListener('click', () => {
        const selectedSeats = document.querySelectorAll('.seat.selected');
        if (!selectedSeats.length) {
            showPopup('error', 'Fout!', 'Selecteer eerst een stoel om te reserveren!');
        } else {
            showPopup('success', 'Succes!', `U heeft ${selectedSeats.length} stoel${selectedSeats.length !== 1 ? 'en' : ''} succesvol gereserveerd.`, () => {
                selectedSeats.forEach(seat => {
                    seat.classList.remove('selected');
                    seat.classList.add('reserved');
                    seat.setAttribute('aria-label', `Seat ${seat.dataset.seatId} reserved`);
                });
            });
        }
    });
}

function initializeNextButton() {
    const nextBtn = document.querySelector('.next');
    if (!nextBtn) return;

    nextBtn.addEventListener('click', () => {
        const selectedSeats = document.querySelectorAll('.seat.selected');
        if (!selectedSeats.length) {
            alert('Selecteer eerst een stoel om te reserveren!');
        } else {
            alert(`Bedankt! U heeft ${selectedSeats.length} stoel(en) gereserveerd.`);
            // window.location.href = 'next-page.html';
        }
    });
}

function addBorderToMinigame() {
    const mainContent = document.querySelector('.main-content');
    if (!mainContent) return;

    const selectors = ['.labels-section:first-of-type', '.grid', '.reserveren', '.filters'];
    const elements = selectors.map(sel => mainContent.querySelector(sel)).filter(Boolean);

    if (!elements.length) return;

    const wrapper = document.createElement('div');
    wrapper.className = 'minigame-border';
    mainContent.insertBefore(wrapper, elements[0]);

    elements.forEach(el => wrapper.appendChild(el));
}

// Info card toggle functionality
        document.querySelectorAll('.info-header').forEach(header => {
            header.addEventListener('click', function() {
                const card = this.parentElement;
                const content = card.querySelector('.info-content');
                const arrow = this.querySelector('.arrow');
                const isExpanded = card.classList.contains('expanded');
                
                // Close all other cards
                document.querySelectorAll('.info-card').forEach(otherCard => {
                    otherCard.classList.remove('expanded');
                    otherCard.querySelector('.info-content').classList.add('hidden');
                    otherCard.querySelector('.arrow').textContent = '▼';
                });
                
                // Toggle current card
                if (!isExpanded) {
                    card.classList.add('expanded');
                    content.classList.remove('hidden');
                    arrow.textContent = '▲';
                }
            });
        });

