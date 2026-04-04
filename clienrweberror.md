2026-04-04T11:31:20.580Z	Initializing build environment...
2026-04-04T11:31:21.972Z	Success: Finished initializing build environment
2026-04-04T11:31:22.917Z	Cloning repository...
2026-04-04T11:31:24.249Z	Restoring from dependencies cache
2026-04-04T11:31:24.251Z	Restoring from build output cache
2026-04-04T11:31:24.254Z	Detected the following tools from environment: npm@10.9.2, nodejs@22.16.0
2026-04-04T11:31:24.399Z	Installing project dependencies: npm clean-install --progress=false
2026-04-04T11:31:31.339Z	
2026-04-04T11:31:31.340Z	> postinstall
2026-04-04T11:31:31.340Z	> npm run cf-typegen
2026-04-04T11:31:31.340Z	
2026-04-04T11:31:31.526Z	
2026-04-04T11:31:31.526Z	> cf-typegen
2026-04-04T11:31:31.527Z	> wrangler types
2026-04-04T11:31:31.527Z	
2026-04-04T11:31:32.814Z	
2026-04-04T11:31:32.815Z	 ⛅️ wrangler 4.76.0 (update available 4.80.0)
2026-04-04T11:31:32.815Z	─────────────────────────────────────────────
2026-04-04T11:31:32.868Z	Generating project types...
2026-04-04T11:31:32.868Z	
2026-04-04T11:31:32.872Z	declare namespace Cloudflare {
2026-04-04T11:31:32.872Z		interface GlobalProps {
2026-04-04T11:31:32.872Z			mainModule: typeof import("./workers/app");
2026-04-04T11:31:32.873Z		}
2026-04-04T11:31:32.873Z		interface Env {
2026-04-04T11:31:32.873Z			API: Fetcher /* futurexa-api */;
2026-04-04T11:31:32.873Z		}
2026-04-04T11:31:32.873Z	}
2026-04-04T11:31:32.874Z	interface Env extends Cloudflare.Env {}
2026-04-04T11:31:32.874Z	
2026-04-04T11:31:32.874Z	Generating runtime types...
2026-04-04T11:31:32.874Z	
2026-04-04T11:31:32.883Z	Runtime types generated.
2026-04-04T11:31:32.883Z	
2026-04-04T11:31:32.883Z	
2026-04-04T11:31:32.889Z	✨ Types written to worker-configuration.d.ts
2026-04-04T11:31:32.890Z	
2026-04-04T11:31:32.890Z	📖 Read about runtime types
2026-04-04T11:31:32.890Z	https://developers.cloudflare.com/workers/languages/typescript/#generate-types
2026-04-04T11:31:32.890Z	📣 Remember to rerun 'wrangler types' after you change your wrangler.jsonc file.
2026-04-04T11:31:32.890Z	
2026-04-04T11:31:33.029Z	
2026-04-04T11:31:33.029Z	added 171 packages, and audited 172 packages in 8s
2026-04-04T11:31:33.032Z	
2026-04-04T11:31:33.033Z	28 packages are looking for funding
2026-04-04T11:31:33.033Z	  run `npm fund` for details
2026-04-04T11:31:33.034Z	
2026-04-04T11:31:33.034Z	2 high severity vulnerabilities
2026-04-04T11:31:33.034Z	
2026-04-04T11:31:33.034Z	To address all issues, run:
2026-04-04T11:31:33.034Z	  npm audit fix
2026-04-04T11:31:33.034Z	
2026-04-04T11:31:33.034Z	Run `npm audit` for details.
2026-04-04T11:31:33.229Z	Executing user build command: npm run build
2026-04-04T11:31:33.473Z	
2026-04-04T11:31:33.473Z	> build
2026-04-04T11:31:33.474Z	> react-router build
2026-04-04T11:31:33.475Z	
2026-04-04T11:31:35.140Z	Using Vite Environment API (experimental)
2026-04-04T11:31:35.145Z	vite v7.3.1 building client environment for production...
2026-04-04T11:31:35.193Z	transforming...
2026-04-04T11:31:41.725Z	✓ 2231 modules transformed.
2026-04-04T11:31:42.045Z	rendering chunks...
2026-04-04T11:31:42.288Z	computing gzip size...
2026-04-04T11:31:42.328Z	build/client/.assetsignore                                    0.02 kB
2026-04-04T11:31:42.330Z	build/client/.vite/manifest.json                             15.91 kB │ gzip:  1.85 kB
2026-04-04T11:31:42.330Z	build/client/assets/root-4MYEj4A6.css                        73.96 kB │ gzip: 11.32 kB
2026-04-04T11:31:42.331Z	build/client/assets/index-HivFAjpw.js                         0.11 kB │ gzip:  0.12 kB
2026-04-04T11:31:42.331Z	build/client/assets/favicon-DCbnm5AG.js                       0.11 kB │ gzip:  0.12 kB
2026-04-04T11:31:42.331Z	build/client/assets/loader-circle-BX6xxg64.js                 0.15 kB │ gzip:  0.16 kB
2026-04-04T11:31:42.331Z	build/client/assets/plus-BH0tawo2.js                          0.17 kB │ gzip:  0.16 kB
2026-04-04T11:31:42.332Z	build/client/assets/x-FkZwO_bk.js                             0.17 kB │ gzip:  0.16 kB
2026-04-04T11:31:42.332Z	build/client/assets/clock-D5lS_qLO.js                         0.18 kB │ gzip:  0.17 kB
2026-04-04T11:31:42.333Z	build/client/assets/arrow-left-FdvS9lIu.js                    0.18 kB │ gzip:  0.17 kB
2026-04-04T11:31:42.333Z	build/client/assets/search-DPhDL2Hc.js                        0.18 kB │ gzip:  0.18 kB
2026-04-04T11:31:42.333Z	build/client/assets/circle-check-VpsIF_8U.js                  0.19 kB │ gzip:  0.18 kB
2026-04-04T11:31:42.335Z	build/client/assets/user-W2x5tPQR.js                          0.20 kB │ gzip:  0.19 kB
2026-04-04T11:31:42.335Z	build/client/assets/mail-BdpmTzG4.js                          0.23 kB │ gzip:  0.21 kB
2026-04-04T11:31:42.335Z	build/client/assets/square-check-big-CGqcIBHv.js              0.24 kB │ gzip:  0.21 kB
2026-04-04T11:31:42.335Z	build/client/assets/download-BAQdjz5_.js                      0.24 kB │ gzip:  0.20 kB
2026-04-04T11:31:42.335Z	build/client/assets/circle-alert-DPUdidcK.js                  0.26 kB │ gzip:  0.20 kB
2026-04-04T11:31:42.335Z	build/client/assets/eye-DQTgNoVQ.js                           0.26 kB │ gzip:  0.21 kB
2026-04-04T11:31:42.335Z	build/client/assets/funnel-DyP7wgLi.js                        0.26 kB │ gzip:  0.22 kB
2026-04-04T11:31:42.335Z	build/client/assets/shield-rUg-4enE.js                        0.28 kB │ gzip:  0.23 kB
2026-04-04T11:31:42.335Z	build/client/assets/image-FhoPb94A.js                         0.28 kB │ gzip:  0.23 kB
2026-04-04T11:31:42.335Z	build/client/assets/send-DbdFkpB0.js                          0.30 kB │ gzip:  0.24 kB
2026-04-04T11:31:42.336Z	build/client/assets/lock-CRhp7Cxx.js                          0.34 kB │ gzip:  0.26 kB
2026-04-04T11:31:42.336Z	build/client/assets/file-text-CqkXWBu7.js                     0.40 kB │ gzip:  0.26 kB
2026-04-04T11:31:42.336Z	build/client/assets/layers-Bysg5YQk.js                        0.43 kB │ gzip:  0.25 kB
2026-04-04T11:31:42.339Z	build/client/assets/jsx-runtime-u17CrQMm.js                   0.48 kB │ gzip:  0.31 kB
2026-04-04T11:31:42.340Z	build/client/assets/trash-2-BR5epLPz.js                       0.59 kB │ gzip:  0.31 kB
2026-04-04T11:31:42.340Z	build/client/assets/github-D71mrYOK.js                        0.80 kB │ gzip:  0.46 kB
2026-04-04T11:31:42.340Z	build/client/assets/root-B1gZRgVy.js                          1.00 kB │ gzip:  0.56 kB
2026-04-04T11:31:42.340Z	build/client/assets/createLucideIcon-CONV3TPq.js              1.21 kB │ gzip:  0.70 kB
2026-04-04T11:31:42.340Z	build/client/assets/auth-callback-8LvjqgaS.js                 1.39 kB │ gzip:  0.83 kB
2026-04-04T11:31:42.340Z	build/client/assets/dashboard-settings-Drfg_ODs.js            1.75 kB │ gzip:  0.87 kB
2026-04-04T11:31:42.341Z	build/client/assets/ticket-BgLqCHqj.js                        2.89 kB │ gzip:  1.21 kB
2026-04-04T11:31:42.341Z	build/client/assets/dashboard-project-CvTI75jv.js             2.95 kB │ gzip:  1.29 kB
2026-04-04T11:31:42.342Z	build/client/assets/DashboardLayout-DG95FcoW.js               3.70 kB │ gzip:  1.55 kB
2026-04-04T11:31:42.343Z	build/client/assets/dashboard-tasks-DBD6HfLP.js               3.83 kB │ gzip:  1.62 kB
2026-04-04T11:31:42.343Z	build/client/assets/index-ol2CPRtJ.js                         3.96 kB │ gzip:  1.89 kB
2026-04-04T11:31:42.344Z	build/client/assets/dashboard-deployments-DuNxWC8o.js         5.31 kB │ gzip:  2.14 kB
2026-04-04T11:31:42.345Z	build/client/assets/dashboard-activity-821tkKnk.js            6.11 kB │ gzip:  2.27 kB
2026-04-04T11:31:42.346Z	build/client/assets/dashboard-billing-ihq-Z69Y.js             8.07 kB │ gzip:  2.50 kB
2026-04-04T11:31:42.346Z	build/client/assets/TasksPanel-D4017Hzm.js                    8.86 kB │ gzip:  2.69 kB
2026-04-04T11:31:42.346Z	build/client/assets/signin-CDs97zzz.js                        9.27 kB │ gzip:  3.06 kB
2026-04-04T11:31:42.347Z	build/client/assets/SettingsPanel-CFaKTCNf.js                11.54 kB │ gzip:  2.94 kB
2026-04-04T11:31:42.347Z	build/client/assets/signup-Dz6X03NT.js                       11.72 kB │ gzip:  3.46 kB
2026-04-04T11:31:42.347Z	build/client/assets/dashboard-milestones-CqgU0TnE.js         12.33 kB │ gzip:  3.75 kB
2026-04-04T11:31:42.347Z	build/client/assets/dashboard-ticket-qjUjIwhD.js             19.17 kB │ gzip:  5.21 kB
2026-04-04T11:31:42.348Z	build/client/assets/dashboard-milestone-detail-DnnGZ4Y0.js   19.48 kB │ gzip:  5.59 kB
2026-04-04T11:31:42.348Z	build/client/assets/dashboard-files-BJnvWa47.js              21.23 kB │ gzip:  5.81 kB
2026-04-04T11:31:42.348Z	build/client/assets/dashboard-BJlrFDW4.js                    49.17 kB │ gzip: 11.32 kB
2026-04-04T11:31:42.349Z	build/client/assets/proxy-D4vSSnff.js                       122.05 kB │ gzip: 39.86 kB
2026-04-04T11:31:42.349Z	build/client/assets/chunk-LFPYN7LY-0XJBQlCp.js              124.49 kB │ gzip: 41.94 kB
2026-04-04T11:31:42.349Z	build/client/assets/supabase-C1DDbkuK.js                    173.61 kB │ gzip: 45.99 kB
2026-04-04T11:31:42.349Z	build/client/assets/entry.client-D6p7yDti.js                190.58 kB │ gzip: 60.07 kB
2026-04-04T11:31:42.349Z	✓ built in 7.16s
2026-04-04T11:31:42.349Z	vite v7.3.1 building ssr environment for production...
2026-04-04T11:31:42.349Z	transforming...
2026-04-04T11:31:46.273Z	✓ 2233 modules transformed.
2026-04-04T11:31:46.452Z	rendering chunks...
2026-04-04T11:31:46.716Z	build/server/.vite/manifest.json                   0.72 kB
2026-04-04T11:31:46.716Z	build/server/wrangler.json                         1.22 kB
2026-04-04T11:31:46.716Z	build/server/assets/server-build-4MYEj4A6.css     73.96 kB
2026-04-04T11:31:46.716Z	build/server/index.js                              0.13 kB
2026-04-04T11:31:46.716Z	build/server/assets/worker-entry-CphK6YWU.js     273.86 kB
2026-04-04T11:31:46.716Z	build/server/assets/server-build-qHdBP8x2.js   1,697.19 kB
2026-04-04T11:31:46.716Z	✓ built in 4.38s
2026-04-04T11:31:46.811Z	Success: Build command completed
2026-04-04T11:31:46.913Z	Executing user deploy command: npx wrangler versions upload
2026-04-04T11:31:48.069Z	
2026-04-04T11:31:48.070Z	 ⛅️ wrangler 4.76.0 (update available 4.80.0)
2026-04-04T11:31:48.070Z	─────────────────────────────────────────────
2026-04-04T11:31:48.070Z	Using redirected Wrangler configuration.
2026-04-04T11:31:48.070Z	 - Configuration being used: "build/server/wrangler.json"
2026-04-04T11:31:48.070Z	 - Original user's configuration: "wrangler.jsonc"
2026-04-04T11:31:48.070Z	 - Deploy configuration file: ".wrangler/deploy/config.json"
2026-04-04T11:31:48.209Z	▲ [WARNING] Failed to match Worker name. Your config file is using the Worker name "client-web", but the CI system expected "clientweb". Overriding using the CI provided Worker name. Workers Builds connected builds will attempt to open a pull request to resolve this config name mismatch.
2026-04-04T11:31:48.210Z	
2026-04-04T11:31:48.210Z	
2026-04-04T11:31:48.660Z	▲ [WARNING] You are about to upload a Worker Version that was last published via the Cloudflare Dashboard.
2026-04-04T11:31:48.660Z	
2026-04-04T11:31:48.660Z	  Edits that have been made via the dashboard will be overridden by your local code and config.
2026-04-04T11:31:48.660Z	
2026-04-04T11:31:48.660Z	
2026-04-04T11:31:48.660Z	? Would you like to continue?
2026-04-04T11:31:48.660Z	🤖 Using fallback value in non-interactive context: yes
2026-04-04T11:31:48.668Z	Attaching additional modules:
2026-04-04T11:31:48.673Z	┌─────────────────────────────────┬──────┬─────────────┐
2026-04-04T11:31:48.674Z	│ Name                            │ Type │ Size        │
2026-04-04T11:31:48.674Z	├─────────────────────────────────┼──────┼─────────────┤
2026-04-04T11:31:48.674Z	│ assets/server-build-qHdBP8x2.js │ esm  │ 1657.41 KiB │
2026-04-04T11:31:48.674Z	├─────────────────────────────────┼──────┼─────────────┤
2026-04-04T11:31:48.674Z	│ assets/worker-entry-CphK6YWU.js │ esm  │ 267.44 KiB  │
2026-04-04T11:31:48.674Z	├─────────────────────────────────┼──────┼─────────────┤
2026-04-04T11:31:48.674Z	│ Total (2 modules)               │      │ 1924.85 KiB │
2026-04-04T11:31:48.674Z	└─────────────────────────────────┴──────┴─────────────┘
2026-04-04T11:31:48.674Z	🌀 Building list of assets...
2026-04-04T11:31:48.675Z	✨ Read 54 files from the assets directory /opt/buildhome/repo/client-web/build/client
2026-04-04T11:31:48.694Z	🌀 Starting asset upload...
2026-04-04T11:31:50.415Z	No updated asset files to upload. Proceeding with deployment...
2026-04-04T11:31:50.460Z	Total Upload: 1924.97 KiB / gzip: 364.62 KiB
2026-04-04T11:31:51.075Z	Your Worker has access to the following bindings:
2026-04-04T11:31:51.076Z	Binding                     Resource      
2026-04-04T11:31:51.076Z	env.API (futurexa-api)      Worker        
2026-04-04T11:31:51.076Z	
2026-04-04T11:31:51.078Z	
2026-04-04T11:31:51.081Z	✘ [ERROR] A request to the Cloudflare API (/accounts/978b999641bc15882f5671c42285d97e/workers/scripts/clientweb/versions) failed.
2026-04-04T11:31:51.081Z	
2026-04-04T11:31:51.081Z	  Service binding 'API' references Worker 'futurexa-api' which was not found. Verify the Worker exists in your account and that the service name in your configuration is correct. [code: 10143]
2026-04-04T11:31:51.081Z	  To learn more about this error, visit: https://developers.cloudflare.com/workers/configuration/bindings/about-service-bindings/
2026-04-04T11:31:51.081Z	
2026-04-04T11:31:51.081Z	  
2026-04-04T11:31:51.082Z	  If you think this is a bug, please open an issue at: https://github.com/cloudflare/workers-sdk/issues/new/choose
2026-04-04T11:31:51.082Z	
2026-04-04T11:31:51.082Z	
2026-04-04T11:31:51.087Z	🪵  Logs were written to "/opt/buildhome/.config/.wrangler/logs/wrangler-2026-04-04_11-31-47_847.log"
2026-04-04T11:31:51.128Z	Failed: error occurred while running deploy command