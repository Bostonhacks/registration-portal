var fs = require('fs');

// reads all questions from config/application-questions and returns them as a JSON
function findAll(req, res) {
    questions = JSON.parse(fs.readFileSync('../config/application-questions.json', 'utf8'))
    res.send(questions)
}

module.exports = {
    findAll: findAll
}