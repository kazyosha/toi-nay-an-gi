type AudioContextConstructor = new () => AudioContext

function getAudioContextConstructor() {
  if (typeof window === 'undefined') return null

  return window.AudioContext ?? (window as typeof window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext ?? null
}

export function playCelebrationSound() {
  const AudioContextClass = getAudioContextConstructor()
  if (!AudioContextClass) return

  try {
    const context = new AudioContextClass()
    const gain = context.createGain()
    gain.gain.setValueAtTime(0.0001, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.16, context.currentTime + 0.04)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.05)
    gain.connect(context.destination)

    ;[523.25, 659.25, 783.99, 1046.5].forEach((frequency, index) => {
      const oscillator = context.createOscillator()
      oscillator.type = index === 3 ? 'sine' : 'triangle'
      oscillator.frequency.setValueAtTime(frequency, context.currentTime + index * 0.12)
      oscillator.connect(gain)
      oscillator.start(context.currentTime + index * 0.12)
      oscillator.stop(context.currentTime + 0.72 + index * 0.12)
    })

    window.setTimeout(() => void context.close(), 1300)
  } catch {
    // Audio is optional and may be unavailable or blocked by browser policy.
  }
}
