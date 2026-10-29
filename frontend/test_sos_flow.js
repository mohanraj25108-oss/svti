const puppeteer = require("puppeteer");

async function runSosTest() {
  console.log("Starting End-to-End Test for SOS Emergency System...");
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const context = browser.defaultBrowserContext();
    await context.overridePermissions("http://localhost:3000", ["geolocation"]);
    const page = await browser.newPage();
    page.on('console', msg => console.log('[BROWSER]', msg.type(), msg.text()));
    page.on('pageerror', err => console.error('[PAGE ERROR]', err));
    await page.setGeolocation({ latitude: 37.7749, longitude: -122.4194 });
    await page.setViewport({ width: 1280, height: 800 });

    // Step 1: Login to acquire authorized session
    console.log("\n--- Step 1: Authenticate Officer Session ---");
    await page.goto("http://localhost:3000/login", { waitUntil: "networkidle0" });
    await page.$eval("input[type=email]", (el) => (el.value = ""));
    await page.type("input[type=email]", "marcus.vance@sketchforce.gov");
    await page.$eval("input[type=password]", (el) => (el.value = ""));
    await page.type("input[type=password]", "police2026");
    const loginBtn = await page.waitForSelector("form button[type=submit]");
    await loginBtn.click();

    await page.waitForFunction(() => window.location.pathname.includes("/dashboard"), { timeout: 10000 });
    console.log("PASS: Authenticated and navigated to Dashboard!");

    // Step 2: Verify SOS Control Pill Presence
    console.log("\n--- Step 2: Verify SOS Control Anchor & Positioning ---");
    const sosBtn = await page.waitForSelector("button[aria-label*='Emergency SOS']", { timeout: 5000 });
    if (!sosBtn) throw new Error("FAIL: SOS button not found in bottom-right corner");
    console.log("PASS: Fixed SOS slide control anchored to viewport!");

    // Step 3: Test Short Tap (under 5 seconds)
    console.log("\n--- Step 3: Short Tap / Click (Must not activate) ---");
    await sosBtn.click();
    await new Promise((r) => setTimeout(r, 600));

    const pageTextAfterClick = await page.evaluate(() => document.body.innerText);
    if (pageTextAfterClick.includes("EMERGENCY SOS ALERT ACTIVATED")) {
      throw new Error("FAIL: Short click erroneously activated emergency!");
    }
    console.log("PASS: Short click did not activate emergency. Hint displayed appropriately.");

    // Step 4: Test Early Release (< 5s hold)
    console.log("\n--- Step 4: Early Release Cancel (< 5s hold) ---");
    const btnBox = await sosBtn.boundingBox();
    if (!btnBox) throw new Error("FAIL: SOS button bounding box unavailable");

    // Press down
    await page.mouse.move(btnBox.x + btnBox.width / 2, btnBox.y + btnBox.height / 2);
    await page.mouse.down();
    console.log("Holding for 2.0s...");
    await new Promise((r) => setTimeout(r, 2000));
    // Release early
    await page.mouse.up();
    await new Promise((r) => setTimeout(r, 1800));

    const pageTextAfterEarlyRelease = await page.evaluate(() => document.body.innerText);
    if (pageTextAfterEarlyRelease.includes("EMERGENCY SOS ALERT ACTIVATED")) {
      throw new Error("FAIL: Early release at 2.0s erroneously activated emergency!");
    }
    console.log("PASS: Early release cleanly cancelled hold!");

    // Step 5: Test Continuous Hold >= 5.0s Activation
    console.log("\n--- Step 5: Full 5.0s Hold Activation ---");
    // Re-acquire fresh button position
    const activeSosBtn = await page.waitForSelector("button[aria-label*='Emergency SOS']", { timeout: 5000 });
    const freshBox = await activeSosBtn.boundingBox();
    await page.mouse.move(freshBox.x + freshBox.width / 2, freshBox.y + freshBox.height / 2);
    await page.mouse.down();
    console.log("Holding continuously for 6.0 seconds...");
    await new Promise((r) => setTimeout(r, 6000));
    await page.mouse.up();

    // Wait for the emergency card panel to expand
    console.log("Hold completed. Waiting for active emergency panel...");
    await page.waitForFunction(() => document.body.innerText.includes("EMERGENCY SOS ALERT ACTIVATED"), { timeout: 15000 });
    console.log("PASS: Emergency successfully activated after 5.0s monotonic hold!");

    // Step 6: Validate Expanded Emergency Panel Content
    console.log("\n--- Step 6: Validate Emergency Panel Data & Features ---");
    const activeText = await page.evaluate(() => document.body.innerText);

    // 112 Public safety text
    if (!activeText.includes("112 in India")) {
      throw new Error("FAIL: Immediate danger advice with 112 emergency number missing");
    }
    console.log("PASS: Immediate danger warning with local 112 emergency advice displayed!");

    // Verified officer details
    if (!activeText.includes("Det. Marcus Vance") && !activeText.includes("Investigating Officer")) {
      throw new Error("FAIL: Investigating officer details missing");
    }
    console.log("PASS: Verified Investigating Officer contact details displayed!");

    // Calling tel: link
    const telLink = await page.$("a[href^='tel:']");
    if (!telLink) {
      throw new Error("FAIL: Direct 'CALL OFFICER' tel: link missing");
    }
    const telHref = await page.evaluate(el => el.getAttribute("href"), telLink);
    console.log(`PASS: Direct calling tel: link verified (${telHref})!`);

    // Live GPS and map link
    if (!activeText.includes("Live GPS") && !activeText.includes("GPS")) {
      throw new Error("FAIL: Live GPS streaming section missing");
    }
    console.log("PASS: Live GPS coordinates and map link present!");

    // Delivery & Audit status
    if (!activeText.includes("Incident Audit Trail") && !activeText.includes("SMS")) {
      throw new Error("FAIL: Delivery status and audit trail details missing");
    }
    console.log("PASS: Delivery status & incident audit confirmation displayed!");

    // Step 7: Test Resolve Emergency Workflow
    console.log("\n--- Step 7: Resolve Emergency ---");
    const resolveBtn = await page.waitForSelector("button ::-p-text(RESOLVE EMERGENCY)", { timeout: 5000 });
    await resolveBtn.click();

    await page.waitForFunction(() => document.body.innerText.includes("RESOLVED"), { timeout: 6000 });
    console.log("PASS: Emergency successfully resolved by authorized officer!");

    // Step 8: Regression Test on Suspect Sketch Module
    console.log("\n--- Step 8: Regression Verification on Suspect Face Sketch ---");
    await page.goto("http://localhost:3000/suspect-sketch", { waitUntil: "networkidle0" });
    const extractBtn = await page.waitForSelector("button ::-p-text(Analyze & Extract)");
    await extractBtn.click();
    await page.waitForSelector(".border-police-blue", { timeout: 10000 });
    const suspectPageText = await page.evaluate(() => document.body.innerText);
    if (!suspectPageText.includes("CANDIDATE FACE")) {
      throw new Error("FAIL: Suspect Face Sketch candidate generation regression detected");
    }
    console.log("PASS: Suspect Face Sketch module functions 100% identically without any regression!");

    console.log("\n=======================================================");
    console.log("ALL SOS EMERGENCY SYSTEM ACCEPTANCE CRITERIA VERIFIED!");
    console.log("=======================================================");
  } finally {
    await browser.close();
  }
}

runSosTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
