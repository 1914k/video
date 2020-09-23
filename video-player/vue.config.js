const path = require("path");

function resolve(dir) {
  return path.join(__dirname, dir);
}
module.exports = {
  lintOnSave: true,
  chainWebpack: config => {
    config.resolve.alias
      .set("@", resolve("src"))
      .set("@assets", resolve("src/assets")); // 这里只写了两个个，你可以自己再加，按这种格式.set('',resolve(''))
  },
  css: {
    loaderOptions: {
      //设置scss公用变量文件
      sass: {
        data: `@import'@/assets/style/public.scss';`
      }
    }
  }
};
