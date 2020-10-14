var cmsUrl = process.env.VUE_APP_BASEURL;
var cmsWsUrl = process.env.VUE_APP_CMSWSURL;
var defaultWindowNum = process.env.VUE_APP_DEFAULITWINDOWNUM;
var isFloatMode = process.env.VUE_APP_ISFLOATMODE;
var isSimpleMode = process.env.VUE_APP_ISSIMPLEMODE;
var userName = process.env.VUE_APP_USERNAMENAME;
var passWord = process.env.VUE_APP_PASSWORD;

export default {
  cmsUrl,
  cmsWsUrl,
  defaultWindowNum,
  isFloatMode,
  isSimpleMode,
  userName,
  passWord
};
