const http = require('http');
const fs = require('fs');

const server = http.createServer((req, res) => {
    let url = req.url;
    
    console.log('Request for: ' + url);
    
    if (url === '/' || url === '/home' || url === '/Home') {
        let data = fs.readFileSync('./public/index.html');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(data);
    }
    else if(url === '/about' || url === '/About') {
        let data = fs.readFileSync('./public/about.html');
        res.writeHead(200);
        res.end(data);
    }
    else if (url === '/contact') {
        let data = fs.readFileSync('./public/contact.html');
        res.end(data);
    }
    else if (url === '/style.css') {
        let data = fs.readFileSync('./public/style.css');
        res.writeHead(200, { 'Content-Type': 'text/css' });
        res.end(data);
    }
    else {
        // show 404 page
        let data = fs.readFileSync('./public/404.html');
        res.writeHead(404);
        res.end(data);
    }
});

server.listen(3000, () => {
    console.log('Server running on port 3000');
});