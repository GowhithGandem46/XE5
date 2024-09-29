const firebaseConfig = {
    apiKey: "AIzaSyAha8z559_v3ihQvyDy58xi5JZj3QPKhvc",
    authDomain: "registration-xe5.firebaseapp.com",
    databaseURL: "https://registration-xe5-default-rtdb.firebaseio.com",
    projectId: "registration-xe5",
    storageBucket: "registration-xe5.appspot.com",
    messagingSenderId: "468197025919",
    appId: "1:468197025919:web:ee0e6d9f38ab7af210f74a"
  };
//initialize firebase
firebase.initializeApp(firebaseConfig);

// Reference your db
var rformDB = firebase.database().ref('rform');
document.getElementById('rf').addEventListener("submit", submitForm);

function submitForm(e) {
    e.preventDefault();

    var name = getElementVal("un");
    var uid = getElementVal("ui");
    var pass = getElementVal("pass");
    var re_pass = getElementVal("re_pass");
    var gender = getSelectedGender(); // New function to get selected gender

    if (!validatePassword()) {
        // If password is not valid, do not proceed with form submission
        return;
      }

    checkExistingUID(uid, (exists) => {
        if (exists) {
            alert("User ID already exists. Please choose another user ID.");
        } else {
            // Save the data if the user ID is unique
            saveMessages(name, uid, pass, re_pass, gender);
            document.querySelector('.alert').style.display = 'block';
            setTimeout(() => {
                document.querySelector('.alert').style.display = 'none';
            }, 3000)
            document.getElementById("rf").reset();
        }
    });
}

function checkExistingUID(uid, callback) {
    rformDB.orderByChild("uid").equalTo(uid).once("value", (snapshot) => {
        callback(snapshot.exists());
    });
}

// Function to get selected gender
function getSelectedGender() {
    var genderRadios = document.getElementsByName("gender");

    for (var i = 0; i < genderRadios.length; i++) {
        if (genderRadios[i].checked) {
            return genderRadios[i].value;
        }
    }

    return null; // No gender selected
}

function validatePassword() {
    const password = getElementVal("pass");
    const rePassword = getElementVal("re_pass");
  
    const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    
    if (!passwordRegex.test(password)) {
      alert("Password must be at least 6 characters and include at least one alphabet, one number, and one special character");
      return false;
    }
  
    if (password !== rePassword) {
      alert("Passwords do not match");
      return false;
    }
  
    return true;
  }

  const saveMessages = (name, uid, pass, re_pass, gender) => {
    var newrform = rformDB.child(uid);

    newrform.set({
        name: name,
        uid: uid,
        pass: pass,
        re_pass: re_pass,
        gender: gender,
    });

    setTimeout(function () {
        window.location.href = "index.html";
    }, 4000); 
};


const getElementVal = (id) => {
    return document.getElementById(id).value;
};