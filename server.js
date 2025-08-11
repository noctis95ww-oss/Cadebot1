const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3000;
const imagesDir = path.join(__dirname, 'images');
const logosDir = path.join(__dirname, 'logos');

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

function sendFile(req, res, filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[ext] || 'application/octet-stream';
  fs.stat(filePath, (err, stats) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    res.writeHead(200, { 'Content-Type': contentType, 'Content-Length': stats.size });
    if (req.method === 'HEAD') {
      res.end();
    } else {
      const stream = fs.createReadStream(filePath);
      stream.once('error', () => {
        res.writeHead(404);
        res.end('Not found');
      });
      stream.pipe(res);
    }
  });
}

const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    sendFile(req, res, path.join(__dirname, 'index.html'));
  } else if (req.url === '/slideshow.js') {
    sendFile(req, res, path.join(__dirname, 'slideshow.js'));
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
    sendFile(req, res, filePath);
  } else if (req.url.startsWith('/logos/')) {
    const filePath = path.join(logosDir, req.url.replace('/logos/', ''));
    sendFile(req, res, filePath);
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

server.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
