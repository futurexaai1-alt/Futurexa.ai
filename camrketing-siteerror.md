2026-04-08T17:14:05.768Z	Initializing build environment...
2026-04-08T17:14:05.768Z	Initializing build environment...
2026-04-08T17:15:50.227Z	Success: Finished initializing build environment
2026-04-08T17:15:51.975Z	Cloning repository...
2026-04-08T17:15:55.845Z	Restoring from dependencies cache
2026-04-08T17:15:55.858Z	Restoring from build output cache
2026-04-08T17:15:55.869Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T17:15:56.032Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T17:16:35.003Z	
2026-04-08T17:16:35.004Z	> postinstall
2026-04-08T17:16:35.004Z	> npm run cf-typegen
2026-04-08T17:16:35.004Z	
2026-04-08T17:16:35.727Z	
2026-04-08T17:16:35.731Z	> cf-typegen
2026-04-08T17:16:35.732Z	> wrangler types
2026-04-08T17:16:35.732Z	
2026-04-08T17:16:38.458Z	
2026-04-08T17:16:38.463Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T17:16:38.465Z	─────────────────────────────────────────────
2026-04-08T17:16:38.610Z	Generating project types...
2026-04-08T17:16:38.611Z	
2026-04-08T17:16:38.624Z	declare namespace Cloudflare {
2026-04-08T17:16:38.625Z		interface GlobalProps {
2026-04-08T17:16:38.626Z			mainModule: typeof import("./workers/app");
2026-04-08T17:16:38.627Z		}
2026-04-08T17:16:38.628Z		interface Env {
2026-04-08T17:16:38.628Z			API: Fetcher /* futurexa-api */;
2026-04-08T17:16:38.628Z		}
2026-04-08T17:16:38.629Z	}
2026-04-08T17:16:38.629Z	interface Env extends Cloudflare.Env {}
2026-04-08T17:16:38.629Z	
2026-04-08T17:16:38.629Z	Generating runtime types...
2026-04-08T17:16:38.630Z	
2026-04-08T17:16:44.246Z	Runtime types generated.
2026-04-08T17:16:44.246Z	
2026-04-08T17:16:44.246Z	
2026-04-08T17:16:44.251Z	✨ Types written to worker-configuration.d.ts
2026-04-08T17:16:44.251Z	
2026-04-08T17:16:44.257Z	📖 Read about runtime types
2026-04-08T17:16:44.258Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T17:16:44.259Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T17:16:44.259Z	
2026-04-08T17:16:44.419Z	
2026-04-08T17:16:44.419Z	added 171 packages, and audited 173 packages in 46s
2026-04-08T17:16:44.419Z	
2026-04-08T17:16:44.419Z	31 packages are looking for funding
2026-04-08T17:16:44.419Z	  run `npm fund` for details
2026-04-08T17:16:44.551Z	
2026-04-08T17:16:44.551Z	7 high severity vulnerabilities
2026-04-08T17:16:44.551Z	
2026-04-08T17:16:44.552Z	To address all issues, run:
2026-04-08T17:16:44.552Z	  npm audit fix
2026-04-08T17:16:44.552Z	
2026-04-08T17:16:44.552Z	Run `npm audit` for details.
2026-04-08T17:16:45.916Z	Executing user build command: npm run build
2026-04-08T17:16:46.495Z	
2026-04-08T17:16:46.496Z	> build
2026-04-08T17:16:46.496Z	> react-router build
2026-04-08T17:16:46.496Z	
2026-04-08T17:16:50.481Z	Using Vite Environment API (experimental)
2026-04-08T17:16:50.483Z	vite v7.3.1 building client environment for production...
2026-04-08T17:16:50.598Z	transforming...
2026-04-08T17:17:01.884Z	✓ 2180 modules transformed.
2026-04-08T17:17:03.015Z	rendering chunks...
2026-04-08T17:17:03.403Z	computing gzip size...
2026-04-08T17:17:03.562Z	build/client/.assetsignore                           0.02 kB
2026-04-08T17:17:03.562Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T17:17:03.562Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T17:17:03.562Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T17:17:03.563Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T17:17:03.563Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T17:17:03.563Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T17:17:03.563Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T17:17:03.563Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T17:17:03.563Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T17:17:03.563Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T17:17:03.564Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T17:17:03.565Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T17:17:03.571Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T17:17:03.572Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T17:17:03.572Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T17:17:03.572Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T17:17:03.574Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T17:17:03.574Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T17:17:03.574Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T17:17:03.575Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T17:17:03.577Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T17:17:03.577Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T17:17:03.577Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T17:17:03.577Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T17:17:03.578Z	✓ built in 13.00s
2026-04-08T17:17:03.578Z	vite v7.3.1 building ssr environment for production...
2026-04-08T17:17:03.603Z	transforming...
2026-04-08T17:17:06.713Z	✓ 58 modules transformed.
2026-04-08T17:17:06.868Z	rendering chunks...
2026-04-08T17:17:07.072Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T17:17:07.073Z	build/server/wrangler.json                       1.23 kB
2026-04-08T17:17:07.074Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T17:17:07.074Z	build/server/index.js                            0.13 kB
2026-04-08T17:17:07.074Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T17:17:07.074Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T17:17:07.326Z	Success: Build command completed
2026-04-08T17:17:08.322Z	Executing user deploy command: npm run deploy
2026-04-08T17:17:08.815Z	
2026-04-08T17:17:08.816Z	> deploy
2026-04-08T17:17:08.816Z	> rm -rf .wrangler/deploy && wrangler deploy --config build/server/wrangler.json
2026-04-08T17:17:08.816Z	
2026-04-08T17:17:10.054Z	
2026-04-08T17:17:10.054Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T17:17:10.055Z	─────────────────────────────────────────────
2026-04-08T17:17:10.060Z	
2026-04-08T17:17:10.219Z	✘ [ERROR] Could not read file: build/server/wrangler.json
2026-04-08T17:17:10.219Z	
2026-04-08T17:17:10.219Z	  ENOENT: no such file or directory, open '/opt/buildhome/repo/marketing-site/build/server/wrangler.json'
2026-04-08T17:17:10.220Z	  
2026-04-08T17:17:10.220Z	  If you think this is a bug, please open an issue at: https://github.com/cloudflare/workers-sdk/issues/new/choose
2026-04-08T17:17:10.220Z	
2026-04-08T17:17:10.220Z	
2026-04-08T17:17:10.351Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-08_17-17-09_649.log"
2026-04-08T17:17:10.553Z	Failed: error occurred while running deploy command