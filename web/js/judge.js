/* eslint-disable no-undef */
const socket = io();

const ippon = document.getElementById('ippon');

const title = document.getElementById('theme');
const bad = document.getElementById('bad');

socket.on('setTheme', (theme) => {
	title.innerHTML = theme;
});

ippon.addEventListener('click', () => {
	socket.emit('result', title.innerHTML, true);
});
bad.addEventListener('click', () => {
	socket.emit('result', title.innerHTML, false);
});
