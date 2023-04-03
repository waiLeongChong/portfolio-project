const URL = "https://fakestoreapi.com/products";
const searchForm = document.querySelector("#search-form");
const productList = document.querySelector(".product-container");



function displayProducts(products) {
  let content = "";
  for (let i = 0; i < products.length; i++) {
    let product = products[i];
    let starClass = "";
    if (i < product.rating.rate) {
      starClass = "checked";
    }
    const item = "<div class='items'>" +
      "<div class='image' style='background-image: url(" + product.image + ")'></div>" +
      "<div class='items-body'>" +
        "<h2 class='items-title'>" + product.title + "</h2>" +
        "<p class='items-text'>" + product.description + "</p>" +
        "<div class='items-footer'>" +
          "<div class='rating'>" +
            "<span>" + product.rating.rate.toFixed(1) + "</span>" +
            "<div class='rating-stars'>" +
              "<i class='fa fa-star " + starClass + "'></i>" +
              "<i class='fa fa-star " + starClass + "'></i>" +
              "<i class='fa fa-star " + starClass + "'></i>" +
              "<i class='fa fa-star " + starClass + "'></i>" +
              "<i class='fa fa-star " + starClass + "'></i>" +
            "</div>" +
          "</div>" +
          "<span class='price'>$" + product.price + "</span>" +
          "<button class='add-to-cart'>Add to Cart</button>" +
        "</div>" +
      "</div>" +
    "</div>";
    content += item;
  }
  productList.innerHTML = content;
}



function fetchDisplayItems(category) {
  // Fetch products for the selecte category from the api
  fetch(`https://fakestoreapi.com/products/category/${category}`)
    .then(response => response.json())
    .then(data => {
      // Select  product and clear contents
      const productContainer = document.querySelector('.product-container');
      productContainer.innerHTML = '';

      // Loop through product data and create HTML elements for each item
      data.forEach(product => {
        // Create HTML elements for each item
        const item = document.createElement('div');
        item.className = 'items';
        item.innerHTML = `
				<div class="image" style="background-image: url(${product.image})"></div>
          <div class="items-body">
            <h2 class="items-title">${product.title}</h2>
            <p class="items-text">${product.description}</p>
            <div class="items-footer">
							<div class="rating">
								<span>${product.rating.rate}</span>
								<i class="fa fa-star"></i>
								<i class="fa fa-star"></i>
								<i class="fa fa-star"></i>
								<i class="fa fa-star"></i>
								<i class="fa fa-star-half-o"></i>
							</div>
              <span class="price">$${product.price}</span>
              <button class="add-to-cart">Add to Cart</button>
            </div>
          </div>
        `;
        // Append the item to the product container
        productContainer.appendChild(item);
      });
    })
    .catch(error => console.error(error));
}


function getPricesLessThatOneHundradTwinty() {
  // Select product container and clear its contents
  const productContainer = document.querySelector('.product-container');

  // Fetch product from api
  fetch(URL)
    .then(response => response.json())
    .then(products => {
			productContainer.innerHTML = '';
      // Filter products the price is less than 120
      const filteredProducts = products.filter(product => {
        return product.price < 120;
      });

      // Loop through the filter products and display
      filteredProducts.forEach(product => {
        // Create HTML elements for each item
        const item = document.createElement('div');
        item.className = 'items';
        item.innerHTML = `
          <div class="image" style="background-image: url(${product.image})"></div>
          <div class="items-body">
            <h2 class="items-title">${product.title}</h2>
            <p class="items-text">${product.description}</p>
            <div class="items-footer">
              <div class="rating">
                <span>${product.rating.rate}</span>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star"></i>
                <i class="fa fa-star-half-o"></i>
              </div>
              <span class="price">$${product.price}</span>
              <button class="add-to-cart">Add to Cart</button>
            </div>
          </div>
        `;
        // Append the item to the product container
        productContainer.append(item);
				console.log("123123")
      });
    })
    .catch(error => console.error(error));
}



// Get list of categories and add eventlisteners to each item
const categories = document.querySelectorAll('.list-categories li a');
categories.forEach(category => {
	switch(category.innerHTML.toLowerCase()){
		case "sales":
			category.addEventListener('click', event => {
				getPricesLessThatOneHundradTwinty();
			});
		break;
		default:
			category.addEventListener('click', event => {
				// Get category name from text content of the clicked category
				const selectedCategory = event.target.textContent.toLowerCase();
				// Call fetchDisplayItems function with select category
				fetchDisplayItems(selectedCategory);
			});
	}
  
});


// Fetch products and display
fetch(URL)
  .then(response => response.json())
  .then(products => {
    displayProducts(products);
  })
  .catch(error => console.error(error));

// Add submit eventlistener to searchform
searchForm.addEventListener("submit", event => {
  event.preventDefault();
  const searchTerm = event.target.search.value.trim().toLowerCase();
  fetch(URL)
    .then(response => response.json())
    .then(products => {
      const filteredProducts = products.filter(product => {
        return (
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
					product.category.toLowerCase().includes(searchTerm)
        );
      });
      displayProducts(filteredProducts);
    })
    .catch(error => console.error(error));
});



searchForm.addEventListener("submit", event => {
  event.preventDefault();
  const searchTerm = event.target.search.value.trim().toLowerCase();
  fetch(URL)
    .then(response => response.json())
    .then(products => {
      const filteredProducts = products.filter(product => {
        return (
          product.title.toLowerCase().includes(searchTerm) ||
          product.description.toLowerCase().includes(searchTerm) ||
          product.category.toLowerCase().includes(searchTerm)
        );
      });
      // Check if any search results
      if (filteredProducts.length === 0) {
        // Display error message
        const errorMessage = document.createElement('p');
        errorMessage.textContent = 'No search results found.';
        errorMessage.classList.add('error-message');
        productList.innerHTML = '';
        productList.appendChild(errorMessage);
      } else {
        // Display the search results
        displayProducts(filteredProducts);
      }
    })
    .catch(error => console.error(error));
});
