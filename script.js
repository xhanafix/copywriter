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
        const language = document.getElementById('language').value;

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
                        role: "user",
                        content: `Generate a Facebook ad copy for ${product}. 
                                 Target audience pain point: ${painPoint}
                                 Use the ${formula} copywriting formula
                                 Tone of voice: ${tone}
                                 Language: ${language}
                                 Please provide a compelling and conversion-focused ad copy.`
                    }],
                    max_tokens: 500,
                    temperature: 0.7
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
            setTimeout(() => {
                copyBtn.innerText = originalText;
            }, 2000);
        });
    }
}); 