const getRegionColor = (status) => {
  const colors = {
    'Extinct': '#000000',
    'Extinct in the Wild': '#333333',
    'Critically Endangered': '#666666',
    'Endangered': '#999999',
    'Vulnerable': '#CCCCCC',
    'Near Threatened': '#E0E0E0' // Slightly darker light grey
  };
  return colors[status] || '#999999';
};

export default getRegionColor;

