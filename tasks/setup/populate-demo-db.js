
const fs = require('fs');

import DBConfig from "../server/config/db.conf";
DBConfig.init();



fs.readFile('docs/sample-data.json', function read(err, data) {
  if (err) { throw err; }




});
