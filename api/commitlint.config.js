module.exports = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat',    // Yeni özellik
        'fix',     // Hata düzeltmesi
        'docs',    // Dokümantasyon değişiklikleri
        'style',   // Kod formatı değişiklikleri
        'refactor',// Kod refactoring
        'test',    // Test eklemeleri
        'chore',   // Genel bakım işlemleri
        'perf',    // Performans iyileştirmeleri
        'ci',      // CI yapılandırma değişiklikleri
        'build',   // Build sistemi değişiklikleri
        'revert'   // Commit geri alma
      ]
    ],
    'type-case': [2, 'always', 'lower'],
    'type-empty': [2, 'never'],
    'subject-empty': [2, 'never'],
    'subject-full-stop': [2, 'never', '.'],
    'subject-case': [2, 'always', ['sentence-case']],
    'body-leading-blank': [2, 'always'],
    'footer-leading-blank': [2, 'always']
  }
}; 