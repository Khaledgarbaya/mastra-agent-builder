# Deployment Guide

This guide covers how to deploy the Mastra Visual Builder to various platforms.

## 🚀 Cloudflare Pages (Recommended)

### Option 1: Git Integration (Recommended)

1. **Connect your repository to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com)
   - Navigate to Pages
   - Click "Create a project"
   - Connect your Git repository

2. **Configure build settings:**
   - **Framework preset**: Vite
   - **Build command**: `pnpm build`
   - **Build output directory**: `dist`
   - **Root directory**: `/` (or leave empty)

3. **Environment variables** (if needed):
   - Add any required environment variables in the Pages dashboard

4. **Deploy:**
   - Cloudflare will automatically build and deploy on every push to your main branch

### Option 2: Direct Upload

1. **Build the project locally:**
   ```bash
   pnpm build
   ```

2. **Upload to Cloudflare Pages:**
   - Go to Cloudflare Pages dashboard
   - Click "Upload assets"
   - Upload the `dist` folder contents

### Option 3: Wrangler CLI (Not Recommended for Static Sites)

If you must use Wrangler CLI, use the Pages command:

```bash
# Install Wrangler
npm install -g wrangler

# Login to Cloudflare
wrangler login

# Deploy to Pages (not Workers)
wrangler pages deploy dist --project-name mastra-agent-builder
```

## 🌐 Vercel

1. **Connect repository to Vercel:**
   - Go to [Vercel Dashboard](https://vercel.com/dashboard)
   - Import your Git repository

2. **Configure build settings:**
   - **Framework Preset**: Vite
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist`
   - **Install Command**: `pnpm install`

3. **Deploy:**
   - Vercel will automatically deploy on every push

## 🔥 Netlify

1. **Connect repository to Netlify:**
   - Go to [Netlify Dashboard](https://app.netlify.com)
   - Connect your Git repository

2. **Configure build settings:**
   - **Build command**: `pnpm build`
   - **Publish directory**: `dist`

3. **Add redirects** (already included in `_redirects` file):
   ```
   /*    /index.html   200
   ```

4. **Deploy:**
   - Netlify will automatically deploy on every push

## 🐳 Docker

Create a `Dockerfile`:

```dockerfile
# Build stage
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install

COPY . .
RUN pnpm build

# Production stage
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY _headers _redirects /usr/share/nginx/html/

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t mastra-agent-builder .
docker run -p 80:80 mastra-agent-builder
```

## 📋 Build Optimization

The project is configured with optimized build settings:

- **Code Splitting**: Libraries are split into separate chunks
- **Tree Shaking**: Unused code is removed
- **Minification**: Code is minified for production
- **Source Maps**: Generated for debugging
- **Caching Headers**: Configured for optimal performance

### Chunk Configuration

- `react-vendor`: React and React DOM
- `xyflow`: Flow diagram library
- `radix-ui`: UI component library
- `ui-components`: UI utilities and icons
- `code-editor`: Code editing components
- `utils`: Utility libraries

## 🔧 Troubleshooting

### Common Issues

**Build fails with TypeScript errors:**
- Ensure all imports are used
- Check for unused variables
- Run `pnpm type-check` locally

**Large bundle size:**
- The main bundle is large due to the code editor and flow diagram libraries
- Consider lazy loading for non-critical components
- Monitor bundle size with `pnpm build`

**Routing issues:**
- Ensure `_redirects` file is included in build output
- Configure your hosting platform for SPA routing

**Environment variables:**
- Add required environment variables in your hosting platform
- Use build-time environment variables for configuration

## 📊 Performance

### Bundle Analysis

To analyze bundle size:

```bash
# Install bundle analyzer
pnpm add -D rollup-plugin-visualizer

# Add to vite.config.ts and run build
pnpm build
```

### Optimization Tips

1. **Lazy Loading**: Implement lazy loading for heavy components
2. **Dynamic Imports**: Use dynamic imports for optional features
3. **Tree Shaking**: Ensure unused code is removed
4. **CDN**: Use CDN for static assets
5. **Caching**: Configure proper caching headers

## 🚀 Production Checklist

Before deploying to production:

- [ ] Run `pnpm build` successfully
- [ ] Test the built application locally with `pnpm preview`
- [ ] Check for console errors
- [ ] Verify all features work correctly
- [ ] Test on different browsers
- [ ] Check performance metrics
- [ ] Configure environment variables
- [ ] Set up monitoring and analytics
- [ ] Configure custom domain (if needed)
- [ ] Set up SSL certificate (usually automatic)

## 📞 Support

If you encounter deployment issues:

1. Check the build logs for errors
2. Verify all dependencies are installed
3. Ensure Node.js version compatibility
4. Check hosting platform documentation
5. Create an issue in the repository

---

Happy deploying! 🚀
