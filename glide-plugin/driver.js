// Profile Picture Gauge Plugin - Driver/Initialization

(function() {
  // Wait for Chart.js to load
  function waitForChartJS(callback, maxAttempts) {
    maxAttempts = maxAttempts || 50;
    var attempts = 0;
    
    function check() {
      attempts++;
      if (typeof Chart !== 'undefined') {
        callback();
      } else if (attempts < maxAttempts) {
        setTimeout(check, 100);
      } else {
        console.error('Chart.js failed to load');
      }
    }
    
    check();
  }

  // Initialize when DOM is ready
  function init() {
    waitForChartJS(function() {
      // Initialize the radial gauge plugin
      if (typeof initRadialGaugePlugin === 'function') {
        initRadialGaugePlugin();
      }

      // Default configuration - can be overridden by Glide
      var defaultConfig = {
        profileImageUrl: '', // Set via Glide component settings
        value: 75, // Gauge value 0-100
        gaugeColor: 'rgba(34, 139, 34, 0.8)', // Dark green
        trackColor: 'rgba(204, 221, 238, 0.3)', // Light gray
        centerSize: 80, // Percentage
        padding: 4
      };

      // Try to get config from Glide component settings
      // Glide will set this via window.glideProfileGaugeConfig or data attributes
      var glideConfig = window.glideProfileGaugeConfig || defaultConfig;
      
      // Also check for data attributes on the container
      var container = document.getElementById('profile-gauge-container');
      if (container) {
        if (container.dataset.profileImageUrl) {
          glideConfig.profileImageUrl = container.dataset.profileImageUrl;
        }
        if (container.dataset.value) {
          glideConfig.value = parseFloat(container.dataset.value);
        }
        if (container.dataset.gaugeColor) {
          glideConfig.gaugeColor = container.dataset.gaugeColor;
        }
        if (container.dataset.trackColor) {
          glideConfig.trackColor = container.dataset.trackColor;
        }
        if (container.dataset.centerSize) {
          glideConfig.centerSize = parseFloat(container.dataset.centerSize);
        }
        if (container.dataset.padding) {
          glideConfig.padding = parseFloat(container.dataset.padding);
        }
      }

      // Create the chart
      if (typeof createProfileGauge === 'function') {
        var chart = createProfileGauge(glideConfig);
        
        // Expose chart globally for updates
        window.profileGaugeChart = chart;
        
        // Expose update function
        window.updateProfileGauge = function(value) {
          updateGaugeValue(chart, value);
        };
      }
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

