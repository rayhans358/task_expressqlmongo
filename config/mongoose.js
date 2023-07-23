const mongoose = require('mongoose');

mongoose.connect('mongodb://najib:67890@0.0.0.0:27017/task-mongoose?authSource=admin');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error: '));
db.once('open', () => console.log('Server database terhubung'));