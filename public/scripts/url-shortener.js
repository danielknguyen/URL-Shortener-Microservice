// require object data modeling
var mongoose = require('mongoose'),
    // mongoose schema method
    Schema = mongoose.Schema,
    // mongoose objectId
    ObjectId = Schema.ObjectId;

// create blueprint(schema) of urlShortener
var urlShortenerSchema = Schema({
  id: ObjectId,
  original_url: String,
  short_url: String
});

// compile schema into a model (class to create object instance)
var urlShortenerModel = mongoose.model('urlShortenerModel', urlShortenerSchema);

// function to create new urlShortener instance
var urlShortener = function(original, short_url) {

  let newUrl = new urlShortenerModel({
    original_url: original,
    short_url: short_url
  });

  newUrl.save(function(err, newUrl) {
    if (err) console.log(err);
    console.log('saved: ' + newUrl);
  });
};

var urlShortenerProvider = {
  urlShortenerModel: urlShortenerModel,
  urlShortener: urlShortener
}

module.exports = urlShortenerProvider;
