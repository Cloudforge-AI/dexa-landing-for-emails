import { test, expect } from "@playwright/test";
import { execSync } from "child_process";

// Generate a single timestamp shared across all tests in this file
const TIMESTAMP = Date.now();
const TEST_EMAIL = `playwright-test-${TIMESTAMP}@test.com`;
const TEST_NAME = "Playwright Test";

const AWS_PROFILE = "cloudforge-dexavision";
const AWS_REGION = "us-east-1";
const DYNAMO_TABLE = "dexavision-Leads";

test.describe("DexaVision Landing Page", () => {
  // ---------- Test 1: Page loads correctly ----------
  test("page loads with all sections visible", async ({ page }) => {
    await page.goto("/");

    // Navbar brand
    await expect(page.locator("nav").getByText("DexaVision")).toBeVisible();

    // Hero
    await expect(page.getByText("Inteligencia Artificial")).toBeVisible();

    // Features
    await expect(
      page.getByRole("heading", { name: /Por qu(e|é) DexaVision/i })
    ).toBeVisible();

    // LeadForm
    await expect(
      page.getByRole("heading", { name: "Solicita Acceso Anticipado" })
    ).toBeVisible();

    // Footer
    await expect(page.locator("footer")).toBeVisible();
  });

  // ---------- Test 2: CTA scrolls to form ----------
  test("navbar CTA scrolls to lead form", async ({ page }) => {
    await page.goto("/");

    // Click the navbar CTA (not the hero one)
    await page.locator("nav").getByRole("link", { name: "Solicitar Acceso" }).click();

    // Wait a moment for the scroll animation
    await page.waitForTimeout(500);

    // The lead-form section should be in viewport
    await expect(page.locator("#lead-form")).toBeInViewport();
  });

  // ---------- Test 3: Form validation - empty fields ----------
  test("form prevents submission with empty required fields", async ({ page }) => {
    await page.goto("/");

    // Scroll to form
    await page.locator("#lead-form").scrollIntoViewIfNeeded();

    // The submit button inside the form
    const submitBtn = page.locator("#lead-form form button[type='submit']");
    await submitBtn.click();

    // The name input should fail HTML5 validation (it has required)
    const nameInput = page.locator("#name");
    const isInvalid = await nameInput.evaluate(
      (el: HTMLInputElement) => !el.validity.valid
    );
    expect(isInvalid).toBe(true);
  });

  // ---------- Test 4: User type toggle ----------
  test("user type toggle switches between patient and dentist", async ({
    page,
  }) => {
    await page.goto("/");
    await page.locator("#lead-form").scrollIntoViewIfNeeded();

    const dentistBtn = page.getByRole("button", { name: "Soy dentista" });
    const patientBtn = page.getByRole("button", { name: "Soy paciente" });

    // Default: patient is selected
    await expect(patientBtn).toHaveClass(/border-primary/);

    // Click dentist
    await dentistBtn.click();
    await expect(dentistBtn).toHaveClass(/border-primary/);
    await expect(patientBtn).not.toHaveClass(/border-primary bg-primary/);

    // Click back to patient
    await patientBtn.click();
    await expect(patientBtn).toHaveClass(/border-primary/);
  });

  // ---------- Test 5: Successful form submission (E2E) ----------
  test("successful form submission shows success message", async ({ page }) => {
    await page.goto("/");
    await page.locator("#lead-form").scrollIntoViewIfNeeded();

    // Fill name
    await page.locator("#name").fill(TEST_NAME);

    // Fill email
    await page.locator("#email").fill(TEST_EMAIL);

    // Select dentist
    await page.getByRole("button", { name: "Soy dentista" }).click();

    // Submit
    await page.locator("#lead-form form button[type='submit']").click();

    // Wait for success message
    await expect(page.getByText("¡Registro exitoso!")).toBeVisible({
      timeout: 15_000,
    });

    // Verify the success checkmark SVG is visible
    await expect(page.locator("#lead-form svg.text-success")).toBeVisible();
  });

  // ---------- Test 6: Duplicate submission handling ----------
  test("duplicate submission still shows success", async ({ page }) => {
    await page.goto("/");
    await page.locator("#lead-form").scrollIntoViewIfNeeded();

    // Fill same data
    await page.locator("#name").fill(TEST_NAME);
    await page.locator("#email").fill(TEST_EMAIL);
    await page.getByRole("button", { name: "Soy dentista" }).click();

    // Submit
    await page.locator("#lead-form form button[type='submit']").click();

    // Should still show success (Lambda returns 200 for duplicates)
    await expect(page.getByText("¡Registro exitoso!")).toBeVisible({
      timeout: 15_000,
    });
  });

  // ---------- Test 7: Verify data in DynamoDB ----------
  test("test lead exists in DynamoDB", async () => {
    const cmd = `aws dynamodb get-item --table-name ${DYNAMO_TABLE} --key '{"email":{"S":"${TEST_EMAIL}"}}' --profile ${AWS_PROFILE} --region ${AWS_REGION}`;
    const result = execSync(cmd, { encoding: "utf-8" });
    const item = JSON.parse(result);

    expect(item.Item).toBeDefined();
    expect(item.Item.email.S).toBe(TEST_EMAIL);
    expect(item.Item.name.S).toBe(TEST_NAME);
    expect(item.Item.type.S).toBe("dentist");
    expect(item.Item.source.S).toBe("landing-page");
  });

  // ---------- Test 8: Cleanup - delete test data ----------
  test("cleanup: delete test lead from DynamoDB", async () => {
    const cmd = `aws dynamodb delete-item --table-name ${DYNAMO_TABLE} --key '{"email":{"S":"${TEST_EMAIL}"}}' --profile ${AWS_PROFILE} --region ${AWS_REGION}`;
    execSync(cmd, { encoding: "utf-8" });

    // Verify deletion
    const verifyCmd = `aws dynamodb get-item --table-name ${DYNAMO_TABLE} --key '{"email":{"S":"${TEST_EMAIL}"}}' --profile ${AWS_PROFILE} --region ${AWS_REGION}`;
    const result = execSync(verifyCmd, { encoding: "utf-8" }).trim();
    if (result) {
      const item = JSON.parse(result);
      expect(item.Item).toBeUndefined();
    }
    // Empty result means item doesn't exist — deletion confirmed
  });
});
