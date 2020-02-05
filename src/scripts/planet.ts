export type Planet = typeof import('../planets.json')[0];

const dateFormat = new Intl.DateTimeFormat();

export const configurePlanet = ({ id, revolutionTime }: Planet) => {
  const ageElement = document.querySelector<HTMLElement>(`#${id}-age`);
  const nextBirthdayElement = document.querySelector<HTMLElement>(
    `#${id}-birthday`,
  );

  return {
    computeAge(birthday: Date) {
      const now = Date.now();
      const earthAge = (now - birthday.getTime()) / 86400000; // Number of milliseconds in a day

      const floatYears = earthAge / revolutionTime;
      const intYears = Math.floor(floatYears);
      const days = Math.floor((floatYears - intYears) * revolutionTime);

      const yearsString =
        intYears > 0 ? `${intYears} year${intYears === 1 ? '' : 's'}` : '';
      const daysString = days > 0 ? `${days} day${days === 1 ? '' : 's'}` : '';
      const finalString = `≈ ${yearsString}${
        yearsString && daysString ? ' and' : ''
      } ${daysString}`;

      ageElement.innerText = finalString;

      if (id === 'earth') {
        nextBirthdayElement.innerText = dateFormat.format(birthday);
        return;
      }

      const nextBirthday = new Date(
        now +
          revolutionTime *
            (1 -
              (earthAge / revolutionTime > 1
                ? earthAge / revolutionTime -
                  Math.floor(earthAge / revolutionTime)
                : earthAge / revolutionTime)) *
            86400000,
      );

      const formattedDate = isNaN(nextBirthday.valueOf())
        ? 'never'
        : dateFormat.format(nextBirthday);

      nextBirthdayElement.innerText = formattedDate;
    },
  };
};
