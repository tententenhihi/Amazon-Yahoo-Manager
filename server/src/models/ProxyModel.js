var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Proxy = new Schema({
  ip: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['live', 'used', 'die'],
    default: 'live',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

var ProxySchema = mongoose.model('Proxy', Proxy);
module.exports = ProxySchema;
