<template>
  <el-container>
    <el-header height="50px"></el-header>
    <el-container class="content">
      <el-aside width="320px">
        <menu-aside
          :key="timer"
          :device-tree="deviceTree"
          @add-video-list="addVideoList"
        />
      </el-aside>
      <el-main>
        <jx-video :video-list="videoList" @hasToken="hasToken" />
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
    this.fullscreenLoading();
  },
  methods: {
    addVideoList(list) {
      this.videoList = list;
    },
    hasToken(token) {
      this.token = token;
      this.getDevice();
    },
    getDevice() {
      this.$axios
        .get(
          process.env.VUE_APP_BASEURL +
            "/video/CmsDeviceUnitTreeService/getDeviceUnitTree",
          {
            params: {
              unitId: 1
            }
          }
        )
        .then(res => {
          this.deviceTree = res.data;
          this.timer = new Date().getTime();
          this.loading.close();
        })
        .catch(err => {
          console.log("失败", err);
          this.timer = new Date().getTime();
          this.loading.close();
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
.el-header {
  text-align: center;
  vertical-align: middle;
  line-height: 40px;
}
.el-aside {
  padding: 20px 0 20px 20px;
}
</style>
