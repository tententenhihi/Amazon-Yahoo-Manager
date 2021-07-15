var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');

var Proxy = new Schema({
  id: {
    type: Number,
    default: 1,
    require: true
  },
  ip: {
    type: String,
    require: true,
  },
  host: {
    type: String,
    require: true,
  },
  port: {
    type: String,
    require: true,
  },
  username: {
    type: String,
    require: true,
  },
  password: {
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
autoIncrement.initialize(mongoose.connection);
Proxy.plugin(autoIncrement.plugin, {
  model: 'Proxy',
  field: 'id',
  startAt: 1,
  incrementBy: 1
});
var ProxySchema = mongoose.model('Proxy', Proxy);
module.exports = ProxySchema;
