const STATUS_HEIGHT = 12500;
const STATUS_WIDTH = 1600;
const getYearPosition = (year) => {
  return ((2200 - year) / (2200 - 1500)) * STATUS_HEIGHT;
};

const processFutureData = (historicalData) =>
  historicalData?.map((bird) => {
    let y;
    if (
      bird.description === 'Extinct in the Wild' ||
      bird.description === 'Critically Endangered (Possibly Extinct)'
    ) {
      y = getYearPosition(1959 + Math.random() * (2050 - 1959));
    } else if (bird.description === 'Critically Endangered') {
      y = getYearPosition(2000 + Math.random() * (2070 - 2000));
    } else if (bird.description === 'Vulnerable') {
      y = getYearPosition(2030 + Math.random() * (2200 - 2030));
    } else if (bird.description === 'Near Threatened') {
      y = getYearPosition(2060 + Math.random() * (2200 - 2060));
    } else {
      y = getYearPosition(2050 + Math.random() * 150);
    }

    const x =
      Math.random() * STATUS_WIDTH -
      STATUS_WIDTH / 2 +
      (Math.random() - 0.5) * 100;

    return {
      x,
      y,
      name: bird.commonName || bird.species,
      species: bird.species,
      location: bird.archip,
      status: bird.description,
      story: bird.story || null,
      size:
        bird.story && bird.story.trim().length > 0
          ? bird.highlighted
            ? 18
            : 8
          : 4,
      isFuture: true,
      year: 2024,
    };
  });

export default processFutureData;
