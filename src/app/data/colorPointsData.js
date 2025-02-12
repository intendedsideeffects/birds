 const getRegionColor = (status) => {
  const threatColors = {
    Extinct: '#000000', // Keeping original grey for Extinct
    'Extinct in the Wild': '#800080', // Purple from IUCN chart
    'Critically Endangered (Possibly Extinct)': '#FFA07A', // Light pink from IUCN chart
    'Critically Endangered': '#FFA07A', // Light pink
    Endangered: '#FFB6C1', // Light pink
    Vulnerable: '#FFE5B4', // Light peach from IUCN chart
    'Near Threatened': '#A8A8A8', // Dark gray from IUCN chart
  };
  return threatColors[status] || '#D3D3D3'; // Default to light gray
};

export default getRegionColor
