const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '..', 'admin-dashboard');
const destDir = path.join(__dirname, '..', 'dist', 'admin-dashboard');

// Create destination directory if it doesn't exist
if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// Copy all files from admin-dashboard to dist/admin-dashboard
function copyRecursiveSync(src, dest) {
  const exists = fs.existsSync(src);
  const stats = exists && fs.statSync(src);
  const isDirectory = exists && stats.isDirectory();

  if (isDirectory) {
    if (!fs.existsSync(dest)) {
      fs.mkdirSync(dest, { recursive: true });
    }
    fs.readdirSync(src).forEach((childItemName) => {
      copyRecursiveSync(
        path.join(src, childItemName),
        path.join(dest, childItemName)
      );
    });
  } else {
    fs.copyFileSync(src, dest);
  }
}

try {
  copyRecursiveSync(sourceDir, destDir);
  console.log('✅ Admin dashboard copied to dist folder');
} catch (error) {
  console.error('❌ Error copying admin dashboard:', error);
  process.exit(1);
}

