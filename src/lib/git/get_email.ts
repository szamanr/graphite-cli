import { runGitCommand } from './runner';

export function getUserEmail(): string {
  return runGitCommand({
    args: [`config`, `user.email`],
    onError: 'ignore',
    resource: 'getUserEmail',
  });
}
