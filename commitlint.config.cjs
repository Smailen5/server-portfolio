module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // ✨ Nuove funzionalità
        'fix', // 🐛 Bug fix
        'docs', // 📝 Documentazione
        'refactor', // ♻️ Refactoring
        'perf', // ⚡ Performance
        'test', // ✅ Test
        'build', // 👷 Build
        'ci', // 🔧 CI
        'chore', // 🧹 Chore
      ],
    ],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 42],
    'body-leading-blank': [2, 'always'],
    'body-max-line-length': [2, 'always', 180],
  },
};
