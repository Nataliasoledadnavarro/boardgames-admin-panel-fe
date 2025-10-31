const fs = require("fs");

const commitMsg = fs.readFileSync(process.argv[2], "utf8").trim();

// Patrón para commits convencionales
const commitPattern =
  /^(feat|fix|docs|style|refactor|test|chore)(\(.+\))?: .{1,50}/;

console.log("🔍 Validando mensaje de commit...");

if (!commitPattern.test(commitMsg)) {
  console.error(`
❌ Mensaje de commit inválido: "${commitMsg}"

Formato esperado: tipo(scope): descripción

Tipos válidos:
- feat: nueva funcionalidad
- fix: corrección de bugs
- docs: documentación
- style: formato, punto y coma, etc.
- refactor: refactorización de código
- test: agregar tests
- chore: tareas de mantenimiento

Ejemplo: feat(products): agregar CRUD de productos
`);
  process.exit(1);
}

console.log("✅ Mensaje de commit válido");
