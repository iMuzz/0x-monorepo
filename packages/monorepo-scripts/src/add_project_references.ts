import * as fs from 'fs';
import * as _ from 'lodash';
import * as path from 'path';

import { utils } from './utils/utils';

const nonPrefixedPackages = ['0x.js', 'ethereum-types', 'contracts'];
const skipPackages = ['@0xproject/website', '@0xproject/connect', '@0xproject/sra-report'];

const monorepoRootPath = path.join(__dirname, '../../..');
const packages = utils.getPackages(monorepoRootPath);
_.each(packages, pkg => {
    console.log(pkg.packageJson.name);
    const deps = utils.getDependencies(path.join(pkg.location, 'package.json'));
    const depNames = _.keys(deps);
    const internalDeps = _.filter(
        depNames,
        dep =>
            !_.includes(skipPackages, dep) && (dep.startsWith('@0xproject/') || _.includes(nonPrefixedPackages, dep)),
    );
    if (internalDeps.length === 0) {
        return;
    }
    const tsConfigPath = path.join(pkg.location, 'tsconfig.json');
    const tsConfigJson = JSON.parse(fs.readFileSync(tsConfigPath).toString());
    const references = _.map(internalDeps, dep => ({ path: '../' + dep.replace('@0xproject/', '') }));
    tsConfigJson.references = references;
    const tabSize = 4;
    fs.writeFileSync(tsConfigPath, JSON.stringify(tsConfigJson, null, tabSize));
});
