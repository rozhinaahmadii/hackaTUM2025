// src/api/thinkImmo.js

const API_URL = "https://thinkimmo-api.mgraetz.de/thinkimmo";

export async function searchProperties(params) {
  console.log("Request Body:");
  console.log(JSON.stringify(params, null, 2));
  console.log();

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    console.log("==============================================================");
    console.log("HTTP RESPONSE");
    console.log(`Status: ${response.status}`);
    console.log(`Content-Type: ${response.headers.get("Content-Type")}\n`);

    if (!response.ok) {
      const errText = await response.text();
      console.error("Error Response:", errText);
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log("Fetched data:", data);
    return data;
  } catch (err) {
    console.error("Error:", err);
    throw err;
  }
}
