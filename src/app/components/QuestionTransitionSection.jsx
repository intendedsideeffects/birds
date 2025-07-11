import React, { useRef, useEffect, useState } from 'react';

const QuestionTransitionSection = () => {
  const ref = useRef();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new window.IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.2 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={ref}
      style={{
        minHeight: '60vh',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        background: 'linear-gradient(to top, white 80%, rgba(255,255,255,0) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <h2
        style={{
          fontSize: '2.5rem',
          fontStyle: 'italic',
          color: '#111',
          margin: 0,
          marginBottom: '10vh',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(60px)',
          transition: 'opacity 0.7s cubic-bezier(.4,0,.2,1), transform 0.7s cubic-bezier(.4,0,.2,1)',
        }}
      >
        If we are here, now, can we face the numbers?
      </h2>
    </section>
  );
};

export default QuestionTransitionSection; 