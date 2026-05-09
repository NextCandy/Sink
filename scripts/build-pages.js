import { spawnSync } from 'node:child_process'
import { existsSync, rmSync } from 'node:fs'
import { join } from 'node:path'

for (const path of ['dist', '.output', '.nuxt']) {
  rmSync(path, { recursive: true, force: true })
}

const command = process.platform === 'win32'
  ? join('node_modules', '.bin', 'nuxt.cmd')
  : join('node_modules', '.bin', 'nuxt')

if (!existsSync(command)) {
  console.error('Nuxt binary not found. Run pnpm install before building Pages output.')
  process.exit(1)
}

const result = spawnSync(command, ['build'], {
  env: {
    ...process.env,
    NITRO_PRESET: 'cloudflare-pages',
    NODE_OPTIONS: process.env.NODE_OPTIONS || '--max-old-space-size=8192',
  },
  shell: process.platform === 'win32',
  stdio: 'inherit',
})

if (result.error) {
  console.error(result.error)
}

process.exit(result.status ?? 1)
