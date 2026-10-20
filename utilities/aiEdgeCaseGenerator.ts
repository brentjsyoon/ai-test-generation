import OpenAI from "openai";
import { GLOBAL_DATA } from "../data/GlobalData";

const openai = new OpenAI({
    apiKey: GLOBAL_DATA.OPENAI_API_KEY,
});

export async function generateEdgeCases(formSchema: any) {
    const prompt = `
    You are a senior QA engineer testing a banking application.

    Given this form schema:

    ${JSON.stringify(formSchema, null, 2)}

    Generate high-risk edge cases targeting:
    - Validation bypass
    - Injection attempts
    - Boundary violations
    - Business logic flaws

    Return ONLY valid JSON in this format:


    {
        "cases": [
            {
                "testName": "description",
                "inputs": {
                    "fieldId": "value"
                },
                "expected": "validation_error | success"
            }
        ]
    }

    JSON only. No explanation.
    `;

    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
        response_format: { type: "json_object" },
    });

    const raw = response.choices[0].message.content || "";

    // Remove markdown code fences if present
    const cleaned = raw
        .replace(/```json/g, "")
        .replace(/```/g, "")
        .trim();

    try {
        return JSON.parse(cleaned);
    } catch (err) {
        console.error("AI returned invalid JSON:");
        console.error(cleaned);
        throw new Error("Failed to parse AI edge cases");
    }
}