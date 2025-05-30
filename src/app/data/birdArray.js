import birdVariants from "./birds-sounds";
const STATUS_HEIGHT = 12500;
const STATUS_WIDTH = 1600;
const getYearPosition = (year) => {
  return ((2200 - year) / (2200 - 1500)) * STATUS_HEIGHT;
};

function createBirdVariant(index) {
  const variant = birdVariants[index];
  return {
    x:
      Math.random() * STATUS_WIDTH -
      STATUS_WIDTH / 2 +
      (Math.random() - 0.5) * 100,
    y: getYearPosition(
      variant.name === "Kaua'i 'Ō'ō"
        ? 1987
        : 1987 + Math.random() * (2200 - 1987)
    ),
    name: variant.name,
    species: variant.species,
    location: variant.location,
    year: 1987,
    story: variant.story,
    sound: variant.sound,
    size: 18,
    status: variant.status,
    tooltipStatus: variant.tooltipStatus,
    highlighted: true,
  };
}

const birdArr = Array.from({ length: 5 }, (_, i) => createBirdVariant(i));
export default birdArr
