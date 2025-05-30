import React from 'react'

function LabelsLeftPanel({labelsHidden, setLabelsHidden}) {
  return (
    <div
      className={labelsHidden ? 'sliding-panel' : 'sliding-panel open'}
      id="panel">
      <div className="panel-tab" onClick={() => setLabelsHidden(!labelsHidden)}>
        <span style={{ color: 'black' }}>{labelsHidden ? 'LEGEND➡' : '⬅'}</span>
      </div>
      <div
        style={{
          position: 'sticky',
          top: '240px',
          left: '20px',
          zIndex: 10,
        }}>
        <div style={{ marginBottom: '48px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
            <span
              className="dot-labels-wrapper"
              style={{
                width: '12px',
                height: '12px',
                borderRadius: '50%',
                backgroundColor: '#999999',
                marginRight: '8px',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px' }}>
              Bird
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
            <span
              className="dot-labels-wrapper"
              style={{
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: '#999999',
                marginRight: '8px',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px' }}>
              Bird with Story
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
            <span
              className="dot-labels-wrapper"
              style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                backgroundColor: '#999999',
                marginRight: '8px',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px' }}>
              Bird with Story & Sound
            </span>
          </div>
        </div>

        <div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
            <span
              className="dot-labels-wrapper"
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'rgba(0,0,0,0.85)',
                marginRight: '8px',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px' }}>
              Extinct
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
            <span
              className="dot-labels-wrapper"
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'rgba(51,51,51,0.9)',
                marginRight: '8px',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px' }}>
              Extinct in the Wild
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
            <span
              className="dot-labels-wrapper"
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'rgba(102,102,102,0.8)',
                marginRight: '8px',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px' }}>
              Critically Endangered
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
            <span
              className="dot-labels-wrapper"
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'rgba(153,153,153,0.7)',
                marginRight: '8px',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px' }}>
              Endangered
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
            <span
              className="dot-labels-wrapper"
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'rgba(204,204,204,0.6)',
                marginRight: '8px',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px' }}>
              Vulnerable
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '8px',
            }}>
            <span
              className="dot-labels-wrapper"
              style={{
                width: '16px',
                height: '16px',
                borderRadius: '50%',
                backgroundColor: 'rgba(245,245,245,1)',
                marginRight: '8px',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px' }}>
              Near Threatened
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabelsLeftPanel
