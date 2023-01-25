const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

const mongoConnect = (callback) => {
  const mongodbUrl = `mongodb+srv://${process.env.mongodb_user}:${process.env.mongodb_password}@${process.env.mongodb_cluster_address}/?retryWrites=true&w=majority`;

  console.log(mongodbUrl);

  MongoClient.connect(mongodbUrl)
    .then((result) => {
      console.log("Connected to MongoDb!");
      callback(result);
    })
    .catch((err) => console.error(err));
};

module.exports = mongoConnect;