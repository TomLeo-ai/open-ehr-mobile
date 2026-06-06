import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

const requiredFiles = [
  'README.md',
  'LICENSE',
  'NOTICE',
  '.gitignore',
  '.env.example',
  'package.json',
  'src/data/mock.ts',
];

const ignoredDirs = new Set(['node_modules', 'dist', 'output', '.git']);
const ignoredFiles = new Set(['handoff.md', 'scripts/verify-open-source.mjs']);
const textExtensions = new Set([
  '.css',
  '.html',
  '.js',
  '.json',
  '.md',
  '.mjs',
  '.ts',
  '.vue',
  '.yml',
  '.yaml',
  '.env',
  '.example',
]);

const forbiddenTerms = [
  'hand-china',
  '汉得',
  'HRC',
  '客户沟通',
  'Blue Morandi',
  '林嘉宜',
  '上海汉得',
  '企业微信',
  'corp',
  'appid',
  'secret',
  'password',
  '新EHR',
  'hrc-front-mobile',
];

const forbiddenPatterns = [
  {
    name: 'local Windows path',
    pattern: /\b[A-Z]:\\[^\s`"']+/g,
  },
  {
    name: 'plain Chinese mobile number',
    pattern: /\b1[3-9]\d{9}\b/g,
  },
  {
    name: 'internal landline',
    pattern: /\b021-\d{4}\s?\d{4}\b/g,
  },
  {
    name: 'non-example email',
    pattern: /\b[A-Z0-9._%+-]+@(?!example\.com\b)[A-Z0-9.-]+\.[A-Z]{2,}\b/gi,
  },
];

const failures = [];

for (const file of requiredFiles) {
  if (!existsSync(join(rootDir, file))) {
    failures.push(`Missing required file: ${file}`);
  }
}

const listFiles = (dir) => {
  const entries = readdirSync(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (ignoredDirs.has(entry.name)) {
      continue;
    }

    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listFiles(fullPath));
      continue;
    }

    files.push(fullPath);
  }

  return files;
};

const getExtension = (file) => {
  if (file.endsWith('.env.example')) {
    return '.env';
  }

  const index = file.lastIndexOf('.');
  return index >= 0 ? file.slice(index) : '';
};

for (const file of listFiles(rootDir)) {
  const rel = relative(rootDir, file).replace(/\\/g, '/');
  if (ignoredFiles.has(rel)) {
    continue;
  }

  if (!textExtensions.has(getExtension(file))) {
    continue;
  }

  const content = readFileSync(file, 'utf8');

  for (const term of forbiddenTerms) {
    if (content.includes(term)) {
      failures.push(`${rel}: forbidden term "${term}"`);
    }
  }

  for (const { name, pattern } of forbiddenPatterns) {
    pattern.lastIndex = 0;
    const matches = content.match(pattern);
    if (matches?.length) {
      failures.push(`${rel}: ${name} (${[...new Set(matches)].slice(0, 3).join(', ')})`);
    }
  }
}

for (const dir of ['node_modules', 'dist', 'output']) {
  const target = join(rootDir, dir);
  if (existsSync(target) && !statSync(target).isDirectory()) {
    failures.push(`${dir} exists but is not a directory`);
  }
}

if (failures.length) {
  console.error(`Open source verification failed with ${failures.length} issue(s):`);
  for (const failure of failures) {
    console.error(`- ${failure}`);
  }
  process.exit(1);
}

console.log('Open source verification passed.');
