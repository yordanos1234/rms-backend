const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongod = null;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/rms';
    await mongoose.connect(uri);
    console.log('MongoDB Connected to:', uri);
  } catch (err) {
    console.warn('Local MongoDB not available, starting in-memory MongoDB...');
    try {
      mongod = await MongoMemoryServer.create({
        binary: { version: '6.0.16' }
      });
      const uri = mongod.getUri();
      await mongoose.connect(uri, { dbName: 'rms' });
      console.log('In-Memory MongoDB Connected:', uri);
    } catch (memErr) {
      console.error('MongoDB connection error:', memErr);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
