import './style.css'
import { GIT_LIBRARY, NODE_LIBRARY, DOCKER_LIBRARY } from './libraries.js'
import { translations } from './config.js'
import { storage } from './modules/storage.js'
import * as gitEngine from './modules/git-engine.js'
import * as utils from './modules/utils.js'
import * as uiRender from './modules/ui-render.js'

let currentLang = storage.getLang();

// DOM Elements
const taskTitleInput = document.getElementById('task-title');
const typeButtons = document.querySelectorAll('.type-btn');
const outputSection = document.getElementById('output-section');
const branchNameInput = document.getElementById('branch-name-input');
const commitMsgInput = document.getElementById('commit-msg-input');
const copyBranchBtn = document.getElementById('copy-branch');
const copyAllBtn = document.getElementById('copy-all');
const workflowButtons = document.querySelectorAll('.wf-btn');
const baseBranchGroup = document.getElementById('base-branch-group');
const baseBranchInput = document.getElementById('base-branch');
const langBtn = document.getElementById('lang-btn');
const translateBtn = document.getElementById('translate-btn');
const clearTaskBtn = document.getElementById('clear-task-btn');
const resetBranchBtn = document.getElementById('reset-branch');
const manualNotice = document.getElementById('manual-notice');
const branchWarning = document.getElementById('branch-warning');

// Vault Search Inputs
const dockerSearchInput = document.getElementById('docker-search');
const gitSearchInput = document.getElementById('git-search');
const nodeSearchInput = document.getElementById('node-search');
const gitParamInput = document.getElementById('git-param');
const autoTranslateCheck = document.getElementById('auto-translate-check');
const txtAutoTranslate = document.getElementById('txt-auto-translate');

// Docker Inputs
const dockerServiceInput = document.getElementById('docker-service-input');
const dockerFileInput = document.getElementById('docker-file-input');
const dockerLibraryGrid = document.getElementById('docker-library-grid');
const dockerImgInput = document.getElementById('docker-img-input');
const dockerPortInput = document.getElementById('docker-port-input');
const dockerActionBtns = document.querySelectorAll('.docker-action-btn');
const dockerCommandList = document.getElementById('docker-command-list');
const dockerOutput = document.getElementById('docker-output');

// Personal Vault Inputs
const addCustomCmdBtn = document.getElementById('add-custom-cmd-btn');
const customCmdDescInput = document.getElementById('custom-cmd-desc');
const customCmdValInput = document.getElementById('custom-cmd-val');
const cancelCustomCmdBtn = document.getElementById('cancel-custom-cmd-btn');
const txtCancelEdit = document.getElementById('txt-cancel-edit');
const personalThemeColorInput = document.getElementById('personal-theme-color');

// State
let taskHistory = storage.getHistory();
let favorites = storage.getFavorites();
let personalCommands = storage.getPersonalCommands();
let favoriteOrder = storage.getFavoriteOrder();
let personalThemeColor = storage.getPersonalThemeColor();
let editingIndex = null;

let currentType = 'feature';
let currentWorkflow = 'new';
let isManualBranch = false;
let isManualCommit = false;
let isManualType = false;
let currentActiveModule = 'git';
let autoTranslateEnabled = storage.getAutoTranslate();

// --- INITIALIZATION ---
if (autoTranslateCheck) autoTranslateCheck.checked = autoTranslateEnabled;

const updateTranslations = () => {
  const t = translations[currentLang];
  
  // Header & Navigation
  document.getElementById('txt-title').textContent = t.title;
  const subtitleKey = 'subtitle' + currentActiveModule.charAt(0).toUpperCase() + currentActiveModule.slice(1);
  document.getElementById('txt-subtitle').textContent = t[subtitleKey] || t.subtitleGit;
  document.getElementById('txt-nav-git').textContent = t.navGit;
  document.getElementById('txt-nav-node').textContent = t.navNode;
  document.getElementById('txt-nav-docker').textContent = t.navDocker;
  document.getElementById('txt-nav-favs').textContent = t.navFavs;
  document.getElementById('txt-nav-personal').textContent = t.navPersonal;
  langBtn.textContent = currentLang.toUpperCase();

  // Labels Mapping
  const lbls = {
    'lbl-task-title': t.lblTask,
    'lbl-base-branch': t.lblBase,
    'lbl-task-type': t.lblType,
    'lbl-target-branch': t.lblTarget,
    'lbl-commit-msg': t.lblCommit,
    'lbl-workflow-cmds': t.lblWorkflow,
    'lbl-git-vault': t.lblGitVault,
    'lbl-favs-vault': t.lblFavsVault,
    'txt-favs-subtitle': t.subtitleFavs,
    'lbl-node-manager': t.nodeMgr,
    'lbl-node-install': t.nodeInstall,
    'lbl-node-type': t.nodeType,
    'lbl-node-quick': t.nodeQuick,
    'lbl-node-output': t.nodeOutput,
    'lbl-node-vault': t.nodeVault,
    'lbl-docker-img': t.dockerImg,
    'lbl-docker-port': t.dockerPort,
    'lbl-docker-service': t.dockerService,
    'lbl-docker-file': t.dockerFile,
    'lbl-docker-compose': t.dockerCompose,
    'lbl-docker-quick': t.dockerQuick,
    'lbl-docker-output': t.dockerOutput,
    'lbl-docker-vault': t.dockerVault,
    'lbl-personal-vault': t.lblPersonalVault,
    'txt-personal-subtitle': t.subtitlePersonal,
    'lbl-custom-desc': t.lblCustomDesc,
    'lbl-custom-val': t.lblCustomVal,
    'lbl-custom-icon': t.lblCustomIcon,
    'txt-add-command': editingIndex !== null ? t.btnSaveCommand : t.btnAddCommand,
    'txt-cancel-edit': t.btnCancel,
    'txt-terminal-view': document.body.classList.contains('terminal-mode') ? t.listView : t.terminalView,
    'txt-modal-title': t.modalConfirmTitle,
    'txt-modal-message': t.modalConfirmDelete,
    'modal-cancel-btn': t.btnCancel,
    'modal-confirm-btn': t.btnConfirm
  };

  Object.entries(lbls).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el && text) el.textContent = text;
  });

  // Placeholders
  const placeholders = {
    'task-title': t.placeholderTask,
    'git-search': t.placeholderSearch,
    'git-param': t.placeholderGitParam,
    'node-search': t.placeholderSearch,
    'docker-search': t.placeholderDocker,
    'custom-cmd-desc': t.placeholderTask
  };

  Object.entries(placeholders).forEach(([id, text]) => {
    const el = document.getElementById(id);
    if (el && text) el.setAttribute('placeholder', text);
  });

  // Git Specific
  const wfNew = document.querySelector('#btn-wf-new span');
  if (wfNew) wfNew.textContent = t.wfNew;
  const wfRecreate = document.querySelector('#btn-wf-recreate span');
  if (wfRecreate) wfRecreate.textContent = t.wfRecreate;

  // Specific Misc Labels
  if (manualNotice) manualNotice.textContent = t.manualNotice;
  if (resetBranchBtn) resetBranchBtn.textContent = t.btnReset;
  if (txtAutoTranslate) txtAutoTranslate.textContent = t.lblAutoTranslate;
  
  // Task Type Buttons
  typeButtons.forEach(btn => {
    const type = btn.dataset.type;
    const key = 'type' + type.charAt(0).toUpperCase() + type.slice(1);
    btn.textContent = t[key] || type;
  });

  updateUI();
};

langBtn.addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'es' : 'en';
  storage.setLang(currentLang);
  updateTranslations();
});

// --- CORE UI LOGIC ---

const updateUI = () => {
  const title = taskTitleInput.value.trim();
  if (title.length > 0) {
    outputSection.classList.add('visible');
    
    // Auto-detect type
    if (!isManualType && !isManualBranch && title.length > 3) {
      const detected = gitEngine.detectType(title);
      if (detected !== currentType) {
        currentType = detected;
        typeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.type === currentType));
      }
    }

    if (translateBtn) translateBtn.classList.toggle('active-mode', autoTranslateEnabled);

    // Branch Name Generation
    if (!isManualBranch) {
      const generatedBranch = (title.includes('/') || currentWorkflow === 'recreate') 
        ? gitEngine.sanitizeBranchName(title) 
        : `${currentType}/${gitEngine.slugify(title)}`;
      branchNameInput.value = generatedBranch;
    }

    // Commit Message Generation
    if (!isManualCommit) {
      const cleanTitle = title.replace(/\[.*?\]/g, '').replace(/\b(frontend|backend|fe|be|front|back)\b/gi, '').trim();
      const issueMatch = title.match(/#(\d+)/);
      const commitPrefix = issueMatch ? `#${issueMatch[1]} - ` : '';
      commitMsgInput.value = `${currentType}: ${commitPrefix}${cleanTitle}`;
      utils.autoResizeTextarea(commitMsgInput);
    }

    validateBranch(branchNameInput.value);
    uiRender.renderCommands(branchNameInput.value, commitMsgInput.value, currentWorkflow, baseBranchInput.value, currentType, translations, currentLang);
  } else {
    outputSection.classList.remove('visible');
    isManualBranch = isManualCommit = isManualType = false;
  }

  // Always refresh active vault and favorites regardless of title
  refreshActiveModuleVault();
  renderFavorites();
};

const refreshActiveModuleVault = () => {
    if (currentActiveModule === 'git') renderGitLibrary();
    if (currentActiveModule === 'node') {
        renderNodeCommands();
        renderNodeLibrary();
    }
    if (currentActiveModule === 'docker') renderDockerCommands();
    if (currentActiveModule === 'personal') uiRender.renderPersonalLibrary(personalCommands, personalThemeColor, translations, currentLang, branchNameInput.value, baseBranchInput.value, startEditing, deletePersonalCommand, (cmd, btn) => utils.copyToClipboard(cmd, btn, translations[currentLang].copied));
};

const validateBranch = (name) => {
  const t = translations[currentLang];
  let warning = '';
  if (name.length > 50) warning = t.warningLong;
  else if (/[^\w\d\/\-._]/.test(name)) warning = t.warningChars;
  
  if (warning) {
    branchWarning.style.display = 'flex';
    branchWarning.innerHTML = `<i data-lucide="alert-triangle" style="width: 14px; height: 14px;"></i> <span>${warning}</span>`;
    if (window.lucide) window.lucide.createIcons();
  } else {
    branchWarning.style.display = 'none';
  }
};

// --- EVENT LISTENERS ---

taskTitleInput.addEventListener('input', updateUI);

taskTitleInput.addEventListener('keydown', async (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    const text = taskTitleInput.value.trim();
    if (text) {
      isManualBranch = isManualType = isManualCommit = false;
      updateUI();
      if (autoTranslateEnabled && gitEngine.isSpanishText(text)) await translateTitle();
      copyBranchBtn.click();
    }
  }
});

branchNameInput.addEventListener('input', () => {
  isManualBranch = true;
  branchNameInput.value = gitEngine.sanitizeBranchName(branchNameInput.value);
  updateUI();
});

commitMsgInput.addEventListener('input', () => {
  isManualCommit = true;
  utils.autoResizeTextarea(commitMsgInput);
  uiRender.renderCommands(branchNameInput.value, commitMsgInput.value, currentWorkflow, baseBranchInput.value, currentType, translations, currentLang);
});

typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    isManualType = true;
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.type;
    updateUI();
  });
});

workflowButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    workflowButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentWorkflow = btn.dataset.wf;
    const isRecreate = currentWorkflow === 'recreate';
    baseBranchGroup.style.display = 'flex';
    document.querySelector('.task-types').style.display = isRecreate ? 'none' : 'flex';
    document.getElementById('lbl-task-type').style.display = isRecreate ? 'none' : 'block';
    document.getElementById('commit-group').style.display = isRecreate ? 'none' : 'block';
    updateUI();
  });
});

baseBranchInput.addEventListener('input', updateUI);

const translateTitle = async () => {
  const text = taskTitleInput.value.trim();
  if (!text) return;
  translateBtn.classList.add('loading');
  try {
    const isSpanish = gitEngine.isSpanishText(text);
    const langPair = isSpanish ? 'es|en' : 'en|es';
    const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${langPair}`);
    const data = await response.json();
    if (data.responseData?.translatedText) {
      taskTitleInput.value = data.responseData.translatedText;
      updateUI();
    }
  } finally {
    translateBtn.classList.remove('loading');
  }
};

translateBtn.addEventListener('click', translateTitle);

if (autoTranslateCheck) {
  autoTranslateCheck.addEventListener('change', (e) => {
    autoTranslateEnabled = e.target.checked;
    storage.saveAutoTranslate(autoTranslateEnabled);
  });
}

if (clearTaskBtn) {
  clearTaskBtn.addEventListener('click', () => {
    taskTitleInput.value = '';
    taskTitleInput.focus();
    updateUI();
  });
}

resetBranchBtn.addEventListener('click', () => {
  isManualBranch = isManualType = false;
  updateUI();
});

copyBranchBtn.addEventListener('click', () => {
  utils.copyToClipboard(branchNameInput.value, copyBranchBtn, translations[currentLang].copied);
  saveToHistory(taskTitleInput.value.trim(), currentType);
});

copyAllBtn.addEventListener('click', () => {
  const allCmds = Array.from(document.querySelectorAll('.command-text')).map(el => el.textContent).join(' && ');
  utils.copyToClipboard(allCmds, copyAllBtn, translations[currentLang].copied);
});

// Navigation
const navItems = document.querySelectorAll('.nav-item');
const moduleContents = document.querySelectorAll('.module-content');

navItems.forEach(item => {
  item.addEventListener('click', () => {
    const module = item.dataset.module;
    if (item.classList.contains('active')) return;
    currentActiveModule = module;
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    moduleContents.forEach(m => { m.classList.remove('active'); m.style.display = 'none'; });
    const target = document.getElementById(`module-${module}`);
    if (target) {
        target.style.display = 'block';
        setTimeout(() => target.classList.add('active'), 10);
    }
    document.body.className = `theme-${module}`;
    updateTranslations();
  });
});

// --- MODULE SPECIFIC LOGIC ---

// Git Library
const renderGitLibrary = () => {
  const dataWithParams = GIT_LIBRARY.map(item => ({
    ...item,
    params: [gitParamInput.value, baseBranchInput.value, branchNameInput.value]
  }));
  uiRender.renderLibrary('git', dataWithParams, 'git-library-grid', gitSearchInput.value, favorites, translations, currentLang, toggleFavorite);
};

gitSearchInput.addEventListener('input', renderGitLibrary);

// Node Library
const nodePkgInput = document.getElementById('node-pkg-input');
const nodeTypeBtns = document.querySelectorAll('.node-type-btn');
const nodeMgrBtns = document.querySelectorAll('.node-mgr-btn');
const nodeActionBtns = document.querySelectorAll('.node-action-btn');
const nodeCommandList = document.getElementById('node-command-list');
const nodeOutput = document.getElementById('node-output');

let currentNodeType = 'std', currentMgr = 'pnpm';

const renderNodeCommands = () => {
  const pkgs = nodePkgInput.value.trim();
  let commands = [];
  if (pkgs) {
    let baseCmd = currentMgr === 'npm' ? 'npm install' : (currentMgr === 'yarn' ? 'yarn add' : 'pnpm add');
    if (currentNodeType === 'dev') baseCmd += ' -D';
    if (currentNodeType === 'glob') baseCmd += (currentMgr === 'npm' ? ' -g' : ' --global');
    commands.push({ label: 'Install', cmd: `${baseCmd} ${pkgs}` });
  }
  nodeOutput.classList.toggle('visible', commands.length > 0);
  nodeCommandList.innerHTML = '';
  commands.forEach(c => {
    const card = document.createElement('div');
    card.className = 'command-card';
    card.innerHTML = `<div class="command-info"><div class="command-text">${c.cmd}</div></div><button class="copy-btn"><i data-lucide="copy"></i></button>`;
    card.querySelector('.copy-btn').onclick = () => utils.copyToClipboard(c.cmd, card.querySelector('.copy-btn'), translations[currentLang].copied);
    nodeCommandList.appendChild(card);
  });
  if (window.lucide) window.lucide.createIcons();
};

nodePkgInput.addEventListener('input', renderNodeCommands);
nodeTypeBtns.forEach(btn => btn.onclick = () => { nodeTypeBtns.forEach(b => b.classList.remove('active')); btn.classList.add('active'); currentNodeType = btn.dataset.type; renderNodeCommands(); });
nodeMgrBtns.forEach(btn => btn.onclick = () => { 
    nodeMgrBtns.forEach(b => b.classList.remove('active')); 
    btn.classList.add('active'); 
    currentMgr = btn.dataset.mgr; 
    renderNodeCommands(); 
    renderNodeLibrary(); // Refresh vault commands too
});

const renderNodeLibrary = () => {
  const dataWithParams = NODE_LIBRARY.map(item => ({
    ...item,
    params: [currentMgr]
  }));
  uiRender.renderLibrary('node', dataWithParams, 'node-library-grid', nodeSearchInput.value, favorites, translations, currentLang, toggleFavorite);
};

nodeSearchInput.addEventListener('input', renderNodeLibrary);

// Docker Logic (Simplified here, could be moved to module)
const renderDockerCommands = () => {
  const img = dockerImgInput.value.trim();
  const file = dockerFileInput.value.trim() || 'docker-compose.yml';
  const svc = dockerServiceInput.value.trim() || 'app';
  // ... similar logic ...
  renderDockerLibrary(dockerSearchInput.value);
};

const renderDockerLibrary = (filter = '') => {
  const file = dockerFileInput?.value?.trim() || 'docker-compose.dev.yml';
  const svc = dockerServiceInput?.value?.trim() || 'api';
  const dataWithParams = DOCKER_LIBRARY.map(item => ({
    ...item,
    params: [file, svc]
  }));
  uiRender.renderLibrary('docker', dataWithParams, 'docker-library-grid', filter, favorites, translations, currentLang, toggleFavorite);
};

// Personal Vault Logic
let currentCustomIcon = 'lock';
const iconOpts = document.querySelectorAll('.icon-opt');
iconOpts.forEach(btn => {
  btn.addEventListener('click', () => {
    iconOpts.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentCustomIcon = btn.dataset.icon;
  });
});

if (addCustomCmdBtn) {
  addCustomCmdBtn.addEventListener('click', () => {
    const desc = customCmdDescInput.value.trim();
    const cmd = customCmdValInput.value.trim();
    const t = translations[currentLang];

    if (!desc || !cmd) return;

    if (editingIndex !== null) {
      personalCommands[editingIndex] = { desc, cmd, icon: currentCustomIcon };
      editingIndex = null;
      addCustomCmdBtn.querySelector('span').textContent = t.btnAddCommand;
      cancelCustomCmdBtn.style.display = 'none';
    } else {
      personalCommands.push({ desc, cmd, icon: currentCustomIcon });
    }

    storage.savePersonalCommands(personalCommands);
    customCmdDescInput.value = '';
    customCmdValInput.value = '';
    updateUI();
  });
}

if (cancelCustomCmdBtn) {
    cancelCustomCmdBtn.addEventListener('click', () => {
        editingIndex = null;
        customCmdDescInput.value = '';
        customCmdValInput.value = '';
        addCustomCmdBtn.querySelector('span').textContent = translations[currentLang].btnAddCommand;
        cancelCustomCmdBtn.style.display = 'none';
    });
}

if (personalThemeColorInput) {
  personalThemeColorInput.addEventListener('input', (e) => {
    personalThemeColor = e.target.value;
    storage.savePersonalThemeColor(personalThemeColor);
    applyPersonalTheme();
    refreshActiveModuleVault(); // Refresh icons color
  });
}

// Favorites
const toggleFavorite = (descEn) => {
  const index = favorites.indexOf(descEn);
  if (index === -1) favorites.push(descEn);
  else favorites.splice(index, 1);
  storage.saveFavorites(favorites);
  updateUI();
};

const renderFavoriteControls = () => {
  const controls = document.getElementById('fav-order-controls');
  if (!controls) return;
  const t = translations[currentLang];
  
  controls.innerHTML = `<span style="font-size: 0.7rem; color: var(--text-secondary); margin-right: 8px; font-weight: 600;">${t.lblPriority || 'PRIORITY'}:</span>`;
  
  favoriteOrder.filter(m => m !== 'personal').forEach((mod, idx) => {
    const btn = document.createElement('button');
    btn.className = `secondary-btn module-badge-${mod}`;
    btn.style.height = '28px';
    btn.style.fontSize = '0.65rem';
    btn.style.padding = '0 12px';
    btn.style.opacity = idx === 0 ? '1' : '0.4';
    btn.style.border = idx === 0 ? `1px solid var(--accent-${mod})` : '1px solid transparent';
    btn.style.boxShadow = idx === 0 ? `0 0 10px rgba(var(--accent-${mod}-rgb), 0.2)` : 'none';
    btn.textContent = mod.toUpperCase();
    
    btn.onclick = () => {
      const index = favoriteOrder.indexOf(mod);
      favoriteOrder.splice(index, 1);
      favoriteOrder.unshift(mod);
      storage.saveFavoriteOrder(favoriteOrder);
      renderFavorites();
    };
    controls.appendChild(btn);
  });
};

const renderFavorites = () => {
  const container = document.getElementById('favs-library-grid');
  if (!container) return;
  renderFavoriteControls();
  const t = translations[currentLang];
  container.innerHTML = '';
  
  const gitParams = [gitParamInput.value, baseBranchInput.value, branchNameInput.value];
  const dockerParams = [dockerFileInput?.value?.trim() || 'docker-compose.dev.yml', dockerServiceInput?.value?.trim() || 'api'];

  const allData = [
    { module: 'git', data: GIT_LIBRARY, params: gitParams },
    { module: 'node', data: NODE_LIBRARY, params: [currentMgr] },
    { module: 'docker', data: DOCKER_LIBRARY, params: dockerParams },
    { module: 'personal', data: personalCommands.map(c => ({ 
        desc: { en: c.desc, es: c.desc }, 
        cmd: c.cmd,
        isPersonal: true
      })), params: [branchNameInput.value, baseBranchInput.value] }
  ].sort((a, b) => favoriteOrder.indexOf(a.module) - favoriteOrder.indexOf(b.module));
  
  let hasFavs = false;
  allData.forEach(lib => {
    const favs = lib.data.filter(item => favorites.includes(item.desc.en));
    if (favs.length > 0) hasFavs = true;
    favs.forEach(item => {
      const card = document.createElement('div');
      card.className = `library-card fav-card-${lib.module} ${item.isPersonal ? 'personal-card' : ''}`;
      
      let finalCmd = '';
      if (item.isPersonal) {
          finalCmd = (item.cmd || "").replace(/{branch}/g, branchNameInput.value).replace(/{base}/g, baseBranchInput.value);
      } else {
          finalCmd = typeof item.cmd === 'function' ? item.cmd(...lib.params) : item.cmd;
      }

      card.innerHTML = `
        <div class="library-card-header">
          <div style="display: flex; flex-direction: column; gap: 4px;">
            <span class="module-badge module-badge-${lib.module}">${lib.module}</span>
            <div class="cmd-desc">${item.desc[currentLang] || item.desc.en}</div>
          </div>
          <div class="card-actions">
            <button class="star-btn active" title="${t.titleRemoveFav || 'Remove'}">
              <i data-lucide="star" fill="currentColor"></i>
            </button>
            <button class="copy-btn-vault" title="${t.btnCopy || 'Copy'}">
              <i data-lucide="copy"></i>
            </button>
          </div>
        </div>
        <div class="cmd-val"><span>${finalCmd}</span></div>
      `;
      
      card.querySelector('.cmd-val').onclick = () => utils.copyToClipboard(finalCmd, card.querySelector('.cmd-val'), t.copied);
      card.querySelector('.copy-btn-vault').onclick = (e) => { 
        e.stopPropagation(); 
        utils.copyToClipboard(finalCmd, card.querySelector('.copy-btn-vault'), t.copied); 
      };
      card.querySelector('.star-btn').onclick = (e) => { 
        e.stopPropagation(); 
        toggleFavorite(item.desc.en); 
      };
      container.appendChild(card);
    });
  });

  if (!hasFavs) {
    container.innerHTML = `
      <div class="empty-state" style="grid-column: 1 / -1; padding: 40px; border: 1px dashed var(--card-border); border-radius: 12px;">
        <i data-lucide="star-off" style="width: 48px; height: 48px; opacity: 0.2; margin-bottom: 10px;"></i>
        <p style="color: var(--text-secondary); font-size: 0.9rem;">${t.txtNoFavs || 'No favorites yet'}</p>
      </div>
    `;
  }
  if (window.lucide) window.lucide.createIcons();
};

// --- THEME & HISTORY ---

const applyPersonalTheme = () => {
  const color = personalThemeColor;
  const rgb = utils.hexToRgb(color);
  if (personalThemeColorInput) {
    personalThemeColorInput.value = color;
  }
  document.documentElement.style.setProperty('--accent-personal', color);
  if (rgb) {
    document.documentElement.style.setProperty('--accent-personal-rgb', rgb);
  }
};

const resetDynamicThemes = () => {
  document.body.style.removeProperty('--accent-primary');
};

const saveToHistory = (title, type) => {
  if (!title) return;
  const existing = taskHistory.findIndex(h => h.title === title);
  if (existing !== -1) taskHistory.splice(existing, 1);
  taskHistory.unshift({ title, type, date: new Date().toISOString() });
  taskHistory = taskHistory.slice(0, 5);
  storage.saveHistory(taskHistory);
  uiRender.renderHistory(taskHistory, loadHistoryItem);
};

const loadHistoryItem = (title, type) => {
  taskTitleInput.value = title;
  currentType = type;
  isManualBranch = isManualCommit = isManualType = true;
  typeButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.type === type));
  updateUI();
};

const deletePersonalCommand = (index) => {
    utils.showConfirm(null, null, () => {
        personalCommands.splice(index, 1);
        storage.savePersonalCommands(personalCommands);
        updateUI();
    }, translations, currentLang);
};

const startEditing = (index) => {
    editingIndex = index;
    const cmd = personalCommands[index];
    const t = translations[currentLang];
    customCmdDescInput.value = cmd.desc;
    customCmdValInput.value = cmd.cmd;
    currentCustomIcon = cmd.icon || 'lock';
    
    iconOpts.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.icon === currentCustomIcon);
    });
    
    addCustomCmdBtn.querySelector('span').textContent = t.btnSaveCommand;
    cancelCustomCmdBtn.style.display = 'flex';
    customCmdDescInput.focus();
};

// Initial Start
applyPersonalTheme();
updateTranslations();
uiRender.renderHistory(taskHistory, loadHistoryItem);
if (window.lucide) window.lucide.createIcons();
