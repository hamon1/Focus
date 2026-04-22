const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'data.json');

function read() {
    if (!fs.existsSync(filePath)) return [];
    return JSON.parse(fs.readFileSync(filePath));
}

function write(data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

module.exports = {
    save(session) {
        const data = read();
        data.push(session);
        write(data);
    },

    getAll() {
        return read();
    }
};