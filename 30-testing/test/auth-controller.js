const expect = require("chai").expect;
const sinon = require("sinon");

const User = require("../models/user");
const AuthController = require("../controllers/auth");

// Group tests. Describe adds a header to test run results
describe("Auth Controller - Login", function () {
  it("should throw an error with code 500 if accessing the database fails", function (done) {
    sinon.stub(User, "findOne");
    User.findOne.throws();

    const req = {
      body: {
        email: "test@test.com",
        password: "tester"
      }
    }

    // Mocka doesn't wait for async code to resolve
    // This is the same of what I encountered in the last project
    AuthController.login(req, {}, () => {}).then(result => {
      expect(result).to.be.an("error");
      expect(result).to.have.property("statusCode", 500);
      // Signal to finish the test
      done();
    });

    User.findOne.restore();
    // Test does not end here: it ends inside the above async block
  });
});
