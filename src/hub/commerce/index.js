const admin = require('firebase-admin')
const _ = require('lodash')

let localCredentials = []
let remoteCredentials = []

let getCredentials = () => _.uniqBy(_.concat(remoteCredentials, localCredentials), x => x.storeHash || x.project)
let getCredential = key => _.find(getCredentials(), cred => (cred.storeHash || cred.project) === key) || _.first(getCredentials())

let isLoading = false

const AWS = require('aws-sdk');
const DDB = require("@aws-sdk/client-dynamodb");

// Set the region 
AWS.config.update({region: 'us-east-2'});

// Create DynamoDB document client
let docClient = new AWS.DynamoDB.DocumentClient({ apiVersion: '2012-08-10' });

let params = backend_key => ({
    TableName: 'hubcreds',
    Key: { backend_key }
})

module.exports = config => ({
    getClient: async key => {
        // if (config.credential && _.isEmpty(remoteCredentials)) {
        //     admin.initializeApp({ credential: admin.credential.cert(config.credential) });
        
        //     let db = admin.firestore();
        //     let query = db.collection(config.collection)
        
        //     let snapshot = await query.get()
        //     remoteCredentials = _.map(snapshot.docs, doc => doc.data())
        
        //     query.onSnapshot(async snapshot => {
        //         remoteCredentials = _.map(snapshot.docs, doc => doc.data())
        //     })
        // }
    
        // let cred = getCredential(key)

        console.log(`key ${key}`)

        // let cred = (await docClient.get(params(key))).response
        // console.log(`cred ${Object.keys(cred)}`)

        // cred.type = cred.store_hash ? 'bigcommerce' : 'commercetools'

        const nooparams = key => ({
            TableName: "hubcreds", //TABLE_NAME
            Key: {
              backend_key: { S: key },
            }
          })

        const dbClient = new DDB.DynamoDBClient({ region: "us-east-2" });
        const command = new DDB.GetItemCommand(nooparams(key));
      
        try {
          const results = await dbClient.send(command);
          console.log(results.TableNames.join('\n'));
        } catch (err) {
          console.error(err)
        }

        docClient.get(params(key), function(err, data) {
            if (err) {
                throw err
            } else {
                console.log("Success", data.Item);

                let cred = data.Item
                if (cred) {
                    cred.type = cred.store_hash ? 'bigcommerce' : 'commercetools'
                    let backend = require(`./backends/${cred.type}`)
                    return new backend(cred)
                }
                else {
                    throw new Error(`No commerce backend matches key [ ${key} ]. Please make sure you have set the 'x-commerce-backend-key' header.`)
                }
            }
        });          
    }
})