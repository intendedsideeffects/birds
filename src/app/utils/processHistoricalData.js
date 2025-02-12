const STATUS_HEIGHT = 12500;
const STATUS_WIDTH = 1600;
const getYearPosition = (year) => {
  return ((2200 - year) / (2200 - 1500)) * STATUS_HEIGHT;
};

const processHisoricalData = (historicalData) =>
  historicalData
    ?.filter((bird) => {
      const year = parseInt(bird.extinction_year);
      return (
        bird.extinction_year && bird.extinction_year !== 'NA' && year >= 1500
      );
    })
    .map((bird) => {
      const year = parseInt(bird.extinction_year);
      const y = getYearPosition(year);
      const x =
        Math.random() * STATUS_WIDTH -
        STATUS_WIDTH / 2 +
        (Math.random() - 0.5) * 100;

      return {
        x,
        y,
        name: bird.name || bird.species,
        species: bird.species,
        location: bird.archip?.replace(/\*$/, '').trim() || '-',
        year,
        story: bird.story,
        size: bird.story && bird.story.trim().length > 0 ? 8 : 4,
        status: 'Extinct',
        ext_date: bird.extinction_year,
      };
    });
export default processHisoricalData;
