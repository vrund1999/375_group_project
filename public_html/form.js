var fname = document.getElementById("firstName")
var lname = document.getElementById("lastName")
var eml = document.getElementById("email")
var vacType = document.getElementById("vaccineType")
var vaxxDate = document.getElementById("vaccineDate")

var buttonID = document.getElementById("signup")


buttonID.addEventListener("click", function() {
    var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
vaxxDate = vaxxDate.value;
// console.log("date format", vaxxDate)
// var vacDate = vaxxDate.slice(8)  + '-' + vaxxDate.slice(5,7) + '-' + vaxxDate.slice(0,4);
// console.log("Date", vacDate)
var raw = JSON.stringify({"FirstName":fname.value,"SecondName":lname.value,"email":eml.value,"DATE":vaxxDate,"Vaxx":vacType.value});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("http://localhost:3000/sendVacInfo", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));
  })