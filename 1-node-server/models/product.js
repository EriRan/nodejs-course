const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
  }

  save() {
    const db = getDb();
    return db
      .collection("products")
      .insertOne(this)
      .then((result) => {
        console.log(result);
      })
      .catch((err) => console.error(err));
  }

  static fetchAll() {
    const db = getDb();
    // find can contain a filter object
    // Find returns next iterable, not all of them at once
    // Pagination implemented later
    return db
      .collection("products")
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((err) => console.error(err));
  }

  static findById(prodId) {
    const db = getDb();
    // find can contain a filter object
    // Find returns next iterable, not all of them at once
    // Pagination implemented later
    return db
      .collection("products")
      .find({ _id: mongoDb.ObjectId(prodId) }) // This is not correct due to some reason. Outputs an error "BSONTypeError: Argument passed in must be a string of 12 bytes or a string of 24 hex characters or an integer"
      .next()
      .then((product) => {
        console.log(product);
        return product;
      })
      .catch((err) => console.error(err));
  }
}

module.exports = Product;
