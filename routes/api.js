'use strict';

const stockService = require('../service/stock-service');

let likesDB = {};

let IPLikeDB = {};

let hasIPLikedStock = function(ipAndStock) {
  return IPLikeDB[ipAndStock] && IPLikeDB[ipAndStock] === 'liked';
}

let addToLikesDB = function(stock) {
  if (likesDB[stock] === undefined || likesDB[stock] === null) {
    likesDB[stock] = 0;
  }
}

let incrementLikes = function(stock) {
  likesDB[stock] += 1;
}

module.exports = function(app) {

  app.route('/api/stock-prices')
    .get(async function(req, res) {

      // console.lgo(`IP Address = ${req.connection.remoteAddress}`)

      const stock = req.query.stock;
      const like = req.query.like;
      const ipAndStock = req.connection.remoteAddress + stock;
      // console.lgo(ipAndStock)

      // console.lgo(stock);
      // console.lgo(like)

      if (stock == undefined) {
        res.json({})
      }

      // only 1 stock in request
      if (stock !== undefined && typeof (stock) == 'string') {

        addToLikesDB(stock);

        // console.lgo(`IPLikesDB = ${JSON.stringify(IPLikeDB)}`)
        if (like === 'true') {
          if (!hasIPLikedStock(ipAndStock)) {
            IPLikeDB[ipAndStock] = 'liked';
            incrementLikes(stock);
          }
        } else {
          if (hasIPLikedStock(ipAndStock)) {
            IPLikeDB[ipAndStock] = 'unliked';
            likesDB[stock] -= 1;
          }
        }

        stockService.getStockData(stock)
          .then(function(data) {
            res.json({
              'stockData': {
                'stock': stock,
                'price': data.data.latestPrice,
                'likes': likesDB[stock]
              }
            });
          })
          .catch(function(err) {
            // console.lgo(err);
          })
      }
      // there are 2 stocks
      else if (stock !== undefined && typeof (stock) == 'object') {
        stock.forEach(symbol => {
          addToLikesDB(symbol);
          if (like == 'true') {
            if (!hasIPLikedStock(ipAndStock)) {
              IPLikeDB[ipAndStock] = 'liked';
              incrementLikes(symbol);
            }
          } else {
            if (hasIPLikedStock(ipAndStock)) {
              IPLikeDB[ipAndStock] = 'unliked';
              likesDB[symbol] -= 1;
            }
          }
        });

        let result = { 'stockData': [] };
        for (let i = 0; i < stock.length; i++) {
          const symbol = stock[i];
          let stockInfo = await stockService.getStockData(symbol);
          result.stockData.push({
            'stock': symbol,
            'price': stockInfo.data.latestPrice,
            'rel_likes': i == 0 ? likesDB[stock[0]] - likesDB[stock[1]] : likesDB[stock[1]] - likesDB[stock[0]]
          })
        }
        res.json(result);

      }

    });

};
