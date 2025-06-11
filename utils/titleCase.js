function titleCase(string) {
    string = string.toLowerCase().trim();
    const words = string.split(" ");
    const cleanedWords = [];
    const littleWords = new Set([
        "a", "an", "and", "as", "at", "but", "by",
        "for", "in", "nor", "of", "on", "or", "the",
        "up"
    ]);

    for (let i = 0; i < words.length; i += 1) {
        let word = words[i].trim();

        if (word === "") {
            continue;
        }

        if (i === 0) {
            cleanedWords.push(
                word.slice(0, 1).toUpperCase() + word.slice(1)
            );
            continue;
        }

        if (littleWords.has(word)) {
            cleanedWords.push(word);
        } else {
            cleanedWords.push(
                word.slice(0, 1).toUpperCase() + word.slice(1)
            );
        }
    }

    return cleanedWords.join(" ");
};


module.exports = titleCase;