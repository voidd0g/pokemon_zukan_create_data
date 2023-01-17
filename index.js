const admin = require("firebase-admin");

const serviceAccount = require("./pokemon-zukan-28ba3-firebase-adminsdk-d3g3h-2a58ac85e1.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

const pokemon_zukan_data = require("./pokemon_zukan_data.json");

const Crypto = require("crypto");

async function getData(){
    var groups = await db.collection('groups').get();
    var documents = groups.docs;
    console.log('[');
    for (var i = 0; i < documents.length; i++) {
        console.log('\t{');
        console.log(`\t\t\"groupID\": ${documents[i].get('id')}\"`);
        var pokemons = await documents[i].ref.collection('pokemons').get();
        var pokDocs = pokemons.docs;
        console.log('\t\t\"pokemons\": [');
        for (var j = 0; j < pokDocs.length; j++) {
            console.log('\t\t\t{');
            console.log(`\t\t\t\t\"name\": \"${pokDocs[j].get('name')}\"`);
            console.log(`\t\t\t\t\"type1\": \"${pokDocs[j].get('type1')}\"`);
            console.log(`\t\t\t\t\"type2\": \"${pokDocs[j].get('type2')}\"`);
            console.log(`\t\t\t\t\"stage\": ${pokDocs[j].get('stage')}`);
            console.log(`\t\t\t\t\"form\": ${pokDocs[j].get('form')}`);
            console.log(`\t\t\t\t\"img_path\": ${pokDocs[j].get('img_path')}`);
            console.log('\t\t\t}' + (j != pokDocs.length - 1 ? ',' : ''));
        }
        console.log('\t\t]');
        console.log('\t}' + (i != documents.length - 1 ? ',' : ''));
    }
    console.log(']');
}

function randStr(length){
    let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let rand_str = '';
    for ( var i = 0; i < length; i++ ) {
        rand_str += chars.charAt(Crypto.randomInt(chars.length));
    }
    return rand_str;
}

async function createData(){
    var groups = pokemon_zukan_data['groups'];
    for (var i = 0; i < groups.length; i++) {
        var groupID = randStr(32);
        await db.collection('groups').doc(groupID).set({
            'id': groupID,
        });
        var pokemons = groups[i]['pokemons'];
        for (var j = 0; j < pokemons.length; j++) {
            var pokName = pokemons[j]['name'];
            var type1 = pokemons[j]['type1'];
            var type2 = pokemons[j]['type2'] != null ? pokemons[j]['type2'] : null;
            var stage = pokemons[j]['stage'] != null ? pokemons[j]['stage'] : 0;
            var form = pokemons[j]['form'] != null ? pokemons[j]['form'] : 0;
            var img_path = pokemons[j]['img_path'];
            await db.collection('groups').doc(groupID).collection('pokemons').doc(`${stage}-${form}`).set({
                'name': pokName,
                'type1': type1,
                'type2': type2,
                'stage': stage,
                'form': form,
                'img_path': img_path,
            });
        }
    }
}

async function deleteData(){
    groups = await db.collection('groups').get();
    documents = groups.docs;
    for (var i = 0; i < documents.length; i++) {
        pokemons = await documents[i].ref.collection('pokemons').get();
        pokDocs = pokemons.docs;
        for (var j = 0; j < pokDocs.length; j++) {
            await pokDocs[j].ref.delete();
        }
        await documents[i].ref.delete();
    }
}
  
async function main() {
    for(var i = 2; i < process.argv.length; i++){
        if(process.argv[i] == "get"){
            await getData();
        }
        else if(process.argv[i] == "create"){
            await createData();
        }
        else if(process.argv[i] == "delete"){
            await deleteData();
        }
    }
}

main().then();