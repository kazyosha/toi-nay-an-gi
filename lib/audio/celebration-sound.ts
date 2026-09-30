type AudioContextConstructor = new () => AudioContext

function getAudioContextConstructor() {
  if (typeof window === 'undefined') return null

  return window.AudioContext ?? (window as typeof window & { webkitAudioContext?: AudioContextConstructor }).webkitAudioContext ?? null
}

export function playCelebrationSound() {
  const context = createAudioContext()
  if (!context) return

  try {
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

function createAudioContext() {
  const AudioContextClass = getAudioContextConstructor()
  if (!AudioContextClass) return null

  try {
    return new AudioContextClass()
  } catch {
    return null
  }
}

export function playApplauseSound() {
  const context = createAudioContext()
  if (!context) return

  try {
    const buffer = context.createBuffer(1, context.sampleRate * 0.16, context.sampleRate)
    const data = buffer.getChannelData(0)
    for (let index = 0; index < data.length; index += 1) data[index] = Math.random() * 2 - 1

    ;[0, 0.18, 0.34, 0.52, 0.74].forEach((delay, index) => {
      const source = context.createBufferSource()
      const gain = context.createGain()
      source.buffer = buffer
      gain.gain.setValueAtTime(0.0001, context.currentTime + delay)
      gain.gain.exponentialRampToValueAtTime(0.24 - index * 0.02, context.currentTime + delay + 0.012)
      gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + delay + 0.14)
      source.connect(gain)
      gain.connect(context.destination)
      source.start(context.currentTime + delay)
      source.stop(context.currentTime + delay + 0.16)
    })

    window.setTimeout(() => void context.close(), 1200)
  } catch {
    void context.close()
  }
}

export function startSpinSound() {
  const context = createAudioContext()
  if (!context) return () => undefined

  try {
    const tickTimer = window.setInterval(() => {
      const tick = context.createOscillator()
      const tickGain = context.createGain()
      const filter = context.createBiquadFilter()
      tick.type = 'triangle'
      tick.frequency.setValueAtTime(260 + Math.random() * 90, context.currentTime)
      filter.type = 'lowpass'
      filter.frequency.setValueAtTime(1400, context.currentTime)
      tickGain.gain.setValueAtTime(0.0001, context.currentTime)
      tickGain.gain.exponentialRampToValueAtTime(0.022, context.currentTime + 0.006)
      tickGain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.075)
      tick.connect(tickGain)
      tickGain.connect(filter)
      filter.connect(context.destination)
      tick.start()
      tick.stop(context.currentTime + 0.08)
    }, 150)

    return () => {
      window.clearInterval(tickTimer)
      window.setTimeout(() => void context.close(), 120)
    }
  } catch {
    void context.close()
    return () => undefined
  }
}
