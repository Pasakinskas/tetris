class Utilities {
    static randinteger(size) {
        let root = size * Math.random();
        return Math.floor(root);
    }
    static repeat(times, callback) {
        for (var i = 0; i < times; i++)
            callback(i);
    }
    static randLetter() {
        let letters = ["I", "J", "L", "O", "S", "Z", "T"];
        return letters[this.randinteger(letters.length)];
    }
}

