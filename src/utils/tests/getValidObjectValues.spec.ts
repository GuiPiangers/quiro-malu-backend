import { getValidObjectValues } from "../getValidObjectValues";

describe("Get valid values of objects", () => {
  it("should remove fields with invalid values and keep fields with valid values", () => {
    const invalidObject = {
      name: "Guilherme",
      phone: undefined,
      age: null,
      number: 0,
      array: [],
      object: {
        marcos: {
          id: "123",
        },
      },
      objectEmpty: {},
      boolean: false,
    };

    const validObject = getValidObjectValues(invalidObject);
    console.log(validObject);

    expect(validObject).toEqual({
      name: "Guilherme",
      number: 0,
      array: [],
      object: {
        marcos: {
          id: "123",
        },
      },
      objectEmpty: {},
      boolean: false,
    });
  });
});
