module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.github.dreiekk.calcdav',
        productName: 'CalcDAV',
        nsis: {
          artifactName: '${productName}.Setup.${version}.${ext}'
        }
      }
    },
    i18n: {
      locale: 'en',
      fallbackLocale: 'en',
      localeDir: 'locales',
      enableInSFC: true
    }
  }
}
