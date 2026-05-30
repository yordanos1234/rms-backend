const mongoose = require('mongoose');

let mongod = null;

const connectDB = async () => {
  const uri = process.env.MONGODB_URI;

  if (uri) {
    try {
      await mongoose.connect(uri);
      console.log('MongoDB Connected to:', uri.replace(/:.*@/, ':****@'));
      return;
    } catch (err) {
      console.error('Failed to connect to MongoDB with MONGODB_URI:', err.message);
      if (process.env.NODE_ENV === 'production') {
        console.error('MONGODB_URI is set but connection failed. Exiting.');
        process.exit(1);
      }
    }
  }

  // Fallback: in-memory MongoDB for local development only
  if (process.env.NODE_ENV === 'production') {
    console.error('\n❌ ERROR: MONGODB_URI environment variable is required in production.');
    console.error('   Please set it in your Render dashboard (e.g., from MongoDB Atlas).\n');
    process.exit(1);
  }

  console.warn('MONGODB_URI not set. Starting in-memory MongoDB for local development...');
  try {
    const { MongoMemoryServer } = require('mongodb-memory-server');
    mongod = await MongoMemoryServer.create();
    const memUri = mongod.getUri();
    await mongoose.connect(memUri, { dbName: 'rms' });
    console.log('In-Memory MongoDB Connected:', memUri);
  } catch (memErr) {
    console.error('MongoDB connection error:', memErr.message);
    process.exit(1);
  }
};

module.exports = connectDB;
