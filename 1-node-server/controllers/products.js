const products = [];

exports.getAddProduct = (req, res, next) => {
  res.render("add-product", {
    pageTitle: "Add Product",
    path: "/admin/add-product",
    formsCSS: true,
    productsCSS: true,
    activeAddProduct: true,
  });
};

exports.getProducts = (req, res, next) => {
  res.render("shop", {
    prods: products,
    docTitle: "Shop",
    path: "/",
    pageTitle: "Shop",
    hasProducts: products.length > 0,
    activeShop: true,
    productCSS: true,
    //layouts: false to disable main-layout
  });
};

exports.postAddProduct = (req, res, next) => {
  products.push({ title: req.body.title });
  res.redirect("/");
};

exports.products = products;