import { test, expect } from "@playwright/test";

test.describe("Portfolio Production Verification", () => {
  test("serves hardened security headers, SEO endpoints, and zero console errors", async ({
    page,
    request,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];

    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    const response = await page.goto("/", { waitUntil: "networkidle" });
    expect(response?.status()).toBe(200);

    const headers = response?.headers() ?? {};
    expect(headers["x-content-type-options"]).toBe("nosniff");
    expect(headers["x-frame-options"]).toBe("DENY");
    expect(headers["referrer-policy"]).toBe("strict-origin-when-cross-origin");
    expect(headers["content-security-policy"]).toContain("object-src 'none'");
    expect(headers["content-security-policy"]).toContain(
      "connect-src 'self' https://formsubmit.co"
    );
    expect(headers["content-security-policy"]).toContain(
      "form-action 'self' https://formsubmit.co"
    );
    expect(headers["x-powered-by"]).toBeUndefined();

    const robotsRes = await request.get("/robots.txt");
    expect(robotsRes.status()).toBe(200);
    expect(await robotsRes.text()).toContain("Sitemap:");

    const sitemapRes = await request.get("/sitemap.xml");
    expect(sitemapRes.status()).toBe(200);
    expect(await sitemapRes.text()).toContain("<urlset");

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test("dual-theme switches cleanly and persists across reload without hydration errors", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    await page.emulateMedia({ colorScheme: "dark" });
    await page.goto("/", { waitUntil: "networkidle" });

    // With dark OS preference and no stored override, starts in Dark Obsidian theme
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    // Toggle to Light Automotive Cockpit theme
    await page
      .getByRole("button", { name: /Switch to Light Automotive Cockpit theme/i })
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    // Reload and confirm Light theme persists
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

    // Toggle back to Dark theme
    await page
      .getByRole("button", { name: /Switch to Dark Obsidian Slate theme/i })
      .click();
    await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");

    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });

  test("CommandMenu filters Experience accurately and Enter on Close button does not toggle theme", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    const initialTheme = await page.locator("html").getAttribute("data-theme");

    // Open CommandMenu via shortcut
    await page.keyboard.press("Control+k");
    const dialog = page.getByRole("dialog", { name: "Command menu" });
    await expect(dialog).toBeVisible();

    // Focus the close button and press Enter — must close menu WITHOUT activating highlighted Switch Theme item
    const closeBtn = dialog.getByRole("button", { name: "Close command menu" });
    await closeBtn.focus();
    await page.keyboard.press("Enter");
    await expect(dialog).toBeHidden();
    await expect(page.locator("html")).toHaveAttribute(
      "data-theme",
      initialTheme ?? "dark"
    );

    // Reopen CommandMenu and apply "Python & Pandas" filter
    await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible();
    await dialog
      .getByPlaceholder(/Type a command/i)
      .fill("Python & Pandas");
    await dialog.getByText("Filter Experience by: Python & Pandas").click();
    await expect(dialog).toBeHidden();

    // Verify Experience active filter banner & filtered count
    await expect(
      page.getByText(/Filtering by Python & Pandas/i)
    ).toBeVisible();
    await page.getByRole("button", { name: "Clear Filter" }).click();
    await expect(page.getByText(/Filtering by Python & Pandas/i)).toBeHidden();

    // Verify full-page site search returns cross-section matches and highlights target text in yellow
    await page.keyboard.press("Control+k");
    await expect(dialog).toBeVisible();
    await dialog.getByPlaceholder(/Type a command/i).fill("Eurocode 6");
    await expect(dialog.getByText(/Masonry Module/i)).toBeVisible();
    await expect(dialog.getByText(/match/i)).toBeVisible();
    await dialog.getByText(/Masonry Module/i).click();
    await expect(dialog).toBeHidden();
    await expect(
      page.locator("#experience mark[data-search-highlight='true']").first()
    ).toContainText(/Eurocode 6/i);
  });

  test("Schematics tabs, modal focus restoration, and Telemetry Simulator work end-to-end", async ({
    page,
  }) => {
    await page.goto("/", { waitUntil: "networkidle" });

    // Separate project simulation slides/tabs switch cleanly without combining scenes
    const showcaseSection = page.locator(
      "section[aria-label='Project-specific interactive engineering simulations']"
    );
    const projectTablist = showcaseSection.getByRole("tablist", {
      name: "Select individual project simulation",
    });
    await expect(projectTablist).toBeVisible();
    await projectTablist.getByRole("tab", { name: "BMW Parking" }).click();
    await expect(showcaseSection.getByText("12 USS + 4 CAM")).toBeVisible();
    await projectTablist.getByRole("tab", { name: "HARMAN eCall" }).click();
    await expect(
      showcaseSection.getByText("2G/3G ECALL", { exact: true })
    ).toBeVisible();
    await projectTablist.getByRole("tab", { name: "Graitec 3D CAD" }).click();
    await expect(showcaseSection.getByText("6 MODULES")).toBeVisible();

    // Verify Graitec interactive toolbar & split-view WPF Pure MVVM TreeView controls
    const graitecToolbar = showcaseSection.getByRole("toolbar", {
      name: "Build Graitec 3D CAD structural modules",
    });
    await expect(graitecToolbar).toBeVisible();
    await graitecToolbar.getByRole("button", { name: "Footing" }).click();
    await expect(
      graitecToolbar.getByRole("button", { name: "Footing" })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(showcaseSection.getByText("FootingModuleVM")).toBeVisible();

    await graitecToolbar.getByRole("button", { name: "Perforate Wall" }).click();
    await expect(
      graitecToolbar.getByRole("button", { name: "Perforate Wall" })
    ).toHaveAttribute("aria-pressed", "true");
    await expect(
      showcaseSection.getByText("WallOpeningBooleanVM")
    ).toBeVisible();

    await graitecToolbar.getByRole("button", { name: "Reset" }).click();
    await expect(
      graitecToolbar.getByRole("button", { name: "Perforate Wall" })
    ).toHaveAttribute("aria-pressed", "false");
    await graitecToolbar
      .getByRole("button", { name: "Build Full Frame" })
      .click();
    await expect(
      graitecToolbar.getByRole("button", { name: "Build Full Frame" })
    ).toHaveAttribute("aria-pressed", "true");

    await projectTablist.getByRole("tab", { name: "CARIAD REM" }).click();
    await expect(showcaseSection.getByText("CANoe 100%")).toBeVisible();

    // Switch Schematics tab & verify all aria-controls DOM targets exist
    const allTabs = page.locator("#schematics [role='tab']");
    const tabCount = await allTabs.count();
    for (let i = 0; i < tabCount; i++) {
      const panelId = await allTabs.nth(i).getAttribute("aria-controls");
      expect(panelId).toBeTruthy();
      expect(await page.locator(`#${panelId}`).count()).toBe(1);
    }

    const graitecTab = page.getByRole("tab", {
      name: /Graitec \/ Revit/i,
    });
    await graitecTab.click();
    await expect(graitecTab).toHaveAttribute("aria-selected", "true");

    // Open SchematicModal
    const firstNode = page
      .locator("#schematics [role='tabpanel']:not([hidden]) button[aria-haspopup='dialog']")
      .first();
    await firstNode.click();
    const modal = page.getByRole("dialog");
    await expect(modal).toBeVisible();

    // Clicking non-focusable dialog title & pressing Shift+Tab must keep focus trapped inside dialog
    await page.locator("#schematic-modal-title").click();
    await page.keyboard.press("Shift+Tab");
    const insideDialog = await page.evaluate(() => {
      const dialog = document.querySelector("[role='dialog']");
      return Boolean(dialog && dialog.contains(document.activeElement));
    });
    expect(insideDialog).toBe(true);

    // Verify Ctrl+K does NOT stack CommandMenu over SchematicModal
    await page.keyboard.press("Control+k");
    await expect(page.getByRole("dialog")).toHaveCount(1);

    // Escape closes SchematicModal and restores focus
    await page.keyboard.press("Escape");
    await expect(modal).toBeHidden();
    await expect(firstNode).toBeFocused();

    // Verify Dark-mode @media print forces dark readable cyan-ink (#0369a1) on Hero surname span
    await page.emulateMedia({ media: "print" });
    const heroSpanColor = await page.evaluate(() => {
      const h1 = document.querySelector("h1");
      const h1Span = h1?.querySelector("span");
      return h1Span ? getComputedStyle(h1Span).color : "";
    });
    expect(heroSpanColor).toBe("rgb(3, 105, 161)");
    await page.emulateMedia({ media: "screen" });

    // Telemetry Simulator controls
    await page.getByRole("button", { name: /Pause Stream/i }).click();
    await expect(page.getByText("STREAM PAUSED")).toBeVisible();

    await page.getByRole("button", { name: /Trigger eCall Sanity/i }).click();
    await expect(
      page.getByText(/test_ecall_pipeline\.py::test_hardware_sos_latch PASSED/i).last()
    ).toBeVisible();

    await page.getByRole("button", { name: /Clear Console/i }).click();
    await expect(page.getByText("Frames in Buffer: 0")).toBeVisible();
    await page.getByRole("button", { name: /Restore Baseline/i }).click();
    await expect(page.getByText("Frames in Buffer: 5")).toBeVisible();
  });

  test("responsive viewports (1440px, 768px, 375px) have zero horizontal overflow and no clipped filter bars", async ({
    page,
  }) => {
    const viewports = [
      { name: "desktop", width: 1440, height: 900 },
      { name: "tablet", width: 768, height: 1024 },
      { name: "mobile", width: 375, height: 812 },
    ];

    for (const vp of viewports) {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("/", { waitUntil: "networkidle" });

      const metrics = await page.evaluate(() => {
        const docWidth = document.documentElement.clientWidth;
        const scrollWidth = document.documentElement.scrollWidth;
        const expGroup = document.querySelector(
          '[aria-label="Filter experience by technology"]'
        );
        const skillsGroup = document.querySelector(
          '[aria-label="Filter technical skill categories"]'
        );
        return {
          docWidth,
          scrollWidth,
          expRight: expGroup ? expGroup.getBoundingClientRect().right : 0,
          skillsRight: skillsGroup
            ? skillsGroup.getBoundingClientRect().right
            : 0,
        };
      });

      expect(metrics.scrollWidth).toBeLessThanOrEqual(metrics.docWidth);
      expect(metrics.expRight).toBeLessThanOrEqual(vp.width + 1);
      expect(metrics.skillsRight).toBeLessThanOrEqual(vp.width + 1);

      if (vp.name === "tablet") {
        const tabletMetricsRight = await page.evaluate(() => {
          const cards = Array.from(document.querySelectorAll("#experience .tilt-card-root"));
          return cards.reduce((max, c) => Math.max(max, c.getBoundingClientRect().right), 0);
        });
        expect(tabletMetricsRight).toBeLessThanOrEqual(vp.width + 1);
      }

      if (vp.name === "mobile") {
        // Trigger a long unspaced pytest log line & verify TelemetrySimulator still fits inside 375px
        await page.getByRole("button", { name: /Trigger eCall Sanity/i }).click();
        const telemetryOverflow = await page.evaluate(() => {
          const region = document.querySelector("[aria-label='Diagnostic telemetry log output']");
          return region ? region.scrollWidth > region.clientWidth + 1 : false;
        });
        expect(telemetryOverflow).toBe(false);

        // Verify mobile hamburger drawer opens cleanly
        await page
          .getByRole("button", { name: /Open navigation menu/i })
          .click();
        await expect(page.locator("#mobile-nav-drawer")).toBeVisible();
        // Verify all 7 Technical Skills category pills are visible on mobile
        const skillsButtons = page.locator(
          '[aria-label="Filter technical skill categories"] button'
        );
        expect(await skillsButtons.count()).toBe(7);
      }
    }
  });

  test("ContactForm validates inputs, blocks honeypot focus, and handles FormSubmit success/error cleanly", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    await page.goto("/", { waitUntil: "networkidle" });

    // Confirm honeypot field is non-focusable and hidden from assistive tech
    const honey = page.locator('input[name="_honey"]');
    await expect(honey).toHaveAttribute("tabindex", "-1");
    await expect(honey).toHaveAttribute("aria-hidden", "true");

    // Client-side validation triggers ARIA invalid attributes & focuses first invalid field
    const sendButton = page.getByRole("button", { name: /Send Message/i });
    await sendButton.click();
    await expect(page.locator("#contact-name")).toBeFocused();
    await expect(page.locator("#contact-name")).toHaveAttribute(
      "aria-invalid",
      "true"
    );
    await expect(page.getByText(/Please enter your name/i)).toBeVisible();
    await expect(
      page.getByText(/Please enter a valid email address/i)
    ).toBeVisible();
    await expect(
      page.getByText(/Please include at least 10 characters/i)
    ).toBeVisible();

    // Mock FormSubmit 200 OK JSON delivery & verify payload
    const capturedBodies: Record<string, string>[] = [];
    await page.route("https://formsubmit.co/ajax/**", async (route) => {
      capturedBodies.push(route.request().postDataJSON() as Record<string, string>);
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: "true",
          message: "Form submitted successfully.",
        }),
      });
    });

    await page.locator("#contact-name").fill("Alex Popescu");
    await page.locator("#contact-email").fill("alex@company.com");
    await page
      .locator("#contact-subject")
      .selectOption("Embedded & Automotive Systems");
    await page
      .locator("#contact-message")
      .fill("Interested in collaborating on CANoe telemetry automation.");

    await sendButton.click();

    await expect(
      page.getByText(/Message sent successfully via FormSubmit/i)
    ).toBeVisible();
    const capturedBody = capturedBodies[0];
    expect(capturedBody).toBeDefined();
    expect(capturedBody?.name).toBe("Alex Popescu");
    expect(capturedBody?.email).toBe("alex@company.com");
    expect(capturedBody?._template).toBe("table");
    expect(capturedBody?._subject).toContain("Embedded & Automotive Systems");

    // Form resets after successful delivery with zero console errors
    await expect(page.locator("#contact-name")).toHaveValue("");
    await expect(page.locator("#contact-message")).toHaveValue("");
    expect(consoleErrors).toEqual([]);

    // Mock FormSubmit 500 server failure & verify error state keeps user message
    await page.unroute("https://formsubmit.co/ajax/**");
    await page.route("https://formsubmit.co/ajax/**", async (route) => {
      await route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({
          success: "false",
          message: "Relay temporarily unavailable.",
        }),
      });
    });

    await page.locator("#contact-name").fill("Alex Popescu");
    await page.locator("#contact-email").fill("alex@company.com");
    await page
      .locator("#contact-message")
      .fill("Retrying submission under simulated server outage.");
    await sendButton.click();

    await expect(page.locator("#contact [role='alert']")).toContainText(
      /Relay temporarily unavailable/i
    );
    await expect(page.locator("#contact-message")).toHaveValue(
      "Retrying submission under simulated server outage."
    );
    await expect(
      page.locator("#contact a[href^='mailto:vaidos.mihaiiulian@gmail.com']")
    ).toBeVisible();

    // Mock FormSubmit activation-pending response & verify friendly amber guidance
    await page.unroute("https://formsubmit.co/ajax/**");
    await page.route("https://formsubmit.co/ajax/**", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          success: "false",
          message:
            "This form needs Activation. We've sent you an email containing an 'Activate Form' link.",
        }),
      });
    });

    await sendButton.click();
    await expect(
      page.getByText(/FormSubmit activation email triggered/i)
    ).toBeVisible();
    expect(pageErrors).toEqual([]);
  });

  test("Secret inline text editor activates only on ?edit=1, persists edits across reload, and resets cleanly", async ({
    page,
  }) => {
    const consoleErrors: string[] = [];
    const pageErrors: string[] = [];
    page.on("console", (msg) => {
      if (msg.type() === "error") consoleErrors.push(msg.text());
    });
    page.on("pageerror", (err) => {
      pageErrors.push(err.message);
    });

    // Public URL '/' must not show any secret editor controls
    await page.goto("/", { waitUntil: "networkidle" });
    await expect(page.locator("[data-secret-editor='true']")).toBeHidden();

    // Secret URL '/?edit=1' opens inline visual editor
    await page.goto("/?edit=1", { waitUntil: "networkidle" });
    const editorDock = page.locator("[data-secret-editor='true']");
    await expect(editorDock).toBeVisible();
    await expect(editorDock.getByText("SECRET EDIT MODE")).toBeVisible();
    await expect(editorDock.getByText("Changes (0)")).toBeVisible();

    // Click heading inside Technical Skills Matrix and edit text inline
    const skillsHeading = page.locator("#skills h2");
    const originalHeading = (await skillsHeading.textContent()) ?? "";
    await skillsHeading.click();
    await expect(skillsHeading).toHaveAttribute("data-inline-editing", "true");

    await page.keyboard.press("Control+a");
    await page.keyboard.type("Custom Edited Skills Matrix");
    await page.keyboard.press("Enter");

    await expect(skillsHeading).toHaveText("Custom Edited Skills Matrix");
    await expect(editorDock.getByText("Changes (1)")).toBeVisible();

    // Reload '/?edit=1' and confirm edit persists from browser storage
    await page.reload({ waitUntil: "networkidle" });
    await expect(page.locator("#skills h2")).toHaveText(
      "Custom Edited Skills Matrix"
    );
    await expect(editorDock.getByText("Changes (1)")).toBeVisible();

    // Verify Changes drawer & Reset button cleanly restore original text
    await editorDock.getByRole("button", { name: /Changes \(1\)/i }).click();
    await expect(
      editorDock.getByText("SAVED TEXT ADJUSTMENTS (1)")
    ).toBeVisible();
    await editorDock
      .getByRole("button", { name: "Reset all text edits" })
      .click();

    await expect(page.locator("#skills h2")).toHaveText(originalHeading);
    await expect(editorDock.getByText("Changes (0)")).toBeVisible();
    expect(consoleErrors).toEqual([]);
    expect(pageErrors).toEqual([]);
  });
});
