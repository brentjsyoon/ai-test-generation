import OpenAI from "openai";
import { GLOBAL_DATA } from "../data/GlobalData";
import { Locator, Page } from '@playwright/test';

const openai = new OpenAI({
  apiKey: GLOBAL_DATA.OPENAI_API_KEY,
});

export async function suggestLocators(
  htmlSnippet: string,
  originalLocator: string,
  errorMessage: string
) {
    const prompt = `
    You are an expert QA automation engineer.

    The following Playwright locator failed:

    Locator:
    ${originalLocator}

    Error:
    ${errorMessage}

    Here is the HTML snippet near the element:
    ${htmlSnippet}

    Return ONLY valid JSON in this format:

    {
    "locators": [
        { "type": "css", "value": "button.primary" },
        { "type": "role", "value": "button", "name": "Submit" },
        { "type": "text", "value": "Submit" }
    ]
    }

    Rules:
    - No explanations
    - No markdown
    - No code blocks
    - JSON only
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
    });

    const raw = response.choices[0].message.content;

    let parsed;
    try {
        parsed = JSON.parse(raw || "{}");
    } catch {
        throw new Error("AI returned invalid JSON");
    }

    return parsed.locators || [];
}

export async function smartClick(page: Page, selector: string | Locator) {
    let locator: Locator;
    let selectorStr: string | null = null;

    if (typeof selector === 'string') {
        locator = page.locator(selector);
        selectorStr = selector;
    } else {
        locator = selector;
        selectorStr = "<unknown locator>"; // fallback string for AI prompt
    }

    let snippet = "";
    try {
        await locator.waitFor({ state: 'attached', timeout: 10000 });
        snippet = await locator.evaluate(el => el.outerHTML); // get HTML before click
    } catch {
        snippet = await page.content();
    }

    // Use page HTML as fallback if locator.evaluate fails
    if (selectorStr) {
        try {
            await locator.click({ timeout: 2000 });
            return;
        } catch (error: any) {
            console.log("Locator failed. Attempting AI self-heal...");
        }

        const candidates = await suggestLocators(snippet, selectorStr, "Locator failed");

        // Print nicely
        console.log("AI suggested candidates:", JSON.stringify(candidates, null, 2));

        for (const candidate of candidates) {
        try {
            let healed: Locator;

            switch (candidate.type) {
            case "css":
                healed = page.locator(candidate.value);
                break;
            case "role":
                healed = page.getByRole(candidate.value, { name: candidate.name });
                break;
            case "text":
                healed = page.getByText(candidate.value);
                break;
            default:
                continue;
            }

            await healed.click();
            console.log("Self-heal success:", candidate);
            return;
        } catch {
            continue;
        }
        }
    }

    throw new Error("Self-healing failed for selector");
}