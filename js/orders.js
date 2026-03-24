/* My Orders page */
let user = JSON.parse(localStorage.getItem("loggedInUser"));

if(!user){
alert("Please login first");
window.location.href="login.html";
}

let orderKey = "orders_" + user.email;

let orders = JSON.parse(localStorage.getItem(orderKey)) || [];

/* update order status after 20 sec */
orders = orders.map(order => {

let currentTime = Date.now();
let orderAge = currentTime - order.time;

if(orderAge >= 20000 && order.status === "Processing"){
order.status = "Delivered";
}

return order;

});

localStorage.setItem(orderKey, JSON.stringify(orders));

let body = document.getElementById("ordersBody");

/* show orders */
orders.forEach(order => {

let totalItems = 0;

order.items.forEach(item => {
totalItems += item.quantity;
});

let row = `
<tr>
<td>${order.id}</td>
<td>${order.date}</td>
<td>₹${order.total} (${order.payment})</td>
<td class="${order.status === 'Delivered' ? 'status-delivered' : 'status-processing'}">
${order.status}
</td>
<td>
<button onclick="goToInvoice('${order.id}')" class="blue-btn">
View Invoice
</button>
</td>
</tr>
`;

body.innerHTML += row;

});

// function updateOrderStatus(){
// let user = JSON.parse(localStorage.getItem("loggedInUser"));
// let orderKey = "orders_" + user.email;

// let orders = JSON.parse(localStorage.getItem(orderKey)) || [];

// orders = orders.map(order => {

// let currentTime = Date.now();
// let orderAge = currentTime - order.time;

// if(orderAge >= 20000 && order.status === "Processing"){
// order.status = "Delivered";
// }

// return order;

// });

// localStorage.setItem(orderKey, JSON.stringify(orders));
// }