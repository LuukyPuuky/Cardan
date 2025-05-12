document.addEventListener('DOMContentLoaded', function() {
  // Tab functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Get the tab number
      const tabNumber = tab.getAttribute('data-tab');
      
      // Remove active class from all tabs and contents
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      // Add active class to current tab and content
      tab.classList.add('active');
      document.getElementById(`tab-${tabNumber}`).classList.add('active');
      
      // Pause all videos when switching tabs
      document.querySelectorAll('video').forEach(video => {
        video.pause();
      });
    });
  });
  
  // Info panel functionality
  const infoPanel = document.querySelector('.info-panel');
  const infoHeader = document.querySelector('.info-header');
  const infoContent = document.querySelector('.info-content');
  const toggleButton = document.querySelector('.toggle-button');
  
  // Initialize info panel (collapsed by default)
  infoContent.style.display = 'none';
  
  infoHeader.addEventListener('click', () => {
    // Toggle content visibility
    if (infoContent.style.display === 'none') {
      infoContent.style.display = 'block';
      toggleButton.style.transform = 'rotate(180deg)';
      infoPanel.setAttribute('open', '');
    } else {
      infoContent.style.display = 'none';
      toggleButton.style.transform = 'rotate(0)';
      infoPanel.removeAttribute('open');
    }
  });
  
  // Next button functionality
  const nextButton = document.querySelector('.next-button');
  nextButton.addEventListener('click', () => {
    // In a real application, this would navigate to the next station
    // For now, we'll just alert the user
    alert('Navigating to the next experience station.');
    // window.location.href = 'next-station.html'; // Uncomment in production
  });
  
  // Make sure videos are responsive
  function adjustVideoSize() {
    const videos = document.querySelectorAll('video');
    const containerWidth = document.querySelector('.container').offsetWidth;
    
    videos.forEach(video => {
      if (containerWidth < 640) {
        video.style.width = '100%';
        video.style.height = 'auto';
      } else {
        video.style.width = '640px';
        video.style.height = '360px';
      }
    });
  }
  
  // Initial adjustment and listen for window resize
  adjustVideoSize();
  window.addEventListener('resize', adjustVideoSize);
});