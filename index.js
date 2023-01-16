const admin = require("firebase-admin");

const serviceAccount = require("./pokemon-zukan-28ba3-firebase-adminsdk-d3g3h-2a58ac85e1.json");

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

const db = admin.firestore();

async function getData(){
    const ref = db.collection("groups");
	const snapshot = await ref.get();
	return snapshot.docs.map(s => s.data());
}

async function createData(){
    const ref = db.collection("groups");
	const snapshot = await ref.get();
	return snapshot.docs.map(s => s.data());
}

async function deleteData(){
    const ref = db.collection("groups");
	const snapshot = await ref.get();
	return snapshot.docs.map(s => s.data());
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