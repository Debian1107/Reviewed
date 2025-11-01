// pages/api/submitReview.ts

export default async function aiCheckItem(itemData: string) {
  try {
    const reviewText = `
    You are an expert content validation AI. Your task is to check whether the provided item is a real, meaningful, and valid object that could plausibly exist in the real world.

        You will be given an item with these fields:
        - name
        - description
        - category
        - tags

        You must determine:
        1. Whether the name refers to a valid, identifiable, real-world object, product, or concept. It should not be nonsense, gibberish, or inappropriate content.
        2. Whether the description correctly and clearly describes the item, matching the name in a factual and coherent way.
        3. Whether the item is appropriate (no violence, sexual, hateful, or spam content).

        Respond **only in valid JSON** with this exact format:

        {
        "isValid": true | false,
        "reason": "Short explanation of why it is valid or invalid."
        }

        Guidelines:
        - "isValid" should be true only if both name and description are coherent, realistic, and properly matched.
        - If the item name is random letters (e.g. "asdfqwer") → invalid.
        - If the description doesn't match the item (e.g. name 'Banana' but description 'a type of shoe') → invalid.
        - If the item is offensive, nonsensical, or vague → invalid.
        - If the item is clearly a real product or object (e.g. 'iPhone 15' with a realistic description) → valid.

        Example input:
        {
        "name": "Gaming Laptop",
        "description": "A portable computer optimized for gaming performance with high-end graphics and cooling system.",
        "category": "Electronics",
        "tags": ["laptop", "gaming", "computer"]
        }

        Example output:
        {
        "isValid": true,
        "reason": "The item is a real, coherent product with an appropriate description."
        }

        Now evaluate this item:

${itemData}



    `;
    // 1. Run authentication / middleware (you already have)
    // 2. Call Gemini API to check the review
    const apiKey = process.env.GEMINI_API_KEY;
    const endpoint =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";

    const body = {
      contents: [{ parts: [{ text: reviewText }] }],
      model: "gemini-2.5-flash",
    };

    const apiRes = await fetch(endpoint, {
      method: "POST",
      headers: {
        "x-goog-api-key": apiKey!,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    const apiJson = await apiRes.json();
    console.log("Gemini API response:", apiJson);
    const aiText = apiJson.candidates?.[0]?.content?.parts?.[0]?.text;
    console.log("Gemini API response content " + aiText);

    let result;
    try {
      result = JSON.parse(aiText);
    } catch {
      // fallback: try to find JSON in text with regex
      const match = aiText.match(/\{[\s\S]*\}/);
      if (match) {
        result = JSON.parse(match[0]);
      } else {
        throw new Error("Invalid JSON output from Gemini");
      }
    }

    console.log("Parsed AI content check result:", result);

    return result;
  } catch (error) {
    console.error("Error in AI content check:", error);
    return { isValid: false, reason: "Not able to check at the moment." };
  }
}
