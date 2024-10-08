import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';

const VideoPlayer = () => {
    const [startTime, setStartTime] = useState(0);
    const playerRef = useRef(null);
    const intervalRef = useRef(null);

    useEffect(() => {
        // Retrieve the saved playback time from localStorage when the component mounts
        const savedTime = localStorage.getItem('youtube-current-time');
        if (savedTime) {
            setStartTime(parseFloat(savedTime));
        }
    }, []);

    const onPlayerReady = (event) => {
        playerRef.current = event.target;

        // Seek to the saved start time if available
        if (startTime > 0) {
            playerRef.current.seekTo(startTime, true);
        }

        // Play video if it's already loaded
        playerRef.current.playVideo();
    };

    const onPlayerStateChange = (event) => {
        if (event.data === window.YT.PlayerState.PLAYING) {
            // Disable user interactions only when the video starts playing
            playerRef.current.getIframe().style.pointerEvents = 'none';

            // Save the current playback time in localStorage every second
            intervalRef.current = setInterval(() => {
                const currentTime = playerRef.current.getCurrentTime();
                localStorage.setItem('youtube-current-time', currentTime);
            }, 1000);
        } else {
            // If the video is paused or ended, clear the interval
            clearInterval(intervalRef.current);
        }
    };

    const opts = {
        height: '390',
        width: '640',
        playerVars: {
            autoplay: 0, // Let the user start the video manually if needed
            controls: 0, // Hide controls
            disablekb: 1, // Disable keyboard controls
            modestbranding: 1,
        },
    };

    return (
        <YouTube
            videoId="1RDcjW4weYU" // Replace with your YouTube video ID
            opts={opts}
            onReady={onPlayerReady}
            onStateChange={onPlayerStateChange}
        />
    );
};

export default VideoPlayer;
