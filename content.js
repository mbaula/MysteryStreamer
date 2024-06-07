// function to hide elements related to VOD length and progress
function hideVODLengthElements() {
    const progressBar = document.querySelector('.seekbar-interaction-area');
    if (progressBar) {
        progressBar.style.display = 'none';
    }

    // hide time duration
    const timeIndicators = document.querySelectorAll('[data-a-target="player-seekbar-current-time"], [data-a-target="player-seekbar-duration"], .video-player__time-labels');
    timeIndicators.forEach(indicator => {
        indicator.style.display = 'none';
    });

    // hide other potential elements related to VOD length
    const otherElements = document.querySelectorAll('.seekbar-bar, .video-player__overlay, .video-player__controls');
    otherElements.forEach(element => {
        element.style.display = 'none';
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
}

// ensure VOD length elements stay hidden
const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        hideVODLengthElements();
    });
});

// observe the document body for changes
observer.observe(document.body, { childList: true, subtree: true });

hideVODLengthElements();
