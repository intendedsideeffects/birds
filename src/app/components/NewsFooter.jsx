import React from 'react';

function NewsFooter({ news }) {
  // Ensure news is an array before mapping
  if (!Array.isArray(news)) {
    console.error("Error: News data is not an array", news);
    return <div className="p-40 text-2xl text-red-500">Error loading news data.</div>;
  }

  console.log("News Data Received:", news); // Debugging log

  // Extract date from Snippet correctly and sort by date (newest first)
  const sortedNews = [...news]
    .map((article) => {
      let publishedDate = null;
      if (article.Snippet) {
        const dateMatch = article.Snippet.match(/([A-Za-z]{3,} \d{1,2}, \d{4})/);
        if (dateMatch) {
          publishedDate = new Date(dateMatch[0]);
        }
      }
      return { ...article, publishedDate };
    })
    .filter(article => article.publishedDate) // Remove entries without dates
    .sort((a, b) => b.publishedDate - a.publishedDate); // Sort newest to oldest

  return (
    <div className="h-[700vh] bg-white text-black flex flex-col justify-center items-start relative p-40 overflow-hidden">
      {sortedNews.map((article, index) => {
        // Format extracted publication date for display
        const formattedDate = article.publishedDate
          ? article.publishedDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
          : "No Date Available";

        // Adjust positioning for the news items
        const isLeft = index % 2 === 0;
        const leftPosition = isLeft ? '65%' : '5%'; // Adjust left/right position
        const topPosition = `${index * 120 + 50}vh`; // Adjust vertical spacing

        return (
          <div
            key={article.Title}
            className="absolute max-w-lg flex flex-col items-start"
            style={{ top: `calc(${topPosition} + 4rem)`, left: leftPosition, width: '35%' }}
          >
            {/* Display formatted publication date */}
            <p className="text-xl text-gray-500 font-light mb-8">{formattedDate}</p>
            <a
              className="text-6xl font-light italic hover:underline block whitespace-pre-line overflow-hidden text-ellipsis"
              href={article.Link}
              target="_blank"
              rel="noopener noreferrer"
            >
              {article.Title}
            </a>
          </div>
        );
      })}
      {['RE', 'SI', 'ST', 'AN', 'CE'].map((letter, index) => {
        // Adjust positioning for the RESISTANCE letters
        const isLeft = index % 2 !== 0;
        const leftPosition = isLeft ? '73%' : '30%';
        const topPosition = `${index * 120 + 50}vh`;
        return (
          <h2
            key={index}
            className="absolute text-[80vh] font-light text-black leading-none"
            style={{ top: topPosition, left: leftPosition, transform: 'translateX(-50%)', whiteSpace: 'nowrap' }}
          >
            {letter}
          </h2>
        );
      })}
    </div>
  );
}

export default NewsFooter;




















