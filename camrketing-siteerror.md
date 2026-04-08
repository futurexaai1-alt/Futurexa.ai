2026-04-08T18:15:28.995Z	Initializing build environment...
2026-04-08T18:16:23.199Z	Success: Finished initializing build environment
2026-04-08T18:16:24.585Z	Cloning repository...
2026-04-08T18:16:26.304Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T18:16:26.308Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T18:16:46.668Z	
2026-04-08T18:16:46.668Z	> postinstall
2026-04-08T18:16:46.668Z	> npm run cf-typegen
2026-04-08T18:16:46.668Z	
2026-04-08T18:16:46.998Z	
2026-04-08T18:16:46.999Z	> cf-typegen
2026-04-08T18:16:46.999Z	> wrangler types
2026-04-08T18:16:46.999Z	
2026-04-08T18:16:49.032Z	
2026-04-08T18:16:49.035Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T18:16:49.036Z	─────────────────────────────────────────────
2026-04-08T18:16:49.110Z	Generating project types...
2026-04-08T18:16:49.110Z	
2026-04-08T18:16:49.121Z	declare namespace Cloudflare {
2026-04-08T18:16:49.121Z		interface GlobalProps {
2026-04-08T18:16:49.122Z			mainModule: typeof import("./workers/app");
2026-04-08T18:16:49.124Z		}
2026-04-08T18:16:49.127Z		interface Env {
2026-04-08T18:16:49.127Z			API: Fetcher /* futurexa-api */;
2026-04-08T18:16:49.130Z		}
2026-04-08T18:16:49.131Z	}
2026-04-08T18:16:49.131Z	interface Env extends Cloudflare.Env {}
2026-04-08T18:16:49.131Z	
2026-04-08T18:16:49.132Z	Generating runtime types...
2026-04-08T18:16:49.132Z	
2026-04-08T18:16:53.831Z	Runtime types generated.
2026-04-08T18:16:53.831Z	
2026-04-08T18:16:53.831Z	
2026-04-08T18:16:53.839Z	✨ Types written to worker-configuration.d.ts
2026-04-08T18:16:53.840Z	
2026-04-08T18:16:53.840Z	📖 Read about runtime types
2026-04-08T18:16:53.840Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T18:16:53.840Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T18:16:53.840Z	
2026-04-08T18:16:53.997Z	
2026-04-08T18:16:53.998Z	added 171 packages, and audited 173 packages in 27s
2026-04-08T18:16:53.999Z	
2026-04-08T18:16:53.999Z	31 packages are looking for funding
2026-04-08T18:16:53.999Z	  run `npm fund` for details
2026-04-08T18:16:54.093Z	
2026-04-08T18:16:54.094Z	7 high severity vulnerabilities
2026-04-08T18:16:54.094Z	
2026-04-08T18:16:54.094Z	To address all issues, run:
2026-04-08T18:16:54.094Z	  npm audit fix
2026-04-08T18:16:54.094Z	
2026-04-08T18:16:54.094Z	Run `npm audit` for details.
2026-04-08T18:16:54.478Z	Executing user build command: npm run build
2026-04-08T18:16:54.905Z	
2026-04-08T18:16:54.905Z	> build
2026-04-08T18:16:54.905Z	> react-router build
2026-04-08T18:16:54.905Z	
2026-04-08T18:16:57.628Z	Using Vite Environment API (experimental)
2026-04-08T18:16:57.630Z	vite v7.3.1 building client environment for production...
2026-04-08T18:16:57.712Z	transforming...
2026-04-08T18:17:06.852Z	✓ 2180 modules transformed.
2026-04-08T18:17:07.417Z	rendering chunks...
2026-04-08T18:17:07.478Z	computing gzip size...
2026-04-08T18:17:07.542Z	build/client/.assetsignore                           0.02 kB
2026-04-08T18:17:07.543Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T18:17:07.543Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T18:17:07.543Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T18:17:07.543Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T18:17:07.546Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T18:17:07.549Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T18:17:07.550Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T18:17:07.550Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T18:17:07.550Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T18:17:07.550Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T18:17:07.550Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T18:17:07.551Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T18:17:07.551Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T18:17:07.551Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T18:17:07.552Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T18:17:07.552Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T18:17:07.552Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T18:17:07.552Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T18:17:07.552Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T18:17:07.552Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T18:17:07.555Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T18:17:07.555Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T18:17:07.555Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T18:17:07.555Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T18:17:07.555Z	✓ built in 9.87s
2026-04-08T18:17:07.555Z	vite v7.3.1 building ssr environment for production...
2026-04-08T18:17:07.555Z	transforming...
2026-04-08T18:17:09.307Z	✓ 58 modules transformed.
2026-04-08T18:17:09.445Z	rendering chunks...
2026-04-08T18:17:09.563Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T18:17:09.565Z	build/server/wrangler.json                       1.23 kB
2026-04-08T18:17:09.565Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T18:17:09.566Z	build/server/index.js                            0.13 kB
2026-04-08T18:17:09.567Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T18:17:09.567Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T18:17:09.808Z	Success: Build command completed
2026-04-08T18:17:10.456Z	Executing user deploy command: npm run deploy
2026-04-08T18:17:10.962Z	
2026-04-08T18:17:10.962Z	> deploy
2026-04-08T18:17:10.965Z	> npm run build && rm -rf .wrangler/deploy && wrangler deploy --config ./build/server/wrangler.json
2026-04-08T18:17:10.965Z	
2026-04-08T18:17:11.270Z	
2026-04-08T18:17:11.270Z	> build
2026-04-08T18:17:11.271Z	> react-router build
2026-04-08T18:17:11.271Z	
2026-04-08T18:17:13.993Z	Using Vite Environment API (experimental)
2026-04-08T18:17:14.007Z	vite v7.3.1 building client environment for production...
2026-04-08T18:17:14.088Z	transforming...
2026-04-08T18:17:23.218Z	✓ 2180 modules transformed.
2026-04-08T18:17:23.651Z	rendering chunks...
2026-04-08T18:17:23.847Z	computing gzip size...
2026-04-08T18:17:23.877Z	build/client/.assetsignore                           0.02 kB
2026-04-08T18:17:23.878Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T18:17:23.879Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T18:17:23.879Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T18:17:23.880Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T18:17:23.880Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T18:17:23.880Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T18:17:23.880Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T18:17:23.880Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T18:17:23.883Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T18:17:23.886Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T18:17:23.886Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T18:17:23.886Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T18:17:23.887Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T18:17:23.887Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T18:17:23.891Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T18:17:23.891Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T18:17:23.892Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T18:17:23.892Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T18:17:23.892Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T18:17:23.892Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T18:17:23.892Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T18:17:23.892Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T18:17:23.892Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T18:17:23.892Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T18:17:23.893Z	✓ built in 9.82s
2026-04-08T18:17:23.893Z	vite v7.3.1 building ssr environment for production...
2026-04-08T18:17:23.896Z	transforming...
2026-04-08T18:17:25.709Z	✓ 58 modules transformed.
2026-04-08T18:17:25.858Z	rendering chunks...
2026-04-08T18:17:25.980Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T18:17:25.982Z	build/server/wrangler.json                       1.23 kB
2026-04-08T18:17:25.983Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T18:17:25.983Z	build/server/index.js                            0.13 kB
2026-04-08T18:17:25.985Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T18:17:25.985Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T18:17:27.232Z	
2026-04-08T18:17:27.232Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T18:17:27.232Z	─────────────────────────────────────────────
2026-04-08T18:17:27.259Z	
2026-04-08T18:17:27.329Z	✘ [ERROR] Could not read file: ./build/server/wrangler.json
2026-04-08T18:17:27.332Z	
2026-04-08T18:17:27.332Z	  ENOENT: no such file or directory, open '/opt/buildhome/repo/marketing-site/build/server/wrangler.json'
2026-04-08T18:17:27.332Z	  
2026-04-08T18:17:27.332Z	  If you think this is a bug, please open an issue at: https://github.com/cloudflare/workers-sdk/issues/new/choose
2026-04-08T18:17:27.332Z	
2026-04-08T18:17:27.332Z	
2026-04-08T18:17:27.427Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-08_18-17-26_932.log"
2026-04-08T18:17:27.611Z	Failed: error occurred while running deploy command