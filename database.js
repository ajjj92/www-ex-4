const MongoClient = require("mongodb").MongoClient;
const url = "mongodb+srv://admin:juustonaksu@cluster0.jjndj.azure.mongodb.net/test?retryWrites=true&w=majority";

class dbController {
  constructor() {
    this.updateDb = function(query, newData) {
      MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err;
        var dbo = db.db("test");
        dbo.collection("test").updateOne(query, newData, function(err, res) {
          if (err) throw err;
          console.log("Db Updated");
          db.close();
        });
      });
    };

    this.queryDb = async function() {
      let client, db;
      try {
        client = await MongoClient.connect(
          url,
          { useUnifiedTopology: true },
          {
            useNewUrlParser: true
          }
        );
        db = client.db("test");
        let dCollection = db.collection("test");
        let result = await dCollection.findOne();
        return result;
      } catch (err) {
        console.error(err);
      } finally {
        client.close();
      }
    };
  }
}

module.exports = dbController;
