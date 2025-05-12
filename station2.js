document.addEventListener('DOMContentLoaded', function () {
  // Tab functionality
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');

  // Collect Vimeo players
  let vimeoPlayers = [];
  document.querySelectorAll('iframe[src*="player.vimeo.com"]').forEach(iframe => {
    const player = new Vimeo.Player(iframe);
    vimeoPlayers.push(player);
  });

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

      // Pause all Vimeo videos when switching tabs
      vimeoPlayers.forEach(player => {
        player.pause().catch(() => {});
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
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      alert('Navigating to the next experience station.');
      // window.location.href = 'next-station.html'; // Uncomment in production
    });
  }

  // Adjust iframe video sizes responsively
  function adjustVideoSize() {
    const iframes = document.querySelectorAll('iframe[src*="player.vimeo.com"]');
    const containerWidth = document.querySelector('.container')?.offsetWidth || 640;

    iframes.forEach(iframe => {
      if (containerWidth < 640) {
        iframe.style.width = '100%';
        iframe.style.height = (containerWidth * 9 / 16) + 'px'; // 16:9 ratio
      } else {
        iframe.style.width = '640px';
        iframe.style.height = '360px';
      }
    });
  }

  // Initial adjustment and listen for window resize
  adjustVideoSize();
  window.addEventListener('resize', adjustVideoSize);
});
