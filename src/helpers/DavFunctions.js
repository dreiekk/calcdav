var dav = require('dav');
// const ical = require('ical');
// const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

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
                    // account.calendars.forEach(function(calendar) {
                    // console.log('Found calendar named ' + calendar.displayName);
    
    
                    // // if (calendar.displayName == 'Kalender') {
    
                    // //     console.log(calendar.objects);
    
                    // //     dav.syncCalendar(calendar, {
                    // //         xhr: xhr,
                    // //     }).then((c) => {
                    // //         c.objects.forEach((obj) => {
                    // //             console.log(obj.data);
    
                    // //             let data = ical.parseICS(obj.data.props.calendarData);
                                
                    // //             console.log(data);
    
                    // //             for (let k in data) {
                    // //                 if (data.hasOwnProperty(k)) {
                    // //                     var ev = data[k];
                    // //                     if (data[k].type == 'VEVENT') {
                    // //                         console.log(`${ev.summary} is in ${ev.location} on the ${ev.start.getDate()} of ${months[ev.start.getMonth()]} at ${ev.start.toLocaleTimeString('de-DE')}`);
                    // //                     }
                    // //                 }
                    // //             }
    
                    // //         });
                    // //     });
    
                    // // }
    
                    // });
    
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