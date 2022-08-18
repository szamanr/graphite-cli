import { spawnSync, SpawnSyncOptions } from 'child_process';

export type TRunCommandParameters = {
  command: string;
  args: string[];
  options?: Omit<SpawnSyncOptions, 'encoding' | 'maxBuffer'>;
  onError: 'throw' | 'ignore';
};

export function runCommand(params: TRunCommandParameters): string {
  const spawnSyncOutput = spawnSync(params.command, params.args, {
    ...params.options,
    encoding: 'utf-8',
    // 1MB should be enough to never have to worry about this
    maxBuffer: 1024 * 1024 * 1024,
  });

  // this is a syscall failure, not a command failure
  if (spawnSyncOutput.error) {
    throw spawnSyncOutput.error;
  }

  // if killed with a signal
  if (spawnSyncOutput.signal) {
    throw new CommandKilledError({
      command: params.command,
      args: params.args,
      signal: spawnSyncOutput.signal,
      stdout: spawnSyncOutput.stdout,
      stderr: spawnSyncOutput.stderr,
    });
  }

  // command succeeded, return output
  if (!spawnSyncOutput.status) {
    return spawnSyncOutput.stdout?.trim() || '';
  }

  // command failed but we ignore it
  if (params.onError === 'ignore') {
    return '';
  }

  throw new CommandFailedError({
    command: params.command,
    args: params.args,
    status: spawnSyncOutput.status,
    stdout: spawnSyncOutput.stdout,
    stderr: spawnSyncOutput.stderr,
  });
}

export class CommandFailedError extends Error {
  constructor(failure: {
    command: string;
    args: string[];
    status: number;
    stdout: string;
    stderr: string;
  }) {
    super(
      [
        `Command failed with exit code ${failure.status}:`,
        [failure.command].concat(failure.args).join(' '),
        failure.stdout,
        failure.stderr,
      ].join('\n')
    );
    this.name = 'CommandFailed';
  }
}

export class CommandKilledError extends Error {
  constructor(failure: {
    command: string;
    args: string[];
    signal: string;
    stdout: string;
    stderr: string;
  }) {
    super(
      [
        `Command killed with signal ${failure.signal}:`,
        [failure.command].concat(failure.args).join(' '),
        failure.stdout,
        failure.stderr,
      ].join('\n')
    );
    this.name = 'CommandKilled';
  }
}
