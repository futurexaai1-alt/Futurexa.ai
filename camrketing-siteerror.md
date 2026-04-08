2026-04-08T17:19:08.438Z	Initializing build environment...
2026-04-08T17:19:08.438Z	Initializing build environment...
2026-04-08T17:20:38.815Z	Success: Finished initializing build environment
2026-04-08T17:20:39.662Z	Cloning repository...
2026-04-08T17:20:41.728Z	Restoring from dependencies cache
2026-04-08T17:20:41.730Z	Restoring from build output cache
2026-04-08T17:20:41.734Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T17:20:41.893Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T17:20:56.613Z	
2026-04-08T17:20:56.614Z	> postinstall
2026-04-08T17:20:56.614Z	> npm run cf-typegen
2026-04-08T17:20:56.615Z	
2026-04-08T17:20:56.873Z	
2026-04-08T17:20:56.873Z	> cf-typegen
2026-04-08T17:20:56.873Z	> wrangler types
2026-04-08T17:20:56.873Z	
2026-04-08T17:20:58.418Z	
2026-04-08T17:20:58.418Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T17:20:58.418Z	─────────────────────────────────────────────
2026-04-08T17:20:58.484Z	Generating project types...
2026-04-08T17:20:58.485Z	
2026-04-08T17:20:58.489Z	declare namespace Cloudflare {
2026-04-08T17:20:58.489Z		interface GlobalProps {
2026-04-08T17:20:58.489Z			mainModule: typeof import("./workers/app");
2026-04-08T17:20:58.490Z		}
2026-04-08T17:20:58.490Z		interface Env {
2026-04-08T17:20:58.490Z			API: Fetcher /* futurexa-api */;
2026-04-08T17:20:58.490Z		}
2026-04-08T17:20:58.490Z	}
2026-04-08T17:20:58.490Z	interface Env extends Cloudflare.Env {}
2026-04-08T17:20:58.490Z	
2026-04-08T17:20:58.493Z	Generating runtime types...
2026-04-08T17:20:58.493Z	
2026-04-08T17:21:02.129Z	Runtime types generated.
2026-04-08T17:21:02.130Z	
2026-04-08T17:21:02.130Z	
2026-04-08T17:21:02.135Z	✨ Types written to worker-configuration.d.ts
2026-04-08T17:21:02.135Z	
2026-04-08T17:21:02.136Z	📖 Read about runtime types
2026-04-08T17:21:02.136Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T17:21:02.136Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T17:21:02.136Z	
2026-04-08T17:21:02.238Z	
2026-04-08T17:21:02.239Z	added 171 packages, and audited 173 packages in 20s
2026-04-08T17:21:02.239Z	
2026-04-08T17:21:02.239Z	31 packages are looking for funding
2026-04-08T17:21:02.239Z	  run `npm fund` for details
2026-04-08T17:21:02.316Z	
2026-04-08T17:21:02.317Z	7 high severity vulnerabilities
2026-04-08T17:21:02.317Z	
2026-04-08T17:21:02.317Z	To address all issues, run:
2026-04-08T17:21:02.317Z	  npm audit fix
2026-04-08T17:21:02.317Z	
2026-04-08T17:21:02.317Z	Run `npm audit` for details.
2026-04-08T17:21:02.602Z	Executing user build command: npm run build
2026-04-08T17:21:02.919Z	
2026-04-08T17:21:02.919Z	> build
2026-04-08T17:21:02.919Z	> react-router build
2026-04-08T17:21:02.919Z	
2026-04-08T17:21:05.075Z	Using Vite Environment API (experimental)
2026-04-08T17:21:05.078Z	vite v7.3.1 building client environment for production...
2026-04-08T17:21:05.129Z	transforming...
2026-04-08T17:21:12.391Z	✓ 2180 modules transformed.
2026-04-08T17:21:12.785Z	rendering chunks...
2026-04-08T17:21:12.843Z	computing gzip size...
2026-04-08T17:21:12.863Z	build/client/.assetsignore                           0.02 kB
2026-04-08T17:21:12.863Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T17:21:12.863Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T17:21:12.863Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T17:21:12.863Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T17:21:12.863Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T17:21:12.864Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T17:21:12.864Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T17:21:12.864Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T17:21:12.864Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T17:21:12.864Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T17:21:12.864Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T17:21:12.867Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T17:21:12.868Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T17:21:12.868Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T17:21:12.868Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T17:21:12.870Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T17:21:12.870Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T17:21:12.870Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T17:21:12.870Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T17:21:12.870Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T17:21:12.870Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T17:21:12.870Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T17:21:12.870Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T17:21:12.870Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T17:21:12.870Z	✓ built in 7.75s
2026-04-08T17:21:12.870Z	vite v7.3.1 building ssr environment for production...
2026-04-08T17:21:12.870Z	transforming...
2026-04-08T17:21:14.145Z	✓ 58 modules transformed.
2026-04-08T17:21:14.258Z	rendering chunks...
2026-04-08T17:21:14.350Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T17:21:14.351Z	build/server/wrangler.json                       1.23 kB
2026-04-08T17:21:14.351Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T17:21:14.351Z	build/server/index.js                            0.13 kB
2026-04-08T17:21:14.351Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T17:21:14.351Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T17:21:14.501Z	Success: Build command completed
2026-04-08T17:21:14.683Z	Executing user deploy command: npm run deploy
2026-04-08T17:21:15.014Z	
2026-04-08T17:21:15.015Z	> deploy
2026-04-08T17:21:15.015Z	> rm -rf .wrangler/deploy && wrangler versions upload
2026-04-08T17:21:15.015Z	
2026-04-08T17:21:15.917Z	
2026-04-08T17:21:15.917Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T17:21:15.918Z	─────────────────────────────────────────────
2026-04-08T17:21:16.727Z	
2026-04-08T17:21:16.795Z	✘ [ERROR] Build failed with 1 error:
2026-04-08T17:21:16.796Z	
2026-04-08T17:21:16.796Z	  ✘ [ERROR] Could not resolve "virtual:react-router/server-build"
2026-04-08T17:21:16.797Z	  
2026-04-08T17:21:16.797Z	      workers/app.ts:13:15:
2026-04-08T17:21:16.797Z	        13 │   () => import("virtual:react-router/server-build"),
2026-04-08T17:21:16.797Z	           ╵                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
2026-04-08T17:21:16.797Z	  
2026-04-08T17:21:16.797Z	    You can mark the path "virtual:react-router/server-build" as external to exclude it from the bundle, which will remove this error and leave the unresolved path in the bundle. You can also add ".catch()" here to handle this failure at run-time instead of bundle-time.
2026-04-08T17:21:16.798Z	  
2026-04-08T17:21:16.798Z	  
2026-04-08T17:21:16.798Z	
2026-04-08T17:21:16.798Z	
2026-04-08T17:21:16.804Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-08_17-21-15_640.log"
2026-04-08T17:21:16.850Z	Failed: error occurred while running deploy command