const MAX_RETRIES = 3; // Número máximo de intentos

document.addEventListener('DOMContentLoaded', async function () {
    try {
        const data = await fetchRandomJapaneseWordWithRetry(MAX_RETRIES);
        renderWord(data);
    } catch (error) {
        console.error('Error fetching random word:', error);
        const wordContainer = document.getElementById('wordData');
        wordContainer.innerHTML = '<p>Error al obtener la palabra japonesa aleatoria.</p>';
    }
});

async function fetchRandomJapaneseWordWithRetry(maxRetries) {
    let retries = 0;
    while (retries < maxRetries) {
        try {
            const response = await fetch('http://localhost:3001/api/v1/random-japanese-word');
            if (!response.ok) {
                throw new Error('Failed to fetch random Japanese word');
            }
            const data = await response.json();
            if (data.wordData && Object.keys(data.wordData).length > 0) {
                return data;
            } else {
                retries++;
                console.log(`Attempt ${retries}/${maxRetries}: No valid results found.`);
            }
        } catch (error) {
            retries++;
            console.error(`Attempt ${retries}/${maxRetries}: Error fetching random word:`, error);
        }
    }
    throw new Error(`Failed to fetch random Japanese word after ${maxRetries} attempts`);
}

function renderWord(data) {
    const randomHiraganaElement = document.getElementById('randomHiragana');
    const wordDataElement = document.getElementById('wordData');

    randomHiraganaElement.textContent = `Today's word is: ${data.wordData.slug}`;

    const wordData = data.wordData;
    if (wordData) {
        // Function to remove duplicates and ignore casing
        const removeDuplicates = (array) => {
            return array.filter((item, index) => array.findIndex(i => i.trim().toLowerCase() === item.trim().toLowerCase()) === index);
        };

        // Gather definitions and parts of speech
        let definitions = [];
        let partsOfSpeech = [];
        let readings = [];

        wordData.senses.forEach(sense => {
            definitions.push(...sense.english_definitions);
            partsOfSpeech.push(...sense.parts_of_speech);
        });

        // Remove duplicates and format casing for definitions and parts of speech
        definitions = removeDuplicates(definitions.map(def => def.trim()));
        partsOfSpeech = removeDuplicates(partsOfSpeech.map(pos => pos.trim())).filter(pos => pos.toLowerCase() !== 'wikipedia definition');

        // Gather readings and remove duplicates ignoring casing
        readings = removeDuplicates(wordData.japanese.map(entry => entry.reading.trim()));

        // Build HTML
        let html = `
            <p><strong>JLPT Level:</strong> ${wordData.jlpt.join(', ')}</p>
            <p><strong>Readings:</strong> ${readings.join(', ')}</p>
            <p><strong>Definitions:</strong> ${definitions.join(', ')}</p>
        `;
        if (partsOfSpeech.length > 0) {
            html += `<p><strong>Parts of Speech:</strong> ${partsOfSpeech.join(', ')}</p>`;
        }

        wordDataElement.innerHTML = html;
    } else {
        wordDataElement.innerHTML = '<p>No results found.</p>';
    }
}



