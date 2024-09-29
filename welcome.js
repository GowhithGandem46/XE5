const firebaseConfig = {
    apiKey: "AIzaSyAha8z559_v3ihQvyDy58xi5JZj3QPKhvc",
    authDomain: "registration-xe5.firebaseapp.com",
    databaseURL: "https://registration-xe5-default-rtdb.firebaseio.com",
    projectId: "registration-xe5",
    storageBucket: "registration-xe5.appspot.com",
    messagingSenderId: "468197025919",
    appId: "1:468197025919:web:b436ef6e6c88414210f74a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const urlParams = new URLSearchParams(window.location.search);
const userUid = urlParams.get('u_id');

// Now, userUid contains the user ID from the URL parameter
console.log('User ID:', userUid);

var rformDB = firebase.database().ref('rform');
var historyDB = firebase.database().ref('history');

document.getElementById('LogoutLink').addEventListener('click', function () {
    console.log('Logout link clicked');

    // Use the userUid directly from the URL parameter
    if (userUid) {
        storeChatHistory(userUid);
    } else {
        console.log('No user UID found in URL parameters');
    }
});

function storeChatHistory(uid) {
    console.log('Storing chat history for user:', uid);

    // Retrieve chat history from chatbox
    const chatHistory = [];
    const chatItems = document.querySelectorAll('.chat p');
    chatItems.forEach(item => {
        chatHistory.push(item.textContent);
    });
    console.log('Chat history:', chatHistory);

    // Get the current date and time
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Month is zero-based
    const year = currentDate.getFullYear();
    const hours = currentDate.getHours();
    const minutes = currentDate.getMinutes();
    const seconds = currentDate.getSeconds();

    // Create a dateTime string with a different separator (underscore in this case)
    const dateeTime = `${day}-${month}-${year} @${hours}:${minutes}:${seconds}`;


    // Save chat history to Firebase
    saveChatHistoryToFirebase(chatHistory, dateeTime, uid);
}

function saveChatHistoryToFirebase(chatHistory, dateTime, uid) {
    console.log('Saving chat history to Firebase for user:', uid);

    try {
        const userRef = historyDB.child(uid); // Reference to the user's tag

        userRef.once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    const dateRef = userRef.child(dateTime);
                    dateRef.set({
                        chatHistory: chatHistory,
                        dateTime: dateTime
                    });
                } else {
                    userRef.set(true);
                    const dateRef = userRef.child(dateTime);
                    dateRef.set({
                        chatHistory: chatHistory,
                        dateTime: dateTime
                    });
                }

                console.log('Chat history saved to Firebase!');
            })
            .catch(error => {
                console.error('Error saving chat history:', error.message);
            });
    } catch (error) {
        console.error('Unexpected error:', error.message);
    }
}

function redirectToHistoryPage(uid, dateTime) {
    setTimeout(function () {
        window.location.href = `history.html?u_id=${uid}&date_time=${dateTime}`;
    }, 3000);
}


function fetchChatHistory() {
    // Fetch chat history from Firebase using the user UID
    if (userUid) {
        var dropdown = document.getElementById("historyDropdown");
        dropdown.innerHTML = "";

        var userRef = historyDB.child(userUid);

        userRef.once('value')
            .then(snapshot => {
                if (snapshot.exists()) {
                    const historyData = snapshot.val();
                    const dateTimeArray = Object.keys(historyData).reverse();

                    dateTimeArray.forEach(function (dateTime) {
                        var item = document.createElement("div");
                        item.textContent = dateTime;

                        item.addEventListener('click', function () {
                            redirectToHistoryPage(userUid, dateTime);
                        });

                        dropdown.appendChild(item);
                    });
                } else {
                    console.log('No chat history found for the user.');
                }
            })
            .catch(error => {
                console.error('Error fetching chat history:', error.message);
            });
    } else {
        console.log('No user UID found.');
    }
}


