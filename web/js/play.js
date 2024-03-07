/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const socket = io();

const resultText = document.getElementById('result');
socket.on('setTheme', (theme) => {
	const title = document.getElementById('theme');
	title.innerHTML = theme;
	resultText.innerHTML = '';
});

socket.on('results', (result) => {
	if (result[0] === true && result[1] === true) {
		resultText.innerHTML = 'IPPON!';
	} else {
		resultText.innerHTML = '面白くない';
	}
});
