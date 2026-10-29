const path = require('path');
const puppeteer = require(path.join(__dirname, '../frontend/node_modules/puppeteer'));
const fs = require('fs');

const routes = [
  { name: 'landing', path: '/' },
  { name: 'login', path: '/login' },
  { name: 'dashboard', path: '/dashboard' },
  { name: 'cases_list', path: '/cases' },
  { name: 'case_detail', path: '/cases/1' },
  { name: 'suspect_sketch', path: '/suspect-sketch' },
  { name: 'crime_scene', path: '/scene-sketch' },
  { name: 'video_recon', path: '/video-recon' },
  { name: 'gallery', path: '/gallery' },
  { name: 'reports', path: '/reports?case_id=1' },
  { name: 'admin', path: '/admin' },
  { name: 'ethics', path: '/ethics' },
  { name: 'faq', path: '/faq' },
  { name: 'not_found', path: '/route-does-not-exist' },
];

async function capture(folder) {
  const targetDir = path.join(__dirname, '..', 'screenshots', folder);
  if (!fs.existsSync(targetDir)) {
    fs.mkdirSync(targetDir, { recursive: true });
  }

  const browser = await puppeteer.launch({
    executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();

  // Desktop captures
  await page.setViewport({ width: 1440, height: 900 });
  for (const r of routes) {
    try {
      await page.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle2', timeout: 10000 });
      await new Promise(res => setTimeout(res, 500));
      await page.screenshot({ path: path.join(targetDir, `${r.name}_desktop.png`), fullPage: false });
      console.log(`[${folder}] Captured desktop: ${r.name}`);
    } catch (e) {
      console.error(`Failed ${r.name} desktop:`, e.message);
    }
  }

  // Mobile captures
  await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
  for (const r of routes) {
    try {
      await page.goto(`http://localhost:3000${r.path}`, { waitUntil: 'networkidle2', timeout: 10000 });
      await new Promise(res => setTimeout(res, 500));
      await page.screenshot({ path: path.join(targetDir, `${r.name}_mobile.png`), fullPage: false });
      console.log(`[${folder}] Captured mobile: ${r.name}`);
    } catch (e) {
      console.error(`Failed ${r.name} mobile:`, e.message);
    }
  }

  await browser.close();
  console.log(`All ${folder} screenshots captured successfully.`);
}

const targetFolder = process.argv[2] || 'before';
capture(targetFolder);
