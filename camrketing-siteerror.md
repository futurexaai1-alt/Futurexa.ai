2026-04-08T18:20:30.107Z	Initializing build environment...
2026-04-08T18:20:30.107Z	Initializing build environment...
2026-04-08T18:21:52.860Z	Success: Finished initializing build environment
2026-04-08T18:21:54.428Z	Cloning repository...
2026-04-08T18:21:56.568Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T18:21:56.571Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T18:22:14.477Z	
2026-04-08T18:22:14.478Z	> postinstall
2026-04-08T18:22:14.478Z	> npm run cf-typegen
2026-04-08T18:22:14.478Z	
2026-04-08T18:22:14.719Z	
2026-04-08T18:22:14.720Z	> cf-typegen
2026-04-08T18:22:14.720Z	> wrangler types
2026-04-08T18:22:14.720Z	
2026-04-08T18:22:16.415Z	
2026-04-08T18:22:16.415Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T18:22:16.415Z	─────────────────────────────────────────────
2026-04-08T18:22:16.479Z	Generating project types...
2026-04-08T18:22:16.479Z	
2026-04-08T18:22:16.489Z	declare namespace Cloudflare {
2026-04-08T18:22:16.490Z		interface GlobalProps {
2026-04-08T18:22:16.490Z			mainModule: typeof import("./workers/app");
2026-04-08T18:22:16.490Z		}
2026-04-08T18:22:16.490Z		interface Env {
2026-04-08T18:22:16.490Z			API: Fetcher /* futurexa-api */;
2026-04-08T18:22:16.491Z		}
2026-04-08T18:22:16.492Z	}
2026-04-08T18:22:16.492Z	interface Env extends Cloudflare.Env {}
2026-04-08T18:22:16.492Z	
2026-04-08T18:22:16.492Z	Generating runtime types...
2026-04-08T18:22:16.492Z	
2026-04-08T18:22:20.291Z	Runtime types generated.
2026-04-08T18:22:20.293Z	
2026-04-08T18:22:20.294Z	
2026-04-08T18:22:20.298Z	✨ Types written to worker-configuration.d.ts
2026-04-08T18:22:20.299Z	
2026-04-08T18:22:20.304Z	📖 Read about runtime types
2026-04-08T18:22:20.304Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T18:22:20.304Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T18:22:20.304Z	
2026-04-08T18:22:20.416Z	
2026-04-08T18:22:20.416Z	added 171 packages, and audited 173 packages in 23s
2026-04-08T18:22:20.416Z	
2026-04-08T18:22:20.416Z	31 packages are looking for funding
2026-04-08T18:22:20.416Z	  run `npm fund` for details
2026-04-08T18:22:20.502Z	
2026-04-08T18:22:20.502Z	7 high severity vulnerabilities
2026-04-08T18:22:20.502Z	
2026-04-08T18:22:20.502Z	To address all issues, run:
2026-04-08T18:22:20.502Z	  npm audit fix
2026-04-08T18:22:20.502Z	
2026-04-08T18:22:20.502Z	Run `npm audit` for details.
2026-04-08T18:22:21.286Z	Executing user build command: npm run build
2026-04-08T18:22:21.713Z	
2026-04-08T18:22:21.713Z	> build
2026-04-08T18:22:21.713Z	> react-router build
2026-04-08T18:22:21.714Z	
2026-04-08T18:22:23.922Z	Using Vite Environment API (experimental)
2026-04-08T18:22:23.923Z	vite v7.3.1 building client environment for production...
2026-04-08T18:22:24.001Z	transforming...
2026-04-08T18:22:30.858Z	✓ 2180 modules transformed.
2026-04-08T18:22:31.180Z	rendering chunks...
2026-04-08T18:22:31.282Z	computing gzip size...
2026-04-08T18:22:31.312Z	build/client/.assetsignore                           0.02 kB
2026-04-08T18:22:31.312Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T18:22:31.313Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T18:22:31.313Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T18:22:31.313Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T18:22:31.313Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T18:22:31.313Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T18:22:31.313Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T18:22:31.313Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T18:22:31.313Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T18:22:31.313Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T18:22:31.313Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T18:22:31.315Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T18:22:31.316Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T18:22:31.316Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T18:22:31.317Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T18:22:31.317Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T18:22:31.318Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T18:22:31.318Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T18:22:31.318Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T18:22:31.318Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T18:22:31.318Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T18:22:31.319Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T18:22:31.319Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T18:22:31.319Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T18:22:31.319Z	✓ built in 7.35s
2026-04-08T18:22:31.319Z	vite v7.3.1 building ssr environment for production...
2026-04-08T18:22:31.323Z	transforming...
2026-04-08T18:22:32.899Z	✓ 58 modules transformed.
2026-04-08T18:22:33.022Z	rendering chunks...
2026-04-08T18:22:33.139Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T18:22:33.142Z	build/server/wrangler.json                       1.23 kB
2026-04-08T18:22:33.142Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T18:22:33.143Z	build/server/index.js                            0.13 kB
2026-04-08T18:22:33.143Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T18:22:33.143Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T18:22:33.386Z	Success: Build command completed
2026-04-08T18:22:33.605Z	Executing user deploy command: npm run deploy
2026-04-08T18:22:33.888Z	
2026-04-08T18:22:33.889Z	> deploy
2026-04-08T18:22:33.890Z	> npm run build && rm -rf .wrangler/deploy && (cd build/server && wrangler deploy --no-bundle)
2026-04-08T18:22:33.890Z	
2026-04-08T18:22:34.080Z	
2026-04-08T18:22:34.081Z	> build
2026-04-08T18:22:34.081Z	> react-router build
2026-04-08T18:22:34.081Z	
2026-04-08T18:22:36.207Z	Using Vite Environment API (experimental)
2026-04-08T18:22:36.211Z	vite v7.3.1 building client environment for production...
2026-04-08T18:22:36.278Z	transforming...
2026-04-08T18:22:43.991Z	✓ 2180 modules transformed.
2026-04-08T18:22:44.323Z	rendering chunks...
2026-04-08T18:22:44.468Z	computing gzip size...
2026-04-08T18:22:44.489Z	build/client/.assetsignore                           0.02 kB
2026-04-08T18:22:44.490Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T18:22:44.490Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T18:22:44.491Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T18:22:44.491Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T18:22:44.491Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T18:22:44.491Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T18:22:44.491Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T18:22:44.491Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T18:22:44.491Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T18:22:44.492Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T18:22:44.492Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T18:22:44.492Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T18:22:44.492Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T18:22:44.492Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T18:22:44.492Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T18:22:44.492Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T18:22:44.492Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T18:22:44.493Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T18:22:44.493Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T18:22:44.493Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T18:22:44.493Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T18:22:44.493Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T18:22:44.493Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T18:22:44.493Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T18:22:44.494Z	✓ built in 8.25s
2026-04-08T18:22:44.496Z	vite v7.3.1 building ssr environment for production...
2026-04-08T18:22:44.505Z	transforming...
2026-04-08T18:22:45.884Z	✓ 58 modules transformed.
2026-04-08T18:22:45.996Z	rendering chunks...
2026-04-08T18:22:46.095Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T18:22:46.096Z	build/server/wrangler.json                       1.23 kB
2026-04-08T18:22:46.100Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T18:22:46.100Z	build/server/index.js                            0.13 kB
2026-04-08T18:22:46.101Z	build/server/assets/worker-entry-DSh9KFgy.js   273.73 kB
2026-04-08T18:22:46.101Z	build/server/assets/server-build-CUiegrpJ.js   518.81 kB
2026-04-08T18:22:46.243Z	sh: 1: cd: can't cd to build/server
2026-04-08T18:22:46.262Z	Failed: error occurred while running deploy command