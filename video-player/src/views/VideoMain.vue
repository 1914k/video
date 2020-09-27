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
        <jx-video :video-list="videoList" />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import JxVideo from "../components/JxVideo";
import MenuAside from "../components/MenuAside";
export default {
  name: "video-main",
  data() {
    return {
      videoList: undefined,
      deviceTree: [],
      loading: undefined,
      timer: ""
    };
  },
  components: {
    JxVideo,
    MenuAside
  },
  created() {
    this.init();
  },
  methods: {
    addVideoList(list) {
      this.videoList = list;
      console.log("视屏", this.videoList);
    },
    init() {
      this.fullscreenLoading();
      const BaseUrl = this.getBaseUrl();
      this.$axios
        .get(
          BaseUrl + "/video/CmsDeviceUnitTreeService/getDeviceUnitTree",
          {
            params: {
              unitId: 1
            }
          },
          {
            Headers: { Authorization: "bearer " + localStorage.JX_ACCESS_TOKEN }
          }
        )
        .then(res => {
          // console.log("成功", this.deviceTree);
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
    getBaseUrl() {
      return jx_cms_global_config_.cmsUrl;
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
