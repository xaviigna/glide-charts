// Profile Picture Gauge Plugin - Main Functions

// Initialize Radial Gauge Plugin for Chart.js
function initRadialGaugePlugin() {
  if (typeof Chart === 'undefined') {
    console.error('Chart.js is required. Please include Chart.js first.');
    return false;
  }

  var h = Chart.helpers;
  
  // Rounded Arc Element
  Chart.elements.RoundedArc = Chart.elements.Arc.extend({
    draw: function() {
      var ctx = this._chart.ctx, vm = this._view, sa = vm.startAngle, ea = vm.endAngle;
      var cr = (vm.outerRadius - vm.innerRadius) / 2, cx = (vm.outerRadius + vm.innerRadius) / 2;
      ctx.translate(vm.x, vm.y); ctx.rotate(sa);
      var a = ea - sa; ctx.beginPath();
      if (vm.roundedCorners) ctx.arc(cx, 0, cr, Math.PI, 0);
      ctx.arc(0, 0, vm.outerRadius, 0, a);
      var x = cx * Math.cos(a), y = cx * Math.sin(a);
      if (vm.roundedCorners) ctx.arc(x, y, cr, a, a + Math.PI);
      ctx.arc(0, 0, vm.innerRadius, a, 0, true);
      ctx.closePath(); ctx.rotate(-sa); ctx.translate(-vm.x, -vm.y);
      ctx.strokeStyle = vm.borderColor; ctx.lineWidth = vm.borderWidth;
      ctx.fillStyle = vm.backgroundColor; ctx.fill(); ctx.lineJoin = 'bevel'; ctx.stroke();
    }
  });

  // Default options
  Chart.defaults._set('radialGauge', {
    animation: { animateRotate: true, animateScale: true },
    centerPercentage: 80,
    rotation: -Math.PI / 2,
    trackColor: 'rgba(204, 221, 238, 0.3)',
    roundedCorners: true,
    centerArea: { displayText: false, padding: 4, backgroundImage: null },
    hover: { mode: 'single' },
    legend: { display: false },
    domain: [0, 100]
  });

  // Radial Gauge Controller
  Chart.controllers.radialGauge = Chart.DatasetController.extend({
    dataElementType: Chart.elements.RoundedArc,
    linkScales: h.noop,
    
    draw: function() {
      this.drawTrack();
      this.drawCenterArea();
      Chart.DatasetController.prototype.draw.apply(this, arguments);
    },
    
    drawTrack: function() {
      new Chart.elements.Arc({
        _view: {
          backgroundColor: this.chart.options.trackColor,
          borderColor: this.chart.options.trackColor,
          startAngle: 0,
          endAngle: Math.PI * 2,
          x: this.centerX,
          y: this.centerY,
          innerRadius: this.innerRadius,
          outerRadius: this.outerRadius,
          borderWidth: this.borderWidth
        },
        _chart: this.chart
      }).draw();
    },
    
    drawCenterArea: function() {
      var ctx = this.chart.ctx;
      var di = {
        ctx: ctx,
        value: Math.ceil(this.getMeta().data[0]._view.value),
        radius: this.innerRadius,
        options: this.chart.options.centerArea
      };
      ctx.save();
      try {
        ctx.translate(this.centerX, this.centerY);
        if (di.options.draw) {
          di.options.draw(di);
          return;
        }
        if (di.options.backgroundColor) {
          var br = di.radius - di.options.padding;
          ctx.beginPath();
          ctx.arc(0, 0, br, 0, Math.PI * 2);
          ctx.closePath();
          ctx.fillStyle = di.options.backgroundColor;
          ctx.fill();
        }
        if (di.options.backgroundImage) {
          var ir = di.radius - di.options.padding;
          ctx.beginPath();
          ctx.arc(0, 0, ir, 0, Math.PI * 2, true);
          ctx.closePath();
          ctx.clip();
          ctx.drawImage(di.options.backgroundImage, -ir, -ir, 2 * ir, 2 * ir);
        }
        if (di.options.displayText) {
          var fs = di.options.fontSize || ((this.innerRadius / 50).toFixed(2) + 'em');
          if (typeof fs === 'number') fs = fs + 'px';
          var ff = di.options.fontFamily || Chart.defaults.global.defaultFontFamily;
          var fc = di.options.fontColor || Chart.defaults.global.defaultFontColor;
          var txt = typeof di.options.text === 'function' 
            ? di.options.text(di.value, di.options) 
            : di.options.text;
          txt = txt || di.value.toString();
          ctx.font = fs + ' ' + ff;
          ctx.fillStyle = fc;
          ctx.textBaseline = 'middle';
          var tw = ctx.measureText(txt).width;
          if (tw < 2 * this.innerRadius * 0.8) {
            ctx.fillText(txt, Math.round(-tw / 2), 0);
          }
        }
      } finally {
        ctx.restore();
      }
    },
    
    update: function(reset) {
      var c = this.chart, ca = c.chartArea, o = c.options;
      var as = Math.min(
        ca.right - ca.left - o.elements.arc.borderWidth,
        ca.bottom - ca.top - o.elements.arc.borderWidth
      );
      var m = this.getMeta();
      this.borderWidth = this.getMaxBorderWidth(m.data);
      this.outerRadius = Math.max((as - this.borderWidth) / 2, 0);
      this.innerRadius = Math.max(
        o.centerPercentage ? (this.outerRadius / 100) * o.centerPercentage : 0,
        0
      );
      m.total = this.getMetricValue();
      this.centerX = (ca.left + ca.right) / 2;
      this.centerY = (ca.top + ca.bottom) / 2;
      h.each(m.data, function(arc, i) {
        this.updateElement(arc, i, reset);
      }, this);
    },
    
    updateElement: function(arc, i, reset) {
      var c = this.chart, ca = c.chartArea, o = c.options, ao = o.animation;
      var cx = (ca.left + ca.right) / 2, cy = (ca.top + ca.bottom) / 2, sa = o.rotation;
      var ds = this.getDataset();
      var aa = reset && ao.animateRotate ? 0 : this.calculateArcAngle(ds.data[i]);
      var v = reset && ao.animateScale ? 0 : this.getMetricValue();
      var ea = sa + aa;
      var via = h.valueAtIndexOrDefault;
      h.extend(arc, {
        _datasetIndex: this.index,
        _index: i,
        _model: {
          x: cx,
          y: cy,
          startAngle: sa,
          endAngle: ea,
          outerRadius: this.outerRadius,
          innerRadius: this.innerRadius,
          label: via(ds.label, i, c.data.labels[i]),
          roundedCorners: o.roundedCorners,
          value: v
        }
      });
      var m = arc._model, cu = arc.custom || {};
      var vod = h.valueAtIndexOrDefault, eo = c.options.elements.arc;
      m.backgroundColor = cu.backgroundColor || vod(ds.backgroundColor, i, eo.backgroundColor);
      m.borderColor = cu.borderColor || vod(ds.borderColor, i, eo.borderColor);
      m.borderWidth = cu.borderWidth || vod(ds.borderWidth, i, eo.borderWidth);
      arc.pivot();
    },
    
    getMetricValue: function() {
      var v = this.getDataset().data[0];
      return v == null ? this.chart.options.domain[0] : v;
    },
    
    getDomain: function() {
      return this.chart.options.domain;
    },
    
    calculateArcAngle: function() {
      var d = this.getDomain();
      var ds = d[1] - d[0];
      return ds > 0 
        ? Math.PI * 2.0 * (Math.abs(this.getMetricValue() - d[0]) / ds) 
        : 0;
    },
    
    getMaxBorderWidth: function(arcs) {
      var max = 0, idx = this.index;
      for (var i = 0; i < arcs.length; i++) {
        var bw = arcs[i]._model ? arcs[i]._model.borderWidth : 0;
        var hw = arcs[i]._chart 
          ? arcs[i]._chart.config.data.datasets[idx].hoverBorderWidth 
          : 0;
        max = Math.max(max, bw, hw);
      }
      return max;
    }
  });

  Chart.RadialGauge = function(ctx, cfg) {
    cfg.type = 'radialGauge';
    return new Chart(ctx, cfg);
  };

  return true;
}

// Create Profile Gauge Chart
function createProfileGauge(config) {
  var canvas = document.getElementById('profileGauge');
  if (!canvas) {
    console.error('Canvas element not found');
    return null;
  }

  // Initialize plugin if not already done
  if (!Chart.RadialGauge) {
    initRadialGaugePlugin();
  }

  var ctx = canvas.getContext('2d');
  var chartConfig = {
    type: 'radialGauge',
    data: {
      labels: ['Progress'],
      datasets: [{
        data: [config.value || 75],
        backgroundColor: [config.gaugeColor || 'rgba(34, 139, 34, 0.8)'],
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      legend: { display: false },
      centerArea: {
        padding: config.padding || 4,
        displayText: false
      },
      centerPercentage: config.centerSize || 80,
      trackColor: config.trackColor || 'rgba(204, 221, 238, 0.3)',
      domain: [0, 100],
      animation: {
        animateRotate: true,
        animateScale: true
      }
    }
  };

  var chart = new Chart(ctx, chartConfig);

  // Load profile image
  if (config.profileImageUrl) {
    var profileImage = new Image();
    profileImage.crossOrigin = 'anonymous';
    
    profileImage.onload = function() {
      chartConfig.options.centerArea.backgroundImage = profileImage;
      chart.update();
    };
    
    profileImage.onerror = function() {
      console.error('Failed to load profile image:', config.profileImageUrl);
      chartConfig.options.centerArea.displayText = true;
      chart.update();
    };
    
    profileImage.src = config.profileImageUrl;
  } else {
    chartConfig.options.centerArea.displayText = true;
    chart.update();
  }

  return chart;
}

// Update gauge value
function updateGaugeValue(chart, newValue) {
  if (chart && newValue >= 0 && newValue <= 100) {
    chart.config.data.datasets[0].data[0] = newValue;
    chart.update();
  }
}

