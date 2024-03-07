/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const socket = io();

const theme = document.getElementById('theme');
const sendTheme = document.getElementById('sendTheme');

sendTheme.addEventListener('click', () => {
	socket.emit('setTheme', theme.value);
});

socket.on('setTheme', (theme) => {
	const title = document.getElementById('title');
	title.innerHTML = theme;
});
