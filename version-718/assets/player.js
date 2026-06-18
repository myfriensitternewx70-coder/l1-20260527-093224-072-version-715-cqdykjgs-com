(function () {
  function ready(callback) {
    if (document.readyState !== "loading") {
      callback();
      return;
    }
    document.addEventListener("DOMContentLoaded", callback);
  }

  ready(function () {
    var players = Array.prototype.slice.call(document.querySelectorAll(".video-player"));
    players.forEach(initPlayer);
  });

  function initPlayer(player) {
    var video = player.querySelector("video");
    var button = player.querySelector(".play-button");
    var source = player.getAttribute("data-src") || (video ? video.getAttribute("data-src") : "");
    var hls = null;

    if (!video || !source) {
      return;
    }

    function loadSource() {
      if (video.getAttribute("data-ready") === "true") {
        return;
      }
      if (window.Hls && window.Hls.isSupported()) {
        hls = new window.Hls({
          enableWorker: true,
          lowLatencyMode: true
        });
        hls.loadSource(source);
        hls.attachMedia(video);
      } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
        video.src = source;
      } else {
        video.src = source;
      }
      video.setAttribute("data-ready", "true");
    }

    function playVideo() {
      loadSource();
      video.play().catch(function () {
        player.classList.remove("is-playing");
      });
    }

    if (button) {
      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        playVideo();
      });
    }

    player.addEventListener("click", function (event) {
      if (event.target === video) {
        return;
      }
      playVideo();
    });

    video.addEventListener("play", function () {
      player.classList.add("is-playing");
    });

    video.addEventListener("pause", function () {
      player.classList.remove("is-playing");
    });

    video.addEventListener("ended", function () {
      player.classList.remove("is-playing");
      if (hls) {
        hls.stopLoad();
      }
    });
  }
})();
