const firebaseConfig = {
    apiKey: "AIzaSyAha8z559_v3ihQvyDy58xi5JZj3QPKhvc",
    authDomain: "registration-xe5.firebaseapp.com",
    databaseURL: "https://registration-xe5-default-rtdb.firebaseio.com",
    projectId: "registration-xe5",
    storageBucket: "registration-xe5.appspot.com",
    messagingSenderId: "468197025919",
    appId: "1:468197025919:web:b436ef6e6c88414210f74a"
};

firebase.initializeApp(firebaseConfig);

const urlParams = new URLSearchParams(window.location.search);
const userUid = urlParams.get('u_id');
const dateTime = urlParams.get('date_time');

if (userUid && dateTime) {
    fetchChatHistory(userUid, dateTime);
} else {
    console.error('User UID or date-time not found in URL parameters');
}

function fetchChatHistory(uid, dateTime) {
    const userRef = firebase.database().ref('history').child(uid).child(dateTime);

    userRef.once('value')
        .then(snapshot => {
            if (snapshot.exists()) {
                const chatData = snapshot.val().chatHistory;
                displayChatHistory(chatData);
            } else {
                console.log('No chat history found for the specified user and date-time.');
            }
        })
        .catch(error => {
            console.error('Error fetching chat history:', error.message);
        });
}

function displayChatHistory(chatData) {
    const chatbox = document.querySelector('.chatbox');

    if (chatbox) {
        chatData.forEach((message, index) => {
            const chatItem = document.createElement('div');
            const messageWrapper = document.createElement('div');
            const p = document.createElement('p');

            // Add icons based on the message index
            if (index % 2 === 0) {
                // Even index (human)
                p.innerHTML = '<span class="material-symbols-outlined icon">smart_toy</span> ' + message;
                messageWrapper.style.backgroundColor = '#8FDBAD'; // Green color for even components
                chatItem.style.textAlign = 'left';
            } else {
                // Odd index (bot)
                p.innerHTML = '<span class="material-symbols-outlined icon">person</span> ' + message;
                messageWrapper.style.backgroundColor = '#8ED3F4'; // Blue color for odd components
                chatItem.style.textAlign = 'right';
            }

            messageWrapper.style.padding = '10px'; // Add padding to both sides
            messageWrapper.appendChild(p);
            chatItem.appendChild(messageWrapper);
            chatbox.appendChild(chatItem);
        });
    } else {
        console.error('Chatbox element not found.');
    }
}



