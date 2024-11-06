import { Location, LocationDTO } from "../Location";
import { Cep } from "../../shared/Cep";
import { Name } from "../../shared/Name";

jest.mock("../../shared/Cep");
jest.mock("../../shared/Name");

describe("Location", () => {
  const MockedCep = Cep as jest.MockedClass<typeof Cep>;
  const MockedName = Name as jest.MockedClass<typeof Name>;

  beforeEach(() => {
    MockedCep.mockClear();
    MockedName.mockClear();
  });

  test("should create Location with valid values", () => {
    MockedCep.mockImplementation((cep: string) => ({ value: cep }) as Cep);
    MockedName.mockImplementation((name: string) => ({ value: name }) as Name);

    const locationProps: LocationDTO = {
      cep: "12345-678",
      state: "State",
      city: "City",
      neighborhood: "Neighborhood",
      address: "Address",
    };

    const location = new Location(locationProps);

    expect(location.cep).toBe("12345-678");
    expect(location.state).toBe("State");
    expect(location.city).toBe("City");
    expect(location.neighborhood).toBe("Neighborhood");
    expect(location.address).toBe("Address");
  });

  test("should return correct LocationDTO", () => {
    MockedCep.mockImplementation((cep: string) => ({ value: cep }) as Cep);
    MockedName.mockImplementation((name: string) => ({ value: name }) as Name);

    const locationProps: LocationDTO = {
      cep: "12345-678",
      state: "State",
      city: "City",
      neighborhood: "Neighborhood",
      address: "Address",
    };

    const location = new Location(locationProps);
    const locationDTO = location.getLocationDTO();

    expect(locationDTO).toEqual({
      cep: "12345-678",
      state: "State",
      city: "City",
      neighborhood: "Neighborhood",
      address: "Address",
    });
  });
});
