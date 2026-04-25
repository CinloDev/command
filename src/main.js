import './style.css'

const translations = {
  en: {
    title: 'Command Center',
    subtitle: 'Transform tasks into git workflows instantly',
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
    dockerFile: 'Compose File'
  },
  es: {
    title: 'Centro de Mandos',
    subtitle: 'Transforma tareas en flujos de git al instante',
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
    cmdDelete: 'Borrar Local',
    cmdDeleteRemote: 'Borrar en Remoto',
    cmdPull: 'Bajar lo último',
    cmdRecreate: 'Recrear Rama',
    cmdPushNew: 'Subir Rama Limpia',
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
    dockerFile: 'Archivo Compose'
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

let currentType = 'feature';
let currentWorkflow = 'new';
let isManualBranch = false;
let isManualCommit = false;

const updateTranslations = () => {
  const t = translations[currentLang];
  document.getElementById('txt-title').textContent = t.title;
  document.getElementById('txt-subtitle').textContent = t.subtitle;
  document.getElementById('btn-wf-new').textContent = t.wfNew;
  document.getElementById('btn-wf-recreate').textContent = t.wfRecreate;
  document.getElementById('lbl-task-type').textContent = t.lblType;
  document.getElementById('lbl-target-branch').textContent = t.lblTarget;
  document.getElementById('lbl-commit-msg').textContent = t.lblCommit;
  document.getElementById('lbl-workflow-cmds').textContent = t.lblWorkflow;
  document.getElementById('copy-branch').textContent = t.btnCopy;
  document.getElementById('copy-all').textContent = t.btnCopySeq;
  manualNotice.textContent = t.manualNotice;

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
  document.getElementById('docker-search').placeholder = t.dockerSearch;
  
  const labels = document.querySelectorAll('.input-label');
  labels[0].textContent = t.lblTask;
  labels[1].textContent = t.lblBase;
  
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
      resetBranchBtn.style.display = 'none';
      manualNotice.style.display = 'none';
    } else {
      resetBranchBtn.style.display = 'flex';
      manualNotice.style.display = 'flex';
    }

    if (!isManualCommit) {
      const cleanTitle = title.replace(/\[.*?\]/g, '').replace(/\b(frontend|backend|fe|be|front|back)\b/gi, '').trim();
      const issueMatch = title.match(/#(\d+)/);
      const commitPrefix = issueMatch ? `#${issueMatch[1]} - ` : '';
      commitMsgInput.value = `${currentType}: ${commitPrefix}${cleanTitle}`;
      autoResizeCommit();
    }
    
    renderCommands(branchNameInput.value, commitMsgInput.value);
  } else {
    outputSection.classList.remove('visible');
    isManualBranch = false;
    isManualCommit = false;
    resetBranchBtn.style.display = 'none';
    manualNotice.style.display = 'none';
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
  const base = baseBranchInput.value.trim();
  const t = translations[currentLang];
  
  let commands = [];
  if (currentWorkflow === 'new') {
    if (base && base.toLowerCase() !== 'current') {
      commands.push({ label: t.cmdExit, cmd: `git checkout ${base} && git pull origin ${base}` });
    }
    commands.push(
      { label: t.cmdCreate, cmd: `git checkout -b ${branch}` },
      { label: t.cmdStage, cmd: `git add .` },
      { label: t.cmdCommit, cmd: `git commit -m "${commitMsg}"` },
      { label: t.cmdPush, cmd: `git push origin ${branch}` }
    );
  } else {
    commands = [
      { label: t.cmdExit, cmd: `git checkout ${base || 'dev'}` },
      { label: t.cmdDelete, cmd: `git branch -D ${branch}` },
      { label: t.cmdDeleteRemote, cmd: `git push origin --delete ${branch}` },
      { label: t.cmdPull, cmd: `git pull origin ${base || 'dev'}` },
      { label: t.cmdRecreate, cmd: `git checkout -b ${branch}` },
      { label: t.cmdPushNew, cmd: `git push origin ${branch}` }
    ];
  }

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
  if (window.lucide) window.lucide.createIcons();
};

window.copyToClipboard = (text, btn) => {
  navigator.clipboard.writeText(text).then(() => {
    const t = translations[currentLang];
    const originalContent = btn.innerHTML;
    btn.textContent = t.copied;
    btn.classList.add('copied');
    setTimeout(() => {
      btn.innerHTML = originalContent;
      btn.classList.remove('copied');
      if (window.lucide) window.lucide.createIcons();
    }, 2000);
  });
};

taskTitleInput.addEventListener('input', updateUI);
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    typeButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    currentType = btn.dataset.type;
    updateUI();
  });
});

copyBranchBtn.addEventListener('click', () => {
  copyToClipboard(branchNameInput.value, copyBranchBtn);
});

copyAllBtn.addEventListener('click', () => {
  const allCmds = Array.from(document.querySelectorAll('.command-text'))
    .map(el => el.textContent)
    .join(' && ');
  copyToClipboard(allCmds, copyAllBtn);
});

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
    
    // Update Nav
    navItems.forEach(n => n.classList.remove('active'));
    item.classList.add('active');
    
    // Update Content
    moduleContents.forEach(m => m.classList.remove('active'));
    document.getElementById(`module-${module}`).classList.add('active');
    
    // Update Theme
    document.body.className = module === 'git' ? '' : `theme-${module}`;
    
    // Re-render icons if needed
    if (window.lucide) window.lucide.createIcons();
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
const dockerImgInput = document.getElementById('docker-img-input');
const dockerPortInput = document.getElementById('docker-port-input');
const dockerServiceInput = document.getElementById('docker-service-input');
const dockerFileInput = document.getElementById('docker-file-input');
const dockerActionBtns = document.querySelectorAll('.docker-action-btn');
const dockerCommandList = document.getElementById('docker-command-list');
const dockerOutput = document.getElementById('docker-output');

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
  // Compose Basics
  { desc: { en: 'Stop containers (keep them)', es: 'Parar contenedores (sin borrarlos)' }, cmd: (f, s) => `docker compose -f ${f} stop`, tags: 'stop compose pause' },
  { desc: { en: 'Start existing containers', es: 'Iniciar contenedores detenidos' }, cmd: (f, s) => `docker compose -f ${f} start`, tags: 'start compose' },
  { desc: { en: 'Down (delete containers/networks)', es: 'Bajar docker (elimina todo)' }, cmd: (f, s) => `docker compose -f ${f} down`, tags: 'down delete remove' },
  { desc: { en: 'Up -d (create and start)', es: 'Levantar docker (background)' }, cmd: (f, s) => `docker compose -f ${f} up -d`, tags: 'up start background' },
  
  // Laravel / Artisan (Your notes)
  { desc: { en: 'Artisan: Migrate', es: 'Artisan: Correr migraciones' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan migrate`, tags: 'laravel artisan migrate php' },
  { desc: { en: 'Artisan: Fresh + Seed', es: 'Artisan: Reset completo + Seed' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan migrate:fresh --seed`, tags: 'laravel artisan fresh seed php' },
  { desc: { en: 'Artisan: DB Seed', es: 'Artisan: Cargar seeders' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan db:seed`, tags: 'laravel artisan seed php' },
  { desc: { en: 'Artisan: Tinker', es: 'Artisan: Entrar a Tinker' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan tinker`, tags: 'laravel artisan tinker php' },
  { desc: { en: 'Artisan: Make Seeder', es: 'Artisan: Crear nuevo seeder' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan make:seeder NewSeeder`, tags: 'laravel artisan make seeder php' },
  { desc: { en: 'Artisan: List Routes', es: 'Artisan: Listar rutas' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan route:list`, tags: 'laravel artisan route list' },
  
  // System
  { desc: { en: 'Check if Docker is active', es: 'Verificar si Docker está activo' }, cmd: (f, s) => `docker info`, tags: 'info status check' },
  { desc: { en: 'List active containers', es: 'Listar contenedores activos' }, cmd: (f, s) => `docker ps`, tags: 'ps list active' },
  { desc: { en: 'Interactive shell (bash)', es: 'Entrar al contenedor (bash)' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} bash`, tags: 'exec shell terminal bash' },
  { desc: { en: 'View logs (real-time)', es: 'Ver logs en vivo' }, cmd: (f, s) => `docker compose -f ${f} logs -f ${s}`, tags: 'logs tail follow' },
  { desc: { en: 'Prune everything', es: 'Limpieza profunda del sistema' }, cmd: (f, s) => `docker system prune -a --volumes`, tags: 'prune clean clear delete' }
];

const dockerSearchInput = document.getElementById('docker-search');
const dockerLibraryGrid = document.getElementById('docker-library-grid');

const renderDockerLibrary = (filter = '') => {
  const file = dockerFileInput.value.trim() || 'docker-compose.dev.yml';
  const svc = dockerServiceInput.value.trim() || 'api';

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

dockerSearchInput.addEventListener('input', (e) => {
  renderDockerLibrary(e.target.value);
});

// Initial Library Render
renderDockerLibrary();

updateTranslations();
