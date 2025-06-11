function capitalize(words) {
    words = words.split(" ");
    const cleanedWords = [];
    
    for (let i = 0; i < words.length; i += 1) {
        let word = words[i];
        word = word.trim().toLowerCase();
        if (word === "") {
            continue;
        }
        cleanedWords.push(
            word.slice(0 ,1).toUpperCase() + word.slice(1)
        );
    }

    return cleanedWords.join(" ");
};

module.exports = capitalize;