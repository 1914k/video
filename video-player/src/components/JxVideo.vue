<template>
  <div style="min-height:400px;overflow:hidden">
    <jxCmsPluginVideoMain
      ref="videoMain"
      userName="wangyl12345"
      passWord="12345"
      :defaultWindowNum="1"
      :isFloatMode="false"
      :isSimpleMode="false"
      :videoData="videoData"
      style="height:600px"
    >
      <template v-slot:waiting></template>
      <template v-slot:PTZ3D></template>
      <template v-slot:errorMessage></template>
      <template v-slot:toolBar></template>
    </jxCmsPluginVideoMain>
    <div class="button-list">
      <!-- <input type="button" @click="playList" value="播放列表" />
      <input type="button" @click="playOne" value="播放1个" />-->
    </div>
  </div>
</template>

<script>
import jxCmsPluginVideoMain from "@layen-king/jx-cms-video-main-plugin";
export default {
  name: "jxVideo",
  components: { jxCmsPluginVideoMain },
  props: {
    videoList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {
      maxWindowNum: 16,
      currentVideoIndex: 0,
      videoData: [],
      videoCommand: null
    };
  },
  watch: {
    videoList(val) {
      console.log("变了", val);
      this.playList();
    }
  },
  mounted() {},
  methods: {
    playOne() {
      console.log("播放", this.videoList[0]);
      if (this.videoList.length > 0) this.videoData = this.videoList[0];
    },
    playList() {
      if (this.videoList.length > 0) this.videoData = this.videoList;
    }
  }
};
</script>

<style scoped>
.button-list {
  padding-top: 20px;
}
.button-list input {
  color: #fff;
  border: 1px solid #0aa7d3;
  border-radius: 4px;
  border-width: 1px;
  padding: 5px;
  background: linear-gradient(#19f4ed, #088ef0);
}
.button-list input:focus {
  outline: none;
}
.button-list input:active {
  outline: none;
  border: 1px solid rgba(10, 167, 211, 0);
  background: linear-gradient(#44baff, #5685a7);
}
.button-list input:first-child {
  margin-right: 10px;
}
</style>
