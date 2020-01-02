const { MongoClient, ObjectID } = require( 'mongodb' );

const url = 'mongodb://localhost:27017';
const dbName = 'circulation';

function circulationRepo() {

    function loadData( data ) {
        return new Promise( async ( resolve, reject ) => {
            const client = new MongoClient( url );
            try {
                await client.connect();
                const db = client.db( dbName );

                const results = await db.collection( 'newspapers' ).insertMany( data );
                resolve( results );
                client.close();
            } catch ( error ) {
                reject( error )
            }
        } );
    }

    function get( query, limit ) {

        return new Promise( async ( resolve, reject ) => {
            const client = new MongoClient( url );

            try {
                await client.connect();
                const db = client.db( dbName );

                let items = db.collection( 'newspapers' ).find( query );

                if ( limit > 0 ) {
                    items = items.limit( limit );
                }

                resolve( await items.toArray() );
                client.close();
            } catch ( error ) {
                resolve( error );
            }
        } );
    }

    function getById( id ) {
        return new Promise( async ( resolve, reject ) => {
            const client = new MongoClient( url );
            try {
                await client.connect();
                const db = client.db( dbName );
                const item = await db.collection( 'newspapers' ).findOne( { _id: ObjectID( id ) } );

                resolve( item );
                client.close();
            } catch ( error ) {
                reject( error );
            }
        } );
    }

    function add( item ) {
        return new Promise( async ( resolve, reject ) => {
            const client = new MongoClient( url );
            try {
                await client.connect();
                const db = client.db( dbName );
                const addedItem = await db.collection( 'newspapers' ).insertOne( item );
                resolve( addedItem.ops[ 0 ] );
                client.close();
            } catch ( error ) {
                resolve( error );
            }
        } );
    }

    function update( id, newItem ) {
        return new Promise( async ( resolve, reject ) => {
            const client = new MongoClient( url );
            try {
                await client.connect();
                const db = client.db( dbName );
                const updatedItem = await db.collection( 'newspapers' ).findOneAndReplace( { _id: ObjectID( id ) }, newItem, { returnOriginal: false } );

                resolve( updatedItem.value );
                client.close();
            } catch ( error ) {
                reject( error );
            }
        } )
    }

    function remove( id ) {
        return new Promise( async ( resolve, reject ) => {
            const client = new MongoClient( url );
            try {
                await client.connect()
                const db = client.db( dbName );
                const removed = db.collection( 'newspapers' ).deleteOne( { _id: ObjectID( id ) } );

                resolve( (await removed).deletedCount ===1  );
                client.close();
            } catch ( error ) {
                reject( error );
            }
        } );
    }

    return { loadData, get, getById, add, update, remove }


}

// Revealing Module Pattern
module.exports = circulationRepo();
