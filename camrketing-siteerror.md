2026-04-08T17:32:05.560Z	Initializing build environment...
2026-04-08T17:32:05.560Z	Initializing build environment...
2026-04-08T17:34:20.451Z	Initializing build environment...
2026-04-08T17:34:23.297Z	Success: Finished initializing build environment
2026-04-08T17:34:24.122Z	Cloning repository...
2026-04-08T17:34:25.731Z	Restoring from dependencies cache
2026-04-08T17:34:25.733Z	Restoring from build output cache
2026-04-08T17:34:25.735Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T17:34:25.875Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T17:34:41.672Z	
2026-04-08T17:34:41.673Z	> postinstall
2026-04-08T17:34:41.673Z	> npm run cf-typegen
2026-04-08T17:34:41.673Z	
2026-04-08T17:34:41.891Z	
2026-04-08T17:34:41.891Z	> cf-typegen
2026-04-08T17:34:41.891Z	> wrangler types
2026-04-08T17:34:41.891Z	
2026-04-08T17:34:43.493Z	
2026-04-08T17:34:43.493Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T17:34:43.493Z	─────────────────────────────────────────────
2026-04-08T17:34:43.554Z	Generating project types...
2026-04-08T17:34:43.554Z	
2026-04-08T17:34:43.565Z	declare namespace Cloudflare {
2026-04-08T17:34:43.565Z		interface GlobalProps {
2026-04-08T17:34:43.565Z			mainModule: typeof import("./workers/app");
2026-04-08T17:34:43.565Z		}
2026-04-08T17:34:43.566Z		interface Env {
2026-04-08T17:34:43.566Z			API: Fetcher /* futurexa-api */;
2026-04-08T17:34:43.566Z		}
2026-04-08T17:34:43.566Z	}
2026-04-08T17:34:43.566Z	interface Env extends Cloudflare.Env {}
2026-04-08T17:34:43.566Z	
2026-04-08T17:34:43.566Z	Generating runtime types...
2026-04-08T17:34:43.567Z	
2026-04-08T17:34:47.236Z	Runtime types generated.
2026-04-08T17:34:47.237Z	
2026-04-08T17:34:47.237Z	
2026-04-08T17:34:47.241Z	✨ Types written to worker-configuration.d.ts
2026-04-08T17:34:47.241Z	
2026-04-08T17:34:47.242Z	📖 Read about runtime types
2026-04-08T17:34:47.242Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T17:34:47.242Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T17:34:47.242Z	
2026-04-08T17:34:47.343Z	
2026-04-08T17:34:47.343Z	added 171 packages, and audited 173 packages in 21s
2026-04-08T17:34:47.343Z	
2026-04-08T17:34:47.343Z	31 packages are looking for funding
2026-04-08T17:34:47.343Z	  run `npm fund` for details
2026-04-08T17:34:47.436Z	
2026-04-08T17:34:47.436Z	7 high severity vulnerabilities
2026-04-08T17:34:47.436Z	
2026-04-08T17:34:47.437Z	To address all issues, run:
2026-04-08T17:34:47.437Z	  npm audit fix
2026-04-08T17:34:47.437Z	
2026-04-08T17:34:47.437Z	Run `npm audit` for details.
2026-04-08T17:34:48.151Z	Executing user build command: npm run build
2026-04-08T17:34:48.474Z	
2026-04-08T17:34:48.474Z	> build
2026-04-08T17:34:48.474Z	> react-router build
2026-04-08T17:34:48.474Z	
2026-04-08T17:34:50.872Z	Using Vite Environment API (experimental)
2026-04-08T17:34:50.875Z	vite v7.3.1 building client environment for production...
2026-04-08T17:34:50.944Z	transforming...
2026-04-08T17:34:57.638Z	✓ 2180 modules transformed.
2026-04-08T17:34:57.955Z	rendering chunks...
2026-04-08T17:34:58.033Z	computing gzip size...
2026-04-08T17:34:58.054Z	build/client/.assetsignore                           0.02 kB
2026-04-08T17:34:58.054Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T17:34:58.055Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T17:34:58.055Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T17:34:58.056Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T17:34:58.056Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T17:34:58.056Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T17:34:58.056Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T17:34:58.056Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T17:34:58.056Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T17:34:58.056Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T17:34:58.056Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T17:34:58.057Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T17:34:58.057Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T17:34:58.057Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T17:34:58.057Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T17:34:58.057Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T17:34:58.057Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T17:34:58.057Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T17:34:58.057Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T17:34:58.057Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T17:34:58.057Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T17:34:58.057Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T17:34:58.057Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T17:34:58.058Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T17:34:58.058Z	✓ built in 7.14s
2026-04-08T17:34:58.058Z	vite v7.3.1 building ssr environment for production...
2026-04-08T17:34:58.061Z	transforming...
2026-04-08T17:34:59.268Z	✓ 58 modules transformed.
2026-04-08T17:34:59.360Z	rendering chunks...
2026-04-08T17:34:59.459Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T17:34:59.460Z	build/server/wrangler.json                       1.23 kB
2026-04-08T17:34:59.461Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T17:34:59.461Z	build/server/index.js                            0.13 kB
2026-04-08T17:34:59.461Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T17:34:59.461Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T17:34:59.605Z	Success: Build command completed
2026-04-08T17:34:59.772Z	Executing user deploy command: npm run deploy
2026-04-08T17:35:00.002Z	
2026-04-08T17:35:00.003Z	> deploy
2026-04-08T17:35:00.003Z	> npm run build && rm -rf .wrangler/deploy && wrangler deploy --config build/server/wrangler.json
2026-04-08T17:35:00.003Z	
2026-04-08T17:35:00.154Z	
2026-04-08T17:35:00.154Z	> build
2026-04-08T17:35:00.154Z	> react-router build
2026-04-08T17:35:00.154Z	
2026-04-08T17:35:01.738Z	Using Vite Environment API (experimental)
2026-04-08T17:35:01.742Z	vite v7.3.1 building client environment for production...
2026-04-08T17:35:01.787Z	transforming...
2026-04-08T17:35:08.512Z	✓ 2180 modules transformed.
2026-04-08T17:35:08.810Z	rendering chunks...
2026-04-08T17:35:08.897Z	computing gzip size...
2026-04-08T17:35:08.914Z	build/client/.assetsignore                           0.02 kB
2026-04-08T17:35:08.914Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T17:35:08.915Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T17:35:08.915Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T17:35:08.915Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T17:35:08.915Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T17:35:08.915Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T17:35:08.915Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T17:35:08.915Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T17:35:08.916Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T17:35:08.916Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T17:35:08.916Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T17:35:08.916Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T17:35:08.916Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T17:35:08.916Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T17:35:08.918Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T17:35:08.918Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T17:35:08.918Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T17:35:08.918Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T17:35:08.918Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T17:35:08.918Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T17:35:08.918Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T17:35:08.919Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T17:35:08.919Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T17:35:08.919Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T17:35:08.919Z	✓ built in 7.15s
2026-04-08T17:35:08.919Z	vite v7.3.1 building ssr environment for production...
2026-04-08T17:35:08.920Z	transforming...
2026-04-08T17:35:10.045Z	✓ 58 modules transformed.
2026-04-08T17:35:10.129Z	rendering chunks...
2026-04-08T17:35:10.220Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T17:35:10.220Z	build/server/wrangler.json                       1.23 kB
2026-04-08T17:35:10.221Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T17:35:10.221Z	build/server/index.js                            0.13 kB
2026-04-08T17:35:10.221Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T17:35:10.221Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T17:35:11.142Z	
2026-04-08T17:35:11.142Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T17:35:11.142Z	─────────────────────────────────────────────
2026-04-08T17:35:11.165Z	
2026-04-08T17:35:11.224Z	✘ [ERROR] Could not read file: build/server/wrangler.json
2026-04-08T17:35:11.225Z	
2026-04-08T17:35:11.225Z	  ENOENT: no such file or directory, open '/opt/buildhome/repo/marketing-site/build/server/wrangler.json'
2026-04-08T17:35:11.225Z	  
2026-04-08T17:35:11.225Z	  If you think this is a bug, please open an issue at: https://github.com/cloudflare/workers-sdk/issues/new/choose
2026-04-08T17:35:11.225Z	
2026-04-08T17:35:11.225Z	
2026-04-08T17:35:11.295Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-08_17-35-10_877.log"
2026-04-08T17:35:11.411Z	Failed: error occurred while running deploy command