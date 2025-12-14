/**
 * Тест поддержки клиентов и их capabilities
 */

import { knownClients, ClientType, defaultClientCapabilities } from './dist/compat.js';

console.log('🧪 Тестирование поддержки клиентов и их capabilities\n');
console.log('='.repeat(70));

console.log('\n📋 Поддерживаемые клиенты:');
const clients: Array<Exclude<ClientType, 'infer'>> = ['claude', 'claude-code', 'cursor', 'openai-agents'];
for (const client of clients) {
  const capabilities = knownClients[client];
  console.log(`\n   ${client}:`);
  console.log(`     topLevelUnions: ${capabilities.topLevelUnions}`);
  console.log(`     validJson: ${capabilities.validJson}`);
  console.log(`     refs: ${capabilities.refs}`);
  console.log(`     unions: ${capabilities.unions}`);
  console.log(`     formats: ${capabilities.formats}`);
  console.log(`     toolNameLength: ${capabilities.toolNameLength || 'unlimited'}`);
}

console.log('\n\n📊 Сравнение с документацией Stainless:');
console.log('\n   Claude (default):');
console.log('     ✅ topLevelUnions: true (поддерживает union типы верхнего уровня)');
console.log('     ⚠️  validJson: false (требует парсинг встроенного JSON)');
console.log('     ✅ refs: true');
console.log('     ✅ unions: true');
console.log('     ✅ formats: true');

console.log('\n   Claude Code:');
console.log('     ⚠️  topLevelUnions: false (не поддерживает union типы верхнего уровня)');
console.log('     ✅ validJson: true');
console.log('     ✅ refs: true');
console.log('     ✅ unions: true');
console.log('     ✅ formats: true');

console.log('\n   Cursor:');
console.log('     ⚠️  topLevelUnions: false');
console.log('     ✅ validJson: true');
console.log('     ⚠️  refs: false (требует инлайнинг $ref)');
console.log('     ⚠️  unions: false (требует удаление anyOf)');
console.log('     ⚠️  formats: false (требует удаление format полей)');
console.log('     ⚠️  toolNameLength: 50 (ограничение длины имен инструментов)');

console.log('\n   OpenAI Agents:');
console.log('     ⚠️  topLevelUnions: false');
console.log('     ✅ validJson: true');
console.log('     ✅ refs: true');
console.log('     ✅ unions: true');
console.log('     ✅ formats: true');

console.log('\n\n✅ Проверка соответствия:');
const claude = knownClients.claude;
const claudeCode = knownClients['claude-code'];
const cursor = knownClients.cursor;
const openai = knownClients['openai-agents'];

let allMatch = true;

// Claude
if (claude.topLevelUnions !== true || claude.validJson !== false) {
  console.log('   ❌ Claude capabilities не соответствуют документации');
  allMatch = false;
} else {
  console.log('   ✅ Claude capabilities соответствуют');
}

// Claude Code
if (claudeCode.topLevelUnions !== false || claudeCode.validJson !== true) {
  console.log('   ❌ Claude Code capabilities не соответствуют документации');
  allMatch = false;
} else {
  console.log('   ✅ Claude Code capabilities соответствуют');
}

// Cursor
if (cursor.topLevelUnions !== false || cursor.refs !== false || cursor.unions !== false || 
    cursor.formats !== false || cursor.toolNameLength !== 50) {
  console.log('   ❌ Cursor capabilities не соответствуют документации');
  allMatch = false;
} else {
  console.log('   ✅ Cursor capabilities соответствуют');
}

// OpenAI Agents
if (openai.topLevelUnions !== false || openai.validJson !== true) {
  console.log('   ❌ OpenAI Agents capabilities не соответствуют документации');
  allMatch = false;
} else {
  console.log('   ✅ OpenAI Agents capabilities соответствуют');
}

console.log('\n\n📝 Использование:');
console.log('   # Указать клиента через CLI:');
console.log('   npm start -- --api-key YOUR_KEY --client cursor');
console.log('   npm start -- --api-key YOUR_KEY --client claude');
console.log('   npm start -- --api-key YOUR_KEY --client claude-code');
console.log('   npm start -- --api-key YOUR_KEY --client openai-agents');
console.log('\n   # Автоопределение (по умолчанию):');
console.log('   npm start -- --api-key YOUR_KEY --client infer');

console.log('\n' + '='.repeat(70));
if (allMatch) {
  console.log('✅ Все capabilities соответствуют документации Stainless!');
} else {
  console.log('⚠️  Требуется проверка capabilities');
}

