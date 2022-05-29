/*
 * Name: Jennie Chung
 * CS 132 Spring 2022
 * This is the js file for our final project, an e-commerce store which sells
 * jewelry. This file contains client-side code which allows users to switch
 * between views and interact with UI elements.
 *
 */

(function()  {
  "use strict";

  // URLs to access server
  const BASE_URL = "/";

  /**
   * Function for initializing the home page. Creates UI elements and adds
   * event listeners.
   */
  function init() {
    // Add event listeners to dropdowns
    let typeSelect = id("type-select");
    let priceSelect = id("price-select");
    let colorSelect = id("color-select")
    let styleSelect = id("style-select");

    let selects = [typeSelect, priceSelect, colorSelect, styleSelect];
    for (const select of selects) {
      select.addEventListener("change", getProducts);
    }

    // Add colors
    addColorOptions();

    // Add products to the main page
    getProducts();
  }

  async function getProducts() {
    // Clear out any old jewelry displays
    let products = id("products");
    products.innerHTML = "";

    let url = BASE_URL + "jewelry";

    // Get the values of drop-downs
    let type = id("type-select").value;
    let priceLimit = id("price-select").value;
    let color = id("color-select").value;
    let style = id("style-select").value;

    if (type || priceLimit || color || style) {
      url += "?";
    }

    if (type) {
      url += `&type=${type}`;
    }
    if (priceLimit) {
      url +=  `&price=${priceLimit}`;
    }
    if (color) {
      url += `&color=${color}`;
    }
    if (style) {
      url += `&style=${style}`;
    }

    console.log(url);

    try {
      let resp = await fetch(url);
      resp = checkStatus(resp);
      resp = await resp.json();
      addProducts(resp);
    } catch (err) {
      handleRequestError(err);
    }
  }

  /**
   * Populates the colors dropdown of the products page with elements of the form
   * <option value="">Any color</option>
   */
  async function addColorOptions() {
    let url = BASE_URL + "jewelry";

    // Fetch the color options of the jewelry we have
    try {
      let resp = await fetch(url);
      resp = checkStatus(resp);
      resp = await resp.json();
      addColorsHelper(resp);
    } catch (err) {
      handleRequestError(err);
    }
  }

  function addColorsHelper(products) {
    let colorSelect = id("color-select");
    let currColors = [];

    for (const product of products) {
      let colorChoice = gen("option");
      colorChoice.value = product.color;
      colorChoice.textContent = product.color;

      if (!(currColors.includes(product.color))) {
        colorSelect.appendChild(colorChoice);
        currColors.push(product.color);
      }
    }
  }

  function addProducts(products) {
    let productsSection = id("products"); 

    for (const prodInfo of products) {
      let prodName = prodInfo["product_name"];
      let imgPath = prodInfo["img_path"];
      let descrip = prodInfo.descrip;
      let price = prodInfo.price;

      let product = createProduct(prodName, imgPath, descrip, price);
      productsSection.appendChild(product);
    }
  }

  /**
   * Function which creates a product of the following form:
   * <article class="product">
   *    <img src="img/gold_hoop_earrings.jpg">
   *    <div class="product-info">
   *      <p>Gold Hoop Earrings</p>
   *      <p>$9.00</p>
   *      <p>A little fun for a night out.</p>
   *    </div>
   *  </article>
   */
  function createProduct(prodName, imgPath, descrip, price) {
    let productCard = gen("article");
    productCard.classList.add("product");

    let productInfo = gen("div");
    productInfo.classList.add("product-info");
    
    let productName = gen("p");
    productName.textContent = prodName;

    let productImg = gen("img");
    productImg.src = imgPath;

    let productPrice = gen("p");
    productPrice.textContent = "$" + price;

    let productDescrip = gen("p");
    productDescrip.textContent = descrip;

    productInfo.appendChild(productName);
    productInfo.append(productPrice);
    productInfo.append(productDescrip);

    productCard.appendChild(productImg);
    productCard.appendChild(productInfo);

    return productCard;
  }

  /**
   * Called when an error occurs in the fetch call chain (e.g. the request 
   * returns a non-200 error code, such as when the Merriam-Webster Dictionary 
   * or Thesaurus APIs are down). Displays a user-friendly error message on the 
   * page.
   * @param {Error} err - the error details of the request.
   */
  function handleRequestError(err) {
    let newErr = gen("p");
    newErr.id = "err-msg";
    newErr.textContent = "There was an error requesting data from the server. " + 
    "Please try again later.";
    
    let currErr = id("err-msg");
    currErr.parentNode.replaceChild(newErr, currErr);
  }
  
  init();
})();