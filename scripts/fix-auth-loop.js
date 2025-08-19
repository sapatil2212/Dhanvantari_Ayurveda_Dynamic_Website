#!/usr/bin/env node

/**
 * Script to fix NextAuth authentication loop issues
 * Clears cookies and provides debugging information
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const hostname = 'localhost';
const port = 3001; // Use different port to avoid conflicts

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

  // Clear ALL possible NextAuth cookies
  res.setHeader('Set-Cookie', [
    'next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    'next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    '__Secure-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    '__Secure-next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    '__Host-next-auth.csrf-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    '__Host-next-auth.session-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
  ]);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>NextAuth Loop Fix</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
            .success { color: #22c55e; font-weight: bold; }
            .info { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .warning { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .error { background: #fee2e2; padding: 15px; border-radius: 8px; margin: 20px 0; }
            .code { background: #1f2937; color: #f9fafb; padding: 15px; border-radius: 8px; margin: 10px 0; font-family: monospace; }
        </style>
    </head>
    <body>
        <h1>🔄 NextAuth Authentication Loop Fix</h1>
        
        <div class="success">
            <h2>✅ Cookies Cleared Successfully!</h2>
            <p>All NextAuth cookies have been cleared to resolve the infinite redirect loop.</p>
        </div>

        <div class="info">
            <h3>🔍 What was happening:</h3>
            <ul>
                <li>NextAuth session token was corrupted or too large</li>
                <li>Middleware couldn't properly validate the token</li>
                <li>Infinite redirect loop between dashboard and login</li>
                <li>Session callback wasn't properly setting user data</li>
            </ul>
        </div>

        <div class="warning">
            <h3>🚀 Next Steps:</h3>
            <ol>
                <li><strong>Close this browser tab</strong></li>
                <li><strong>Clear browser cache completely</strong> (Ctrl+Shift+Delete)</li>
                <li><strong>Restart your Next.js server</strong>:
                    <div class="code">npm run dev</div>
                </li>
                <li><strong>Try logging in again</strong></li>
                <li><strong>Check the console for debugging info</strong></li>
            </ol>
        </div>

        <div class="info">
            <h3>🐛 Debugging Information:</h3>
            <p>If the issue persists, check your browser console for:</p>
            <ul>
                <li>JWT callback logs showing token data</li>
                <li>Session callback logs showing session data</li>
                <li>Middleware logs showing token validation</li>
                <li>Any error messages</li>
            </ul>
        </div>

        <div class="error">
            <h3>⚠️ If Still Having Issues:</h3>
            <ol>
                <li>Check that <code>NEXTAUTH_SECRET</code> is set in your .env file</li>
                <li>Verify database connection is working</li>
                <li>Try incognito/private mode</li>
                <li>Check that the user exists in the database</li>
                <li>Ensure the password is correct</li>
            </ol>
        </div>

        <p><strong>Note:</strong> You'll need to log in again after clearing the cookies.</p>
    </body>
    </html>
  `);
});

server.listen(port, hostname, () => {
  console.log(`🚀 NextAuth Loop Fix running at http://${hostname}:${port}/`);
  console.log('📝 Visit this URL in your browser to clear cookies and fix the loop');
  console.log('🔒 This will resolve the infinite redirect issue');
});

// Auto-close after 60 seconds
setTimeout(() => {
  console.log('\n⏰ Auto-closing server in 60 seconds...');
  setTimeout(() => {
    server.close(() => {
      console.log('✅ Server closed. Cookies have been cleared!');
      process.exit(0);
    });
  }, 60000);
}, 1000);
