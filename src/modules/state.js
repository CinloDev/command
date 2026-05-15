import { storage } from './storage.js';

/**
 * Centralized State Object
 */
export const state = {
  // Persistence-based state
  currentLang: storage.getLang(),
  taskHistory: storage.getHistory(),
  favorites: storage.getFavorites(),
  personalCommands: storage.getPersonalCommands(),
  favoriteOrder: storage.getFavoriteOrder(),
  personalThemeColor: storage.getPersonalThemeColor(),
  autoTranslateEnabled: storage.getAutoTranslate(),

  // UI / Session state
  editingIndex: null,
  currentType: 'feature',
  currentWorkflow: 'new',
  isManualBranch: false,
  isManualCommit: false,
  isManualType: false,
  currentActiveModule: 'git',

  // Node & Docker state
  nodeMgr: 'pnpm',
  nodeType: 'std',
  customIcon: 'lock',

  /**
   * Updates state and triggers persistence if needed
   * @param {string} key 
   * @param {any} value 
   */
  set(key, value) {
    this[key] = value;
    this.persist(key, value);
  },

  /**
   * Internal method to persist specific state keys
   */
  persist(key, value) {
    switch (key) {
      case 'currentLang':
        storage.setLang(value);
        break;
      case 'taskHistory':
        storage.saveHistory(value);
        break;
      case 'favorites':
        storage.saveFavorites(value);
        break;
      case 'personalCommands':
        storage.savePersonalCommands(value);
        break;
      case 'favoriteOrder':
        storage.saveFavoriteOrder(value);
        break;
      case 'personalThemeColor':
        storage.savePersonalThemeColor(value);
        break;
      case 'autoTranslateEnabled':
        storage.saveAutoTranslate(value);
        break;
    }
  }
};
