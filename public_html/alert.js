
document.getElementById('signup').addEventListener('click', function(){
    let url = '/sendVacInfo';

    let firstName = document.getElementById("firstName");
    let lastName = document.getElementById("lastName");
    let email = document.getElementById("email");

    let sel = document.getElementById('scripts');
    let vaccineType = getSelectedOption(sel);

    let vaccineDate = document.getElementById("vaccineDate");

    let userData = {}
    userData.firstName = firstName;
    userData.lastName = lastName;
    userData.email = email;
    userData.vaccineType = vaccineType;
    userData.vaccineDate = vaccineDate;

    let options = {
        method: 'POST',
        headers: {
            "Content-type": "application/json"
        },
        body: userData
    }

    fetch(url, options).then(function (response) {
        if(!response.ok){
            console.error(response)
        } else {
            console.log("User data was successfully inserted.");
        }
    }).then(result => {
        console.log(result);
    })
})

//Citing: http://dyn-web.com/tutorials/forms/select/selected.php
function getSelectedOption(sel) {
    var opt;
    for ( var i = 0, len = sel.options.length; i < len; i++ ) {
        opt = sel.options[i];
        if ( opt.selected === true ) {
            break;
        }
    }
    return opt;
}

