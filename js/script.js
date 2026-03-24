// ===============================
// 1. LOAD CART FROM LOCAL STORAGE
// ===============================
// ===============================
// GET USER CART KEY
// ===============================

function getCartKey(){

let user = JSON.parse(localStorage.getItem("loggedInUser"));

if(!user){
return null;
}

return "cart_" + user.email;

}

// load cart for current user
let cartKey = getCartKey();
let cart = cartKey ? JSON.parse(localStorage.getItem(cartKey)) || [] : [];


// ===============================
// 2. QUANTITY CONTROLS
// ===============================

function increase(id) {
    const element = document.getElementById(id);
    let value = parseInt(element.innerText);
    element.innerText = value + 1;
}

function decrease(id) {
    const element = document.getElementById(id);
    let value = parseInt(element.innerText);

    if (value > 0) {
        element.innerText = value - 1;
    }
}


// ===============================
// 3. ADD ITEM TO CART
// ===============================

function addToCart(name, price, qtyId) {

const quantity = parseInt(document.getElementById(qtyId).innerText);

if (quantity === 0) {
alert("Please select quantity first!");
return;
}

let cartKey = getCartKey();

if(!cartKey){
alert("Please login first");
window.location.href="login.html";
return;
}

// reload user cart
cart = JSON.parse(localStorage.getItem(cartKey)) || [];

let existingItem = cart.find(item => item.name === name);

if (existingItem) {
existingItem.quantity += quantity;
} else {
cart.push({
name: name,
price: price,
quantity: quantity
});
}

localStorage.setItem(cartKey, JSON.stringify(cart));

document.getElementById(qtyId).innerText = 0;

updateCartCount();

alert("Item added successfully!");
}


// ===============================
// 4. UPDATE CART BADGE
// ===============================

function updateCartCount() {

let cartKey = getCartKey();

if(!cartKey){
return;
}

cart = JSON.parse(localStorage.getItem(cartKey)) || [];

let totalItems = 0;

cart.forEach(item => {
totalItems += item.quantity;
});

const badgeDesktop = document.getElementById("cartCount");
const badgeMobile = document.getElementById("cartCount2");

if (badgeDesktop) badgeDesktop.innerText = totalItems;
if (badgeMobile) badgeMobile.innerText = totalItems;

}


// ===============================
// 5. PAGE NAVIGATION
// ===============================

function goToCart(){

let user = JSON.parse(localStorage.getItem("loggedInUser"));

if(!user){
alert("Please login to view your cart.");
window.location.href = "login.html";
return;
}

let cartKey = "cart_" + user.email;

let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

if(cart.length === 0){
alert("Your cart is empty. Please add items first.");
return;
}

window.location.href = "cart.html";

}

function goToInvoice(orderId) {
   // window.location.href = "invoice.html";
   if(orderId){
    window.location.href = "invoice.html?orderId=" + orderId;
   }else if (localStorage.getItem("orderId")) {
    let lastOrderId = localStorage.getItem("orderId");
    window.location.href = "invoice.html?orderId=" + lastOrderId;
   }else{
    alert("Order ID is missing");
    return;
   }
}

function goBack() {
    window.location.href = "index.html";
}


// ===============================
// 6. LOAD INVOICE PAGE from any order id of user
// ===============================
function loadInvoiceById(orderId){

let user = JSON.parse(localStorage.getItem("loggedInUser"));

if(!user){
alert("Please login first");
window.location.href="login.html";
return;
}

let orderKey = "orders_" + user.email;

let orders = JSON.parse(localStorage.getItem(orderKey)) || [];

// find order by ID
let order = orders.find(o => o.id === orderId);

if(!order){
alert("Order not found");
return;
}

/* fill invoice header */

document.getElementById("customerName").innerText = order.name;
document.getElementById("deliveryAddress").innerText = order.address;
document.getElementById("orderId").innerText = order.id;
document.getElementById("orderDate").innerText = order.date;
document.getElementById("paymentMethod").innerText = order.payment;
document.getElementById("orderStatus").innerText = order.status;


/* load items */

const invoiceBody = document.getElementById("invoiceBody");

invoiceBody.innerHTML = "";

let subtotal = 0;

order.items.forEach(item => {

let total = item.price * item.quantity;
subtotal += total;

let row = `
<tr>
<td>${item.name}</td>
<td>₹${item.price.toFixed(2)} x ${item.quantity}</td>
<td>₹${total.toFixed(2)}</td>
</tr>
`;

invoiceBody.innerHTML += row;

});


let tax = subtotal * 0.05;
let finalTotal = subtotal + tax;

document.getElementById("subtotal").innerText = subtotal.toFixed(2);
document.getElementById("tax").innerText = tax.toFixed(2);
document.getElementById("finalTotal").innerText = finalTotal.toFixed(2);

}

function loadInvoice(){
let params = new URLSearchParams(window.location.search);
let orderId = params.get("orderId");
if(orderId){
loadInvoiceById(orderId);
}
}

// ===============================
// 7. THANK YOU PAGE
// ===============================

function loadThankYou() {

    const order = JSON.parse(localStorage.getItem("lastOrder")) || [];
    if (order.length === 0) return;

    document.getElementById("orderId").innerText =
        localStorage.getItem("orderId");

    document.getElementById("orderPayment").innerText =
        localStorage.getItem("paymentMethod");

    document.getElementById("orderDate").innerText =
        localStorage.getItem("orderDate");

    document.getElementById("finalTotal").innerText = "₹" + localStorage.getItem("grandTotal");   
    
}


// ===============================
// 8. ACTIVE MENU HIGHLIGHT
// ===============================

document.addEventListener("DOMContentLoaded", function () {

    const currentPage =
        window.location.pathname.split("/").pop() || "index.html";

    const links = document.querySelectorAll(".menu li a");

    links.forEach(link => {
        if (link.getAttribute("href") === currentPage) {
            link.classList.add("active");
        }
    });

    updateCartCount();
});


// ===============================
// 9. MOBILE MENU TOGGLE
// ===============================

function toggleMenu() {
    const menu = document.getElementById("mobileMenu");
    menu.classList.toggle("show");
}

// ===============================
// 10. toggle UserMenu
// ===============================
function toggleUserMenu(){
document.getElementById("userDropdown").classList.toggle("show");
}
function toggleUserMenuMobile(){
document.getElementById("userDropdownMobile").classList.toggle("show");
}

// ===============================
// 11. Outside Click Detection
// ===============================
// Outside Click Detection - hide User Menu
document.addEventListener("click", function (event) {
    const userMenu = document.querySelector(".user-menu");
    const dropdown = document.getElementById("userDropdown");

    if (userMenu && dropdown && !userMenu.contains(event.target)) {
        dropdown.classList.remove("show");
    }
});

//Outside Click Detection, hide UserMenu Mobile
document.addEventListener("click", function(event){
    const userMenuMobile = document.querySelector(".mobile-icons");
    const dropdownMobile = document.getElementById("userDropdownMobile");

if (userMenuMobile && dropdownMobile && !userMenuMobile.contains(event.target)) {
        dropdownMobile.classList.remove("show");
    }
});

// ===============================
// 12. check the user's order list
// ===============================
function goToOrders(){

let user = JSON.parse(localStorage.getItem("loggedInUser"));

if(!user){
alert("Please login first.");
window.location.href="login.html";
return;
}

let orderKey = "orders_" + user.email;

let orders = JSON.parse(localStorage.getItem(orderKey)) || [];

if(orders.length === 0){
alert("You have not placed any orders yet.");
return;
}

window.location.href="orders.html";

}

// ======================================
// STEP 13: GO TO EDIT PROFILE PAGE
// ======================================
function goToEditProfile() {
    window.location.href = "editProfile.html";
}