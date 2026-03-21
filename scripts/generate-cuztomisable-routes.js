// scripts/generate-cuztomisable-routes.js
// This script scans the package's src/app/ directory and generates re-export files in the consumer's app/(cuztomisable)/... directory.


const fs = require('fs');
const path = require('path');

const PACKAGE_APP_DIR = path.join(__dirname, '../src/app');

// Find the project root (the first directory up from cwd that contains a package.json not named @vandmade/cuztomisable)
function findProjectRoot(startDir) {
    let dir = startDir;
    while (dir !== path.parse(dir).root) {
        const pkgPath = path.join(dir, 'package.json');
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
                if (pkg.name !== '@vandmade/cuztomisable') {
                    return dir;
                }
            } catch {}
        }
        dir = path.dirname(dir);
    }
    return startDir;
}

const projectRoot = findProjectRoot(process.cwd());
const APP_DIR = path.join(projectRoot, 'app');
const DEST_APP_DIR = APP_DIR; // Write directly to app/

function removeDirRecursive(dir) {
    if (fs.existsSync(dir)) {
        fs.readdirSync(dir).forEach((file) => {
            const curPath = path.join(dir, file);
            if (fs.lstatSync(curPath).isDirectory()) {
                removeDirRecursive(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(dir);
    }
}

function walk(dir, callback, relativePath = '') {
    fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(relativePath, entry.name);
        if (entry.isDirectory()) {
            walk(fullPath, callback, relPath);
        } else if (entry.isFile() && entry.name.endsWith('.tsx')) {
            callback(fullPath, relPath);
        }
    });
}

// --- Ensure theme/images.ts and theme/index.ts exist in consumer app ---
const THEME_DIR = path.join(projectRoot, 'theme');
const THEME_IMAGES = path.join(THEME_DIR, 'images.ts');
const THEME_INDEX = path.join(THEME_DIR, 'index.ts');
const PACKAGE_IMAGES = path.join(__dirname, '../src/theme/images.ts');

if (!fs.existsSync(THEME_DIR)) fs.mkdirSync(THEME_DIR, { recursive: true });

// If theme/images.ts does not exist, create it with all package image definitions
if (!fs.existsSync(THEME_IMAGES)) {
  const pkgImagesContent = fs.readFileSync(PACKAGE_IMAGES, 'utf8');
  const content = `// Main app theme file for overriding or extending default images\n// This file is in the root theme/ directory and can be edited by the app developer.\n\n// Import the base images from the package\nimport { images as baseImages } from '../package/cuztomisable/src/theme/images';\n\nexport const images = {\n  ...baseImages,\n  onboarding: {\n    ...baseImages.onboarding,\n    // Example override:\n    // slide1: require('assets/images/onboarding/custom-slide1.png'),\n  },\n  logo: baseImages.logo,\n  profile: baseImages.profile,\n  back: baseImages.back,\n  settings: baseImages.settings,\n  loading: baseImages.loading,\n  // Add more overrides or custom images here\n};\n`;
  fs.writeFileSync(THEME_IMAGES, content, 'utf8');
  console.log('Created theme/images.ts in consumer app');
}

// If theme/index.ts does not exist, create it to export images
if (!fs.existsSync(THEME_INDEX)) {
  const content = `// Main app theme file for all theme variables (colors, images, etc.)\n// Import and export images for use throughout the app\n\nimport { images } from './images';\n\nexport const theme = {\n  images,\n  // Add other theme variables here (colors, spacing, etc.)\n};\n`;
  fs.writeFileSync(THEME_INDEX, content, 'utf8');
  console.log('Created theme/index.ts in consumer app');
}

function main() {
    // Only generate if not running inside the package itself
    if (projectRoot === path.resolve(__dirname, '..', '..')) {
        console.log('Not generating routes inside the cuztomisable package itself.');
        return;
    }
    // Remove all generated files/folders in app/ that match the package's src/app/ structure
    function removeGenerated(dir, relPath = '') {
        fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
            const fullPath = path.join(dir, entry.name);
            const rel = path.join(relPath, entry.name);
            const pkgPath = path.join(PACKAGE_APP_DIR, rel);
            if (entry.isDirectory() && fs.existsSync(pkgPath)) {
                removeGenerated(fullPath, rel);
                // Remove dir if empty
                if (fs.existsSync(fullPath) && fs.readdirSync(fullPath).length === 0) {
                    fs.rmdirSync(fullPath);
                }
            } else if (entry.isFile() && fs.existsSync(pkgPath)) {
                fs.unlinkSync(fullPath);
            }
        });
    }
    removeGenerated(DEST_APP_DIR);

    // List of auth screens that require logo
    const authScreensWithLogo = ['login', 'register', 'forgot', 'mfa', 'reset'];

    walk(PACKAGE_APP_DIR, (srcFile, relPath) => {
        const normalizedRelPath = relPath.replace(/\\/g, '/');
        if (normalizedRelPath.split('/').includes('(cuztomisable)')) return;
        const destFile = path.join(DEST_APP_DIR, relPath);
        const destDir = path.dirname(destFile);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
        const parts = normalizedRelPath.replace(/\.tsx$/, '').split('/');
        const exportName = parts.map((p, i) => {
            if (p.startsWith('(') && p.endsWith(')')) {
                return p.slice(1, -1).charAt(0).toUpperCase() + p.slice(2, -1);
            }
            return p.charAt(0).toUpperCase() + p.slice(1);
        }).join('');

        // If this is an auth screen, generate a simple export just like appearance.tsx
        if (parts[0] === '(auth)') {
            const content = `// Auto-generated by cuztomisable\nexport { ${exportName} as default } from "@vandmade/cuztomisable";\n`;
            fs.writeFileSync(destFile, content, 'utf8');
            console.log(`Generated (auth simple export): ${destFile}`);
        } else if (normalizedRelPath === '(settings)/_layout.tsx') {
            const content = `// Auto-generated by cuztomisable\nexport { ${exportName} as default } from "@vandmade/cuztomisable";\n`;
            fs.writeFileSync(destFile, content, 'utf8');
            console.log(`Generated (settings/_layout simple export): ${destFile}`);
        } else if (normalizedRelPath === '(settings)/profile.tsx') {
            const content = `// Auto-generated by cuztomisable\nexport { ${exportName} as default } from "@vandmade/cuztomisable";\n`;
            fs.writeFileSync(destFile, content, 'utf8');
            console.log(`Generated (settings/profile simple export): ${destFile}`);
        } else {
            const content = `// Auto-generated by cuztomisable\nexport { ${exportName} as default } from "@vandmade/cuztomisable";\n`;
            fs.writeFileSync(destFile, content, 'utf8');
            console.log(`Generated: ${destFile}`);
        }
    });
}

main();
