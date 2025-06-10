const express = require("express");
const router = express.Router();
const { db, genid } = require("../db/DbUtils");
//查所有评论
router.get("/list", async (req, res) => {
  const search_sql = "SELECT * FROM `comment`";
  let { err, rows } = await db.async.all(search_sql, []);
  if (err == null) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: rows,
    });
  } else {
    res.send({
      code: 500,
      msg: "查询失败",
    });
  }
});

//根据blog_id查评论
router.post("/article", async (req, res) => {
  let { blog_id } = req.body;
  let { err, rows } = await db.async.all(
    "select * from `comment` where `blog_id`= ?",
    [blog_id]
  );
  if (err === null && rows.length > 0) {
    res.send({
      code: 200,
      msg: "查询成功",
      data: rows,
    });
  } else {
    res.send({
      code: 500,
      msg: "查询失败",
    });
  }
});

//添加评论
router.post("/add", async (req, res) => {
  let { blog_id, content } = req.body;
  let id = genid.NextId();
  const insert_sql =
    "INSERT INTO `comment`(`id`,`blog_id`,`content`) VALUES (?,?,?)";
  let params = [id, blog_id, content];
  let { err, rows } = await db.async.run(insert_sql, params);

  if (err == null) {
    res.send({
      code: 200,
      msg: "添加成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "添加失败",
    });
  }
});

//删除评论
router.delete("/_token/delete", async (req, res) => {
  let id = req.query.id;
  const delete_sql = "DELETE FROM `comment` WHERE `id` = ?";
  let { err, rows } = await db.async.run(delete_sql, [id]);
  if (err == null) {
    res.send({
      code: 200,
      msg: "删除成功",
    });
  } else {
    res.send({
      code: 500,
      msg: "删除失败",
    });
  }
});

module.exports = router;
