var mongoose = require('mongoose');
var Category = require('./category');
var fx = require('./fx');

var productSchema = {
   name: {
      type: String,
      require: true
   },
   // Picture must start with "http://"
   picture: [{
      type: String,
      match: /^http:\/\//i
   }],
   price: {
      amount: {
         type: Number,
         require: true,
         set: function(v) {
            this.internal.approximatePriceUSD = v / (fx() [this.price.currency] || 1 );
            return v;
         }
      },

      //Only 3 supported currencies for now
      currency: {
         type: String,
         enum: ['USD', 'EUR', 'GBP'],
         require: true,
         set: function(v) {
            this.internal.approximatePriceUSD = this.price.amount / (fx()[v] || 1 );
            return v;
         }
      }
   },
   categoty: Category.categorySchema,
   internal: {
      approximatePriceUSD : Number
   }
}