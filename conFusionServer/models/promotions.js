const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('mongoose-currency').loadType(mongoose);
const Currency = mongoose.Types.Currency;

var promoSchema = new Schema({
    name:  {
        type: String,
        required: true,
        default:""
    },
    image:  {
        type: String,
        required: true
    },
    label:  {
        type: String,
        required: true
    },
    price:  {
        type: Currency,
        required: true
    },
    featured:  {
        type: String,
        required: true
    },
    description:  {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

var promotions = mongoose.model('Promotion', promoSchema);

module.exports = promotions;