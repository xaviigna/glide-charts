# Setup Instructions for Glide Plugin

## Hosting the Plugin

Glide requires your plugin to be hosted and accessible via a direct URL. Follow these steps:

### Option 1: GitHub Pages (Recommended)

1. **Enable GitHub Pages:**
   - Go to your repository: https://github.com/xaviigna/glide-charts
   - Click on **Settings**
   - Scroll down to **Pages** section
   - Under **Source**, select **Branch: master** (or main)
   - Select **/ (root)** as the folder
   - Click **Save**

2. **Wait for GitHub Pages to deploy** (usually takes 1-2 minutes)

3. **Your plugin will be available at:**
   ```
   https://xaviigna.github.io/glide-charts/glide-plugin/glide.json
   ```

4. **In Glide:**
   - When adding the plugin, use this URL:
   ```
   https://xaviigna.github.io/glide-charts/glide-plugin/glide.json
   ```

### Option 2: Other Hosting Services

You can also host the plugin on:
- Netlify
- Vercel
- Any static hosting service

Just make sure all files in the `glide-plugin` folder are accessible via HTTPS.

## File Structure

Make sure your hosted files maintain this structure:
```
glide-plugin/
├── index.html
├── function.js
├── driver.js
├── glide.json
└── README.md
```

## Testing

After hosting, test that the manifest is accessible by opening this URL in your browser:
```
https://xaviigna.github.io/glide-charts/glide-plugin/glide.json
```

You should see the JSON configuration file.

## Troubleshooting

If you get "Loading the manifest failed" error:
1. ✅ Verify the URL is correct and accessible
2. ✅ Check that `glide.json` is in the correct location
3. ✅ Ensure GitHub Pages is enabled and deployed
4. ✅ Make sure you're using HTTPS (not HTTP)
5. ✅ Clear browser cache and try again

