import { Page } from "@playwright/test";

export async function extractAddPayeeFormContext(page: Page) {
    await page.waitForSelector('#add_new_payee', { state: 'attached' });

    return await page.evaluate(() => {
        const submitButton = document.querySelector('#add_new_payee');
        const form = submitButton?.closest('form');

        if (!form) return null;

        const fields = Array.from(
            form.querySelectorAll("input, textarea, select")
        )
        .filter((el: any) => el.type !== "submit")
        .map((el: any) => {
            const label = form.querySelector(`label[for="${el.id}"]`) as HTMLElement | null;

            return {
                id: el.id,
                name: el.name,
                label: label?.textContent?.trim() || null,
                tag: el.tagName.toLowerCase(),
                type: el.type || null,
                required: el.required,
                maxLength: el.maxLength > 0 ? el.maxLength : null,
                pattern: el.pattern || null,
            };
        });

        return {
            formAction: form.getAttribute("action"),
            method: form.getAttribute("method"),
            fields,
            submitButton: {
                id: submitButton?.id,
                value: submitButton?.getAttribute("value"),
            }
        };
    });
}