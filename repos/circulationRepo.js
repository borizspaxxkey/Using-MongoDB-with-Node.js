const { MongoClient } = require( 'mongodb' );

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

function circulationRepo() {
    function loadData( data ) {
        return new Promise( async ( resolve, reject ) => {
            const client = new MongoClient( url );
            try {
                await client.connect();
                const db = client.db( dbName );

                results = await db.collection( 'newspapers' ).insertMany( data );
                resolve( results );
                client.close();
            } catch ( error ) {
                reject( error )
            }
        } );
    }

    function getData() {

        return new Promise( async ( resolve, reject ) => {
            const client = new MongoClient( url );

            try {
                await client.connect();
                const db = client.db( dbName );

                const items = db.collection( 'newspapers' ).find();

                resolve( await items.toArray() );
                client.close();
            } catch ( error ) {
                resolve( error );
            }
        } );
    }

    return { loadData, getData }

}

// Revealing Module Pattern
module.exports = circulationRepo();
