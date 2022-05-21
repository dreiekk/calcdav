# CalcDAV

Simple caldav-client to sum up your project hours from a calendar. Built w/ [Electron](https://www.electronjs.org/), [VueJS](https://vuejs.org/) and [lambdabaa/dav](https://github.com/lambdabaa/dav).

![calcdav v0.6.0 dashboard screenshot](./screenshots/calcdav_v0.6.0_dashboard.png)

### Features

- Filter calendar events by name or date
- Exclude single entries from the calculation
- Sort columns
- Multi-language (English, German)
- Export current view as Excel (*.xlsx)
- Auto Updater


## Download

Download the latest version [on the releases page](https://github.com/dreiekk/calcdav/releases).


## Developer setup

Make sure **NodeJS 14.x or 16.x** and **npm >= 8.9.0** are installed
```
node -v
npm -v
```

Clone the repository
```
git clone https://github.com/dreiekk/calcdav
cd calcdav
```

Install the dependencies
```
npm install
```

#### Compiles and hot-reloads for development
```
npm run electron:serve
```

#### Compiles and minifies for production
```
npm run electron:build
```
