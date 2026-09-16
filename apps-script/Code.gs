/**
 * Invite Studio: RSVP collection for one couple's invitation.
 *
 * For each order:
 *  1. Create a Google Sheet in the couple's (or the studio's) Drive, then Extensions > Apps Script.
 *  2. Paste this file, set EVENTS to the celebration names exactly as in details.js (English).
 *  3. Run setup() once, then Deploy > New deployment > Web app (Execute as: Me, Access: Anyone).
 *  4. Put the /exec URL in details.js as rsvp.endpoint.
 *
 * doPost() receives { id, invite, name, attending: 'Yes'|'No', eventNames: [], guests, wish }.
 * A guest who changes their reply updates their existing row.
 */

const EVENTS = ['Mehendi', 'Haldi', 'Wedding', 'Reception'];

const RSVP_SHEET = 'RSVPs';
const SUMMARY_SHEET = 'Summary';
const HEADERS = ['Last updated', 'Name', 'Coming', 'Celebrations', 'Guests', 'Wish', 'Reply ID'];
const LAST_ROW = 3000;

function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('Open this script from the spreadsheet (Extensions > Apps Script) and run setup again.');
  PropertiesService.getScriptProperties().setProperty('SPREADSHEET_ID', ss.getId());

  const rsvps = ss.getSheetByName(RSVP_SHEET) || ss.insertSheet(RSVP_SHEET, 0);
  rsvps.getRange(1, 1, 1, HEADERS.length).setValues([HEADERS]).setFontWeight('bold');
  rsvps.setFrozenRows(1);
  rsvps.getRange('A:A').setNumberFormat('d mmm yyyy, h:mm am/pm');
  [160, 200, 80, 280, 70, 320, 120].forEach((width, i) => rsvps.setColumnWidth(i + 1, width));

  const summary = ss.getSheetByName(SUMMARY_SHEET) || ss.insertSheet(SUMMARY_SHEET, 1);
  summary.clear();
  const col = (letter) => 'RSVPs!$' + letter + '$2:$' + letter + '$' + LAST_ROW;
  const rows = [
    ['Replies received', '=COUNTA(' + col('B') + ')'],
    ['Guests coming (all celebrations)', '=SUMIF(' + col('C') + ',"Yes",' + col('E') + ')'],
    ['Replies not coming', '=COUNTIF(' + col('C') + ',"No")'],
  ];
  // Guests per celebration: rows whose Celebrations cell names it.
  EVENTS.forEach((name) => {
    rows.push(['Guests at ' + name, '=SUMPRODUCT(ISNUMBER(SEARCH("' + name.replace(/"/g, '""') + '",' + col('D') + '))*' + col('E') + ')']);
  });
  summary.getRange(1, 1, rows.length, 1).setValues(rows.map((row) => [row[0]])).setFontWeight('bold');
  summary.getRange(1, 2, rows.length, 1).setFormulas(rows.map((row) => [row[1]]));
  summary.setColumnWidth(1, 320);

  const excelUrl = 'https://docs.google.com/spreadsheets/d/' + ss.getId() + '/export?format=xlsx';
  summary.getRange(rows.length + 2, 1).setFormula('=HYPERLINK("' + excelUrl + '","Download replies as Excel")').setFontWeight('bold');

  const blank = ss.getSheetByName('Sheet1');
  if (blank && blank.getLastRow() === 0 && ss.getSheets().length > 2) ss.deleteSheet(blank);
}

function doPost(e) {
  try {
    submitRsvp(JSON.parse(e && e.postData ? e.postData.contents : '{}'));
    return json_({ ok: true });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function submitRsvp(reply) {
  reply = reply || {};
  const name = clean_(reply.name, 80);
  const attending = reply.attending === 'Yes' ? 'Yes' : reply.attending === 'No' ? 'No' : '';
  if (!name || !attending) throw new Error('Name and attendance are required.');

  const coming = attending === 'Yes';
  const events = coming && Array.isArray(reply.eventNames)
    ? reply.eventNames.map((n) => clean_(n, 60)).filter((n) => EVENTS.indexOf(n) >= 0).join(', ')
    : '';
  const guests = coming ? Math.max(1, Math.min(20, parseInt(reply.guests, 10) || 1)) : 0;
  const id = String(reply.id || '').replace(/[^\w-]/g, '').slice(0, 64) || Utilities.getUuid();
  const row = [new Date(), name, attending, events, guests, clean_(reply.wish, 500), id];

  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const sheet = rsvpSheet_();
    const lastRow = sheet.getLastRow();
    const ids = lastRow > 1 ? sheet.getRange(2, 7, lastRow - 1, 1).getValues().map((r) => r[0]) : [];
    const index = ids.indexOf(id);
    if (index >= 0) sheet.getRange(index + 2, 1, 1, row.length).setValues([row]);
    else sheet.appendRow(row);
  } finally {
    lock.releaseLock();
  }
}

function json_(data) {
  return ContentService.createTextOutput(JSON.stringify(data)).setMimeType(ContentService.MimeType.JSON);
}

function clean_(value, maxLength) {
  const text = String(value == null ? '' : value).replace(/\s+/g, ' ').trim().slice(0, maxLength);
  // A leading = + - or @ would make Sheets treat a guest's text as a formula.
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function rsvpSheet_() {
  const id = PropertiesService.getScriptProperties().getProperty('SPREADSHEET_ID');
  if (!id) throw new Error('Run setup() once in the Apps Script editor, then deploy again.');
  return SpreadsheetApp.openById(id).getSheetByName(RSVP_SHEET);
}
