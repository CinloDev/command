/**
 * Docker Engine Module
 * Handles generation of Docker and Docker Compose commands.
 */

export const dockerEngine = {
  /**
   * Generates docker-compose or docker run commands.
   * @param {string} image - Docker image
   * @param {string} file - Compose file
   * @param {string} service - Service name
   * @returns {Array} - List of command objects
   */
  generateCommands(image, file, service) {
    // Current implementation is a placeholder for future quick-actions
    // but we return the parameters needed for the library
    return {
      composeFile: file || 'docker-compose.yml',
      serviceName: service || 'app',
      imageName: image
    };
  }
};
