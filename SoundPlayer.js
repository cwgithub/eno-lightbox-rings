class SoundPlayer {
  constructor(audio, interval) {
    this.audio = audio;
    this.interval = interval * 1000;
    this.firstPlay = true;
    this.intervalId = null;
  }

  startPlaying() {
    // if (!this.intervalId) {
    //   this.playSound();
    // }

    this.intervalId = setInterval(() => {
      this.playSound();
    }, floor(this.interval / random(2, 5)));
  }

  stopPlaying() {
    clearInterval(this.intervalId);
  }

  playSound() {
    this.audio.currentTime = 0; // Rewind the audio to the beginning
    this.audio.play();

    if (this.firstPlay) {
      this.stopPlaying();
      this.intervalId = setInterval(() => {
        this.playSound();
      }, this.interval);
    }
  }
}

// Usage example
// const soundPlayer = new SoundPlayer("sound.mp3");
// soundPlayer.startPlaying();
