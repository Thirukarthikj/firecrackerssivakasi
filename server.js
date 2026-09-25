/**
 * Sivakasi Trading Agency - Local Development Server
 * Ultra-fast, zero-dependency static server running on port 8080.
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec, execSync } = require('child_process');

const PORT = process.env.PORT || 8080;
const PUBLIC_DIR = __dirname;

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf'
};

const server = http.createServer((req, res) => {
    // Normalize URL
    let safeUrl = req.url.split('?')[0].split('#')[0];
    if (safeUrl === '/' || safeUrl === '') {
        safeUrl = '/index.html';
    }

    const filePath = path.join(PUBLIC_DIR, safeUrl);

    // Prevent directory traversal
    if (!filePath.startsWith(PUBLIC_DIR)) {
        res.writeHead(403, { 'Content-Type': 'text/plain' });
        res.end('403 Forbidden');
        return;
    }

    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(`
                <!DOCTYPE html>
                <html>
                <head><title>404 Not Found</title></head>
                <body style="font-family:sans-serif;background:#0b0e19;color:#e0e1f2;padding:40px;text-align:center;">
                    <h1 style="color:#f5b942;">404 Not Found</h1>
                    <p>The requested file <code>${safeUrl}</code> does not exist.</p>
                    <a href="/" style="color:#ffda9c;">Return to Home</a>
                </body>
                </html>
            `);
            return;
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';

        res.writeHead(200, {
            'Content-Type': contentType,
            'Cache-Control': 'no-cache',
            'Access-Control-Allow-Origin': '*'
        });

        const stream = fs.createReadStream(filePath);
        stream.pipe(res);
    });
});

server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        const url = `http://localhost:${PORT}`;
        console.log(`\n======================================================`);
        console.log(`🎇 Sivakasi Trading Agency Dev Server is already running!`);
        console.log(`🚀 URL: ${url}`);
        console.log(`🌐 Opening in browser...`);
        console.log(`======================================================\n`);
        if (process.argv.includes('--open') || !process.env.NO_OPEN) {
            const startCmd = process.platform === 'win32' ? `start "" "${url}"` :
                             process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
            try {
                execSync(startCmd);
            } catch (e) {}
        }
        process.exit(0);
    } else {
        console.error('Server error:', err);
    }
});

server.listen(PORT, () => {
    const url = `http://localhost:${PORT}`;
    console.log(`\n======================================================`);
    console.log(`🎇 Sivakasi Trading Agency Dev Server Active!`);
    console.log(`🚀 URL: ${url}`);
    console.log(`📁 Directory: ${PUBLIC_DIR}`);
    console.log(`⚡ Press Ctrl+C to stop`);
    console.log(`======================================================\n`);

    // Auto open browser if flag provided or by default
    if (process.argv.includes('--open') || !process.env.NO_OPEN) {
        const startCmd = process.platform === 'win32' ? `start "" "${url}"` :
                         process.platform === 'darwin' ? `open "${url}"` : `xdg-open "${url}"`;
        exec(startCmd, (err) => {
            if (err) console.log(`Notice: Open browser manually at ${url}`);
        });
    }
});
