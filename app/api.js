var express = require('express');
var status = require('http-status');
var bodyparser = require('body-parser');

module.exports = function(wagner) {
   var api = express.Router();

   api.use(bodyparser.json());

   api.get('/product/id/:id', wagner.invoke( function (Product) {
      return function(req, res) {
         Product.findOne({ _id: req.params.id },
            handleOne.bind(null, 'product', res));
      };
   }));

   api.get('/product/category/:id', wagner.invoke( function (Product) {
      return function (req, res) {
         var sort = { name: 1 };
         if (req.query.price === "1" ) {
            sort = { 'internal.apprxiamtePriceUSD' : 1 };
         } else if (req.query.price ===  "-1") {
            sort = { 'internal.apprximatePriceUSD' : -1 };
         }

         Product.
            find ({ 'category.ancestors': req.params.id }).
            sort(sort).
            exec(handleMany.bind(null, 'products', res));
      }
   }));

   api.get('/category/id/:id', wagner.invoke(function (Category) {
      return function (req, res){
         Category.findOne ({ _id: req.params.id }, function (error, category) {
            if (error) {
               return res.status(status.INTERNAL_SERVER_ERROR).json({ error: error.toString() });
            }
            if(! category) {
               return res.status(status.NOT_FOUND).json({ error: 'NOT_FOUND' });
            }
            res.json({ category: category });
         });
      };
   }));

   api.get('/category/parent/:id', wagner.invoke(function (Category){
      return function (req, res) {
         Category.
            find({ parent: req.params.id}).
            sort({_id: 1}).
            exec(function (error, categories) {
               if (error) {
                  return res.
                     status(status.INTERNAL_SERVER_ERROR).
                     json({ error: error.toString() });
               }
               res.json ({ categories: categories });
            });
      };
   }));

   /* get current logged in user's cart */
   api.put('/me/cart', wagner.invoke(function (User) {
      return function (req, res) {
         try {
         	var cart = req.body.data.cart;
         } catch (e) {
         	status(status.BAD_REQUEST).json({
         		error: 'No cart specified!'
         	});
         }

         req.user.data.cart = cart;
         req.user.save(function (error, user) {
            if (error) {
               return res.status(status.INTERAL_SERVER_ERROR).json({
                  error: error.toString()
               });
            }

            return res.json({
               user: user
            });
         });
      };
   }));

   /* get current logged in user's status */
   api.get('/me', function (req, res) {
      if (!req.usr){
         return res.status(status.UNAUTHORIZED).json({
            error:'Not logged in' 
            });
      }

      req.user.populate({
            path: 'data.cart.product', 
            model: 'Prodcut' 
         },
         handleOne.bind( null, 'user', res)
      );
   });

   return api;
}

function handleOne(property, res, error, result) {
  if (error) {
    return res.
      status(status.INTERNAL_SERVER_ERROR).
      json({ error: error.toString() });
  }
  if (!result) {
    return res.
      status(status.NOT_FOUND).
      json({ error: 'Not found' });
  }

  var json = {};
  json[property] = result;
  res.json(json);
}
