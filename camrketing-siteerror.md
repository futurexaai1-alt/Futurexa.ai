2026-04-08T17:53:44.716Z	Initializing build environment...
2026-04-08T17:53:44.716Z	Initializing build environment...
2026-04-08T17:55:36.848Z	Success: Finished initializing build environment
2026-04-08T17:55:37.799Z	Cloning repository...
2026-04-08T17:55:39.816Z	Restoring from dependencies cache
2026-04-08T17:55:39.817Z	Restoring from build output cache
2026-04-08T17:55:39.820Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T17:55:39.954Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T17:55:54.244Z	
2026-04-08T17:55:54.245Z	> postinstall
2026-04-08T17:55:54.246Z	> npm run cf-typegen
2026-04-08T17:55:54.246Z	
2026-04-08T17:55:54.501Z	
2026-04-08T17:55:54.501Z	> cf-typegen
2026-04-08T17:55:54.502Z	> wrangler types
2026-04-08T17:55:54.502Z	
2026-04-08T17:55:56.177Z	
2026-04-08T17:55:56.177Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T17:55:56.177Z	─────────────────────────────────────────────
2026-04-08T17:55:56.232Z	Generating project types...
2026-04-08T17:55:56.232Z	
2026-04-08T17:55:56.240Z	declare namespace Cloudflare {
2026-04-08T17:55:56.240Z		interface GlobalProps {
2026-04-08T17:55:56.244Z			mainModule: typeof import("./workers/app");
2026-04-08T17:55:56.247Z		}
2026-04-08T17:55:56.247Z		interface Env {
2026-04-08T17:55:56.248Z			API: Fetcher /* futurexa-api */;
2026-04-08T17:55:56.248Z		}
2026-04-08T17:55:56.248Z	}
2026-04-08T17:55:56.248Z	interface Env extends Cloudflare.Env {}
2026-04-08T17:55:56.248Z	
2026-04-08T17:55:56.248Z	Generating runtime types...
2026-04-08T17:55:56.249Z	
2026-04-08T17:55:59.707Z	Runtime types generated.
2026-04-08T17:55:59.708Z	
2026-04-08T17:55:59.709Z	
2026-04-08T17:55:59.713Z	✨ Types written to worker-configuration.d.ts
2026-04-08T17:55:59.713Z	
2026-04-08T17:55:59.713Z	📖 Read about runtime types
2026-04-08T17:55:59.713Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T17:55:59.714Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T17:55:59.714Z	
2026-04-08T17:55:59.803Z	
2026-04-08T17:55:59.803Z	added 171 packages, and audited 173 packages in 19s
2026-04-08T17:55:59.803Z	
2026-04-08T17:55:59.803Z	31 packages are looking for funding
2026-04-08T17:55:59.803Z	  run `npm fund` for details
2026-04-08T17:55:59.877Z	
2026-04-08T17:55:59.877Z	7 high severity vulnerabilities
2026-04-08T17:55:59.878Z	
2026-04-08T17:55:59.878Z	To address all issues, run:
2026-04-08T17:55:59.878Z	  npm audit fix
2026-04-08T17:55:59.878Z	
2026-04-08T17:55:59.878Z	Run `npm audit` for details.
2026-04-08T17:56:00.138Z	Executing user build command: npm run build
2026-04-08T17:56:00.410Z	
2026-04-08T17:56:00.411Z	> build
2026-04-08T17:56:00.411Z	> react-router build
2026-04-08T17:56:00.411Z	
2026-04-08T17:56:02.466Z	Using Vite Environment API (experimental)
2026-04-08T17:56:02.468Z	vite v7.3.1 building client environment for production...
2026-04-08T17:56:02.519Z	transforming...
2026-04-08T17:56:09.278Z	✓ 2180 modules transformed.
2026-04-08T17:56:09.608Z	rendering chunks...
2026-04-08T17:56:09.724Z	computing gzip size...
2026-04-08T17:56:09.766Z	build/client/.assetsignore                           0.02 kB
2026-04-08T17:56:09.766Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T17:56:09.767Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T17:56:09.767Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T17:56:09.767Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T17:56:09.768Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T17:56:09.768Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T17:56:09.769Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T17:56:09.769Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T17:56:09.769Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T17:56:09.769Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T17:56:09.769Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T17:56:09.770Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T17:56:09.770Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T17:56:09.770Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T17:56:09.770Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T17:56:09.770Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T17:56:09.770Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T17:56:09.770Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T17:56:09.773Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T17:56:09.773Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T17:56:09.773Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T17:56:09.773Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T17:56:09.773Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T17:56:09.773Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T17:56:09.773Z	✓ built in 7.26s
2026-04-08T17:56:09.773Z	vite v7.3.1 building ssr environment for production...
2026-04-08T17:56:09.777Z	transforming...
2026-04-08T17:56:11.345Z	✓ 58 modules transformed.
2026-04-08T17:56:11.491Z	rendering chunks...
2026-04-08T17:56:11.579Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T17:56:11.579Z	build/server/wrangler.json                       1.23 kB
2026-04-08T17:56:11.579Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T17:56:11.580Z	build/server/index.js                            0.13 kB
2026-04-08T17:56:11.581Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T17:56:11.581Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T17:56:11.766Z	Success: Build command completed
2026-04-08T17:56:12.345Z	Executing user deploy command: npm run deploy
2026-04-08T17:56:12.720Z	
2026-04-08T17:56:12.720Z	> deploy
2026-04-08T17:56:12.720Z	> npm run build && wrangler deploy
2026-04-08T17:56:12.720Z	
2026-04-08T17:56:12.966Z	
2026-04-08T17:56:12.966Z	> build
2026-04-08T17:56:12.966Z	> react-router build
2026-04-08T17:56:12.966Z	
2026-04-08T17:56:15.433Z	Using Vite Environment API (experimental)
2026-04-08T17:56:15.438Z	vite v7.3.1 building client environment for production...
2026-04-08T17:56:15.498Z	transforming...
2026-04-08T17:56:23.895Z	✓ 2180 modules transformed.
2026-04-08T17:56:24.191Z	rendering chunks...
2026-04-08T17:56:24.327Z	computing gzip size...
2026-04-08T17:56:24.351Z	build/client/.assetsignore                           0.02 kB
2026-04-08T17:56:24.352Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T17:56:24.352Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T17:56:24.353Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T17:56:24.353Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T17:56:24.353Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T17:56:24.353Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T17:56:24.353Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T17:56:24.354Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T17:56:24.355Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T17:56:24.355Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T17:56:24.355Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T17:56:24.355Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T17:56:24.355Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T17:56:24.355Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T17:56:24.355Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T17:56:24.355Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T17:56:24.355Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T17:56:24.356Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T17:56:24.356Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T17:56:24.356Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T17:56:24.356Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T17:56:24.356Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T17:56:24.356Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T17:56:24.356Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T17:56:24.356Z	✓ built in 8.87s
2026-04-08T17:56:24.356Z	vite v7.3.1 building ssr environment for production...
2026-04-08T17:56:24.360Z	transforming...
2026-04-08T17:56:25.733Z	✓ 58 modules transformed.
2026-04-08T17:56:25.842Z	rendering chunks...
2026-04-08T17:56:25.940Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T17:56:25.942Z	build/server/wrangler.json                       1.23 kB
2026-04-08T17:56:25.942Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T17:56:25.942Z	build/server/index.js                            0.13 kB
2026-04-08T17:56:25.942Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T17:56:25.942Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T17:56:27.005Z	
2026-04-08T17:56:27.005Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T17:56:27.005Z	─────────────────────────────────────────────
2026-04-08T17:56:27.012Z	
2026-04-08T17:56:27.082Z	✘ [ERROR] There is a deploy configuration at ".wrangler/deploy/config.json".
2026-04-08T17:56:27.082Z	
2026-04-08T17:56:27.082Z	  But the redirected configuration path it points to, "build/server/wrangler.json", does not exist.
2026-04-08T17:56:27.083Z	
2026-04-08T17:56:27.083Z	
2026-04-08T17:56:27.189Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-08_17-56-26_724.log"
2026-04-08T17:56:27.303Z	Failed: error occurred while running deploy command