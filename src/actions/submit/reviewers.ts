import prompts from 'prompts';
import { KilledError } from '../../lib/errors';

export async function getReviewers(
  reviewers: string | undefined
): Promise<string[]> {
  if (typeof reviewers === 'undefined') {
    return [];
  }

  if (reviewers === '') {
    const response = await prompts(
      {
        type: 'list',
        name: 'reviewers',
        message: 'Reviewers (comma-separated GitHub usernames)',
        seperator: ',',
      },
      {
        onCancel: () => {
          throw new KilledError();
        },
      }
    );
    return response.reviewers;
  }

  return reviewers.split(',');
}
