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

        const formulaContexts = {
            'AIDA': 'Use the AIDA formula: First grab Attention, build Interest, create Desire, then call to Action',
            'PAS': 'Use the PAS formula: Identify the Problem, Agitate the pain points, present the Solution',
            'BAB': 'Use the BAB formula: Show the Before state, paint the After picture, provide the Bridge to get there',
            'FAB': 'Use the FAB formula: List the Features, explain the Advantages, emphasize the Benefits',
            '4Ps': 'Use the 4Ps formula: Make a Promise, Paint the Picture, Provide Proof, Push for action',
            'PASTOR': 'Use the PASTOR formula: Present the Problem, Amplify consequences, Share a Story, Show the Transformation, Make an Offer, Ask for Response',
            'QUEST': 'Use the QUEST formula: Qualify the audience, help them Understand the problem, Educate about solution, Stimulate interest, Transition to action',
            '4Cs': 'Use the 4Cs formula: Be Clear in message, Concise in delivery, Compelling in reasoning, Credible in proof',
            'PPPP': 'Use the PPPP formula: Paint the Picture of the problem, Make a Promise, Prove your claims, Push for action',
            'SSS': 'Use the SSS formula: Start with a Star (attention grabber), Tell a Story, Present the Solution',
            'ACCA': 'Use the ACCA formula: Build Awareness, ensure Comprehension, create Conviction, prompt Action',
            '6+1': 'Use the 6+1 formula: Answer Who, What, When, Where, Why, How + Address Money/Value aspect',
            'SLAP': 'Use the SLAP formula: Make them Stop scrolling, Look at the offer, Act on interest, Purchase the product',
            '1-2-3-4': 'Use the 1-2-3-4 formula: Present 1 Problem, Make 2 Promises, Provide 3 Proofs, Show 4 Action Steps'
        };

        try {
            const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`,
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    model: "mixtral-8x7b-32768",
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
                                 2. Write in a conversational, human-like tone
                                 3. Add suitable emojis to make the copy engaging
                                 4. Use short paragraphs and make it scannable
                                 5. Make it feel personal and relatable
                                 6. Avoid corporate jargon
                                 7. Include a clear call-to-action in ${languageName}
                                 8. Follow the selected formula structure strictly
                                 
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