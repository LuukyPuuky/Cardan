document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const audioOptions = document.querySelectorAll('.audio-option');
    const playButton = document.querySelector('.play-button');
    const progressBar = document.querySelector('.progress-bar');
    const infoPanel = document.querySelector('.info-panel');
    const infoHeader = document.querySelector('.info-header');
    const infoContent = document.querySelector('.info-content');
    const nextButton = document.querySelector('.next-button');
    const sliderPoints = document.querySelectorAll('.slider-point');
    
    // Audio files (would be replaced with actual audio files)
    const audioFiles = {
        'Muziek': 'music.mp3',
        'Vogels': 'birds.mp3',
        'Gesprek': 'conversation.mp3'
    };
    
    // State
    let isPlaying = false;
    let currentAudio = null;
    let selectedOption = audioOptions[0]; // Default to first option
    let selectedHearingLevel = 0; // Default to normal hearing (index 0)
    let infoPanelOpen = false;
    
    // Initialize
    selectedOption.classList.add('active');
    sliderPoints[selectedHearingLevel].classList.add('active');
    
    // Audio option selection
    audioOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Reset all options
            audioOptions.forEach(opt => opt.classList.remove('active'));
            
            // Set active class
            this.classList.add('active');
            selectedOption = this;
            
            // Stop current audio if playing
            if (isPlaying && currentAudio) {
                stopAudio();
            }
            
            // Update button icon
            updatePlayButtonIcon();
        });
    });
    
    // Play/Pause button
    playButton.addEventListener('click', function() {
        if (isPlaying) {
            stopAudio();
        } else {
            playAudio();
        }
    });
    
    // Info panel toggle
    infoHeader.addEventListener('click', function() {
        toggleInfoPanel();
    });
    
    // Hearing level slider
    sliderPoints.forEach((point, index) => {
        point.addEventListener('click', function() {
            // Reset all points
            sliderPoints.forEach(pt => pt.classList.remove('active'));
            
            // Set active class
            this.classList.add('active');
            selectedHearingLevel = index;
            
            // Stop current audio if playing
            if (isPlaying && currentAudio) {
                stopAudio();
            }
            
            console.log(`Selected hearing level: ${getHearingLevelName(index)}`);
        });
    });

    // Next button
    nextButton.addEventListener('click', function() {
        // Navigate to next station or experience
        alert('Navigating to the next experience...');
        // window.location.href = 'next-station.html';
    });
    
    // Functions
    function playAudio() {
        // In a real implementation, this would play the audio file
        // For demonstration purposes, we'll just update UI
        
        // Create audio simulation (would actually load and play the file)
        const audioType = selectedOption.textContent;
        const hearingLevel = getHearingLevelName(selectedHearingLevel);
        console.log(`Playing ${audioType} with ${hearingLevel} hearing simulation`);
        
        // Update UI
        isPlaying = true;
        updatePlayButtonIcon();
        
        // Simulate progress
        let progress = 0;
        currentAudio = setInterval(() => {
            progress += 1;
            progressBar.style.width = `${progress}%`;
            
            if (progress >= 100) {
                stopAudio();
            }
        }, 300);
    }
    
    function getHearingLevelName(index) {
        const levels = ['normaal', 'milde', 'matige', 'ernstige', 'doof'];
        return levels[index];
    }
    
    function stopAudio() {
        // Stop the audio simulation
        if (currentAudio) {
            clearInterval(currentAudio);
            currentAudio = null;
        }
        
        // Update UI
        isPlaying = false;
        updatePlayButtonIcon();
    }
    
    function updatePlayButtonIcon() {
        // Update the play/pause button icon
        if (isPlaying) {
            playButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                    <rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/>
                </svg>
            `;
        } else {
            playButton.innerHTML = `
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M8 5.14v13.72a.5.5 0 0 0 .77.42l10-6.86a.5.5 0 0 0 0-.84l-10-6.86a.5.5 0 0 0-.77.42z" fill="currentColor"/>
                </svg>
            `;
        }
    }
    
    function toggleInfoPanel() {
        infoPanelOpen = !infoPanelOpen;
        
        if (infoPanelOpen) {
            infoContent.style.display = 'block';
            document.querySelector('.toggle-button svg').style.transform = 'rotate(180deg)';
        } else {
            infoContent.style.display = 'none';
            document.querySelector('.toggle-button svg').style.transform = 'rotate(0deg)';
        }
    }
    
    // Initially hide info content
    infoContent.style.display = 'none';
});