document.addEventListener('DOMContentLoaded', () => {
    const generateBtn = document.getElementById('generate');
    const copyBtn = document.getElementById('copy');
    const resultDiv = document.getElementById('result');
    const loadingDiv = document.getElementById('loading');
    const apiProvider = document.getElementById('apiProvider');
    const openaiHint = document.getElementById('openaiHint');
    const groqHint = document.getElementById('groqHint');
    const openrouterHint = document.getElementById('openrouterHint');

    // Handle API provider change
    apiProvider.addEventListener('change', () => {
        // Hide all hints
        openaiHint.style.display = 'none';
        groqHint.style.display = 'none';
        openrouterHint.style.display = 'none';

        // Show selected provider hint
        switch(apiProvider.value) {
            case 'openai':
                openaiHint.style.display = 'block';
                break;
            case 'groq':
                groqHint.style.display = 'block';
                break;
            case 'openrouter':
                openrouterHint.style.display = 'block';
                break;
        }
    });

    generateBtn.addEventListener('click', generateCopy);
    copyBtn.addEventListener('click', copyToClipboard);

    async function generateCopy() {
        const apiKey = document.getElementById('apiKey').value;
        const provider = apiProvider.value;
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

        // API configuration based on provider
        const apiConfig = {
            openai: {
                url: 'https://api.openai.com/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                model: 'gpt-3.5-turbo'
            },
            groq: {
                url: 'https://api.groq.com/openai/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                model: 'mixtral-8x7b-32768'
            },
            openrouter: {
                url: 'https://openrouter.ai/api/v1/chat/completions',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'HTTP-Referer': window.location.href,
                    'X-Title': 'FB Ads Copy Generator'
                },
                model: 'mistralai/mixtral-8x7b-instruct'
            }
        };

        const selectedAPI = apiConfig[provider];

        try {
            const response = await fetch(selectedAPI.url, {
                method: 'POST',
                headers: selectedAPI.headers,
                body: JSON.stringify({
                    model: selectedAPI.model,
                    messages: [{
                        role: "system",
                        content: `You are a professional copywriter who writes in ${languageName}. 
                                 Always respond in ${languageName} only.`
                    },
                    {
                        role: "user",
                        content: `Act as a world class copywriter. Write a Facebook ad copy in ${languageName} for this product/service: ${product}. 
                                 Target audience pain point: ${painPoint}
                                 ${formulaContexts[formula]}
                                 Tone of voice: ${tone}

                                 Important instructions:
                                 1. Start with strong hookline to grab attention
                                 2. The entire response MUST be in ${languageName} only
                                 3. Write in a conversational, human-like tone
                                 4. Add suitable emojis to make the copy engaging
                                 5. Use short paragraphs and make it scannable
                                 6. Make it feel personal and relatable
                                 7. Avoid corporate jargon
                                 8. Include a clear call-to-action in ${languageName}
                                 9. Follow the selected formula structure strictly
                                 
                                 For Bahasa Malaysia: Use casual Malaysian style
                                 For Tamil: Use proper Tamil grammar and script
                                 For Chinese: Use Simplified Chinese characters
                                 
                                 Please provide a compelling and conversion-focused ad copy.`
                    }],
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