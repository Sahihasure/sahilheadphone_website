gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("hero-lightpass");
const context = canvas.getContext("2d");

// The directory contains 200 frames for the explosion sequence.
const frameCount = 200;
const currentFrame = index => (
  `ezgif-frame-${(index + 1).toString().padStart(3, '0')}.jpg`
);

const images = [];
const airpods = {
  frame: 0
};

// Use natural dimensions of the frames or a standard 16:9 like 1920x1080. 
// Assuming the ezgif images are smaller, we'll draw them scaled.
// We preload the first image to get correct dimensions and paint it.
const initialImage = new Image();
initialImage.src = currentFrame(0);
initialImage.onload = () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  renderInitial(initialImage);
};

// Handle window resize
window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    render();
});

// Preload all images
for (let i = 0; i < frameCount; i++) {
  const img = new Image();
  img.src = currentFrame(i);
  images.push(img);
}

function renderInitial(img) {
  const hRatio = canvas.width / img.width;
  const vRatio = canvas.height / img.height;
  // Using Math.min ensures the headphone fits entirely cleanly inside the viewport without zooming in and pixelating.
  const ratio  = Math.min(hRatio, vRatio); 
  // Optionally cap the ratio to prevent artificial stretching of low-res images
  const finalRatio = Math.min(ratio, 1.5); 
  
  const centerShift_x = (canvas.width - img.width * finalRatio) / 2;
  const centerShift_y = (canvas.height - img.height * finalRatio) / 2;  
  
  context.clearRect(0, 0, canvas.width, canvas.height);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = 'high';
  context.drawImage(img, 0,0, img.width, img.height,
                    centerShift_x, centerShift_y, img.width * finalRatio, img.height * finalRatio);
}

function render() {
  if(images[airpods.frame] && images[airpods.frame].complete) {
      renderInitial(images[airpods.frame]);
  }
}

// 1. Image Sequence Scroll Trigger
gsap.to(airpods, {
  frame: frameCount - 1,
  snap: "frame",
  ease: "none",
  scrollTrigger: {
    trigger: "body",
    start: "top top",
    end: "bottom bottom",
    scrub: 0.1 // Smooth out the scrub slightly
  },
  onUpdate: render
});

// 2. Navbar Glassmorphism scroll reveal
gsap.to("#navbar", {
    opacity: 1,
    scrollTrigger: {
        trigger: "body",
        start: "100px top",
        end: "300px top",
        scrub: true
    }
});

// 3. Staggered, cinematic text reveals for the story beats
const beats = gsap.utils.toArray('.story-beat');

beats.forEach((beat, i) => {
    // Setup initial state visually
    gsap.set(beat, { autoAlpha: 0, y: 50 });
    
    ScrollTrigger.create({
        trigger: beat.parentElement,
        start: "top 60%", // When top of container hits 60% down the screen
        end: "bottom 30%", // When bottom of container hits 30% down the screen
        onEnter: () => gsap.to(beat, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }),
        onLeave: () => gsap.to(beat, { autoAlpha: 0, y: -50, duration: 0.8, ease: "power2.in" }),
        onEnterBack: () => gsap.to(beat, { autoAlpha: 1, y: 0, duration: 1, ease: "power2.out" }),
        onLeaveBack: () => gsap.to(beat, { autoAlpha: 0, y: 50, duration: 0.8, ease: "power2.in" })
    });
});
