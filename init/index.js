const mongoose = require('mongoose');
const initdata = require('./data.js');
const Listing = require('../models/listing.js');

// connect to mongodb
main()
.then(() =>{
    console.log('Connected to MongoDB');
})
.catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}

// Now intialize the data

const initDb = async () => {
    await Listing.deleteMany({});
    // insert the owener id in each lisgtin avaliable in the data.js file
    initdata.data = initdata.data.map((obj) => ({ ...obj, owner: '67d56508e3cd3462a9927a9d' }));
    await Listing.insertMany(initdata.data);
    console.log('Database initialized');
}

initDb();

