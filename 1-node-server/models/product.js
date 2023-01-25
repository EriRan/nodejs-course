const mongoDb = require("mongodb");
const getDb = require("../util/database").getDb;

class Product {
  constructor(title, price, description, imageUrl, id) {
    this.title = title;
    this.price = price;
    this.description = description;
    this.imageUrl = imageUrl;
    this._id = id ? new mongoDb.ObjectId(id) : null;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      // Update the product
      dbOp = db
        .collection("products")
        // Describe update target and then describe what we update
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection("products").insertOne(this);
    }
    return dbOp
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

  static deleteById(prodId) {
    const db = getDb();
    return db
      .collection("products")
      .deleteOne({ _id: new mongoDb.ObjectId(prodId) })
      .then((result) => {
        console.log("Deleted");
      })
      .catch((err) => console.error(err));
  }
}

module.exports = Product;
