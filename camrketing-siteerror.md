2026-04-08T16:56:05.421Z	Initializing build environment...
2026-04-08T16:56:58.248Z	Success: Finished initializing build environment
2026-04-08T16:56:59.510Z	Cloning repository...
2026-04-08T16:57:03.559Z	Restoring from dependencies cache
2026-04-08T16:57:03.563Z	Restoring from build output cache
2026-04-08T16:57:03.568Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T16:57:03.904Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T16:57:30.854Z	
2026-04-08T16:57:30.854Z	> postinstall
2026-04-08T16:57:30.854Z	> npm run cf-typegen
2026-04-08T16:57:30.854Z	
2026-04-08T16:57:31.249Z	
2026-04-08T16:57:31.249Z	> cf-typegen
2026-04-08T16:57:31.249Z	> wrangler types
2026-04-08T16:57:31.249Z	
2026-04-08T16:57:33.864Z	
2026-04-08T16:57:33.865Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T16:57:33.865Z	─────────────────────────────────────────────
2026-04-08T16:57:33.965Z	Generating project types...
2026-04-08T16:57:33.967Z	
2026-04-08T16:57:33.977Z	declare namespace Cloudflare {
2026-04-08T16:57:33.978Z		interface GlobalProps {
2026-04-08T16:57:33.978Z			mainModule: typeof import("./workers/app");
2026-04-08T16:57:33.978Z		}
2026-04-08T16:57:33.978Z		interface Env {
2026-04-08T16:57:33.979Z			API: Fetcher /* futurexa-api */;
2026-04-08T16:57:33.979Z		}
2026-04-08T16:57:33.979Z	}
2026-04-08T16:57:33.979Z	interface Env extends Cloudflare.Env {}
2026-04-08T16:57:33.979Z	
2026-04-08T16:57:33.980Z	Generating runtime types...
2026-04-08T16:57:33.980Z	
2026-04-08T16:57:40.470Z	Runtime types generated.
2026-04-08T16:57:40.470Z	
2026-04-08T16:57:40.470Z	
2026-04-08T16:57:40.475Z	✨ Types written to worker-configuration.d.ts
2026-04-08T16:57:40.475Z	
2026-04-08T16:57:40.476Z	📖 Read about runtime types
2026-04-08T16:57:40.477Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T16:57:40.477Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T16:57:40.477Z	
2026-04-08T16:57:40.639Z	
2026-04-08T16:57:40.640Z	added 171 packages, and audited 173 packages in 35s
2026-04-08T16:57:40.641Z	
2026-04-08T16:57:40.641Z	31 packages are looking for funding
2026-04-08T16:57:40.641Z	  run `npm fund` for details
2026-04-08T16:57:40.749Z	
2026-04-08T16:57:40.750Z	7 high severity vulnerabilities
2026-04-08T16:57:40.750Z	
2026-04-08T16:57:40.750Z	To address all issues, run:
2026-04-08T16:57:40.751Z	  npm audit fix
2026-04-08T16:57:40.751Z	
2026-04-08T16:57:40.751Z	Run `npm audit` for details.
2026-04-08T16:57:41.244Z	Executing user build command: npm run build
2026-04-08T16:57:41.774Z	
2026-04-08T16:57:41.776Z	> build
2026-04-08T16:57:41.779Z	> react-router build
2026-04-08T16:57:41.779Z	
2026-04-08T16:57:46.668Z	Using Vite Environment API (experimental)
2026-04-08T16:57:46.669Z	vite v7.3.1 building client environment for production...
2026-04-08T16:57:46.752Z	transforming...
2026-04-08T16:57:56.352Z	✓ 2180 modules transformed.
2026-04-08T16:57:56.716Z	rendering chunks...
2026-04-08T16:57:56.833Z	computing gzip size...
2026-04-08T16:57:56.873Z	build/client/.assetsignore                           0.02 kB
2026-04-08T16:57:56.875Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T16:57:56.875Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T16:57:56.875Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T16:57:56.876Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T16:57:56.877Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T16:57:56.879Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T16:57:56.879Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T16:57:56.879Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T16:57:56.879Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T16:57:56.879Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T16:57:56.879Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T16:57:56.879Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T16:57:56.879Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T16:57:56.879Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T16:57:56.879Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T16:57:56.879Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T16:57:56.879Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T16:57:56.879Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T16:57:56.879Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T16:57:56.879Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T16:57:56.880Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T16:57:56.883Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T16:57:56.883Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T16:57:56.883Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T16:57:56.884Z	✓ built in 10.17s
2026-04-08T16:57:56.884Z	vite v7.3.1 building ssr environment for production...
2026-04-08T16:57:56.894Z	transforming...
2026-04-08T16:57:58.821Z	✓ 58 modules transformed.
2026-04-08T16:57:58.933Z	rendering chunks...
2026-04-08T16:57:59.032Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T16:57:59.032Z	build/server/wrangler.json                       1.24 kB
2026-04-08T16:57:59.033Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T16:57:59.034Z	build/server/index.js                            0.13 kB
2026-04-08T16:57:59.034Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T16:57:59.034Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T16:57:59.255Z	Success: Build command completed
2026-04-08T16:57:59.469Z	Executing user deploy command: npm run deploy
2026-04-08T16:57:59.999Z	
2026-04-08T16:57:59.999Z	> deploy
2026-04-08T16:57:59.999Z	> npm run build && rm -rf .wrangler/deploy && wrangler deploy
2026-04-08T16:57:59.999Z	
2026-04-08T16:58:00.283Z	
2026-04-08T16:58:00.284Z	> build
2026-04-08T16:58:00.285Z	> react-router build
2026-04-08T16:58:00.285Z	
2026-04-08T16:58:03.298Z	Using Vite Environment API (experimental)
2026-04-08T16:58:03.310Z	vite v7.3.1 building client environment for production...
2026-04-08T16:58:03.406Z	transforming...
2026-04-08T16:58:13.663Z	✓ 2180 modules transformed.
2026-04-08T16:58:14.245Z	rendering chunks...
2026-04-08T16:58:14.328Z	computing gzip size...
2026-04-08T16:58:14.356Z	build/client/.assetsignore                           0.02 kB
2026-04-08T16:58:14.356Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T16:58:14.356Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T16:58:14.356Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T16:58:14.356Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T16:58:14.356Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T16:58:14.356Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T16:58:14.357Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T16:58:14.357Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T16:58:14.357Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T16:58:14.357Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T16:58:14.357Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T16:58:14.357Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T16:58:14.357Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T16:58:14.357Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T16:58:14.357Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T16:58:14.357Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T16:58:14.359Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T16:58:14.360Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T16:58:14.360Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T16:58:14.360Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T16:58:14.360Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T16:58:14.362Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T16:58:14.362Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T16:58:14.362Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T16:58:14.362Z	✓ built in 11.00s
2026-04-08T16:58:14.362Z	vite v7.3.1 building ssr environment for production...
2026-04-08T16:58:14.370Z	transforming...
2026-04-08T16:58:16.221Z	✓ 58 modules transformed.
2026-04-08T16:58:16.332Z	rendering chunks...
2026-04-08T16:58:16.522Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T16:58:16.523Z	build/server/wrangler.json                       1.24 kB
2026-04-08T16:58:16.527Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T16:58:16.528Z	build/server/index.js                            0.13 kB
2026-04-08T16:58:16.528Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T16:58:16.528Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T16:58:18.152Z	
2026-04-08T16:58:18.152Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T16:58:18.152Z	─────────────────────────────────────────────
2026-04-08T16:58:18.192Z	
2026-04-08T16:58:18.193Z	Cloudflare collects anonymous telemetry about your usage of Wrangler. Learn more at https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler/telemetry.md
2026-04-08T16:58:18.504Z	▲ [WARNING] Failed to match Worker name. Your config file is using the Worker name "marketing-site", but the CI system expected "marketingsite". Overriding using the CI provided Worker name. Workers Builds connected builds will attempt to open a pull request to resolve this config name mismatch.
2026-04-08T16:58:18.505Z	
2026-04-08T16:58:18.505Z	
2026-04-08T16:58:19.643Z	
2026-04-08T16:58:19.650Z	✘ [ERROR] Build failed with 1 error:
2026-04-08T16:58:19.650Z	
2026-04-08T16:58:19.650Z	  ✘ [ERROR] Could not resolve "virtual:react-router/server-build"
2026-04-08T16:58:19.655Z	  
2026-04-08T16:58:19.655Z	      workers/app.ts:13:15:
2026-04-08T16:58:19.656Z	        13 │   () => import("virtual:react-router/server-build"),
2026-04-08T16:58:19.656Z	           ╵                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
2026-04-08T16:58:19.656Z	  
2026-04-08T16:58:19.656Z	    You can mark the path "virtual:react-router/server-build" as external to exclude it from the bundle, which will remove this error and leave the unresolved path in the bundle. You can also add ".catch()" here to handle this failure at run-time instead of bundle-time.
2026-04-08T16:58:19.656Z	  
2026-04-08T16:58:19.656Z	  
2026-04-08T16:58:19.656Z	
2026-04-08T16:58:19.656Z	
2026-04-08T16:58:19.672Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-08_16-58-17_751.log"
2026-04-08T16:58:19.776Z	Failed: error occurred while running deploy command