const puppeteer = require("puppeteer");
const fs = require("fs");
const path = require("path");

const os = require("os");

const outDir = path.resolve(__dirname, "../../screenshots/before_face_upgrade");
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function takeScreenshots() {
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    userDataDir: path.join(os.tmpdir(), "puppeteer_profile_" + Date.now()),
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    const routes = [
      { name: "landing", url: "http://localhost:3000/" },
      { name: "login", url: "http://localhost:3000/login" },
      { name: "dashboard", url: "http://localhost:3000/dashboard" },
      { name: "cases", url: "http://localhost:3000/cases" },
      { name: "suspect_sketch", url: "http://localhost:3000/suspect-sketch" },
      { name: "crime_scene", url: "http://localhost:3000/scene-sketch" },
      { name: "video_recon", url: "http://localhost:3000/video-recon" },
      { name: "evidence_gallery", url: "http://localhost:3000/evidence" },
      { name: "reports", url: "http://localhost:3000/reports" },
      { name: "admin", url: "http://localhost:3000/admin" }
    ];

    // Login first
    console.log("Authenticating...");
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
    await page.$eval("input[type=email]", (el) => (el.value = ""));
    await page.type("input[type=email]", "marcus.vance@sketchforce.gov");
    await page.$eval("input[type=password]", (el) => (el.value = ""));
    await page.type("input[type=password]", "police2026");
    const loginBtn = await page.waitForSelector("form button[type=submit]");
    await loginBtn.click();
    await page.waitForFunction(() => window.location.pathname.includes("/dashboard"), { timeout: 10000 });
    console.log("Logged in successfully!");

    // Capture desktop
    for (const r of routes) {
      await page.setViewport({ width: 1280, height: 800 });
      await page.goto(r.url, { waitUntil: "networkidle2" });
      await new Promise(res => setTimeout(res, 800));
      await page.screenshot({ path: path.join(outDir, `${r.name}_desktop.png`), fullPage: false });
      console.log(`Saved ${r.name}_desktop.png`);

      // Mobile
      await page.setViewport({ width: 390, height: 844, isMobile: true, hasTouch: true });
      await new Promise(res => setTimeout(res, 400));
      await page.screenshot({ path: path.join(outDir, `${r.name}_mobile.png`), fullPage: false });
      console.log(`Saved ${r.name}_mobile.png`);
    }

    console.log("All before-screenshots captured successfully!");
  } catch (err) {
    console.error("Error capturing screenshots:", err);
  } finally {
    await browser.close();
  }
}

takeScreenshots();
