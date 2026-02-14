/**
 * Assignment 6: Simple Web Server with Node.js
 * Objective: Build a basic web server using the http module to handle routes and serve HTML/CSS.
 */

const http = require('http');
const fs = require('fs').promises;
const path = require('path');

// Configuration
const PORT = 3000;
const VIEWS_DIR = path.join(__dirname, 'views');
const PUBLIC_DIR = path.join(__dirname, 'public');

/**
 * Helper function to serve files asynchronously
 * @param {string} filePath - Path to the file
 * @param {string} contentType - MIME type of the content
 * @param {object} res - Response object
 * @param {number} statusCode - HTTP status code
 */
async function serveFile(filePath, contentType, res, statusCode = 200) {
    try {
        const data = await fs.readFile(filePath);
        res.writeHead(statusCode, { 'Content-Type': contentType });
        res.end(data);
    } catch (error) {
        console.error(`Error serving ${filePath}:`, error);
        // If file not found, serve 404 page
        if (filePath.includes('404.html')) {
            res.writeHead(500);
            res.end('Critical Error: 404 page missing!');
        } else {
            await serveFile(path.join(VIEWS_DIR, '404.html'), 'text/html', res, 404);
        }
    }
}

// Create the server
const server = http.createServer(async (req, res) => {
    const url = req.url;
    console.log(`Incoming request: ${req.method} ${url}`);

    // Routing Logic
    switch (url) {
        // Home Route
        case '/':
            await serveFile(path.join(VIEWS_DIR, 'home.html'), 'text/html', res);
            break;
        case '/home':
            await serveFile(path.join(VIEWS_DIR, 'home.html'), 'text/html', res);
            break;

        // About Route
        case '/about':
            await serveFile(path.join(VIEWS_DIR, 'about.html'), 'text/html', res);
            break;

        // Contact Route
        case '/contact':
            await serveFile(path.join(VIEWS_DIR, 'contact.html'), 'text/html', res);
            break;

        // CSS Route (Static Asset)
        case '/style.css':
            await serveFile(path.join(PUBLIC_DIR, 'style.css'), 'text/css', res);
            break;

        // Default: 404 Not Found
        default:
            await serveFile(path.join(VIEWS_DIR, '404.html'), 'text/html', res, 404);
            break;
    }
});

// Start the server
server.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
    console.log('Routes available: /home, /about, /contact');
});
