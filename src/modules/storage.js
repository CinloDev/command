/**
 * storage.js
 * Centralizes all localStorage interactions and data management for the application.
 */

export const StorageKeys = {
  LANG: 'lang',
  TASK_HISTORY: 'taskHistory',
  FAVORITES: 'favorites',
  PERSONAL_COMMANDS: 'personalCommands',
  FAVORITE_ORDER: 'favoriteOrder',
  PERSONAL_THEME_COLOR: 'personalThemeColor',
  AUTO_TRANSLATE: 'autoTranslate'
};

export const storage = {
  // Language
  getLang: () => localStorage.getItem(StorageKeys.LANG) || 'en',
  setLang: (lang) => localStorage.setItem(StorageKeys.LANG, lang),

  // Task History
  getHistory: () => JSON.parse(localStorage.getItem(StorageKeys.TASK_HISTORY)) || [],
  saveHistory: (history) => localStorage.setItem(StorageKeys.TASK_HISTORY, JSON.stringify(history)),

  // Favorites
  getFavorites: () => JSON.parse(localStorage.getItem(StorageKeys.FAVORITES)) || [],
  saveFavorites: (favorites) => localStorage.setItem(StorageKeys.FAVORITES, JSON.stringify(favorites)),

  // Personal Vault Commands
  getPersonalCommands: () => JSON.parse(localStorage.getItem(StorageKeys.PERSONAL_COMMANDS)) || [],
  savePersonalCommands: (commands) => localStorage.setItem(StorageKeys.PERSONAL_COMMANDS, JSON.stringify(commands)),

  // Favorite Module Order
  getFavoriteOrder: () => JSON.parse(localStorage.getItem(StorageKeys.FAVORITE_ORDER)) || ['git', 'node', 'docker', 'personal'],
  saveFavoriteOrder: (order) => localStorage.setItem(StorageKeys.FAVORITE_ORDER, JSON.stringify(order)),

  // Theme & Settings
  getPersonalThemeColor: () => localStorage.getItem(StorageKeys.PERSONAL_THEME_COLOR) || '#a855f7',
  savePersonalThemeColor: (color) => localStorage.setItem(StorageKeys.PERSONAL_THEME_COLOR, color),

  getAutoTranslate: () => localStorage.getItem(StorageKeys.AUTO_TRANSLATE) === 'true',
  saveAutoTranslate: (enabled) => localStorage.setItem(StorageKeys.AUTO_TRANSLATE, enabled)
};
