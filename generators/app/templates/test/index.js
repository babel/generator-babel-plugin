import path from "path";
import fs from "fs";
import assert from "assert";
import * as babel from "babel-core";
import plugin from "../src/index";

function trim(str) {
  return str.replace(/^\s+|\s+$/, "");
}

describe("<%= description %>", () => {
  const fixturesDir = path.join(__dirname, "fixtures");

  fs.readdirSync(fixturesDir).map(caseName => {
    const fixtureDir = path.join(fixturesDir, caseName);
    const actualFile = path.join(fixtureDir, "actual.js");
    const expectedFile = path.join(fixtureDir, "expected.js");

    it(`should ${caseName.split("-").join(" ")}`, () => {
      const actual = babel.transformFileSync(actualFile, {
        plugins: [plugin(babel)]
      }).code;
      const expected = fs.readFileSync(expectedFile).toString();

      assert.equal(trim(actual), trim(expected));
    });
  });
});
