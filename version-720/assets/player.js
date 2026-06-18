import { H as Hls } from './hls-vendor-dru42stk.js';

function canPlayNativeHls(video) {
  return video.canPlayType('application/vnd.apple.mpegurl') || video.canPlayType('application/x-mpegURL');
}

function bindPlayer(player) {
  const video = player.querySelector('video');
  const startButton = player.querySelector('[data-player-start]');
  const source = player.dataset.src;
  let hlsInstance = null;

  if (!video || !startButton || !source) {
    return;
  }

  function attachSource() {
    if (source.includes('.m3u8')) {
      if (canPlayNativeHls(video)) {
        video.src = source;
      } else if (Hls && Hls.isSupported()) {
        hlsInstance = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hlsInstance.loadSource(source);
        hlsInstance.attachMedia(video);
      } else {
        video.src = source;
      }
    } else {
      video.src = source;
    }
  }

  startButton.addEventListener('click', function () {
    if (!video.src && !hlsInstance) {
      attachSource();
    }
    startButton.classList.add('is-hidden');
    const playPromise = video.play();
    if (playPromise && typeof playPromise.catch === 'function') {
      playPromise.catch(function () {
        startButton.classList.remove('is-hidden');
      });
    }
  });

  video.addEventListener('play', function () {
    startButton.classList.add('is-hidden');
  });

  video.addEventListener('pause', function () {
    if (video.currentTime === 0 || video.ended) {
      startButton.classList.remove('is-hidden');
    }
  });
}

document.querySelectorAll('[data-video-player]').forEach(bindPlayer);
