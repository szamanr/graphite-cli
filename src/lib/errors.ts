import chalk from 'chalk';

class ExitError extends Error {}

export class ExitFailedError extends ExitError {
  constructor(message: string) {
    super(message);
    this.name = 'ExitFailed';
  }
}

export class CommandFailedError extends ExitError {
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

export class RebaseConflictError extends ExitError {
  constructor() {
    super(`Hit a conflict during rebase.`);
    this.name = 'RebaseConflict';
  }
}

export class PreconditionsFailedError extends ExitError {
  constructor(message: string) {
    super(message);
    this.name = 'PreconditionsFailed';
  }
}

export class ConcurrentExecutionError extends ExitError {
  constructor() {
    super(`Cannot run more than one Graphite process at once.`);
    this.name = 'ConcurrentExecutionError';
  }
}

export class UntrackedBranchError extends ExitError {
  constructor(branchName: string) {
    super(
      [
        `Cannot perform this operation on untracked branch ${chalk.yellow(
          branchName
        )}.`,
        `You can track it by specifying its parent with ${chalk.cyan(
          `gt branch track`
        )}.`,
      ].join('\n')
    );
    this.name = 'UntrackedBranchError';
  }
}

export class BadTrunkOperationError extends ExitError {
  constructor() {
    super(`Cannot perform this operation on the trunk branch.`);
    this.name = 'BadTrunkOperationError';
  }
}

export class KilledError extends ExitError {
  constructor() {
    super(`Killed Graphite early.`);
    this.name = 'Killed';
  }
}
