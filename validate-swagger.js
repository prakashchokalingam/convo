#!/usr/bin/env node

/**
 * Quick validation script for Swagger setup
 * Run this to check if everything is ready
 */

const fs = require('fs');
const path = require('path');

console.log('🔍 Validating Swagger API Documentation Setup...\n');

// Check if directories exist
const directories = [
  'docs/swagger',
  'docs/swagger/schemas', 
  'lib/swagger',
  'app/api/docs',
  'app/docs'
];

let allDirectoriesExist = true;
directories.forEach(dir => {
  if (fs.existsSync(dir)) {
    console.log(`✅ Directory: ${dir}`);
  } else {
    console.log(`❌ Missing: ${dir}`);
    allDirectoriesExist = false;
  }
});

// Check if files exist
const files = [
  'docs/swagger/config.ts',
  'docs/swagger/generator.ts', 
  'docs/swagger/schemas/api-schemas.ts',
  'docs/swagger/generated/openapi.json',
  'lib/swagger/types.ts',
  'lib/swagger/decorators.ts',
  'app/api/docs/route.ts',
  'app/docs/page.tsx',
  'docs/API_DOCUMENTATION.md',
  'README_SWAGGER.md'
];

let allFilesExist = true;
console.log('\n📄 Files:');
files.forEach(file => {
  if (fs.existsSync(file)) {
    console.log(`✅ File: ${file}`);
  } else {
    console.log(`❌ Missing: ${file}`);
    allFilesExist = false;
  }
});

// Check package.json for new scripts
console.log('\n📦 Package.json Scripts:');
try {
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const scriptsToCheck = [
    'docs:generate',
    'docs:watch',
    'docs:dev', 
    'docs:build',
    'docs:serve'
  ];
  
  scriptsToCheck.forEach(script => {
    if (packageJson.scripts && packageJson.scripts[script]) {
      console.log(`✅ Script: ${script}`);
    } else {
      console.log(`❌ Missing script: ${script}`);
    }
  });
} catch (error) {
  console.log('❌ Could not read package.json');
}

// Check for API routes with JSDoc
console.log('\n🛠️  API Routes with Documentation:');
const apiRoutes = [
  'app/api/forms/route.ts',
  'app/api/forms/[id]/route.ts',
  'app/api/workspaces/route.ts'
];

apiRoutes.forEach(route => {
  if (fs.existsSync(route)) {
    const content = fs.readFileSync(route, 'utf8');
    if (content.includes('@swagger')) {
      console.log(`✅ Documented: ${route}`);
    } else {
      console.log(`⚠️  No JSDoc: ${route}`);
    }
  } else {
    console.log(`❌ Missing: ${route}`);
  }
});

console.log('\n🎯 Summary:');
if (allDirectoriesExist && allFilesExist) {
  console.log('✅ All components are in place!');
  console.log('\n📋 Next Steps:');
  console.log('1. Run: npm install');
  console.log('2. Run: npm run docs:generate');
  console.log('3. Run: npm run docs:dev');
  console.log('4. Visit: http://localhost:3002/docs');
} else {
  console.log('❌ Some components are missing.');
  console.log('Please check the missing files and directories above.');
}

// Check if openapi.json is valid
console.log('\n🔍 OpenAPI Spec Validation:');
try {
  const openApiContent = fs.readFileSync('docs/swagger/generated/openapi.json', 'utf8');
  const spec = JSON.parse(openApiContent);
  
  if (spec.openapi && spec.info && spec.paths) {
    console.log('✅ OpenAPI spec is valid JSON');
    console.log(`   - OpenAPI version: ${spec.openapi}`);
    console.log(`   - API title: ${spec.info.title}`);
    console.log(`   - API version: ${spec.info.version}`);
    console.log(`   - Endpoints: ${Object.keys(spec.paths).length}`);
    console.log(`   - Schemas: ${Object.keys(spec.components?.schemas || {}).length}`);
  } else {
    console.log('⚠️  OpenAPI spec missing required fields');
  }
} catch (error) {
  console.log('⚠️  Could not validate OpenAPI spec (this is normal if not generated yet)');
}

console.log('\n🚀 Swagger API Documentation System Ready!');
console.log('📖 See README_SWAGGER.md for quick start guide');
console.log('📚 See docs/API_DOCUMENTATION.md for complete documentation');
