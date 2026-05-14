/**
 * git-engine.js
 * Logic for processing task titles, detecting types, and generating branch names.
 */
import { STOP_WORDS, TECH_WHITELIST, ACTION_VERBS } from '../config.js';

/**
 * Detects the task type based on keywords in the title.
 */
export const detectType = (text) => {
  const low = text.toLowerCase();
  if (/\b(bug|error|falla|issue)\b/i.test(low)) return 'bug';
  if (/\b(fix|corregir|arreglar)\b/i.test(low)) return 'fix';
  if (/\b(hotfix|urgente|critical|critico)\b/i.test(low)) return 'hotfix';
  if (/\b(refactor|unificar|unify|reorganize|limpiar|clean)\b/i.test(low)) return 'refactor';
  if (/\b(docs|documentacion|readme|wiki)\b/i.test(low)) return 'docs';
  if (/\b(chore|deps|dependency|config|setup|build|npm|yarn)\b/i.test(low)) return 'chore';
  return 'feature';
};

/**
 * Transforms a title into a branch-friendly slug.
 */
export const slugify = (text) => {
  const issueMatch = text.match(/#(\d+)/) || text.match(/\b(\d{3,})\b/);
  const issueNumber = issueMatch ? issueMatch[1] : null;

  const isFrontend = /\b(frontend|fe|front)\b/i.test(text);
  const isBackend = /\b(backend|be|back)\b/i.test(text);
  const techTag = isFrontend ? 'fe' : (isBackend ? 'be' : null);

  let descriptionText = text
    .replace(/\[.*?\]/g, '')
    .replace(/#\d+/g, '')
    .replace(/\b(frontend|backend|fe|be|front|back)\b/gi, '')
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "");

  const candidates = descriptionText
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .split(/[\s-]+/)
    .filter(word => (word.length > 2 || TECH_WHITELIST.has(word)) && !STOP_WORDS.has(word))
    .map((word, index) => {
      let score = word.length;
      if (TECH_WHITELIST.has(word)) score += 40;
      if (ACTION_VERBS.has(word) || word === 'unificado') score += 30;
      if (/\d+/.test(word)) score += 25;
      if (word.includes('_') || word.includes('-')) score += 10;
      if (index < 2) score += 25;
      else if (index < 4) score += 10;
      return { word, score, originalIndex: index };
    });

  const topWords = candidates
    .sort((a, b) => b.score - a.score)
    .slice(0, 3)
    .sort((a, b) => a.originalIndex - b.originalIndex)
    .map(c => c.word);

  const parts = [];
  if (issueNumber) parts.push(issueNumber);
  if (techTag) parts.push(techTag);
  parts.push(...topWords);

  return parts.join('-') || 'task';
};

/**
 * Basic character cleaning for branch names.
 */
export const sanitizeBranchName = (text) => {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\d\/\-._]/g, '');
};

/**
 * Heuristic to check if text is likely Spanish.
 */
export const isSpanishText = (text) => {
  if (!text) return false;
  const hasSpanishChars = /[áéíóúüñ]/i.test(text);
  const commonSpanishWords = /\b(el|la|los|las|de|con|para|por|falla|error|inicio|migrar|nuevo|sistema|visual|reemplazar|unificar|crear|borrar|actualizar|quitar)\b/i.test(text);
  return hasSpanishChars || commonSpanishWords;
};
