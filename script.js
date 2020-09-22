const data = "https://gist.githubusercontent.com/josejbocanegra/9a28c356416badb8f9173daf36d1460b/raw/5ea84b9d43ff494fcbf5c5186544a18b42812f09/restaurant.json";
const navLinks= document.getElementsByTagName("a");
const products = document.getElementById("products");
let jsonData = []
for(let i=0; i<navLinks.length;i++){
    navLinks[i].addEventListener("click", () => renderCards(navLinks[i].id));
}

fetch(data)
.then((response) => response.json())
.then((data) => {
    jsonData = data;
    //console.log(jsonData);
});

const renderCards = (productName) => {
    let listaProds = []
    jsonData.forEach((item) => {
        if(item.name === productName){
            listaProds = item.products;
        }
    })
    listaProds.forEach((product) => {
        let cardInfo = document.createAttribute("")
    });
    //console.log(productName);
}