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

// ensure VOD length elements stay hidden
const observer = new MutationObserver((mutations) => {
    hideVODLengthElements();
});

// observe the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

hideVODLengthElements();
