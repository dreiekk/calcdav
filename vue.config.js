module.exports = {
  pluginOptions: {
    electronBuilder: {
      preload: 'src/preload.js',
      // Or, for multiple preload files:
      // preload: { preload: 'src/preload.js' },
      nodeIntegration: true,
      builderOptions: {
        appId: "com.github.dreiekk.calcdav",
        productName: "CalcDAV",
        // copyright: "Copyright © 2020 ${author}",
        nsis: {
          artifactName: "${productName}.Setup.${version}.${ext}"
        }
      }
    }
  }
}