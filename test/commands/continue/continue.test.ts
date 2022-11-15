import { expect } from 'chai';
import { allScenes } from '../../lib/scenes/all_scenes';
import { configureTest } from '../../lib/utils/configure_test';

for (const scene of allScenes) {
  describe(`(${scene}): continue`, function () {
    configureTest(this, scene);

    it('Can gt continue a git rebase', () => {
      scene.repo.createChange('a');
      scene.repo.runCliCommand([`branch`, `create`, `a`, `-m`, `a`]);

      scene.repo.createChange('b');
      scene.repo.runCliCommand([`branch`, `create`, `b`, `-m`, `b`]);

      scene.repo.checkoutBranch('a');
      scene.repo.createChangeAndCommit('1');

      scene.repo.checkoutBranch('b');
      expect(() => scene.repo.runCliCommand([`continue`])).to.throw();

      // run a git rebase
      scene.repo.runGitCommand([`rebase`, `a`]);
      expect(scene.repo.rebaseInProgress()).to.be.true;
      scene.repo.resolveMergeConflicts();
      scene.repo.markMergeConflictsAsResolved();

      // Continue should finish running the git rebase
      expect(() => scene.repo.runCliCommand([`continue`])).to.not.throw();
      expect(scene.repo.currentBranchName()).to.equal('b');
      expect(scene.repo.rebaseInProgress()).to.be.false;
    });
  });
}
