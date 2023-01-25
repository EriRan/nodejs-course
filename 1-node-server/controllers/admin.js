const Product = require("../models/product")

exports.getAddProduct = (req, res, next) => {
  res.render("admin/edit-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    editing: false,
  });
};

exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  // Sequelize adds automatically a method like this with the relationship
  // MAGIC
  const product = new Product(title, price, description, imageUrl);

  product
    .save()
    .then((result) => {
      console.log("Product created");
      res.redirect("/admin/products");
    })
    .catch((err) => console.error(err));
};
