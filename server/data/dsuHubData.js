/**
 * DSU Hub Authentic Syllabus Dataset (CommonJS)
 */

const fs = require('fs');
const path = require('path');

// Read directly from client data or embed cleanly
const clientDataPath = path.resolve(__dirname, '../../client/src/data/dsuHubData.js');

let DSU_BRANCHES = [];
try {
  // Extract the JS array
  const fileContent = fs.readFileSync(clientDataPath, 'utf8');
  const arrayStart = fileContent.indexOf('export const DSU_BRANCHES = [');
  if (arrayStart !== -1) {
    const rawCode = fileContent
      .slice(arrayStart)
      .replace('export const DSU_BRANCHES =', 'const DSU_BRANCHES =')
      .split('export const getBranchBySlug')[0];
    
    // Evaluate safely in module context
    const fn = new Function(`${rawCode}; return DSU_BRANCHES;`);
    DSU_BRANCHES = fn();
  }
} catch (e) {
  console.error('Error loading client DSU data into server:', e.message);
}

module.exports = { DSU_BRANCHES };
