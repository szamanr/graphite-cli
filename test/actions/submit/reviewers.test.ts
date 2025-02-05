import { expect, use } from 'chai';
import chaiAsPromised from 'chai-as-promised';
import prompts from 'prompts';
import { getReviewers } from '../../../src/actions/submit/reviewers';

use(chaiAsPromised);

describe('reviewers.ts unit tests', function () {
  it('should return empty list when the value of reviewers is undefined', async () => {
    await expect(getReviewers(undefined)).to.eventually.eql([]);
  });

  it('should prompt for reviewers when the value of reviewers is empty', async () => {
    prompts.inject([['user1', 'user2']]);
    await expect(getReviewers('')).to.eventually.eql(['user1', 'user2']);
  });

  it('should parse reviewers when the value of reviewers is a string', async () => {
    await expect(getReviewers('user1,user2')).to.eventually.eql([
      'user1',
      'user2',
    ]);

    // Test can handle extra spaces
    await expect(getReviewers('user3, user4')).to.eventually.eql([
      'user3',
      'user4',
    ]);
  });
});
