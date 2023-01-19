// This is replaced later with a real database
const products = [];

module.exports = class Product {
  constructor(title) {
    this.title = title;
  }

  save() {
    products.push(this);
  }

  /**
   * Can call this in Product class and not just product instance
   * @returns 
   */
  static fetchAll() {
    return products;
  }
};
