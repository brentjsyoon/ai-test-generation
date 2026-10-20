import { Page } from "@playwright/test";
import PayBillsPage from "../pages/payBillsPage";

export async function runEdgeCases(
  page: Page,
  payBillsPage: PayBillsPage,
  edgeCases: any[],
  submitButtonSelector: string,
  confirmationSelector: string
) {
    const formLocator = page.locator('form[action="/bank/pay-bills-new-payee.html"]');
    const unexpectedCases: { testName: string; actual: string; expected: string }[] = [];

    for (const testCase of edgeCases) {
        console.log(`Running AI Case: ${testCase.testName}`);

        // Clear all inputs first
        const allFields = page.locator("form[action='/bank/pay-bills-new-payee.html'] input, form textarea");
        await allFields.evaluateAll((elements) => {
            elements.forEach((el: any) => {
                if (el.type !== "submit") el.value = "";
            });
        });

        // Fill inputs
        for (const fieldId in testCase.inputs) {
            await page.locator(`#${fieldId}`).fill(testCase.inputs[fieldId]);
        }

        await page.waitForTimeout(2000);

        // Submit
        await page.locator(submitButtonSelector).click();

        await page.waitForTimeout(1000);

        // Check result
        const alertVisible = await page.locator(confirmationSelector).isVisible();

        if (
            (testCase.expected === "validation_error" && alertVisible) ||
            (testCase.expected === "success" && !alertVisible)
        ) {
            unexpectedCases.push({
                testName: testCase.testName,
                actual: alertVisible ? "visible" : "not visible",
                expected: testCase.expected,
            });
        }

        if (alertVisible) {
            // Re-open "Add New Payee" tab after successful submission
            await payBillsPage.clickAddNewPayeeTab();
        }
        else {
            // Reset form for next iteration
            await formLocator.evaluate((form: HTMLFormElement) => form.reset());
        }
    }

    // Report unexpected behavior at the end
    if (unexpectedCases.length > 0) {
        console.warn("⚠️ Some AI-generated test cases behaved unexpectedly:");
        unexpectedCases.forEach((c) => {
            console.warn(`- ${c.testName}: expected ${c.expected}, but was ${c.actual}`);
        });
    } else {
        console.log("✅ All AI-generated cases behaved as expected.");
    }
}