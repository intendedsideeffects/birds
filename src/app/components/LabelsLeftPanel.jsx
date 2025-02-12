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
                width: '8px',
                height: '8px',
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
                width: '16px',
                height: '16px',
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
                width: '32px',
                height: '32px',
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
                backgroundColor: '#000000',
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
                backgroundColor: '#333333',
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
                backgroundColor: '#666666',
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
                backgroundColor: '#999999',
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
                backgroundColor: '#CCCCCC',
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
                backgroundColor: '#FFFFFF',
                border: '1px solid #CCCCCC',
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
