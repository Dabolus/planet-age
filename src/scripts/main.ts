import planetsConfig from '../data/planets.yml';
import { isDate } from './validators';
import { configurePlanet } from './planet';
import { navigate, setupRouter, computeUrl, getRoutingData } from './routing';
import { debounce } from './utils';

const birthdayPicker = document.querySelector<HTMLInputElement>('#birthday')!;
const startButton = document.querySelector<HTMLButtonElement>('#start')!;
const main = document.querySelector<HTMLDivElement>('main')!;

const { revolutionTime: earthRevolutionTime } = planetsConfig.find(
  ({ id }) => id === 'earth',
)!;

const planets = planetsConfig.map(planetConfig =>
  configurePlanet({
    ...planetConfig,
    earthRevolutionTime,
  }),
);

const planetsKeyVal = Object.fromEntries(
  planets.map(planet => [planet.id, planet]),
);

setupRouter((date, planet) => {
  if (date) {
    birthdayPicker.value = date.toISOString().slice(0, 10);
  }
  startButton.disabled = !date;
  main.className = date ? '' : 'locked';

  if (!date || !planet) {
    window.scrollTo({
      left: 0,
      top: 0,
      behavior: 'smooth',
    });
    return;
  }

  const birthday = new Date(date);

  planets.forEach(planet => planet.computeAge(birthday));

  const { ref, background } = planetsKeyVal[planet];

  ref.scrollIntoView({ behavior: 'smooth' });
  main.style.backgroundColor = background;
});

birthdayPicker.addEventListener('input', ({ target }) => {
  const { value } = target as HTMLInputElement;

  startButton.disabled = !isDate(value);
});

startButton.addEventListener('click', () => {
  const { value } = birthdayPicker;

  if (!isDate(value)) {
    return;
  }

  navigate(new Date(value), 'earth');
});

main.addEventListener(
  'scroll',
  () => {
    const planet = planets[Math.round(main.scrollTop / window.innerHeight) - 1];

    if (planet) {
      main.style.backgroundColor = planet.background;
    }
  },
  { passive: true },
);
main.addEventListener(
  'scroll',
  debounce(() => {
    const planet = planets[Math.round(main.scrollTop / window.innerHeight) - 1];

    const { path, date } = getRoutingData();
    const newPath = computeUrl(date, planet?.id);

    if (path !== newPath) {
      history.pushState({}, '', newPath);
    }
  }, 100),
  { passive: true },
);
