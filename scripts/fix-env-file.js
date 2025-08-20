const fs = require('fs');
const path = require('path');

function fixEnvFile() {
  console.log('🔧 Fixing .env.local file...\n');

  const envPath = path.join(process.cwd(), '.env.local');
  
  try {
    // Read the current file
    let content = fs.readFileSync(envPath, 'utf8');
    
    console.log('Current content:');
    console.log(content);
    console.log('\n---');
    
    // Remove all AGENCY_PSK lines
    const lines = content.split('\n').filter(line => !line.includes('AGENCY_PSK'));
    
    // Add the correct AGENCY_PSK
    lines.push('AGENCY_PSK="dhan2212"');
    
    // Write back to file
    const newContent = lines.join('\n');
    fs.writeFileSync(envPath, newContent);
    
    console.log('✅ Fixed .env.local file:');
    console.log(newContent);
    console.log('\n🎉 Environment file has been fixed!');
    console.log('💡 Please restart your development server: npm run dev');
    
  } catch (error) {
    console.error('❌ Error fixing .env.local file:', error.message);
  }
}

fixEnvFile();
