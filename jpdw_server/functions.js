const hiraganaSyllables = [ "あ", "い", "う", "え", "お", "か", "き", "く", "け", "こ",
                            "さ", "し", "す", "せ", "そ", "た", "ち", "つ", "て", "と",
                            "な", "に", "ぬ", "ね", "の", "は", "ひ", "ふ", "へ", "ほ",
                            "ま", "み", "む", "め", "も", "や", "ゆ", "よ",
                            "ら", "り", "る", "れ", "ろ", "わ", "を", "ん",
                            "が", "ぎ", "ぐ", "げ", "ご", "ざ", "じ", "ず", "ぜ", "ぞ",
                            "だ", "ぢ", "づ", "で", "ど", "ば", "び", "ぶ", "べ", "ぼ", 
                            "ぱ", "ぴ", "ぷ", "ぺ", "ぽ", "ゔ"];

const katakanaSyllables = [ "ア", "イ", "ウ", "エ", "オ", "カ", "キ", "ク", "ケ", "コ",
                            "サ", "シ", "ス", "セ", "ソ", "タ", "チ", "ツ", "テ", "ト",
                            "ナ", "ニ", "ヌ", "ネ", "ノ", "ハ", "ヒ", "フ", "ヘ", "ホ",
                            "マ", "ミ", "ム", "メ", "モ", "ヤ", "ユ", "ヨ",
                            "ラ", "リ", "ル", "レ", "ロ", "ワ", "ヲ", "ン",
                            "ガ", "ギ", "グ", "ゲ", "ゴ", "ザ", "ジ", "ズ", "ゼ", "ゾ",
                            "ダ", "ヂ", "ヅ", "デ", "ド", "バ", "ビ", "ブ", "ベ", "ボ", 
                            "パ", "ピ", "プ", "ペ", "ポ", "ヴ"];

const LEVEL5 = "jlpt-n5";
const LEVEL4 = "jlpt-n4";
const LEVEL3 = "jlpt-n3";
const LEVEL2 = "jlpt-n2";
const LEVEL1 = "jlpt-n1";

function getRandomSyllable(syllables) {
    const randomIndex = Math.floor(Math.random() * syllables.length);
    return syllables[randomIndex];
}

function getRandomHiragana() {
    return getRandomSyllable(hiraganaSyllables);
}

function getRandomKatakana() {
    return getRandomSyllable(katakanaSyllables);
}

async function getJishoResults(query, level) {
    const url = `https://jisho.org/api/v1/search/words?keyword=${encodeURIComponent(query)}%20%23${level}`;
    try {
        const response = await fetch(url);
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            console.error(`Error when trying to fetch the results from Jisho API: ${response.status}`);
            return null;
        }
    } catch (error) {
        console.error('Error when getting data from Jisho API:', error);
        return null;
    }
}

module.exports = {getRandomHiragana, getRandomKatakana, getJishoResults, LEVEL1, LEVEL2, LEVEL3, LEVEL4, LEVEL5};