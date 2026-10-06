// Starts an isolated backend. Test edits never touch backend/data/content.json.
import { mkdtemp, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, execFileSync } from 'node:child_process';
const backend = fileURLToPath(new URL('../../backend', import.meta.url));
const dir = await mkdtemp(join(tmpdir(), 'm96-e2e-'));
const env = { ...process.env, GOCACHE: process.env.GOCACHE || join(tmpdir(), 'm96-go-cache') };
execFileSync('go', ['build', '-buildvcs=false', '-o', join(dir, 'server'), './cmd/app'], {
  cwd: backend,
  env,
  stdio: 'inherit',
});
await copyFile(join(backend, 'data/content.json'), join(dir, 'content.json'));
const child = spawn(join(dir, 'server'), {
  env: {
    ...env,
    HTTP_ADDR: '127.0.0.1:18082',
    ADMIN_TOKEN: 'm96-e2e-only-test-token-32-characters',
    DATA_FILE: join(dir, 'content.json'),
    UPLOAD_DIR: join(dir, 'uploads'),
  },
  stdio: 'inherit',
});
for (const signal of ['SIGTERM', 'SIGINT']) process.on(signal, () => child.kill(signal));
child.on('exit', async (code) => {
  await rm(dir, { recursive: true, force: true });
  process.exit(code ?? 0);
});
