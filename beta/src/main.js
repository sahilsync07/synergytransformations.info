import './beta-style.css'; // Import the new minimalist styles

document.addEventListener('DOMContentLoaded', () => {

  // Dynamic Typewriter Effect for the Hero
  const typewriterText = document.getElementById('typewriter-text');
  
  if (typewriterText) {
    // Kept it simple and elegant. Only a few high-impact words.
    const sequence = [
      'structure.',
      'discipline.',
      'execution.',
      'permanent.'
    ];
    
    let sequenceIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    
    function type() {
      const currentWord = sequence[sequenceIndex];
      
      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }
      
      typewriterText.textContent = currentWord.substring(0, charIndex);
      
      // Speed adjustments for a premium feel
      let typeSpeed = isDeleting ? 40 : 80;
      
      if (!isDeleting && charIndex === currentWord.length) {
        typeSpeed = 2500; // Pause at the end of word
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        sequenceIndex = (sequenceIndex + 1) % sequence.length;
        typeSpeed = 500; // Pause before typing next word
      }
      
      setTimeout(type, typeSpeed);
    }
    
    // Slight delay before typing starts to allow entrance animations to finish
    setTimeout(type, 1200);
  }

  // Subtle Mouse Parallax for ambient background
  const ambient = document.querySelector('.beta-ambient');
  if (ambient) {
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 20; // max 10px move
      const y = (e.clientY / window.innerHeight - 0.5) * 20;
      ambient.style.transform = `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
    });
  }
});
