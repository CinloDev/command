import './style.css'
import { GIT_LIBRARY, NODE_LIBRARY, DOCKER_LIBRARY } from './libraries.js'
import { translations, STOP_WORDS, TECH_WHITELIST, ACTION_VERBS } from './config.js'

let currentLang = localStorage.getItem('lang') || 'en';

const taskTitleInput = document.getElementById('task-title');
const typeButtons = document.querySelectorAll('.type-btn');
const outputSection = document.getElementById('output-section');
const branchNameInput = document.getElementById('branch-name-input');
const commitMsgInput = document.getElementById('commit-msg-input');
const commandListContainer = document.getElementById('command-list');
const copyBranchBtn = document.getElementById('copy-branch');
const copyAllBtn = document.getElementById('copy-all');
const workflowButtons = document.querySelectorAll('.wf-btn');
const baseBranchGroup = document.getElementById('base-branch-group');
const baseBranchInput = document.getElementById('base-branch');
const langBtn = document.getElementById('lang-btn');
const translateBtn = document.getElementById('translate-btn');
const resetBranchBtn = document.getElementById('reset-branch');
const manualNotice = document.getElementById('manual-notice');
const toastContainer = document.getElementById('toast-container');
const fullCommandText = document.getElementById('full-command-text');
const copyTerminalBtn = document.getElementById('copy-terminal');
const taskHistoryContainer = document.getElementById('task-history');
const branchWarning = document.getElementById('branch-warning');
const toggleTerminalBtn = document.getElementById('toggle-terminal-mode');

// Safety check for search inputs
const dockerSearchInput = document.getElementById('docker-search');
const gitSearchInput = document.getElementById('git-search');
const nodeSearchInput = document.getElementById('node-search');
const gitParamInput = document.getElementById('git-param');

// Docker Inputs
const dockerServiceInput = document.getElementById('docker-service-input');
const dockerFileInput = document.getElementById('docker-file-input');
const dockerLibraryGrid = document.getElementById('docker-library-grid');
const dockerImgInput = document.getElementById('docker-img-input');
const dockerPortInput = document.getElementById('docker-port-input');
const dockerActionBtns = document.querySelectorAll('.docker-action-btn');
const dockerCommandList = document.getElementById('docker-command-list');
const dockerOutput = document.getElementById('docker-output');

let taskHistory = JSON.parse(localStorage.getItem('taskHistory')) || [];
let favorites = JSON.parse(localStorage.getItem('favorites')) || [];
let favoriteOrder = JSON.parse(localStorage.getItem('favoriteOrder')) || ['git', 'node', 'docker'];
let isTerminalMode = false;

let currentType = 'feature';
let currentWorkflow = 'new';
let isManualBranch = false;
let isManualCommit = false;
let isManualType = false;
let currentActiveModule = 'git';

const updateTranslations = () => {
  const t = translations[currentLang];
  document.getElementById('txt-title').textContent = t.title;
  const subtitleKey = 'subtitle' + currentActiveModule.charAt(0).toUpperCase() + currentActiveModule.slice(1);
  document.getElementById('txt-subtitle').textContent = t[subtitleKey] || t.subtitleGit;
  document.querySelector('#btn-wf-new span').textContent = t.wfNew;
  document.querySelector('#btn-wf-recreate span').textContent = t.wfRecreate;
  document.getElementById('lbl-task-type').textContent = t.lblType;
  document.getElementById('lbl-target-branch').textContent = t.lblTarget;
  document.getElementById('lbl-commit-msg').textContent = t.lblCommit;
  document.getElementById('lbl-workflow-cmds').textContent = t.lblWorkflow;
  document.getElementById('lbl-full-preview').textContent = t.lblFullPreview;
  document.getElementById('lbl-git-vault').textContent = t.lblGitVault;
  document.getElementById('lbl-node-vault').textContent = t.lblNodeVault;
  if (toggleTerminalBtn) {
    toggleTerminalBtn.querySelector('span').textContent = isTerminalMode ? t.listView : t.terminalView;
  }
  if (manualNotice) manualNotice.textContent = t.manualNotice;

  // Node Labels
  document.getElementById('lbl-node-manager').textContent = t.nodeMgr;
  document.getElementById('lbl-node-install').textContent = t.nodeInstall;
  document.getElementById('lbl-node-type').textContent = t.nodeType;
  document.getElementById('lbl-node-quick').textContent = t.nodeQuick;
  document.getElementById('lbl-node-output').textContent = t.nodeOutput;

  // Docker Labels
  document.getElementById('lbl-docker-img').textContent = t.dockerImg;
  document.getElementById('lbl-docker-port').textContent = t.dockerPort;
  document.getElementById('lbl-docker-compose').textContent = t.dockerCompose;
  document.getElementById('lbl-docker-quick').textContent = t.dockerQuick;
  document.getElementById('lbl-docker-output').textContent = t.dockerOutput;
  document.getElementById('lbl-docker-vault').textContent = t.dockerVault;
  document.getElementById('lbl-docker-service').textContent = t.dockerService;
  document.getElementById('lbl-docker-file').textContent = t.dockerFile;
  if (dockerSearchInput) dockerSearchInput.placeholder = t.searchPlaceholder;
  if (gitSearchInput) gitSearchInput.placeholder = t.searchPlaceholder;
  if (nodeSearchInput) nodeSearchInput.placeholder = t.searchPlaceholder;
  
  if (resetBranchBtn) resetBranchBtn.textContent = t.btnReset;
  
  document.getElementById('lbl-favs-vault').textContent = t.lblFavsVault;
  document.getElementById('txt-favs-subtitle').textContent = t.subtitleFavs;
  
  // Explicit ID based label updates
  const labelTask = document.getElementById('lbl-task-title');
  const labelBase = document.getElementById('lbl-base-branch');
  if (labelTask) labelTask.textContent = t.lblTask;
  if (labelBase) labelBase.textContent = t.lblBase;
  
  // Update Type Buttons
  typeButtons.forEach(btn => {
    const type = btn.dataset.type;
    const key = 'type' + type.charAt(0).toUpperCase() + type.slice(1);
    btn.textContent = t[key] || type;
  });
  
  langBtn.textContent = currentLang.toUpperCase();
  updateUI();
  
  // Update Libraries (Vaults)
  renderLibrary('git', GIT_LIBRARY, 'git-library-grid', gitSearchInput.value);
  renderLibrary('node', NODE_LIBRARY, 'node-library-grid', nodeSearchInput.value);
  renderDockerLibrary(dockerSearchInput.value);
  renderFavorites();
};

langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  localStorage.setItem('lang', currentLang);
  updateTranslations();
});

const slugify = (text) => {
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

const sanitizeBranchName = (text) => {
  return text
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\d\/\-._]/g, '');
};



const translateTitle = async (e) => {
  if (e) e.preventDefault();
  const text = taskTitleInput.value.trim();
  if (!text) return;

  translateBtn.classList.add('loading');
  
  const hasSpanishChars = /[áéíóúüñ]/i.test(text);
  const commonSpanishWords = /\b(el|la|los|las|de|con|para|por|falla|error|inicio|migrar|nuevo|sistema|visual|reemplazar|unificar)\b/i.test(text);
  const isSpanish = hasSpanishChars || commonSpanishWords;
  const langPair = isSpanish ? 'es|en' : 'en|es';

  try {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`;
    const response = await fetch(url);
    const data = await response.json();
    
    if (data.responseData && data.responseData.translatedText) {
      taskTitleInput.value = data.responseData.translatedText;
      updateUI();
    }
  } catch (error) {
    console.error('Translation error:', error);
    alert('Translation failed. Please try again.');
  } finally {
    translateBtn.classList.remove('loading');
  }
};

translateBtn.addEventListener('click', translateTitle);

const updateUI = () => {
  const title = taskTitleInput.value.trim();
  if (title.length > 0) {
    outputSection.classList.add('visible');
    
    // SMART TYPE DETECTION
    if (!isManualType && !isManualBranch && title.length > 3) {
      const detected = detectType(title);
      if (detected !== currentType) {
        currentType = detected;
        typeButtons.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.type === currentType);
        });
      }
    }

    if (!isManualBranch) {
      const generatedBranch = (title.includes('/') || currentWorkflow === 'recreate') 
        ? sanitizeBranchName(title) 
        : `${currentType}/${slugify(title)}`;
      branchNameInput.value = generatedBranch;
    }

    if (resetBranchBtn) {
      resetBranchBtn.style.display = (!isManualBranch && !isManualType) ? 'none' : 'flex';
    }
    if (manualNotice) {
      manualNotice.style.display = isManualBranch ? 'flex' : 'none';
    }

    if (!isManualCommit) {
      const cleanTitle = title.replace(/\[.*?\]/g, '').replace(/\b(frontend|backend|fe|be|front|back)\b/gi, '').trim();
      const issueMatch = title.match(/#(\d+)/);
      const commitPrefix = issueMatch ? `#${issueMatch[1]} - ` : '';
      commitMsgInput.value = `${currentType}: ${commitPrefix}${cleanTitle}`;
      autoResizeCommit();
    }

    validateBranch(branchNameInput.value);
    renderCommands(branchNameInput.value, commitMsgInput.value);
    
    // Refresh vaults and favorites to keep branches in sync
    if (currentActiveModule === 'git') renderLibrary('git', GIT_LIBRARY, 'git-library-grid', gitSearchInput.value);
    if (currentActiveModule === 'node') renderLibrary('node', NODE_LIBRARY, 'node-library-grid', nodeSearchInput.value);
    if (currentActiveModule === 'docker') renderDockerLibrary(dockerSearchInput.value);
    renderFavorites();
  } else {
    outputSection.classList.remove('visible');
    isManualBranch = false;
    isManualCommit = false;
    isManualType = false;
    resetBranchBtn.style.display = 'none';
    manualNotice.style.display = 'none';
    branchWarning.style.display = 'none';
  }
};

const validateBranch = (name) => {
  const t = translations[currentLang];
  let warning = '';
  
  if (name.length > 50) {
    warning = t.warningLong;
  } else if (/[^\w\d\/\-._]/.test(name)) {
    warning = t.warningChars;
  }
  
  if (warning) {
    branchWarning.textContent = warning;
    branchWarning.style.display = 'flex';
    branchWarning.innerHTML = `<i data-lucide="alert-triangle" style="width: 14px; height: 14px;"></i> <span>${warning}</span>`;
    if (window.lucide) window.lucide.createIcons();
  } else {
    branchWarning.style.display = 'none';
  }
};

const autoResizeCommit = () => {
  commitMsgInput.style.height = 'auto';
  commitMsgInput.style.height = commitMsgInput.scrollHeight + 'px';
};

branchNameInput.addEventListener('input', () => {
  isManualBranch = true;
  const sanitized = sanitizeBranchName(branchNameInput.value);
  if (branchNameInput.value !== sanitized) branchNameInput.value = sanitized;
  updateUI();
});

commitMsgInput.addEventListener('input', () => {
  isManualCommit = true;
  autoResizeCommit();
  renderCommands(branchNameInput.value, commitMsgInput.value);
});

resetBranchBtn.addEventListener('click', () => {
  isManualBranch = false;
  isManualType = false;
  updateUI();
});

window.addEventListener('keydown', (e) => {
  if (e.altKey && e.key >= '1' && e.key <= '6') {
    e.preventDefault();
    const index = parseInt(e.key) - 1;
    if (typeButtons[index]) typeButtons[index].click();
  }
  if (e.altKey && e.key.toLowerCase() === 't') {
    e.preventDefault();
    translateBtn.click();
  }
  if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'c') {
    e.preventDefault();
    copyAllBtn.click();
  }
});

const renderCommands = (branch, commitMsg) => {
  try {
    const base = baseBranchInput ? baseBranchInput.value.trim() : 'dev';
    const t = translations[currentLang] || translations.en;
    const safeBranch = branch || 'task';
    const safeCommit = commitMsg || `${currentType}: update`;
    
    let commands = [];
    if (currentWorkflow === 'recreate') {
      commands = [
        { label: t.cmdExit || 'Exit', cmd: `git checkout ${base || 'dev'}` },
        { label: t.cmdDelete || 'Delete', cmd: `git branch -D ${safeBranch}` },
        { label: t.cmdDeleteRemote || 'Delete Remote', cmd: `git push origin --delete ${safeBranch}` },
        { label: t.cmdPull || 'Pull', cmd: `git pull origin ${base || 'dev'}` },
        { label: t.cmdRecreate || 'Recreate', cmd: `git checkout -b ${safeBranch}` },
        { label: t.cmdPushNew || 'Push New', cmd: `git push origin ${safeBranch}` }
      ];
    } else {
      if (base && base.toLowerCase() !== 'current') {
        commands.push({ label: t.cmdExit || 'Exit', cmd: `git checkout ${base} && git pull origin ${base}` });
      }
      commands.push(
        { label: t.cmdCreate || 'Create', cmd: `git checkout -b ${safeBranch}` },
        { label: t.cmdStatus || 'Status', cmd: `git status` },
        { label: t.cmdStage || 'Stage', cmd: `git add .` },
        { label: t.cmdCommit || 'Commit', cmd: `git commit -m "${safeCommit}"` },
        { label: t.cmdPush || 'Push', cmd: `git push -u origin ${safeBranch}` }
      );
    }

    if (commandListContainer) {
      commandListContainer.innerHTML = '';
      commands.forEach(c => {
        const card = document.createElement('div');
        card.className = 'command-card';
        card.innerHTML = `
          <div class="command-info">
            <div style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 4px;">${c.label}</div>
            <div class="command-text">${c.cmd}</div>
          </div>
          <button class="copy-btn">
            <i data-lucide="copy" style="width: 14px; height: 14px;"></i>
          </button>
        `;
        card.querySelector('.copy-btn').addEventListener('click', (e) => {
          copyToClipboard(c.cmd, e.currentTarget);
        });
        commandListContainer.appendChild(card);
      });
    }
    
    const fullCmd = commands.map(c => c.cmd).join(' && ');
    if (fullCommandText) fullCommandText.textContent = fullCmd;

    if (window.lucide) window.lucide.createIcons();
  } catch (err) {
    console.error("Critical error in renderCommands:", err);
  }
};

const detectType = (text) => {
  const low = text.toLowerCase();
  if (/\b(fix|bug|error|corregir|arreglar|falla|issue)\b/i.test(low)) return 'fix';
  if (/\b(hotfix|urgente|critical|critico)\b/i.test(low)) return 'hotfix';
  if (/\b(refactor|unificar|unify|reorganize|limpiar|clean)\b/i.test(low)) return 'refactor';
  if (/\b(docs|documentacion|readme|wiki)\b/i.test(low)) return 'docs';
  if (/\b(chore|deps|dependency|config|setup|build|npm|yarn)\b/i.test(low)) return 'chore';
  return 'feature';
};

window.copyToClipboard = (text, btn) => {
  navigator.clipboard.writeText(text).then(() => {
    const t = translations[currentLang];
    
    // Save to history if it's a branch or full command
    if (text.includes('/') || text.includes('git')) {
      const title = taskTitleInput.value.trim();
      if (title) saveToHistory(title, currentType);
    }

    // Toast Notification
    showToast(t.copied, 'copy');

    const originalContent = btn.innerHTML;
    btn.classList.add('copied');
    setTimeout(() => {
      btn.classList.remove('copied');
    }, 2000);
  });
};

const showToast = (message, iconType = 'check') => {
  const toast = document.createElement('div');
  toast.className = 'toast';
  
  const iconName = iconType === 'copy' ? 'clipboard-check' : 'check-circle';
  
  toast.innerHTML = `
    <i data-lucide="${iconName}"></i>
    <span>${message}</span>
  `;
  
  toastContainer.appendChild(toast);
  if (window.lucide) window.lucide.createIcons();
  
  setTimeout(() => {
    toast.classList.add('removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
};

// BORDER REVEAL LOGIC REMOVED

taskTitleInput.addEventListener('input', updateUI);
commitMsgInput.addEventListener('input', autoResizeCommit);
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    isManualType = true;
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.type;
    updateUI();
  });
});

if (copyBranchBtn) {
  copyBranchBtn.addEventListener('click', () => {
    copyToClipboard(branchNameInput.value, copyBranchBtn);
  });
}

if (copyAllBtn) {
  copyAllBtn.addEventListener('click', () => {
    const allCmds = Array.from(document.querySelectorAll('.command-text'))
      .map(el => el.textContent)
      .join(' && ');
    copyToClipboard(allCmds, copyAllBtn);
  });
}

if (copyTerminalBtn) {
  copyTerminalBtn.addEventListener('click', () => {
    copyToClipboard(fullCommandText.textContent, copyTerminalBtn);
  });
}

if (toggleTerminalBtn) {
  toggleTerminalBtn.addEventListener('click', () => {
    isTerminalMode = !isTerminalMode;
    toggleTerminalBtn.classList.toggle('active', isTerminalMode);
    commandListContainer.classList.toggle('terminal-view', isTerminalMode);
    updateTranslations();
    renderCommands(branchNameInput.value, commitMsgInput.value);
  });
}

// HISTORY LOGIC
const saveToHistory = (title, type) => {
  const existing = taskHistory.findIndex(h => h.title === title);
  if (existing !== -1) taskHistory.splice(existing, 1);
  
  taskHistory.unshift({ title, type, date: new Date().toISOString() });
  taskHistory = taskHistory.slice(0, 5);
  
  localStorage.setItem('taskHistory', JSON.stringify(taskHistory));
  renderHistory();
};

const renderHistory = () => {
  if (!taskHistoryContainer) return;
  taskHistoryContainer.innerHTML = '';
  
  taskHistory.forEach(h => {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.innerHTML = `
      <span class="hist-type">${h.type}</span>
      <span class="hist-title">${h.title.length > 25 ? h.title.substring(0, 22) + '...' : h.title}</span>
    `;
    item.addEventListener('click', () => loadHistoryItem(h.title, h.type));
    taskHistoryContainer.appendChild(item);
  });
};

window.loadHistoryItem = (title, type) => {
  taskTitleInput.value = title;
  currentType = type;
  
  // First, generate the content as if it were auto
  isManualBranch = false;
  isManualCommit = false;
  isManualType = true;
  updateUI();
  
  // THEN, lock it to manual so the user can see it's from history
  isManualBranch = true;
  isManualCommit = true;

  typeButtons.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.type === type);
  });

  // Final render with the manual flags active
  renderCommands(branchNameInput.value, commitMsgInput.value);
  
  if (resetBranchBtn) resetBranchBtn.style.display = 'flex';
  if (manualNotice) manualNotice.style.display = 'flex';
};

const toggleFavorite = (descEn) => {
  const index = favorites.indexOf(descEn);
  if (index === -1) {
    favorites.push(descEn);
  } else {
    favorites.splice(index, 1);
  }
  localStorage.setItem('favorites', JSON.stringify(favorites));
  
  // Re-render to show update
  renderLibrary('git', GIT_LIBRARY, 'git-library-grid', gitSearchInput.value);
  renderLibrary('node', NODE_LIBRARY, 'node-library-grid', nodeSearchInput.value);
  renderDockerLibrary(dockerSearchInput.value);
  renderFavorites();
};

window.moveStackToFront = (stack) => {
  const index = favoriteOrder.indexOf(stack);
  if (index > 0) {
    favoriteOrder.splice(index, 1);
    favoriteOrder.unshift(stack);
    localStorage.setItem('favoriteOrder', JSON.stringify(favoriteOrder));
    renderFavorites();
  }
};

const renderFavorites = () => {
  const container = document.getElementById('favs-library-grid');
  const controls = document.getElementById('fav-order-controls');
  if (!container) return;
  
  const t = translations[currentLang];
  
  if (controls) {
    controls.innerHTML = `
      <span style="font-size: 0.65rem; color: var(--text-secondary); align-self: center; margin-right: 4px;">${t.lblPriority}:</span>
      ${favoriteOrder.map((stack, i) => `
        <button class="module-badge module-badge-${stack}" 
                onclick="moveStackToFront('${stack}')" 
                style="cursor: pointer; ${i === 0 ? 'box-shadow: 0 0 10px var(--accent-' + stack + '); border: 1px solid white;' : 'opacity: 0.5;'}">
          ${stack}
        </button>
      `).join('')}
    `;
  }

  container.innerHTML = '';
  
  const allLibraries = [
    { module: 'git', data: GIT_LIBRARY },
    { module: 'node', data: NODE_LIBRARY },
    { module: 'docker', data: DOCKER_LIBRARY }
  ].sort((a, b) => favoriteOrder.indexOf(a.module) - favoriteOrder.indexOf(b.module));
  
  let hasFavs = false;
  
  allLibraries.forEach(lib => {
    const favs = lib.data.filter(item => favorites.includes(item.desc.en));
    if (favs.length > 0) hasFavs = true;
    
    favs.forEach(item => {
      const card = document.createElement('div');
      card.className = `library-card fav-card-${lib.module}`;
      
      let finalCmd = '';
      if (lib.module === 'git') {
         const globalParam = gitParamInput ? gitParamInput.value : '';
         finalCmd = typeof item.cmd === 'function' ? item.cmd(globalParam, baseBranchInput.value, branchNameInput.value) : item.cmd;
      } else if (lib.module === 'node') {
         finalCmd = typeof item.cmd === 'function' ? item.cmd() : item.cmd;
      } else if (lib.module === 'docker') {
         const file = dockerFileInput?.value?.trim() || 'docker-compose.dev.yml';
         const svc = dockerServiceInput?.value?.trim() || 'api';
         finalCmd = typeof item.cmd === 'function' ? item.cmd(file, svc) : item.cmd;
      }

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: start;">
          <div style="display: flex; flex-direction: column; gap: 6px;">
            <span class="module-badge module-badge-${lib.module}">${lib.module}</span>
            <div class="cmd-desc">${item.desc[currentLang]}</div>
          </div>
          <button class="star-btn active" title="${t.titleRemoveFav}">
            <i data-lucide="star" fill="currentColor" style="width: 14px; height: 14px;"></i>
          </button>
        </div>
        <div class="cmd-val">
          <span>${finalCmd.length > 35 ? finalCmd.substring(0, 32) + '...' : finalCmd}</span>
          <i data-lucide="copy" style="width: 12px; height: 12px;"></i>
        </div>
      `;
      
      const cmdVal = card.querySelector('.cmd-val');
      cmdVal.onclick = () => copyToClipboard(finalCmd, cmdVal);
      
      const starBtn = card.querySelector('.star-btn');
      starBtn.onclick = (e) => {
        e.stopPropagation();
        toggleFavorite(item.desc.en);
        renderFavorites();
      };
      
      container.appendChild(card);
    });
  });
  
  if (!hasFavs) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 40px; border: 1px dashed var(--card-border); border-radius: 12px;">
        <i data-lucide="star-off" style="width: 48px; height: 48px; opacity: 0.2; margin-bottom: 10px;"></i>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">${t.txtNoFavs}</p>
      </div>
    `;
  }

  if (window.lucide) window.lucide.createIcons();
};

// LIBRARIES (VAULTS)
// LIBRARIES (VAULTS) - MOVED TO libraries.js

const renderLibrary = (module, data, containerId, query = '') => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const t = translations[currentLang];
  const globalParam = (module === 'git' && gitParamInput) ? gitParamInput.value : '';
  
  const filtered = data.filter(item => {
    const q = query.toLowerCase();
    const testCmd = typeof item.cmd === 'function' 
      ? item.cmd(globalParam, baseBranchInput.value, branchNameInput.value) 
      : item.cmd;
    
    return item.desc.en.toLowerCase().includes(q) || 
           item.desc.es.toLowerCase().includes(q) || 
           testCmd.toLowerCase().includes(q) || 
           (item.tags && item.tags.toLowerCase().includes(q));
  });

  container.innerHTML = '';
  filtered.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'library-card';
    
    const finalCmd = typeof item.cmd === 'function' 
      ? item.cmd(globalParam, baseBranchInput.value, branchNameInput.value) 
      : item.cmd;
    
    const isFav = favorites.includes(item.desc.en);
    
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div class="cmd-desc">${item.desc[currentLang]}</div>
        <button class="star-btn ${isFav ? 'active' : ''}" title="${isFav ? t.titleRemoveFav : t.titleAddFav}">
          <i data-lucide="star" ${isFav ? 'fill="currentColor"' : ''} style="width: 14px; height: 14px;"></i>
        </button>
      </div>
      <div class="cmd-val">
        <span>${finalCmd.length > 35 ? finalCmd.substring(0, 32) + '...' : finalCmd}</span>
        <i data-lucide="copy" style="width: 12px; height: 12px;"></i>
      </div>
    `;

    const starBtn = card.querySelector('.star-btn');
    starBtn.onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(item.desc.en);
    };

    const cmdVal = card.querySelector('.cmd-val');
    cmdVal.onclick = () => copyToClipboard(finalCmd, cmdVal);
    
    container.appendChild(card);
  });

  if (window.lucide) window.lucide.createIcons();
};

workflowButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    workflowButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentWorkflow = btn.dataset.wf;
    
    if (currentWorkflow === 'recreate') {
      baseBranchGroup.style.display = 'flex';
      document.querySelector('.task-types').style.display = 'none';
      document.getElementById('lbl-task-type').style.display = 'none';
      document.getElementById('commit-group').style.display = 'none';
    } else {
      baseBranchGroup.style.display = 'flex';
      document.querySelector('.task-types').style.display = 'flex';
      document.getElementById('lbl-task-type').style.display = 'block';
      document.getElementById('commit-group').style.display = 'block';
    }
    updateUI();
  });
});

baseBranchInput.addEventListener('input', updateUI);

// MODULE SWITCHING
const navItems = document.querySelectorAll('.nav-item');
const moduleContents = document.querySelectorAll('.module-content');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const module = item.dataset.module;
    const targetModule = document.getElementById(`module-${module}`);

    if (!targetModule || item.classList.contains('active')) return;

    // Update state
    currentActiveModule = module;

    // Update Nav Buttons
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    
    // Switch Content
    moduleContents.forEach(m => {
      m.classList.remove('active');
      m.style.display = 'none';
    });
    
    targetModule.style.display = 'block';
    setTimeout(() => {
      targetModule.classList.add('active');
    }, 10);
    
    // Update Theme and Title/Subtitle
    document.body.className = module === 'git' ? 'theme-git' : `theme-${module}`;
    // INITIALIZE
    updateTranslations();
    updateUI();
    if (window.lucide) window.lucide.createIcons();
    if (module === 'docker') renderDockerLibrary();
    if (module === 'node') renderNodeCommands();
  });
});

// NODE MODULE LOGIC
const nodePkgInput = document.getElementById('node-pkg-input');
const nodeTypeBtns = document.querySelectorAll('.node-type-btn');
const nodeMgrBtns = document.querySelectorAll('.node-mgr-btn');
const nodeActionBtns = document.querySelectorAll('.node-action-btn');
const nodeCommandList = document.getElementById('node-command-list');
const nodeOutput = document.getElementById('node-output');

let currentNodeType = 'std';
let currentMgr = 'npm';

const renderNodeCommands = () => {
  const pkgs = nodePkgInput.value.trim();
  let commands = [];

  if (pkgs) {
    let baseCmd = currentMgr === 'npm' ? 'npm install' : (currentMgr === 'yarn' ? 'yarn add' : 'pnpm add');
    if (currentNodeType === 'dev') baseCmd += ' -D';
    if (currentNodeType === 'glob') baseCmd += (currentMgr === 'npm' ? ' -g' : ' --global');
    commands.push({ label: 'Install Dependencies', cmd: `${baseCmd} ${pkgs}` });
  }

  nodeOutput.classList.toggle('visible', commands.length > 0);
  
  nodeCommandList.innerHTML = '';
  commands.forEach(c => {
    const card = document.createElement('div');
    card.className = 'command-card';
    card.innerHTML = `
      <div class="command-info">
        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 4px;">${c.label}</div>
        <div class="command-text">${c.cmd}</div>
      </div>
      <button class="copy-btn">
        <i data-lucide="copy" style="width: 14px; height: 14px;"></i>
      </button>
    `;
    card.querySelector('.copy-btn').addEventListener('click', (e) => {
      copyToClipboard(c.cmd, e.currentTarget);
    });
    nodeCommandList.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
};

nodePkgInput.addEventListener('input', renderNodeCommands);

nodeTypeBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    nodeTypeBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentNodeType = btn.dataset.type;
    renderNodeCommands();
  });
});

nodeMgrBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    nodeMgrBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentMgr = btn.dataset.mgr;
    renderNodeCommands();
  });
});

nodeActionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    let cmd = btn.dataset.cmd;
    const label = btn.textContent;
    
    // Transform command based on manager
    if (currentMgr !== 'npm') {
      if (cmd === 'npm init -y') cmd = `${currentMgr} init -y`;
      if (cmd === 'npm install') cmd = `${currentMgr} install`;
      if (cmd === 'npm audit fix') cmd = currentMgr === 'pnpm' ? 'pnpm audit --fix' : 'npm audit fix'; // Yarn audit fix is complex
      if (cmd === 'npm version patch') cmd = `${currentMgr} version patch`;
      if (cmd === 'npm run dev') cmd = currentMgr === 'yarn' ? 'yarn dev' : 'pnpm dev';
    }
    
    const card = document.createElement('div');
    card.className = 'command-card';
    card.style.animation = 'slide-up 0.3s ease-out';
    card.innerHTML = `
      <div class="command-info">
        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 4px;">${label}</div>
        <div class="command-text">${cmd}</div>
      </div>
      <button class="copy-btn">
        <i data-lucide="copy" style="width: 14px; height: 14px;"></i>
      </button>
    `;
    card.querySelector('.copy-btn').addEventListener('click', (e) => {
      copyToClipboard(cmd, e.currentTarget);
    });
    nodeCommandList.prepend(card);
    nodeOutput.classList.add('visible');
    if (window.lucide) window.lucide.createIcons();
  });
});

// DOCKER MODULE LOGIC
const renderDockerCommands = () => {
  const img = dockerImgInput.value.trim();
  const ports = dockerPortInput.value.trim();
  const svc = dockerServiceInput.value.trim() || 'api';
  const file = dockerFileInput.value.trim() || 'docker-compose.dev.yml';
  let commands = [];

  if (img) {
    commands.push({ label: 'Build Image', cmd: `docker build -t ${img} .` });
    if (ports) {
      commands.push({ label: 'Run Container', cmd: `docker run -d -p ${ports} --name ${img.split(':')[0]} ${img}` });
    }
  }
  
  // Re-render library too when inputs change
  renderDockerLibrary(dockerSearchInput.value);

  dockerOutput.classList.toggle('visible', commands.length > 0);
  
  dockerCommandList.innerHTML = '';
  commands.forEach(c => {
    const card = document.createElement('div');
    card.className = 'command-card';
    card.innerHTML = `
      <div class="command-info">
        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 4px;">${c.label}</div>
        <div class="command-text">${c.cmd}</div>
      </div>
      <button class="copy-btn">
        <i data-lucide="copy" style="width: 14px; height: 14px;"></i>
      </button>
    `;
    card.querySelector('.copy-btn').addEventListener('click', (e) => {
      copyToClipboard(c.cmd, e.currentTarget);
    });
    dockerCommandList.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
};

dockerImgInput.addEventListener('input', renderDockerCommands);
dockerPortInput.addEventListener('input', renderDockerCommands);
dockerServiceInput.addEventListener('input', renderDockerCommands);
dockerFileInput.addEventListener('input', renderDockerCommands);

dockerActionBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    let cmd = btn.dataset.cmd;
    const file = dockerFileInput.value.trim() || 'docker-compose.dev.yml';
    
    // Inject file if it's a compose command
    if (cmd.startsWith('docker-compose')) {
      cmd = cmd.replace('docker-compose', `docker compose -f ${file}`);
    }

    const label = btn.textContent;
    const card = document.createElement('div');
    card.className = 'command-card';
    card.style.animation = 'slide-up 0.3s ease-out';
    card.innerHTML = `
      <div class="command-info">
        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 4px;">${label}</div>
        <div class="command-text">${cmd}</div>
      </div>
      <button class="copy-btn">
        <i data-lucide="copy" style="width: 14px; height: 14px;"></i>
      </button>
    `;
    card.querySelector('.copy-btn').addEventListener('click', (e) => {
      copyToClipboard(cmd, e.currentTarget);
    });
    dockerCommandList.prepend(card);
    dockerOutput.classList.add('visible');
    if (window.lucide) window.lucide.createIcons();
  });
});

// DOCKER LIBRARY DATA - MOVED TO libraries.js

const renderDockerLibrary = (filter = '') => {
  if (!dockerLibraryGrid) return;
  const file = dockerFileInput?.value?.trim() || 'docker-compose.dev.yml';
  const svc = dockerServiceInput?.value?.trim() || 'api';
  const t = translations[currentLang];

  const filtered = DOCKER_LIBRARY.filter(item => 
    item.desc.en.toLowerCase().includes(filter.toLowerCase()) || 
    item.desc.es.toLowerCase().includes(filter.toLowerCase()) || 
    item.tags.toLowerCase().includes(filter.toLowerCase())
  );

  dockerLibraryGrid.innerHTML = '';
  filtered.forEach(item => {
    const finalCmd = typeof item.cmd === 'function' ? item.cmd(file, svc) : item.cmd;
    const isFav = favorites.includes(item.desc.en);
    
    const card = document.createElement('div');
    card.className = 'library-card';
    card.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: start;">
        <div class="cmd-desc">${item.desc[currentLang]}</div>
        <button class="star-btn ${isFav ? 'active' : ''}" title="${isFav ? t.titleRemoveFav : t.titleAddFav}">
          <i data-lucide="star" ${isFav ? 'fill="currentColor"' : ''} style="width: 14px; height: 14px;"></i>
        </button>
      </div>
      <div class="cmd-val">
        <span>${finalCmd.length > 35 ? finalCmd.substring(0, 32) + '...' : finalCmd}</span>
        <i data-lucide="copy" style="width: 12px; height: 12px;"></i>
      </div>
    `;
    
    const cmdVal = card.querySelector('.cmd-val');
    cmdVal.onclick = () => copyToClipboard(finalCmd, cmdVal);
    
    const starBtn = card.querySelector('.star-btn');
    starBtn.onclick = (e) => {
      e.stopPropagation();
      toggleFavorite(item.desc.en);
    };
    
    dockerLibraryGrid.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
};

// Initial Library Render
renderDockerLibrary();
renderLibrary('git', GIT_LIBRARY, 'git-library-grid');
renderLibrary('node', NODE_LIBRARY, 'node-library-grid');
renderFavorites();
renderHistory();

// Search Listeners
if (dockerSearchInput) {
  dockerSearchInput.addEventListener('input', (e) => renderDockerLibrary(e.target.value));
}
if (gitSearchInput) {
  gitSearchInput.addEventListener('input', (e) => renderLibrary('git', GIT_LIBRARY, 'git-library-grid', e.target.value));
}
if (nodeSearchInput) {
  nodeSearchInput.addEventListener('input', (e) => renderLibrary('node', NODE_LIBRARY, 'node-library-grid', e.target.value));
}

updateTranslations();
if (window.lucide) window.lucide.createIcons();

if (gitParamInput) {
  gitParamInput.addEventListener('input', () => {
    renderLibrary('git', GIT_LIBRARY, 'git-library-grid', gitSearchInput.value);
  });
}
