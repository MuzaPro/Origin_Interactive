/**
 * Origin Interactive Experience - Production Version
 * 
 * INTEGRATION GUIDE:
 * -----------------
 * This is a state-driven interactive experience with 4 states (views).
 * 
 * Required Assets:
 * - Images: assets/images/state1.webp through state4.webp
 * - Animations: assets/animations/*.webm (see animations object for paths)
 * - Audio: assets/sound/buttonSFX.wav
 * - SVGs: assets/vector_graphics/*.svg
 * - Icons: assets/ui-icons/nav-bar/*.svg
 * 
 * State Machine:
 * - State 1: Modular Quantum Computing (overview)
 * - State 2: Introducing ORIGIN (building block)
 * - State 3: Photonics Chip (inside the system)  
 * - State 4: Deterministic Entanglement (the science)
 * 
 * Transitions use WebM videos. If no direct transition animation exists,
 * the code performs compound transitions through intermediate states.
 * 
 * NOTE: The utility menu (audio toggle) is hidden by CSS.
 * To enable it, change .utility-menu { display: none; } to { display: flex; }
 */

// State Machine for Quantum Source Interactive Experience - Optimized Version

// State definitions
const states = {
    1: {
        title: "Modular Quantum Computing",
        descriptions: [
            "Practical quantum computing requires millions of qubits working together, a scale that demands a fundamentally different approach to system architecture.",
            "Rather than building one impossibly large machine, <span class='highlight'>ORIGIN units work together</span>, Each unit generates small clusters of entangled photonic qubits, which are then \"stitched\" together into larger quantum structures. This approach means computational power that scales with the number of units deployed."
        ],
        image: "assets/images/state1.webp",
        svg: "assets/vector_graphics/stitching.svg"
    },
    2: {
        title: "Introducing ORIGIN",
        descriptions: [
            "<span class='highlight'>ORIGIN is a deterministic photonic cluster (resource) state generator.</span> The essential building block for photonic quantum computation.",
            "Where other photonic cluster state generators rely on probabilistic processes that require about a million of attempts for each photonic qubit, ORIGIN takes a fundamentally different approach. By combining atomic and photonic qubits, each unit generates entangled photonic clusters with unprecedented efficiency: approximately four orders of magnitude better than probabilistic methods!",
            "The result: a system designed to fit in a standard server room rather than on a factory floor the size of a few football fields. No cryogenic cooling. No specialized infrastructure. Room temperature operation with the reliability required for practical deployment."
        ],
        image: "assets/images/state2.webp",
        videoUrl: "https://youtu.be/-pp3bKn8Fg8"
    },
    3: {
        title: "Photonics Chip at the Core",
        descriptions: [
            "At the heart of each ORIGIN unit is a photonic chip.",
            "Below the chip, a cloud of Rubidium atoms is held in vacuum. Precisely controlled laser beams guide individual atoms to designated trapping sites, where they interact with high quality optical resonators."
        ],
        image: "assets/images/state3.webp"
    },
    4: {
        title: "Deterministic Entanglement",
        descriptions: [
            "The breakthrough behind ORIGIN is based on Cavity Quantum Electrodynamics (Cavity-QED): the physics of how individual atoms interact with single photons confined inside high-quality optical resonators.",
            "When a single Rubidium atom is positioned near a high-quality optical resonator, something powerful happens: the photon's electric field becomes strong enough, for long enough time, to interact with the atom deterministically rather than probabilistically. This means that <span class='highlight'> each photon can be generated and entangled on demand, with near-perfect efficiency.</span>",
            "The atom acts as a quantum mediator—creating the nonlinear interactions that photons alone cannot achieve. The result is a stream of high-quality entangled photons cluster states, ready to be stitched into the large-scale array of quantum logic required for fault-tolerant quantum computing."
        ],
        loopingVideo: "assets/animations/Resonators.webm",
        svg: "assets/vector_graphics/q-logic-gates.svg"
    }
};

// Animation paths
const animations = {
    "1-2": "assets/animations/1to2.webm",
    "2-1": "assets/animations/2to1.webm",
    "2-3": "assets/animations/2to3.webm",
    "3-2": "assets/animations/3to2.webm",
    "1-3": "assets/animations/1to3.webm",
    "3-1": "assets/animations/3to1.webm"
    // Transitions to/from state 4 - commented out until assets are ready
    // "1-4": "assets/animations/1to4.webm",
    // "4-1": "assets/animations/4to1.webm",
    // "2-4": "assets/animations/2to4.webm",
    // "4-2": "assets/animations/4to2.webm",
    // "3-4": "assets/animations/3to4.webm",
    // "4-3": "assets/animations/4to3.webm"
};

// Current state
let currentState = 1;
let isTransitioning = false;
let resizeTimeout;

// Audio configuration
let soundEnabled = true;
let audioContext;
let audioBuffer;

// Preloaded assets
const preloadedVideos = new Map();
const preloadedImages = new Map();

// Create and initialize Web Audio API for zero-latency sound
async function initAudio() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        audioContext = new AudioContext();
        
        // Load and decode audio file
        const response = await fetch('assets/sound/buttonSFX.wav');
        const audioData = await response.arrayBuffer();
        audioBuffer = await audioContext.decodeAudioData(audioData);
    } catch (err) {
        console.warn('Audio initialization failed:', err);
    }
}

// Play sound with Web Audio API for instant playback
function playButtonSound() {
    if (!soundEnabled || !audioContext || !audioBuffer) return;
    
    try {
        // Resume context if suspended (required for some browsers)
        if (audioContext.state === 'suspended') {
            audioContext.resume();
        }
        
        // Create a source node for each playback
        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();
        
        source.buffer = audioBuffer;
        gainNode.gain.value = 0.05;
        
        source.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        source.start(0);
    } catch (err) {
        console.warn('Audio playback error:', err);
    }
}

// DOM elements
const stateVisual = document.getElementById('stateVisual');
const stateAnimation = document.getElementById('stateAnimation');

// Desktop content elements
const contentArea = document.getElementById('contentArea');
const mainTitle = document.getElementById('mainTitle');
const description1 = document.getElementById('description1');
const description2 = document.getElementById('description2');
const description3 = document.getElementById('description3');
const videoButton = document.getElementById('videoButton');

// Mobile content elements
const mobileContentArea = document.getElementById('mobileContentArea');
const mobileMainTitle = document.getElementById('mobileMainTitle');
const mobileDescription1 = document.getElementById('mobileDescription1');
const mobileDescription2 = document.getElementById('mobileDescription2');
const mobileDescription3 = document.getElementById('mobileDescription3');
const mobileVideoButton = document.getElementById('mobileVideoButton');

// SVG container elements
const svgContainer = document.getElementById('svgContainer');
const mobileSvgContainer = document.getElementById('mobileSvgContainer');

// Navigation elements
const allNavItems = document.querySelectorAll('.nav-item');
const audioToggleBtn = document.querySelector('.utility-btn[title="Audio"]');

// Detect current layout mode
function getLayoutMode() {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    if (width > 768) {
        return 'desktop';
    } else if (width <= 768 && window.matchMedia('(orientation: landscape)').matches) {
        return 'landscape';
    } else {
        return 'portrait';
    }
}

// Update nav button text based on layout mode
function updateNavButtonText() {
    const layoutMode = getLayoutMode();
    const isMobilePortrait = layoutMode === 'portrait';
    
    // Update all nav items (both desktop and mobile)
    allNavItems.forEach(item => {
        const navTextElement = item.querySelector('.nav-text');
        if (navTextElement && isMobilePortrait) {
            // Use short mobile text for portrait mode
            const mobileText = item.getAttribute('data-mobile-text');
            if (mobileText) {
                navTextElement.textContent = mobileText;
            }
        } else if (navTextElement && !isMobilePortrait) {
            // Use full text for desktop and landscape modes
            const state = item.getAttribute('data-state');
            const fullTexts = {
                '1': 'Scalable Architecture',
                '2': 'The Building Block',
                '3': 'Inside the System',
                '4': 'The Science'
            };
            if (fullTexts[state]) {
                navTextElement.textContent = fullTexts[state];
            }
        }
    });
}

// Preload all animations and images
async function preloadAllAssets() {
    // Preload all images
    const imagePromises = Object.values(states).map(state => {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => {
                preloadedImages.set(state.image, img);
                resolve();
            };
            img.onerror = resolve;
            img.src = state.image;
        });
    });

    // Preload all videos
    const videoPromises = Object.entries(animations).map(([key, path]) => {
        return new Promise((resolve) => {
            const video = document.createElement('video');
            video.preload = 'auto';
            video.muted = true;
            video.playsInline = true;
            video.setAttribute('webkit-playsinline', '');
            video.setAttribute('disablePictureInPicture', '');
            
            video.onloadedmetadata = () => {
                // Video metadata loaded
            };
            
            video.onloadeddata = () => {
                preloadedVideos.set(path, video);
                resolve();
            };
            video.onerror = (e) => {
                console.error(`Video load error: ${key}`);
                resolve();
            };
            video.src = path;
        });
    });

    await Promise.all([...imagePromises, ...videoPromises]);
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', async () => {
    // Initialize audio immediately
    initAudio();
    
    // Setup listeners
    setupNavListeners();
    setupAudioListeners();
    setupBackgroundClickNavigation();
    
    // Update nav button text based on layout
    updateNavButtonText();
    
    // Update initial state
    updateActiveNav();
    updateContent(currentState);
    
    // Preload all assets in the background
    preloadAllAssets();
    
    // Prevent unwanted interactions on visual elements
    const elements = [stateVisual, stateAnimation];
    const events = ['dblclick', 'contextmenu', 'mousedown', 'touchstart'];
    
    elements.forEach(element => {
        if (element) {
            events.forEach(event => {
                element.addEventListener(event, e => {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                }, { passive: false });
            });
        }
    });
});

// Add ripple effect to buttons
function addRippleEffect(button) {
    button.classList.add('ripple');
    setTimeout(() => {
        button.classList.remove('ripple');
    }, 400);
}

// Setup audio button listeners
function setupAudioListeners() {
    // Add click sound to utility buttons (except audio toggle)
    document.querySelectorAll('.utility-btn:not([title="Audio"])').forEach(btn => {
        btn.addEventListener('click', playButtonSound);
    });
    
    // Setup audio toggle functionality
    if (audioToggleBtn) {
        audioToggleBtn.addEventListener('click', () => {
            soundEnabled = !soundEnabled;
            audioToggleBtn.classList.toggle('muted', !soundEnabled);
            
            // Update icon to show muted state if needed
            const audioPath = audioToggleBtn.querySelector('path');
            if (audioPath) {
                if (soundEnabled) {
                    audioPath.setAttribute('d', 'M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z');
                } else {
                    audioPath.setAttribute('d', 'M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z');
                }
            }
        });
    }
}

// Setup navigation listeners with immediate feedback
function setupNavListeners() {
    allNavItems.forEach(item => {
        // Use touchstart for mobile and mousedown for desktop for fastest response
        ['touchstart', 'mousedown'].forEach(eventType => {
            item.addEventListener(eventType, (e) => {
                e.preventDefault();
                
                const target = Number(item.dataset.state);
                if (target === currentState || !states[target]) return;
                
                // Immediate visual feedback
                addRippleEffect(item);
                playButtonSound();
                
                // Update active state immediately
                updateActiveNav(target);
                
                // Start transition
                if (!isTransitioning) {
                    transitionToState(target);
                }
            }, { passive: false });
        });
    });
}

// Update active navigation state immediately
function updateActiveNav(targetState = currentState) {
    allNavItems.forEach(item => {
        item.classList.toggle('active', Number(item.dataset.state) === targetState);
    });
}

// Main transition function - optimized
async function transitionToState(targetState) {
    if (isTransitioning || targetState === currentState || !states[targetState]) return;

    isTransitioning = true;

    const key = `${currentState}-${targetState}`;
    const animationPath = animations[key];
    
    try {
        // Scroll to top when changing states
        const layoutMode = getLayoutMode();
        const scrollContainer = layoutMode === 'portrait' ? mobileContentArea : contentArea;
        if (scrollContainer) {
            scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Start text transition animation
        startTextTransition(currentState, targetState);
        
        // Check if direct animation exists
        if (animationPath) {
            await playTransitionAnimation(animationPath, targetState);
        } else {
            // Use smooth fade transition
            await fadeTransition(targetState);
        }

        // Update state
        currentState = targetState;

    } catch (error) {
        console.error('Transition error:', error);
        // Recovery in case of error
        updateContent(targetState);
        currentState = targetState;
        updateActiveNav();
    } finally {
        isTransitioning = false;
    }
}

// Start text transition effect
function startTextTransition(fromState, toState) {
    const fromStateData = states[fromState];
    const toStateData = states[toState];
    
    if (!fromStateData || !toStateData) return;
    
    const layoutMode = getLayoutMode();
    
    // Choose which content elements to animate based on layout
    let titleElement, desc1Element, desc2Element, desc3Element;
    
    if (layoutMode === 'portrait') {
        titleElement = mobileMainTitle;
        desc1Element = mobileDescription1;
        desc2Element = mobileDescription2;
        desc3Element = mobileDescription3;
    } else { // desktop or landscape
        titleElement = mainTitle;
        desc1Element = description1;
        desc2Element = description2;
        desc3Element = description3;
    }
    
    // Animate the title transition
    if (titleElement) {
        fadeTextTransition(titleElement, fromStateData.title, toStateData.title);
    }
    
    // Animate the first description
    if (desc1Element && fromStateData.descriptions[0] && toStateData.descriptions[0]) {
        fadeTextTransition(desc1Element, fromStateData.descriptions[0], toStateData.descriptions[0]);
    }
    
    // Animate the second description
    if (desc2Element && fromStateData.descriptions[1] && toStateData.descriptions[1]) {
        fadeTextTransition(desc2Element, fromStateData.descriptions[1], toStateData.descriptions[1]);
    }
    
    // Animate the third description (if it exists)
    if (desc3Element) {
        if (fromStateData.descriptions[2] && toStateData.descriptions[2]) {
            fadeTextTransition(desc3Element, fromStateData.descriptions[2], toStateData.descriptions[2]);
        } else if (toStateData.descriptions[2]) {
            // Fade in if target has third description but source doesn't
            desc3Element.innerHTML = toStateData.descriptions[2];
            desc3Element.style.display = 'block';
            desc3Element.style.opacity = '0';
            setTimeout(() => {
                desc3Element.style.transition = 'opacity 0.3s ease-in';
                desc3Element.style.opacity = '1';
            }, 100);
        } else {
            // Fade out if source had third description but target doesn't
            desc3Element.style.transition = 'opacity 0.2s ease-out';
            desc3Element.style.opacity = '0';
            setTimeout(() => {
                desc3Element.style.display = 'none';
                desc3Element.innerHTML = '';
            }, 200);
        }
    }
}

// Create a smooth fade transition between two text contents
function fadeTextTransition(element, fromText, toText) {
    if (!element) return;
    
    // Create a wrapper if it doesn't exist
    let wrapper = element.querySelector('.text-transition-wrapper');
    if (!wrapper) {
        element.innerHTML = `<div class="text-transition-wrapper">${element.innerHTML}</div>`;
        wrapper = element.querySelector('.text-transition-wrapper');
    }
    
    // Fade out
    wrapper.style.transition = 'opacity 0.2s ease-out';
    wrapper.style.opacity = '0';
    
    // After fade out, update content and fade back in
    setTimeout(() => {
        wrapper.innerHTML = toText;
        wrapper.style.opacity = '1';
    }, 200);
}

// Load and display SVG content
async function loadSVG(svgPath, container) {
    if (!svgPath || !container) return;
    
    try {
        // If container already has content, fade it out first
        if (container.innerHTML.trim()) {
            container.style.transition = 'opacity 0.2s ease-out';
            container.style.opacity = '0';
            
            // Wait for fade out to complete
            await new Promise(resolve => setTimeout(resolve, 200));
        }
        
        // Fetch and load the new SVG
        const response = await fetch(svgPath);
        const svgContent = await response.text();
        container.innerHTML = svgContent;
        
        // Fade in the new SVG
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.5s ease-in';
        
        requestAnimationFrame(() => {
            container.style.opacity = '1';
        });
    } catch (error) {
        console.warn(`Failed to load SVG: ${svgPath}`, error);
        container.innerHTML = '';
    }
}

// Clear SVG content with fade-out
function clearSVG(container) {
    if (!container) return;
    
    container.style.transition = 'opacity 0.3s ease-out';
    container.style.opacity = '0';
    
    setTimeout(() => {
        container.innerHTML = '';
    }, 300);
}

// Smooth fade transition for states without animation
async function fadeTransition(targetState) {
    const newState = states[targetState];
    if (!newState) return;
    
    const fadeOutDuration = 300;
    const fadeInDuration = 500;
    
    // Fade out current content
    if (stateAnimation.classList.contains('playing') || stateAnimation.loop) {
        // Fade out video
        stateAnimation.style.transition = `opacity ${fadeOutDuration}ms ease-out`;
        stateAnimation.style.opacity = '0';
        await wait(fadeOutDuration);
        stateAnimation.pause();
        stateAnimation.loop = false;
        stateAnimation.classList.remove('playing');
    } else {
        // Fade out static image
        stateVisual.style.transition = `opacity ${fadeOutDuration}ms ease-out`;
        stateVisual.style.opacity = '0';
        await wait(fadeOutDuration);
    }
    
    // Update content during fade
    updateContent(targetState);
    
    // Set up new content
    if (newState.loopingVideo) {
        // Setup looping video
        stateVisual.style.opacity = '0';
        stateAnimation.src = newState.loopingVideo;
        stateAnimation.loop = true;
        stateAnimation.muted = true;
        stateAnimation.classList.add('playing');
        
        // Fade in video
        stateAnimation.style.transition = `opacity ${fadeInDuration}ms ease-in`;
        stateAnimation.style.opacity = '1';
        
        await stateAnimation.play().catch(err => {
            console.warn('Failed to play looping video:', err);
        });
    } else if (newState.image) {
        // Stop any looping video
        if (stateAnimation.loop) {
            stateAnimation.pause();
            stateAnimation.loop = false;
            stateAnimation.style.opacity = '0';
            stateAnimation.classList.remove('playing');
        }
        
        // Load new image
        const preloadedImg = preloadedImages.get(newState.image);
        if (preloadedImg) {
            stateVisual.src = newState.image;
        } else {
            // Load image if not preloaded
            await new Promise((resolve) => {
                const tempImg = new Image();
                tempImg.onload = () => {
                    stateVisual.src = newState.image;
                    resolve();
                };
                tempImg.onerror = resolve;
                tempImg.src = newState.image;
            });
        }
        
        // Fade in image
        stateVisual.style.transition = `opacity ${fadeInDuration}ms ease-in`;
        stateVisual.style.opacity = '1';
    }
    
    // Wait for fade in to complete
    await wait(fadeInDuration);
    adjustPortraitLayout();
}

// Deprecated - replaced by fadeTransition
// Kept for backward compatibility only
function instantTransition(targetState) {
    return fadeTransition(targetState);
}

// Play transition animation
function playTransitionAnimation(animationPath, targetState) {
    return new Promise((resolve, reject) => {
        const preloadedVideo = preloadedVideos.get(animationPath);
        
        // Pre-load the target image to ensure smooth transition
        const newState = states[targetState];
        const preloadedImg = newState ? preloadedImages.get(newState.image) : null;
        
        // CRITICAL FIX: Stop any looping video before starting transition animation
        // This prevents the looping video from state 4 blocking the transition
        if (stateAnimation.loop) {
            stateAnimation.pause();
            stateAnimation.loop = false;
            stateAnimation.classList.remove('playing');
        }
        
        // CRITICAL FIX: Reset all inline styles that might interfere with transition
        // After leaving state 4, inline opacity: 0 can block the next transition
        stateAnimation.style.opacity = '';
        stateAnimation.style.transition = '';
        stateAnimation.style.transform = '';
        
        const startAnimation = () => {
            // Ensure the video is properly reset before playing
            stateAnimation.currentTime = 0;
            stateAnimation.playbackRate = 1;
            
            // Apply dimension normalization for problematic videos
            const videoWidth = stateAnimation.videoWidth || (preloadedVideo ? preloadedVideo.videoWidth : 1920);
            const standardWidth = 1920;
            
            if (videoWidth !== standardWidth) {
                const scaleX = standardWidth / videoWidth;
                stateAnimation.style.transform = `scale(${scaleX}, 1)`;
            } else {
                stateAnimation.style.transform = '';
            }
            
            // Wait one frame before starting to ensure proper synchronization
            requestAnimationFrame(() => {
                stateAnimation.classList.add('playing');
                
                const playPromise = stateAnimation.play();
                if (playPromise !== undefined) {
                    playPromise.catch(() => {
                        updateToTargetImage();
                    });
                }
            });
        };
        
        if (preloadedVideo) {
            // Use the preloaded video data
            stateAnimation.src = preloadedVideo.src;
            
            // Wait for the video to be properly loaded before starting
            if (stateAnimation.readyState >= 2) { // HAVE_CURRENT_DATA
                startAnimation();
            } else {
                stateAnimation.onloadeddata = () => {
                    startAnimation();
                };
            }
        } else {
            // Original loading code as fallback
            stateAnimation.src = animationPath;
            
            stateAnimation.onloadedmetadata = () => {
                startAnimation();
            };
        }

        stateAnimation.onended = () => {
            updateToTargetImage();
        };

        stateAnimation.onerror = () => {
            instantTransition(targetState).then(resolve).catch(reject);
        };

        function updateToTargetImage() {
            // Handle looping video target
            if (newState && newState.loopingVideo) {
                requestAnimationFrame(() => {
                    // Hide static image
                    stateVisual.style.opacity = '0';
                    
                    // Setup and play looping video
                    stateAnimation.src = newState.loopingVideo;
                    stateAnimation.loop = true;
                    stateAnimation.muted = true;
                    stateAnimation.style.transition = 'opacity 0.3s ease-in';
                    stateAnimation.style.opacity = '1';
                    stateAnimation.classList.add('playing');
                    
                    stateAnimation.play().catch(() => {});
                    
                    updateContent(targetState);
                    
                    adjustPortraitLayout();
                    
                    setTimeout(() => {
                        resolve();
                    }, 16);
                });
            }
            // Handle static image target
            else if (newState && newState.image) {
                const updateImage = () => {
                    // Use requestAnimationFrame for smooth transition
                    requestAnimationFrame(() => {
                        // Force the video to fade out faster to minimize visible switching
                        stateAnimation.style.transition = 'opacity 0.05s ease-out';
                        stateAnimation.style.opacity = '0';
                        
                        // Stop looping if active
                        if (stateAnimation.loop) {
                            stateAnimation.pause();
                            stateAnimation.loop = false;
                        }
                        
                        // Show static image
                        stateVisual.style.opacity = '1';
                        stateVisual.src = newState.image;
                        updateContent(targetState);
                        
                        // Wait for next frame before removing playing class
                        requestAnimationFrame(() => {
                            stateAnimation.classList.remove('playing');
                            
                            // Reset transition and transform back to normal
                            stateAnimation.style.transition = '';
                            stateAnimation.style.opacity = '';
                            stateAnimation.style.transform = '';
                            
                            adjustPortraitLayout();
                            
                            // Small delay to ensure everything is settled
                            setTimeout(() => {
                                resolve();
                            }, 16); // One frame at 60fps
                        });
                    });
                };
                
                if (preloadedImg) {
                    updateImage();
                } else {
                    const tempImg = new Image();
                    tempImg.onload = updateImage;
                    tempImg.onerror = () => {
                        stateAnimation.classList.remove('playing');
                        resolve();
                    };
                    tempImg.src = newState.image;
                }
            } else {
                stateAnimation.classList.remove('playing');
                resolve();
            }
        }
    });
}

// Update content for given state (both desktop and mobile)
function updateContent(stateId) {
    const state = states[stateId];
    if (!state) return;

    const layoutMode = getLayoutMode();

    // Update desktop/landscape content
    if (layoutMode === 'desktop' || layoutMode === 'landscape') {
        if (mainTitle) {
            mainTitle.innerHTML = state.title;
        }
        if (description1) {
            description1.innerHTML = state.descriptions[0] || '';
        }
        if (description2) {
            description2.innerHTML = state.descriptions[1] || '';
        }
        
        // Handle video button visibility
        if (videoButton) {
            if (state.videoUrl) {
                videoButton.style.display = 'inline-flex';
                videoButton.onclick = () => {
                    playButtonSound();
                    window.open(state.videoUrl, '_blank', 'noopener,noreferrer');
                };
            } else {
                videoButton.style.display = 'none';
            }
        }
        
        // Handle SVG content for desktop
        if (state.svg && svgContainer) {
            loadSVG(state.svg, svgContainer);
        } else if (svgContainer) {
            clearSVG(svgContainer);
        }
        
        // Handle third description (appears after SVG)
        if (description3) {
            description3.innerHTML = state.descriptions[2] || '';
            description3.style.display = state.descriptions[2] ? 'block' : 'none';
        }
    }

    // Update mobile portrait content
    if (layoutMode === 'portrait') {
        if (mobileMainTitle) {
            mobileMainTitle.innerHTML = state.title;
        }
        if (mobileDescription1) {
            mobileDescription1.innerHTML = state.descriptions[0] || '';
        }
        if (mobileDescription2) {
            mobileDescription2.innerHTML = state.descriptions[1] || '';
        }
        
        // Handle video button visibility for mobile
        if (mobileVideoButton) {
            if (state.videoUrl) {
                mobileVideoButton.style.display = 'inline-flex';
                mobileVideoButton.onclick = () => {
                    playButtonSound();
                    window.open(state.videoUrl, '_blank', 'noopener,noreferrer');
                };
            } else {
                mobileVideoButton.style.display = 'none';
            }
        }
        
        // Handle SVG content for mobile
        if (state.svg && mobileSvgContainer) {
            loadSVG(state.svg, mobileSvgContainer);
        } else if (mobileSvgContainer) {
            clearSVG(mobileSvgContainer);
        }
        
        // Handle third description (appears after SVG)
        if (mobileDescription3) {
            mobileDescription3.innerHTML = state.descriptions[2] || '';
            mobileDescription3.style.display = state.descriptions[2] ? 'block' : 'none';
        }
    }
    
    // Ensure mobile content is properly positioned
    if (getLayoutMode() === 'portrait') {
        adjustPortraitLayout();
    }
}

// Utility delay function
function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Handle browser back/forward buttons
window.addEventListener('popstate', (event) => {
    if (event.state?.stateId !== undefined) {
        updateActiveNav(event.state.stateId);
        transitionToState(event.state.stateId);
    }
});

// Function to adjust portrait layout
function adjustPortraitLayout() {
    const layoutMode = getLayoutMode();
    
    if (layoutMode === 'portrait') {
        const mobileContentStrip = document.querySelector('.mobile-content-strip');
        const stateVisual = document.getElementById('stateVisual');
        const mobileNavBar = document.querySelector('.mobile-nav-bar');
        
        if (mobileContentStrip && stateVisual && mobileNavBar) {
            // Get the height of the nav bar
            const navHeight = mobileNavBar.offsetHeight;
            
            // Get the displayed height of the image
            const imageRect = stateVisual.getBoundingClientRect();
            const imageBottom = imageRect.bottom;
            
            // Position content strip right after the image
            mobileContentStrip.style.position = 'fixed';
            mobileContentStrip.style.top = imageBottom + 'px';
            mobileContentStrip.style.bottom = 'auto';
            mobileContentStrip.style.maxHeight = `calc(100vh - ${imageBottom}px - 20px)`;
        }
    }
}

// Call on load and resize
window.addEventListener('load', adjustPortraitLayout);
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        updateNavButtonText();
        adjustPortraitLayout();
        updateContent(currentState);
    }, 250);
});

// Also call after image loads or transitions
stateVisual.addEventListener('load', adjustPortraitLayout);

// Setup background click navigation
function setupBackgroundClickNavigation() {
    const clickCaptureLayer = document.getElementById('clickCaptureLayer');
    
    if (clickCaptureLayer) {
        ['touchstart', 'mousedown'].forEach(eventType => {
            clickCaptureLayer.addEventListener(eventType, (e) => {
                e.preventDefault();
                
                // Define the navigation sequence
                const nextState = {
                    1: 2,
                    2: 3,
                    3: 4,
                    4: 1
                };
                
                // Get the next state based on current state
                const targetState = nextState[currentState];
                
                // If we're not already transitioning and there's a valid next state
                if (!isTransitioning && targetState && states[targetState]) {
                    // Play button sound for consistent feedback
                    playButtonSound();
                    
                    // Update active state immediately
                    updateActiveNav(targetState);
                    
                    // Transition to the next state
                    transitionToState(targetState);
                }
            }, { passive: false });
        });
    } else {
        console.error('Click capture layer not found in the DOM');
    }
}

/* 
 * Transition Logic Summary:
 * Direct transitions: 1↔2, 2↔3, 1↔3
 * Fade transitions: Used for all other state changes including to/from state 4
 * - Smooth 300ms fade out, 500ms fade in
 * - Handles both static images and looping videos
 */