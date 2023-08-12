import fs from 'fs';
import path from 'path';
import express from 'express';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

const vite = await createViteServer({
	server: { middlewareMode: true },
	appType: 'custom'
});

app.use(vite.middlewares);

app.use('/uw-classes', async (req, res) => {
	const requestedPath = req.query.path;
	const requestedURL = `https://classes.uwaterloo.ca${requestedPath}`;

	try {
		const fetchRes = await fetch(requestedURL);

		res
			.set('Access-Control-Allow-Origin', '*')
			.status(fetchRes.status)
			.send(await fetchRes.text());
	} catch (e) {
		console.log('/uw-classes fetch failed.', e);
	}
});

app.use('/', async (req, res) => {
	let html = fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf-8');

	html = await vite.transformIndexHtml(req.originalUrl, html);

	res.set('Content-Type', 'text/html').send(html);
});

app.listen(5173);
console.log('Ready on http://localhost:5173/');
