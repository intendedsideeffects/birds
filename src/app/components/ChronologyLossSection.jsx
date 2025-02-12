import React from 'react'

function ChronologyLoss() {
  return (
    <div className="relative z-10">
      <section className="min-h-screen bg-black text-white flex flex-col items-center justify-center text-center">
        <div className="max-w-4xl mx-auto">
          <p className="w-full whitespace-pre-line break-words text-4xl font-bold mb-8">
            {`By 2200 it is estimated\n
                that 26% of bird species\n
                  will be extinct.`}
          </p>
        </div>
        <img
          src="/bird-gradient.jpg"
          alt="gradient"
          style={{
            maxWidth: '97.3%',
            zIndex: 1000,
            transform: 'scaleX(1.0281)',
          }}
        />
      </section>
      <section className="bg-white text-black flex flex-col items-center justify-center px-4">
        <div className="zindexx max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-light mb-8">
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
            CHRONOLOGY OF LOSS
          </h2>
        </div>
      </section>
    </div>
  );
}

export default ChronologyLoss;

