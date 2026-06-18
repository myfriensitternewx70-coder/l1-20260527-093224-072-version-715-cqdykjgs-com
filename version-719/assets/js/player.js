import { H as Hls } from './hls-vendor-dru42stk.js';

const players = document.querySelectorAll('[data-player]');

players.forEach((player) => {
  const video = player.querySelector('video');
  const playButton = player.querySelector('[data-play-button]');
  const videoUrl = player.dataset.videoUrl;

  if (!video || !videoUrl) {
    return;
  }

  let hls = null;

  if (Hls.isSupported()) {
    hls = new Hls({
      enableWorker: true,
      lowLatencyMode: true
    });

    hls.loadSource(videoUrl);
    hls.attachMedia(video);

    hls.on(Hls.Events.ERROR, (eventName, data) => {
      if (!data.fatal) {
        return;
      }

      if (data.type === Hls.ErrorTypes.NETWORK_ERROR) {
        hls.startLoad();
        return;
      }

      if (data.type === Hls.ErrorTypes.MEDIA_ERROR) {
        hls.recoverMediaError();
        return;
      }

      hls.destroy();
    });
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    video.src = videoUrl;
  }

  const updatePlayButton = () => {
    if (playButton) {
      playButton.classList.toggle('is-hidden', !video.paused);
    }
  };

  if (playButton) {
    playButton.addEventListener('click', async () => {
      try {
        await video.play();
      } catch (error) {
        video.controls = true;
      }
    });
  }

  video.addEventListener('play', updatePlayButton);
  video.addEventListener('pause', updatePlayButton);
  video.addEventListener('ended', updatePlayButton);
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play().catch(() => {
        video.controls = true;
      });
    } else {
      video.pause();
    }
  });

  window.addEventListener('beforeunload', () => {
    if (hls) {
      hls.destroy();
    }
  });
});
