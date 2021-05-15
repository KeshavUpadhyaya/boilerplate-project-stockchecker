const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const app = require('../server');

chai.use(chaiHttp);

suite('Functional Tests', function() {
  // Viewing one stock: GET request to /api/stock-prices/
  test('Gets one stock', function(done) {
    chai.request(app)
      .get('/api/stock-prices?stock=GOOG')
      .end(function(err, res) {
        assert.equal(res.status, 200);
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.equal(res.body.stockData.likes, 0);
        done();
      })
  })


  // Viewing one stock and liking it: GET request to /api/stock-prices/
  test('Gets one stock and likes it', function(done) {
    chai.request(app)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(function(err, res) {
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.equal(res.body.stockData.likes, 1);
        done();
      })
  })

  // Viewing the same stock and liking it again: GET request to /api/stock-prices/
  test('Gets one stock and likes it again', function(done) {
    chai.request(app)
      .get('/api/stock-prices?stock=GOOG&like=true')
      .end(function(err, res) {
        assert.equal(res.body.stockData.stock, 'GOOG');
        assert.equal(res.body.stockData.likes, 1);
        done();
      })
  })

  // Viewing two stocks: GET request to /api/stock-prices/
  test('Gets two stocks', function(done) {
    chai.request(app)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end(function(err, res) {
        assert.equal(res.body.stockData[0].stock, 'GOOG');
        assert.equal(res.body.stockData[0].rel_likes, 1);
        assert.equal(res.body.stockData[1].stock, 'MSFT');
        assert.equal(res.body.stockData[1].rel_likes, -1);
        done();
      })
  })

  // Viewing two stocks and liking them: GET request to /api/stock-prices/
  test('Gets two stocks and likes both', function(done) {
    chai.request(app)
      .get('/api/stock-prices?stock=GOOG&stock=MSFT')
      .end(function(err, res) {
        assert.equal(res.body.stockData[0].stock, 'GOOG');
        assert.equal(res.body.stockData[0].rel_likes, 1);
        assert.equal(res.body.stockData[1].stock, 'MSFT');
        assert.equal(res.body.stockData[1].rel_likes, -1);
        done();
      })
  })

});
