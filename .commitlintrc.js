// .commitlintrc.js
/** @type {import('cz-git').UserConfig} */
module.exports = {
  rules: {
    // @see: https://commitlint.js.org/#/reference-rules
    'scope-max-length': [2, 'always', 50],
    'scope-case': [2, 'always', 'lower-case'],
    'subject-max-length': [2, 'always', 100],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'type-case': [2, 'always', 'lower-case'],
    'type-empty': [2, 'never'],
    'type-enum': [
      2,
      'always',
      [
        'build',
        'chore',
        'ci',
        'docs',
        'feat',
        'fix',
        'perf',
        'refactor',
        'revert',
        'style',
        'test',
      ],
    ],
  },
  prompt: {
    alias: { fd: 'docs: fix typos' },
    messages: {
      type: '选择你要提交的类型 :',
      scope: '选择一个提交范围（可选）:',
      customScope: '请输入自定义的提交范围 :',
      subject: '填写简短精炼的变更描述 :\n',
      confirmCommit: '确认提交或修改commit ?',
    },
    types: [
      {
        value: 'feat',
        name: '✨ feat:       新增功能 | A new feature',
        emoji: ':sparkles:',
      },
      {
        value: 'fix',
        name: '🐛 fix:        修复缺陷 | A bug fix',
        emoji: ':bug:',
      },
      {
        value: 'refactor',
        name: '♻️  refactor:   代码重构 | A code change that neither fixes a bug nor adds a feature',
        emoji: ':recycle:',
      },
      {
        value: 'chore',
        name: '🔨 chore:      其他修改 | Other changes that do not modify src or test files',
        emoji: ':hammer:',
      },
      {
        value: 'style',
        name: '💄 style:      代码格式 | Changes that do not affect the meaning of the code',
        emoji: ':lipstick:',
      },
      {
        value: 'docs',
        name: '📝 docs:       文档更新 | Documentation only changes',
        emoji: ':memo:',
      },
      {
        value: 'build',
        name: '📦️ build:      构建相关 | Changes that affect the build system or external dependencies',
        emoji: ':package:',
      },
      {
        value: 'perf',
        name: '⚡ perf:       性能提升 | A code change that improves performance',
        emoji: ':zap:',
      },
      {
        value: 'test',
        name: '✅ test:       测试相关 | Adding missing tests or correcting existing tests',
        emoji: ':white_check_mark:',
      },
      {
        value: 'ci',
        name: '🎡 ci:         持续集成 | Changes to our CI configuration files and scripts',
        emoji: ':ferris_wheel:',
      },
      {
        value: 'revert',
        name: '⏪️ revert:     回退代码 | Revert to a commit',
        emoji: ':rewind:',
      },
    ],
    useEmoji: true,
    emojiAlign: 'center',
    themeColorCode: '',
    skipQuestions: ['footer', 'footerPrefix', 'body', 'breaking'],
    confirmColorize: true,
    defaultScope: '',
    defaultSubject: '',
  },
};
