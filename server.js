const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const imagesDir = path.join(__dirname, 'images');

const mimeTypes = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.bmp': 'image/bmp',
  '.svg': 'image/svg+xml'
};

function sendFile(res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  const stream = fs.createReadStream(filePath);
  stream.once('open', () => {
    res.writeHead(200, { 'Content-Type': contentType });
    stream.pipe(res);
  });
  stream.once('error', () => {
    res.writeHead(404);
    res.end('Not found');
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    sendFile(res, path.join(__dirname, 'index.html'));
  } else if (req.url === '/slideshow.js') {
    sendFile(res, path.join(__dirname, 'slideshow.js'));
  } else if (req.url === '/api/images') {
    fs.readdir(imagesDir, (err, files) => {
      if (err) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Unable to read images directory' }));
        return;
      }
      const images = files.filter(f => /\.(png|jpe?g|gif|bmp|svg)$/i.test(f));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(images));
    });
  } else if (req.url.startsWith('/images/')) {
    const filePath = path.join(imagesDir, req.url.replace('/images/', ''));
    sendFile(res, filePath);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
