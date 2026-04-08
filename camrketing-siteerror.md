2026-04-08T17:05:14.551Z	Initializing build environment...
2026-04-08T17:05:14.551Z	Initializing build environment...
2026-04-08T17:07:57.367Z	Initializing build environment...
2026-04-08T17:07:59.248Z	Success: Finished initializing build environment
2026-04-08T17:08:01.083Z	Cloning repository...
2026-04-08T17:08:03.246Z	Restoring from dependencies cache
2026-04-08T17:08:03.249Z	Restoring from build output cache
2026-04-08T17:08:03.253Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T17:08:03.367Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T17:08:20.516Z	
2026-04-08T17:08:20.516Z	> postinstall
2026-04-08T17:08:20.516Z	> npm run cf-typegen
2026-04-08T17:08:20.516Z	
2026-04-08T17:08:20.755Z	
2026-04-08T17:08:20.755Z	> cf-typegen
2026-04-08T17:08:20.755Z	> wrangler types
2026-04-08T17:08:20.756Z	
2026-04-08T17:08:22.486Z	
2026-04-08T17:08:22.489Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T17:08:22.489Z	─────────────────────────────────────────────
2026-04-08T17:08:22.553Z	Generating project types...
2026-04-08T17:08:22.553Z	
2026-04-08T17:08:22.562Z	declare namespace Cloudflare {
2026-04-08T17:08:22.562Z		interface GlobalProps {
2026-04-08T17:08:22.562Z			mainModule: typeof import("./workers/app");
2026-04-08T17:08:22.562Z		}
2026-04-08T17:08:22.562Z		interface Env {
2026-04-08T17:08:22.563Z			API: Fetcher /* futurexa-api */;
2026-04-08T17:08:22.563Z		}
2026-04-08T17:08:22.563Z	}
2026-04-08T17:08:22.563Z	interface Env extends Cloudflare.Env {}
2026-04-08T17:08:22.563Z	
2026-04-08T17:08:22.568Z	Generating runtime types...
2026-04-08T17:08:22.568Z	
2026-04-08T17:08:26.955Z	Runtime types generated.
2026-04-08T17:08:26.955Z	
2026-04-08T17:08:26.955Z	
2026-04-08T17:08:26.961Z	✨ Types written to worker-configuration.d.ts
2026-04-08T17:08:26.961Z	
2026-04-08T17:08:26.962Z	📖 Read about runtime types
2026-04-08T17:08:26.962Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T17:08:26.962Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T17:08:26.962Z	
2026-04-08T17:08:27.084Z	
2026-04-08T17:08:27.085Z	added 171 packages, and audited 173 packages in 23s
2026-04-08T17:08:27.085Z	
2026-04-08T17:08:27.085Z	31 packages are looking for funding
2026-04-08T17:08:27.085Z	  run `npm fund` for details
2026-04-08T17:08:27.193Z	
2026-04-08T17:08:27.193Z	7 high severity vulnerabilities
2026-04-08T17:08:27.194Z	
2026-04-08T17:08:27.194Z	To address all issues, run:
2026-04-08T17:08:27.194Z	  npm audit fix
2026-04-08T17:08:27.194Z	
2026-04-08T17:08:27.194Z	Run `npm audit` for details.
2026-04-08T17:08:27.606Z	Executing user build command: npm run build
2026-04-08T17:08:27.943Z	
2026-04-08T17:08:27.943Z	> build
2026-04-08T17:08:27.944Z	> react-router build
2026-04-08T17:08:27.944Z	
2026-04-08T17:08:30.261Z	Using Vite Environment API (experimental)
2026-04-08T17:08:30.263Z	vite v7.3.1 building client environment for production...
2026-04-08T17:08:30.334Z	transforming...
2026-04-08T17:08:37.640Z	✓ 2180 modules transformed.
2026-04-08T17:08:37.965Z	rendering chunks...
2026-04-08T17:08:38.088Z	computing gzip size...
2026-04-08T17:08:39.477Z	build/client/.assetsignore                           0.02 kB
2026-04-08T17:08:39.478Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T17:08:39.478Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T17:08:39.478Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T17:08:39.478Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T17:08:39.478Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T17:08:39.478Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T17:08:39.478Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T17:08:39.478Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T17:08:39.478Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T17:08:39.478Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T17:08:39.478Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T17:08:39.478Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T17:08:39.480Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T17:08:39.480Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T17:08:39.481Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T17:08:39.481Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T17:08:39.482Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T17:08:39.482Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T17:08:39.482Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T17:08:39.486Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T17:08:39.486Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T17:08:39.486Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T17:08:39.486Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T17:08:39.486Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T17:08:39.486Z	✓ built in 9.18s
2026-04-08T17:08:39.487Z	vite v7.3.1 building ssr environment for production...
2026-04-08T17:08:39.488Z	transforming...
2026-04-08T17:08:40.886Z	✓ 58 modules transformed.
2026-04-08T17:08:40.994Z	rendering chunks...
2026-04-08T17:08:41.100Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T17:08:41.101Z	build/server/wrangler.json                       1.24 kB
2026-04-08T17:08:41.101Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T17:08:41.101Z	build/server/index.js                            0.13 kB
2026-04-08T17:08:41.101Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T17:08:41.101Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T17:08:41.252Z	Success: Build command completed
2026-04-08T17:08:41.509Z	Executing user deploy command: npm run deploy
2026-04-08T17:08:41.854Z	
2026-04-08T17:08:41.854Z	> deploy
2026-04-08T17:08:41.854Z	> rm -rf .wrangler/deploy && wrangler deploy --config wrangler.jsonc
2026-04-08T17:08:41.854Z	
2026-04-08T17:08:42.824Z	
2026-04-08T17:08:42.824Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T17:08:42.824Z	─────────────────────────────────────────────
2026-04-08T17:08:42.828Z	
2026-04-08T17:08:42.828Z	Cloudflare collects anonymous telemetry about your usage of Wrangler. Learn more at https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler/telemetry.md
2026-04-08T17:08:43.067Z	▲ [WARNING] Failed to match Worker name. Your config file is using the Worker name "marketing-site", but the CI system expected "marketingsite". Overriding using the CI provided Worker name. Workers Builds connected builds will attempt to open a pull request to resolve this config name mismatch.
2026-04-08T17:08:43.068Z	
2026-04-08T17:08:43.068Z	
2026-04-08T17:08:44.049Z	
2026-04-08T17:08:44.052Z	✘ [ERROR] Build failed with 1 error:
2026-04-08T17:08:44.052Z	
2026-04-08T17:08:44.052Z	  ✘ [ERROR] Could not resolve "virtual:react-router/server-build"
2026-04-08T17:08:44.053Z	  
2026-04-08T17:08:44.053Z	      workers/app.ts:13:15:
2026-04-08T17:08:44.054Z	        13 │   () => import("virtual:react-router/server-build"),
2026-04-08T17:08:44.054Z	           ╵                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
2026-04-08T17:08:44.054Z	  
2026-04-08T17:08:44.054Z	    You can mark the path "virtual:react-router/server-build" as external to exclude it from the bundle, which will remove this error and leave the unresolved path in the bundle. You can also add ".catch()" here to handle this failure at run-time instead of bundle-time.
2026-04-08T17:08:44.054Z	  
2026-04-08T17:08:44.054Z	  
2026-04-08T17:08:44.054Z	
2026-04-08T17:08:44.054Z	
2026-04-08T17:08:44.069Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-08_17-08-42_535.log"
2026-04-08T17:08:44.124Z	Failed: error occurred while running deploy command