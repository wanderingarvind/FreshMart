/* Signup logic */
const signupForm = document.getElementById("signupForm");
if (signupForm) {
signupForm.addEventListener("submit", function(e){

e.preventDefault();

let name = document.getElementById("name").value;
let email = document.getElementById("email").value;
let password = document.getElementById("password").value;
let deliveryAddress = document.getElementById("deliveryAddress").value;

// ---------- VALIDATION ----------
// Name validation
if(name.length < 3){
alert("Name must be at least 3 characters long");
return;
}
// Email validation
let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(!emailPattern.test(email)){
alert("Enter a valid email address");
return;
}
// Password validation
if(password.length < 6){
alert("Password must be at least 6 characters long");
return;
}
// Address validation
if(deliveryAddress.length < 10){
alert("Please enter complete delivery address with pin code");
return;
}

// get existing users
let users = JSON.parse(localStorage.getItem("users")) || [];

// check if email already exists
let userExists = users.find(user => user.email === email);

if(userExists){
alert("User already registered!");
return;
}

// create new user
let newUser = {
name: name,
email: email,
password: password,
deliveryAddress: deliveryAddress
};

// add user to array
users.push(newUser);

// save back to localStorage
localStorage.setItem("users", JSON.stringify(users));

alert("Signup successful!");

window.location.href = "login.html";

});

}

/* Login logic */
const loginForm = document.getElementById("loginForm");

if (loginForm) {

loginForm.addEventListener("submit", function(e){

e.preventDefault();

let email = document.getElementById("loginEmail").value;
let password = document.getElementById("loginPassword").value;

// ---------- VALIDATION ----------
// Email empty check
if(email === ""){
alert("Please enter your email address");
return;
}
// Email format check
let emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if(!emailPattern.test(email)){
alert("Please enter a valid email address");
return;
}
// Password empty check
if(password === ""){
alert("Please enter your password");
return;
}
// Password minimum length
if(password.length < 6){
alert("Password must be at least 6 characters");
return;
}

// get users
let users = JSON.parse(localStorage.getItem("users")) || [];

if(users.length === 0){
alert("No account found. Please signup first.");
return;
}

// find user
let validUser = users.find(user => 
user.email === email && user.password === password
);

if(validUser){

alert("Login Successful");

// save current user session
localStorage.setItem("loggedInUser", JSON.stringify(validUser));

window.location.href = "index.html";

}else{

alert("Invalid email or password");

}

});

}

/* check login logic */
function checkLogin(){

let user = JSON.parse(localStorage.getItem("loggedInUser"));

let loginBtn=document.getElementById("loginBtn");
let signupBtn=document.getElementById("signupBtn");
let logoutBtn=document.getElementById("logoutBtn");
let myorderBtn=document.getElementById("myorderBtn");
let myprofileBtn=document.getElementById("myprofileBtn");
let userName=document.getElementById("userName");

let loginBtnMobile=document.getElementById("loginBtnMobile");
let signupBtnMobile=document.getElementById("signupBtnMobile");
let logoutBtnMobile=document.getElementById("logoutBtnMobile");
let myorderBtnMobile=document.getElementById("myorderBtnMobile");
let myprofileBtnMobile=document.getElementById("myprofileBtnMobile");
let userNameMobile=document.getElementById("userNameMobile");


if(user){
loginBtn.style.display="none";
signupBtn.style.display="none";
logoutBtn.style.display="block";
myorderBtn.style.display="block";
myprofileBtn.style.display="block";
userName.innerText=user.name;

loginBtnMobile.style.display="none";
signupBtnMobile.style.display="none";
logoutBtnMobile.style.display="block";
myorderBtnMobile.style.display="block";
myprofileBtnMobile.style.display="block";
userNameMobile.innerText=user.name;
}else{
logoutBtn.style.display="none";
myorderBtn.style.display="none";
myprofileBtn.style.display="none";
loginBtn.style.display="block";
signupBtn.style.display="block";
userName.innerText="Account";

logoutBtnMobile.style.display="none";
myorderBtnMobile.style.display="none";
myprofileBtnMobile.style.display="none";
loginBtnMobile.style.display="block";
signupBtnMobile.style.display="block";
userNameMobile.innerText="Account";
}

}

/* Logout logic */
function logout(){

localStorage.removeItem("loggedInUser");

// location.reload();
window.location.href="index.html";
}

/* edit profile page */
function loadProfile(){

let user = JSON.parse(localStorage.getItem("loggedInUser"));
if(!user){
alert("Please login first");
window.location.href="login.html";
}

document.getElementById("name").value = user.name;
document.getElementById("deliveryAddress").value = user.deliveryAddress;

}

function saveProfile(){
let name = document.getElementById("name").value;
let address = document.getElementById("deliveryAddress").value;
// ---------- VALIDATION ----------
// Name validation
if(name === ""){
alert("Name cannot be empty");
return;
}
if(name.length < 3){
alert("Name must be at least 3 characters");
return;
}
// Address validation
if(address === ""){
alert("Delivery address cannot be empty");
return;
}
if(address.length < 10){
alert("Please enter complete delivery address with pin code");
return;
}
// ---------- UPDATE PROFILE ----------
let user = JSON.parse(localStorage.getItem("loggedInUser"));
user.name = name;
user.deliveryAddress = address;
localStorage.setItem("loggedInUser", JSON.stringify(user));
// ---------- ALSO UPDATE USERS ARRAY ----------
let users = JSON.parse(localStorage.getItem("users")) || [];
let index = users.findIndex(u => u.email === user.email);
if(index !== -1){
users[index].name = name;
users[index].deliveryAddress = address;
}
localStorage.setItem("users", JSON.stringify(users));
alert("Profile Updated Successfully");
}