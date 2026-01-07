const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;

// Helper function to serve files asynchronously
// This keeps our code modular and dry (Don't Repeat Yourself)
const serveFile = (res, filePath, contentType, statusCode = 200) => {
    // Construct the absolute path to the file inside the 'public' folder
    const fullPath = path.join(__dirname, 'public', filePath);

    // Read the file from the file system
    fs.readFile(fullPath, (err, data) => {
        if (err) {
            // If the file is not found or cannot be read, return a 500 error
            res.writeHead(500, { 'Content-Type': 'text/plain' });
            res.end('500 - Internal Server Error');
        } else {
            // Write the correct status code (200 or 404) and content type (HTML or CSS)
            res.writeHead(statusCode, { 'Content-Type': contentType });
            res.end(data);
        }
    });
};

const server = http.createServer((req, res) => {
    // Normalize URL to lower case to handle variations like /Home
    const url = req.url.toLowerCase();

    console.log(`Request received for: ${url}`); // Log requests to console for testing

    // Routing Logic using Switch Case
    switch (url) {
        case '/':
        case '/home':
            serveFile(res, 'index.html', 'text/html');
            break;

        case '/about':
            serveFile(res, 'about.html', 'text/html');
            break;

        case '/contact':
            serveFile(res, 'contact.html', 'text/html');
            break;

        // We must explicitly serve the CSS file when the HTML pages request it
        case '/style.css':
            serveFile(res, 'style.css', 'text/css');
            break;

        default:
            // Handle invalid routes with the custom 404 page and 404 status code
            serveFile(res, '404.html', 'text/html', 404);
            break;
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});