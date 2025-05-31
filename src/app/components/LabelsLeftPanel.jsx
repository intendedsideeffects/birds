import React from 'react'
import AddStory from './AddStory';

function LabelsLeftPanel({
  isOpen,
  toggleOpen,
  setSelectedStory,
  handleSendStory,
  birdStories,
  selectedStory,
  setSelectedSpecies,
  errorSendStory,
  isSendStorySuccess,
  setIsSendStorySuccess,
  setErrorSendStory
}) {
  console.log('LabelsLeftPanel rendered. isOpen:', isOpen);

  const [showAddStoryForm, setShowAddStoryForm] = React.useState(false);

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
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', marginRight: '8px' }}>
              <span
                className="dot-labels-wrapper"
                style={{
                  display: 'inline-block',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.1)',
                  flexShrink: 0,
                }}></span>
            </div>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0, lineHeight: '1.2em' }}>
              A species we know only by name
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', marginRight: '8px' }}>
              <span
                className="dot-labels-wrapper"
                style={{
                  display: 'inline-block',
                  width: '30px',
                  height: '30px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.4)',
                  flexShrink: 0,
                }}></span>
            </div>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0, lineHeight: '1.2em' }}>
              A species with a story
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '16px',
            }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '60px', marginRight: '8px' }}>
              <span
                className="dot-labels-wrapper"
                style={{
                  display: 'inline-block',
                  width: '54px',
                  height: '54px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(0,0,0,0.9)',
                  flexShrink: 0,
                }}></span>
            </div>
            <span className="dot-labels-wrapper" style={{ fontSize: '12px', flexShrink: 1, overflowWrap: 'break-word', flex: 1, minWidth: 0, lineHeight: '1.2em' }}>
              A species whose sound we still carry
            </span>
          </div>
        </div>
      </div>
      <div style={{ padding: '0 16px 16px 16px' }}>
        <button
          style={{
            padding: '10px 15px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            fontSize: '14px',
          }}
          onClick={() => setShowAddStoryForm(!showAddStoryForm)}
        >
          {showAddStoryForm ? 'Hide Add Story' : 'Add New Story'}
        </button>

        {showAddStoryForm && (
          <AddStory
            setSelectedStory={setSelectedStory}
            handleSendStory={handleSendStory}
            birdStories={birdStories}
            selectedStory={selectedStory}
            setSelectedSpecies={setSelectedSpecies}
            errorSendStory={errorSendStory}
            isSendStorySuccess={isSendStorySuccess}
            setIsSendStorySuccess={setIsSendStorySuccess}
            setErrorSendStory={setErrorSendStory}
          />
        )}
      </div>
    </div>
  );
}

export default LabelsLeftPanel
