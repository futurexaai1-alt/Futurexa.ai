2026-04-08T18:06:07.346Z	Initializing build environment...
2026-04-08T18:06:07.346Z	Initializing build environment...
2026-04-08T18:07:58.149Z	Success: Finished initializing build environment
2026-04-08T18:07:59.360Z	Cloning repository...
2026-04-08T18:08:01.477Z	Restoring from dependencies cache
2026-04-08T18:08:01.479Z	Restoring from build output cache
2026-04-08T18:08:01.483Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T18:08:01.678Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T18:08:15.696Z	
2026-04-08T18:08:15.699Z	> postinstall
2026-04-08T18:08:15.699Z	> npm run cf-typegen
2026-04-08T18:08:15.699Z	
2026-04-08T18:08:15.910Z	
2026-04-08T18:08:15.910Z	> cf-typegen
2026-04-08T18:08:15.911Z	> wrangler types
2026-04-08T18:08:15.911Z	
2026-04-08T18:08:17.418Z	
2026-04-08T18:08:17.419Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T18:08:17.419Z	─────────────────────────────────────────────
2026-04-08T18:08:17.484Z	Generating project types...
2026-04-08T18:08:17.486Z	
2026-04-08T18:08:17.489Z	declare namespace Cloudflare {
2026-04-08T18:08:17.489Z		interface GlobalProps {
2026-04-08T18:08:17.489Z			mainModule: typeof import("./workers/app");
2026-04-08T18:08:17.490Z		}
2026-04-08T18:08:17.493Z		interface Env {
2026-04-08T18:08:17.493Z			API: Fetcher /* futurexa-api */;
2026-04-08T18:08:17.493Z		}
2026-04-08T18:08:17.493Z	}
2026-04-08T18:08:17.493Z	interface Env extends Cloudflare.Env {}
2026-04-08T18:08:17.493Z	
2026-04-08T18:08:17.494Z	Generating runtime types...
2026-04-08T18:08:17.494Z	
2026-04-08T18:08:20.984Z	Runtime types generated.
2026-04-08T18:08:20.984Z	
2026-04-08T18:08:20.984Z	
2026-04-08T18:08:20.988Z	✨ Types written to worker-configuration.d.ts
2026-04-08T18:08:20.988Z	
2026-04-08T18:08:20.989Z	📖 Read about runtime types
2026-04-08T18:08:20.989Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T18:08:20.989Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T18:08:20.989Z	
2026-04-08T18:08:21.082Z	
2026-04-08T18:08:21.082Z	added 171 packages, and audited 173 packages in 19s
2026-04-08T18:08:21.082Z	
2026-04-08T18:08:21.083Z	31 packages are looking for funding
2026-04-08T18:08:21.083Z	  run `npm fund` for details
2026-04-08T18:08:21.162Z	
2026-04-08T18:08:21.162Z	7 high severity vulnerabilities
2026-04-08T18:08:21.163Z	
2026-04-08T18:08:21.163Z	To address all issues, run:
2026-04-08T18:08:21.163Z	  npm audit fix
2026-04-08T18:08:21.163Z	
2026-04-08T18:08:21.163Z	Run `npm audit` for details.
2026-04-08T18:08:21.431Z	Executing user build command: npm run build
2026-04-08T18:08:21.723Z	
2026-04-08T18:08:21.723Z	> build
2026-04-08T18:08:21.724Z	> react-router build
2026-04-08T18:08:21.724Z	
2026-04-08T18:08:24.159Z	Using Vite Environment API (experimental)
2026-04-08T18:08:24.160Z	vite v7.3.1 building client environment for production...
2026-04-08T18:08:24.205Z	transforming...
2026-04-08T18:08:30.658Z	✓ 2180 modules transformed.
2026-04-08T18:08:30.943Z	rendering chunks...
2026-04-08T18:08:31.083Z	computing gzip size...
2026-04-08T18:08:31.120Z	build/client/.assetsignore                           0.02 kB
2026-04-08T18:08:31.120Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T18:08:31.121Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T18:08:31.121Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T18:08:31.122Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T18:08:31.122Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T18:08:31.122Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T18:08:31.122Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T18:08:31.122Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T18:08:31.122Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T18:08:31.122Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T18:08:31.122Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T18:08:31.122Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T18:08:31.123Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T18:08:31.123Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T18:08:31.123Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T18:08:31.123Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T18:08:31.123Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T18:08:31.123Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T18:08:31.123Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T18:08:31.123Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T18:08:31.125Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T18:08:31.125Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T18:08:31.125Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T18:08:31.125Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T18:08:31.125Z	✓ built in 6.93s
2026-04-08T18:08:31.125Z	vite v7.3.1 building ssr environment for production...
2026-04-08T18:08:31.129Z	transforming...
2026-04-08T18:08:32.338Z	✓ 58 modules transformed.
2026-04-08T18:08:32.453Z	rendering chunks...
2026-04-08T18:08:32.527Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T18:08:32.529Z	build/server/wrangler.json                       1.23 kB
2026-04-08T18:08:32.529Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T18:08:32.529Z	build/server/index.js                            0.13 kB
2026-04-08T18:08:32.529Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T18:08:32.530Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T18:08:32.668Z	Success: Build command completed
2026-04-08T18:08:33.251Z	Executing user deploy command: npm run deploy
2026-04-08T18:08:33.549Z	
2026-04-08T18:08:33.550Z	> deploy
2026-04-08T18:08:33.550Z	> npm run build && rm -rf .wrangler/deploy && wrangler deploy
2026-04-08T18:08:33.550Z	
2026-04-08T18:08:33.728Z	
2026-04-08T18:08:33.728Z	> build
2026-04-08T18:08:33.728Z	> react-router build
2026-04-08T18:08:33.728Z	
2026-04-08T18:08:35.671Z	Using Vite Environment API (experimental)
2026-04-08T18:08:35.675Z	vite v7.3.1 building client environment for production...
2026-04-08T18:08:35.732Z	transforming...
2026-04-08T18:08:42.801Z	✓ 2180 modules transformed.
2026-04-08T18:08:43.136Z	rendering chunks...
2026-04-08T18:08:43.246Z	computing gzip size...
2026-04-08T18:08:43.263Z	build/client/.assetsignore                           0.02 kB
2026-04-08T18:08:43.264Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T18:08:43.264Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T18:08:43.264Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T18:08:43.264Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T18:08:43.264Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T18:08:43.264Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T18:08:43.264Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T18:08:43.264Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T18:08:43.264Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T18:08:43.264Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T18:08:43.266Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T18:08:43.266Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T18:08:43.266Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T18:08:43.266Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T18:08:43.266Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T18:08:43.266Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T18:08:43.266Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T18:08:43.266Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T18:08:43.266Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T18:08:43.267Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T18:08:43.267Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T18:08:43.267Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T18:08:43.267Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T18:08:43.267Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T18:08:43.267Z	✓ built in 7.55s
2026-04-08T18:08:43.267Z	vite v7.3.1 building ssr environment for production...
2026-04-08T18:08:43.269Z	transforming...
2026-04-08T18:08:44.483Z	✓ 58 modules transformed.
2026-04-08T18:08:44.583Z	rendering chunks...
2026-04-08T18:08:44.672Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T18:08:44.674Z	build/server/wrangler.json                       1.23 kB
2026-04-08T18:08:44.674Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T18:08:44.674Z	build/server/index.js                            0.13 kB
2026-04-08T18:08:44.674Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T18:08:44.674Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T18:08:45.679Z	
2026-04-08T18:08:45.680Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T18:08:45.680Z	─────────────────────────────────────────────
2026-04-08T18:08:45.696Z	
2026-04-08T18:08:45.696Z	Cloudflare collects anonymous telemetry about your usage of Wrangler. Learn more at https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler/telemetry.md
2026-04-08T18:08:46.570Z	
2026-04-08T18:08:46.628Z	✘ [ERROR] Build failed with 1 error:
2026-04-08T18:08:46.628Z	
2026-04-08T18:08:46.629Z	  ✘ [ERROR] Could not resolve "virtual:react-router/server-build"
2026-04-08T18:08:46.629Z	  
2026-04-08T18:08:46.629Z	      workers/app.ts:13:15:
2026-04-08T18:08:46.629Z	        13 │   () => import("virtual:react-router/server-build"),
2026-04-08T18:08:46.629Z	           ╵                ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
2026-04-08T18:08:46.629Z	  
2026-04-08T18:08:46.629Z	    You can mark the path "virtual:react-router/server-build" as external to exclude it from the bundle, which will remove this error and leave the unresolved path in the bundle. You can also add ".catch()" here to handle this failure at run-time instead of bundle-time.
2026-04-08T18:08:46.629Z	  
2026-04-08T18:08:46.629Z	  
2026-04-08T18:08:46.629Z	
2026-04-08T18:08:46.629Z	
2026-04-08T18:08:46.637Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-08_18-08-45_406.log"
2026-04-08T18:08:46.679Z	Failed: error occurred while running deploy command