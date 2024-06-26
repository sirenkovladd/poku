/* c8 ignore start */ // Multi-platform
import type { Configs } from '../@types/poku.js';
import type { Runner } from '../@types/runner.js';
import { platform } from 'node:process';
import { extname } from 'node:path';
import { getRuntime } from './get-runtime.js';

export const isWindows = platform === 'win32';

export const runner = (filename: string, configs?: Configs): string[] => {
  const runtime = getRuntime(configs);

  // Bun
  if (runtime === 'bun') {
    return ['bun'];
  }

  // Deno
  if (runtime === 'deno') {
    const denoAllow = configs?.deno?.allow
      ? configs.deno.allow
          .map((allow) => (allow ? `--allow-${allow}` : ''))
          .filter((allow) => allow)
      : [
          // Defaults
          '--allow-read', // Poku searches for all test files
          '--allow-env', // Poku share the process.env with the `child_process`
          '--allow-run', // Poku CLI
          '--allow-net', // Create Service
          '--allow-hrtime', // Precise performance execution time
        ];

    const denoDeny = configs?.deno?.deny
      ? configs.deno.deny
          .map((deny) => (deny ? `--deny-${deny}` : ''))
          .filter((deny) => deny)
      : [];

    return ['deno', 'run', ...denoAllow, ...denoDeny];
  }

  // Node.js
  return ['.ts', '.mts', '.cts'].includes(extname(filename))
    ? [isWindows ? 'npx.cmd' : 'npx', 'tsx']
    : ['node'];
};

export const scriptRunner = (runner: Runner): string[] => {
  // Bun
  if (runner === 'bun') {
    return ['bun', 'run'];
  }

  // Deno
  if (runner === 'deno') {
    return ['deno', 'task'];
  }

  // Yarn
  if (runner === 'yarn') {
    return ['yarn'];
  }

  // PNPM
  if (runner === 'pnpm') {
    return ['pnpm', 'run'];
  }

  // Node.js
  return [isWindows ? 'npm.cmd' : 'npm', 'run'];
};
/* c8 ignore stop */
