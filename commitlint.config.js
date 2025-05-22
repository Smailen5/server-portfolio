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
        'style', // 💄 Stile
        'refactor', // ♻️ Refactoring
        'perf', // ⚡ Performance
        'test', // ✅ Test
        'build', // 👷 Build
        'ci', // 🔧 CI
        'chore', // 🧹 Chore
        'revert', // ⏪ Revert
      ],
    ],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'header-max-length': [2, 'always', 72],
    'body-max-line-length': [2, 'always', 150],
  },
};
