const url = require('url');
const MongoClient = require('mongodb').MongoClient;

let cachedDb = null;

async function connectToDatabase(uri) {

    if (cachedDb) {
        return cachedDb
    }

    const client = await MongoClient.connect(uri, {useNewUrlParser: true});

    const db = await client.db(url.parse(uri).pathname.substr(1));

    cachedDb = db;
    return db
}

module.exports = async (req, res) => {
    const userName = req.query.user;
    const db = await connectToDatabase(process.env.MONGODB_URI)

    const collection = await db.collection('users')

    await collection.findOne({'userName': userName}, function (findErr, result) {
        if (findErr) throw findErr;

        res.status(200).json(result)
    });
}