var mongoose = require('mongoose');

module.exports = new mongoose.Schema({
   profiles: {
      username: { 
         type: String,
         rquired: true,
         lowercase: true
      },
      picture: {
         type: String,
         require: true,
         match: /^http:\/\//i
      }
   },

   data: {
      oauth: { type: String, required: true },
      cart: [{
         product: {
            type: mongoose.Schema.Types.ObjectId
         },
         quantiry: {
            type: Number,
            default: 1,
            min: 1
         }
      }]
   }
});