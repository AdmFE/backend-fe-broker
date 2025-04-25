const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { google } = require('googleapis');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const auth = new google.auth.GoogleAuth({
  keyFile: './credenciales.json',
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const SPREADSHEET_ID = '1rKhFkV9sUjcN-ERozONCgTyO8ZvbZVvw';

app.post('/agregar-dato', async (req, res) => {
  try {
    const client = await auth.getClient();
    const sheets = google.sheets({ version: 'v4', auth: client });

    const valores = [req.body.data];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Negocios 2025!A1',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [valores],
      },
    });

    res.status(200).send('Dato agregado con éxito a la hoja "Negocios 2025"');
  } catch (error) {
    console.error('Error al agregar dato:', error);
    res.status(500).send('Error al escribir en Google Sheets');
  }
});

app.listen(3000, () => {
  console.log('✅ Servidor corriendo en http://localhost:3000');
});
