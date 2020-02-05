import planetsConfig from '../planets.json';
import { installRouter } from './router';
import { configurePlanet } from './planet';
import { validateAge, validatePlanet } from './validators';

export const start = () => {
  const birthdayPicker = document.querySelector<HTMLInputElement>('#birthday');
  const startButton = document.querySelector<HTMLButtonElement>('#start');

  const cachedDate = localStorage.getItem('date');

  if (cachedDate) {
    birthdayPicker.value = cachedDate;
  }

  const planets = planetsConfig.map(planetConfig =>
    configurePlanet(planetConfig),
  );

  installRouter(path => {
    const [, age, planet] = path.split('/');

    if (!validateAge(age) || !validatePlanet(planet)) {
      window.scrollTo({
        left: 0,
        top: 0,
        behavior: 'smooth',
      });
    }
  });

  birthdayPicker.addEventListener('input', ({ target }) => {
    const { value } = target as HTMLInputElement;

    startButton.disabled = !validateAge(value);
  });

  startButton.addEventListener('click', () => {
    const { value } = birthdayPicker;

    if (!validateAge(value)) {
      return;
    }

    const birthday = new Date(value);

    planets.forEach(planet => planet.computeAge(birthday));
  });
};
