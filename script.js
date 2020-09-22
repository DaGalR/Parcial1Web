const data =
  "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";
const navLinks = document.getElementsByTagName("a");
const products = document.getElementById("products");
const listProd = document.getElementById("listProd");
const cat = document.getElementById("cat");
const itemCount = document.getElementById("itemCount");
let jsonData = [];
let order = [];
const cart = new Map();
let itemsInCart = 0;
for (let i = 0; i < navLinks.length; i++) {
  if (navLinks[i].id === "cart") {
    navLinks[i].addEventListener("click", () => renderCart());
  } else {
    navLinks[i].addEventListener("click", () => renderCards(navLinks[i].id));
  }
}

fetch(data)
  .then((response) => response.json())
  .then((data) => {
    jsonData = data;
    //console.log(jsonData);
  });

const setListeners = () => {
  let bttns = document.getElementsByTagName("button");
  for (let k = 0; k < bttns.length; k++) {
    if (bttns[k].id === "confirm") {
      bttns[k].addEventListener("click", () => confirmOrder());
    } else if (bttns[k].id === "cancel") {
      bttns[k].addEventListener("click", () => toggleModal());
    } else if (bttns[k].id === "dropOrder") {
      bttns[k].addEventListener("click", () => dropOrder());
    } else {
      bttns[k].addEventListener("click", () => addToCart(bttns[k].id));
    }
  }
};

const renderCards = (productCategory) => {
  listProd.innerHTML = "";
  cat.innerHTML = "";
  let listaProds = [];
  if(productCategory === "DrinksAndSides"){
      productCategory = "Drinks and Sides";
  }
  jsonData.forEach((item) => {
    if (item.name === productCategory ) {
      listaProds = item.products;
    }
  });

  cat.innerText = productCategory;
  listaProds.forEach((product) => {
    let div = document.createElement("div");
    div.className = "col-12 col-xl-3 col-lg-3 col-md-2 col-sm-2";

    let card = document.createElement("div");
    card.className = "card";

    let imgCard = document.createElement("img");
    imgCard.className = "card-img-top";
    imgCard.src = product.image;
    imgCard.alt = "Product image";
    imgCard.style = "height: 200px; width: 100%; display: block;";
    let cardBody = document.createElement("div");
    cardBody.className = "card-body";
    cardBody.innerHTML = `<div class="card-body">
                        <h5 class="card-title">${product.name}</h5>
                        <p class="card-text">${product.description}</p>
                        <p class="card-text"><strong>$${product.price}</strong></p>
                        <button type="button" class="btn btn-dark" id="${productCategory}+${product.name}">Add to cart</button>
                        </div>`;

    card.appendChild(imgCard);
    card.appendChild(cardBody);
    div.appendChild(card);
    listProd.appendChild(div);
  });
  setListeners();
};

addToCart = (id) => {
  const params = id.split("+");
  const categoria = params[0];
  const comida = params[1];
  jsonData.forEach((item) => {
    if (item.name === categoria) {
      for (let j = 0; j < item.products.length; j++) {
        if (item.products[j].name === comida) {
          if (!cart.has(comida)) {
            cart.set(comida, { count: 1, item: item.products[j] });
            itemsInCart++;
          } else {
            let num = cart.get(comida).count;
            num++;
            itemsInCart++;
            cart.set(comida, { count: num, item: item.products[j] });
          }
        }
      }
    }
  });
  
  itemCount.innerText = itemsInCart + " items";
};

const renderCart = () => {
  cat.innerText = "Order Detail";
  listProd.innerHTML = "";
  let infoTable = document.createElement("table");
  infoTable.className = "table table-striped";
  let thead = document.createElement("thead");
  thead.innerHTML =
    '<tr>\
                        <th scope="col">Item</th>\
                        <th scope="col">Qty.</th>\
                        <th scope="col">Name</th>\
                        <th scope="col">Unit Price</th>\
                        <th scope="col">Amount</th>\
                    </tr>';
  let tbody = document.createElement("tbody");

  infoTable.appendChild(thead);

  let item = 1;
  let total = 0;
  order = [];
  cart.forEach((value) => {
    let row = document.createElement("tr");
    let amount = value.item.price * value.count;
    row.innerHTML = `<th scope="row">${item}</th>
                        <td>${value.count}</td>
                        <td>${value.item.name}</td>
                        <td>${value.item.price}</td>
                        <td>${amount}</td>`;
    order.push({
      item: item,
      quantity: value.count,
      name: value.item.name,
      unitPrice: value.item.price,
      amount: amount,
    });
    item++;
    total += amount;
    tbody.appendChild(row);
  });

  let addRow = document.createElement("tr");
  addRow.innerHTML = `<th scope="row">Total: $ ${total}</th>
    <td colspan="3"></td>
    <td colspan="1"><button class="btn btn-danger" data-toggle="modal" data-target="#cancelModal">Cancel</button><button class="btn btn-primary" id="confirm">Confirm Order</button></td>
    `;

  tbody.appendChild(addRow);

  infoTable.appendChild(tbody);
  listProd.appendChild(infoTable);
  setListeners();
};

const confirmOrder = () => {
  console.log(order);
};

const dropOrder = () => {
    
    cart.clear();
    order = [];
    itemsInCart = 0;
    itemCount.innerText =`${itemsInCart} items`;
    renderCards("Burguers");
}