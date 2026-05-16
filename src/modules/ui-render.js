/**
 * ui-render.js
 * Functions responsible for rendering different parts of the application.
 */

import { copyToClipboard } from './utils.js';

/**
 * Renders a standard library grid (Git, Node).
 */
export const renderLibrary = (type, data, gridId, searchTerm = '', favorites = [], translations = {}, lang = 'en', onToggleFav) => {
  const grid = document.getElementById(gridId);
  if (!grid) return;

  grid.innerHTML = '';
  const filtered = data.filter(item => {
    const desc = (item.desc[lang] || item.desc['en'] || '').toLowerCase();
    const tags = (item.tags || '').toLowerCase();
    const search = searchTerm.toLowerCase();
    return desc.includes(search) || tags.includes(search);
  });
  
  const sorted = [...filtered].sort((a, b) => {
    const aFav = favorites.includes(a.desc.en);
    const bFav = favorites.includes(b.desc.en);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });
  
  sorted.forEach(item => {
    const card = document.createElement('div');
    card.className = 'library-card';
    const isFav = favorites.includes(item.desc.en);
    
    card.innerHTML = `
      <div class="library-card-header">
        <div class="cmd-desc">${item.desc[lang] || item.desc['en']}</div>
        <div class="card-actions">
          <button class="star-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Remove' : 'Favorite'}">
            <i data-lucide="star" ${isFav ? 'fill="currentColor"' : ''}></i>
          </button>
          <button class="copy-btn-vault" title="${translations[lang]?.btnCopy || 'Copy'}">
            <i data-lucide="copy"></i>
          </button>
        </div>
      </div>
      <div class="cmd-val"><span>${typeof item.cmd === 'function' ? item.cmd(...(item.params || [])) : item.cmd}</span></div>
    `;

    const finalCmd = typeof item.cmd === 'function' ? item.cmd(...(item.params || [])) : item.cmd;

    card.querySelector('.copy-btn-vault').onclick = (e) => {
      e.stopPropagation();
      copyToClipboard(finalCmd, card.querySelector('.copy-btn-vault'), translations[lang]?.copied || 'Copied!');
    };

    card.querySelector('.cmd-val').onclick = () => {
      copyToClipboard(finalCmd, card.querySelector('.cmd-val'), translations[lang]?.copied || 'Copied!');
    };

    card.querySelector('.star-btn').onclick = (e) => {
      e.stopPropagation();
      if (onToggleFav) onToggleFav(item.desc.en);
    };

    grid.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
};

/**
 * Renders the Personal Vault library.
 */
export const renderPersonalLibrary = (personalCommands, themeColor, translations, lang, branchName, baseBranch, favorites = [], onEdit, onDelete, onCopy, onToggleFav) => {
  const grid = document.getElementById('personal-library-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (personalCommands.length === 0) {
    grid.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 40px; border: 1px dashed var(--card-border); border-radius: 12px;">
        <i data-lucide="lock" style="width: 48px; height: 48px; opacity: 0.2; margin-bottom: 10px;"></i>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">No personal commands yet. Add your first one above!</p>
      </div>`;
    if (window.lucide) window.lucide.createIcons();
    return;
  }

  const sorted = [...personalCommands].sort((a, b) => {
    const aFav = favorites.includes(a.desc);
    const bFav = favorites.includes(b.desc);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  sorted.forEach((item, sortedIdx) => {
    // We need the original index for edit/delete if we use the original array
    // But it's better to pass the item itself or find it by desc
    const originalIndex = personalCommands.findIndex(c => c.desc === item.desc && c.cmd === item.cmd);
    
    const card = document.createElement('div');
    const isFav = favorites.includes(item.desc);
    card.className = `library-card personal-card ${isFav ? 'pinned' : ''}`;
    const iconName = item.icon || 'lock';
    const finalCmd = (item.cmd || "").replace(/{branch}/g, branchName).replace(/{base}/g, baseBranch);
    const isBlock = item.isBlock || false;
    const lines = isBlock ? [finalCmd] : finalCmd.split('\n').filter(l => l.trim().length > 0);
    const isMultiline = lines.length > 1 || (isBlock && finalCmd.includes('\n'));

    card.innerHTML = `
      <div class="personal-card-header" style="display: flex; justify-content: space-between; align-items: center; cursor: ${isMultiline ? 'pointer' : 'default'}">
        <div style="display: flex; align-items: center; gap: 10px;">
          <div style="color: ${themeColor}; display: flex; align-items: center;">
            <i data-lucide="${iconName}" style="width: 18px; height: 18px;"></i>
          </div>
          <div class="cmd-desc" style="display: flex; align-items: center; gap: 8px;">
            ${item.desc}
            ${isBlock ? `<span style="font-size: 0.6rem; background: ${themeColor}22; color: ${themeColor}; padding: 2px 6px; border-radius: 4px; border: 1px solid ${themeColor}44;">BLOCK</span>` : ''}
          </div>
          ${isMultiline ? `<i data-lucide="chevron-down" class="expand-icon" style="width: 14px; height: 14px; opacity: 0.5; color: ${themeColor};"></i>` : ''}
        </div>
        <div style="display: flex; gap: 8px; align-items: center;">
          <button class="star-btn ${isFav ? 'active' : ''}" title="${isFav ? 'Unpin' : 'Pin'}" style="color: ${isFav ? themeColor : 'var(--text-secondary)'}">
            <i data-lucide="star" ${isFav ? 'fill="currentColor"' : ''} style="width: 16px; height: 16px;"></i>
          </button>
          <button class="edit-btn" title="Edit" style="color: var(--text-secondary)"><i data-lucide="pencil" style="width: 16px; height: 16px;"></i></button>
          <button class="delete-btn" title="Delete" style="color: var(--text-secondary)"><i data-lucide="trash-2" style="width: 16px; height: 16px;"></i></button>
          <button class="copy-all-btn" title="Copy All" style="color: ${themeColor}"><i data-lucide="copy" style="width: 18px; height: 18px;"></i></button>
        </div>
      </div>
      <div class="personal-card-content ${isMultiline ? 'collapsed' : ''}" style="margin-top: 10px; display: flex; flex-direction: column; gap: 8px;">
        ${lines.map(line => `
          <div class="sub-cmd-row" style="display: flex; justify-content: space-between; align-items: flex-start; background: rgba(0,0,0,0.15); padding: 8px 12px; border-radius: 6px; border-left: 2px solid ${themeColor}; gap: 10px; cursor: pointer;">
            <span style="font-family: monospace; font-size: 0.8rem; color: ${themeColor}; word-break: break-all; white-space: pre-wrap; flex: 1; text-align: left;">${line}</span>
            <button class="copy-sub-btn" style="background: none; border: none; color: ${themeColor}; cursor: pointer; padding: 4px; display: flex; align-items: center; opacity: 0.6; flex-shrink: 0;"><i data-lucide="clipboard" style="width: 14px; height: 14px;"></i></button>
          </div>
        `).join('')}
      </div>
    `;

    // Interaction logic
    if (isMultiline) {
       const header = card.querySelector('.personal-card-header');
       const content = card.querySelector('.personal-card-content');
       header.onclick = (e) => {
         if (e.target.closest('button')) return;
         header.classList.toggle('expanded');
         content.classList.toggle('collapsed');
       };
    }

    card.querySelectorAll('.sub-cmd-row').forEach((row, i) => {
      const line = lines[i];
      row.onclick = () => copyToClipboard(line, row, translations[lang].copied);
    });

    card.querySelector('.star-btn').onclick = (e) => { e.stopPropagation(); if (onToggleFav) onToggleFav(item.desc); };
    card.querySelector('.edit-btn').onclick = (e) => { e.stopPropagation(); onEdit(originalIndex); };
    card.querySelector('.delete-btn').onclick = (e) => { e.stopPropagation(); onDelete(originalIndex); };
    card.querySelector('.copy-all-btn').onclick = (e) => { e.stopPropagation(); onCopy(finalCmd, card.querySelector('.copy-all-btn')); };

    grid.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
};

/**
 * Renders the task history.
 */
export const renderHistory = (history, onSelect) => {
  const container = document.getElementById('task-history');
  if (!container) return;
  container.innerHTML = '';

  history.forEach(h => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <span class="hist-type">${h.type}</span>
      <span class="hist-title">${h.title.length > 25 ? h.title.substring(0, 22) + '...' : h.title}</span>
    `;
    item.addEventListener('click', () => onSelect(h.title, h.type));
    container.appendChild(item);
  });
};

/**
 * Renders the primary Git workflow commands.
 */
export const renderCommands = (branch, commitMsg, currentWorkflow, baseBranch, currentType, translations, lang) => {
  try {
    const container = document.getElementById('command-list');
    const fullPreview = document.getElementById('full-command-text');
    if (!container) return;

    const t = translations[lang] || translations.en;
    const safeBranch = branch || 'task';
    let content = commitMsg || `${currentType}: update`;
    // If user provided quotes, they probably meant them as delimiters; strip them to handle manually
    if (content.startsWith('"') && content.endsWith('"') && content.length >= 2) {
      content = content.substring(1, content.length - 1);
    }
    const escapedCommit = content.replace(/"/g, '\\"');
    
    let commands = [];
    if (currentWorkflow === 'recreate') {
      commands = [
        { label: t.cmdExit || 'Exit', cmd: `git checkout ${baseBranch || 'dev'}` },
        { label: t.cmdDelete || 'Delete', cmd: `git branch -D ${safeBranch}` },
        { label: t.cmdDeleteRemote || 'Delete Remote', cmd: `git push origin --delete ${safeBranch}` },
        { label: t.cmdPull || 'Pull', cmd: `git pull origin ${baseBranch || 'dev'}` },
        { label: t.cmdRecreate || 'Recreate', cmd: `git checkout -b ${safeBranch}` },
        { label: t.cmdPushNew || 'Push New', cmd: `git push origin ${safeBranch}` }
      ];
    } else {
      if (baseBranch && baseBranch.toLowerCase() !== 'current') {
        commands.push({ label: t.cmdExit || 'Exit', cmd: `git checkout ${baseBranch} && git pull origin ${baseBranch}` });
      }
      commands.push(
        { label: t.cmdCreate || 'Create', cmd: `git checkout -b ${safeBranch}` },
        { label: t.cmdStatus || 'Status', cmd: `git status` },
        { label: t.cmdStage || 'Stage', cmd: `git add .` },
        { label: t.cmdCommit || 'Commit', cmd: `git commit -m "${escapedCommit}"` },
        { label: t.cmdPush || 'Push', cmd: `git push -u origin ${safeBranch}` }
      );
    }

    container.innerHTML = '';
    commands.forEach(c => {
      const card = document.createElement('div');
      card.className = 'command-card';
      card.innerHTML = `
        <div class="command-info">
          <div style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 4px;">${c.label}</div>
          <div class="command-text">${c.cmd}</div>
        </div>
        <button class="copy-btn">
          <i data-lucide="copy" style="width: 15px; height: 15px;"></i>
        </button>
      `;
      card.querySelector('.copy-btn').addEventListener('click', (e) => {
        copyToClipboard(c.cmd, e.currentTarget, t.copied);
      });
      container.appendChild(card);
    });
    
    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error("Critical error in renderCommands:", err);
  }
};
