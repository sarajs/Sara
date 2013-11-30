var app = require('../example/app')

describe("Application", function () {
  it("is exposed for testing", function () {
    expect(app.constructor.name).toBe('Sara')
  })
})