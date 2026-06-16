const { execSync } = require('child_process');
try {
  execSync('git checkout -- src/pages/Dashboard.tsx src/pages/DashboardHr.tsx src/pages/DashboardPl.tsx', { stdio: 'inherit' });
  console.log("Git checkout successful.");
} catch (e) {
  console.error("Git checkout failed", e);
}
