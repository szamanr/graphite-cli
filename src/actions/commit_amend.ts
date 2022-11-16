import { TContext } from '../lib/context';
import { SCOPE } from '../lib/engine/scope_spec';
import { PreconditionsFailedError } from '../lib/errors';
import { restackBranches } from './restack';

export function commitAmendAction(
  opts: {
    addAll: boolean;
    message?: string;
    noEdit: boolean;
    patch: boolean;
  },
  context: TContext
): void {
  if (
    context.metaCache.isBranchEmpty(context.metaCache.currentBranchPrecondition)
  ) {
    throw new PreconditionsFailedError('No commits in this branch to amend');
  }

  if (opts.addAll) {
    context.metaCache.addAll();
  }

  context.metaCache.commit({
    amend: true,
    noEdit: opts.noEdit,
    message: opts.message,
    patch: !opts.addAll && opts.patch,
  });

  if (!opts.noEdit) {
    context.splog.tip(
      'In the future, you can skip editing the commit message with the `--no-edit` flag.'
    );
  }

  restackBranches(
    context.metaCache.getRelativeStack(
      context.metaCache.currentBranchPrecondition,
      SCOPE.UPSTACK_EXCLUSIVE
    ),
    context
  );
}
