var routes = function(app, mongodb) {
  // to connect to mongodb server use MongoClient interface
  var MongoClient = mongodb.MongoClient;
  // mongo connection url
  var url = process.env.MONGOLAB_URI;

  app.get('/', function(req, res) {
    res.render('index.html');
  });

  app.get('/new/:q', function(req, res) {
    // url parameter
    var q = req.params.q;
    // console.log(q);

    // pass MONGOLAB_URI into connect method to connect to mongodb server
    MongoClient.connect(url, function(err, db) {
      // log error if cannot connect to server
      if (err) {
        console.log('Unable to connect to the mongoDB server. Error: ', err);
        // else log successful connection
      } else {
        console.log('Connection established to', url);
        // do some work

        // close database once work is completed
        db.close();
      };
    });

    res.send('url parameter: ' + q);
  });

};

module.exports = routes;
