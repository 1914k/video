<template>
  <el-container>
    <el-header height="40px">视屏监控平台</el-header>
    <el-container class="content">
      <el-aside width="290px">
        <menu-aside @add-video-list="addVideoList" />
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
      videoList: undefined
    };
  },
  components: {
    JxVideo,
    MenuAside
  },
  methods: {
    addVideoList(list) {
      this.videoList = list;
      console.log("视屏播放列表", this.videoList);
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
