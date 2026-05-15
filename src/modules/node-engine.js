/**
 * Node Engine Module
 * Handles generation of Node.js package manager commands.
 */

export const nodeEngine = {
  /**
   * Generates installation commands based on package manager and type.
   * @param {string} packages - Space-separated list of packages
   * @param {string} mgr - pnpm, npm, yarn
   * @param {string} type - std, dev, glob
   * @returns {Array} - List of command objects
   */
  generateInstallCommands(packages, mgr, type) {
    if (!packages.trim()) return [];
    
    let baseCmd = mgr === 'npm' ? 'npm install' : (mgr === 'yarn' ? 'yarn add' : 'pnpm add');
    
    if (type === 'dev') {
      baseCmd += ' -D';
    } else if (type === 'glob') {
      baseCmd += (mgr === 'npm' ? ' -g' : ' --global');
    }
    
    return [
      { label: 'Install', cmd: `${baseCmd} ${packages.trim()}` }
    ];
  }
};
