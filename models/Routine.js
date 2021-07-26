const mongoose = require('mongoose');

const RoutineSchema = new mongoose.Schema({

    userId: {
        type: String,
    },
    routineName: {
        type: String,
    },
    routine: {
        type: Array,
    },

});






module.exports = mongoose.model('Routine', RoutineSchema);