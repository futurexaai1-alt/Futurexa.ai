2026-04-08T16:25:38.955Z	Initializing build environment...
2026-04-08T16:25:38.955Z	Initializing build environment...
2026-04-08T16:28:18.796Z	Initializing build environment...
2026-04-08T16:28:22.604Z	Success: Finished initializing build environment
2026-04-08T16:28:23.778Z	Cloning repository...
2026-04-08T16:28:26.108Z	Restoring from dependencies cache
2026-04-08T16:28:26.110Z	Restoring from build output cache
2026-04-08T16:28:26.114Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T16:28:26.489Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T16:28:49.732Z	
2026-04-08T16:28:49.733Z	> postinstall
2026-04-08T16:28:49.733Z	> npm run cf-typegen
2026-04-08T16:28:49.733Z	
2026-04-08T16:28:50.132Z	
2026-04-08T16:28:50.133Z	> cf-typegen
2026-04-08T16:28:50.133Z	> wrangler types
2026-04-08T16:28:50.133Z	
2026-04-08T16:28:52.478Z	
2026-04-08T16:28:52.479Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T16:28:52.479Z	─────────────────────────────────────────────
2026-04-08T16:28:52.533Z	Generating project types...
2026-04-08T16:28:52.534Z	
2026-04-08T16:28:52.542Z	declare namespace Cloudflare {
2026-04-08T16:28:52.544Z		interface GlobalProps {
2026-04-08T16:28:52.545Z			mainModule: typeof import("./workers/app");
2026-04-08T16:28:52.546Z		}
2026-04-08T16:28:52.547Z		interface Env {
2026-04-08T16:28:52.547Z			API: Fetcher /* futurexa-api */;
2026-04-08T16:28:52.547Z		}
2026-04-08T16:28:52.548Z	}
2026-04-08T16:28:52.548Z	interface Env extends Cloudflare.Env {}
2026-04-08T16:28:52.548Z	
2026-04-08T16:28:52.549Z	Generating runtime types...
2026-04-08T16:28:52.549Z	
2026-04-08T16:28:58.209Z	Runtime types generated.
2026-04-08T16:28:58.211Z	
2026-04-08T16:28:58.212Z	
2026-04-08T16:28:58.212Z	✨ Types written to worker-configuration.d.ts
2026-04-08T16:28:58.213Z	
2026-04-08T16:28:58.214Z	📖 Read about runtime types
2026-04-08T16:28:58.214Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T16:28:58.215Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T16:28:58.215Z	
2026-04-08T16:28:58.426Z	
2026-04-08T16:28:58.427Z	added 171 packages, and audited 173 packages in 31s
2026-04-08T16:28:58.427Z	
2026-04-08T16:28:58.433Z	31 packages are looking for funding
2026-04-08T16:28:58.434Z	  run `npm fund` for details
2026-04-08T16:28:58.556Z	
2026-04-08T16:28:58.556Z	7 high severity vulnerabilities
2026-04-08T16:28:58.557Z	
2026-04-08T16:28:58.557Z	To address all issues, run:
2026-04-08T16:28:58.558Z	  npm audit fix
2026-04-08T16:28:58.559Z	
2026-04-08T16:28:58.559Z	Run `npm audit` for details.
2026-04-08T16:28:58.965Z	Executing user build command: npm run build
2026-04-08T16:28:59.459Z	
2026-04-08T16:28:59.460Z	> build
2026-04-08T16:28:59.460Z	> react-router build
2026-04-08T16:28:59.460Z	
2026-04-08T16:29:02.595Z	Using Vite Environment API (experimental)
2026-04-08T16:29:02.600Z	vite v7.3.1 building client environment for production...
2026-04-08T16:29:02.711Z	transforming...
2026-04-08T16:29:13.523Z	✓ 2180 modules transformed.
2026-04-08T16:29:13.982Z	rendering chunks...
2026-04-08T16:29:14.137Z	computing gzip size...
2026-04-08T16:29:14.170Z	build/client/.assetsignore                           0.02 kB
2026-04-08T16:29:14.171Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T16:29:14.171Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T16:29:14.172Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T16:29:14.172Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T16:29:14.172Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T16:29:14.172Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T16:29:14.172Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T16:29:14.172Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T16:29:14.172Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T16:29:14.173Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T16:29:14.173Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T16:29:14.173Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T16:29:14.173Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T16:29:14.173Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T16:29:14.173Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T16:29:14.173Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T16:29:14.173Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T16:29:14.174Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T16:29:14.174Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T16:29:14.174Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T16:29:14.174Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T16:29:14.174Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T16:29:14.174Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T16:29:14.174Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T16:29:14.175Z	✓ built in 11.51s
2026-04-08T16:29:14.175Z	vite v7.3.1 building ssr environment for production...
2026-04-08T16:29:14.182Z	transforming...
2026-04-08T16:29:16.234Z	✓ 58 modules transformed.
2026-04-08T16:29:16.388Z	rendering chunks...
2026-04-08T16:29:16.553Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T16:29:16.555Z	build/server/wrangler.json                       1.24 kB
2026-04-08T16:29:16.555Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T16:29:16.555Z	build/server/index.js                            0.13 kB
2026-04-08T16:29:16.555Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T16:29:16.555Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T16:29:16.792Z	Success: Build command completed
2026-04-08T16:29:17.013Z	Executing user deploy command: npx wrangler versions upload
2026-04-08T16:29:18.776Z	
2026-04-08T16:29:18.777Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T16:29:18.778Z	─────────────────────────────────────────────
2026-04-08T16:29:18.790Z	
2026-04-08T16:29:18.866Z	✘ [ERROR] There is a deploy configuration at ".wrangler/deploy/config.json".
2026-04-08T16:29:18.866Z	
2026-04-08T16:29:18.866Z	  But the redirected configuration path it points to, "build/server/wrangler.json", does not exist.
2026-04-08T16:29:18.866Z	
2026-04-08T16:29:18.866Z	
2026-04-08T16:29:18.985Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-08_16-29-18_445.log"
2026-04-08T16:29:19.165Z	Failed: error occurred while running deploy command