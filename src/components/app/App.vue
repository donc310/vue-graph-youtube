<template>
  <window :title="title" v-show="videoId" @close="closeVideo">
    <div id="player"></div>
  </window>
</template>

<script>
import Window from "./Window.vue";
import { head_script } from "./util/util";
import EventBus from "../../lib/util/event";

export default {
  name: "VideoPreview",
  data() {
    return {
      title: "Video Preview",
      videoId: null
    };
  },
  components: {
    Window
  },
  watch: {
    videoId(newVideoId) {
      this.play(newVideoId);
    }
  },
  methods: {
    closeVideo() {
      this.videoId = null;
    },
    play(videoId) {
      if (this.player) {
        this.player.destroy();
        this.player = null;
      }

      if (!videoId) {
        return;
      }

      this.player = new YT.Player("player", {
        height: "100%",
        width: "100%",
        videoId,
        events: {
          onStateChange: event => {
            if (event.data === YT.PlayerState.ENDED) {
              var vm = this;
              setTimeout(() => {
                vm.closeVideo();
              }, 1000);
            }
          },
          onReady: () => {
            const data = this.player.getVideoData();
            this.title = data.title;
            this.player.playVideo();
          }
        }
      });
    }
  },
  mounted() {
    head_script("//www.youtube.com/player_api");
    var vm = this;
    EventBus.$on("CORE::NODE_SELECTED", nodeId => {
      vm.videoId = nodeId;
    });
    if (this.videoId) this.play(this.videoId);
  }
};
</script>
<style>
  .window {
    left: 8px;
    top: 64px;
    width: 420px;
    height: 290px; /* 248 - is golden ratio of 420 + 42px for the header */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2), 0 -1px 0 rgba(0, 0, 0, 0.02);
  }
</style>
