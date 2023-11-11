const mongoose = require('mongoose');

const HomeSchema = new mongoose.Schema({
    título: { type: String, required: true },
    descricao: String
});

const HomeModel = mongoose.model('Home', HomeSchema);

module.exports = Home;
