import React from 'react';

function NewsFooter({ news }) {
  // Ensure news is an array before mapping
  if (!Array.isArray(news)) {
    console.error("Error: News data is not an array", news);
    return <div className="p-40 text-2xl text-red-500">Error loading news data.</div>;
  }

  console.log("News Data Received:", news); // Debugging log

  // Function to extract the date from Snippet safely
  const extractDate = (snippet) => {
    if (!snippet) return null;
    const match = snippet.match(/([A-Za-z]{3,} \d{1,2}, \d{4})/);
    return match ? new Date(match[0]) : null;
  };

  // Sort news by date in descending order
  const sortedNews = [...news].sort((a, b) => {
    const dateA = extractDate(a.Snippet) || new Date(0);
    const dateB = extractDate(b.Snippet) || new Date(0);
    return dateB - dateA;
  });

  return (
    <div className="h-[700vh] bg-white text-black flex flex-col justify-center items-start relative p-40 overflow-hidden">
      {sortedNews.map((article, index) => {
        // Extract date from Snippet
        let publishedDate = "No Date Available";
        const extractedDate = extractDate(article.Snippet);
        if (extractedDate) {
          publishedDate = extractedDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        }

        // Adjust positioning for the news items
        const isLeft = index % 2 === 0;
        const leftPosition = isLeft ? '65%' : '5%'; // Adjust alignment
        const topPosition = `${index * 120 + 50}vh`; // Adjust vertical spacing

        return (
          <div
            key={article.Title}
            className="absolute max-w-lg flex flex-col items-start"
            style={{ top: `calc(${topPosition} + 4rem)`, left: leftPosition, width: '35%' }}
          >
            {/* Display extracted publication date */}
            <p className="text-xl text-gray-500 font-light mb-8">{publishedDate}</p>
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



















