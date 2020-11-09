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
    <el-main style="position: relative; height: 100%;">
      <div class="device-tree">
        <el-scrollbar style="height:100%">
          <el-tree
            ref="tree"
            class="filter-tree"
            :filter-node-method="filterNode"
            :data="device_unit_tree"
            node-key="id"
            accordion
            highlight-current
            :default-expanded-keys="expandedKey"
            :props="defaultProps"
            @node-click="handleClick"
            :render-content="renderContent"
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
        // label: "text"
        label: function(data) {
          try {
            let show = data.attributes ? " (" + data.attributes.show + ")" : "";
            if ((data.attributes && data.attributes.show) || data.deviceType) {
              data = data.text + show;
            } else {
              data = data.text;
            }
            return data;
          } catch (error) {
            console.log(error);
          }
        }
      },
      videoList: [],
      searchInfoArray: [],
      searchMap: undefined,
      queryTree: [],
      device_unit_tree: [],
      defaultNode: {}
    };
  },
  watch: {
    searchInfo(val) {
      this.$refs.tree.filter(val);
    }
  },
  created() {
    this.init();
  },
  mounted() {
    try {
      if (parent && parent.clearLoading) {
        parent.clearLoading();
      }
    } catch (err) {
      console.log(err);
    }
  },
  methods: {
    // 初始化
    init() {
      const openNode = this.getUrlArg().name;
      this.device_unit_tree = this.deviceTree;
      console.log(this.deviceTree, "设备");
      try {
        this.getSearchList(this.searchInfoArray, this.device_unit_tree);
        //如果有传过来的站点默认打开
        if (openNode) {
          const name = RegExp(openNode + "站");
          for (let item of this.searchInfoArray) {
            if (name.test(item.value)) {
              this.searchInfo = item.value;
              break;
            } else {
              this.searchInfo = openNode;
            }
          }
        } else {
          //如果没有默认打开第一个站点
          this.defaultNode = this.getFirstZhan(
            this.device_unit_tree[0].children
          );

          // this.searchInfo = "110kV碧桂站(大华)";
        }
      } catch (error) {
        // console.log(error);
      }
    },
    openDefaultNode() {
      this.handleClick(this.defaultNode);
    },
    // 获取页面URL传过来的站名
    getUrlArg() {
      const url = location.search; // 获取url中"?"符后的字串

      const theRequest = new Object();
      if (url.indexOf("?") != -1) {
        const str = url.substr(1);
        const strs = str.split("&");
        for (let i = 0; i < strs.length; i++) {
          theRequest[strs[i].split("=")[0]] = decodeURI(strs[i].split("=")[1]);
        }
      }
      return theRequest;
    },
    // 站点点击事件
    handleClick(node) {
      if (
        node.attributes.isUnitTreeLeafNode &&
        (node.children == null || node.children.length == 0)
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
      const BaseUrl = jx_cms_global_config_.cmsUrl;
      const unitId = node.id;
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
      let ifHas = data.text.indexOf(value) !== -1;
      if (ifHas) {
        console.log(node);
        // debugger;
      }
      return ifHas;
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
    // 获取组织下的第一个站点
    getFirstZhan(arr) {
      for (let i of arr) {
        // if (i.attributes.isUnitTreeLeafNode) {
        if (i.text == "110kV碧桂站(大华)") {
          return i;
        } else {
          if (i.children && i.children.length > 0) {
            return this.getFirstZhan(i.children);
          }
        }
      }
    },
    // 自定义节点内容
    renderContent(h, { node }) {
      if (node.data.deviceType) {
        const iconStatus =
          node.data.status == 0 ? "el-icon-star-off" : "el-icon-star-on";
        return (
          <span class="custom-tree-node">
            <span class="el-tree-node__label">{node.label}</span>
            <span style="margin-left: 5px;">
              <i class={iconStatus}></i>
            </span>
          </span>
        );
      } else {
        return <span class="el-tree-node__label">{node.label}</span>;
      }
    }
  }
};
</script>
