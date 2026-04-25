import './style.css'

const taskTitleInput = document.getElementById('task-title');
const typeButtons = document.querySelectorAll('.type-btn');
const outputSection = document.getElementById('output-section');
const branchNameDisplay = document.getElementById('branch-name');
const commandListContainer = document.getElementById('command-list');
const copyBranchBtn = document.getElementById('copy-branch');
const copyAllBtn = document.getElementById('copy-all');
const workflowButtons = document.querySelectorAll('.wf-btn');
const baseBranchGroup = document.getElementById('base-branch-group');
const baseBranchInput = document.getElementById('base-branch');

let currentType = 'feature';
let currentWorkflow = 'new';

const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')     // Replace spaces with -
    .replace(/[^\w-]+/g, '')  // Remove all non-word chars
    .replace(/--+/g, '-');    // Replace multiple - with single -
};

const updateUI = () => {
  const title = taskTitleInput.value.trim();
  
  if (title.length > 0) {
    outputSection.classList.add('visible');
    const slug = slugify(title);
    
    // If input already looks like a branch, don't double prefix
    const branchName = (title.includes('/') || currentWorkflow === 'recreate') 
      ? title 
      : `${currentType}/${slug}`;
      
    branchNameDisplay.textContent = branchName;
    
    renderCommands(branchName, title);
  } else {
    outputSection.classList.remove('visible');
  }
};

const renderCommands = (branch, originalTitle) => {
  const base = baseBranchInput.value || 'dev';
  let commands = [];

  if (currentWorkflow === 'new') {
    commands = [
      { label: 'Create Branch', cmd: `git checkout -b ${branch}` },
      { label: 'Stage Changes', cmd: `git add .` },
      { label: 'Commit Task', cmd: `git commit -m "${currentType}: ${originalTitle}"` },
      { label: 'Push to Origin', cmd: `git push origin ${branch}` }
    ];
  } else {
    commands = [
      { label: 'Exit Branch', cmd: `git checkout ${base}` },
      { label: 'Delete Local', cmd: `git branch -D ${branch}` },
      { label: 'Pull Latest', cmd: `git pull origin ${base}` },
      { label: 'Recreate Branch', cmd: `git checkout -b ${branch}` },
      { label: 'Pro/Team Sync', cmd: `git fetch origin && git checkout -b ${branch} origin/${base}` }
    ];
  }

  commandListContainer.innerHTML = commands.map((c, i) => `
    <div class="command-card">
      <div class="command-info">
        <div style="font-size: 0.7rem; color: var(--text-secondary); margin-bottom: 4px;">${c.label}</div>
        <div class="command-text">${c.cmd}</div>
      </div>
      <button class="copy-btn" onclick="copyToClipboard('${c.cmd}', this)">
        <i data-lucide="copy" style="width: 14px; height: 14px;"></i>
      </button>
    </div>
  `).join('');
  
  if (window.lucide) {
    window.lucide.createIcons();
  }
};

window.copyToClipboard = (text, btn) => {
  navigator.clipboard.writeText(text).then(() => {
    const originalText = btn.textContent;
    btn.textContent = 'Copied!';
    btn.classList.add('copied');
    setTimeout(() => {
      btn.textContent = originalText;
      btn.classList.remove('copied');
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
  copyToClipboard(branchNameDisplay.textContent, copyBranchBtn);
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
      document.querySelectorAll('.input-label')[2].style.display = 'none'; // Task Type label
    } else {
      baseBranchGroup.style.display = 'none';
      document.querySelector('.task-types').style.display = 'flex';
      document.querySelectorAll('.input-label')[2].style.display = 'block';
    }
    
    updateUI();
  });
});

baseBranchInput.addEventListener('input', updateUI);
