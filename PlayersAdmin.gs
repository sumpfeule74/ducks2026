// PlayersAdmin.gs
// Zusatzfunktionen für die Admin-Spielerverwaltung
// Benötigt den bestehenden Code.gs (getSpreadsheet())

function getAllPlayersAdmin() {
  const sheet = getSpreadsheet().getSheetByName('Spieler');
  const values = sheet.getDataRange().getValues();
  return values.slice(1).filter(r => r[0]).map(r => ({
    id: String(r[0]),
    name: String(r[1]),
    active: String(r[2]).toUpperCase() === 'JA',
    admin: String(r[3]).toUpperCase() === 'JA',
    code: String(r[4] || '')
  }));
}

function updatePlayer(id, name, active, admin) {
  const sheet = getSpreadsheet().getSheetByName('Spieler');
  const values = sheet.getDataRange().getValues();

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.getRange(i + 1, 2).setValue(String(name).trim());
      sheet.getRange(i + 1, 3).setValue(active ? 'JA' : 'NEIN');
      sheet.getRange(i + 1, 4).setValue(admin ? 'JA' : 'NEIN');
      return {success:true};
    }
  }
  throw new Error('Spieler nicht gefunden.');
}

function togglePlayerActive(id) {
  const p = getAllPlayersAdmin().find(x => x.id === String(id));
  if (!p) throw new Error('Spieler nicht gefunden.');
  return updatePlayer(id, p.name, !p.active, p.admin);
}

function togglePlayerAdmin(id) {
  const p = getAllPlayersAdmin().find(x => x.id === String(id));
  if (!p) throw new Error('Spieler nicht gefunden.');
  return updatePlayer(id, p.name, p.active, !p.admin);
}

function generateNewPlayerCode(id) {
  const sheet = getSpreadsheet().getSheetByName('Spieler');
  const values = sheet.getDataRange().getValues();

  let code, unique = false;
  while (!unique) {
    code = String(Math.floor(100000 + Math.random() * 900000));
    unique = !values.slice(1).some(r => String(r[4]) === code);
  }

  for (let i = 1; i < values.length; i++) {
    if (String(values[i][0]) === String(id)) {
      sheet.getRange(i + 1, 5).setValue(code);
      return {success:true, code:code};
    }
  }
  throw new Error('Spieler nicht gefunden.');
}


function addPlayer(name, active, admin){
  name=String(name||'').trim();
  if(!name) return {success:false,message:'Name fehlt'};
  if(playerExists(name)) return {success:false,message:'Spieler existiert bereits'};
  const sheet=getSpreadsheet().getSheetByName('Spieler');
  const id=Utilities.getUuid();
  const code=createUniquePlayerCode(sheet.getDataRange().getValues());
  sheet.appendRow([id,name,active?'JA':'NEIN',admin?'JA':'NEIN',code]);
  return {success:true,message:'Spieler angelegt',data:{id,name,active,admin,code}};
}

function deletePlayer(id){
 const sheet=getSpreadsheet().getSheetByName('Spieler');
 const row=findPlayerRow(id);
 if(row<0) return {success:false,message:'Spieler nicht gefunden'};
 sheet.deleteRow(row);
 return {success:true,message:'Spieler gelöscht'};
}

function findPlayerRow(id){
 const vals=getSpreadsheet().getSheetByName('Spieler').getDataRange().getValues();
 for(let i=1;i<vals.length;i++) if(String(vals[i][0])===String(id)) return i+1;
 return -1;
}
function playerExists(name){
 const n=String(name).trim().toLowerCase();
 return getAllPlayersAdmin().some(p=>p.name.toLowerCase()===n);
}
function createUniquePlayerCode(values){
 let code;
 do{code=String(Math.floor(100000+Math.random()*900000));}
 while(values.slice(1).some(r=>String(r[4])===code));
 return code;
}
