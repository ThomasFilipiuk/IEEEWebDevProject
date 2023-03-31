import { MongoClient } from "mongodb";
import { config } from 'dotenv';

export async function connectToCluster(uri) {
  let mongoClient;

  try {
    mongoClient = new MongoClient(uri);
    console.log("Connecting to MongoDB Atlas cluster...");
    await mongoClient.connect();
    console.log("Successfully connected to MongoDB Atlas!");

    return mongoClient;
  } catch (error) {
    console.error("Connection to MongoDB Atlas failed!", error);
    process.exit();
  }
}

export async function createReviewDocument(collection, review, user) {
  const reviewDocument = {
    author: user.name,
    imageLink: review.imageLink,
    likes: 0,
    rating: review.rating,
    text: review.text,
  };

  await collection.insertOne(reviewDocument);
}

export async function executeCreateReviewDocument(review, user) {
  const uri = import.meta.env.VITE_DB_URI;
  let mongoClient;

  try {
    mongoClient = await connectToCluster(uri);
    const db = mongoClient.db("reviews");
    const collection = db.collection("reviews");

    console.log('CREATE review');
    await createReviewDocument(collection, review, user);
  } finally {
    await mongoClient.close();
  }
}

