import assert = require('assert');
import strings = require("../app_modules/strings");

describe("strings", () => {

    var messageToFormat = "Test string {0}{1}";

    it("strings.format - no args", () => {
        var result = strings.format(messageToFormat);
        assert.equal(result, messageToFormat, "Should be non-formatted");
    });

    it("strings.format - args", () => {
        var expectedResult = "Test string 12";
        var result = strings.format(messageToFormat, 1, 2);
        assert.equal(result, expectedResult, "Should be formatted");
    });

});