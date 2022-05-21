<template>
  <div class="text-white">

    <div v-if="statusbar == 'error'" class="alert alert-danger text-center mb-0">
      <i class="fas fa-fw fa-exclamation-triangle"></i>
      {{ $t('status_error') }}
    </div>

    <div v-if="statusbar == 'updating_calendar'" class="alert alert-info text-center mb-0">
      <i class="fas fa-fw fa-spin fa-circle-notch"></i>
      {{ $t('status_calendar_download') }}
    </div>

    <div v-if="statusbar == 'calendar_uptodate'" class="alert alert-success text-center mb-0">
      <i class="fas fa-fw fa-check"></i>
      {{ $t('status_calendar_uptodate') }}
    </div>

    <div v-if="statusbar == 'calendar_changed'" class="alert alert-info text-center mb-0">
      <i class="fas fa-fw fa-exchange-alt"></i>
      {{ $t('status_calendar_changed') }}
      <a class="ml-2" href="#">{{ $t('status_calendar_changed_button') }}</a>
    </div>

    <div class="text-left p-4">

      <form @submit.prevent="">
        <div class="form-row">
          <div class="form-group col-md-3">
            <label for="inputSearch" class="col-form-label col-form-label-sm">{{ $t('search') }}</label>
            <input @keydown.enter="filterRows" id="inputSearch" type="text" class="form-control form-control-sm" :placeholder="$t('search')" v-model="form.search">
          </div>

          <div class="form-group col-md-3">
            <label for="inputDateFrom" class="col-form-label col-form-label-sm">{{ $t('from') }}</label>
            <input @change="filterRows" id="inputDateFrom" type="date" class="form-control form-control-sm" v-model="form.date_from">
          </div>
          <div class="form-group col-md-3">
            <label for="inputDateTo" class="col-form-label col-form-label-sm">{{ $t('to') }}</label>
            <input @change="filterRows" id="inputDateTo" type="date" class="form-control form-control-sm" v-model="form.date_to">
          </div>
          <div class="form-group col-md-3">
            <label for="inputDateTo" class="col-form-label col-form-label-sm">{{ $t('current_view') }}</label>
            <button type="button" class="btn btn-secondary btn-sm w-100" @click="excelExport">{{ $t('export_excel') }}</button>
          </div>
        </div>
      </form>

      <div class="mt-3 mb-4 text-center">
        <div class="form-row">
          <div class="col-sm-4 mb-3 mb-sm-0">
            <h3 class="mb-0">{{ totalRows }} {{ $tc('entries', totalRows) }}</h3>
            <span>{{ $t('found') }}</span>
          </div>
          <div class="col-sm-4 mb-3 mb-sm-0">
            <h3 class="mb-0">{{ totalActiveRows }} {{ $tc('entries', totalActiveRows) }}</h3>
            <span>{{ $t('selected') }}</span>
          </div>
          <div class="col-sm-4 mb-3 mb-sm-0">
            <h3 class="mb-0">{{ totalHours }} {{ $tc('hours', totalHours) }}</h3>
            <span>{{ $t('in_total') }}</span>
          </div>
        </div>
      </div>

      <div class="text-left text-white table-responsive">
        <table class="table table-sm table-hover table-striped">
          <thead>
            <tr class="text-white">
              <th></th>
              <th @click="sort('title')">
                {{ $t('title') }}
                <i v-if="sorting.column == 'title' && sorting.direction == 'desc'" class="fas fa-fw fa-caret-down"></i>
                <i v-if="sorting.column == 'title' && sorting.direction == 'asc'" class="fas fa-fw fa-caret-up"></i>
              </th>
              <th @click="sort('start_raw')">
                {{ $t('from') }}
                <i v-if="sorting.column == 'start_raw' && sorting.direction == 'desc'" class="fas fa-fw fa-caret-down"></i>
                <i v-if="sorting.column == 'start_raw' && sorting.direction == 'asc'" class="fas fa-fw fa-caret-up"></i>
              </th>
              <th @click="sort('end_raw')">
                {{ $t('to') }}
                <i v-if="sorting.column == 'end_raw' && sorting.direction == 'desc'" class="fas fa-fw fa-caret-down"></i>
                <i v-if="sorting.column == 'end_raw' && sorting.direction == 'asc'" class="fas fa-fw fa-caret-up"></i>
              </th>
              <th @click="sort('hours')" class="text-center">
                {{ $t('hours_title') }}
                <i v-if="sorting.column == 'hours' && sorting.direction == 'desc'" class="fas fa-fw fa-caret-down"></i>
                <i v-if="sorting.column == 'hours' && sorting.direction == 'asc'" class="fas fa-fw fa-caret-up"></i>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(row, index) in sortedRows" :key="'row_' + index" class="text-white">
              <td style="width: 32px;">
                <div class="custom-control custom-switch">
                  <input v-model="row.active" type="checkbox" class="custom-control-input" :id="'switch_' + index">
                  <label class="custom-control-label" :for="'switch_' + index"></label>
                </div>
              </td>
              <td class="text-nowrap text-truncate" style="max-width: 500px;"><label :for="'switch_' + index" class="calendar_label">{{ row.calendar_object.summary }}</label></td>
              <td class="text-nowrap">{{ row.start }}</td>
              <td class="text-nowrap">{{ row.end }}</td>
              <td class="text-center">{{ row.hours }}</td>
            </tr>
          </tbody>
        </table>
      </div>

    </div>

  </div>
</template>

<style scoped>
  .custom-control-input:checked~.custom-control-label::before {
    background-color: #0a0;
  }
  .custom-control-input~.custom-control-label::before {
    background-color: #a00;
  }

  .custom-control-input {
    border: none;
  }

  th {
    position: sticky;
    top: 0;
    background-color: #222;
    cursor: pointer;
    user-select: none;
  }

  .calendar_label {
    margin-bottom: 0;
    cursor: pointer;
  }

  tr:hover {
    background-color: rgba(255, 255, 255, 0.1) !important;
  }

  table * {
    border-color: rgba(255, 255, 255, 0.3) !important;
  }
</style>

<script>
import { syncCalendar } from '../helpers/DavFunctions';
const ical = require('ical');
const moment = require('moment');
var xl = require('excel4node');
var orderBy = require('lodash.orderby');

import { openSaveDialog, openErrorDialog } from '../helpers/DialogFunctions';

export default {
  name: 'DashboardView',
  data: function() {
    return {
      form: {
        search: null,
        date_from: moment().startOf('month').format('YYYY-MM-DD'),
        date_to: moment().endOf('month').format('YYYY-MM-DD'),
      },
      statusbar: 'updating_calendar',
      rows_raw: [],
      rows: [],
      sorting: {
        column: 'start_raw',
        direction: 'asc'
      }
    }
  },
  computed: {
    totalRows() {
      return this.rows.length;
    },
    totalActiveRows() {
      let i = 0;
      this.rows.forEach((row) => {
        if (row.active) i++;
      });
      return i;
    },
    totalHours() {
      let i = 0;
      this.rows.forEach((row) => {
        if (row.active) i += row.hours;
      });
      return parseFloat(i.toFixed(1));
    },
    sortedRows() {
      return orderBy(this.rows, this.sorting.column, this.sorting.direction);
    }
  },
  methods: {
    sort(column) {
      if (column != this.sorting.column) {
        this.sorting.column = column;
        this.sorting.direction = 'asc'
      } else {
        this.sorting.direction = this.sorting.direction == 'asc' ? 'desc' : 'asc';
      }
    },
    excelExport() {
      openSaveDialog().then((filename) => {
        
        console.log('creating excel...');

        var wb = new xl.Workbook();
        
        var ws = wb.addWorksheet();
        
        let y = 2;

        ws.cell(y, 2).string('Exported at ' + moment().format('YYYY-MM-DD HH:mm'));

        y += 2;

        ws.cell(y, 2).string('Title').style({ font: { bold: true } });
        ws.cell(y, 3).string('From').style({ font: { bold: true } });
        ws.cell(y, 4).string('to').style({ font: { bold: true } });
        ws.cell(y, 5).string('Hours').style({ font: { bold: true } });

        y++;

        let i = 0;
        this.sortedRows.forEach((row) => {
          if (row.active == false) return;
          ws.cell(y+i, 2).string(row.title);
          ws.cell(y+i, 3).string(row.start);
          ws.cell(y+i, 4).string(row.end);
          ws.cell(y+i, 5).number(row.hours);
          i++;
        });

        ws.column(2).setWidth(60);
        ws.column(3).setWidth(20);
        ws.column(4).setWidth(20);

        console.log('saving excel... to: ' + filename);
        wb.write(filename, (error) => {

          if (error == null) {
            console.log('saved successfully');
          } else {
            console.log('Error saving excel sheet:');
            console.log(error);
            openErrorDialog('Error', 'Could not save excel file: ' + error);
          }

        });

      });
    },
    formatTimestamp(date) {
      return moment(date).format('DD.MM.YYYY HH:mm');
    },
    getHours(calendar_object) {
      let start = moment(calendar_object.start);
      let end = moment(calendar_object.end);
      return moment.duration(end.diff(start)).asHours();
    },
    filterRows() {

      console.log('filterRows()');

      this.rows = [];
      if (this.form.search == null || this.form.search.trim() == "") {
        this.form.search = '';
      }

      this.rows_raw.forEach((row) => {

        if (this.form.search != '') {
          let search_parts = this.form.search.trim().split(' ');
          let search_in_title = true;
          search_parts.forEach((search_part) => {
            if (!row.title.toLowerCase().includes(search_part.toLowerCase())) {
              search_in_title = false;
            }
          });
          if (!search_in_title) {
            return;
          }
        }

        let moment_date_from = moment(this.form.date_from);
        if (moment(row.calendar_object.start).isBefore(moment_date_from, 'day')) {
          return;
        }

        let moment_date_to = moment(this.form.date_to);
        if (moment(row.calendar_object.end).isAfter(moment_date_to, 'day')) {
          return;
        }

        this.rows.push(row);

      });

    }
  },
  mounted() {
    this.statusbar = 'updating_calendar';
    syncCalendar(this.$store.state.calendar, this.$store.state.davXhr)
      .then((calendar) => {
        this.$store.state.calendar = calendar;
        this.statusbar = 'calendar_uptodate';

        calendar.objects.forEach((obj) => {
            let data = ical.parseICS(obj.data.props.calendarData);

            let calendar_object = null;
            let objkey = Object.keys(data)[0];

            calendar_object = data[objkey];

            if (calendar_object.type != 'VEVENT') return;

            this.rows_raw.push({
              active: true,
              hours: parseFloat(this.getHours(calendar_object).toFixed(1)),
              title: calendar_object.summary,
              start: this.formatTimestamp(calendar_object.start),
              start_raw: calendar_object.start,
              end: this.formatTimestamp(calendar_object.end),
              end_raw: calendar_object.end,
              calendar_object: calendar_object
            });

        });

        this.filterRows();

      })
      .catch((error) => {
        console.error(error);
        this.statusbar = 'error';
      });
  }
}
</script>

<i18n>
{
  "en": {
    "status_error": "An error occured!",
    "status_calendar_download": "Downloading calendar",
    "status_calendar_uptodate": "Calendar is up to date",
    "status_calendar_changed": "Calendar has changed",
    "status_calendar_changed_button": "Download now",
    "search": "Search",
    "from": "From",
    "to": "To",
    "current_view": "Current view",
    "entries": "entry | entries",
    "hours": "hour | hours",
    "hours_title": "Hours",
    "title": "Title",
    "export_excel": "Export as Excel",
    "found": "found",
    "selected": "selected",
    "in_total": "in total"
  },
  "de": {
    "status_error": "Ein Fehler ist aufgetreten!",
    "status_calendar_download": "Kalender wird heruntergeladen...",
    "status_calendar_uptodate": "Kalender ist aktuell",
    "status_calendar_changed": "Änderungen im Kalender",
    "status_calendar_changed_button": "Jetzt synchronisieren",
    "search": "Suche",
    "from": "Von",
    "to": "Bis",
    "current_view": "Aktuelle Ansicht",
    "entries": "Eintrag | Einträge",
    "hours": "Stunde | Stunden",
    "hours_title": "Stunden",
    "title": "Titel",
    "export_excel": "Als Excel exportieren",
    "found": "gefunden",
    "selected": "ausgewählt",
    "in_total": "insgesamt"
  }
}
</i18n>