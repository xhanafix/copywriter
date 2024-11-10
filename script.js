document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const copyBtn = document.getElementById('copy');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');

    generateBtn.addEventListener('click', generateCopy);
    copyBtn.addEventListener('click', copyToClipboard);

    async function generateCopy() {
        const apiKey = document.getElementById('apiKey').value;
        const product = document.getElementById('product').value;
        const painPoint = document.getElementById('painPoint').value;
        const formula = document.getElementById('formula').value;
        const tone = document.getElementById('tone').value;
        const languageSelect = document.getElementById('language');
        const language = languageSelect.value;
        const languageName = languageSelect.options[languageSelect.selectedIndex].text;

        if (!apiKey || !product || !painPoint) {
            alert('Please fill in all required fields');
            return;
        }

        loadingDiv.classList.remove('hidden');
        resultDiv.innerHTML = '';
        copyBtn.classList.add('hidden');

        try {
            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [{
                        role: "system",
                        content: `You are a professional copywriter who writes in ${languageName}. 
                                 Always respond in ${languageName} only.`
                    },
                    {
                        role: "user",
                        content: `Write a Facebook ad copy in ${languageName} for this product/service: ${product}. 
                                 Target audience pain point: ${painPoint}
                                 Use the ${formula} copywriting formula
                                 Tone of voice: ${tone}

                                 Important instructions:
                                 1. The entire response MUST be in ${languageName} only
                                 2. Write in a conversational, human-like tone
                                 3. Add suitable emojis to make the copy engaging
                                 4. Use short paragraphs and make it scannable
                                 5. Make it feel personal and relatable
                                 6. Avoid corporate jargon
                                 7. Include a clear call-to-action in ${languageName}
                                 
                                 For Bahasa Malaysia: Use casual Malaysian style
                                 For Tamil: Use proper Tamil grammar and script
                                 For Chinese: Use Simplified Chinese characters
                                 
                                 Please provide a compelling and conversion-focused ad copy.`
                    }],
                    max_tokens: 500,
                    temperature: 0.8
                })
            });

            const data = await response.json();

            if (data.error) {
                throw new Error(data.error.message);
            }

            resultDiv.innerText = data.choices[0].message.content;
            copyBtn.classList.remove('hidden');

        } catch (error) {
            resultDiv.innerHTML = `<span style="color: red;">Error: ${error.message}</span>`;
        } finally {
            loadingDiv.classList.add('hidden');
        }
    }

    function copyToClipboard() {
        const textToCopy = resultDiv.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = copyBtn.innerText;
            copyBtn.innerText = 'Copied!';
            copyBtn.classList.add('success');
            setTimeout(() => {
                copyBtn.innerText = originalText;
                copyBtn.classList.remove('success');
            }, 2000);
        });
    }
}); 