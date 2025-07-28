import React, { useState, useEffect, useCallback } from 'react';
import './App.css';
import { birthdayData } from './data';

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [floatingImages, setFloatingImages] = useState([]);

  // Available images in chinguun folder
  const availableImages = [
    '0AAB516C-D5BE-4B45-8CD1-56C67C0D8A70.jpg',
    '411B4439-4F3B-4A45-A8A8-F2CB4D10524C.jpg',
    '4B27CFFC-8BFD-406E-8817-D115A2E1C1DB.jpg',
    'IMG_4014.png',
    'lp_image.jpg',
    'Screenshot_20220106-114508_Zoom_Original.jpg',
    'Screenshot_20230519-150532_InstaPro__Original.jpg',
    '524637505_1081428903533145_2690879103367774598_n.jpg',
    '522086432_2237355546764534_2064883714137558600_n.jpg',
    '522042703_664809136614948_6019022010090020995_n.jpg',
    '523779599_1224386049699421_7855736508641943233_n.jpg',
    'africanbrother.png'
  ];

  // Sound effect functionality
  const playSound = () => {
    const audio = new Audio('/chinguun/2660943297d248d694ba062ba1a21f79.mp3');
    audio.volume = 0.3; // Set volume to 30%
    audio.play().catch(error => {
      console.log('Audio play failed:', error);
    });
  };

  const playChirp = () => {
    const audio = new Audio('/smoke_detector_chirp_sound.mp3');
    audio.volume = 0.3; // Set volume to 30%

    // Random duration between 7-10 seconds
    const randomDuration = Math.random() * (10 - 7) + 7;

    audio.play().catch(error => {
      console.log('Chirp audio play failed:', error);
    });

    // Stop the audio after the random duration
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, randomDuration * 1000);
  };

  // Floating images functionality
  const createFloatingImage = useCallback(() => {
    const randomImage = availableImages[Math.floor(Math.random() * availableImages.length)];
    const newImage = {
      id: Date.now() + Math.random(),
      src: `/chinguun/${randomImage}`,
      left: Math.random() * 90, // Random horizontal position (0-90%)
      animationDuration: Math.random() * 3 + 4, // Random duration between 4-7 seconds
    };

    setFloatingImages(prev => [...prev, newImage]);

    // Remove image after animation completes
    setTimeout(() => {
      setFloatingImages(prev => prev.filter(img => img.id !== newImage.id));
    }, newImage.animationDuration * 1000);
  }, [availableImages]);

  const scheduleFloatingImages = useCallback(() => {
    // Random interval between 2-8 seconds
    const randomInterval = Math.random() * (8000 - 2000) + 2000;
    setTimeout(() => {
      createFloatingImage();
      scheduleFloatingImages(); // Schedule the next image
    }, randomInterval);
  }, [createFloatingImage]);

  useEffect(() => {
    playChirp()
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 3000);

    // Start floating images after intro
    const floatingTimer = setTimeout(() => {
      scheduleFloatingImages();
    }, 4000);

    return () => {
      clearTimeout(timer);
      clearTimeout(floatingTimer);
    };
  }, [scheduleFloatingImages]);

  const handleFriendClick = (friend) => {
    playSound(); // Play sound on button press
    setSelectedFriend(friend);
  };

  const closeMessage = () => {
    setSelectedFriend(null);
  };

  if (showIntro) {
    return (
      <div className="intro-screen" style={{ backgroundImage: 'url(/chinguun/89f333db017846ebd659f57a7b243713.png)', backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className="intro-content">
          <h1 className="intro-title">🎉 Birthday Celebration 🎉</h1>
          <h2 className="celebrant-name">{birthdayData.celebrant.name}</h2>
          <p className="intro-date">{birthdayData.celebrant.birthdayDate}</p>
          <div className="birthday-emojis">
            <span>🎂</span>
            <span>🎈</span>
            <span>🎁</span>
            <span>🎊</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      {/* Floating Images */}
      <div className="floating-container">
        {floatingImages.map((image) => (
          <img
            key={image.id}
            src={image.src}
            alt="floating"
            className="floating-image"
            style={{
              left: `${image.left}%`,
              animationDuration: `${image.animationDuration}s`,
            }}
          />
        ))}
      </div>

      <div className="presentation-container">
        <div className="title-slide">
          <div className="title-content">
            <h1 className="main-title">
              Happy {birthdayData.celebrant.age}th Birthday!
            </h1>
            <h2 className="celebrant-name-main">{birthdayData.celebrant.name}</h2>
            <p className="birthday-date">{birthdayData.celebrant.birthdayDate}</p>
            <div className="birthday-wishes">
              <p>Click on your friends to see their messages!</p>
            </div>

            {/* Friends Grid */}
            <div className="friends-grid">
              {birthdayData.friends.map((friend) => (
                <div
                  key={friend.id}
                  className="friend-preview"
                  onClick={() => handleFriendClick(friend)}
                >
                  <img
                    src={friend.image}
                    alt={friend.name}
                    className="friend-preview-image"
                  />
                  <div className="friend-preview-content">
                    <div className="friend-preview-name">{friend.name}</div>
                    <div className="click-hint">Birthday message</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Message Modal */}
        {selectedFriend && (
          <div className="message-modal" onClick={closeMessage}>
            <div className="message-modal-content" onClick={(e) => e.stopPropagation()}>
              <button className="close-btn" onClick={closeMessage}>×</button>
              <div className="modal-friend-info">
                <img
                  src={selectedFriend.image}
                  alt={selectedFriend.name}
                  className="modal-friend-image"
                />
                <h3 className="modal-friend-name">{selectedFriend.name}</h3>
              </div>
              <div className="modal-message">
                <p>"{selectedFriend.message}"</p>
              </div>
              <div className="modal-footer">
                <button className="modal-close-btn" onClick={closeMessage}>
                  Close Message
                </button>
              </div>
            </div>
          </div>
        )}

        {/* <div className="navigation">
          <button className="nav-btn prev" onClick={prevSlide}>
            ← Previous
          </button>
          <div className="slide-indicators">
            {Array.from({ length: totalSlides }, (_, index) => (
              <button
                key={index}
                className={`indicator ${currentSlide === index ? 'active' : ''}`}
                onClick={() => goToSlide(index)}
              >
                {index === 0 ? '🏠' : '👤'}
              </button>
            ))}
          </div>
          <button className="nav-btn next" onClick={nextSlide}>
            Next →
          </button>
        </div> */}
      </div>
    </div>
  );
}

export default App;
