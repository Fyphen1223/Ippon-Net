/* eslint-disable no-unused-vars */
const http = require('node:http');
// eslint-disable-next-line no-unused-vars
const https = require('node:https');
const fs = require('node:fs');
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const socketio = require('socket.io');
const { Server } = socketio;
const helmet = require('helmet');
const RateLimit = require('express-rate-limit');
const app = express();
const server = http.createServer(app);
const io = new Server(server);

const sessions = session({
	secret: 'Hello!',
	resave: true,
	saveUninitialized: true,
	name: 'session',
	cookie: {
		httpOnly: true,
		secure: true,
		maxAge: 60000,
	},
});
io.engine.use(sessions);
app.use(sessions);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
	RateLimit({
		windowMs: 1 * 60 * 1000,
		max: 100,
	})
);

app.use(helmet());
app.use(express.json());
app.use(
	helmet.contentSecurityPolicy({
		directives: {
			defaultSrc: ['*', 'blob:', 'data:', 'filesystem:', 'mediastream:'],
			scriptSrc: ['*', 'blob:'],
			styleSrc: ['*', 'blob:'],
			imgSrc: ['*', 'blob:'],
			fontSrc: ['*', 'blob:'],
			mediaSrc: ['*', 'blob:'],
		},
	})
);

app.get('/', (req, res) => {
	res.set('Content-Type', 'text/html');
	res.send(fs.readFileSync('./web/html/index.html', 'utf8'));
});
app.get('/play', (req, res) => {
	res.set('Content-Type', 'text/html');
	res.send(fs.readFileSync('./web/html/play.html', 'utf8'));
});
app.get('/judge', (req, res) => {
	res.set('Content-Type', 'text/html');
	res.send(fs.readFileSync('./web/html/judge.html', 'utf8'));
});

app.get('/js/index.js', (req, res) => {
	res.set('Content-Type', 'text/javascript');
	res.send(fs.readFileSync('./web/js/index.js', 'utf8'));
});
app.get('/js/play.js', (req, res) => {
	res.set('Content-Type', 'text/javascript');
	res.send(fs.readFileSync('./web/js/play.js', 'utf8'));
});
app.get('/js/judge.js', (req, res) => {
	res.set('Content-Type', 'text/javascript');
	res.send(fs.readFileSync('./web/js/judge.js', 'utf8'));
});

app.get('/css/play.css', (req, res) => {
	res.set('Content-Type', 'text/css');
	res.send(fs.readFileSync('./web/css/play.css', 'utf8'));
});

app.get('/sounds/theme.mp3', (req, res) => {
	res.set('Content-Type', 'audio/mpeg');
	res.send(fs.readFileSync('./web/sounds/theme.mp3'));
});
app.get('/sounds/booing.wav', (req, res) => {
	res.set('Content-Type', 'audio/wav');
	res.send(fs.readFileSync('./web/sounds/booing.wav'));
});
app.get('/sounds/ippon.mp3', (req, res) => {
	res.set('Content-Type', 'audio/mpeg');
	res.send(fs.readFileSync('./web/sounds/ippon.mp3'));
});

server.listen(8080, async () => {
	console.log('Server started on port ' + 8080);
});

app.set('trust proxy', 1);

var results = {};

io.on('connection', (socket) => {
	socket.on('setTheme', (theme) => {
		io.emit('setTheme', theme);
	});
	socket.on('result', (theme, result) => {
		if (!results[theme]) {
			results[theme] = [];
			results[theme].push(result);
		} else if (results[theme].length == 1) {
			results[theme].push(result);
			io.emit('results', results[theme]);
			delete results[theme];
		}
	});
});
