const db = require("../util/database");
const Cart = require("./cart");

module.exports = class Product {
  constructor(id, title, imageUrl, description, price) {
    this.id = id;
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {}

  static deleteById(id) {}

  /**
   * Can call this in Product class and not just product instance because this is static
   * Works just like in Java
   * @returns
   */
  static fetchAll() {
    return db.execute("SELECT * FROM products");
  }

  static findById(id) {}
};
