2026-04-08T15:25:22.662Z	Initializing build environment...
2026-04-08T15:26:50.551Z	Success: Finished initializing build environment
2026-04-08T15:26:51.240Z	Cloning repository...
2026-04-08T15:26:52.564Z	Restoring from dependencies cache
2026-04-08T15:26:52.566Z	Restoring from build output cache
2026-04-08T15:26:52.570Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T15:26:52.657Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T15:25:22.662Z	Initializing build environment...
2026-04-08T15:26:50.551Z	Success: Finished initializing build environment
2026-04-08T15:26:51.240Z	Cloning repository...
2026-04-08T15:26:52.564Z	Restoring from dependencies cache
2026-04-08T15:26:52.566Z	Restoring from build output cache
2026-04-08T15:26:52.570Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T15:26:52.657Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T15:27:07.391Z	
2026-04-08T15:27:07.392Z	> postinstall
2026-04-08T15:27:07.392Z	> npm run cf-typegen
2026-04-08T15:27:07.392Z	
2026-04-08T15:27:07.627Z	
2026-04-08T15:27:07.627Z	> cf-typegen
2026-04-08T15:27:07.628Z	> wrangler types
2026-04-08T15:27:07.628Z	
2026-04-08T15:27:09.331Z	
2026-04-08T15:27:09.331Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T15:27:09.331Z	─────────────────────────────────────────────
2026-04-08T15:27:09.383Z	Generating project types...
2026-04-08T15:27:09.383Z	
2026-04-08T15:27:09.390Z	declare namespace Cloudflare {
2026-04-08T15:27:09.391Z		interface GlobalProps {
2026-04-08T15:27:09.391Z			mainModule: typeof import("./workers/app");
2026-04-08T15:27:09.391Z		}
2026-04-08T15:27:09.391Z		interface Env {
2026-04-08T15:27:09.391Z			VALUE_FROM_CLOUDFLARE: "Hello from Cloudflare";
2026-04-08T15:27:09.392Z		}
2026-04-08T15:27:09.392Z	}
2026-04-08T15:27:09.392Z	interface Env extends Cloudflare.Env {}
2026-04-08T15:27:09.393Z	type StringifyValues<EnvType extends Record<string, unknown>> = {
2026-04-08T15:27:09.394Z		[Binding in keyof EnvType]: EnvType[Binding] extends string ? EnvType[Binding] : string;
2026-04-08T15:27:09.394Z	};
2026-04-08T15:27:09.394Z	declare namespace NodeJS {
2026-04-08T15:27:09.394Z		interface ProcessEnv extends StringifyValues<Pick<Cloudflare.Env, "VALUE_FROM_CLOUDFLARE">> {}
2026-04-08T15:27:09.394Z	}
2026-04-08T15:27:09.394Z	
2026-04-08T15:27:09.399Z	Generating runtime types...
2026-04-08T15:27:09.399Z	
2026-04-08T15:27:13.131Z	Runtime types generated.
2026-04-08T15:27:13.132Z	
2026-04-08T15:27:13.133Z	
2026-04-08T15:27:13.137Z	✨ Types written to worker-configuration.d.ts
2026-04-08T15:27:13.138Z	
2026-04-08T15:27:13.139Z	📖 Read about runtime types
2026-04-08T15:27:13.139Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T15:27:13.139Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T15:27:13.139Z	
2026-04-08T15:27:13.270Z	
2026-04-08T15:27:13.271Z	added 171 packages, and audited 173 packages in 20s
2026-04-08T15:27:13.271Z	
2026-04-08T15:27:13.271Z	31 packages are looking for funding
2026-04-08T15:27:13.271Z	  run `npm fund` for details
2026-04-08T15:27:13.356Z	
2026-04-08T15:27:13.356Z	7 high severity vulnerabilities
2026-04-08T15:27:13.356Z	
2026-04-08T15:27:13.357Z	To address all issues, run:
2026-04-08T15:27:13.357Z	  npm audit fix
2026-04-08T15:27:13.357Z	
2026-04-08T15:27:13.357Z	Run `npm audit` for details.
2026-04-08T15:27:14.196Z	Executing user build command: npm run build
2026-04-08T15:27:14.535Z	
2026-04-08T15:27:14.536Z	> build
2026-04-08T15:27:14.536Z	> react-router build
2026-04-08T15:27:14.536Z	
2026-04-08T15:27:16.744Z	Using Vite Environment API (experimental)
2026-04-08T15:27:16.745Z	vite v7.3.1 building client environment for production...
2026-04-08T15:27:16.799Z	transforming...
2026-04-08T15:27:17.942Z	✓ 49 modules transformed.
2026-04-08T15:27:18.405Z	✘ [ERROR] The build was canceled
2026-04-08T15:27:18.405Z	
2026-04-08T15:27:18.477Z	✗ Build failed in 1.70s
2026-04-08T15:27:18.480Z	[react-router:route-exports] SPA Mode: 1 invalid route export(s) in `routes/api.hero-media.ts`: `loader`. See https://reactrouter.com/how-to/spa for more information.
2026-04-08T15:27:18.480Z	file: /opt/buildhome/repo/marketing-site/app/routes/api.hero-media.ts
2026-04-08T15:27:18.480Z	    at Object.transform (/opt/buildhome/repo/marketing-site/node_modules/@react-router/dev/dist/vite.js:4219:19)
2026-04-08T15:27:18.481Z	    at Object.handler (file:///opt/buildhome/repo/marketing-site/node_modules/vite/dist/node/chunks/config.js:33730:13)
2026-04-08T15:27:18.481Z	    at file:///opt/buildhome/repo/marketing-site/node_modules/rollup/dist/es/shared/node-entry.js:22571:40
2026-04-08T15:27:18.481Z	    at processTicksAndRejections (node:internal/process/task_queues:105:5) {
2026-04-08T15:27:18.481Z	  code: 'PLUGIN_ERROR',
2026-04-08T15:27:18.481Z	  plugin: 'react-router:route-exports',
2026-04-08T15:27:18.481Z	  hook: 'transform',
2026-04-08T15:27:18.481Z	  id: '/opt/buildhome/repo/marketing-site/app/routes/api.hero-media.ts',
2026-04-08T15:27:18.481Z	  watchFiles: [
2026-04-08T15:27:18.481Z	    '/opt/buildhome/repo/marketing-site/node_modules/@react-router/dev/dist/config/defaults/entry.client.tsx',
2026-04-08T15:27:18.481Z	    '/opt/buildhome/repo/marketing-site/app/routes/home.tsx',
2026-04-08T15:27:18.481Z	    '/opt/buildhome/repo/marketing-site/app/routes/services.tsx',
2026-04-08T15:27:18.481Z	    '/opt/buildhome/repo/marketing-site/app/routes/service-detail.tsx',
2026-04-08T15:27:18.483Z	    '/opt/buildhome/repo/marketing-site/app/routes/case-studies.tsx',
2026-04-08T15:27:18.486Z	    '/opt/buildhome/repo/marketing-site/app/routes/case-study-detail.tsx',
2026-04-08T15:27:18.486Z	    '/opt/buildhome/repo/marketing-site/app/root.tsx',
2026-04-08T15:27:18.486Z	    '/opt/buildhome/repo/marketing-site/app/routes/about.tsx',
2026-04-08T15:27:18.486Z	    '/opt/buildhome/repo/marketing-site/app/routes/blog.tsx',
2026-04-08T15:27:18.486Z	    '/opt/buildhome/repo/marketing-site/app/routes/blog-post.tsx',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/app/routes/pricing.tsx',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/app/routes/contact.tsx',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/app/routes/resources.tsx',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/app/routes/privacy.tsx',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/app/routes/industries.tsx',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/app/routes/terms.tsx',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/app/routes/api.hero-media.ts',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/index.js',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/client.js',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-router/dist/development/dom-export.mjs',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/jsx-runtime.js',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/cjs/react.production.js',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/cjs/react-jsx-runtime.production.js',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/cjs/react-dom-client.production.js',
2026-04-08T15:27:18.487Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs',
2026-04-08T15:27:18.491Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/index.js',
2026-04-08T15:27:18.491Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-router/dist/development/chunk-JPUPSTYD.mjs',
2026-04-08T15:27:18.491Z	    '/opt/buildhome/repo/marketing-site/node_modules/scheduler/index.js',
2026-04-08T15:27:18.491Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/cjs/react-dom.production.js',
2026-04-08T15:27:18.491Z	    '/opt/buildhome/repo/marketing-site/node_modules/scheduler/cjs/scheduler.production.js',
2026-04-08T15:27:18.491Z	    '/opt/buildhome/repo/marketing-site/package.json',
2026-04-08T15:27:18.491Z	    '/opt/buildhome/repo/marketing-site/node_modules/cookie/dist/index.js',
2026-04-08T15:27:18.492Z	    '/opt/buildhome/repo/marketing-site/node_modules/set-cookie-parser/lib/set-cookie.js'
2026-04-08T15:27:18.492Z	  ]
2026-04-08T15:27:18.492Z	}
2026-04-08T15:27:18.549Z	Failed: error occurred while running build command