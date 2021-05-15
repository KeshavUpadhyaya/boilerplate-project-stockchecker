const axios = require('axios').default;

exports.getStockData = function(stockSymbol) {

  return axios.get(`https://stock-price-checker-proxy.freecodecamp.rocks/v1/stock/${stockSymbol}/quote`)
}