var log = require('logger')('model-locations');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var validators = require('validators');
var mongins = require('mongins');
var mongutils = require('mongutils');

var types = validators.types;
var requires = validators.requires;

var location = Schema({
    latitude: {
        type: Number,
        required: true,
        validator: types.number({
            max: 90,
            min: -90
        })
    },
    longitude: {
        type: Number,
        required: true,
        validator: types.number({
            max: 180,
            min: -180
        })
    },
    name: {
        type: String,
        validator: types.string({
            length: 200
        })
    },
    line1: {
        type: String,
        required: true,
        validator: types.string({
            length: 200
        })
    },
    line2: {
        type: String,
        validator: types.string({
            length: 200
        })
    },
    city: {
        type: String,
        required: true,
        validator: types.string({
            length: 100
        })
    },
    postal: {
        type: String,
        required: true,
        validator: types.string({
            length: 100
        })
    },
    district: {
        type: String,
        require: requires.district(),
        validator: types.string({
            length: 100
        })
    },
    province: {
        type: String,
        require: requires.province(),
        validator: types.string({
            length: 100
        })
    },
    state: {
        type: String,
        require: requires.state(),
        validator: types.string({
            length: 100
        })
    },
    country: {
        type: String,
        required: true,
        validator: types.country({
            allow: ['LK']
        })
    }
}, {collection: 'locations'});

location.plugin(mongins);
location.plugin(mongins.user);
location.plugin(mongins.createdAt);
location.plugin(mongins.updatedAt);

mongutils.ensureIndexes(location, [
    {createdAt: 1, _id: 1}
]);

location.statics.tagger = {
    validator: ['postal', 'city', 'district', 'province', 'state', 'country'],
    value: function (location, done) {
        var Locations = mongoose.model('locations');
        Locations.findOne({_id: location}, function (err, location) {
            if (err) {
                return done(err);
            }
            var tags = [];
            if (!location) {
                return done(null, tags);
            }
            if (location.postal) {
                tags.push({name: 'postal', value: location.postal});
            }
            if (location.city) {
                tags.push({name: 'city', value: location.city});
            }
            if (location.district) {
                tags.push({name: 'district', value: location.district});
            }
            if (location.province) {
                tags.push({name: 'province', value: location.province});
            }
            if (location.state) {
                tags.push({name: 'state', value: location.state});
            }
            if (location.country) {
                tags.push({name: 'country', value: location.country});
            }
            done(null, tags);
        });
    }
};

module.exports = mongoose.model('locations', location);