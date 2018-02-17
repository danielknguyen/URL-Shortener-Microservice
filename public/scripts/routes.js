var routes = function(app, validUrl, urlShortenerProvider, mongoose, googl, util) {
  // mongodb connection url
  var url = process.env.MONGOLAB_URI;
  // set google developer key
  googl.setKey(process.env.GOOGL_API_KEY);
  // Get currently set developer key
  googl.getKey();

  app.get('/', function(req, res) {
    res.render('index.html');
  });

  // full url parameter (*)
  app.get('/new/:q(*)', function(req, res) {
    // json of original and short url
    var jsonResponse = {};

    // endpoint url parameter
    var q = req.params.q;
    // console.log(q);

    // check if url parameter value is not a valid url
    if (validUrl.isWebUri(q)) {
      // log valid URI
      console.log('Looks like an URI: ' + q);

      // open a connection to mongodb
      mongoose.connect(url);

      // access mongo db
      var db = mongoose.connection;

      // check if connection error
      db.on('error', function() {
        console.log('Mongoose connection error!');
      });

      // check for successful connection
      db.once('open', function() {
        // we're connected!
        console.log('Mongoose connection succesfull!');

        var urlShortenerModel = urlShortenerProvider.urlShortenerModel;
        var original;
        var short;

        // query for original url in database
        urlShortenerModel.findOne({"original_url": q}, function(err, url) {

          if (err) throw err;

          // if url not in database
          if (url === null) {
            // Shorten a long url and add both original and short url into database then add into jsonResponse object to display
            googl.shorten(q)
            .then(function (shortUrl) {
              jsonResponse.original_url = q;
              jsonResponse.short_url = shortUrl;
              urlShortenerProvider.urlShortener(q, shortUrl);
              console.log("successfully added to database!");
              db.close();
              res.send(jsonResponse);
            })
            .catch(function (err) {
              // if any errors in shortening, display error message
              res.send(err.message);
            });
            // if url already exists in db go and display to client
          } else {
            console.log("long: " + url.original_url + ', ' + "short: " + url.short_url);
            jsonResponse.original_url = url.original_url;
            jsonResponse.short_url = url.short_url;
            db.close();
            res.send(jsonResponse);
          };
        });
      });
    } else {
      console.log('Not a URI: ' + q);
      // create error key inside jsonResponse if url parameter value is not a valid Uri
      jsonResponse.error = "Wrong url format, make sure you have a valid protocol and the site is legit.";

      res.send(jsonResponse);
    };
  });

};

module.exports = routes;
