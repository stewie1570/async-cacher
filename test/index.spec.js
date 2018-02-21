import { testFunc } from '../src/index'

describe("Tests", () => {
    it("should import and test systems under test", () => {
        expect(testFunc()).toBeTruthy();
    });
});