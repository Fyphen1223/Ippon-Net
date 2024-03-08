/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const socket = io();

window.onload = () => {
	alert('IPPONグランプリを開始します。準備ができれば「OK」を押してください。');
};

const themeAudio = new Audio('/sounds/theme.mp3');

const resultText = document.getElementById('result');
socket.on('setTheme', (theme) => {
	themeAudio.play();
	const title = document.getElementById('theme');
	title.innerHTML = '';
	let index = 0;
	const regex = /<[^>]*>|[^<>]+/g;
	const parts = theme.match(regex).map((part) => (part[0] === '<' ? part : part.split(''))); // HTMLタグはそのまま、それ以外は一文字ずつに分割
	const intervalId = setInterval(() => {
		if (index < parts.length) {
			if (Array.isArray(parts[index])) {
				title.innerHTML += parts[index].shift();
				if (parts[index].length === 0) index++;
			} else {
				title.innerHTML += parts[index];
				index++;
			}
		} else {
			clearInterval(intervalId);
		}
	}, 100);
	resultText.innerHTML = '';
});

function getRandomInt() {
	return Math.floor(Math.random() * (500 - 20 + 1)) + 20;
}
socket.on('results', (result) => {
	if (result[0] === true && result[1] === true) {
		resultText.innerHTML = 'IPPON!';
	} else {
		resultText.innerHTML = '面白くない';
	}
});
