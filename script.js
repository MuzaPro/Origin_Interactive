// State Machine for Quantum Source Interactive Experience - Optimized Version

// State definitions
const states = {
    1: {
        title: "Modular Quantum Computing",
        descriptions: [
            "Practical quantum computing requires millions of qubits working together—a scale that demands a fundamentally different approach to system architecture.",
            "Rather than building one impossibly large machine, ORIGIN units work together. Each unit generates small clusters of entangled photonic qubits, which are then \"stitched\" together into larger quantum structures. This fusion-based approach means computational power scales with the number of units deployed.",
            "A facility can start with what they need today and expand as their requirements grow: from tens of units for research applications to hundreds for enterprise-scale computation."
        ],
        image: "assets/images/state1.webp",
        svg: "assets/vector_graphics/stitching.svg"
    },
    2: {
        title: "Introducing ORIGIN",
        descriptions: [
            "ORIGIN is a deterministic resource state generator—the essential building block for photonic quantum computation.",
            "Where conventional photonic systems rely on probabilistic processes that succeed only a fraction of the time, ORIGIN takes a fundamentally different approach. By combining atomic and photonic qubits, each unit generates entangled photon clusters with unprecedented efficiency—approximately four orders of magnitude better than probabilistic methods.",
            "The result: a system designed to fit in a standard server room rather than a factory floor. No cryogenic cooling. No specialized infrastructure. Room temperature operation with the reliability that practical deployment demands."
        ],
        image: "assets/images/state2.webp"
    },
    3: {
        title: "Silicon Photonics at the Core",
        descriptions: [
            "At the heart of each ORIGIN unit is a photonic chip built on silicon nitride—leveraging decades of precision manufacturing developed for the telecommunications industry.",
            "Below the chip, a cloud of rubidium atoms is held in vacuum. Precisely controlled laser beams guide individual atoms to designated coupling sites on the chip surface, where they interact with integrated optical resonators.",
            "This architecture achieves something remarkable: the quantum precision of isolated atoms combined with the scalability of semiconductor fabrication. Every chip is manufactured using established lithographic processes, creating a clear path from laboratory demonstration to volume production."
        ],
        image: "assets/images/state3.webp"
    },
    4: {
        title: "Deterministic Entanglement",
        descriptions: [
            "The breakthrough behind ORIGIN lies in cavity quantum electrodynamics (QED)—the physics of how light and matter interact in confined spaces.",
            "When a single rubidium atom is positioned near a high-quality optical resonator, something powerful happens: the photon's electric field becomes concentrated enough to interact with the atom deterministically, not probabilistically. This means each photon can be generated and entangled on demand, with near-perfect efficiency.",
            "The atom acts as a quantum mediator—creating the nonlinear interactions that photons alone cannot achieve. The result is a stream of high-quality entangled photonic qubits, ready to be fused into the large-scale resource states that fault-tolerant quantum computing requires."
        ],
        image: "assets/images/state4.png",
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

// Mobile content elements
const mobileContentArea = document.getElementById('mobileContentArea');
const mobileMainTitle = document.getElementById('mobileMainTitle');
const mobileDescription1 = document.getElementById('mobileDescription1');
const mobileDescription2 = document.getElementById('mobileDescription2');

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
    const aspectRatio = width / height;
    
    if (width > 768) {
        return 'desktop';
    } else if (width <= 768 && window.matchMedia('(orientation: landscape)').matches) {
        return 'landscape';
    } else {
        return 'portrait';
    }
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
                console.log(`📊 Video metadata loaded: ${key} (${path})`);
                console.log(`   Duration: ${video.duration}s`);
                console.log(`   Dimensions: ${video.videoWidth}x${video.videoHeight}`);
                console.log(`   Ready state: ${video.readyState}`);
            };
            
            video.onloadeddata = () => {
                console.log(`📦 Video data loaded: ${key}`);
                preloadedVideos.set(path, video);
                resolve();
            };
            video.onerror = (e) => {
                console.error(`❌ Video load error: ${key} - ${e.message}`);
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
    
    // Update initial state
    updateActiveNav();
    updateContent(currentState);
    
    // Preload all assets in the background
    preloadAllAssets();
    
    // Keep this to prevent unwanted interactions
    const backgroundContainer = document.querySelector('.background-container');
    const stateVisual = document.getElementById('stateVisual');
    const stateAnimation = document.getElementById('stateAnimation');
    
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
async function transitionToState(targetState, isCompoundSegment = false) {
    if (isTransitioning || targetState === currentState || !states[targetState]) return;

    isTransitioning = true;

    const key = `${currentState}-${targetState}`;
    const animationPath = animations[key];
    
    try {
        // Start content transition immediately (unless this is part of a compound transition)
        if (!isCompoundSegment) {
            // Start text transition animation
            startTextTransition(currentState, targetState);
        }
        
        // Check if direct animation exists
        if (animationPath) {
            console.log(`Playing direct transition: ${currentState} → ${targetState}`);
            await playTransitionAnimation(animationPath, targetState);
        } 
        // Handle compound transitions
        else {
            // For 4->1: play seq4_reverse followed by seq3_reverse 
            if (currentState === 4 && targetState === 1) {
                console.log(`Using compound transition: ${currentState} → 3 → ${targetState}`);
                await performCompoundTransition(currentState, 3, targetState);
            }
            // For 1->4: go through state 3 first
            else if (currentState === 1 && targetState === 4) {
                console.log(`Using compound transition: ${currentState} → 3 → ${targetState}`);
                await performCompoundTransition(currentState, 3, targetState);
            }
            // For 2->4: go through state 3 first
            else if (currentState === 2 && targetState === 4) {
                console.log(`Using compound transition: ${currentState} → 3 → ${targetState}`);
                await performCompoundTransition(currentState, 3, targetState);
            }
            // For 4->2: go through state 3 first
            else if (currentState === 4 && targetState === 2) {
                console.log(`Using compound transition: ${currentState} → 3 → ${targetState}`);
                await performCompoundTransition(currentState, 3, targetState);
            }
            else {
                // Fallback to instant transition
                console.log(`No animation found for transition ${currentState}-${targetState}, using instant transition`);
                await instantTransition(targetState);
            }
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
    let titleElement, desc1Element, desc2Element;
    
    if (layoutMode === 'portrait') {
        titleElement = mobileMainTitle;
        desc1Element = mobileDescription1;
        desc2Element = mobileDescription2;
    } else { // desktop or landscape
        titleElement = mainTitle;
        desc1Element = description1;
        desc2Element = description2;
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
        const response = await fetch(svgPath);
        const svgContent = await response.text();
        container.innerHTML = svgContent;
        
        // Add fade-in animation
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

// Compound transition through intermediate state
async function performCompoundTransition(fromState, intermediateState, toState) {
    console.log(`Starting compound transition: ${fromState} → ${intermediateState} → ${toState}`);
    
    try {
        // Start text transition from current state to target state (skip intermediate)
        startTextTransition(fromState, toState);
        
        // First leg: from current to intermediate (passing true to indicate this is part of compound)
        const firstKey = `${fromState}-${intermediateState}`;
        const firstAnimation = animations[firstKey];
        
        if (firstAnimation) {
            await playTransitionAnimation(firstAnimation, intermediateState, true);
            console.log(`First leg complete: ${fromState} → ${intermediateState}`);
        } else {
            await instantTransition(intermediateState, true);
            console.log(`First leg complete (instant): ${fromState} → ${intermediateState}`);
        }
        
        // Brief pause between animations
        await wait(50);
        
        // Second leg: direct from intermediate to target
        const secondKey = `${intermediateState}-${toState}`;
        const secondAnimation = animations[secondKey];
        
        if (secondAnimation) {
            await playTransitionAnimation(secondAnimation, toState, true);
            console.log(`Second leg complete: ${intermediateState} → ${toState}`);
        } else {
            await instantTransition(toState, true);
            console.log(`Second leg complete (instant): ${intermediateState} → ${toState}`);
        }
        
        // Ensure final state image and content are set correctly
        const finalState = states[toState];
        if (finalState && finalState.image) {
            stateVisual.src = finalState.image;
            updateContent(toState);
        }
        
        console.log(`Compound transition complete: ${fromState} → ${intermediateState} → ${toState}`);
    } catch (error) {
        console.error('Error in compound transition:', error);
        // Fallback to direct instant transition
        await instantTransition(toState);
    }
}

// Instant transition fallback when no animation exists
function instantTransition(targetState, isCompoundSegment = false) {
    return new Promise((resolve) => {
        const newState = states[targetState];
        if (newState && newState.image) {
            const preloadedImg = preloadedImages.get(newState.image);
            
            const updateImage = () => {
                // Use requestAnimationFrame for smooth transition
                requestAnimationFrame(() => {
                    stateVisual.src = newState.image;
                    if (!isCompoundSegment) {
                        updateContent(targetState);
                    }
                    
                    // Wait for next frame before adjusting layout
                    requestAnimationFrame(() => {
                        adjustPortraitLayout();
                        setTimeout(() => {
                            resolve();
                        }, 16); // One frame delay
                    });
                });
            };
            
            if (preloadedImg) {
                updateImage();
            } else {
                // Fallback if not preloaded
                const tempImg = new Image();
                tempImg.onload = updateImage;
                tempImg.onerror = () => {
                    console.warn(`Failed to load image: ${newState.image}`);
                    resolve();
                };
                tempImg.src = newState.image;
            }
        } else {
            resolve();
        }
    });
}

// Play transition animation
function playTransitionAnimation(animationPath, targetState, isCompoundSegment = false) {
    return new Promise((resolve, reject) => {
        const preloadedVideo = preloadedVideos.get(animationPath);
        
        // Pre-load the target image to ensure smooth transition
        const newState = states[targetState];
        const preloadedImg = newState ? preloadedImages.get(newState.image) : null;
        
        console.log(`🎬 Starting transition: ${currentState}→${targetState} (${animationPath})`);
        console.log(`📹 Video preloaded: ${!!preloadedVideo}`);
        console.log(`🖼️ Target image preloaded: ${!!preloadedImg}`);
        
        const startAnimation = () => {
            console.log(`▶️ Starting video playback - readyState: ${stateAnimation.readyState}, duration: ${stateAnimation.duration}`);
            
            // Ensure the video is properly reset before playing
            stateAnimation.currentTime = 0;
            stateAnimation.playbackRate = 1;
            
            // Apply dimension normalization for problematic videos
            const videoWidth = stateAnimation.videoWidth || (preloadedVideo ? preloadedVideo.videoWidth : 1920);
            const standardWidth = 1920;
            
            if (videoWidth !== standardWidth) {
                const scaleX = standardWidth / videoWidth;
                console.log(`🔧 Applying scale correction: ${scaleX.toFixed(4)} for ${videoWidth}px → ${standardWidth}px`);
                stateAnimation.style.transform = `scale(${scaleX}, 1)`;
            } else {
                stateAnimation.style.transform = '';
            }
            
            // Wait one frame before starting to ensure proper synchronization
            requestAnimationFrame(() => {
                stateAnimation.classList.add('playing');
                
                const playPromise = stateAnimation.play();
                if (playPromise !== undefined) {
                    playPromise.catch(err => {
                        console.error('Playback error:', err);
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
            console.log(`🏁 Video ended - currentTime: ${stateAnimation.currentTime}, duration: ${stateAnimation.duration}`);
            updateToTargetImage();
        };

        stateAnimation.onerror = () => {
            console.error(`Failed to load animation: ${animationPath}`);
            instantTransition(targetState, isCompoundSegment).then(resolve).catch(reject);
        };

        // Add additional event listeners for debugging
        stateAnimation.onloadstart = () => console.log(`📥 Video load start: ${animationPath}`);
        stateAnimation.oncanplay = () => console.log(`✅ Video can play - readyState: ${stateAnimation.readyState}`);
        stateAnimation.onplaying = () => console.log(`▶️ Video playing started`);
        stateAnimation.onseeking = () => console.log(`⏩ Video seeking to: ${stateAnimation.currentTime}`);
        stateAnimation.onseeked = () => console.log(`⏭️ Video seek complete: ${stateAnimation.currentTime}`);

        function updateToTargetImage() {
            console.log(`🖼️ Updating to target image: ${newState?.image}`);
            console.log(`📐 Video final frame: ${stateAnimation.videoWidth}x${stateAnimation.videoHeight}`);
            console.log(`📐 Container dimensions: ${stateAnimation.offsetWidth}x${stateAnimation.offsetHeight}`);
            
            if (newState && newState.image) {
                const updateImage = () => {
                    // Get the current visual state before switching
                    const videoBounds = stateAnimation.getBoundingClientRect();
                    console.log(`📊 Video bounds before switch: ${videoBounds.width}x${videoBounds.height} at (${videoBounds.left}, ${videoBounds.top})`);
                    
                    // Use requestAnimationFrame for smooth transition
                    requestAnimationFrame(() => {
                        console.log(`🔄 Switching image source`);
                        
                        // Force the video to fade out faster to minimize visible switching
                        stateAnimation.style.transition = 'opacity 0.05s ease-out';
                        stateAnimation.style.opacity = '0';
                        
                        // Switch image immediately
                        stateVisual.src = newState.image;
                        if (!isCompoundSegment) {
                            updateContent(targetState);
                        }
                        
                        // Wait for next frame before removing playing class
                        requestAnimationFrame(() => {
                            console.log(`🎭 Removing playing class and finishing transition`);
                            stateAnimation.classList.remove('playing');
                            
                            // Reset transition and transform back to normal
                            stateAnimation.style.transition = '';
                            stateAnimation.style.opacity = '';
                            stateAnimation.style.transform = '';
                            
                            // Get image bounds after switch
                            const imageBounds = stateVisual.getBoundingClientRect();
                            console.log(`📊 Image bounds after switch: ${imageBounds.width}x${imageBounds.height} at (${imageBounds.left}, ${imageBounds.top})`);
                            
                            adjustPortraitLayout();
                            
                            // Small delay to ensure everything is settled
                            setTimeout(() => {
                                console.log(`✅ Transition complete: ${currentState}→${targetState}`);
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
                        console.warn(`Failed to load image: ${newState.image}`);
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
        
        // Handle SVG content for desktop
        if (state.svg && svgContainer) {
            loadSVG(state.svg, svgContainer);
        } else if (svgContainer) {
            clearSVG(svgContainer);
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
        
        // Handle SVG content for mobile
        if (state.svg && mobileSvgContainer) {
            loadSVG(state.svg, mobileSvgContainer);
        } else if (mobileSvgContainer) {
            clearSVG(mobileSvgContainer);
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
        console.log('Click capture layer found, adding click listener');
        
        ['touchstart', 'mousedown'].forEach(eventType => {
            clickCaptureLayer.addEventListener(eventType, (e) => {
                e.preventDefault();
                console.log('Background clicked!');
                
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
 * Direct transitions: 1↔2, 2↔3, 3↔4, 3→1, 1→3
 * Compound transitions:
 * - 1→4, 2→4: go through state 3 first
 * - 4→1, 4→2: go through state 3 first
 */