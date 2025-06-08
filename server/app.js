const express = require("express");
const multer = require("multer");
const path = require("path");
const app = express();
const port = 8080;
const { db, genid } = require("./db/DbUtils");

//开放跨域请求
app.use(function (req, res, next) {
  //允许任意源访问
  res.header("Access-Control-Allow-Origin", "*");
  //允许任意请求头
  res.header("Access-Control-Allow-Headers", "*");
  //允许的HTTP方法
  res.header("Access-Control-Allow-Methods", "DELETE,PUT,POST,GET,OPTIONS");
  //处理预检请求
  if (req.method == "OPTIONS") res.sendStatus(200);
  else next();
});

//解析
app.use(express.json());

//上传
const update = multer({
  dest: "./public/upload/temp",
});
app.use(update.any());

//指定静态资源路径
app.use(express.static(path.join(__dirname, "public")));

// 验证token;
const ADMIN_TOKEN_PATH = "/_token";
app.all("/*splat", async (req, res, next) => {
  if (req.path.includes(ADMIN_TOKEN_PATH)) {
    let { token } = req.headers;
    let admin_token_sql = "SELECT * FROM `admin` WHERE `token` = ?";
    let adminRes = await db.async.all(admin_token_sql, [token]);
    if (adminRes.err != null || adminRes.rows.length == 0) {
      res.send({
        code: 403,
        msg: "请先登录",
      });
      return;
    } else {
      next();
    }
  } else {
    next();
  }
});

//注册路由
app.use("/test", require("./routers/TestRouter"));
app.use("/admin", require("./routers/AdminRouter"));
app.use("/category", require("./routers/CategoryRouter"));
app.use("/blog", require("./routers/BlogRouter"));
app.use("/upload", require("./routers/UploadRouter"));

app.get("/", (req, res) => {
  res.send("hello,world");
});

app.listen(port, () => {
  console.log(`启动成功，端口为：${port}`);
});
