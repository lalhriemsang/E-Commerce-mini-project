const url = "https://dummyjson.com/products";

const prodImages = {};
const cartItems = {};
const productsEl = document.querySelector(".products");
const cartBtn = document.getElementById("cartBtn");
const cartEl = document.getElementById("cart");
let totalPrice = 0;

async function getResponse() {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error("Response failed");

    const data = await response.json();
    const products = data.products;

    console.log(products[0]);

    for (const product of products) {
      const productEl = document.createElement("div");
      productEl.classList.add("product");

      productEl.id = product.id;
      const imgContainer = document.createElement("div");
      imgContainer.classList.add("img_con");

      const img = document.createElement("img");
      img.classList.add("img");

      img.src = product.images[0];

      prodImages[product.id] = { urls: product.images, index: 0 };

      const prv = document.createElement("button");
      prv.textContent = "<<";
      prv.addEventListener("click", function () {
        const prodID = product.id;
        const images = prodImages[prodID].urls;
        const n = images.length;
        const index = prodImages[prodID].index;

        if (index - 1 < 0) {
          img.src = images[n - 1];
          prodImages[prodID].index = n - 1;
        } else {
          img.src = images[index - 1];
          prodImages[prodID].index = index - 1;
        }
      });
      imgContainer.appendChild(prv);

      imgContainer.appendChild(img);

      const next = document.createElement("button");
      next.textContent = ">>";
      next.addEventListener("click", function () {
        const prodID = product.id;
        const images = prodImages[prodID].urls;
        const n = images.length;
        const index = prodImages[prodID].index;

        img.src = images[(index + 1) % n];
        prodImages[prodID].index = (index + 1) % n;
      });
      imgContainer.appendChild(next);

      const cardFooter = document.createElement("div");
      cardFooter.classList.add("card_footer");

      cardFooter.innerHTML = `<h4 class="card_footer">${product.title}</h4> <p>Price:$${product.price}</p>`;

      const addToCartBtn = document.createElement("button");
      addToCartBtn.classList.add("addToCartBtn");
      addToCartBtn.textContent = "Add to Cart";
      addToCartBtn.addEventListener("click", function () {
        addToCartBtn.style.transform = "scale(1.1)";
        setTimeout(function () {
          addToCartBtn.style.transform = "";
        }, 200);

        totalPrice += product.price;

        if (product.id in cartItems) {
          cartItems[product.id]++;

          const cartItemEls = document.querySelectorAll(".cart_item");

          for (const cartItem of cartItemEls) {
            console.log(cartItem, cartItem.id);

            if (cartItem.id == product.id) {
              const cardItemSpan = cartItem.querySelector("span");
              cardItemSpan.innerHTML = `<b>${product.title}</b> &nbsp; Price:${
                product.price
              } &nbsp; Quant:$${cartItems[product.id]}`;

              break;
            }
          }
        } else {
          cartItems[product.id] = 1;

          const cartItemEl = document.createElement("div");
          cartItemEl.classList.add("cart_item");
          cartItemEl.id = product.id;

          const cartItemInfo = document.createElement("span");

          cartItemInfo.innerHTML = `<b>${product.title}</b> &nbsp; Price:${
            product.price
          } &nbsp; Quant:${cartItems[product.id]}`;

          const decreaseBtn = document.createElement("button");
          decreaseBtn.textContent = "-";

          decreaseBtn.addEventListener("click", function () {
            if (cartItems[product.id]) totalPrice -= product.price;
            cartItems[product.id]--;

            const cartItemEls = document.querySelectorAll(".cart_item");

            if (cartItems[product.id] === 0) {
              cartItemEl.remove();
              delete cartItems[product.id];
              return;
            }

            for (const cartItem of cartItemEls) {
              console.log(cartItem, cartItem.id);

              if (cartItem.id == product.id) {
                const cardItemSpan = cartItem.querySelector("span");
                cardItemSpan.innerHTML = `<b>${
                  product.title
                }</b> &nbsp; Price:${product.price} &nbsp; Quant:$${
                  cartItems[product.id]
                }`;

                break;
              }
            }
          });

          cartItemEl.appendChild(cartItemInfo);
          cartItemEl.appendChild(decreaseBtn);
          cartEl.appendChild(cartItemEl);
        }
      });

      cardFooter.appendChild(addToCartBtn);
      productEl.appendChild(imgContainer);
      productEl.appendChild(cardFooter);

      productsEl.appendChild(productEl);
    }
  } catch (err) {
    console.log(err);
    return;
  }
}

getResponse();

cartBtn.addEventListener("click", function () {
  if (cartEl.style.display == "none") {
    productsEl.style.display = "none";
    cartEl.style.display = "block";
  } else {
    productsEl.style.display = "flex";
    cartEl.style.display = "none";
  }
});

const checkoutBtn = document.getElementById("checkoutBtn");
checkoutBtn.addEventListener("click", function () {
  alert(`Total Price is: ${totalPrice}`);
});
