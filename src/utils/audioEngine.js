let ctx = null;

export function getAudioContext() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export const NOTE_FREQUENCIES = {
  C3: 130.81, D3: 146.83, E3: 164.81, F3: 174.61,
  G3: 196.00, A3: 220.00, B3: 246.94,
  C4: 261.63, D4: 293.66, E4: 329.63, F4: 349.23,
  G4: 392.00, A4: 440.00, B4: 493.88,
  // Black keys
  Cs3: 138.59, Ds3: 155.56, Fs3: 185.00, Gs3: 207.65, As3: 233.08,
  Cs4: 277.18, Ds4: 311.13, Fs4: 369.99, Gs4: 415.30, As4: 466.16,
};

export function playNote(frequency, duration = 0.3, volume = 0.3) {
  const ac = getAudioContext();
  const osc = ac.createOscillator();
  const gain = ac.createGain();

  osc.connect(gain);
  gain.connect(ac.destination);

  osc.type = 'square';
  osc.frequency.setValueAtTime(frequency, ac.currentTime);

  gain.gain.setValueAtTime(volume, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + duration);

  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + duration);
}

export function playDodgeSound() {
  const ac = getAudioContext();
  const osc = ac.createOscillator();
  const gain = ac.createGain();
  
  osc.connect(gain);
  gain.connect(ac.destination);
  
  osc.type = 'square';
  osc.frequency.setValueAtTime(200, ac.currentTime);
  osc.frequency.linearRampToValueAtTime(600, ac.currentTime + 0.1);
  
  gain.gain.setValueAtTime(0.2, ac.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + 0.15);
  
  osc.start(ac.currentTime);
  osc.stop(ac.currentTime + 0.15);
}

export function playGameOverSound() {
  const ac = getAudioContext();
  [400, 300, 200, 100].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    
    osc.connect(gain);
    gain.connect(ac.destination);
    
    osc.type = 'square';
    osc.frequency.setValueAtTime(freq, ac.currentTime + i * 0.15);
    
    gain.gain.setValueAtTime(0.3, ac.currentTime + i * 0.15);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.15 + 0.14);
    
    osc.start(ac.currentTime + i * 0.15);
    osc.stop(ac.currentTime + i * 0.15 + 0.14);
  });
}

export function playSuccessSound() {
  const ac = getAudioContext();
  [300, 400, 500, 700].forEach((freq, i) => {
    const osc = ac.createOscillator();
    const gain = ac.createGain();
    
    osc.connect(gain);
    gain.connect(ac.destination);
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, ac.currentTime + i * 0.1);
    
    gain.gain.setValueAtTime(0.25, ac.currentTime + i * 0.1);
    gain.gain.exponentialRampToValueAtTime(0.001, ac.currentTime + i * 0.1 + 0.09);
    
    osc.start(ac.currentTime + i * 0.1);
    osc.stop(ac.currentTime + i * 0.1 + 0.09);
  });
}
