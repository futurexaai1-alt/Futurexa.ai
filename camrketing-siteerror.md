2026-04-08T15:37:55.706Z	Initializing build environment...
2026-04-08T15:39:25.886Z	Success: Finished initializing build environment
2026-04-08T15:39:27.585Z	Cloning repository...
2026-04-08T15:37:55.706Z	Initializing build environment...
2026-04-08T15:39:25.886Z	Success: Finished initializing build environment
2026-04-08T15:39:27.585Z	Cloning repository...
2026-04-08T15:39:30.862Z	Restoring from dependencies cache
2026-04-08T15:39:30.866Z	Restoring from build output cache
2026-04-08T15:39:30.872Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T15:39:31.169Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T15:39:53.596Z	
2026-04-08T15:39:53.597Z	> postinstall
2026-04-08T15:39:53.597Z	> npm run cf-typegen
2026-04-08T15:39:53.598Z	
2026-04-08T15:39:53.915Z	
2026-04-08T15:39:53.916Z	> cf-typegen
2026-04-08T15:39:53.916Z	> wrangler types
2026-04-08T15:39:53.917Z	
2026-04-08T15:39:56.087Z	
2026-04-08T15:39:56.087Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T15:39:56.087Z	─────────────────────────────────────────────
2026-04-08T15:39:56.163Z	Generating project types...
2026-04-08T15:39:56.163Z	
2026-04-08T15:39:56.174Z	declare namespace Cloudflare {
2026-04-08T15:39:56.174Z		interface GlobalProps {
2026-04-08T15:39:56.174Z			mainModule: typeof import("./workers/app");
2026-04-08T15:39:56.174Z		}
2026-04-08T15:39:56.174Z		interface Env {
2026-04-08T15:39:56.175Z			API: Fetcher /* futurexa-api */;
2026-04-08T15:39:56.175Z		}
2026-04-08T15:39:56.175Z	}
2026-04-08T15:39:56.175Z	interface Env extends Cloudflare.Env {}
2026-04-08T15:39:56.175Z	
2026-04-08T15:39:56.175Z	Generating runtime types...
2026-04-08T15:39:56.175Z	
2026-04-08T15:40:01.372Z	Runtime types generated.
2026-04-08T15:40:01.373Z	
2026-04-08T15:40:01.374Z	
2026-04-08T15:40:01.378Z	✨ Types written to worker-configuration.d.ts
2026-04-08T15:40:01.379Z	
2026-04-08T15:40:01.379Z	📖 Read about runtime types
2026-04-08T15:40:01.379Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T15:40:01.380Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T15:40:01.380Z	
2026-04-08T15:40:01.522Z	
2026-04-08T15:40:01.522Z	added 171 packages, and audited 173 packages in 29s
2026-04-08T15:40:01.522Z	
2026-04-08T15:40:01.523Z	31 packages are looking for funding
2026-04-08T15:40:01.523Z	  run `npm fund` for details
2026-04-08T15:40:01.626Z	
2026-04-08T15:40:01.627Z	7 high severity vulnerabilities
2026-04-08T15:40:01.627Z	
2026-04-08T15:40:01.627Z	To address all issues, run:
2026-04-08T15:40:01.627Z	  npm audit fix
2026-04-08T15:40:01.627Z	
2026-04-08T15:40:01.627Z	Run `npm audit` for details.
2026-04-08T15:40:02.354Z	Executing user build command: npm run build
2026-04-08T15:40:02.801Z	
2026-04-08T15:40:02.801Z	> build
2026-04-08T15:40:02.802Z	> react-router build
2026-04-08T15:40:02.802Z	
2026-04-08T15:40:05.419Z	Using Vite Environment API (experimental)
2026-04-08T15:40:05.424Z	vite v7.3.1 building client environment for production...
2026-04-08T15:40:05.495Z	transforming...
2026-04-08T15:40:06.914Z	✓ 51 modules transformed.
2026-04-08T15:40:07.488Z	✘ [ERROR] The build was canceled
2026-04-08T15:40:07.488Z	
2026-04-08T15:40:07.538Z	✗ Build failed in 2.08s
2026-04-08T15:40:07.539Z	[react-router:route-exports] SPA Mode: 1 invalid route export(s) in `routes/api.hero-media.ts`: `loader`. See https://reactrouter.com/how-to/spa for more information.
2026-04-08T15:40:07.539Z	file: /opt/buildhome/repo/marketing-site/app/routes/api.hero-media.ts
2026-04-08T15:40:07.539Z	    at Object.transform (/opt/buildhome/repo/marketing-site/node_modules/@react-router/dev/dist/vite.js:4219:19)
2026-04-08T15:40:07.539Z	    at Object.handler (file:///opt/buildhome/repo/marketing-site/node_modules/vite/dist/node/chunks/config.js:33730:13)
2026-04-08T15:40:07.540Z	    at file:///opt/buildhome/repo/marketing-site/node_modules/rollup/dist/es/shared/node-entry.js:22571:40
2026-04-08T15:40:07.541Z	    at processTicksAndRejections (node:internal/process/task_queues:105:5) {
2026-04-08T15:40:07.541Z	  code: 'PLUGIN_ERROR',
2026-04-08T15:40:07.542Z	  plugin: 'react-router:route-exports',
2026-04-08T15:40:07.542Z	  hook: 'transform',
2026-04-08T15:40:07.543Z	  id: '/opt/buildhome/repo/marketing-site/app/routes/api.hero-media.ts',
2026-04-08T15:40:07.546Z	  watchFiles: [
2026-04-08T15:40:07.550Z	    '/opt/buildhome/repo/marketing-site/app/root.tsx',
2026-04-08T15:40:07.550Z	    '/opt/buildhome/repo/marketing-site/node_modules/@react-router/dev/dist/config/defaults/entry.client.tsx',
2026-04-08T15:40:07.550Z	    '/opt/buildhome/repo/marketing-site/app/routes/services.tsx',
2026-04-08T15:40:07.550Z	    '/opt/buildhome/repo/marketing-site/app/routes/service-detail.tsx',
2026-04-08T15:40:07.551Z	    '/opt/buildhome/repo/marketing-site/app/routes/case-studies.tsx',
2026-04-08T15:40:07.551Z	    '/opt/buildhome/repo/marketing-site/app/routes/case-study-detail.tsx',
2026-04-08T15:40:07.551Z	    '/opt/buildhome/repo/marketing-site/app/routes/home.tsx',
2026-04-08T15:40:07.552Z	    '/opt/buildhome/repo/marketing-site/app/routes/about.tsx',
2026-04-08T15:40:07.552Z	    '/opt/buildhome/repo/marketing-site/app/routes/blog-post.tsx',
2026-04-08T15:40:07.558Z	    '/opt/buildhome/repo/marketing-site/app/routes/pricing.tsx',
2026-04-08T15:40:07.558Z	    '/opt/buildhome/repo/marketing-site/app/routes/contact.tsx',
2026-04-08T15:40:07.558Z	    '/opt/buildhome/repo/marketing-site/app/routes/industries.tsx',
2026-04-08T15:40:07.558Z	    '/opt/buildhome/repo/marketing-site/app/routes/privacy.tsx',
2026-04-08T15:40:07.559Z	    '/opt/buildhome/repo/marketing-site/app/routes/blog.tsx',
2026-04-08T15:40:07.559Z	    '/opt/buildhome/repo/marketing-site/app/routes/terms.tsx',
2026-04-08T15:40:07.560Z	    '/opt/buildhome/repo/marketing-site/app/routes/resources.tsx',
2026-04-08T15:40:07.561Z	    '/opt/buildhome/repo/marketing-site/app/routes/api.hero-media.ts',
2026-04-08T15:40:07.561Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/index.js',
2026-04-08T15:40:07.562Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/client.js',
2026-04-08T15:40:07.562Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-router/dist/development/dom-export.mjs',
2026-04-08T15:40:07.562Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/jsx-runtime.js',
2026-04-08T15:40:07.562Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/cjs/react.production.js',
2026-04-08T15:40:07.563Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/cjs/react-jsx-runtime.production.js',
2026-04-08T15:40:07.563Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/cjs/react-dom-client.production.js',
2026-04-08T15:40:07.563Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/index.js',
2026-04-08T15:40:07.563Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-router/dist/development/chunk-JPUPSTYD.mjs',
2026-04-08T15:40:07.563Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs',
2026-04-08T15:40:07.564Z	    '/opt/buildhome/repo/marketing-site/node_modules/scheduler/index.js',
2026-04-08T15:40:07.564Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/cjs/react-dom.production.js',
2026-04-08T15:40:07.564Z	    '/opt/buildhome/repo/marketing-site/node_modules/scheduler/cjs/scheduler.production.js',
2026-04-08T15:40:07.564Z	    '/opt/buildhome/repo/marketing-site/node_modules/cookie/dist/index.js',
2026-04-08T15:40:07.564Z	    '/opt/buildhome/repo/marketing-site/node_modules/set-cookie-parser/lib/set-cookie.js',
2026-04-08T15:40:07.565Z	    '/opt/buildhome/repo/marketing-site/package.json'
2026-04-08T15:40:07.565Z	  ]
2026-04-08T15:40:07.565Z	}
2026-04-08T15:40:07.638Z	Failed: error occurred while running build command