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
        if (/^\d{1,2}:\d{2}:\d{2}$/.test(duration.textContent.trim())) {
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
        { label: '-5s', time: -5 },
        { label: '-30s', time: -30 },
        { label: '-1m', time: -60 },
        { label: '-5m', time: -300 },
        { label: '+5s', time: 5 },
        { label: '+30s', time: 30 },
        { label: '+1m', time: 60 },
        { label: '+5m', time: 300 },
    ];

    seekIntervals.forEach(interval => {
        const button = document.createElement('button');
        button.innerText = interval.label;
        button.className = 'ScCoreButton-sc-ocjdkq-0 caieTg ScButtonIcon-sc-9yap0r-0 dOOPAe custom-seek-button';
        button.style.margin = '0 5px';
        button.addEventListener('click', () => {
            const video = document.querySelector('video');
            if (video) {
                video.currentTime += interval.time;
            }
        });
        seekContainer.appendChild(button);
    });
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
