import Branch from "../../wrapper-classes/branch";
import { repoConfig } from "../config";
import { PreconditionsFailedError } from "../errors";
import { detectStagedChanges, gpExecSync, uncommittedChanges } from "../utils";

function currentBranchPrecondition(): Branch {
  const branch = Branch.getCurrentBranch();
  if (!branch) {
    throw new PreconditionsFailedError(
      `Cannot find current branch. Please ensure you're running this command atop a checked-out branch.`
    );
  }
  if (repoConfig.branchIsIgnored(branch.name)) {
    throw new PreconditionsFailedError(
      [
        `Cannot use graphite atop (${branch.name}) which is explicately ignored in your repo config.`,
        `If you'd like to edit your ignored branches, consider running "gt repo init", or manually editing your ".git/.graphite_repo_config" file.`,
      ].join("\n")
    );
  }
  return branch;
}

function branchExistsPrecondition(branchName: string): void {
  if (!Branch.exists(branchName)) {
    throw new PreconditionsFailedError(
      `Cannot find branch named: (${branchName}).`
    );
  }
}

function uncommittedChangesPrecondition(): void {
  if (uncommittedChanges()) {
    throw new PreconditionsFailedError(
      `Cannot run with uncommitted changes present, please resolve and then retry.`
    );
  }
}

function ensureSomeStagedChangesPrecondition(): void {
  if (!detectStagedChanges()) {
    gpExecSync({ command: `git status`, options: { stdio: "ignore" } });
    throw new PreconditionsFailedError(`Cannot run without staged changes.`);
  }
}

function currentGitRepoPrecondition(): string {
  const repoRootPath = gpExecSync(
    {
      command: `git rev-parse --show-toplevel`,
    },
    () => {
      return Buffer.alloc(0);
    }
  )
    .toString()
    .trim();
  if (!repoRootPath || repoRootPath.length === 0) {
    throw new PreconditionsFailedError("No .git repository found.");
  }
  return repoRootPath;
}

export {
  currentBranchPrecondition,
  branchExistsPrecondition,
  uncommittedChangesPrecondition,
  currentGitRepoPrecondition,
  ensureSomeStagedChangesPrecondition,
};
