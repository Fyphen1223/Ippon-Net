/* eslint-disable no-unused-vars */

/* eslint-disable no-undef */
const socket = io();

function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}

window.onload = () => {
	alert(
		'IPPONグランプリを開始します。準備ができれば「OK」を押してください。なお、始める前には必ずページ内のどこかをクリックしないと正常に動作しません。'
	);
};

const themeAudio = new Audio('/sounds/theme.mp3');
const booingAudio = new Audio('/sounds/booing.wav');
const ipponAudio = new Audio('/sounds/ippon.mp3');

const halfLeft = document.getElementById('halfLeft');
const halfRight = document.getElementById('halfRight');
const screenHider = document.getElementById('screenHider');
const resultShower = document.getElementById('resultShower');
const textResult = document.getElementById('textResult');

/*
halfLeft.addEventListener('click', () => {
	halfLeft.style.display = 'none';
	halfRight.style.display = 'none';
	console.log('Hoi');
});

halfRight.addEventListener('click', () => {
	halfLeft.style.display = 'none';
	halfRight.style.display = 'none';
});
*/

screenHider.addEventListener('click', () => {
	screenHider.style.display = 'none';
});

const resultText = document.getElementById('result');
socket.on('setTheme', (theme) => {
	themeAudio.play();
	const title = document.getElementById('theme');
	title.innerHTML = '';
	let index = 0;
	const regex = /<[^>]*>|[^<>]+/g;
	const parts = theme.match(regex).map((part) => (part[0] === '<' ? part : part.split('')));
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
	resultShower.style.display = 'none';
});

function getRandomInt() {
	return Math.floor(Math.random() * (500 - 20 + 1)) + 20;
}

async function createRoll(result) {
	await themeAudio.play();
	await sleep(2000);
	if (result[0] === true && result[1] === true) {
		ipponAudio.play();
		textResult.innerHTML = 'IPPON';
		console.log('Ippon');
	} else {
		booingAudio.play();
		textResult.innerHTML = '👎';
		console.log('Booing');
	}
}

socket.on('results', async (result) => {
	let width = 0;
	textResult.innerHTML = '';
	resultShower.style.display = 'block';
	resultShower.style.transition = 'width 0.1s ease-out';
	const intervalId = setInterval(() => {
		if (width < 100) {
			width++;
			resultShower.style.width = width + '%';
		} else {
			clearInterval(intervalId);
		}
	}, 5);
	await createRoll(result);
});

resultShower.addEventListener('click', () => {
	resultShower.style.display = 'none';
});
