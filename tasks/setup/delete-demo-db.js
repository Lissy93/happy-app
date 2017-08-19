
import DBConfig from '../../server/config/db.conf';

/**
 * Calls to the drop database function, then triggers cleanUp()
 */
function deleteDatabase(){
  DBConfig.deleteEverything(cleanUp);
}

/**
 * Closes Mongo connection, and prints out a little message message.
 * Called when all data insert operations are done
 */
function cleanUp(){
  console.log('\nDatabase Dropped. Closing Mongo connection...');
  DBConfig.closeConnection();
  console.log('... disconnected.');
}

module.exports = deleteDatabase;

