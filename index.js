// movie-crud.js
const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { EJSON } = require('bson');

const uri = 'mongodb://localhost:27017';
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function insertMoviesFromFile() {
  await client.connect();
  const collection = client.db('movieDB').collection('movies');
  const fileData = fs.readFileSync(path.join(__dirname, 'movies.json'), 'utf-8');
  const movies = EJSON.parse(fileData);
  const result = await collection.insertMany(movies);
  console.log(`${result.insertedCount} movies inserted.`);
  await client.close();
}

async function addMovie() {
  await client.connect();
  const collection = client.db('movieDB').collection('movies');
  const newMovie = {
    title: "New Movie",
    release_date: "2024-01-01",
    genre: ["Drama"],
    vote_average: 8.5
  };
  const result = await collection.insertOne(newMovie);
  console.log(`New movie inserted with id: ${result.insertedId}`);
  await client.close();
}

async function getMovies() {
  await client.connect();
  const collection = client.db('movieDB').collection('movies');
  const movies = await collection.find({}).toArray();
  console.log(" All Movies:");
  console.log(movies);
  await client.close();
}

async function updateMovie() {
  await client.connect();
  const collection = client.db('movieDB').collection('movies');
  const filter = { title: "Midnight" };
  const updateDoc = { $set: { vote_average: 9.0 } };
  const result = await collection.updateOne(filter, updateDoc);
  console.log(` Updated ${result.modifiedCount} document(s)`);
  await client.close();
}

async function deleteMovie() {
  await client.connect();
  const collection = client.db('movieDB').collection('movies');
  const filter = { title: "New Movie" };
  const result = await collection.deleteOne(filter);
  console.log(`Deleted ${result.deletedCount} document(s)`);
  await client.close();
}

function showMenu() {
  console.log("\nChoose an operation:");
  console.log("1. Insert movies from file");
  console.log("2. Add a new movie");
  console.log("3. View all movies");
  console.log("4. Update a movie");
  console.log("5. Delete a movie");
  console.log("6. Exit");

  rl.question("Enter choice (1-6): ", async (choice) => {
    switch (choice) {
      case '1': await insertMoviesFromFile(); break;
      case '2': await addMovie(); break;
      case '3': await getMovies(); break;
      case '4': await updateMovie(); break;
      case '5': await deleteMovie(); break;
      case '6': rl.close(); return;
      default: console.log(" Invalid choice");
    }
    showMenu();
  });
}

showMenu();

