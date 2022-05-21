/* eslint-disable no-unused-vars */
const { dialog } = require("@electron/remote");
/* eslint-enable no-unused-vars */

export function openSaveDialog() {

  return new Promise((resolve, reject) => {
    dialog.showSaveDialog(
    {
      filters: [
        {
          name: "Excel",
          extensions: ["xlsx"]
        }
      ]
    }).then((result) => {

      console.log('saveDialog callback - filename: ' + result.filePath);

      if (result.canceled) reject(); else resolve(result.filePath);
    });
  });

}

export function openErrorDialog(title, message) {

  dialog.showMessageBox({
    type: "error",
    title,
    message
  });

}