#!/usr/bin/env node

/**
 * Deployment script for GitHub Pages
 * Usage: node deploy.js
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const REPO_NAME = 'Digit-flow-pro3.0';
const OWNER = 'marychepkirui52-ui';

function runCommand(command) {
  try {
    console.log(`\n🔨 Running: ${command}`);
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    console.error(`❌ Command failed: ${command}`);
    return false;
  }
}

function main() {
  console.log('🚀 Starting deployment to GitHub Pages...');
  console.log(`📦 Repository: ${OWNER}/${REPO_NAME}`);

  // Step 1: Build
  if (!runCommand('npm run build')) {
    console.error('❌ Build failed!');
    process.exit(1);
  }

  // Step 2: Create gh-pages branch if needed
  console.log('\n📝 Preparing gh-pages branch...');
  try {
    execSync('git rev-parse --verify gh-pages', { stdio: 'ignore' });
    console.log('✅ gh-pages branch exists');
  } catch {
    console.log('📝 Creating gh-pages branch...');
    runCommand('git checkout --orphan gh-pages');
    runCommand('git rm -rf .');
  }

  // Step 3: Copy build files
  console.log('\n📋 Copying build files...');
  const distFiles = path.join(__dirname, 'dist');
  if (!fs.existsSync(distFiles)) {
    console.error('❌ dist folder not found!');
    process.exit(1);
  }

  // Step 4: Deploy
  if (!runCommand('git add .') ||
      !runCommand(`git commit -m "Deploy to GitHub Pages - $(date)"`) ||
      !runCommand('git push origin gh-pages --force')) {
    console.error('❌ Deployment failed!');
    process.exit(1);
  }

  console.log(`\n✅ Deployment successful!`);
  console.log(`🌐 Your site will be available at:`);
  console.log(`   https://${OWNER}.github.io/${REPO_NAME}/`);
  console.log(`\n⏱️  Note: It may take a few minutes to appear.`);
}

main();
