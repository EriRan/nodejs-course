const deleteProduct = (btn) => {
  const prodId = btn.parentNode.querySelector("[name=productId]").value;
  const csrf = btn.parentNode.querySelector("[name=_csrf]").value;

  const productElement = btn.closest("article");

  // Here we send a request to backend and when we get a response, we manually remove the HTML element that held the product that this function was
  // called with
  fetch("/admin/product/" + prodId, {
    method: "DELETE",
    headers: {
      "csrf-token": csrf,
    },
  })
    .then((result) => {
      return result.json();
    })
    .then((data) => {
      console.log("Client removal")
      productElement.remove();
    })
    .catch((err) => {
      console.error(err);
    });
};
