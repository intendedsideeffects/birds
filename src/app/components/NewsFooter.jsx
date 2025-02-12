import React from 'react';

function NewsFooter({ news }) {
  // Sort news by date in descending order
  const sortedNews = [...news].sort((a, b) => {
    const dateA = a.Snippet ? new Date(a.Snippet.match(/([A-Za-z]{3,} \d{1,2}, \d{4})/)?.[0]) : new Date(0);
    const dateB = b.Snippet ? new Date(b.Snippet.match(/([A-Za-z]{3,} \d{1,2}, \d{4})/)?.[0]) : new Date(0);
    return dateB - dateA;
  });

  return (
    <div className="h-[700vh] bg-white text-black flex flex-col justify-center items-start relative p-40 overflow-hidden">
      {sortedNews.map((article, index) => {
        // Extract date from Snippet (if applicable)
        let publishedDate = "No Date Available";
        if (article.Snippet) {
          const dateMatch = article.Snippet.match(/([A-Za-z]{3,} \d{1,2}, \d{4})/);
          if (dateMatch) {
            publishedDate = dateMatch[0]; // Extract and assign the found date
          }
        }

        // Adjust positioning for the news items
        const isLeft = index % 2 === 0;
        const leftPosition = isLeft ? '65%' : '5%'; // Change these values to move the text left/right
        const topPosition = `${index * 120 + 50}vh`; // Reduced initial spacing by half

        return (
          <div
            key={article.Title}
            className="absolute max-w-lg flex flex-col items-start"
            style={{ top: `calc(${topPosition} + 5rem)`, left: leftPosition, width: '35%' }} // Keeps the 4rem spacing
          >
            {/* Display extracted publication date in smaller font */}
            <p className="text-xl text-gray-500 font-light mb-20">{publishedDate}</p> {/* Increased mb to 8 for a bigger gap */}
            <a
              className="text-6xl font-light italic hover:underline block whitespace-pre-line overflow-hidden text-ellipsis"
              href={article.Link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.Title} {/* Italicized text */}
            </a>
          </div>
        );
      })}
      {['RE', 'SI', 'ST', 'AN', 'CE'].map((letter, index) => {
        // Adjust positioning for the RESISTANCE letters
        const isLeft = index % 2 !== 0;
        const leftPosition = isLeft ? '73%' : '30%'; // Change these values to move letters left/right
        const topPosition = `${index * 120 + 50}vh`; // Reduced initial spacing by half
        return (
          <h2
            key={index}
            className="absolute text-[80vh] font-light text-black leading-none"
            style={{ top: topPosition, left: leftPosition, transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
          >
            {letter} {/* Adjusted text color to black */}
          </h2>
        );
      })}
    </div>
  );
}

export default NewsFooter;

















