const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.[0]) return null;
  const bird = payload[0].payload;
  
  const decodeText = (text) => {
    if (!text) return '';
    return text
      .replace(/&#39;/g, "'")
      .replace(/&quot;/g, '"')
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&amp;/g, '&');
  };
  
  return (
    <div className="bg-white/95 text-black p-4 rounded border border-gray-300 w-96 shadow-lg font-arial-sans text-lg">
      <p className="font-bold text-lg mb-2">
        {decodeText(bird.name) || 'Unknown Bird'}
      </p>
      <p className="italic mb-2">
        {decodeText(bird.species) || 'Unknown Species'}
      </p>
      <p className="mb-1">
        <strong>Location:</strong> {decodeText(bird.location) || 'Unknown'}
      </p>
      {bird.ext_date && (
        <p className="mb-1">
          <strong>Year:</strong> {bird.ext_date}
        </p>
      )}
      <p className="mb-1">
        <strong>Status:</strong> {decodeText(bird.tooltipStatus || (bird.status === 'EX' ? 'Extinct' : bird.status)) || 'Unknown Status'}
      </p>
      {bird.story && (
        <p className="mt-2 pt-2 border-t border-gray-200 whitespace-pre-line leading-relaxed">
          {decodeText(bird.story)}
        </p>
      )}
    </div>
  );
};

export default CustomTooltip;




