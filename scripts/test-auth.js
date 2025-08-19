#!/usr/bin/env node

/**
 * Simple authentication test script
 * Clears cookies and provides debugging info
 */

const http = require('http');

const hostname = 'localhost';
const port = 3001;

const server = http.createServer((req, res) => {
  // Clear ALL possible NextAuth cookies with proper domain settings
  res.setHeader('Set-Cookie', [
    'next-auth.session-token=; Path=/; Domain=localhost; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
    'next-auth.csrf-token=; Path=/; Domain=localhost; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; SameSite=Lax',
    '__Secure-next-auth.session-token=; Path=/; Domain=localhost; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    '__Secure-next-auth.csrf-token=; Path=/; Domain=localhost; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    '__Host-next-auth.csrf-token=; Path=/; Domain=localhost; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax',
    '__Host-next-auth.session-token=; Path=/; Domain=localhost; Expires=Thu, 01 Jan 1970 00:00:00 GMT; HttpOnly; Secure; SameSite=Lax'
  ]);

  res.writeHead(200, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Auth Test & Fix</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 700px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .success { color: #22c55e; font-weight: bold; font-size: 18px; }
            .warning { color: #f59e0b; font-weight: bold; }
            .error { color: #ef4444; font-weight: bold; }
            .steps { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .step { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; border-left: 4px solid #22c55e; }
            .code { background: #1f2937; color: #f9fafb; padding: 10px; border-radius: 5px; font-family: monospace; margin: 5px 0; }
            .debug { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 Authentication Test & Fix</h1>
            
            <div class="success">
                ✅ Cookies cleared successfully!
            </div>

            <div class="debug">
                <h3>🐛 Debug Information:</h3>
                <p><strong>Current Issue:</strong> Middleware can't detect authentication token</p>
                <p><strong>Possible Causes:</strong></p>
                <ul>
                    <li>Cookie domain/path mismatch</li>
                    <li>Token not being properly set</li>
                    <li>Port mismatch between auth and middleware</li>
                    <li>NEXTAUTH_SECRET configuration issue</li>
                </ul>
            </div>

            <div class="steps">
                <h3>🚀 Fix Steps:</h3>
                
                <div class="step">
                    <strong>1.</strong> Close this tab and all browser tabs
                </div>
                
                <div class="step">
                    <strong>2.</strong> Clear browser cache completely (Ctrl+Shift+Delete)
                </div>
                
                <div class="step">
                    <strong>3.</strong> Check your .env file has NEXTAUTH_SECRET:
                    <div class="code">NEXTAUTH_SECRET=your-secret-here</div>
                </div>
                
                <div class="step">
                    <strong>4.</strong> Restart your server:
                    <div class="code">npm run dev</div>
                </div>
                
                <div class="step">
                    <strong>5.</strong> Go to <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>
                </div>
                
                <div class="step">
                    <strong>6.</strong> Login and check console for 🔐 logs
                </div>
            </div>

            <div class="warning">
                <h3>⚠️ If Still Not Working:</h3>
                <ol>
                    <li>Check that your user exists in the database</li>
                    <li>Verify the password is correct</li>
                    <li>Try incognito/private mode</li>
                    <li>Check browser console for any errors</li>
                    <li>Look for 🔐 debug logs in terminal</li>
                </ol>
            </div>

            <p><strong>Note:</strong> The debug logs will show exactly what's happening with authentication.</p>
        </div>
    </body>
    </html>
  `);
});

server.listen(port, hostname, () => {
  console.log(`🚀 Auth Test running at http://${hostname}:${port}/`);
  console.log('📝 Visit this URL to clear cookies and get debugging info');
});

// Auto-close after 45 seconds
setTimeout(() => {
  server.close(() => {
    console.log('✅ Server closed. Ready to test authentication!');
    process.exit(0);
  });
}, 45000);
