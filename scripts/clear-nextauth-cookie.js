#!/usr/bin/env node

/**
 * Script to clear the bloated NextAuth session cookie
 * This helps resolve HTTP 431 errors caused by large cookies
 */

const http = require('http');

const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }

  // Clear the NextAuth session cookie
  res.setHeader('Set-Cookie', [
    'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    'next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    '__Secure-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    '__Secure-next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
  ]);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>NextAuth Cookie Cleaner</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; }
            .success { color: #22c55e; font-weight: bold; }
            .info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .warning { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <h1>✅ NextAuth Cookie Cleaner</h1>
        
        <div class="success">
            <h2>Cookies Cleared Successfully!</h2>
            <p>The following NextAuth cookies have been cleared:</p>
            <ul>
                <li>next-auth.session-token</li>
                <li>next-auth.csrf-token</li>
                <li>__Secure-next-auth.session-token</li>
                <li>__Secure-next-auth.csrf-token</li>
            </ul>
        </div>

        <div class="info">
            <h3>What this fixes:</h3>
            <ul>
                <li>HTTP 431 (Request Header Fields Too Large) errors</li>
                <li>Issues with other localhost projects</li>
                <li>NextAuth authentication problems</li>
            </ul>
        </div>

        <div class="warning">
            <h3>Next Steps:</h3>
            <ol>
                <li>Close this browser tab</li>
                <li>Clear your browser cache and cookies for localhost</li>
                <li>Restart your Next.js development server</li>
                <li>Try accessing your application again</li>
            </ol>
        </div>

        <p><strong>Note:</strong> You'll need to log in again after clearing the cookies.</p>
    </body>
    </html>
  `);
});

server.listen(port, hostname, () => {
  console.log(`🚀 NextAuth Cookie Cleaner running at http://${hostname}:${port}/`);
  console.log('📝 Visit this URL in your browser to clear the bloated cookies');
  console.log('🔒 This will resolve HTTP 431 errors and fix localhost issues');
});

// Auto-close after 30 seconds
setTimeout(() => {
  console.log('\n⏰ Auto-closing server in 30 seconds...');
  setTimeout(() => {
    server.close(() => {
      console.log('✅ Server closed. Cookies have been cleared!');
      process.exit(0);
    });
  }, 30000);
}, 1000);
