export {
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
};

const convertCelsiusToKelvin = (temperature: number) => temperature + 273.15;
const convertKelvinToCelsius = (temperature: number) => temperature - 273.15;

const convertFahrenheitToKelvin = (temperature: number) => (temperature + 459.67) * (5 / 9);
const convertKelvinToFahrenheit = (temperature: number) => temperature * (9 / 5) - 459.67;

const convertRankineToKelvin = (temperature: number) => temperature * (5 / 9);
const convertKelvinToRankine = (temperature: number) => temperature * (9 / 5);

const convertDelisleToKelvin = (temperature: number) => 373.15 - (2 / 3) * temperature;
const convertKelvinToDelisle = (temperature: number) => (3 / 2) * (373.15 - temperature);

const convertNewtonToKelvin = (temperature: number) => temperature * (100 / 33) + 273.15;
const convertKelvinToNewton = (temperature: number) => (temperature - 273.15) * (33 / 100);

const convertReaumurToKelvin = (temperature: number) => temperature * (5 / 4) + 273.15;
const convertKelvinToReaumur = (temperature: number) => (temperature - 273.15) * (4 / 5);

const convertRomerToKelvin = (temperature: number) => (temperature - 7.5) * (40 / 21) + 273.15;
const convertKelvinToRomer = (temperature: number) => (temperature - 273.15) * (21 / 40) + 7.5;
