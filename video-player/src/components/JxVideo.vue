<template>
  <div style="min-height:400px;overflow:hidden">
    <jxCmsPluginVideoMain
      ref="videoMain"
      :userName="userName"
      :passWord="passWord"
      :defaultWindowNum="defaultWindowNum"
      :isFloatMode="isFloatMode"
      :isSimpleMode="isSimpleMode"
      :videoData="videoData"
      @islogin="islogin"
      style="height:600px"
    >
      <template v-slot:waiting></template>
      <template v-slot:PTZ3D></template>
      <template v-slot:errorMessage></template>
      <template v-slot:toolBar></template>
    </jxCmsPluginVideoMain>
    <div class="button-list"></div>
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
    },
    videoNo: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      maxWindowNum: 16,
      currentVideoIndex: 0,
      videoData: [],
      videoNoList: [],
      videoCommand: null,
      userName: undefined,
      passWord: undefined,
      defaultWindowNum: undefined,
      isFloatMode: undefined,
      isSimpleMode: undefined
    };
  },
  watch: {
    videoList() {
      this.playOne();
    },
    videoNo(val) {
      this.playOne(val);
      // this.playList();
    }
  },
  created() {
    this.getData();
  },
  methods: {
    playList() {
      if (this.videoList.length > 0) this.videoData = this.videoList;
    },
    playOne(videoNo) {
      if (
        this.videoList.length > 0 &&
        this.videoNoList.indexOf(videoNo) == -1
      ) {
        let no = 0,
          idx = 0;
        if (videoNo) {
          for (let i of this.videoList) {
            if (videoNo == i.videoNo) {
              this.videoNoList.push(videoNo);
              break;
            }
            idx++;
          }
          no = idx;
        } else {
          this.videoNoList.push(this.videoList[0].videoNo);
        }
        this.videoData = this.videoList[no];
      }
    },
    getData() {
      this.userName = jx_cms_global_config_.userName;
      this.passWord = jx_cms_global_config_.passWord;
      this.defaultWindowNum = jx_cms_global_config_.defaultWindowNum;
      this.isFloatMode = jx_cms_global_config_.isFloatMode;
      this.isSimpleMode = jx_cms_global_config_.isSimpleMode;
    },
    islogin(token) {
      this.$emit("hasToken", token);
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
