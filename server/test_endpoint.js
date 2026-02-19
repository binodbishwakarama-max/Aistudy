
const fetch = require('node-fetch'); // Check if node-fetch is available. If not use native fetch if node version allows.
// Actually let's assume native fetch is available or use http.

// Since I don't know the node version for sure (though likely 18+), I will try native fetch first.
// If not, I'll use http module.

async function testEndpoint() {
    try {
        console.log("Testing /api/generate...");
        const response = await fetch('http://localhost:3000/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                prompt: "Explain quantum computing in one sentence."
            })
        });

        if (!response.ok) {
            console.error(`HTTP error! status: ${response.status}`);
            const text = await response.text();
            console.error(`Response: ${text}`);
            return;
        }

        const data = await response.json();
        console.log("Response data:", data);
        if (data.content && data.content.length > 0) {
            console.log("✅ API Test Passed!");
            console.log("Content:", data.content[0].text);
            console.log("Provider:", data.provider);
        } else {
            console.error("❌ API Test Failed: No content returned.");
        }

    } catch (error) {
        console.error("❌ API Test Failed:", error.message);
    }
}

testEndpoint();
