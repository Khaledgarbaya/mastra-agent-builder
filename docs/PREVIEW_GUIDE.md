# Live Preview User Guide

## Getting Started with Live Preview

The Mastra Visual Builder now includes a powerful live preview feature that lets you test your agents and workflows directly in the browser—no backend servers needed!

## Quick Start

### 1. Build Your Project
- Add agent nodes, tool nodes, and workflow nodes to the canvas
- Configure your agents with instructions and models
- Connect nodes to create workflows

### 2. Click Preview
- Find the **Preview** button in the toolbar (next to Code Preview)
- Click it to start the preview process

### 3. Enter API Keys
- A dialog will appear asking for your API keys
- Enter keys for the AI providers you're using:
  - **OpenAI**: For GPT models (e.g., `gpt-4o-mini`)
  - **Anthropic**: For Claude models
  - **Google AI**: For Gemini models
- Keys are saved locally in your browser for convenience
- Click **Start Preview**

### 4. Wait for Setup
The preview will go through several stages:
- **Booting WebContainer**: Initializing the browser-based Node.js environment (~5 seconds)
- **Installing dependencies**: Running `npm install` (~30-90 seconds)
- **Starting dev server**: Launching Mastra playground (~10-20 seconds)

### 5. Interact with Your Project
- Once running, the Mastra playground loads in the preview panel
- Switch between **Playground** and **Logs** tabs
- Chat with your agents
- Test your tools
- View real-time execution logs

## Preview Button States

| State | Appearance | Meaning |
|-------|-----------|---------|
| **Preview** | Blue button with play icon | Ready to start |
| **Starting...** | Disabled | WebContainer is booting or installing |
| **🟢 Running** | Green with pulsing dot | Preview is active |
| **Error** | Red | Something went wrong (check logs) |

## Tabs

### Playground Tab
- Interactive Mastra playground interface
- Chat with your configured agents
- Execute workflows
- See agent responses in real-time

### Logs Tab
- Real-time streaming logs from npm install and dev server
- Color-coded messages:
  - White: Info messages
  - Yellow: Warnings
  - Red: Errors
- Auto-scrolls to latest logs (scroll up to pause)
- **Copy** button to copy all logs
- **Clear** button to reset log view

## Actions

### Stop Preview
- Stops the Mastra dev server
- Keeps WebContainer running for faster restarts
- Closes the playground iframe

### Restart Preview
- Stops current preview
- Opens API keys dialog again
- Useful for changing API keys or fixing errors

### Close Preview
- Stops the dev server
- Closes the preview panel
- Returns to canvas view

## Tips & Best Practices

### ✅ Do's
- **Save your project** before previewing (auto-saves every 30 seconds)
- **Add at least one agent** before previewing
- **Configure agent models** properly
- **Check logs** if preview fails
- **Keep the preview panel open** while testing
- **Use the Logs tab** to debug issues

### ❌ Don'ts
- Don't close the browser tab during preview (WebContainer will restart)
- Don't preview without any agents or tools
- Don't expect instant loading (first install takes time)
- Don't share your API keys with others

## Troubleshooting

### Preview Won't Start
**Problem**: Clicking Preview does nothing or shows error immediately

**Solutions**:
1. Ensure you have at least one agent configured
2. Check that agent has a valid model selected
3. Verify you're using a supported browser (Chrome, Edge, Firefox, Safari desktop)
4. Clear browser cache and reload
5. Check browser console for errors

### Install Taking Too Long
**Problem**: "Installing dependencies..." for more than 2 minutes

**Solutions**:
1. Check your internet connection
2. Look at Logs tab for error messages
3. Restart preview
4. Try again with better network connection

### Server Won't Start
**Problem**: Stuck on "Starting dev server..."

**Solutions**:
1. Check Logs tab for error messages
2. Verify API keys are correct
3. Ensure agent configurations are valid
4. Restart preview
5. Check if port 4111 is available

### Can't See Playground
**Problem**: Preview shows "Running" but iframe is blank

**Solutions**:
1. Wait a few more seconds (server might still be initializing)
2. Check Logs tab for "Server ready" message
3. Look for error messages in logs
4. Restart preview
5. Try refreshing the browser

### API Key Errors
**Problem**: "Unauthorized" or "Invalid API key" in logs

**Solutions**:
1. Verify your API keys are correct
2. Check that keys have necessary permissions
3. Ensure you're not rate-limited
4. Try regenerating keys in provider dashboard
5. Restart preview with new keys

## Browser Compatibility

### ✅ Fully Supported
- **Chrome** 87+ (Recommended)
- **Edge** 87+
- **Firefox** 89+
- **Safari** 15.5+ (Desktop only)

### ❌ Not Supported
- Safari iOS/iPadOS
- Internet Explorer
- Older browser versions
- Mobile browsers (limited support)

## Security & Privacy

### Your API Keys
- Stored **only in your browser's localStorage**
- Never sent to our servers
- Used only in the WebContainer environment
- Can be cleared at any time

### WebContainer
- Runs entirely in your browser
- No backend servers involved
- Isolated from your computer's filesystem
- Sandboxed for security

### Best Practices
- Use API keys with **limited permissions** if possible
- Don't share your browser profile with others
- Clear localStorage if using a shared computer
- Rotate API keys regularly

## Performance Tips

### First Preview
- Expect 1-2 minutes for complete setup
- npm install downloads dependencies (largest time component)
- Be patient during first run

### Subsequent Previews
- WebContainer reuses existing instance
- Much faster (under 1 minute)
- Dependencies already cached

### Large Projects
- Projects with many agents/tools take longer
- More dependencies = longer install time
- Consider simplifying for testing

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + P` | Toggle Preview (planned) |
| `Ctrl/Cmd + L` | Switch to Logs tab (planned) |
| `Esc` | Close preview panel |

*Note: Some shortcuts planned for future release*

## FAQ

### Q: Do I need to download anything?
**A:** No! Everything runs in your browser using WebAssembly.

### Q: Will my API keys be stored on your servers?
**A:** No, keys stay in your browser's localStorage only.

### Q: Can I preview without internet?
**A:** No, WebContainer needs to download dependencies from npm.

### Q: How much data does it use?
**A:** First install: ~50-100MB for Mastra dependencies. Subsequent runs reuse cache.

### Q: Can I edit code while previewing?
**A:** Not in real-time. You need to stop, modify canvas, and restart preview.

### Q: Is this free to use?
**A:** Yes, the preview feature is free. You only pay for API calls to AI providers.

### Q: What happens to my data?
**A:** All data stays in your browser. Nothing is sent to our servers.

### Q: Can I use this for production?
**A:** The preview is for testing only. Export your project for production use.

## Advanced Features (Coming Soon)

- 🔄 **Hot Reload**: Automatic preview updates when canvas changes
- 💾 **Session Persistence**: Resume previews after page reload
- 📊 **Performance Monitoring**: Memory and CPU usage tracking
- 🎯 **Workflow Visualization**: See active workflow steps on canvas
- 🔍 **Log Filtering**: Search and filter logs by level/keyword
- 🌐 **Multi-Session**: Run multiple previews simultaneously

## Support

### Need Help?
- Check the **Logs tab** for detailed error messages
- Review your agent configurations
- Verify API keys are valid
- Try restarting the preview

### Report Issues
If you encounter bugs or issues:
1. Note the error message from logs
2. Export your project configuration
3. Check browser console for errors
4. Report via GitHub issues

---

**Happy Building!** 🚀

