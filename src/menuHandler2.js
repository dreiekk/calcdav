const remote = require("@electron/remote");
const win = remote.getCurrentWindow();

module.exports = () => {

    document.onreadystatechange = (event) => {
        if (document.readyState == "complete") {
            handleWindowControls();
        }
    };

    function handleWindowControls() {
        document.getElementById('min-button').addEventListener("click", event => {
            win.minimize();
        });

        document.getElementById('max-button').addEventListener("click", event => {
            win.maximize();
        });

        document.getElementById('restore-button').addEventListener("click", event => {
            win.unmaximize();
        });

        document.getElementById('close-button').addEventListener("click", event => {
            console.log('Closing window...');
            win.close();
        });

        // Toggle maximise/restore buttons when maximisation/unmaximisation occurs
        toggleMaxRestoreButtons();
        win.on('maximize', toggleMaxRestoreButtons);
        win.on('unmaximize', toggleMaxRestoreButtons);

        function toggleMaxRestoreButtons() {
            if (win.isMaximized()) {
                document.body.classList.add('maximized');
            } else {
                document.body.classList.remove('maximized');
            }
        }

        win.on('focus', () => {
            document.getElementById('titlebar').classList.remove('not-in-focus');
        });
        
        win.on('blur', () => {
            document.getElementById('titlebar').classList.add('not-in-focus');
        });
    }

}