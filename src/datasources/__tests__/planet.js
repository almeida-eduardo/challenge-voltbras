// Mock config file to set the numberPages configuration
jest.mock('../../config');

const PlanetAPI = require('../planet');

/**
 * There are mock Planets at the bottom of this file.
 * 1 mock for the RAW API reponse, and another
 * for the shape of the planet after it would have been
 * transformed by the planet reducer.
 */

const mocks = {
  get: jest.fn(),
  getAllPlanetsPage: jest.fn(),
};

const ds = new PlanetAPI();
ds.get = mocks.get;

describe('[PlanetAPI.planetReducer]', () => {
  it('properly transforms planet from the Arcsecond api', () => {
    expect(ds.planetReducer(mockPlanetsResponse.results[0])).toEqual(mockPlanet);
  });
});

describe('[PlanetAPI.getAllPlanetsPage]', () => {
  it('looks up planets from api', async () => {
    // if api response is list of raw planets,
    // res should be list of transformed planets
    mocks.get.mockReturnValueOnce(mockPlanetsResponse);
    const res = await ds.getAllPlanetsPage(1);

    expect(res).toEqual([mockPlanet]);
    expect(mocks.get).toBeCalledWith('exoplanets', { 'page': 1 });
  });

  it('returns empty array if no planet results from api', async () => {
    mocks.get.mockReturnValueOnce({});

    const res = await ds.getAllPlanetsPage(1);

    expect(res).toEqual([]);
  });
});

describe('[PlanetAPI.getAllPlanets]', () => {
  it('looks up all pages from api', async () => {
    ds.getAllPlanetsPage = mocks.getAllPlanetsPage;
    mocks.getAllPlanetsPage.mockReturnValueOnce([mockPlanet]);
    const res = await ds.getAllPlanets();

    expect(res).toEqual([mockPlanet]);
  });

  it('returns empty array if no pages from api', async () => {
    ds.getAllPlanetsPage = mocks.getAllPlanetsPage;
    mocks.getAllPlanetsPage.mockReturnValueOnce([]);
    const res = await ds.getAllPlanets();

    expect(res).toEqual([]);
  });
});


/**
 * MOCK DATA BELOW
 */

// properly transformed planet
const mockPlanet = {
  name: 'Marte',
  mass: 31.11,
  unit: 'M_jup',
  hasStation: false,
};

// raw planets response from Arcsecond api
const mockPlanetsResponse = {
    count: 4628,
    next: 'https://api.arcsecond.io/exoplanets/?page=3',
    previous: 'https://api.arcsecond.io/exoplanets/',
    results: [
        {
            name: 'Marte',
            coordinates: {
                system: 'ICRS',
                right_ascension: 240.0958,
                right_ascension_units: 'degrees',
                declination: 15.5469,
                declination_units: 'degrees',
                epoch: 2451545.0
            },
            mass: {
                value: 31.11,
                unit: 'M_jup',
                error_max: null,
                error_min: null,
                bibcode: ''
            },
            radius: null,
            inclination: null,
            semi_major_axis: {
                value: 0.539,
                unit: 'AU',
                error_max: null,
                error_min: null,
                bibcode: ''
            },
            orbital_period: {
                value: 137.48,
                unit: 'days',
                error_max: 0.34,
                error_min: 0.34,
                bibcode: ''
            },
            eccentricity: {
                value: 0.26,
                error_max: 0.1,
                error_min: 0.1,
                bibcode: ''
            },
            omega_angle: {
                value: 302.0,
                unit: 'º',
                error_max: 33.0,
                error_min: 33.0,
                bibcode: ''
            },
            anomaly_angle: null,
            lambda_angle: null,
            time_periastron: {
                value: 2453464.0,
                error_max: 16.0,
                error_min: 16.0,
                bibcode: ''
            },
            time_conjonction: null,
            angular_distance: null,
            tzero_primary_transit: null,
            tzero_secondary_transit: null,
            impact_parameter: null,
            tzero_radial_velocity: null,
            velocity_semiamplitude: null,
            calculated_temperature: null,
            measured_temperature: null,
            hottest_point_longitude: null,
            geometric_albedo: null,
            surface_gravity: null,
            detection_method: 'Radial Velocity',
            mass_detection_method: 'Radial Velocity',
            radius_detection_method: 'Radial Velocity',
            parent_star: 'BD+15 2940'
        },
    ]
};

module.exports.mockPlanetsResponse = mockPlanetsResponse;
