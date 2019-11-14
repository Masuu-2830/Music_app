// Name and Password from the register-form
var user = document.querySelector("#user");
var pw = document.getElementById('pw');

// storing input from register-form
function store() {
    localStorage.setItem('user', user.value);
    localStorage.setItem('pw', pw.value);
}

// check if stored data from register-form is equal to entered data in the   login-form
function check() {

    // stored data from the register-form
    var storedName = localStorage.getItem('user');
    console.log(storedName);
    var storedPw = localStorage.getItem('pw');
    console.log(storedPw);

    // entered data from the login-form
    var userName = document.getElementById('userName').value;
    console.log(userName);
    var userPw = document.getElementById('userPw').value;
    console.log(userPw);

    // check if stored data from register-form is equal to data from login form
    if(userName.value == storedName.value && userPw.value == storedPw.value) 
    {
        alert('You are loged in.');
    }
    else
     {
        alert('ERROR.');
    }
}