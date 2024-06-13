const fs = require('fs');
const path = require('path');
const exec = require('child_process').execSync;

const packagePath = path.resolve(__dirname, 'package.json');
const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

if (/\d+.\d+.\d+/.test(packageJson.version)) { // 格式符合要求
  const isMaster = exec('git branch').toString('utf8').includes('* master');

  if (isMaster) { // 是master分支
    const commitId = exec('git rev-parse HEAD').toString('utf8');
    const hasUnCommited = !!exec('git status --porcelain').toString('utf8').replace('M package.json', '').replace(/\s/g, '');

    if (commitId && (packageJson.commitId !== commitId || hasUnCommited)) { // commitId有更新 或 内容有变化
      packageJson.version = packageJson.version.replace(/(?<=\d+.\d+.)(\d+)\1*/, $1 => `${Number($1) + 1}`.padStart(3, '0'));
      packageJson.commitId = commitId;

      fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2)); // 写入更新后的内容到文件
    }
  } else {
    throw new Error('请切换至主分支进行打包');
  }
}
