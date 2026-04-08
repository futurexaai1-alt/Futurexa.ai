const fs = require('fs');

const sourceHome = 'C:/Users/mhdtb/OneDrive/Desktop/It-solutions/client/app/routes/home.tsx';
const targetHome = 'c:/Users/mhdtb/OneDrive/Desktop/Futurexa.ai/marketing-site/app/routes/home.tsx';

let homeContent = fs.readFileSync(sourceHome, 'utf-8');
homeContent = homeContent.replace(/NexEdge/g, 'Futurexa.ai');
homeContent = 'import { Navbar, Footer } from \'../components/Layout\';\n' + homeContent;
homeContent = homeContent.replace('<div id="home" className="landing">', '<div id="home" className="landing">\n      <Navbar />');
homeContent = homeContent.replace(/<\/div>\s*\);\s*}\s*$/, '      <Footer />\n    </div>\n  );\n}\n');

fs.writeFileSync(targetHome, homeContent, 'utf-8');

const sourceCss = 'C:/Users/mhdtb/OneDrive/Desktop/It-solutions/client/app/app.css';
const targetCss = 'c:/Users/mhdtb/OneDrive/Desktop/Futurexa.ai/marketing-site/app/app.css';

let cssContent = fs.readFileSync(sourceCss, 'utf-8');
let targetCssContent = fs.readFileSync(targetCss, 'utf-8');

if (!targetCssContent.includes('.landing-section')) {
    fs.writeFileSync(targetCss, targetCssContent + '\n\n' + cssContent, 'utf-8');
}
console.log('Replication complete!');
