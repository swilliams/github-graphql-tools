const { google } = require('googleapis');
const fs = require('fs');
const readline = require('readline');
const opn = require('opn');

const scopes = [
  'https://www.googleapis.com/auth/drive.file',
];

const tokenPath = process.env.TOKEN_PATH;

/* eslint-disable camelcase */

const getAccessToken = (oAuth2Client, callback) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
  });
  /* eslint-disable no-console */
  console.log('Authorize this app by visiting this url:', authUrl);
  /* eslint-enable no-console */
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
  rl.question('Enter the code from that page here: ', (code) => {
    rl.close();
    oAuth2Client.getToken(code, (err, token) => {
      /* eslint-disable no-console */
      if (err) return console.error('Error retrieving access token', err);
      /* eslint-enable no-console */
      oAuth2Client.setCredentials(token);
      // Store the token to disk for later program executions
      fs.writeFile(tokenPath, JSON.stringify(token), (err) => {
        /* eslint-disable no-console */
        if (err) console.error(err);
        /* eslint-enable no-console */
      });
      callback(oAuth2Client);
    });
  });
};


const authorize = (credentials, callback) => {
  const { client_secret, client_id, redirect_uris } = credentials.installed;
  const oAuth2Client = new google.auth.OAuth2(
    client_id, client_secret, redirect_uris[0]
  );

  // Check if we have previously stored a token.
  fs.readFile(tokenPath, (err, token) => {
    if (err) return getAccessToken(oAuth2Client, callback);
    oAuth2Client.setCredentials(JSON.parse(token));
    callback(oAuth2Client);
  });
};

const createFileOnDrive = async (auth, csvString, options) => {
  const drive = google.drive({ version: 'v3', auth });
  const mimeType = 'application/vnd.google-apps.spreadsheet';
  const fileMetaData = {
    name: options.reportName,
    mimeType,
  };
  const inputMedia = {
    mimeType: 'text/csv',
    body: csvString,
  }; 
  try {
    const createdFile = await drive.files.create({
      resource: fileMetaData,
      media: inputMedia,
      fields: 'id',
    });
    return createdFile.data;
  } catch (err) {
    /* eslint-disable no-console */
    console.log('File creation error', err);
    /* eslint-enable no-console */
    return null;
  }
};

module.exports = (csvString, options) => {
  const creds = require('../../credentials.json');
  authorize(creds, async (oAuthClient) => {
    const createdFile = await createFileOnDrive(oAuthClient, csvString, options);
    const sheetURL = `https://docs.google.com/spreadsheets/d/${createdFile.id}`;
    opn(sheetURL);
  });
};

/* eslint-enable camelcase */
