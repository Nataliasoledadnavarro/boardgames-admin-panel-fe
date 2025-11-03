const { execSync } = require('child_process');

// Obtener nombre de la rama actual
const branchName = execSync('git rev-parse --abbrev-ref HEAD', {
  encoding: 'utf8',
}).trim();

// Patrón para nombres de rama válidos
const branchPattern = /^(feature|bugfix|hotfix|release|chore)\/[a-z0-9-]+$/;

console.log('🌿 Validando nombre de rama...');

// Permitir ramas principales
const allowedBranches = ['main', 'master', 'develop'];
if (allowedBranches.includes(branchName)) {
  console.log('✅ Rama principal válida');
  process.exit(0);
}

if (!branchPattern.test(branchName)) {
  console.error(`
❌ Nombre de rama inválido: "${branchName}"

Formato esperado: tipo/descripcion-en-kebab-case

Tipos válidos:
- feature/nombre-funcionalidad
- bugfix/descripcion-del-bug
- hotfix/descripcion-urgente
- release/version
- chore/tarea-mantenimiento

Ejemplo: feature/crud-productos
`);
  process.exit(1);
}

console.log('✅ Nombre de rama válido');
