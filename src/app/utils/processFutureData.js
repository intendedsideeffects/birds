const STATUS_HEIGHT = 12500;
const STATUS_WIDTH = 1600;

const getYearPosition = (year) => {
  return ((2200 - year) / (2200 - 1500)) * STATUS_HEIGHT;
};

// Sort order for IUCN codes: most endangered first
const IUCN_ORDER = ['EX', 'EW', 'CR', 'EN', 'VU', 'NT'];

const processFutureData = (data) => {
  // Sort by IUCN code (most endangered first)
  const sorted = [...(data || [])].sort((a, b) => {
    const aIdx = IUCN_ORDER.indexOf(a.iucn_category_2021);
    const bIdx = IUCN_ORDER.indexOf(b.iucn_category_2021);
    return (aIdx === -1 ? 99 : aIdx) - (bIdx === -1 ? 99 : bIdx);
  });

  const totalBirds = sorted.length;

  return sorted.map((bird, idx) => {
    let category = bird.iucn_category_2021 || bird.description;
    let y;

    // Calculate year based on index, skewed towards 2200
    // Using a power of 2 for the index ratio makes it more exponential-like
    const baseYear = 1970 + (2200 - 1970) * Math.pow(idx / (totalBirds > 1 ? totalBirds - 1 : 1), 2);

    // Add a small random jitter to the year to avoid perfect vertical alignment
    const year = baseYear + (Math.random() - 0.5) * 20; // Jitter by up to +/- 10 years

    // Distribute dots more towards the end of the timeline
    if (
      category === 'Extinct in the Wild' ||
      category === 'Critically Endangered (Possibly Extinct)' ||
      category === 'CR' || category === 'Critically Endangered'
    ) {
      // Critically Endangered and EW: More spread, but still leaning later
      y = getYearPosition(2020 + Math.random() * (2100 - 2020));
    } else if (category === 'EN' || category === 'Endangered') {
      // Endangered: Stronger lean towards later years
      y = getYearPosition(2050 + Math.random() * (2150 - 2050));
    } else if (category === 'VU' || category === 'Vulnerable') {
      // Vulnerable: Even stronger lean towards later years
      y = getYearPosition(2080 + Math.random() * (2180 - 2080));
    } else if (category === 'NT' || category === 'Near Threatened') {
      // Near Threatened: Most skewed towards the end
      y = getYearPosition(2100 + Math.random() * (2200 - 2100));
    } else {
      // Default for other categories, also leaning late
      y = getYearPosition(2150 + Math.random() * 50);
    }

    const x =
      Math.random() * STATUS_WIDTH -
      STATUS_WIDTH / 2 +
      (Math.random() - 0.5) * 100;

    let size = 6; // Default small size (increased from 4)
    const hasStory = bird.story && bird.story.trim().length > 0;
    const hasSound = bird.sound && bird.sound.trim().length > 0;

    if (hasStory && hasSound) {
      size = 18; // Large size (remains 18)
    } else if (hasStory) {
      size = 10; // Medium size (increased from 8)
    }
    // Small size (6) is already set as default

    return {
      x,
      y,
      name: bird.common_name || bird.species,
      species: bird.species,
      location: bird.archip?.trim() || '-',
      status: bird.iucn_category_2021,
      tooltipStatus: bird.description,
      story: bird.story?.trim() || null,
      size,
      isFuture: true,
      year: Math.round(year), // Store the calculated year
      common_name: bird.common_name,
      iucn_category_2021: bird.iucn_category_2021,
      description: bird.description,
      // fill and showOutline are now determined in FloatingDot based on size
    };
  });
};

export default processFutureData;

// 🔽 Add this fetcher function at the bottom
// Removed unused supabase import

export async function fetchAndProcessFutureData() {
  const { data, error } = await supabase.from('future_stories').select('*');
  if (error) {
    console.error('Error fetching future data:', error);
    return [];
  }
  return processFutureData(data);
}


