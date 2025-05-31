import React from 'react'

function LabelsLeftPanel({isOpen, toggleOpen}) {
  console.log('LabelsLeftPanel rendered. isOpen:', isOpen);
  return (
    <div
      className={isOpen ? 'sliding-panel open' : 'sliding-panel'}
      id="panel"
      style={{
        position: 'fixed',
        top: '20px',
        left: isOpen ? '20px' : '-360px',
        zIndex: 10,
      }}>
      <div className="panel-tab" onClick={toggleOpen}
        style={{
          position: 'absolute',
          right: '-40px',
          top: '50%',
          transform: 'translateY(-50%)',
          width: '40px',
          height: '120px',
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          border: '1px solid black',
          borderLeft: 'none',
          borderTopRightRadius: '8px',
          borderBottomRightRadius: '8px',
          transition: 'transform 0.3s ease, background-color 0.3s ease',
        }}
      >
        <span style={{
          writingMode: 'vertical-rl',
          textOrientation: 'upright',
          color: 'black',
          textTransform: 'uppercase',
          fontSize: '14px',
          fontWeight: 'bold',
        }}>
          LEGEND
        </span>
      </div>
      
      <div
        style={{
          padding: '16px',
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
                boxSizing: 'border-box',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0 }}>
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
                boxSizing: 'border-sizing',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0 }}>
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
                boxSizing: 'border-box',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0 }}>
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
                boxSizing: 'border-box',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0 }}>
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
                boxSizing: 'border-box',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0 }}>
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
                boxSizing: 'border-box',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0 }}>
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
                boxSizing: 'border-box',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0 }}>
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
                boxSizing: 'border-box',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0 }}>
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
                boxSizing: 'border-box',
              }}></span>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0 }}>
              Near Threatened
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabelsLeftPanel
