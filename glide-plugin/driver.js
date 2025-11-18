// Profile Picture Gauge Plugin - Driver/Initialization

window.addEventListener("message", async function(event) {
  const { origin, data: { key, params } } = event;

  let result;
  let error;
  try {
    // Wait for Chart.js to load
    await waitForChartJS();
    
    // Initialize the radial gauge plugin if not already done
    if (!Chart.RadialGauge && typeof initRadialGaugePlugin === 'function') {
      initRadialGaugePlugin();
    }

    // Extract parameters from Glide
    // params order: [profileImageUrl, value, gaugeColor, trackColor, centerSize, padding]
    var config = {
      profileImageUrl: (params[0] && params[0].value) ? params[0].value : '',
      value: (params[1] && params[1].value !== undefined) ? params[1].value : 75,
      gaugeColor: (params[2] && params[2].value) ? params[2].value : 'rgba(34, 139, 34, 0.8)',
      trackColor: (params[3] && params[3].value) ? params[3].value : 'rgba(204, 221, 238, 0.3)',
      centerSize: (params[4] && params[4].value !== undefined) ? params[4].value : 80,
      padding: (params[5] && params[5].value !== undefined) ? params[5].value : 4
    };

    // Create or update the chart
    if (typeof createProfileGauge === 'function') {
      // Destroy existing chart if it exists
      if (window.profileGaugeChart) {
        window.profileGaugeChart.destroy();
      }
      
      var chart = createProfileGauge(config);
      window.profileGaugeChart = chart;
      result = true;
    } else {
      throw new Error('createProfileGauge function not found');
    }
  } catch (e) {
    result = undefined;
    try {
      error = e.toString();
    } catch (e) {
      error = "Exception can't be stringified.";
    }
  }

  const response = { key };
  if (result !== undefined) {
    response.result = { value: result };
  }
  if (error !== undefined) {
    response.error = error;
  }

  event.source.postMessage(response, "*");
});

// Wait for Chart.js to load
function waitForChartJS(maxAttempts) {
  return new Promise(function(resolve, reject) {
    maxAttempts = maxAttempts || 50;
    var attempts = 0;
    
    function check() {
      attempts++;
      if (typeof Chart !== 'undefined') {
        resolve();
      } else if (attempts < maxAttempts) {
        setTimeout(check, 100);
      } else {
        reject(new Error('Chart.js failed to load'));
      }
    }
    
    check();
  });
}

// Initialize on page load (for preview/testing)
(function() {
  function init() {
    waitForChartJS().then(function() {
      if (typeof initRadialGaugePlugin === 'function') {
        initRadialGaugePlugin();
      }
      
      // Default config for preview
      var defaultConfig = {
        profileImageUrl: '',
        value: 75,
        gaugeColor: 'rgba(34, 139, 34, 0.8)',
        trackColor: 'rgba(204, 221, 238, 0.3)',
        centerSize: 80,
        padding: 4
      };

      if (typeof createProfileGauge === 'function') {
        var chart = createProfileGauge(defaultConfig);
        window.profileGaugeChart = chart;
      }
    }).catch(function(err) {
      console.error('Initialization error:', err);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

