const getRegionColor = (status) => {
  const colors = {
    'EX': 'rgba(0,0,0,0.85)', // Extinct with slightly less transparency
    'EW': 'rgba(51,51,51,0.9)', // Extinct in the Wild
    'CR': 'rgba(102,102,102,0.8)', // Critically Endangered
    'EN': 'rgba(153,153,153,0.7)', // Endangered
    'VU': 'rgba(204,204,204,0.6)', // Vulnerable
    'NT': 'rgba(245,245,245,1)', // Near Threatened (lighter grey)
  };
  return colors[status] || 'rgba(200,200,200,0.5)'; // default: light grey with transparency
};

export default getRegionColor;

