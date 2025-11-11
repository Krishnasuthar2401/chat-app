
const socket = io("http://localhost:8000"); //connects to server
const form = document.getElementById('send-container');
const messageInput = document.getElementById('msginp');
const messageContainer = document.getElementById("chat-container");
// const message = document.getElementByClassName('message');

var audio = new Audio('ting.mp3');

const append = (message, position) => {
    const messageElement = document.createElement('div');
    messageElement.innerHTML = message;
    messageElement.classList.add('message');
    messageElement.classList.add(position);
    messageElement.innerHTML += `<div class="time">${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>`;
    messageContainer.append(messageElement);
    if (position == 'left' || position == 'center') {
        audio.play();
    }
}

const name = prompt("Enter your name to join");
// if (name == null) { // user clicked cancel
// alert("You must enter a name to join the chat!");
// }
socket.emit('new-user-joined', name);

socket.on('user-joined', name => {
    if (name) {
        append(`${name} joined the chat`, 'center');
    }
    if (messageInput != '' || messageInput != null) {
    socket.on('typing', data => {
        append(`${data.name} is typing...`, 'left');
    });
}
});

socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

socket.on('left', name => {
    append(`${name} left the chat`, 'left');
});

form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInput.value;
    append(`You: ${message}`, 'right');
    socket.emit('send', message);
    messageInput.value = '';
});

