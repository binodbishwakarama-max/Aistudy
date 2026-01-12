const mongoose = require('mongoose');
const Datastore = require('nedb-promises');
const path = require('path');
const User = require('./models/User');
const StudySet = require('./models/StudySet');

let db = {
    mode: 'nedb', // default
    users: null,
    studySets: null
};

if (process.env.MONGODB_URI) {
    // MongoDB Mode
    console.log('Using MongoDB Atlas');
    db.mode = 'mongo';
    mongoose.connect(process.env.MONGODB_URI)
        .then(() => console.log('✅ Connected to MongoDB'))
        .catch(err => console.error('❌ MongoDB Connection Error:', err));

    db.users = {
        findOne: (query) => User.findOne(query),
        insert: (doc) => User.create(doc),
        findById: (id) => User.findById(id),
    };

    db.studySets = {
        insert: (doc) => StudySet.create(doc),
        find: (query) => StudySet.find(query).sort({ createdAt: -1 }),
        count: (query) => StudySet.countDocuments(query),
    };

} else {
    // NeDB Mode (Local Fallback)
    console.log('Using Local NeDB');
    const createDatastore = (name) => {
        return Datastore.create({
            filename: path.join(__dirname, 'data', `${name}.db`),
            autoload: true,
            timestampData: true
        });
    };

    const users = createDatastore('users');
    const studySets = createDatastore('studysets');

    users.ensureIndex({ fieldName: 'email', unique: true });

    db.users = users;
    db.studySets = studySets;
}

module.exports = db;
