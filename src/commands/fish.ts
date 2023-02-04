import fs from 'fs-extra';
import yargs from 'yargs';

import path from 'path';
import { graphiteWithoutRepo } from '../lib/runner';
const args = {} as const;

type argsT = yargs.Arguments<yargs.InferredOptionTypes<typeof args>>;

export const command = 'fish';
export const canonical = 'fish';
export const aliases = ['fish'];
export const description = 'Set up fish tab completion.';
export const builder = args;
export const handler = async (argv: argsT): Promise<void> =>
  graphiteWithoutRepo(argv, canonical, async (context) => {
    context.splog.page(
      fs.readFileSync(path.join(__dirname, '..', 'lib', 'gt.fish'), {
        encoding: 'utf-8',
      })
    );
  });
