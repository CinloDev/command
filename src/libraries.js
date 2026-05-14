export const GIT_LIBRARY = [
  { desc: { en: 'Check Status', es: 'Ver Estado (Status)' }, cmd: () => `git status`, tags: 'status check' },
  { desc: { en: 'List local branches', es: 'Listar ramas locales' }, cmd: () => `git branch`, tags: 'branch list' },
  { desc: { en: 'Stash: Save changes', es: 'Stash: Guardar cambios' }, cmd: () => `git stash`, tags: 'stash save' },
  { desc: { en: 'Stash: Pop (apply + remove)', es: 'Stash: Recuperar (pop)' }, cmd: () => `git stash pop`, tags: 'stash pop' },
  { desc: { en: 'Amend: Update last commit', es: 'Amend: Actualizar último commit' }, cmd: () => `git commit --amend --no-edit`, tags: 'amend last commit' },
  { desc: { en: 'Switch to previous branch', es: 'Volver a la rama anterior' }, cmd: () => `git checkout -`, tags: 'checkout switch back' },
  { desc: { en: 'Fetch & Prune', es: 'Sincronizar y limpiar (Prune)' }, cmd: () => `git fetch --all --prune`, tags: 'fetch prune sync' },
  { desc: { en: 'Stage all changes', es: 'Preparar todos los cambios' }, cmd: () => `git add .`, tags: 'add stage' },
  { desc: { en: 'Rebase: Start', es: 'Rebase: Iniciar' }, cmd: (val, base) => `git rebase ${val || base || 'dev'}`, placeholder: 'branch', tags: 'rebase start' },
  { desc: { en: 'Rebase: Continue', es: 'Rebase: Continuar' }, cmd: () => `git rebase --continue`, tags: 'rebase continue' },
  { desc: { en: 'Rebase: Force Push (Lease)', es: 'Rebase: Subida forzada (Lease)' }, cmd: (val, base, branch) => `git push origin ${val || branch || '<branch>'} --force-with-lease`, placeholder: 'branch', tags: 'rebase push force' },
  { desc: { en: 'Interactive Rebase', es: 'Rebase Interactivo' }, cmd: (val) => `git rebase -i ${val || 'HEAD~3'}`, placeholder: 'target', tags: 'rebase interactive' },
  { desc: { en: 'Cherry-pick', es: 'Cherry-pick' }, cmd: (val) => `git cherry-pick ${val || '<hash>'}`, placeholder: 'hash', tags: 'cherry-pick' },
  { desc: { en: 'Checkout Branch', es: 'Ir a rama' }, cmd: (val, base, branch) => `git checkout ${val || branch || '<branch>'}`, placeholder: 'branch', tags: 'checkout branch' },
  { desc: { en: 'Merge branch into current', es: 'Merge de rama a actual' }, cmd: (val, base) => `git merge ${val || base || '<branch>'}`, placeholder: 'branch', tags: 'merge branch' },
  { desc: { en: 'Clean: List dry-run', es: 'Limpiar: Simulacro' }, cmd: () => `git clean -fdn`, tags: 'clean dry' },
  { desc: { en: 'Delete merged local branches', es: 'Borrar ramas locales mergeadas' }, cmd: (val, base) => `git branch --merged ${val || base || 'dev'} | grep -v "\\*" | xargs -n 1 git branch -d`, tags: 'clean branches' },
  { desc: { en: 'Log: Visual Graph', es: 'Log: Gráfico visual' }, cmd: () => `git log --oneline --graph --all`, tags: 'log graph' },
  { desc: { en: 'Log: Search by message', es: 'Log: Buscar por mensaje' }, cmd: (val) => `git log --oneline --grep="${val || 'pattern'}"`, placeholder: 'pattern', tags: 'log search grep' },
  { desc: { en: 'Log: Filter by author', es: 'Log: Filtrar por autor' }, cmd: (val) => `git log --oneline --author="${val || 'name'}"`, placeholder: 'author', tags: 'log author' },
  { desc: { en: 'Push branch to remote', es: 'Subir rama al remoto' }, cmd: (val, base, branch) => `git push origin ${val || branch || '<branch>'}`, tags: 'push remote branch' },
  { desc: { en: 'Push & Track (upstream)', es: 'Subir y Trackear (upstream)' }, cmd: (val, base, branch) => `git push -u origin ${val || branch || '<branch>'}`, tags: 'push remote upstream track' },
  { desc: { en: 'Pull from origin', es: 'Bajar cambios (Pull de origin)' }, cmd: (val, base, branch) => `git pull origin ${val || base || '<branch>'}`, tags: 'pull origin remote sync' }
];

export const NODE_LIBRARY = [
  { desc: { en: 'Clean node_modules', es: 'Borrar node_modules' }, cmd: (mgr) => `rm -rf node_modules ${mgr === 'npm' ? 'package-lock.json' : (mgr === 'yarn' ? 'yarn.lock' : 'pnpm-lock.yaml')}`, tags: 'clean reset' },
  { desc: { en: 'Fresh Install', es: 'Instalación limpia' }, cmd: (mgr) => `${mgr} install`, tags: 'install node' },
  { desc: { en: 'Audit Fix', es: 'Arreglar vulnerabilidades' }, cmd: (mgr) => mgr === 'npm' ? 'npm audit fix' : (mgr === 'pnpm' ? 'pnpm audit --fix' : 'npm audit fix'), tags: 'audit fix' },
  { desc: { en: 'Check versions', es: 'Verificar versiones instaladas' }, cmd: (mgr) => `${mgr} list --depth=0`, tags: 'list versions' },
  { desc: { en: 'Outdated packages', es: 'Paquetes desactualizados' }, cmd: (mgr) => `${mgr} outdated`, tags: 'outdated' },
  { desc: { en: 'Initialize TypeScript', es: 'Inicializar TypeScript' }, cmd: (mgr) => `${mgr === 'pnpm' ? 'pnpm dlx' : (mgr === 'yarn' ? 'yarn dlx' : 'npx')} tsc --init`, tags: 'typescript init' }
];

export const DOCKER_LIBRARY = [
  // Laravel & Cache
  { desc: { en: 'Artisan: Cache Clear', es: 'Artisan: Limpiar Caché' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan cache:clear`, tags: 'laravel artisan cache' },
  { desc: { en: 'Artisan: Route Clear', es: 'Artisan: Limpiar Rutas' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan route:clear`, tags: 'laravel artisan route' },
  { desc: { en: 'Artisan: View Clear', es: 'Artisan: Limpiar Vistas' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan view:clear`, tags: 'laravel artisan view' },
  { desc: { en: 'Artisan: Config Clear', es: 'Artisan: Limpiar Config' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan config:clear`, tags: 'laravel artisan config' },
  { desc: { en: 'Check Email Env', es: 'Ver Envs de Email' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} printenv | grep MAIL_`, tags: 'env mail email' },
  
  // Docker Management
  { desc: { en: 'Restart Service', es: 'Reiniciar Servicio' }, cmd: (f, s) => `docker compose -f ${f} restart ${s}`, tags: 'restart service' },
  { desc: { en: 'Docker: Down', es: 'Docker: Detener y eliminar' }, cmd: (f, s) => `docker compose -f ${f} down`, tags: 'down delete remove' },
  { desc: { en: 'Docker: Up & Build', es: 'Docker: Levantar y construir' }, cmd: (f, s) => `docker compose -f ${f} up -d --build`, tags: 'rebuild build up' },
  { desc: { en: 'Up -d (create and start)', es: 'Levantar docker (background)' }, cmd: (f, s) => `docker compose -f ${f} up -d`, tags: 'up start background' },
  
  // Artisan Standard
  { desc: { en: 'Artisan: Migrate', es: 'Artisan: Correr migraciones' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan migrate`, tags: 'laravel artisan migrate php' },
  { desc: { en: 'Artisan: Migrate Fresh', es: 'Artisan: Resetear DB' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan migrate:fresh`, tags: 'laravel artisan fresh php' },
  { desc: { en: 'Artisan: DB Seed', es: 'Artisan: Cargar seeders' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan db:seed`, tags: 'laravel artisan seed php' },
  { desc: { en: 'Artisan: Tinker', es: 'Artisan: Entrar a Tinker' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} php artisan tinker`, tags: 'laravel artisan tinker php' },
  
  // System
  { desc: { en: 'Interactive shell (bash)', es: 'Entrar al contenedor (bash)' }, cmd: (f, s) => `docker compose -f ${f} exec ${s} bash`, tags: 'exec shell terminal bash' },
  { desc: { en: 'View logs (real-time)', es: 'Ver logs en vivo' }, cmd: (f, s) => `docker compose -f ${f} logs -f ${s}`, tags: 'logs tail follow' },
  { desc: { en: 'Prune everything', es: 'Limpieza profunda del sistema' }, cmd: (f, s) => `docker system prune -a --volumes`, tags: 'prune clean clear delete' }
];
