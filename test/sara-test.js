var Sara = require('../')
  , should = require('should')
  , app = require('../example/app.js')

describe("Sara Application", function () {

  it("is an instance of Sara", function () {
    app.should.be.instanceOf(Sara)
  })

})