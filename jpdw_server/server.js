const {
    getRandomHiragana,
    getRandomKatakana,
    getJishoResults,
    LEVEL1,
    LEVEL2,
    LEVEL3,
    LEVEL4,
    LEVEL5
} = require('./functions');
const express = require('express');
const cors = require('cors');

const app = express();
const corsOptions = {
    origin: '*',
    optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
    res.json("Welp, this isn't the api...");
});

let lastGeneratedWord = null;
let lastGeneratedDate = null;

app.get('/api/v1/random-japanese-word', async (req, res) => {
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    // Check date and last time a word was generated
    if (lastGeneratedDate || lastGeneratedDate == today) {
        res.json({ word: lastGeneratedWord, message: 'Word already generated for today' });
    }

    try {
        // Current level
        const lvl = LEVEL5;
        // Get random Hiragana to query the API
        const randomHiragana = getRandomHiragana();
        console.log("Random Hiragana: " + randomHiragana);
        // Call jisho api here to get information about the word
        const wordData = await getJishoResults(randomHiragana, lvl);
        console.log("WordData: "+wordData);

        // Check if wordData is not valid and status is not 200
        if (!wordData && !wordData.meta && wordData.meta.status !== 200) {
            console.error('Invalid response from Jisho API:', wordData);
            res.status(500).json({ error: 'Invalid response from Jisho API' });
        }

        // Filter and validate results
        const validResults = wordData.data.filter(result => {
            // Ensure 'slug' exists and is not empty, null or whitespace
            return result.slug && result.slug.trim() !== '';
        });

        // Check if there are no valid results
        if (validResults.length <= 0) {
            console.error('No valid results found.');
            res.status(500).json({ error: 'No valid results found' });
        }

        // Choose a random valid result
        const randomValidResult = validResults[Math.floor(Math.random() * validResults.length)];
        console.log("Random Valid Result:", randomValidResult);

        // Prepare data to store in array
        const resultToStore = {
            slug: randomValidResult.slug,
            jlpt: randomValidResult.jlpt,
            japanese: randomValidResult.japanese,
            senses: randomValidResult.senses.map(sense => ({
                english_definitions: sense.english_definitions || [],
                parts_of_speech: sense.parts_of_speech || [],
                tags: sense.tags || [],
                see_also: sense.see_also || []
            })),
            attribution: randomValidResult.attribution.dbpedia || ''
        };

        // Update last generated word and date
        // lastGeneratedWord = resultToStore.slug;
        // lastGeneratedDate = today;

        res.json({ randomHiragana, wordData: resultToStore });
    } catch (error) {
        console.error('Error fetching random word:', error);
        res.status(500).json({ error: 'Failed to fetch random word' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
