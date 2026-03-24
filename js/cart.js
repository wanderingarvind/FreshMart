// If cart exists in localStorage, convert it to array
// Otherwise create empty array
let user = JSON.parse(localStorage.getItem("loggedInUser"));
if(!user){
alert("Please login first");
window.location.href="login.html";
}
if(user && user.deliveryAddress){
document.getElementById("deliveryAddress").innerText = user.deliveryAddress;
}

let cartKey = "cart_" + user.email;
let cart = JSON.parse(localStorage.getItem(cartKey)) || [];

// Get table body where cart items will be displayed
let cartBody = document.getElementById("cart-body");

// Variable to store total price
let grandTotal = 0;

//total before tax
let subtotal = 0;


// ======================================
// DISPLAY CART ITEMS
// ======================================

function loadCart() {

    cart = JSON.parse(localStorage.getItem(cartKey)) || [];
    
    cartBody.innerHTML = "";
    grandTotal = 0;
    subtotal = 0;

    for (let i = 0; i < cart.length; i++) {

        let item = cart[i];
        let itemTotal = item.price * item.quantity;

        subtotal += itemTotal;
        //grandTotal += itemTotal;

        let row = `
            <tr>
                <td>${item.name}</td>
                <td>₹${item.price.toFixed(2)} x ${item.quantity}</td>
                <td>₹${itemTotal.toFixed(2)}</td>
                <td>
                    <button class="remove-btn"
                        onclick="removeItem(${i})">
                        Remove
                    </button>
                </td>
            </tr>
        `;

        cartBody.innerHTML += row;
    }

     let tax = subtotal * 0.05;
    grandTotal = subtotal + tax;
    document.getElementById("subtotal").innerText =  "₹" +subtotal.toFixed(2);
    document.getElementById("tax").innerText =  "₹" +tax.toFixed(2);

    document.getElementById("grand-total").innerText =
        "₹" + grandTotal.toFixed(2);
}


// ======================================
// REMOVE ITEM FROM CART
// ======================================

function removeItem(index) {

    cart.splice(index, 1);

    localStorage.setItem(cartKey, JSON.stringify(cart));

    loadCart();
}


// ======================================
// COMPLETE ORDER
// ======================================

function finishOrder() {

if (cart.length === 0) {
alert("Your cart is empty!");
return;
}

let payment = document.querySelector('input[name="payment"]:checked').value;
let cardInfo = null;
if(payment === "COD"){
}
if(payment === "CARD"){
let cardNumber = document.getElementById("cardNumber").value;
if(cardNumber.length < 12){
alert("Invalid card number");
return;
}
cardInfo = {
type: "Credit/Debit",
last4: cardNumber.slice(-4)
};
}

let user = JSON.parse(localStorage.getItem("loggedInUser"));
let orderKey = "orders_" + user.email;

// create order object
let order = {
id: "ORD" + Date.now(),
items: cart,
date: new Date().toLocaleString(),
time: Date.now(),   // store timestamp
total: grandTotal,
payment: payment,
card: cardInfo,
address: user.deliveryAddress,
name: user.name,
status: "Processing"
};

// get existing orders
let orders = JSON.parse(localStorage.getItem(orderKey)) || [];

// add new order
orders.push(order);

// save back
localStorage.setItem(orderKey, JSON.stringify(orders));

// keep last order for invoice page
localStorage.setItem("lastOrder", JSON.stringify(cart));
localStorage.setItem("orderId", order.id);
localStorage.setItem("paymentMethod", order.payment);
localStorage.setItem("grandTotal", order.total);
localStorage.setItem("orderDate", order.date);
localStorage.setItem("orderName", order.name);
localStorage.setItem("orderDeliveryAddress", order.address);

// clear cart
localStorage.removeItem(cartKey);

window.location.href = "thankyou.html";
}


// ======================================
// GO BACK TO STORE
// ======================================

function goBack() {
    window.location.href = "index.html";
}


// ======================================
// LOAD CART WHEN PAGE OPENS
// ======================================

loadCart();

// ======================================
// show Payment Section
// ======================================
function showPaymentSection(){

let method = document.querySelector('input[name="payment"]:checked').value;

let cod = document.getElementById("codSection");
let upi = document.getElementById("upiSection");
let card = document.getElementById("cardSection");
let orderBtn = document.getElementById("placeOrderBtn");

cod.style.display = "none";
upi.style.display = "none";
card.style.display = "none";

// orderBtn.disabled = false;
orderBtn.disabled = (method === "CARD");

if(method === "COD"){
//cod.style.display = "block";
}

if(method === "UPI"){
upi.style.display = "block";
startUPITimer();
}

if(method === "CARD"){
card.style.display = "block";
validateCardForm();
}

}

function startUPITimer(){

let time = 10;

let timerText = document.getElementById("upiTimer");
let orderBtn = document.getElementById("placeOrderBtn");

orderBtn.disabled = true;

let timer = setInterval(function(){

timerText.innerText = "Payment auto verification in " + time + " sec";

time--;

if(time < 0){

clearInterval(timer);

timerText.innerHTML = "Payment Approved <img src='images/success96.png' width='30px' style='vertical-align:middle'>";

orderBtn.disabled = false;

}

},1000);

}

/* validate card */
function validateCardForm(){

const cardNumber = document.getElementById("cardNumber");
const cardName = document.getElementById("cardName");
const cardExpiry = document.getElementById("cardExpiry");
const cardCVV = document.getElementById("cardCVV");
const placeOrderBtn = document.getElementById("placeOrderBtn");

/* restrict inputs */

cardNumber.value = cardNumber.value.replace(/[^0-9]/g,"");
cardName.value = cardName.value.replace(/[^a-zA-Z ]/g,"");
cardExpiry.value = cardExpiry.value.replace(/[^0-9/]/g,"");
cardCVV.value = cardCVV.value.replace(/[^0-9]/g,"");

/* validation */

let numberValid = cardNumber.value.replace(/\s/g,"").length === 16;
let nameValid = cardName.value.length > 2;
let expiryValid = cardExpiry.value.length === 5;
let cvvValid = cardCVV.value.length === 3;

if(numberValid && nameValid && expiryValid && cvvValid){
    placeOrderBtn.disabled = false;
}
else{
    placeOrderBtn.disabled = true;
}

}

// ======================================
// GO TO EDIT PROFILE PAGE
// ======================================
function goToEditProfile() {
    window.location.href = "editProfile.html";
}

// ======================================
// CARD INPUT EVENT LISTENERS
// ======================================

document.addEventListener("DOMContentLoaded", function(){

let cardNumber = document.getElementById("cardNumber");
let cardName = document.getElementById("cardName");
let cardExpiry = document.getElementById("cardExpiry");
let cardCVV = document.getElementById("cardCVV");

if(cardNumber){
cardNumber.addEventListener("input", function(){

let value = this.value.replace(/\D/g,""); // remove non-numbers

value = value.substring(0,16); // limit to 16 digits

let formatted = value.match(/.{1,4}/g); // group every 4 digits

this.value = formatted ? formatted.join(" ") : value;

validateCardForm();

});
}

if(cardName){
cardName.addEventListener("input", function(){

this.value = this.value.replace(/[^a-zA-Z ]/g,"");
validateCardForm();

});
}

if(cardExpiry){
cardExpiry.addEventListener("input", function(){

let value = this.value.replace(/\D/g,""); // numbers only

value = value.substring(0,4);

if(value.length >= 3){
this.value = value.substring(0,2) + "/" + value.substring(2);
}
else{
this.value = value;
}

validateCardForm();

});
}

if(cardCVV){
cardCVV.addEventListener("input", function(){

this.value = this.value.replace(/\D/g,"");
validateCardForm();

});
}

});