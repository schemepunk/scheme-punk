'use strict';

module.exports = {
  hooks: {
    'pre-commit': 'npm run lint',
    'pre-push': 'npm test',
    'commit-msg': 'commitlint -e $HUSKY_GIT_PARAMS'
  }
};
