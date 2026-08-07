const SPREADSHEET_ID =
  '1TssJhOK7l2xo-UFRP1ioJgk6mmjln5M8l6xOL4PeCEQ';


// ======================================
// SPREADSHEET
// ======================================

function getSpreadsheet() {

  return SpreadsheetApp.openById(
    SPREADSHEET_ID
  );

}


// ======================================
// WEB APP
// ======================================

function doGet() {

  return HtmlService
    .createHtmlOutputFromFile('Index')
    .setTitle('Dart-Team')
    .setXFrameOptionsMode(
      HtmlService.XFrameOptionsMode.ALLOWALL
    );

}


// ======================================
// SPIELER LADEN
// ======================================

function getPlayers() {

  const sheet =
    getSpreadsheet()
      .getSheetByName('Spieler');

  if (!sheet) {

    throw new Error(
      'Tabellenblatt "Spieler" nicht gefunden.'
    );

  }

  const data =
    sheet.getDataRange().getValues();

  if (data.length <= 1) {

    return [];

  }

  return data
    .slice(1)
    .filter(function(row) {

      return (
        row[0] &&
        row[1] &&
        String(row[2])
          .trim()
          .toUpperCase() === 'JA'
      );

    })
    .map(function(row) {

      return {

        id:
          String(row[0]),

        name:
          String(row[1]),

        admin:
          String(row[3])
            .trim()
            .toUpperCase() === 'JA'

      };

    });

}


// ======================================
// LOGIN
// ======================================

function loginWithCode(code) {

  const sheet =
    getSpreadsheet()
      .getSheetByName('Spieler');

  if (!sheet) {

    throw new Error(
      'Tabellenblatt "Spieler" nicht gefunden.'
    );

  }

  const searchCode =
    String(code || '').trim();

  if (!searchCode) {

    return {
      success: false
    };

  }

  const data =
    sheet.getDataRange().getValues();


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const row = data[i];


    const playerId =
      String(row[0] || '').trim();


    const name =
      String(row[1] || '').trim();


    const active =
      String(row[2] || '')
        .trim()
        .toUpperCase() === 'JA';


    const admin =
      String(row[3] || '')
        .trim()
        .toUpperCase() === 'JA';


    const playerCode =
      String(row[4] || '').trim();


    if (
      playerCode === searchCode &&
      active &&
      name
    ) {

      return {

        success: true,

        player: {

          id: playerId,

          name: name,

          admin: admin

        }

      };

    }

  }


  return {

    success: false

  };

}


// ======================================
// NEUEN SPIELER ANLEGEN
// ======================================

function createPlayer(
  name,
  isAdmin
) {

  const sheet =
    getSpreadsheet()
      .getSheetByName('Spieler');

  if (!sheet) {

    throw new Error(
      'Tabellenblatt "Spieler" nicht gefunden.'
    );

  }


  name =
    String(name || '').trim();


  if (!name) {

    throw new Error(
      'Bitte einen Spielernamen eingeben.'
    );

  }


  const admin =
    isAdmin === true;


  const data =
    sheet.getDataRange().getValues();


  // ====================================
  // PRÜFEN, OB NAME BEREITS EXISTIERT
  // ====================================

  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const existingName =
      String(data[i][1] || '')
        .trim()
        .toLowerCase();


    if (
      existingName ===
      name.toLowerCase()
    ) {

      throw new Error(
        'Dieser Spieler existiert bereits.'
      );

    }

  }


  // ====================================
  // ID ERZEUGEN
  // ====================================

  const playerId =
    Utilities.getUuid();


  // ====================================
  // EINDEUTIGEN CODE ERZEUGEN
  // ====================================

  let playerCode = '';

  let unique = false;


  while (!unique) {

    playerCode =
      Math.floor(
        100000 +
        Math.random() * 900000
      ).toString();


    unique = true;


    for (
      let i = 1;
      i < data.length;
      i++
    ) {

      const existingCode =
        String(data[i][4] || '')
          .trim();


      if (
        existingCode ===
        playerCode
      ) {

        unique = false;

        break;

      }

    }

  }


  // ====================================
  // SPIELER SPEICHERN
  // ====================================

  sheet.appendRow([

    playerId,

    name,

    'JA',

    admin ? 'JA' : 'NEIN',

    playerCode

  ]);


  return {

    success: true,

    player: {

      id: playerId,

      name: name,

      admin: admin,

      code: playerCode

    }

  };

}


// ======================================
// TERMINE LADEN
// ======================================

function getEvents() {

  const sheet =
    getSpreadsheet()
      .getSheetByName('Termine');

  if (!sheet) {

    throw new Error(
      'Tabellenblatt "Termine" nicht gefunden.'
    );

  }

  const data =
    sheet.getDataRange().getValues();

  if (data.length <= 1) {

    return [];

  }

  return data
    .slice(1)
    .filter(function(row) {

      return row[0];

    })
    .map(function(row) {

      return {

        id:
          String(row[0]),

        date:
          formatDate(row[1]),

        start:
          formatTime(row[2]),

        end:
          formatTime(row[3]),

        type:
          String(row[4] || ''),

        opponent:
          String(row[5] || ''),

        homeAway:
          String(row[6] || ''),

        location:
          String(row[7] || ''),

        description:
          String(row[8] || '')

      };

    });

}


// ======================================
// DATUM FORMATIEREN
// ======================================

function formatDate(value) {

  if (!value) {

    return '';

  }

  if (
    Object.prototype.toString.call(value)
      === '[object Date]'
  ) {

    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      'dd.MM.yyyy'
    );

  }

  return String(value);

}


// ======================================
// ZEIT FORMATIEREN
// ======================================

function formatTime(value) {

  if (!value) {

    return '';

  }

  if (
    Object.prototype.toString.call(value)
      === '[object Date]'
  ) {

    return Utilities.formatDate(
      value,
      Session.getScriptTimeZone(),
      'HH:mm'
    );

  }

  return String(value);

}


// ======================================
// ANTWORTEN LADEN
// ======================================

function getResponses() {

  const sheet =
    getSpreadsheet()
      .getSheetByName('Antworten');

  if (!sheet) {

    throw new Error(
      'Tabellenblatt "Antworten" nicht gefunden.'
    );

  }

  const data =
    sheet.getDataRange().getValues();

  if (data.length <= 1) {

    return [];

  }

  return data
    .slice(1)
    .filter(function(row) {

      return (
        row[0] &&
        row[1]
      );

    })
    .map(function(row) {

      return {

        terminId:
          String(row[0]),

        spielerId:
          String(row[1]),

        answer:
          String(row[2] || '')

      };

    });

}


// ======================================
// ANTWORT SPEICHERN
// ======================================

function saveResponse(
  eventId,
  playerId,
  answer
) {

  const sheet =
    getSpreadsheet()
      .getSheetByName('Antworten');

  if (!sheet) {

    throw new Error(
      'Tabellenblatt "Antworten" nicht gefunden.'
    );

  }

  const validAnswers = [
    'JA',
    'VIELLEICHT',
    'NEIN'
  ];

  if (
    !validAnswers.includes(answer)
  ) {

    throw new Error(
      'Ungültige Antwort.'
    );

  }

  const data =
    sheet.getDataRange().getValues();


  for (
    let i = 1;
    i < data.length;
    i++
  ) {

    const row = data[i];


    if (
      String(row[0]) === String(eventId) &&
      String(row[1]) === String(playerId)
    ) {

      sheet
        .getRange(i + 1, 3)
        .setValue(answer);

      return true;

    }

  }


  sheet.appendRow([

    String(eventId),

    String(playerId),

    answer

  ]);


  return true;

}


// ======================================
// ADMIN ÜBERSICHT
// ======================================

function getAdminOverview() {

  const players =
    getPlayers();

  const events =
    getEvents();

  const responses =
    getResponses();


  const leagueEvents =
    events.filter(function(event) {

      return (
        String(event.type)
          .trim()
          .toUpperCase()
          === 'LIGASPIEL'
      );

    });


  return leagueEvents.map(
    function(event) {

      const eventResponses =
        responses.filter(
          function(response) {

            return (
              String(
                response.terminId
              ) === String(event.id)
            );

          }
        );


      const playerList =
        players.map(
          function(player) {

            const response =
              eventResponses.find(
                function(r) {

                  return (
                    String(
                      r.spielerId
                    ) ===
                    String(player.id)
                  );

                }
              );


            return {

              name:
                player.name,

              answer:
                response
                  ? response.answer
                  : 'OFFEN'

            };

          }
        );


      return {

        event: event,

        counts: {

          yes:
            eventResponses.filter(
              function(r) {
                return r.answer === 'JA';
              }
            ).length,

          maybe:
            eventResponses.filter(
              function(r) {
                return (
                  r.answer ===
                  'VIELLEICHT'
                );
              }
            ).length,

          no:
            eventResponses.filter(
              function(r) {
                return r.answer === 'NEIN';
              }
            ).length,

          open:
            playerList.filter(
              function(p) {
                return (
                  p.answer ===
                  'OFFEN'
                );
              }
            ).length

        },

        players:
          playerList

      };

    }
  );

}


// ======================================
// NEUES LIGASPIEL
// ======================================

function createEvent(eventData) {

  const sheet =
    getSpreadsheet()
      .getSheetByName('Termine');


  if (!sheet) {

    throw new Error(
      'Tabellenblatt "Termine" nicht gefunden.'
    );

  }


  if (!eventData) {

    throw new Error(
      'Keine Termindaten erhalten.'
    );

  }


  const id =
    Utilities.getUuid();


  sheet.appendRow([

    id,

    eventData.date || '',

    eventData.start || '',

    eventData.end || '',

    'LIGASPIEL',

    eventData.opponent || '',

    eventData.homeAway || '',

    eventData.location || '',

    eventData.description || ''

  ]);


  return true;

}