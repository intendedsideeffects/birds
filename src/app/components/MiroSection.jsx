import React from 'react'

function MiroSection() {
  return (
    <div className="zindexx bg-white flex flex-col items-center justify-center text-center ">
      <img
        src="/bird-gradient.jpg"
        alt="gradient"
        style={{
          width: '97.3%',
          height: '500px',
          transform: 'rotate(180deg) scaleX(1.0281)',
        }}
      />
      <div className="w-full  mx-auto">
        <div style={{ position: 'relative', width: '100%', height: '100vh' }}>
          <iframe
            src="https://miro.com/app/live-embed/uXjVLpU8mU4=/?autoplay=true&moveToViewport=-11469,-3000,1093,512&embedId=896645744052"
            scrolling="no"
            allow="fullscreen; clipboard-read; clipboard-write"
            style={{
              border: 'none',
              width: '100%',
              height: '110vh',
              transform: 'translateY(0px)',
            }}></iframe>
        </div>
      </div>
      <img
        src="/bird-gradient.jpg"
        alt="gradient"
        style={{
          width: '97.3%',
          transform: 'scaleX(1.0281)',
          clipPath: 'inset(50% 0 0 0)',
        }}
      />
    </div>
  );
}

export default MiroSection
