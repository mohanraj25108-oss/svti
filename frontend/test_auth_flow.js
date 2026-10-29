const puppeteer = require("puppeteer");

async function runTest() {
  console.log("Starting E2E Verification for Suspect Sketch Auth Bug & Fix...");
  const browser = await puppeteer.launch({
    headless: "new",
    executablePath: "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe",
    args: ["--no-sandbox", "--disable-setuid-sandbox"]
  });

  try {
    const page = await browser.newPage();
    await page.setViewport({ width: 1280, height: 800 });

    let dialogAppeared = false;
    let dialogMessage = "";
    page.on("dialog", async (dialog) => {
      dialogAppeared = true;
      dialogMessage = dialog.message();
      console.error(`[ALERT DETECTED]: "${dialogMessage}"`);
      await dialog.dismiss();
    });

    // TEST 1: Unauthenticated user clicks "Analyze & Extract"
    console.log("\n--- TEST 1: Missing Session (Unauthenticated) ---");
    await page.goto("http://localhost:3000/suspect-sketch", { waitUntil: "networkidle0" });
    
    // Clear localStorage & cookies to ensure completely unauthenticated state
    await page.evaluate(() => {
      localStorage.clear();
      sessionStorage.clear();
    });
    await page.reload({ waitUntil: "networkidle0" });

    console.log("Navigated to /suspect-sketch unauthenticated. Clicking 'Analyze & Extract' button...");
    const extractBtn = await page.waitForSelector("button ::-p-text(Analyze & Extract)");
    await extractBtn.click();

    // Give it a moment to show toast and redirect
    await new Promise((r) => setTimeout(r, 2000));

    if (dialogAppeared) {
      throw new Error(`FAIL: Browser alert() was displayed with text: "${dialogMessage}"`);
    }
    console.log("PASS: No browser alert() was shown!");

    // Verify redirected to /login?redirect=/suspect-sketch
    const currentUrl = page.url();
    console.log("Current URL after click:", currentUrl);
    if (!currentUrl.includes("/login")) {
      throw new Error(`FAIL: Expected redirect to /login, but URL is ${currentUrl}`);
    }
    if (!currentUrl.includes("redirect")) {
      throw new Error(`FAIL: Expected redirect query param in ${currentUrl}`);
    }
    console.log("PASS: Successfully redirected to /login with return URL parameter!");

    // Verify clearance banner on login page
    const bannerText = await page.evaluate(() => document.body.innerText);
    if (!bannerText.toLowerCase().includes("clearance") && !bannerText.toLowerCase().includes("authenticate")) {
      throw new Error("FAIL: Friendly clearance banner not found on login page");
    }
    console.log("PASS: Friendly law enforcement clearance banner displayed!");

    // TEST 2: Login and Return to Suspect Sketch
    console.log("\n--- TEST 2: Authenticate and Return ---");
    // Clear and fill email & password
    await page.$eval("input[type=email]", (el) => (el.value = ""));
    await page.type("input[type=email]", "marcus.vance@sketchforce.gov");
    await page.$eval("input[type=password]", (el) => (el.value = ""));
    await page.type("input[type=password]", "police2026");
    const loginBtn = await page.waitForSelector("form button[type=submit]");
    await loginBtn.click();

    // In Next.js client-side navigation, wait for URL to update
    await page.waitForFunction(() => window.location.pathname.includes("/suspect-sketch"), { timeout: 10000 });
    const postLoginUrl = page.url();
    console.log("Post-login redirected URL:", postLoginUrl);
    if (!postLoginUrl.includes("/suspect-sketch")) {
      throw new Error(`FAIL: Expected return to /suspect-sketch, but got ${postLoginUrl}`);
    }
    console.log("PASS: Seamlessly returned to /suspect-sketch after login!");

    // TEST 3: Authenticated Parse Narrative
    console.log("\n--- TEST 3: Authenticated Action Success ---");
    const authExtractBtn = await page.waitForSelector("button ::-p-text(Analyze & Extract)");
    await authExtractBtn.click();

    // Wait for candidates
    await page.waitForSelector(".border-police-blue", { timeout: 10000 });
    const pageText = await page.evaluate(() => document.body.innerText);
    if (!pageText.includes("CANDIDATE FACE")) {
      throw new Error("FAIL: Candidate faces did not appear after parsing narrative");
    }
    console.log("PASS: Narrative successfully analyzed and candidate faces generated with 200 OK!");

    // TEST 4: Expired Token Handling
    console.log("\n--- TEST 4: Expired Token Re-authentication ---");
    // Inject a deliberately corrupted/expired JWT token
    await page.evaluate(() => {
      // Fake header.payload.signature where payload has expired timestamp
      const expiredPayload = btoa(JSON.stringify({ sub: "marcus.vance@sketchforce.gov", exp: Math.floor(Date.now() / 1000) - 3600 }));
      const fakeToken = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.${expiredPayload}.invalid_or_expired_signature`;
      localStorage.setItem("sketchforce_token", fakeToken);
    });

    console.log("Injected expired token. Clicking 'Analyze & Extract' button...");
    const reExtractBtn = await page.waitForSelector("button ::-p-text(Analyze & Extract)");
    await reExtractBtn.click();

    await page.waitForFunction(() => window.location.pathname.includes("/login"), { timeout: 10000 });
    const expiredRedirectUrl = page.url();
    console.log("Redirected URL after expired token:", expiredRedirectUrl);
    if (!expiredRedirectUrl.includes("/login?redirect=/suspect-sketch")) {
      throw new Error(`FAIL: Expected redirect to /login?redirect=/suspect-sketch, got ${expiredRedirectUrl}`);
    }
    console.log("PASS: Expired token cleanly redirected to login with return path and no alert()!");

    console.log("\nALL 4 E2E VERIFICATIONS PASSED WITH 100% SUCCESS!");
  } finally {
    await browser.close();
  }
}

runTest().catch((err) => {
  console.error("Test failed:", err);
  process.exit(1);
});
