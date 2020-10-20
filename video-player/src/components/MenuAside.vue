<template>
  <el-container class="menu-aside">
    <el-header>
      <el-autocomplete
        class="search"
        v-model="searchInfo"
        clearable
        prefix-icon="el-icon-search"
        :fetch-suggestions="querySearch"
        placeholder="请输入内容"
        @select="handleSelect"
        @keyup.enter.native="handleSearch"
        :trigger-on-focus="false"
      ></el-autocomplete>
    </el-header>
    <el-main>
      <div class="device-tree">
        <el-scrollbar style="height:100%">
          <el-tree
            ref="tree"
            class="filter-tree"
            :filter-node-method="filterNode"
            :data="device_unit_tree"
            node-key="id"
            highlight-current
            :default-expanded-keys="expandedKey"
            :props="defaultProps"
            @node-click="handleClick"
          >
          </el-tree>
        </el-scrollbar>
      </div>
    </el-main>
  </el-container>
</template>

<script>
import "@/assets/css/aside.css";
export default {
  name: "menu-aside",
  props: {
    deviceTree: {
      type: Array,
      require: true
    }
  },
  data() {
    return {
      expandedKey: [],
      searchInfo: "",
      defaultProps: {
        children: "children",
        label: "text"
      },
      videoList: [],
      searchInfoArray: [],
      searchMap: undefined,
      queryTree: [],
      device_unit_tree: []
    };
  },
  watch: {
    searchInfo(val) {
      if (val === "") this.$refs.tree.filter("");
    }
  },
  created() {
    this.init();
  },
  methods: {
    // 初始化
    init() {
      this.device_unit_tree = this.deviceTree;
      try {
        this.getSearchList(this.searchInfoArray, this.device_unit_tree);
        // this.defaultExpanded("110kV碧桂站"); //默认打开的站点
        // this.defaultExpanded(); //默认打开第一个站点
      } catch (error) {
        // console.log(error);
      }
    },
    // 站点点击事件
    handleClick(node) {
      if (
        (Array.isArray(node.children) && node.children.length === 0) ||
        node.children === null
      ) {
        this.requestQueryTree(node);
      }
      if ("deviceType" in node) {
        // 获取视屏NO
        this.$emit("get-video-no", node.no);
      }
    },
    // 提交请求获取站点设备
    requestQueryTree(node) {
      const RequestInfo = this.getRequestInfo(node);
      const BaseUrl = RequestInfo.BaseUrl;
      const unitId = RequestInfo.unitId;
      this.$axios
        .get(BaseUrl + "/video/CmsTreeService/queryTreeData", {
          params: {
            unitId: unitId,
            view: "device",
            type: "SUB",
            filterType: "IPC"
          }
        })
        .then(res => {
          this.queryTree = res.data;
          this.appendTo(node); //给节点添加设备树
          this.getVideoList();
          this.$emit("add-video-list", this.videoList);
        })
        .catch(err => {
          console.log(err);
        });
    },
    getRequestInfo(node) {
      return {
        BaseUrl: jx_cms_global_config_.cmsUrl,
        unitId: node.id
      };
    },
    // 添加站点的设备节点
    appendTo(data) {
      const newChild = this.queryTree;
      if (!data.children) {
        this.$set(data, "children", []);
      }
      // 把设备树添加到站点中
      data.children.push(...newChild);
      // 默认展开该站点
      this.expandedKey = [];
      this.expandedKey.push(data.id);
    },
    // 选中搜索弹出框
    handleSelect(item) {
      this.handleSearch(item.value);
    },
    // 搜索站点
    handleSearch(value) {
      if (typeof value === "string") {
        // 点击搜索弹框时的搜索信息
        this.$refs.tree.filter(value);
      } else {
        // 点击回车时的搜索信息
        this.$refs.tree.filter(this.searchInfo);
      }
    },
    // 搜索输入提示
    querySearch(String, cb) {
      var searchInfoList = this.searchInfoArray;
      var results = String
        ? searchInfoList.filter(this.createFilter(String))
        : searchInfoList;
      // 调用 callback 返回建议列表的数据
      cb(results);
    },
    createFilter(String) {
      return searchInfoList => {
        return (
          searchInfoList.value.toLowerCase().indexOf(String.toLowerCase()) !==
          -1
        );
      };
    },
    // 从组织树中提取站点 text 和 id 添加到搜索选弹框中
    getSearchList(target_arr, source) {
      for (let item of source) {
        target_arr.push({ value: item.text, id: item.id, level: item.level });
        if (Array.isArray(item.children)) {
          this.getSearchList(this.searchInfoArray, item.children);
        }
      }
    },
    // 搜索过滤
    filterNode(value, data, node) {
      if (!value) return true;
      // 搜索的当前站点含有搜索信息
      let ifOne = data.text.indexOf(value) !== -1;
      // 搜索的父站点含有搜索信息
      let ifTwo =
        node.parent &&
        node.parent.data &&
        node.parent.data.text &&
        node.parent.data.text.indexOf(value) !== -1;
      let ifThree =
        node.parent &&
        node.parent.parent &&
        node.parent.parent.data &&
        node.parent.parent.data.text &&
        node.parent.parent.data.text.indexOf(value) !== -1;
      let ifFour =
        node.parent &&
        node.parent.parent &&
        node.parent.parent.parent &&
        node.parent.parent.parent.data &&
        node.parent.parent.parent.data.text &&
        node.parent.parent.parent.data.text.indexOf(value) !== -1;
      let resultOne = false;
      let resultTwo = false;
      let resultThree = false;
      let resultFore = false;
      let resultFive = false;

      if (node.level === 1) {
        resultOne = ifOne;
      } else if (node.level === 2) {
        resultTwo = ifOne || ifTwo;
      } else if (node.level === 3) {
        resultThree = ifOne || ifTwo || ifThree;
      } else if (node.level === 4) {
        // 展开搜索站点的设备树
        if (ifOne) {
          this.handleClick(data);
        }
        resultFore = ifOne || ifTwo || ifThree || ifFour;
      } else if (node.level === 5) {
        resultFive = ifOne || ifTwo || ifThree || ifFour;
      }
      return resultOne || resultTwo || resultThree || resultFore || resultFive;
    },
    // 得到站点的视屏 no 和 name
    getVideoList() {
      for (let index in this.queryTree) {
        let obj = {
          videoNo: this.queryTree[index].no,
          name: this.queryTree[index].name
        };
        this.videoList.push(obj);
      }
    },
    // 设置默认打开的站点
    defaultExpanded(text) {
      if (text) {
        setTimeout(() => {
          this.handleSearch(text);
        }, 500);
      } else {
        // let defaultNode =
        //   this.device_unit_tree[0].children[0].children[0].children[0] ||
        //   this.device_unit_tree[0].children[0].children[0] ||
        //   this.device_unit_tree[0].children[0] ||
        //   this.device_unit_tree[0];
        // this.handleClick(defaultNode);
      }
    }
  }
};
</script>
