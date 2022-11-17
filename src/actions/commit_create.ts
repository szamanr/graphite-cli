import { TContext } from '../lib/context';
import { SCOPE } from '../lib/engine/scope_spec';
import { ensureSomeStagedChangesPrecondition } from '../lib/preconditions';
import { BlockedDuringRebaseError } from '../lib/errors';
import { restackBranches } from './restack';

export function commitCreateAction(
  opts: {
    addAll: boolean;
    patch: boolean;
    message?: string;
  },
  context: TContext
): void {
  if (context.metaCache.rebaseInProgress()) {
    throw new BlockedDuringRebaseError();
  }

  if (opts.addAll) {
    context.metaCache.addAll();
  }

  ensureSomeStagedChangesPrecondition(context);
  context.metaCache.commit({
    message: opts.message,
    patch: !opts.addAll && opts.patch,
  });

  restackBranches(
    context.metaCache.getRelativeStack(
      context.metaCache.currentBranchPrecondition,
      SCOPE.UPSTACK_EXCLUSIVE
    ),
    context
  );
}
