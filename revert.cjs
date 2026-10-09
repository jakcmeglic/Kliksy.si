const { execSync } = require('child_process');
execSync('git checkout src/pages/Landing.tsx src/pages/LandingHr.tsx');
console.log('reverted');
