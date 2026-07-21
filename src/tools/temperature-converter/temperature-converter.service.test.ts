import { describe, expect, it } from 'vitest';
import {
  convertCelsiusToKelvin,
  convertDelisleToKelvin,
  convertFahrenheitToKelvin,
  convertKelvinToCelsius,
  convertKelvinToDelisle,
  convertKelvinToFahrenheit,
  convertKelvinToNewton,
  convertKelvinToRankine,
  convertKelvinToReaumur,
  convertKelvinToRomer,
  convertNewtonToKelvin,
  convertRankineToKelvin,
  convertReaumurToKelvin,
  convertRomerToKelvin,
} from './temperature-converter.service';

describe('temperature-converter', () => {
  describe('celsius', () => {
    it('converts celsius to kelvin', () => {
      expect(convertCelsiusToKelvin(0)).toBeCloseTo(273.15, 10);
      expect(convertCelsiusToKelvin(100)).toBeCloseTo(373.15, 10);
      expect(convertCelsiusToKelvin(-273.15)).toBeCloseTo(0, 10);
      expect(convertCelsiusToKelvin(-40)).toBeCloseTo(233.15, 10);
    });

    it('converts kelvin to celsius', () => {
      expect(convertKelvinToCelsius(273.15)).toBeCloseTo(0, 10);
      expect(convertKelvinToCelsius(373.15)).toBeCloseTo(100, 10);
      expect(convertKelvinToCelsius(0)).toBeCloseTo(-273.15, 10);
    });
  });

  describe('fahrenheit', () => {
    it('converts fahrenheit to kelvin', () => {
      expect(convertFahrenheitToKelvin(32)).toBeCloseTo(273.15, 10);
      expect(convertFahrenheitToKelvin(212)).toBeCloseTo(373.15, 10);
      expect(convertFahrenheitToKelvin(-459.67)).toBeCloseTo(0, 10);
      expect(convertFahrenheitToKelvin(-40)).toBeCloseTo(233.15, 10);
    });

    it('converts kelvin to fahrenheit', () => {
      expect(convertKelvinToFahrenheit(273.15)).toBeCloseTo(32, 10);
      expect(convertKelvinToFahrenheit(373.15)).toBeCloseTo(212, 10);
      expect(convertKelvinToFahrenheit(0)).toBeCloseTo(-459.67, 10);
    });
  });

  describe('rankine', () => {
    it('converts rankine to kelvin', () => {
      expect(convertRankineToKelvin(0)).toBeCloseTo(0, 10);
      expect(convertRankineToKelvin(491.67)).toBeCloseTo(273.15, 10);
      expect(convertRankineToKelvin(671.67)).toBeCloseTo(373.15, 10);
    });

    it('converts kelvin to rankine', () => {
      expect(convertKelvinToRankine(0)).toBeCloseTo(0, 10);
      expect(convertKelvinToRankine(273.15)).toBeCloseTo(491.67, 10);
      expect(convertKelvinToRankine(373.15)).toBeCloseTo(671.67, 10);
    });
  });

  describe('delisle', () => {
    it('converts delisle to kelvin', () => {
      expect(convertDelisleToKelvin(0)).toBeCloseTo(373.15, 10);
      expect(convertDelisleToKelvin(150)).toBeCloseTo(273.15, 10);
    });

    it('converts kelvin to delisle', () => {
      expect(convertKelvinToDelisle(373.15)).toBeCloseTo(0, 10);
      expect(convertKelvinToDelisle(273.15)).toBeCloseTo(150, 10);
    });
  });

  describe('newton', () => {
    it('converts newton to kelvin', () => {
      expect(convertNewtonToKelvin(0)).toBeCloseTo(273.15, 10);
      expect(convertNewtonToKelvin(33)).toBeCloseTo(373.15, 10);
    });

    it('converts kelvin to newton', () => {
      expect(convertKelvinToNewton(273.15)).toBeCloseTo(0, 10);
      expect(convertKelvinToNewton(373.15)).toBeCloseTo(33, 10);
    });
  });

  describe('reaumur', () => {
    it('converts reaumur to kelvin', () => {
      expect(convertReaumurToKelvin(0)).toBeCloseTo(273.15, 10);
      expect(convertReaumurToKelvin(80)).toBeCloseTo(373.15, 10);
    });

    it('converts kelvin to reaumur', () => {
      expect(convertKelvinToReaumur(273.15)).toBeCloseTo(0, 10);
      expect(convertKelvinToReaumur(373.15)).toBeCloseTo(80, 10);
    });
  });

  describe('romer', () => {
    it('converts romer to kelvin', () => {
      expect(convertRomerToKelvin(7.5)).toBeCloseTo(273.15, 10);
      expect(convertRomerToKelvin(60)).toBeCloseTo(373.15, 10);
    });

    it('converts kelvin to romer', () => {
      expect(convertKelvinToRomer(273.15)).toBeCloseTo(7.5, 10);
      expect(convertKelvinToRomer(373.15)).toBeCloseTo(60, 10);
    });
  });

  describe('round trips', () => {
    const samples = [0, 100, 233.15, 273.15, 310.15, 373.15, 1000];

    it.each([
      ['celsius', convertKelvinToCelsius, convertCelsiusToKelvin],
      ['fahrenheit', convertKelvinToFahrenheit, convertFahrenheitToKelvin],
      ['rankine', convertKelvinToRankine, convertRankineToKelvin],
      ['delisle', convertKelvinToDelisle, convertDelisleToKelvin],
      ['newton', convertKelvinToNewton, convertNewtonToKelvin],
      ['reaumur', convertKelvinToReaumur, convertReaumurToKelvin],
      ['romer', convertKelvinToRomer, convertRomerToKelvin],
    ] as const)('kelvin -> %s -> kelvin returns the initial value', (_scale, fromKelvin, toKelvin) => {
      for (const kelvin of samples) {
        expect(toKelvin(fromKelvin(kelvin))).toBeCloseTo(kelvin, 9);
      }
    });
  });
});
