import { execFileSync } from 'node:child_process';
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = fileURLToPath(new URL('..', import.meta.url));

const requiredFiles = [
  'README.md',
  'CONTRIBUTING.md',
  'SECURITY.md',
  'LICENSE',
  'NOTICE',
  '.gitignore',
  '.env.example',
  'package.json',
  'docs/product-strategy.md',
  'docs/architecture.md',
  'docs/demo-flows.md',
  'docs/assets/open-ehr-mobile-home.png',
  'docs/assets/open-ehr-mobile-apply.png',
  'docs/assets/open-ehr-mobile-approval.png',
  'docs/assets/open-ehr-mobile-self-service.png',
  'public/favicon.svg',
  'src/data/mock.ts',
];

const ignoredDirs = new Set(['node_modules', 'dist', 'output', '.git']);
const ignoredFiles = new Set(['handoff.md', 'scripts/verify-open-source.mjs']);
const forbiddenTrackedPaths = ['node_modules', 'dist', 'output', 'handoff.md'];
const forbiddenTrackedFilePatterns = [
  { name: 'local log file', pattern: /(^|\/)(?:npm-debug\.log.*|yarn-error\.log.*|.*\.log)$/i },
  { name: 'local handoff or notes file', pattern: /(^|\/).*\.local\.md$/i },
];
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

const forbiddenTermChecks = [
  { term: 'hand-china', pattern: /hand-china/i },
  { term: '汉得', pattern: /汉得/i },
  { term: 'HRC', pattern: /\bHRC\b/i },
  { term: '客户沟通', pattern: /客户沟通/i },
  { term: 'Blue Morandi', pattern: /Blue Morandi/i },
  { term: '林嘉宜', pattern: /林嘉宜/i },
  { term: '上海汉得', pattern: /上海汉得/i },
  { term: '企业微信', pattern: /企业微信/i },
  { term: 'corp', pattern: /\bcorp(?:[_-]?id)?\b/i },
  { term: 'appid', pattern: /\bapp[_-]?id\b/i },
  { term: 'secret', pattern: /\bsecret(?:[_-]?key)?\b/i },
  { term: 'password', pattern: /\bpassword\b/i },
  { term: '新EHR', pattern: /新EHR/i },
  { term: 'hrc-front-mobile', pattern: /hrc-front-mobile/i },
];

const allowedTermRules = {
  企业微信: {
    files: new Set(['README.md']),
    pattern: /(不连接真实企业微信|不接入真实企业微信|不接真实企业微信|无真实企业微信)/,
  },
};

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
  {
    name: 'plain Chinese resident ID number',
    pattern: /\b[1-9]\d{5}(?:19|20)\d{2}(?:0[1-9]|1[0-2])(?:0[1-9]|[12]\d|3[01])\d{3}[\dXx]\b/g,
  },
  {
    name: 'plain bank card number',
    pattern: /\b(?:\d[ -]?){15,18}\d\b/g,
  },
  {
    name: 'private key block',
    pattern: /-----BEGIN (?:RSA |EC |OPENSSH |DSA )?PRIVATE KEY-----/g,
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

const isAllowedTermUsage = (term, rel, contentLine) => {
  const rule = allowedTermRules[term];
  return Boolean(rule?.files.has(rel) && rule.pattern.test(contentLine));
};

const verifyReadmeImages = () => {
  const readme = readFileSync(join(rootDir, 'README.md'), 'utf8');
  const markdownImagePattern = /!\[[^\]]*]\(([^)]+)\)/g;

  for (const match of readme.matchAll(markdownImagePattern)) {
    const rawTarget = match[1].trim();

    if (/^(https?:|data:|#)/i.test(rawTarget)) {
      continue;
    }

    const target = rawTarget.replace(/^\.?\//, '').replace(/\\/g, '/');

    if (target.startsWith('output/')) {
      failures.push(`README.md: image must not reference ignored output directory (${rawTarget})`);
      continue;
    }

    if (!existsSync(join(rootDir, target))) {
      failures.push(`README.md: missing image asset (${rawTarget})`);
    }
  }
};

const verifyForbiddenTrackedPaths = () => {
  if (!existsSync(join(rootDir, '.git'))) {
    return;
  }

  let trackedFiles;
  try {
    trackedFiles = execFileSync('git', ['ls-files', '-z'], {
      cwd: rootDir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    })
      .split('\0')
      .filter(Boolean);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    failures.push(`Unable to inspect git tracked files: ${message}`);
    return;
  }

  for (const forbiddenPath of forbiddenTrackedPaths) {
    const trackedMatches = trackedFiles.filter(
      (file) => file === forbiddenPath || file.startsWith(`${forbiddenPath}/`),
    );

    if (trackedMatches.length) {
      failures.push(
        `${forbiddenPath}: must not be tracked by git (${trackedMatches.slice(0, 3).join(', ')})`,
      );
    }
  }

  for (const file of trackedFiles) {
    for (const { name, pattern } of forbiddenTrackedFilePatterns) {
      pattern.lastIndex = 0;
      if (pattern.test(file)) {
        failures.push(`${file}: forbidden tracked file type (${name})`);
      }
    }
  }
};

verifyReadmeImages();
verifyForbiddenTrackedPaths();

for (const file of listFiles(rootDir)) {
  const rel = relative(rootDir, file).replace(/\\/g, '/');
  if (ignoredFiles.has(rel)) {
    continue;
  }

  if (!textExtensions.has(getExtension(file))) {
    continue;
  }

  const content = readFileSync(file, 'utf8');

  for (const { term, pattern } of forbiddenTermChecks) {
    const lines = content.split(/\r?\n/);
    lines.forEach((line, index) => {
      pattern.lastIndex = 0;
      if (pattern.test(line) && !isAllowedTermUsage(term, rel, line)) {
        failures.push(`${rel}:${index + 1}: forbidden term "${term}"`);
      }
    });
  }

  for (const { name, pattern } of forbiddenPatterns) {
    pattern.lastIndex = 0;
    const matches = content.match(pattern);
    if (!matches?.length) {
      continue;
    }

    failures.push(`${rel}: ${name} (${[...new Set(matches)].slice(0, 3).join(', ')})`);
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
