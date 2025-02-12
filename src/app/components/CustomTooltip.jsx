



const CustomTooltip = ({ active, payload, coordinate }) => {
  if (!active || !payload?.[0]) return null;
  const bird = payload[0].payload;
  console.log(bird);
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  const scrollY = window.scrollY;

  const tooltipWidth = 200;
  const tooltipHeight = bird.story ? 200 : 100;

  let left = (coordinate?.x || 0) + 20;
  let top = (coordinate?.y || 0) + scrollY - tooltipHeight / 2;

  // Viewport bounds checking with scroll consideration
  if (left + tooltipWidth > viewportWidth) {
    left = (coordinate?.x || 0) - tooltipWidth - 20;
  }

  const absoluteTop = top - scrollY;
  if (absoluteTop + tooltipHeight > viewportHeight) {
    top = scrollY - viewportHeight * 2.9 - tooltipHeight - 20;
  }
  if (absoluteTop < 700) {
    top = scrollY - viewportHeight * 3.1 + 20;
  }
  if (absoluteTop < 0) {
    top = scrollY + 20;
  }

  const formatStory = (story) => {
    if (!story) return '';
    const words = story.split(' ');
    const lines = [];
    let currentLine = '';
    const maxLineLength = 40;

    words.forEach((word) => {
      if ((currentLine + ' ' + word).length <= maxLineLength) {
        currentLine += (currentLine ? ' ' : '') + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    });
    if (currentLine) {
      lines.push(currentLine);
    }
    return lines.join('\n');
  };

  return (
    <div
      style={{
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        color: 'black',
        padding: '1rem',
        border: '1px solid #ccc',
        borderRadius: '4px',

        width: '200px',
        position: 'absolute',
        left: `${left + 150}px`,
        top: `${top}px`,
        transform: 'none',
      }}>
      <p
        style={{
          fontWeight: 'bold',
          fontSize: '1.2em',
          marginBottom: '0.5rem',
        }}>
        {bird.name || 'Unknown Bird'}
      </p>
      <p style={{ fontStyle: 'italic', marginBottom: '0.5rem' }}>
        {bird.species || 'Unknown Species'}
      </p>
      <p style={{ marginBottom: '0.25rem' }}>
        <strong>Location:</strong> {bird.location || 'Unknown'}
      </p>
      <p style={{ marginBottom: '0.25rem' }}>
        <strong>Year:</strong> {bird.ext_date || 'Unknown Year'}
      </p>
      <p style={{ marginBottom: '0.25rem' }}>
        <strong>Status:</strong> {bird.status || 'Unknown Year'}
      </p>
      {bird.story && (
        <p
          style={{
            marginTop: '0.5rem',
            borderTop: '1px solid #eee',
            paddingTop: '0.5rem',
            whiteSpace: 'pre-line',
            lineHeight: '1.4',
          }}>
          {formatStory(bird.story)}
        </p>
      )}
    </div>
  );
};
export default CustomTooltip
