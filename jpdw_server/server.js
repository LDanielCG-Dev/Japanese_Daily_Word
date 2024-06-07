const JishoAPI = require('unofficial-jisho-api');
const faker = require('faker');
faker.locale = 'ja';
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

app.get('/api/random-japanese-word', async (req, res) => {
    const currentDate = new Date();
    const today = new Date(currentDate.getFullYear(), currentDate.getMonth(), currentDate.getDate());

    if (!lastGeneratedDate || lastGeneratedDate < today) {
        try {

            // Call unofficial-jisho-api here to get information about the word
            const randomWord = faker.lorem.word();
            console.log(randomWord);
            const jisho = new JishoAPI();

            // Search the random word in the jisho API
            const wordInfo = await jisho.searchForPhrase(randomWord);

            const wordSorted = wordInfo.data[0];

            // Update last generated word and date
            // lastGeneratedWord = randomWord;
            // lastGeneratedDate = today;

            res.json({ randomWord, wordSorted });
            console.log(wordSorted);

        } catch (error) {
            console.error('Error fetching random word:', error);
            res.status(500).json({ error: 'Failed to fetch random word' });
        }
    } else {
        res.json({ word: lastGeneratedWord, message: 'Word already generated for today' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
