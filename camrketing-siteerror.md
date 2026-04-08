2026-04-08T18:31:00.929Z	Initializing build environment...
2026-04-08T18:31:00.929Z	Initializing build environment...
2026-04-08T18:32:50.795Z	Success: Finished initializing build environment
2026-04-08T18:32:52.229Z	Cloning repository...
2026-04-08T18:32:55.310Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-08T18:32:55.324Z	Installing project dependencies: npm clean-install --progress=false
2026-04-08T18:33:26.703Z	
2026-04-08T18:33:26.708Z	> postinstall
2026-04-08T18:33:26.709Z	> npm run cf-typegen
2026-04-08T18:33:26.709Z	
2026-04-08T18:33:27.213Z	
2026-04-08T18:33:27.213Z	> cf-typegen
2026-04-08T18:33:27.213Z	> wrangler types
2026-04-08T18:33:27.213Z	
2026-04-08T18:33:31.189Z	
2026-04-08T18:33:31.190Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T18:33:31.190Z	─────────────────────────────────────────────
2026-04-08T18:33:31.543Z	Generating project types...
2026-04-08T18:33:31.548Z	
2026-04-08T18:33:31.549Z	declare namespace Cloudflare {
2026-04-08T18:33:31.549Z		interface GlobalProps {
2026-04-08T18:33:31.549Z			mainModule: typeof import("./workers/app");
2026-04-08T18:33:31.549Z		}
2026-04-08T18:33:31.549Z		interface Env {
2026-04-08T18:33:31.550Z			API: Fetcher /* futurexa-api */;
2026-04-08T18:33:31.550Z		}
2026-04-08T18:33:31.550Z	}
2026-04-08T18:33:31.550Z	interface Env extends Cloudflare.Env {}
2026-04-08T18:33:31.550Z	
2026-04-08T18:33:31.550Z	Generating runtime types...
2026-04-08T18:33:31.550Z	
2026-04-08T18:33:37.465Z	Runtime types generated.
2026-04-08T18:33:37.465Z	
2026-04-08T18:33:37.466Z	
2026-04-08T18:33:37.470Z	✨ Types written to worker-configuration.d.ts
2026-04-08T18:33:37.471Z	
2026-04-08T18:33:37.476Z	📖 Read about runtime types
2026-04-08T18:33:37.476Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-08T18:33:37.476Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-08T18:33:37.476Z	
2026-04-08T18:33:37.736Z	
2026-04-08T18:33:37.736Z	added 171 packages, and audited 173 packages in 38s
2026-04-08T18:33:37.736Z	
2026-04-08T18:33:37.737Z	31 packages are looking for funding
2026-04-08T18:33:37.748Z	  run `npm fund` for details
2026-04-08T18:33:37.858Z	
2026-04-08T18:33:37.858Z	7 high severity vulnerabilities
2026-04-08T18:33:37.858Z	
2026-04-08T18:33:37.859Z	To address all issues, run:
2026-04-08T18:33:37.859Z	  npm audit fix
2026-04-08T18:33:37.859Z	
2026-04-08T18:33:37.859Z	Run `npm audit` for details.
2026-04-08T18:33:38.224Z	Executing user build command: npm run build
2026-04-08T18:33:39.016Z	
2026-04-08T18:33:39.019Z	> build
2026-04-08T18:33:39.019Z	> react-router build
2026-04-08T18:33:39.020Z	
2026-04-08T18:33:43.001Z	Using Vite Environment API (experimental)
2026-04-08T18:33:43.002Z	vite v7.3.1 building client environment for production...
2026-04-08T18:33:43.110Z	transforming...
2026-04-08T18:33:54.688Z	✓ 2180 modules transformed.
2026-04-08T18:33:55.123Z	rendering chunks...
2026-04-08T18:33:55.394Z	computing gzip size...
2026-04-08T18:33:56.021Z	build/client/.assetsignore                           0.02 kB
2026-04-08T18:33:56.021Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T18:33:56.022Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T18:33:56.022Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T18:33:56.022Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T18:33:56.022Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T18:33:56.024Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T18:33:56.024Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T18:33:56.024Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T18:33:56.025Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T18:33:56.025Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T18:33:56.025Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T18:33:56.025Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T18:33:56.025Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T18:33:56.025Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T18:33:56.026Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T18:33:56.026Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T18:33:56.026Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T18:33:56.026Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T18:33:56.026Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T18:33:56.026Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T18:33:56.026Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T18:33:56.026Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T18:33:56.026Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T18:33:56.027Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T18:33:56.030Z	✓ built in 12.96s
2026-04-08T18:33:56.030Z	vite v7.3.1 building ssr environment for production...
2026-04-08T18:33:56.050Z	transforming...
2026-04-08T18:34:04.360Z	✓ 2185 modules transformed.
2026-04-08T18:34:04.681Z	rendering chunks...
2026-04-08T18:34:05.129Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T18:34:05.134Z	build/server/wrangler.json                       1.23 kB
2026-04-08T18:34:05.136Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T18:34:05.137Z	build/server/index.js                            0.13 kB
2026-04-08T18:34:05.137Z	build/server/assets/worker-entry-Y4Xw63V2.js   273.78 kB
2026-04-08T18:34:05.137Z	build/server/assets/server-build-B5GnJVUT.js   951.93 kB
2026-04-08T18:34:05.137Z	✓ built in 9.08s
2026-04-08T18:34:05.480Z	Success: Build command completed
2026-04-08T18:34:06.149Z	Executing user deploy command: npm run deploy
2026-04-08T18:34:06.902Z	
2026-04-08T18:34:06.902Z	> deploy
2026-04-08T18:34:06.902Z	> npm run build && rm -rf .wrangler/deploy && wrangler deploy --config build/server/wrangler.json
2026-04-08T18:34:06.902Z	
2026-04-08T18:34:07.293Z	
2026-04-08T18:34:07.293Z	> build
2026-04-08T18:34:07.293Z	> react-router build
2026-04-08T18:34:07.293Z	
2026-04-08T18:34:10.818Z	Using Vite Environment API (experimental)
2026-04-08T18:34:10.832Z	vite v7.3.1 building client environment for production...
2026-04-08T18:34:11.058Z	transforming...
2026-04-08T18:34:23.266Z	✓ 2180 modules transformed.
2026-04-08T18:34:23.827Z	rendering chunks...
2026-04-08T18:34:24.083Z	computing gzip size...
2026-04-08T18:34:24.118Z	build/client/.assetsignore                           0.02 kB
2026-04-08T18:34:24.125Z	build/client/.vite/manifest.json                     6.26 kB │ gzip:  0.83 kB
2026-04-08T18:34:24.125Z	build/client/assets/root-DJsnp10p.css               74.70 kB │ gzip: 12.88 kB
2026-04-08T18:34:24.126Z	build/client/assets/arrow-left-f7CAtGPE.js           0.17 kB │ gzip:  0.16 kB
2026-04-08T18:34:24.126Z	build/client/assets/circle-check-BueJIrKw.js         0.18 kB │ gzip:  0.17 kB
2026-04-08T18:34:24.126Z	build/client/assets/globe-Bbe037hU.js                0.24 kB │ gzip:  0.19 kB
2026-04-08T18:34:24.126Z	build/client/assets/zap-CCBxkCZR.js                  0.67 kB │ gzip:  0.40 kB
2026-04-08T18:34:24.126Z	build/client/assets/root-BxQjTIN7.js                 1.14 kB │ gzip:  0.65 kB
2026-04-08T18:34:24.126Z	build/client/assets/service-detail-5oqXVott.js       2.96 kB │ gzip:  1.34 kB
2026-04-08T18:34:24.129Z	build/client/assets/case-study-detail-CqlKaC7X.js    3.12 kB │ gzip:  1.35 kB
2026-04-08T18:34:24.130Z	build/client/assets/case-studies-dgWb0oXo.js         3.81 kB │ gzip:  1.71 kB
2026-04-08T18:34:24.130Z	build/client/assets/blog-Bf9mfKZ-.js                 4.00 kB │ gzip:  1.71 kB
2026-04-08T18:34:24.131Z	build/client/assets/pricing-qpY7eoKe.js              4.18 kB │ gzip:  1.78 kB
2026-04-08T18:34:24.132Z	build/client/assets/blog-post-DccY-Isb.js            4.55 kB │ gzip:  1.84 kB
2026-04-08T18:34:24.132Z	build/client/assets/privacy-BC2hAQJn.js              4.84 kB │ gzip:  1.70 kB
2026-04-08T18:34:24.132Z	build/client/assets/about-BDmqRIdw.js                4.95 kB │ gzip:  1.99 kB
2026-04-08T18:34:24.132Z	build/client/assets/resources-B2I8JbKj.js            5.04 kB │ gzip:  2.08 kB
2026-04-08T18:34:24.132Z	build/client/assets/industries-aQb9DJgW.js           5.18 kB │ gzip:  2.06 kB
2026-04-08T18:34:24.132Z	build/client/assets/services-cLl-7sAG.js             5.91 kB │ gzip:  2.41 kB
2026-04-08T18:34:24.133Z	build/client/assets/terms-CjZPhFqI.js                6.13 kB │ gzip:  2.11 kB
2026-04-08T18:34:24.133Z	build/client/assets/contact-Cyf7Edhf.js              7.51 kB │ gzip:  2.21 kB
2026-04-08T18:34:24.133Z	build/client/assets/home-CtPLyWz3.js                20.30 kB │ gzip:  4.99 kB
2026-04-08T18:34:24.133Z	build/client/assets/chunk-LFPYN7LY-CVywkgeQ.js     124.95 kB │ gzip: 42.10 kB
2026-04-08T18:34:24.133Z	build/client/assets/Layout-CFrXplmH.js             134.57 kB │ gzip: 44.43 kB
2026-04-08T18:34:24.133Z	build/client/assets/entry.client-Dyqq_xvW.js       190.54 kB │ gzip: 60.05 kB
2026-04-08T18:34:24.134Z	✓ built in 13.19s
2026-04-08T18:34:24.134Z	vite v7.3.1 building ssr environment for production...
2026-04-08T18:34:24.134Z	transforming...
2026-04-08T18:34:31.265Z	✓ 2185 modules transformed.
2026-04-08T18:34:31.454Z	rendering chunks...
2026-04-08T18:34:31.661Z	build/server/.vite/manifest.json                 0.72 kB
2026-04-08T18:34:31.661Z	build/server/wrangler.json                       1.23 kB
2026-04-08T18:34:31.661Z	build/server/assets/server-build-DJsnp10p.css   74.70 kB
2026-04-08T18:34:31.661Z	build/server/index.js                            0.13 kB
2026-04-08T18:34:31.661Z	build/server/assets/worker-entry-Y4Xw63V2.js   273.78 kB
2026-04-08T18:34:31.661Z	build/server/assets/server-build-B5GnJVUT.js   951.93 kB
2026-04-08T18:34:31.663Z	✓ built in 7.54s
2026-04-08T18:34:33.362Z	
2026-04-08T18:34:33.364Z	 ⛅️ wrangler 4.72.0 (update available 4.81.0)
2026-04-08T18:34:33.365Z	─────────────────────────────────────────────
2026-04-08T18:34:33.414Z	
2026-04-08T18:34:33.418Z	Cloudflare collects anonymous telemetry about your usage of Wrangler. Learn more at https://github.com/cloudflare/workers-sdk/tree/main/packages/wrangler/telemetry.md
2026-04-08T18:34:34.672Z	Attaching additional modules:
2026-04-08T18:34:34.679Z	┌─────────────────────────────────┬──────┬─────────────┐
2026-04-08T18:34:34.679Z	│ Name                            │ Type │ Size        │
2026-04-08T18:34:34.679Z	├─────────────────────────────────┼──────┼─────────────┤
2026-04-08T18:34:34.679Z	│ assets/server-build-B5GnJVUT.js │ esm  │ 929.62 KiB  │
2026-04-08T18:34:34.679Z	├─────────────────────────────────┼──────┼─────────────┤
2026-04-08T18:34:34.679Z	│ assets/worker-entry-Y4Xw63V2.js │ esm  │ 267.36 KiB  │
2026-04-08T18:34:34.679Z	├─────────────────────────────────┼──────┼─────────────┤
2026-04-08T18:34:34.679Z	│ Total (2 modules)               │      │ 1196.98 KiB │
2026-04-08T18:34:34.680Z	└─────────────────────────────────┴──────┴─────────────┘
2026-04-08T18:34:34.680Z	🌀 Building list of assets...
2026-04-08T18:34:34.685Z	✨ Read 28 files from the assets directory /opt/buildhome/repo/marketing-site/build/client
2026-04-08T18:34:34.717Z	🌀 Starting asset upload...
2026-04-08T18:34:37.221Z	🌀 Found 22 new or modified static assets to upload. Proceeding with upload...
2026-04-08T18:34:37.223Z	+ /assets/arrow-left-f7CAtGPE.js
2026-04-08T18:34:37.223Z	+ /assets/zap-CCBxkCZR.js
2026-04-08T18:34:37.223Z	+ /assets/case-study-detail-CqlKaC7X.js
2026-04-08T18:34:37.223Z	+ /assets/pricing-qpY7eoKe.js
2026-04-08T18:34:37.223Z	+ /assets/about-BDmqRIdw.js
2026-04-08T18:34:37.223Z	+ /assets/services-cLl-7sAG.js
2026-04-08T18:34:37.223Z	+ /assets/contact-Cyf7Edhf.js
2026-04-08T18:34:37.223Z	+ /assets/Layout-CFrXplmH.js
2026-04-08T18:34:37.223Z	+ /assets/circle-check-BueJIrKw.js
2026-04-08T18:34:37.223Z	+ /assets/root-BxQjTIN7.js
2026-04-08T18:34:37.223Z	+ /assets/case-studies-dgWb0oXo.js
2026-04-08T18:34:37.224Z	+ /assets/blog-post-DccY-Isb.js
2026-04-08T18:34:37.224Z	+ /assets/resources-B2I8JbKj.js
2026-04-08T18:34:37.224Z	+ /assets/manifest-ab7e8d1a.js
2026-04-08T18:34:37.224Z	+ /assets/home-CtPLyWz3.js
2026-04-08T18:34:37.225Z	+ /assets/globe-Bbe037hU.js
2026-04-08T18:34:37.226Z	+ /assets/service-detail-5oqXVott.js
2026-04-08T18:34:37.226Z	+ /assets/blog-Bf9mfKZ-.js
2026-04-08T18:34:37.226Z	+ /assets/privacy-BC2hAQJn.js
2026-04-08T18:34:37.226Z	+ /assets/industries-aQb9DJgW.js
2026-04-08T18:34:37.226Z	+ /assets/terms-CjZPhFqI.js
2026-04-08T18:34:37.227Z	+ /assets/root-DJsnp10p.css
2026-04-08T18:34:38.537Z	Uploaded 7 of 22 assets
2026-04-08T18:34:38.538Z	Uploaded 14 of 22 assets
2026-04-08T18:34:38.955Z	Uploaded 22 of 22 assets
2026-04-08T18:34:38.956Z	✨ Success! Uploaded 22 files (4 already uploaded) (1.73 sec)
2026-04-08T18:34:38.957Z	
2026-04-08T18:34:39.000Z	Total Upload: 1197.10 KiB / gzip: 237.18 KiB
2026-04-08T18:34:39.490Z	Your Worker has access to the following bindings:
2026-04-08T18:34:39.492Z	Binding                     Resource      
2026-04-08T18:34:39.492Z	env.API (futurexa-api)      Worker        
2026-04-08T18:34:39.492Z	
2026-04-08T18:34:39.495Z	
2026-04-08T18:34:39.590Z	✘ [ERROR] A request to the Cloudflare API (/accounts/978b999641bc15882f5671c42285d97e/workers/scripts/marketingsite/versions) failed.
2026-04-08T18:34:39.590Z	
2026-04-08T18:34:39.590Z	  Service binding 'API' references Worker 'futurexa-api' which was not found. Verify the Worker exists in your account and that the service name in your configuration is correct. [code: 10143]
2026-04-08T18:34:39.590Z	  To learn more about this error, visit: https://developers.cloudflare.com/workers/configuration/bindings/about-service-bindings/
2026-04-08T18:34:39.590Z	
2026-04-08T18:34:39.590Z	  
2026-04-08T18:34:39.590Z	  If you think this is a bug, please open an issue at: https://github.com/cloudflare/workers-sdk/issues/new/choose
2026-04-08T18:34:39.590Z	
2026-04-08T18:34:39.590Z	
2026-04-08T18:34:39.625Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-08_18-34-32_885.log"
2026-04-08T18:34:39.729Z	Failed: error occurred while running deploy command