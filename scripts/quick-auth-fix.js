#!/usr/bin/env node

/**
 * Quick authentication fix script
 * Clears cookies and provides simple instructions
 */

const http = require('http');

const hostname = 'localhost';
const port = 3001;

const server = http.createServer((req, res) => {
  // Clear all NextAuth cookies
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
        <title>Quick Auth Fix</title>
        <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 50px auto; padding: 20px; background: #f5f5f5; }
            .container { background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
            .success { color: #22c55e; font-weight: bold; font-size: 18px; }
            .steps { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
            .step { margin: 10px 0; padding: 10px; background: white; border-radius: 5px; border-left: 4px solid #22c55e; }
            .code { background: #1f2937; color: #f9fafb; padding: 10px; border-radius: 5px; font-family: monospace; margin: 5px 0; }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>🔐 Quick Authentication Fix</h1>
            
            <div class="success">
                ✅ Cookies cleared successfully!
            </div>

            <div class="steps">
                <h3>🚀 Simple Steps:</h3>
                
                <div class="step">
                    <strong>1.</strong> Close this tab
                </div>
                
                <div class="step">
                    <strong>2.</strong> Clear browser cache (Ctrl+Shift+Delete)
                </div>
                
                <div class="step">
                    <strong>3.</strong> Restart your server:
                    <div class="code">npm run dev</div>
                </div>
                
                <div class="step">
                    <strong>4.</strong> Go to <a href="http://localhost:3000" target="_blank">http://localhost:3000</a>
                </div>
                
                <div class="step">
                    <strong>5.</strong> Login with your credentials
                </div>
            </div>

            <p><strong>That's it! 🎉</strong> Authentication should now work smoothly.</p>
        </div>
    </body>
    </html>
  `);
});

server.listen(port, hostname, () => {
  console.log(`🚀 Quick Auth Fix running at http://${hostname}:${port}/`);
  console.log('📝 Visit this URL to clear cookies and get instructions');
});

// Auto-close after 30 seconds
setTimeout(() => {
  server.close(() => {
    console.log('✅ Server closed. Ready to restart your app!');
    process.exit(0);
  });
}, 30000);
