var dav = require('dav');

export function initDav(caldavUrl, username, password) {

    return new Promise((res, rej) => {
        
        try {

            var xhr = new dav.transport.Basic(
                new dav.Credentials({
                  username,
                  password
                })
            );
    
            dav.createAccount({ server: caldavUrl, xhr: xhr })
            .then(function(account) {
                res({ dav, account, xhr });
            })
            .catch((error) => {
                console.error(error);
                rej(error);
            });

        } catch (err) {
            rej(err.message);
        }

    })

}

export function syncCalendar(calendar, xhr) {

    return new Promise((res, rej) => {
        dav.syncCalendar(calendar, {
            xhr: xhr,
        }).then((c) => {
            res(c);
        }).catch((error) => {
            rej(error);
        });
    });

}