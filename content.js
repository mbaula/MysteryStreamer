// function to hide elements related to VOD length and progress
function hideVODLengthElements() {
    // hide progress bar
    const progressBar = document.querySelector('.seekbar-interaction-area');
    if (progressBar) {
        progressBar.style.display = 'none';
    }

    // hide time duration
    const timeIndicators = document.querySelectorAll('[data-a-target="player-seekbar-current-time"], [data-a-target="player-seekbar-duration"], .video-player__time-labels');
    timeIndicators.forEach(indicator => {
        indicator.style.display = 'none';
    });

    // hide text that indicates when the streamer was last live or how long ago the VOD was uploaded
    const textNodes = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
        acceptNode: function(node) {
            if (node.nodeValue.includes('hours ago') || node.nodeValue.includes('last live')) {
                return NodeFilter.FILTER_ACCEPT;
            }
            return NodeFilter.FILTER_REJECT;
        }
    });

    let node;
    while ((node = textNodes.nextNode())) {
        node.nodeValue = '';
    }

    // hide duration on thumbnail
    const vodThumbnailDurations = document.querySelectorAll('.tw-media-card-stat');
    vodThumbnailDurations.forEach(duration => {
        if (/^\d{1,2}:\d{2}(?::\d{2})?$/.test(duration.textContent.trim())) {
            duration.style.display = 'none';
        }
    });

    // hide text that indicates time left in chapters and other time formats
    const timeLeftElements = document.querySelectorAll('p.CoreText-sc-1txzju1-0');
    timeLeftElements.forEach(element => {
        if (/^\d+ (hour|hours|minute|minutes|second|seconds) \d* (hour|hours|minute|minutes|second|seconds)?( left)?$/.test(element.textContent.trim())) {
            element.style.display = 'none';
        }
    });

    // hide live time
    const liveTimeElement = document.querySelector('.live-time');
    if (liveTimeElement) {
        liveTimeElement.style.display = 'none';
    }
}

// function to create and add custom seek buttons
function addCustomSeekButtons() {
    const seekContainer = document.querySelector('.video-player__overlay .player-controls__left-control-group');
    if (!seekContainer) {
        return;
    }

    if (document.querySelector('.custom-seek-button')) {
        return;
    }

    // create button elements with different seek intervals
    const seekIntervals = [
        { label: '-5m', time: -300 },
        { label: '-1m', time: -60 },
        { label: '-30s', time: -30 },
        { label: '-5s', time: -5 },
        { label: '+5s', time: 5 },
        { label: '+30s', time: 30 },
        { label: '+1m', time: 60 },
        { label: '+5m', time: 300 },
    ];

    seekIntervals.forEach(interval => {
        const button = document.createElement('button');
        button.innerText = interval.label;
        button.className = 'custom-seek-button';
        button.addEventListener('click', () => {
            const video = document.querySelector('video');
            if (video) {
                video.currentTime += interval.time;
            }
        });
        seekContainer.appendChild(button);
    });

    const customTimeInput = document.createElement('input');
    customTimeInput.type = 'number';
    customTimeInput.className = 'custom-time-input';
    customTimeInput.placeholder = 'Enter Minutes'; 

    const customSeekButton = document.createElement('button');
    customSeekButton.innerText = 'Seek';
    customSeekButton.className = 'custom-seek-button';
    customSeekButton.addEventListener('click', () => {
        const video = document.querySelector('video');
        const timeInMinutes = parseFloat(customTimeInput.value);
        const timeInSeconds = timeInMinutes * 60;
        if (video && !isNaN(timeInSeconds)) {
            video.currentTime += timeInSeconds;
        }
    });

    // Add enter key functionality to the input field
    customTimeInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            customSeekButton.click();
        }
    });

    seekContainer.appendChild(customTimeInput);
    seekContainer.appendChild(customSeekButton);
}

// ensure VOD length elements stay hidden and custom seek buttons are added
const observer = new MutationObserver((mutations) => {
    hideVODLengthElements();
    addCustomSeekButtons();
});

// observe the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

hideVODLengthElements();
addCustomSeekButtons();

// add custom CSS for the buttons and input field
const style = document.createElement('style');
style.innerHTML = `
    .custom-seek-button {
        background-color: transparent;
        font-size: 12px;
        padding: 4px 8px;
        margin: 0 3px;
        border: 1px solid #ccc;
        border-radius: 3px;
        cursor: pointer;
        transition: background-color 0.3s ease, color 0.3s ease;
    }
    .custom-seek-button:hover {
        background-color: #f0f0f0;
        color: #000;
    }
    .custom-time-input {
        font-size: 12px;
        padding: 4px 8px; 
        margin: 0 3px;
        width: 80px; 
        border: 1px solid #ccc;
        border-radius: 3px;
        outline: none;
        background-color: #2c2c2c; 
        color: #f0f0f0; 
        transition: border-color 0.3s ease;
        height: 28px; 
    }
    .custom-time-input::placeholder {
        font-size: 10px;
    }
    .custom-time-input:focus {
        border-color: #999;
    }
    .custom-time-input::-webkit-outer-spin-button,
    .custom-time-input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    .custom-time-input {
        -moz-appearance: textfield;
    }
`;
document.head.appendChild(style);