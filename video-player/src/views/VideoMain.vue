<template>
  <el-container>
    <el-container class="content">
      <el-aside width="320px">
        <menu-aside
          v-if="deviceTree.length > 0"
          :key="timer"
          :device-tree="deviceTree"
          @add-video-list="addVideoList"
          @get-video-no="getVideoNo"
        />
      </el-aside>
      <el-main>
        <jx-video
          :video-list="videoList"
          :video-no="videoNo"
          @hasToken="hasToken"
        />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import JxVideo from "../components/JxVideo";
import MenuAside from "../components/MenuAside";
// import { cmsUrl } from "../config";

export default {
  name: "video-main",
  data() {
    return {
      videoList: undefined,
      videoNo: undefined,
      deviceTree: [],
      loading: undefined,
      timer: "",
      token: undefined
    };
  },
  components: {
    JxVideo,
    MenuAside
  },
  created() {
    // this.fullscreenLoading();
  },
  methods: {
    addVideoList(list) {
      this.videoList = list;
    },
    getVideoNo(no) {
      this.videoNo = no;
    },
    hasToken(token) {
      this.token = token;
      this.getDevice();
    },
    getDevice() {
      this.$axios
        .get(
          jx_cms_global_config_.cmsUrl +
            "/video/CmsDeviceUnitTreeService/getDeviceUnitTree",
          {
            params: {
              unitId: 1
            }
          }
        )
        .then(res => {
          this.deviceTree = res.data;
          // this.timer = new Date().getTime();
          this.loading.close();
          // 清除外层HTML的loading动画
        })
        .catch(err => {
          console.log("失败", err);
          this.timer = new Date().getTime();
          // this.loading.close();
          // 清除外层HTML的loading动画
          if (parent && parent.clearLoading) {
            parent.clearLoading();
          }
        });
    },
    fullscreenLoading() {
      this.loading = this.$loading({
        lock: true,
        text: "Loading",
        spinner: "el-icon-loading",
        background: "rgba(0, 0, 0, 0.7)"
      });
    }
  }
};
</script>
<style scoped>
.el-aside {
  padding: 20px 0 20px 20px;
}
.el-main {
  padding-bottom: 20px;
}
</style>
