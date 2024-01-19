// this package behaves just like the mysql one, but uses async await instead of callbacks.
const mysql = require(`mysql-await`); // npm install mysql-await

// first -- I want a connection pool: https://www.npmjs.com/package/mysql#pooling-connections
// this is used a bit differently, but I think it's just better -- especially if server is doing heavy work.
var connPool = mysql.createPool({
  connectionLimit: 5, // it's a shared resource, let's not go nuts.
  host: "localhost", // this will work
  user: "C4131F23U45",
  database: "C4131F23U45",
  password: "2075", // we really shouldn't be saving this here long-term -- and I probably shouldn't be sharing it with you...
});

// later you can use connPool.awaitQuery(query, data) -- it will return a promise for the query results.

async function createAccount(data){
  // you CAN change the parameters for this function. please do not change the parameters for any other function in this file.
  return await connPool.awaitQuery("insert into account (username, password) values (?, ?);", [data.username, data.password])
}

async function checkExists(data){
    // you CAN change the parameters for this function. please do not change the parameters for any other function in this file.
    let result = await connPool.awaitQuery("select * from account where username=? and password=?;", [data.username, data.password])
    return result.length>0;
}

async function createPost(data){
    return await connPool.awaitQuery("insert into post (text, likes, user) values (?, ?, ?);", [data.text, data.likes, data.user])
//   let promise = await connPool.awaitQuery("delete from contact where id=?;", [id]);
//   console.log("delete contact result: "+ await promise);
//   return true;
}

async function editPost(data) {
  return await connPool.awaitQuery("update post set text=? where id=?;", [data.text, data.id])
}

async function deletePost(id) {
  return await connPool.awaitQuery("delete from post where id=?;", [id])
}

async function likePost(id) {
  return await connPool.awaitQuery("update post set likes = likes + 1 where id=?;", [id])
}

async function getPosts() {
  return await connPool.awaitQuery("select * from post order by time desc;")
}

async function getPostsLikes() {
    return await connPool.awaitQuery("select * from post order by likes desc;")
}

module.exports = {createAccount, checkExists, createPost, editPost, deletePost, likePost, getPosts, getPostsLikes}