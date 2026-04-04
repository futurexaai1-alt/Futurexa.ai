2026-04-04T10:20:37.959845Z	Cloning repository...
2026-04-04T10:20:38.952138Z	From https://github.com/futurexaai1-alt/Futurexa.ai
2026-04-04T10:20:38.952443Z	 * branch            862a2771a551ca741df50d37da1e27d60b14ca38 -> FETCH_HEAD
2026-04-04T10:20:38.952523Z	
2026-04-04T10:20:38.999678Z	HEAD is now at 862a277 chore(marketing-site): disable SSR for React Router config
2026-04-04T10:20:39.000006Z	
2026-04-04T10:20:39.041506Z	
2026-04-04T10:20:39.041841Z	Using v2 root directory strategy
2026-04-04T10:20:39.053509Z	Success: Finished cloning repository files
2026-04-04T10:20:40.794978Z	Checking for configuration in a Wrangler configuration file (BETA)
2026-04-04T10:20:40.795582Z	
2026-04-04T10:20:40.79711Z	Found wrangler.json file. Reading build configuration...
2026-04-04T10:20:41.892505Z	A Wrangler configuration file was found but it does not appear to be valid. Did you mean to use wrangler.toml to configure Pages? If so, then make sure the file is valid and contains the `pages_build_output_dir` property. Skipping file and continuing.
2026-04-04T10:20:42.114302Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-04T10:20:42.114677Z	Installing project dependencies: npm clean-install --progress=false
2026-04-04T10:20:53.252192Z	
2026-04-04T10:20:53.25249Z	> postinstall
2026-04-04T10:20:53.252547Z	> npm run cf-typegen
2026-04-04T10:20:53.252583Z	
2026-04-04T10:20:53.466325Z	
2026-04-04T10:20:53.466711Z	> cf-typegen
2026-04-04T10:20:53.466866Z	> wrangler types
2026-04-04T10:20:53.466928Z	
2026-04-04T10:20:54.811047Z	
2026-04-04T10:20:54.811743Z	 ⛅️ wrangler 4.72.0 (update available 4.80.0)
2026-04-04T10:20:54.811908Z	─────────────────────────────────────────────
2026-04-04T10:20:54.862715Z	Generating project types...
2026-04-04T10:20:54.863053Z	
2026-04-04T10:20:54.867003Z	declare namespace Cloudflare {
2026-04-04T10:20:54.867739Z		interface GlobalProps {
2026-04-04T10:20:54.867877Z			mainModule: typeof import("./workers/app");
2026-04-04T10:20:54.867964Z		}
2026-04-04T10:20:54.868272Z		interface Env {
2026-04-04T10:20:54.868421Z			VALUE_FROM_CLOUDFLARE: "Hello from Cloudflare";
2026-04-04T10:20:54.868496Z		}
2026-04-04T10:20:54.868713Z	}
2026-04-04T10:20:54.868798Z	interface Env extends Cloudflare.Env {}
2026-04-04T10:20:54.869032Z	type StringifyValues<EnvType extends Record<string, unknown>> = {
2026-04-04T10:20:54.869128Z		[Binding in keyof EnvType]: EnvType[Binding] extends string ? EnvType[Binding] : string;
2026-04-04T10:20:54.869174Z	};
2026-04-04T10:20:54.869206Z	declare namespace NodeJS {
2026-04-04T10:20:54.86924Z		interface ProcessEnv extends StringifyValues<Pick<Cloudflare.Env, "VALUE_FROM_CLOUDFLARE">> {}
2026-04-04T10:20:54.869269Z	}
2026-04-04T10:20:54.8693Z	
2026-04-04T10:20:54.869341Z	Generating runtime types...
2026-04-04T10:20:54.869373Z	
2026-04-04T10:20:57.369947Z	Runtime types generated.
2026-04-04T10:20:57.370316Z	
2026-04-04T10:20:57.370435Z	
2026-04-04T10:20:57.374507Z	✨ Types written to worker-configuration.d.ts
2026-04-04T10:20:57.374719Z	
2026-04-04T10:20:57.375284Z	📖 Read about runtime types
2026-04-04T10:20:57.375388Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-04T10:20:57.375454Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-04T10:20:57.375511Z	
2026-04-04T10:20:57.455366Z	
2026-04-04T10:20:57.455643Z	added 162 packages, and audited 164 packages in 15s
2026-04-04T10:20:57.455816Z	
2026-04-04T10:20:57.455875Z	29 packages are looking for funding
2026-04-04T10:20:57.455974Z	  run `npm fund` for details
2026-04-04T10:20:57.51944Z	
2026-04-04T10:20:57.519698Z	6 high severity vulnerabilities
2026-04-04T10:20:57.519784Z	
2026-04-04T10:20:57.51983Z	To address all issues, run:
2026-04-04T10:20:57.519867Z	  npm audit fix
2026-04-04T10:20:57.519942Z	
2026-04-04T10:20:57.519973Z	Run `npm audit` for details.
2026-04-04T10:20:57.60501Z	Executing user command: npm run build
2026-04-04T10:20:57.910791Z	
2026-04-04T10:20:57.91114Z	> build
2026-04-04T10:20:57.911235Z	> react-router build
2026-04-04T10:20:57.911298Z	
2026-04-04T10:20:59.62381Z	Using Vite Environment API (experimental)
2026-04-04T10:20:59.624627Z	[36mvite v7.3.1 [32mbuilding client environment for production...[36m[39m
2026-04-04T10:20:59.663661Z	transforming...
2026-04-04T10:21:00.348051Z	[32m✓[39m 50 modules transformed.
2026-04-04T10:21:00.592685Z	✘ [ERROR] The build was canceled
2026-04-04T10:21:00.592967Z	
2026-04-04T10:21:00.631814Z	[31m✗[39m Build failed in 986ms
2026-04-04T10:21:00.632036Z	[31m[react-router:route-exports] SPA Mode: 1 invalid route export(s) in `routes/home.tsx`: `loader`. See https://reactrouter.com/how-to/spa for more information.[39m
2026-04-04T10:21:00.63211Z	file: [36m/opt/buildhome/repo/marketing-site/app/routes/home.tsx[39m
2026-04-04T10:21:00.632165Z	    at Object.transform (/opt/buildhome/repo/marketing-site/node_modules/@react-router/dev/dist/vite.js:4219:19)
2026-04-04T10:21:00.632212Z	    at Object.handler (file:///opt/buildhome/repo/marketing-site/node_modules/vite/dist/node/chunks/config.js:33730:13)
2026-04-04T10:21:00.632247Z	    at file:///opt/buildhome/repo/marketing-site/node_modules/rollup/dist/es/shared/node-entry.js:22571:40
2026-04-04T10:21:00.63318Z	    at processTicksAndRejections (node:internal/process/task_queues:105:5) {
2026-04-04T10:21:00.633444Z	  code: 'PLUGIN_ERROR',
2026-04-04T10:21:00.633493Z	  plugin: 'react-router:route-exports',
2026-04-04T10:21:00.633532Z	  hook: 'transform',
2026-04-04T10:21:00.633568Z	  id: '/opt/buildhome/repo/marketing-site/app/routes/home.tsx',
2026-04-04T10:21:00.633612Z	  watchFiles: [
2026-04-04T10:21:00.633647Z	    '/opt/buildhome/repo/marketing-site/app/routes/home.tsx',
2026-04-04T10:21:00.633674Z	    '/opt/buildhome/repo/marketing-site/app/routes/services.tsx',
2026-04-04T10:21:00.633702Z	    '/opt/buildhome/repo/marketing-site/app/root.tsx',
2026-04-04T10:21:00.633739Z	    '/opt/buildhome/repo/marketing-site/app/routes/service-detail.tsx',
2026-04-04T10:21:00.633771Z	    '/opt/buildhome/repo/marketing-site/app/routes/case-studies.tsx',
2026-04-04T10:21:00.633803Z	    '/opt/buildhome/repo/marketing-site/app/routes/case-study-detail.tsx',
2026-04-04T10:21:00.633834Z	    '/opt/buildhome/repo/marketing-site/app/routes/about.tsx',
2026-04-04T10:21:00.633897Z	    '/opt/buildhome/repo/marketing-site/app/routes/blog.tsx',
2026-04-04T10:21:00.633931Z	    '/opt/buildhome/repo/marketing-site/node_modules/@react-router/dev/dist/config/defaults/entry.client.tsx',
2026-04-04T10:21:00.633968Z	    '/opt/buildhome/repo/marketing-site/app/routes/pricing.tsx',
2026-04-04T10:21:00.633999Z	    '/opt/buildhome/repo/marketing-site/app/routes/contact.tsx',
2026-04-04T10:21:00.634028Z	    '/opt/buildhome/repo/marketing-site/app/routes/blog-post.tsx',
2026-04-04T10:21:00.634075Z	    '/opt/buildhome/repo/marketing-site/app/routes/resources.tsx',
2026-04-04T10:21:00.634132Z	    '/opt/buildhome/repo/marketing-site/app/routes/industries.tsx',
2026-04-04T10:21:00.634168Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/jsx-runtime.js',
2026-04-04T10:21:00.634205Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/index.js',
2026-04-04T10:21:00.634238Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/client.js',
2026-04-04T10:21:00.634277Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-router/dist/development/dom-export.mjs',
2026-04-04T10:21:00.634318Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/cjs/react-jsx-runtime.production.js',
2026-04-04T10:21:00.63435Z	    '/opt/buildhome/repo/marketing-site/node_modules/react/cjs/react.production.js',
2026-04-04T10:21:00.634387Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/cjs/react-dom-client.production.js',
2026-04-04T10:21:00.634424Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/index.js',
2026-04-04T10:21:00.63451Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-router/dist/development/chunk-JPUPSTYD.mjs',
2026-04-04T10:21:00.634557Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-router/dist/development/chunk-LFPYN7LY.mjs',
2026-04-04T10:21:00.634598Z	    '/opt/buildhome/repo/marketing-site/node_modules/scheduler/index.js',
2026-04-04T10:21:00.634643Z	    '/opt/buildhome/repo/marketing-site/node_modules/react-dom/cjs/react-dom.production.js',
2026-04-04T10:21:00.634673Z	    '/opt/buildhome/repo/marketing-site/node_modules/scheduler/cjs/scheduler.production.js',
2026-04-04T10:21:00.634702Z	    '/opt/buildhome/repo/marketing-site/package.json',
2026-04-04T10:21:00.634729Z	    '/opt/buildhome/repo/marketing-site/node_modules/cookie/dist/index.js',
2026-04-04T10:21:00.634765Z	    '/opt/buildhome/repo/marketing-site/node_modules/set-cookie-parser/lib/set-cookie.js'
2026-04-04T10:21:00.63481Z	  ]
2026-04-04T10:21:00.634853Z	}
2026-04-04T10:21:00.682919Z	Failed: Error while executing user command. Exited with error code: 1
2026-04-04T10:21:00.68914Z	Failed: build command exited with code: 1
2026-04-04T10:21:01.38351Z	Failed: error occurred while running build command