function titleCase(string) {
    string = string.toLowerCase().trim();
    const words = string.split(" ");
    const littleWords = new Set([
        "a", "an", "and", "as", "at", "but", "by",
        "for", "in", "nor", "of", "on", "or", "the",
        "up"
    ]);

    for (let i = 0; i < words.length; i += 1) {
        const word = words[i];
        if (i === 0) {
            words[i] = word[0].toUpperCase() + word.slice(1);
            continue;
        }
        if (!littleWords.has(word)) {
            words[i] = word[0].toUpperCase() + word.slice(1);
        }
    }

    return words.join(" ");
};


module.exports = titleCase;