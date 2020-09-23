<template>
  <el-container>
    <el-header height="40px">视屏监控平台</el-header>
    <el-container class="content">
      <el-aside width="260px">
        <menu-aside />
      </el-aside>
      <el-main>
        <jx-video />
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import JxVideo from "../components/JxVideo";
import MenuAside from "../components/MenuAside";
export default {
  name: "video-main",
  date() {
    return {
      data: []
    };
  },
  components: {
    JxVideo,
    MenuAside
  }
};
</script>
<style scoped>
.el-header {
  text-align: center;
  vertical-align: middle;
  line-height: 40px;
  border: 1px solid #000;
}
.el-aside {
  border: 1px solid #000;
}

.el-main {
  border: 1px solid #000;
}
</style>
