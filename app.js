const MongoClient = require( 'mongodb' ).MongoClient;
const assert = require( 'assert' );
const circulationRepo = require( './repos/circulationRepo' );
const data = require( './circulation.json' );

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

async function main() {
    const client = new MongoClient( url );
    await client.connect();

    try {
        const results = await circulationRepo.loadData( data );
        assert.equal( data.length, results.insertedCount );

        const getData = await circulationRepo.get();
        assert.equal( data.length, getData.length );

        const filterData = await circulationRepo.get( { Newspaper: getData[ 4 ].Newspaper } );
        assert.deepEqual( filterData[0], getData[ 4 ] );

        const limitData = await circulationRepo.get( {}, 3 );
        assert.equal( limitData.length, 3 );

        const id = getData[ 4 ]._id.toString();
        const byId = await circulationRepo.getById( id );
        assert.deepEqual( byId, getData[ 4 ] );

        const newItem = { "Newspaper": "My paper", "Daily Circulation, 2004": 1, "Daily Circulation, 2013": 3, "Change in Daily Circulation, 2004-2013": 100, "Pulitzer Prize Winners and Finalists, 1990-2003": 0, "Pulitzer Prize Winners and Finalists, 2004-2014": 0, "Pulitzer Prize Winners and Finalists, 1990-2014": 0 };
        const addedItem = await circulationRepo.add( newItem );
        assert( addedItem._id );
        const addedItemQuery = await circulationRepo.getById( addedItem._id );
        assert.deepEqual( addedItemQuery, newItem )

        const updatedItem = await circulationRepo.update( addedItem._id, { "Newspaper": "My new paper", "Daily Circulation, 2004": 1, "Daily Circulation, 2013": 3, "Change in Daily Circulation, 2004-2013": 100, "Pulitzer Prize Winners and Finalists, 1990-2003": 0, "Pulitzer Prize Winners and Finalists, 2004-2014": 0, "Pulitzer Prize Winners and Finalists, 1990-2014": 0 } );
        assert.equal( updatedItem.Newspaper, "My new paper" );

        const newAddedItemQuery = await circulationRepo.getById( addedItem._id );
        assert.equal( newAddedItemQuery.Newspaper, "My new paper" );

        const removed = await circulationRepo.remove( addedItem._id );
        assert( removed );
        const deletedItem = await circulationRepo.getById( addedItem._id );
        assert.equal(deletedItem, null);
        
    } catch ( error ) {

        ( error );
    } finally {
        const admin = client.db( dbName ).admin();

        await client.db( dbName ).dropDatabase();
        console.log( await admin.listDatabases() );

        client.close();
    }
}

main();


// collection.find({}).project({ a: 1 })                             // Create a projection of field a
// collection.find({}).skip(1).limit(10)                          // Skip 1 and limit 10
// collection.find({}).batchSize(5)                               // Set batchSize on cursor to 5
// collection.find({}).filter({ a: 1 })                              // Set query on the cursor
// collection.find({}).comment('add a comment')                   // Add a comment to the query, allowing to correlate queries
// collection.find({}).addCursorFlag('tailable', true)            // Set cursor as tailable
// collection.find({}).addCursorFlag('oplogReplay', true)         // Set cursor as oplogReplay
// collection.find({}).addCursorFlag('noCursorTimeout', true)     // Set cursor as noCursorTimeout
// collection.find({}).addCursorFlag('awaitData', true)           // Set cursor as awaitData
// collection.find({}).addCursorFlag('exhaust', true)             // Set cursor as exhaust
// collection.find({}).addCursorFlag('partial', true)             // Set cursor as partial
// collection.find({}).addQueryModifier('$orderby', { a: 1 })        // Set $orderby {a:1}
// collection.find({}).max(10)                                    // Set the cursor max
// collection.find({}).maxTimeMS(1000)                            // Set the cursor maxTimeMS
// collection.find({}).min(100)                                   // Set the cursor min
// collection.find({}).returnKey(10)                              // Set the cursor returnKey
// collection.find({}).setReadPreference(ReadPreference.PRIMARY)  // Set the cursor readPreference
// collection.find({}).showRecordId(true)                         // Set the cursor showRecordId
// collection.find({}).sort([['a', 1]])                           // Sets the sort order of the cursor query
// collection.find({}).hint('a_1')                                // Set the cursor hint
