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
    <input type="button" @click="playList" value="播放列表" />
    <input type="button" @click="playOne" value="播放1个" />
  </div>
</template>

<script>
import jxCmsPluginVideoMain from "@layen-king/jx-cms-video-main-plugin";
export default {
  name: "jxVideo",
  components: { jxCmsPluginVideoMain },
  data() {
    return {
      maxWindowNum: 16,
      currentVideoIndex: 0,
      videoData: [],
      videoCommand: null
    };
  },
  created() {},
  mounted() {},
  methods: {
    playOne() {
      // this.videoData = { videoNo: 1010010010102002, name: "#1固定机(网络)" };
    },
    playList() {
      this.videoData = [
        // { videoNo: 1010010030102002, name: "#1固定机(网络)" },
        // { videoNo: 1010010010100001, name: "#1高速球机(网络)" },
        // { videoNo: 1010010010102007, name: "#6固定机(网络)" },
        // { videoNo: 1010010010102008, name: "#7固定机(网络)" },
        // { videoNo: 1010010010301005, name: "声光告警#1" },
        // { videoNo: 1010010010200001, name: "温度#1" }
      ];
    }
  }
};
// {
//   "param": {
//     "szDevId": "1010010010102002",
//     "iVideoFlag": 1,
//     "httpFlvUrl_internal": "http://192.168.7.232:8000/live/1010010010102002_1.flv",
//     "httpFlvUrl": "http://192.168.7.232:8000/live/1010010010102002_1.flv",
//     "szMessageString": "",
//     "rtmpUrl_internal": "rtmp://192.168.7.232:1935/live/1010010010102002_1",
//     "rtmpUrl": "rtmp://192.168.7.232:1935/live/1010010010102002_1",
//     "websocketUrl": "ws://192.168.7.232:8000/live/1010010010102002_1.flv",
//     "hlsUrl_internal": "http://192.168.7.232:8000/live/1010010010102002_1/index.m3u8",
//     "websocketUrl_internal": "ws://192.168.7.232:8000/live/1010010010102002_1.flv",
//     "iMessageCode": 0,
//     "hlsUrl": "http://192.168.7.232:8000/live/1010010010102002_1/index.m3u8"
//   },
//   "command": {
//     "iSeqNum": 25,
//     "iProtocol": 1,
//     "szClientId": "wangyl12345",
//     "iCommand": 2106,
//     "iAttrVal": 54
//   }
// }
</script>
