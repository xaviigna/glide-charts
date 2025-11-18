# Profile Picture Gauge Plugin for Glide

A beautiful radial gauge chart that wraps around a profile picture. Perfect for displaying progress, scores, completion percentages, or any metric from 0-100 with a personalized touch.

## Features

- 🎯 **Profile Picture in Center** - Display any image in the center of the gauge
- 📊 **Radial Gauge** - Beautiful circular progress indicator
- 🎨 **Customizable Colors** - Fully customizable gauge and track colors
- 🔄 **Smooth Animations** - Animated gauge updates
- 📱 **Responsive** - Works on all screen sizes
- ⚙️ **Easy Configuration** - Simple settings in Glide

## Installation

1. Upload all files from this plugin folder to your Glide app
2. Add the plugin as a component in your Glide app
3. Configure the settings in Glide's component panel

## Configuration

### Settings

- **Profile Image URL**: URL of the profile picture to display in the center
- **Gauge Value**: The gauge value from 0-100 (default: 75)
- **Gauge Color**: Color of the filled gauge (default: dark green `rgba(34, 139, 34, 0.8)`)
- **Track Color**: Color of the empty track background (default: light gray `rgba(204, 221, 238, 0.3)`)
- **Center Size (%)**: Size of the center area as percentage of the gauge (default: 80)
- **Padding**: Padding around the profile image (default: 4)

### Color Examples

- **Dark Green**: `rgba(34, 139, 34, 0.8)`
- **Blue**: `rgba(54, 162, 235, 0.8)`
- **Red**: `rgba(255, 99, 132, 0.8)`
- **Orange**: `rgba(255, 159, 64, 0.8)`
- **Purple**: `rgba(153, 102, 255, 0.8)`

## Usage

### Basic Usage

1. Add the plugin component to your Glide screen
2. Set the **Profile Image URL** to your image URL
3. Set the **Gauge Value** (0-100)
4. Customize colors as needed

### Dynamic Updates

You can update the gauge value programmatically:

```javascript
// Update gauge to 85%
updateProfileGauge(85);
```

The chart instance is also available globally:

```javascript
// Access the chart instance
var chart = window.profileGaugeChart;

// Update value
chart.config.data.datasets[0].data[0] = 90;
chart.update();
```

## File Structure

```
glide-plugin/
├── index.html      # Main HTML structure
├── function.js     # Plugin logic and Chart.js extension
├── driver.js       # Initialization code
├── glide.json      # Plugin configuration
└── README.md       # This file
```

## Dependencies

- Chart.js 2.9.4 (loaded from CDN)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## License

MIT

## Support

For issues or questions, please refer to the main project repository.

