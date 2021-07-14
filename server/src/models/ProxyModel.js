var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Proxy = new Schema({
  proxy_id: {
    type: Number,
    required: true,
  },
  ip: {
    type: String,
    require: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['live', 'used', 'lock', 'die'],
    default: 'live',
  },
  created: {
    type: Date,
    default: Date.now,
  },
});

var ProxySchema = mongoose.model('Proxy', Proxy);
module.exports = ProxySchema;
