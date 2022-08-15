import { cuteString } from '../utils/cute_string';
import { runCommand, TRunCommandParameters } from '../utils/run_command';
import { tracer } from '../utils/tracer';

export function runGitCommandAndSplitLines(
  params: Omit<TRunCommandParameters, 'command'> & { resource: string | null }
): string[] {
  return runGitCommand(params)
    .split('\n')
    .filter((l) => l.length > 0);
}

export function runGitCommand(
  params: Omit<TRunCommandParameters, 'command'> & { resource: string | null }
): string {
  // Only measure if we're with an existing span.
  return params.resource && tracer.currentSpanId
    ? tracer.spanSync(
        {
          name: 'spawnedCommand',
          resource: params.resource,
          meta: { runCommandArgs: cuteString(params) },
        },
        () => {
          return runCommand({ command: 'git', ...params });
        }
      )
    : runCommand({ command: 'git', ...params });
}
