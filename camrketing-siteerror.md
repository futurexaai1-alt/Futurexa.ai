2026-04-08T16:19:56.053Z	Initializing build environment...
2026-04-08T16:19:56.053Z	Initializing build environment...
2026-04-08T16:20:50.444Z	Success: Finished initializing build environment
2026-04-08T16:20:52.224Z	Cloning repository...
2026-04-08T16:20:54.311Z	Restoring from dependencies cache
2026-04-08T16:20:54.313Z	Restoring from build output cache
2026-04-08T16:20:54.317Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T16:20:54.446Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T16:21:12.948Z	
2026-04-08T16:21:12.949Z	> postinstall
2026-04-08T16:21:12.950Z	> npm run cf-typegen
2026-04-08T16:21:12.950Z	
2026-04-08T16:21:13.276Z	
2026-04-08T16:21:13.277Z	> cf-typegen
2026-04-08T16:21:13.277Z	> wrangler types
2026-04-08T16:21:13.277Z	
2026-04-08T16:21:15.125Z	
2026-04-08T16:21:15.126Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T16:21:15.127Z	─────────────────────────────────────────────
2026-04-08T16:21:15.212Z	Generating project types...
2026-04-08T16:21:15.214Z	
2026-04-08T16:21:15.219Z	declare namespace Cloudflare {
2026-04-08T16:21:15.220Z		interface GlobalProps {
2026-04-08T16:21:15.220Z			mainModule: typeof import("./workers/app");
2026-04-08T16:21:15.220Z		}
2026-04-08T16:21:15.221Z		interface Env {
2026-04-08T16:21:15.221Z			API: Fetcher /* futurexa-api */;
2026-04-08T16:21:15.221Z		}
2026-04-08T16:21:15.221Z	}
2026-04-08T16:21:15.225Z	interface Env extends Cloudflare.Env {}
2026-04-08T16:21:15.225Z	
2026-04-08T16:21:15.225Z	Generating runtime types...
2026-04-08T16:21:15.225Z	
2026-04-08T16:21:19.454Z	Runtime types generated.
2026-04-08T16:21:19.455Z	
2026-04-08T16:21:19.455Z	
2026-04-08T16:21:19.461Z	✨ Types written to worker-configuration.d.ts
2026-04-08T16:21:19.461Z	
2026-04-08T16:21:19.462Z	📖 Read about runtime types
2026-04-08T16:21:19.462Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T16:21:19.463Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T16:21:19.463Z	
2026-04-08T16:21:19.585Z	
2026-04-08T16:21:19.586Z	added 171 packages, and audited 173 packages in 24s
2026-04-08T16:21:19.586Z	
2026-04-08T16:21:19.586Z	31 packages are looking for funding
2026-04-08T16:21:19.587Z	  run `npm fund` for details
2026-04-08T16:21:19.684Z	
2026-04-08T16:21:19.684Z	7 high severity vulnerabilities
2026-04-08T16:21:19.684Z	
2026-04-08T16:21:19.684Z	To address all issues, run:
2026-04-08T16:21:19.684Z	  npm audit fix
2026-04-08T16:21:19.684Z	
2026-04-08T16:21:19.684Z	Run `npm audit` for details.
2026-04-08T16:21:20.505Z	Executing user build command: npm run build
2026-04-08T16:21:20.885Z	
2026-04-08T16:21:20.886Z	> build
2026-04-08T16:21:20.887Z	> react-router build
2026-04-08T16:21:20.887Z	
2026-04-08T16:21:23.181Z	Using Vite Environment API (experimental)
2026-04-08T16:21:23.182Z	vite v7.3.1 building client environment for production...
2026-04-08T16:21:23.241Z	transforming...
2026-04-08T16:21:30.546Z	✓ 2180 modules transformed.
2026-04-08T16:21:30.944Z	rendering chunks...
2026-04-08T16:21:30.985Z	computing gzip size...
2026-04-08T16:21:31.007Z	build/client/.assetsignore                           0.02 kB
2026-04-08T16:21:31.008Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T16:21:31.008Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T16:21:31.008Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T16:21:31.009Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T16:21:31.009Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T16:21:31.010Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T16:21:31.010Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T16:21:31.010Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T16:21:31.011Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T16:21:31.011Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T16:21:31.011Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T16:21:31.011Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T16:21:31.011Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T16:21:31.011Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T16:21:31.011Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T16:21:31.012Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T16:21:31.012Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T16:21:31.012Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T16:21:31.012Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T16:21:31.012Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T16:21:31.012Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T16:21:31.012Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T16:21:31.012Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T16:21:31.012Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T16:21:31.016Z	✓ built in 7.79s
2026-04-08T16:21:31.016Z	vite v7.3.1 building ssr environment for production...
2026-04-08T16:21:31.019Z	transforming...
2026-04-08T16:21:32.415Z	✓ 58 modules transformed.
2026-04-08T16:21:32.512Z	rendering chunks...
2026-04-08T16:21:32.607Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T16:21:32.608Z	build/server/wrangler.json                       1.24 kB
2026-04-08T16:21:32.608Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T16:21:32.608Z	build/server/index.js                            0.13 kB
2026-04-08T16:21:32.608Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T16:21:32.609Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T16:21:32.889Z	Success: Build command completed
2026-04-08T16:21:33.576Z	Executing user deploy command: npx wrangler versions upload
2026-04-08T16:21:35.222Z	
2026-04-08T16:21:35.224Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T16:21:35.224Z	─────────────────────────────────────────────
2026-04-08T16:21:35.253Z	
2026-04-08T16:21:35.332Z	✘ [ERROR] There is a deploy configuration at ".wrangler/deploy/config.json".
2026-04-08T16:21:35.332Z	
2026-04-08T16:21:35.332Z	  But the redirected configuration path it points to, "build/server/wrangler.json", does not exist.
2026-04-08T16:21:35.333Z	
2026-04-08T16:21:35.333Z	
2026-04-08T16:21:35.447Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-08_16-21-34_922.log"
2026-04-08T16:21:35.588Z	Failed: error occurred while running deploy command