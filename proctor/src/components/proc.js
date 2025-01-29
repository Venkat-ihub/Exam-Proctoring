import React, { useState, useEffect } from 'react';

const App = () => {
  const [isStarted, setIsStarted] = useState(false);
  const [text, setText] = useState("");

  // Function to handle text box input
  const handleInputChange = (event) => {
    setText(event.target.value);
  };

  // Function to start the restrictions and monitoring
  const handleStart = () => {
    setIsStarted(true);
    enforceClipboardRestrictions();
    detectMultiDeviceUsage();
    detectVoiceAndAudio();
  };

  // Clipboard restrictions
  const enforceClipboardRestrictions = () => {
    document.addEventListener('copy', (e) => {
      e.preventDefault();
      alert('Copying text is disabled!');
    });

    document.addEventListener('paste', (e) => {
      e.preventDefault();
      alert('Pasting text is disabled!');
    });
  };

  // Mobile and multi-device restrictions
  const detectMultiDeviceUsage = () => {
    if (/Mobi|Android/i.test(navigator.userAgent)) {
      alert('Mobile devices are not allowed. Please switch to a desktop.');
    }
  };

  // Voice and audio detection (basic setup)
  const detectVoiceAndAudio = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        const mediaStreamSource = audioContext.createMediaStreamSource(stream);
        const analyser = audioContext.createAnalyser();
        mediaStreamSource.connect(analyser);

        analyser.fftSize = 256;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const detectSound = () => {
          analyser.getByteFrequencyData(dataArray);
          const sum = dataArray.reduce((a, b) => a + b, 0);
          if (sum > 1000) {
            alert('Audio detected. Unauthorized people might be in the background!');
          }
          requestAnimationFrame(detectSound);
        };

        detectSound();
      })
      .catch((err) => {
        console.error('Error accessing microphone', err);
      });
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>Test Interface</h1>
      <textarea
        value={text}
        onChange={handleInputChange}
        placeholder="Enter text here"
        rows="4"
        cols="50"
        style={{ display: 'block', marginBottom: '20px' }}
      />
      <button onClick={handleStart} disabled={isStarted}>
        {isStarted ? "Test Started" : "Start"}
      </button>
    </div>
  );
};

export default App;
