import './style.css'

const translations = {
  en: {
    title: 'Command Center',
    subtitleGit: 'Transform tasks into git workflows instantly',
    subtitleNode: 'Manage packages and scripts without memorizing commands',
    subtitleDocker: 'Spin up containers and services with a single click',
    wfNew: 'New Branch',
    wfRecreate: 'Recreate Branch',
    lblTask: 'Task Title / Branch',
    lblBase: 'Base Branch',
    lblType: 'Task Type',
    lblTarget: 'Target Branch',
    lblCommit: 'Commit Message',
    lblWorkflow: 'Workflow Commands',
    btnCopy: 'Copy',
    btnCopySeq: 'Copy Sequence',
    copied: 'Copied!',
    cmdCreate: 'Create Branch',
    cmdStage: 'Stage Changes',
    cmdCommit: 'Commit Task',
    cmdPush: 'Push to Origin',
    cmdExit: 'Exit Branch',
    cmdDelete: 'Delete Local',
    cmdDeleteRemote: 'Delete Remote',
    cmdPull: 'Pull Latest',
    cmdRecreate: 'Recreate Branch',
    cmdPushNew: 'Push Fresh Branch',
    cmdSync: 'Pro/Team Sync',
    manualNotice: 'Manual mode: Task type only affects commit message',
    nodeMgr: 'Package Manager',
    nodeInstall: 'Install Packages',
    nodeType: 'Type',
    nodeQuick: 'Quick NPM Actions',
    nodeOutput: 'Generated Commands',
    dockerImg: 'Image Name',
    dockerPort: 'Ports (Host:Container)',
    dockerCompose: 'Docker Compose',
    dockerQuick: 'Quick Management',
    dockerOutput: 'Generated Commands',
    dockerVault: 'Docker Vault (Cheat Sheet)',
    dockerSearch: 'Search command...',
    dockerService: 'Service Name',
    dockerFile: 'Compose File',
    lblFullPreview: 'Full Workflow Preview',
    lblGitVault: 'Git Vault (Quick Actions)',
    lblNodeVault: 'Node Vault (Toolbox)',
    searchPlaceholder: 'Search commands...',
    warningLong: 'Branch name is quite long!',
    warningChars: 'The branch contains unusual characters.',
    btnReset: 'Reset to auto',
    listView: 'List View',
    terminalView: 'Terminal View',
    typeFeature: 'Feature',
    typeFix: 'Fix',
    typeHotfix: 'Hotfix',
    typeChore: 'Chore',
    typeDocs: 'Docs',
    typeRefactor: 'Refactor'
  },
  es: {
    title: 'Centro de Mandos',
    subtitleGit: 'Transforma tareas en flujos de git al instante',
    subtitleNode: 'Gestiona paquetes y scripts sin memorizar comandos',
    subtitleDocker: 'Levanta contenedores y servicios con un solo clic',
    wfNew: 'Nueva Rama',
    wfRecreate: 'Recrear Rama',
    lblTask: 'Título de Tarea / Rama',
    lblBase: 'Rama Base',
    lblType: 'Tipo de Tarea',
    lblTarget: 'Rama Generada',
    lblCommit: 'Mensaje de Commit',
    lblWorkflow: 'Comandos del Flujo',
    btnCopy: 'Copiar',
    btnCopySeq: 'Copiar Secuencia',
    copied: '¡Copiado!',
    cmdCreate: 'Crear Rama',
    cmdStage: 'Preparar Cambios',
    cmdCommit: 'Confirmar Tarea (Commit)',
    cmdPush: 'Subir a Origin',
    cmdExit: 'Salir de la Rama',
    cmdDelete: 'Borrar Rama Local',
    cmdDeleteRemote: 'Borrar Rama Remota',
    cmdPull: 'Bajar cambios (Pull)',
    cmdRecreate: 'Recrear Rama',
    cmdPushNew: 'Subir nueva rama',
    cmdSync: 'Sincronización Pro',
    manualNotice: 'Modo manual: El tipo de tarea solo afecta al commit',
    nodeMgr: 'Gestor de Paquetes',
    nodeInstall: 'Instalar Paquetes',
    nodeType: 'Tipo',
    nodeQuick: 'Acciones Rápidas NPM',
    nodeOutput: 'Comandos Generados',
    dockerImg: 'Nombre de Imagen',
    dockerPort: 'Puertos (Host:Contenedor)',
    dockerCompose: 'Docker Compose',
    dockerQuick: 'Gestión Rápida',
    dockerOutput: 'Comandos Generados',
    dockerVault: 'Bóveda de Docker (Guía Rápida)',
    dockerSearch: 'Buscar comando...',
    dockerService: 'Nombre del Servicio',
    dockerFile: 'Archivo Compose',
    lblFullPreview: 'Vista Previa del Flujo Completo',
    lblGitVault: 'Bóveda de Git (Acciones Rápidas)',
    lblNodeVault: 'Bóveda de Node (Herramientas)',
    searchPlaceholder: 'Buscar comandos...',
    warningLong: '¡La rama es muy larga!',
    warningChars: 'La rama contiene caracteres inusuales.',
    btnReset: 'Volver a automático',
    listView: 'Vista Lista',
    terminalView: 'Modo Terminal',
    typeFeature: 'Feature',
    typeFix: 'Fix',
    typeHotfix: 'Hotfix',
    typeChore: 'Chore',
    typeDocs: 'Docs',
    typeRefactor: 'Refactor'
  }
};

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'if', 'then', 'else', 'when', 'at', 'from', 'by', 'for', 'with', 'in', 'out', 'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most', 'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than', 'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'to', 'that', 'this', 'these', 'those', 'am', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing',
  'el', 'la', 'los', 'las', 'un', 'una', 'unos', 'unas', 'y', 'o', 'pero', 'con', 'para', 'por', 'de', 'del', 'al', 'en', 'sobre', 'entre', 'hacia', 'hasta', 'desde', 'durante', 'contra', 'que', 'este', 'esta', 'estos', 'estas', 'ese', 'esa', 'esos', 'esas', 'mi', 'tu', 'su', 'mis', 'tus', 'sus', 'como', 'más', 'pero', 'sus', 'le', 'ya', 'este', 'sí', 'porque', 'esta', 'entre', 'cuando', 'muy', 'sin', 'sobre', 'también', 'me', 'hasta', 'hay', 'donde', 'quien', 'desde', 'todo', 'nos', 'durante', 'todos', 'uno', 'les', 'ni', 'contra', 'otros', 'ese', 'eso', 'ante', 'ellos', 'esto', 'mí', 'antes', 'algunos', 'qué', 'unos', 'yo', 'otro', 'otras', 'otra', 'él', 'tanto', 'esa', 'estos', 'mucho', 'quienes', 'nada', 'si'
]);

const TECH_WHITELIST = new Set([
  'api', 'ui', 'ux', 'db', 'auth', 'login', 'url', 'id', 'v1', 'v2', 'css', 'js', 'html', 'json', 'sql', 'rest', 'git', 'fe', 'be',
  'bd', 'servidor', 'server', 'error', 'falla', 'fail', 'inicio', 'sesion', 'token', 'endpoint', 'ruta', 'route', 'modelo', 'model', 'vista', 'view', 'controlador', 'controller',
  'loader', 'componente', 'component', 'modulo', 'module', 'servicio', 'service', 'hook', 'store', 'state', 'reusable'
]);
const ACTION_VERBS = new Set([
  'add', 'fix', 'update', 'remove', 'delete', 'refactor', 'create', 'patch', 'bug', 'error', 'show', 'hide',
  'agregar', 'anadir', 'quitar', 'eliminar', 'borrar', 'corregir', 'arreglar', 'actualizar', 'mejorar', 'crear', 'refactorizar', 'mostrar', 'ocultar',
  'unificar', 'unify', 'reemplazar', 'replace', 'estandarizar', 'standardize', 'migrar', 'migrate', 'implementar', 'implement'
]);

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
let isTerminalMode = false;

let currentType = 'feature';
let currentWorkflow = 'new';
let isManualBranch = false;
let isManualCommit = false;
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
  
  const labels = document.querySelectorAll('.input-label');
  labels[0].textContent = t.lblTask;
  labels[1].textContent = t.lblBase;
  
  // Update Type Buttons
  typeButtons.forEach(btn => {
    const type = btn.dataset.type;
    const key = 'type' + type.charAt(0).toUpperCase() + type.slice(1);
    btn.textContent = t[key] || type;
  });
  
  langBtn.textContent = currentLang.toUpperCase();
  updateUI();
  if (typeof renderDockerLibrary === 'function') renderDockerLibrary();
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
    
    if (!isManualBranch) {
      const generatedBranch = (title.includes('/') || currentWorkflow === 'recreate') 
        ? title 
        : `${currentType}/${slugify(title)}`;
      branchNameInput.value = generatedBranch;
      if (resetBranchBtn) resetBranchBtn.style.display = 'none';
      if (manualNotice) manualNotice.style.display = 'none';
    } else {
      if (resetBranchBtn) resetBranchBtn.style.display = 'flex';
      if (manualNotice) manualNotice.style.display = 'flex';
    }

    if (!isManualCommit) {
      const cleanTitle = title.replace(/\[.*?\]/g, '').replace(/\b(frontend|backend|fe|be|front|back)\b/gi, '').trim();
      const issueMatch = title.match(/#(\d+)/);
      const commitPrefix = issueMatch ? `#${issueMatch[1]} - ` : '';
      commitMsgInput.value = `${currentType}: ${commitPrefix}${cleanTitle}`;
      autoResizeCommit();
    }
    
    // SMART TYPE DETECTION
    if (!isManualBranch && title.length > 3) {
      const detected = detectType(title);
      if (detected !== currentType) {
        currentType = detected;
        typeButtons.forEach(btn => {
          btn.classList.toggle('active', btn.dataset.type === currentType);
        });
      }
    }

    validateBranch(branchNameInput.value);
    renderCommands(branchNameInput.value, commitMsgInput.value);
  } else {
    outputSection.classList.remove('visible');
    isManualBranch = false;
    isManualCommit = false;
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
  const sanitized = branchNameInput.value
    .replace(/\s+/g, '-')
    .replace(/[^\w\d\/\-._]/g, '');
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
        { label: t.cmdStage || 'Stage', cmd: `git add .` },
        { label: t.cmdCommit || 'Commit', cmd: `git commit -m "${safeCommit}"` },
        { label: t.cmdPush || 'Push', cmd: `git push origin ${safeBranch}` }
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

// LIBRARIES (VAULTS)
const GIT_LIBRARY = [
  { desc: { en: 'Stash: Save changes', es: 'Stash: Guardar cambios' }, cmd: () => `git stash`, tags: 'stash save' },
  { desc: { en: 'Stash: Pop (apply + remove)', es: 'Stash: Recuperar (pop)' }, cmd: () => `git stash pop`, tags: 'stash pop' },
  { desc: { en: 'Interactive Rebase (3)', es: 'Rebase Interactivo (3)' }, cmd: () => `git rebase -i HEAD~3`, tags: 'rebase interactive' },
  { desc: { en: 'Cherry-pick', es: 'Cherry-pick' }, cmd: () => `git cherry-pick <hash>`, tags: 'cherry-pick' },
  { desc: { en: 'Clean: List dry-run', es: 'Limpiar: Simulacro' }, cmd: () => `git clean -fdn`, tags: 'clean dry' },
  { desc: { en: 'Delete merged local branches', es: 'Borrar ramas locales mergeadas' }, cmd: () => `git branch --merged | grep -v "\\*" | xargs -n 1 git branch -d`, tags: 'clean branches' }
];

const NODE_LIBRARY = [
  { desc: { en: 'Deep Clean (node_modules)', es: 'Limpieza profunda (node_modules)' }, cmd: () => `rm -rf node_modules package-lock.json && npm install`, tags: 'clean reset' },
  { desc: { en: 'NPM Audit Fix', es: 'Arreglar vulnerabilidades' }, cmd: () => `npm audit fix`, tags: 'audit fix' },
  { desc: { en: 'Check versions', es: 'Verificar versiones instaladas' }, cmd: () => `npm list --depth=0`, tags: 'list versions' },
  { desc: { en: 'Outdated packages', es: 'Paquetes desactualizados' }, cmd: () => `npm outdated`, tags: 'outdated' },
  { desc: { en: 'Initialize TypeScript', es: 'Inicializar TypeScript' }, cmd: () => `npx tsc --init`, tags: 'typescript init' }
];

const renderLibrary = (module, data, containerId, query = '') => {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  const filtered = data.filter(item => {
    const q = query.toLowerCase();
    return item.desc.en.toLowerCase().includes(q) || 
           item.desc.es.toLowerCase().includes(q) || 
           item.cmd().toLowerCase().includes(q) || 
           (item.tags && item.tags.toLowerCase().includes(q));
  });

  container.innerHTML = filtered.map(item => {
    const finalCmd = item.cmd();
    return `
      <div class="library-card">
        <div class="cmd-desc">${item.desc[currentLang]}</div>
        <div class="cmd-val" onclick="copyToClipboard('${finalCmd}', this)">
          <span>${finalCmd.length > 35 ? finalCmd.substring(0, 32) + '...' : finalCmd}</span>
          <i data-lucide="copy" style="width: 12px; height: 12px;"></i>
        </div>
      </div>
    `;
  }).join('');
  if (window.lucide) window.lucide.createIcons();
};

workflowButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    workflowButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentWorkflow = btn.dataset.wf;
    
    if (currentWorkflow === 'recreate') {
      baseBranchGroup.style.display = 'block';
      document.querySelector('.task-types').style.display = 'none';
      document.getElementById('lbl-task-type').style.display = 'none';
    } else {
      baseBranchGroup.style.display = 'block';
      document.querySelector('.task-types').style.display = 'flex';
      document.getElementById('lbl-task-type').style.display = 'block';
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
    updateTranslations();
    
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

// DOCKER LIBRARY DATA (Templates)
const DOCKER_LIBRARY = [
  // Laravel & Cache
  { desc: { en: 'Artisan: Clear ALL Cache', es: 'Artisan: Limpiar TODA la caché' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan config:clear && docker compose -f ${f} exec ${s} php artisan cache:clear && docker compose -f ${f} exec ${s} php artisan route:clear && docker compose -f ${f} exec ${s} php artisan view:clear`, tags: 'laravel artisan cache clear' },
  { desc: { en: 'Artisan: Config Clear', es: 'Artisan: Limpiar Config' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan config:clear`, tags: 'laravel artisan config' },
  { desc: { en: 'Check Email Env', es: 'Ver Envs de Email' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} printenv | grep MAIL_`, tags: 'env mail email' },
  
  // Docker Management
  { desc: { en: 'Restart Service', es: 'Reiniciar Servicio' }, cmd: (f, s) => `docker compose -f ${f} restart ${s}`, tags: 'restart service' },
  { desc: { en: 'Rebuild & Up', es: 'Reconstruir y Levantar' }, cmd: (f, s) => `docker compose -f ${f} down && docker compose -f ${f} up -d --build`, tags: 'rebuild build up' },
  { desc: { en: 'Down (delete containers/networks)', es: 'Bajar docker (elimina todo)' }, cmd: (f, s) => `docker compose -f ${f} down`, tags: 'down delete remove' },
  { desc: { en: 'Up -d (create and start)', es: 'Levantar docker (background)' }, cmd: (f, s) => `docker compose -f ${f} up -d`, tags: 'up start background' },
  
  // Artisan Standard
  { desc: { en: 'Artisan: Migrate', es: 'Artisan: Correr migraciones' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan migrate`, tags: 'laravel artisan migrate php' },
  { desc: { en: 'Artisan: Fresh + Seed', es: 'Artisan: Reset completo + Seed' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan migrate:fresh --seed`, tags: 'laravel artisan fresh seed php' },
  { desc: { en: 'Artisan: DB Seed', es: 'Artisan: Cargar seeders' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan db:seed`, tags: 'laravel artisan seed php' },
  { desc: { en: 'Artisan: Tinker', es: 'Artisan: Entrar a Tinker' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan tinker`, tags: 'laravel artisan tinker php' },
  
  // System
  { desc: { en: 'Interactive shell (bash)', es: 'Entrar al contenedor (bash)' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} bash`, tags: 'exec shell terminal bash' },
  { desc: { en: 'View logs (real-time)', es: 'Ver logs en vivo' }, cmd: (f, s) => `docker compose -f ${f} logs -f ${s}`, tags: 'logs tail follow' },
  { desc: { en: 'Prune everything', es: 'Limpieza profunda del sistema' }, cmd: (f, s) => `docker system prune -a --volumes`, tags: 'prune clean clear delete' }
];

const renderDockerLibrary = (filter = '') => {
  if (!dockerLibraryGrid) return;
  const file = dockerFileInput?.value?.trim() || 'docker-compose.dev.yml';
  const svc = dockerServiceInput?.value?.trim() || 'api';

  const filtered = DOCKER_LIBRARY.filter(item => 
    item.desc.en.toLowerCase().includes(filter.toLowerCase()) || 
    item.desc.es.toLowerCase().includes(filter.toLowerCase()) || 
    item.tags.toLowerCase().includes(filter.toLowerCase())
  );

  dockerLibraryGrid.innerHTML = filtered.map(item => {
    const finalCmd = typeof item.cmd === 'function' ? item.cmd(file, svc) : item.cmd;
    return `
      <div class="library-card">
        <div class="cmd-desc">${item.desc[currentLang]}</div>
        <div class="cmd-val" onclick="copyToClipboard('${finalCmd}', this)">
          <span>${finalCmd.length > 35 ? finalCmd.substring(0, 32) + '...' : finalCmd}</span>
          <i data-lucide="copy" style="width: 12px; height: 12px;"></i>
        </div>
      </div>
    `;
  }).join('');
  if (window.lucide) window.lucide.createIcons();
};

// Initial Library Render
renderDockerLibrary();
renderLibrary('git', GIT_LIBRARY, 'git-library-grid');
renderLibrary('node', NODE_LIBRARY, 'node-library-grid');
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
