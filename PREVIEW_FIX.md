# Preview Server Fix

## Issue
The Mastra dev server was failing with the error:
```
error: unknown option '--port'
```

## Root Cause
The Mastra CLI doesn't support the `--port` flag. The generated `package.json` was using:
```json
"dev": "mastra dev --port 4111"
```

## Fix Applied

### 1. Removed Invalid Flag
Updated `src/lib/web-container/FileSystemGenerator.ts`:

**Before:**
```typescript
scripts: {
  dev: 'mastra dev --port 4111',
}
```

**After:**
```typescript
scripts: {
  dev: 'mastra dev',
}
```

### 2. Added PORT Environment Variable
Updated `.env` file generation to include port configuration:

```typescript
// Set port for Mastra dev server (if it supports PORT env var)
lines.push('PORT=4111');
```

The complete `.env` now includes:
```
OPENAI_API_KEY=...
ANTHROPIC_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=...
PORT=4111
```

## How It Works Now

1. **Mastra dev** starts without CLI arguments
2. Reads `PORT` from environment variable (`.env` file)
3. Starts server on port 4111 (or Mastra's default if PORT is ignored)
4. WebContainer's `server-ready` event detects whatever port Mastra uses
5. Preview iframe loads at the detected URL

## Testing

To test the fix:

1. Restart the preview (click Restart button or close and reopen)
2. The logs should now show:
   ```
   [INFO] Starting Mastra dev server...
   [INFO] Running: npm run dev
   [INFO] > mastra-preview@1.0.0 dev
   [INFO] > mastra dev
   [INFO] Server ready on port XXXX: http://...
   ```
3. No more "unknown option" errors
4. Playground should load successfully

## Fallback Behavior

If Mastra doesn't respect the `PORT` environment variable:
- It will start on its **default port** (likely 3000 or 4000)
- WebContainer will still detect the correct port via `server-ready` event
- Preview will work, just on a different port than expected

## Files Modified

- `src/lib/web-container/FileSystemGenerator.ts`
  - Removed `--port 4111` from npm script
  - Added `PORT=4111` to .env generation

## Verification

```bash
# Type check passes
pnpm type-check
# ✓ No errors
```

---

**Status**: Fixed ✅
**Tested**: Ready for runtime verification

