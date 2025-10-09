# Agent Builder Standalone Deployment Plan

## Executive Summary

This document outlines a comprehensive plan to extract the Mastra Visual Builder (Agent Builder) from the Mastra monorepo and deploy it as a standalone web application. The visual builder is currently production-ready with all core features implemented.

---

## 📊 Current State Analysis

### Architecture Overview

**Current Location:** `/packages/visual-builder/`

**Integration Status:**
- Currently integrated as a workspace package in the Mastra monorepo
- Used by the playground at route `/builder`
- Minimal coupling - only imports `BuilderPage` component

**Package Stats:**
- **Build Size:** 759 KB (164 KB gzipped)
- **Tests:** 51/51 passing
- **TypeScript:** 0 errors
- **Status:** Production ready

### Key Features (All Implemented ✅)

1. ✅ Visual Canvas (11 Mastra node types, drag-drop, connections)
2. ✅ Configuration Panels (9 dynamic panels)
3. ✅ Code Generation (5 generators, full project export)
4. ✅ Project Management (Save/Load/Import/Export)
5. ✅ Template Library (26 templates across 4 categories)
6. ✅ Real-time Validation (Node + Graph validation)
7. ✅ Keyboard Shortcuts (8 shortcuts + help dialog)
8. ✅ Auto-save (30s interval, unsaved indicator)
9. ✅ Testing (51 unit tests)
10. ✅ Documentation (4 comprehensive guides)

### Dependencies Analysis

**Direct Dependencies:**
```json
{
  "@mastra/core": "workspace:*",  // ⚠️ Only for types, minimal usage
  "@xyflow/react": "^12.8.6",     // Flow canvas
  "@radix-ui/*": "latest",         // UI components
  "zustand": "^5.0.2",             // State management
  "zod": "^4.1.9",                 // Schema validation
  "jszip": "^3.10.1",              // Export functionality
  "react": "^19.1.1",
  "react-dom": "^19.1.1"
}
```

**Critical Finding:** The builder has minimal dependency on `@mastra/core`. It's primarily used for:
- Type definitions only (not runtime code)
- Code generation templates (can be extracted)

---

## 🎯 Extraction Strategy

### Option 1: Clean Extraction (Recommended)

**Goal:** Create a completely independent standalone app outside the monorepo.

**Approach:**
1. Copy the visual-builder package to a new repository
2. Replace workspace dependencies with npm packages or local implementations
3. Create a standalone Vite/React app wrapper
4. Deploy as a static web application

**Advantages:**
- ✅ Complete independence from Mastra monorepo
- ✅ Simpler deployment and updates
- ✅ Can be versioned separately
- ✅ Easier to distribute (standalone URL)
- ✅ No build complexity from monorepo

**Disadvantages:**
- ⚠️ Need to replace/vendor `@mastra/core` types
- ⚠️ Separate maintenance from Mastra core

### Option 2: Monorepo Subproject

**Goal:** Keep in monorepo but deploy separately.

**Approach:**
1. Create a new top-level app in the monorepo (e.g., `/apps/agent-builder/`)
2. Import visual-builder package as-is
3. Build and deploy independently from playground

**Advantages:**
- ✅ Shared dependencies with Mastra core
- ✅ Easier to keep in sync with Mastra updates
- ✅ Can share types directly

**Disadvantages:**
- ⚠️ Still coupled to monorepo
- ⚠️ More complex build/deployment
- ⚠️ Harder to distribute independently

### Option 3: Hybrid Approach

**Goal:** Extract to separate repo but maintain sync mechanism.

**Approach:**
1. Create standalone app (Option 1)
2. Set up automated sync/vendoring from Mastra core types
3. Use git submodules or package mirroring

---

## 🏗️ Recommended Approach: Clean Extraction

Based on the minimal coupling and production-ready state, I recommend **Option 1: Clean Extraction**.

---

## 📁 Standalone Application Structure

```
mastra-agent-builder/                    # New standalone repository
├── public/
│   ├── favicon.ico
│   └── mastra.svg
├── src/
│   ├── components/                       # From visual-builder/src/components
│   │   ├── builder/
│   │   ├── canvas/
│   │   ├── nodes/
│   │   ├── panels/
│   │   ├── palette/
│   │   ├── code-preview/
│   │   ├── export/
│   │   ├── import/
│   │   ├── save-load/
│   │   ├── schema/
│   │   ├── templates/
│   │   ├── validation/
│   │   └── ui/
│   ├── lib/                              # From visual-builder/src/lib
│   │   ├── code-generation/
│   │   ├── storage/
│   │   ├── templates/
│   │   ├── validators/
│   │   └── utils.ts
│   ├── hooks/                            # From visual-builder/src/hooks
│   ├── store/                            # From visual-builder/src/store
│   ├── types/                            # From visual-builder/src/types + vendored Mastra types
│   ├── App.tsx                           # New entry point
│   ├── main.tsx                          # New Vite entry
│   └── styles.css                        # From visual-builder/src/styles.css
├── vendored/                             # Vendored Mastra types (if needed)
│   └── mastra-types.ts
├── index.html
├── package.json
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
├── postcss.config.js
├── .gitignore
├── .env.example
└── README.md
```

---

## 🔧 Implementation Steps

### Phase 1: Setup New Repository (1-2 hours)

1. **Create new repository**
   ```bash
   mkdir mastra-agent-builder
   cd mastra-agent-builder
   git init
   ```

2. **Initialize Vite + React + TypeScript**
   ```bash
   pnpm create vite@latest . -- --template react-ts
   ```

3. **Install dependencies**
   ```bash
   pnpm add @xyflow/react zustand zod jszip \
     @radix-ui/react-checkbox @radix-ui/react-dialog \
     @radix-ui/react-dropdown-menu @radix-ui/react-label \
     @radix-ui/react-popover @radix-ui/react-scroll-area \
     @radix-ui/react-select @radix-ui/react-separator \
     @radix-ui/react-slider @radix-ui/react-slot \
     @radix-ui/react-switch @radix-ui/react-tabs \
     @radix-ui/react-tooltip @uiw/react-codemirror \
     @uiw/codemirror-theme-dracula lucide-react \
     class-variance-authority clsx tailwind-merge \
     tailwindcss-animate sonner framer-motion \
     react-hook-form react-syntax-highlighter \
     @types/react-syntax-highlighter
   ```

4. **Install dev dependencies**
   ```bash
   pnpm add -D tailwindcss postcss autoprefixer \
     @types/node vitest @vitest/ui jsdom \
     @testing-library/react @testing-library/jest-dom \
     @testing-library/user-event
   ```

5. **Setup Tailwind CSS**
   ```bash
   pnpm dlx tailwindcss init -p
   ```

### Phase 2: Copy Visual Builder Code (2-3 hours)

1. **Copy source files**
   ```bash
   # From mastra repo
   cp -r packages/visual-builder/src/* mastra-agent-builder/src/
   
   # Copy styles
   cp packages/visual-builder/src/styles.css mastra-agent-builder/src/
   
   # Copy configs
   cp packages/visual-builder/tailwind.config.js mastra-agent-builder/
   cp packages/visual-builder/tsconfig.json mastra-agent-builder/
   ```

2. **Copy tests (optional)**
   ```bash
   cp -r packages/visual-builder/src/lib/code-generation/__tests__ mastra-agent-builder/src/lib/code-generation/
   cp -r packages/visual-builder/src/lib/validators/__tests__ mastra-agent-builder/src/lib/validators/
   cp -r packages/visual-builder/src/test mastra-agent-builder/src/
   cp packages/visual-builder/vitest.config.ts mastra-agent-builder/
   ```

3. **Copy documentation**
   ```bash
   cp packages/visual-builder/README.md mastra-agent-builder/
   cp packages/visual-builder/ARCHITECTURE.md mastra-agent-builder/docs/
   cp packages/visual-builder/API.md mastra-agent-builder/docs/
   cp packages/visual-builder/KEYBOARD_SHORTCUTS.md mastra-agent-builder/docs/
   ```

### Phase 3: Resolve Dependencies (3-4 hours)

1. **Vendor Mastra types** (if needed)

   Create `src/vendored/mastra-types.ts`:
   ```typescript
   // Extract only the necessary type definitions from @mastra/core
   // Most code generation templates are already strings, so minimal vendoring needed
   
   export type ModelConfig = {
     provider: string;
     name: string;
     toolChoice?: 'auto' | 'required';
   };
   
   export type MemoryConfig = {
     type: 'buffer' | 'summary';
     maxMessages?: number;
   };
   
   // Add other minimal types as needed
   ```

2. **Update imports**

   Replace all `@mastra/core` imports:
   ```bash
   # Find all files importing from @mastra/core
   find src -type f -name "*.ts" -o -name "*.tsx" | xargs grep -l "@mastra/core"
   
   # Update imports to use vendored types
   # sed -i '' 's/@mastra\/core/..\/vendored\/mastra-types/g' [files]
   ```

3. **Fix import paths**

   Update any workspace-relative imports to use proper relative paths.

### Phase 4: Create Standalone App Entry (1 hour)

1. **Create `src/App.tsx`**
   ```tsx
   import { BuilderPage } from './components/BuilderPage';
   import './styles.css';

   function App() {
     return (
       <div className="dark h-screen w-screen overflow-hidden">
         <BuilderPage />
       </div>
     );
   }

   export default App;
   ```

2. **Create `src/main.tsx`**
   ```tsx
   import React from 'react';
   import ReactDOM from 'react-dom/client';
   import App from './App';
   import './index.css';

   ReactDOM.createRoot(document.getElementById('root')!).render(
     <React.StrictMode>
       <App />
     </React.StrictMode>,
   );
   ```

3. **Create `index.html`**
   ```html
   <!doctype html>
   <html lang="en">
     <head>
       <meta charset="UTF-8" />
       <link rel="icon" type="image/svg+xml" href="/mastra.svg" />
       <meta name="viewport" content="width=device-width, initial-scale=1.0" />
       <title>Mastra Agent Builder</title>
     </head>
     <body class="overflow-hidden">
       <div id="root" class="dark"></div>
       <script type="module" src="/src/main.tsx"></script>
     </body>
   </html>
   ```

### Phase 5: Configuration Files (1 hour)

1. **Update `package.json`**
   ```json
   {
     "name": "mastra-agent-builder",
     "version": "1.0.0",
     "description": "Visual builder for Mastra AI agents, workflows, and tools",
     "type": "module",
     "scripts": {
       "dev": "vite",
       "build": "tsc && vite build",
       "preview": "vite preview",
       "test": "vitest",
       "test:ui": "vitest --ui",
       "lint": "eslint . --ext ts,tsx"
     },
     "dependencies": {
       // ... (from Phase 1)
     },
     "devDependencies": {
       // ... (from Phase 1)
     }
   }
   ```

2. **Update `vite.config.ts`**
   ```typescript
   import { defineConfig } from 'vite';
   import react from '@vitejs/plugin-react';
   import path from 'path';

   export default defineConfig({
     plugins: [react()],
     resolve: {
       alias: {
         '@': path.resolve(__dirname, './src'),
       },
     },
     build: {
       outDir: 'dist',
       sourcemap: true,
       rollupOptions: {
         output: {
           manualChunks: {
             'react-vendor': ['react', 'react-dom'],
             'xyflow': ['@xyflow/react'],
             'radix': [
               '@radix-ui/react-checkbox',
               '@radix-ui/react-dialog',
               // ... other radix packages
             ],
           },
         },
       },
     },
   });
   ```

3. **Update `tsconfig.json`**
   ```json
   {
     "compilerOptions": {
       "target": "ES2020",
       "useDefineForClassFields": true,
       "lib": ["ES2020", "DOM", "DOM.Iterable"],
       "module": "ESNext",
       "skipLibCheck": true,
       "moduleResolution": "bundler",
       "allowImportingTsExtensions": true,
       "resolveJsonModule": true,
       "isolatedModules": true,
       "noEmit": true,
       "jsx": "react-jsx",
       "strict": true,
       "noUnusedLocals": true,
       "noUnusedParameters": true,
       "noFallthroughCasesInSwitch": true,
       "baseUrl": ".",
       "paths": {
         "@/*": ["./src/*"]
       }
     },
     "include": ["src"],
     "references": [{ "path": "./tsconfig.node.json" }]
   }
   ```

4. **Create `.env.example`**
   ```bash
   # Optional: Analytics/tracking
   VITE_POSTHOG_KEY=
   VITE_POSTHOG_HOST=
   
   # Optional: Feature flags
   VITE_ENABLE_AI_ASSISTANT=false
   ```

### Phase 6: Testing & Validation (2-3 hours)

1. **Run development server**
   ```bash
   pnpm dev
   ```

2. **Test all features**
   - ✅ Canvas drag-and-drop
   - ✅ Node configuration
   - ✅ Code generation
   - ✅ Import/Export
   - ✅ Save/Load
   - ✅ Templates
   - ✅ Validation
   - ✅ Keyboard shortcuts

3. **Run tests**
   ```bash
   pnpm test
   ```

4. **Build for production**
   ```bash
   pnpm build
   pnpm preview
   ```

5. **Check bundle size**
   ```bash
   du -sh dist/
   ```

### Phase 7: Documentation Updates (1 hour)

1. **Update README.md**
   ```markdown
   # Mastra Agent Builder

   A standalone visual interface for building Mastra AI agents, workflows, and tools.

   ## 🚀 Quick Start

   \`\`\`bash
   pnpm install
   pnpm dev
   \`\`\`

   ## 🌐 Deployment

   [Add deployment instructions]

   ## 📚 Documentation

   - [Architecture](./docs/ARCHITECTURE.md)
   - [API Reference](./docs/API.md)
   - [Keyboard Shortcuts](./docs/KEYBOARD_SHORTCUTS.md)
   ```

2. **Add deployment docs**

   Create `docs/DEPLOYMENT.md` with deployment instructions (see Phase 8).

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended - Easiest)

**Advantages:**
- ✅ Zero config deployment
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Preview deployments for PRs
- ✅ Free tier available

**Steps:**
1. Push code to GitHub
2. Import project in Vercel
3. Deploy with one click
4. Custom domain (optional)

**Configuration:**
```json
// vercel.json
{
  "buildCommand": "pnpm build",
  "outputDirectory": "dist",
  "framework": "vite"
}
```

### Option 2: Netlify

**Advantages:**
- ✅ Simple deployment
- ✅ Form handling
- ✅ Serverless functions support
- ✅ Free tier available

**Steps:**
1. Push code to GitHub
2. Connect to Netlify
3. Configure build settings:
   - Build command: `pnpm build`
   - Publish directory: `dist`

**Configuration:**
```toml
# netlify.toml
[build]
  command = "pnpm build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: AWS S3 + CloudFront

**Advantages:**
- ✅ Full control
- ✅ Highly scalable
- ✅ Custom configurations
- ✅ Integration with AWS services

**Steps:**
1. Build the app: `pnpm build`
2. Create S3 bucket
3. Enable static website hosting
4. Upload `dist/` contents
5. Configure CloudFront distribution
6. Setup custom domain (Route 53)

**Deployment script:**
```bash
#!/bin/bash
pnpm build
aws s3 sync dist/ s3://your-bucket-name --delete
aws cloudfront create-invalidation --distribution-id YOUR_DIST_ID --paths "/*"
```

### Option 4: Docker + Any Cloud

**Advantages:**
- ✅ Portable
- ✅ Works anywhere
- ✅ Easy local testing

**Dockerfile:**
```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**nginx.conf:**
```nginx
server {
    listen 80;
    server_name _;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Gzip compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml;
}
```

**Deploy to:**
- AWS ECS/Fargate
- Google Cloud Run
- Azure Container Apps
- DigitalOcean App Platform
- Railway
- Render

### Option 5: GitHub Pages

**Advantages:**
- ✅ Free hosting
- ✅ GitHub integration
- ✅ Simple setup

**Steps:**
1. Update `vite.config.ts`:
   ```typescript
   export default defineConfig({
     base: '/mastra-agent-builder/',  // repo name
     // ...
   });
   ```

2. Create `.github/workflows/deploy.yml`:
   ```yaml
   name: Deploy to GitHub Pages

   on:
     push:
       branches: [main]

   jobs:
     build-deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v3
         - uses: pnpm/action-setup@v2
         - uses: actions/setup-node@v3
           with:
             node-version: 20
             cache: 'pnpm'
         - run: pnpm install
         - run: pnpm build
         - uses: peaceiris/actions-gh-pages@v3
           with:
             github_token: ${{ secrets.GITHUB_TOKEN }}
             publish_dir: ./dist
   ```

---

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

Create `.github/workflows/ci.yml`:

```yaml
name: CI/CD

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: 8
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: 'pnpm'
      
      - name: Install dependencies
        run: pnpm install --frozen-lockfile
      
      - name: Lint
        run: pnpm lint
      
      - name: Type check
        run: pnpm type-check
      
      - name: Run tests
        run: pnpm test
      
      - name: Build
        run: pnpm build
      
      - name: Upload build artifacts
        uses: actions/upload-artifact@v3
        with:
          name: dist
          path: dist/

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Download build artifacts
        uses: actions/download-artifact@v3
        with:
          name: dist
          path: dist/
      
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

---

## 📊 Production Checklist

### Performance Optimization

- [x] Code splitting configured
- [ ] Add service worker for offline support
- [ ] Implement lazy loading for heavy components
- [ ] Add image optimization
- [ ] Enable HTTP/2 server push
- [ ] Configure proper cache headers

### SEO & Metadata

- [ ] Add meta tags in `index.html`
- [ ] Add Open Graph tags
- [ ] Add Twitter Card tags
- [ ] Add sitemap.xml
- [ ] Add robots.txt

### Security

- [ ] Add Content Security Policy headers
- [ ] Configure CORS properly
- [ ] Add rate limiting (if using API)
- [ ] Enable HTTPS only
- [ ] Add security.txt

### Monitoring

- [ ] Setup error tracking (Sentry)
- [ ] Add analytics (PostHog, Google Analytics)
- [ ] Setup uptime monitoring
- [ ] Add performance monitoring
- [ ] Setup logging

### Legal & Compliance

- [ ] Add privacy policy
- [ ] Add terms of service
- [ ] Add cookie consent (if needed)
- [ ] Add license file (MIT/Apache)

---

## 🔗 Integration with Mastra Ecosystem

### Export to Mastra Projects

Users can export generated code and use it in their Mastra projects:

1. **In Agent Builder:**
   - Build visually
   - Export as ZIP or download files

2. **In Mastra Project:**
   ```bash
   # Unzip exported files
   unzip mastra-project.zip -d src/mastra/
   
   # Install dependencies
   pnpm add @mastra/core
   
   # Use generated code
   import { mastra } from './src/mastra/index';
   ```

### Import from Mastra Projects

Users can import existing Mastra code:

1. Export project as `.mastra.json`
2. Import in Agent Builder
3. Edit visually
4. Re-export

---

## 📈 Future Enhancements

### Phase 1 (Post-Launch)
- [ ] Add authentication (for save/share features)
- [ ] Cloud project storage
- [ ] Team collaboration features
- [ ] Version control integration

### Phase 2
- [ ] AI-assisted building
- [ ] Real-time preview/testing
- [ ] Template marketplace
- [ ] Plugin system

### Phase 3
- [ ] Multi-user collaboration
- [ ] Advanced debugging tools
- [ ] Performance profiling
- [ ] Cost estimation

---

## 📝 Maintenance Plan

### Dependencies
- Update dependencies monthly
- Security patches within 24 hours
- Major version updates after testing

### Monitoring
- Daily health checks
- Weekly performance reviews
- Monthly analytics reports

### Support
- GitHub Issues for bug reports
- Discord/Slack for community support
- Documentation updates as needed

---

## 💰 Cost Estimation

### Hosting (Vercel Pro)
- $20/month for team features
- Includes: 100GB bandwidth, unlimited sites, analytics

### Optional Services
- Sentry (Error tracking): $26/month
- PostHog (Analytics): Free tier or $20/month
- Custom domain: $10-15/year

**Total Estimated Monthly Cost:** $50-100

### Free Tier Option
- Vercel Free: Hobby projects
- GitHub Pages: Free static hosting
- Netlify Free: 100GB/month

**Total Free Tier Cost:** $0 🎉

---

## 🚦 Go-Live Plan

### Week 1: Extraction
- Days 1-2: Setup repository and copy code
- Days 3-4: Resolve dependencies
- Day 5: Testing

### Week 2: Deployment
- Days 1-2: Configure CI/CD
- Days 3-4: Deploy to staging
- Day 5: Production deployment

### Week 3: Launch
- Days 1-2: Documentation
- Days 3-4: Marketing materials
- Day 5: Public announcement

---

## 📞 Next Steps

1. **Decision:** Choose extraction strategy (Recommended: Clean Extraction)
2. **Timeline:** Allocate 2-3 weeks for full extraction and deployment
3. **Resources:** Assign 1-2 developers
4. **Budget:** Approve hosting/service costs (~$50-100/month)
5. **Execute:** Follow implementation steps (Phase 1-7)

---

## 🎯 Success Metrics

### Technical
- Build size < 1MB gzipped
- Lighthouse score > 90
- 100% test coverage maintained
- Zero production errors

### Business
- User adoption rate
- Code export frequency
- Template usage stats
- Community engagement

---

## 📚 Additional Resources

- [Visual Builder Documentation](./docs/README.md)
- [Architecture Guide](./docs/ARCHITECTURE.md)
- [API Reference](./docs/API.md)
- [Keyboard Shortcuts](./docs/KEYBOARD_SHORTCUTS.md)
- [Mastra Documentation](https://mastra.ai/docs)

---

**Document Version:** 1.0  
**Last Updated:** October 9, 2025  
**Author:** Mastra Team

