# User rest api

### API
  * #### `/app/user/login` 登录
    * Method：```POST```
    * Headers：```{Content-Type: application/json, Authorization: String}```
    * Post data：```{"username": String, "password":{"digest":String}}``` digest use sha26 signature
    * Response
    ```bash
       {
           success: Boolean,
           msg: String,
           statusCode: Number,
           data: { _id: String, username: String, ...}
       }
    ```
  * #### `/api/user/loginout` 退出
    * Method：```POST```
    * Headers：```{Content-Type: application/json, Authorization: String}```
    * Post data：```{ "userId" : String}```
    * Response
    ```bash
       {
		   success: Boolean,
           msg: String,
           statusCode: Number,
           data: Boolean
       }
    ```
  * #### `/api/user/register` 注册
    * Method：```POST```
    * Headers：```{Content-Type: application/json, Authorization: String}```
    * Post data：```{name: String, username: String, mobile: String, role: String, status: String}```
    * Response
    ```bash
       {
           success: Boolean,
           msg: String,
           statusCode: Number,
           data: {
                userId: String,
                defaultPwd: String
            }
       }
    ```
  * #### `/api/user/status/:id` 状态修改
    * Method：```PUT```
    * Headers：```{Content-Type: application/json, Authorization: String}```
    * Post data：```{ids: Array, status: String}``` status options [normal, disable]
    * Response
    ```bash
       {
           success: Boolean,
           msg: String,
           statusCode: Number,
           data: Number //update users count
       }
    ```

  * #### `/api/user` 获取用户列表
    * Method：```GET```
    * Headers：```{Authorization: String}```
    * QueryParams：```condition={}&option={"page":1,"pageSize":15,"sort":{"createdAt":-1}}```
    * Response
    ```bash
    e.g.
       {
            "success": true,
            "msg": "OK",
            "statusCode": 200,
            "data": {
                "count": 4,
                "page": 1,
                "total": 4,
                "list": [
                    {
                        "_id": "uFiV4dLMAfmjZAighdIz",
                        "createdAt": "2018-11-30 14:31:28",
                        "username": "aaaa",
                        "name": "aaa",
                        "mobile": "12313",
                        "role": "asdasda",
                        "status": "disable",
                        "num": "C0100004",
                        "firstLogin": true
                    },
                    ...
                ],
                "now": "2018-11-30 14:43:27"
            }
        }
    ```
  * #### `/api/user/:id/edit` 获取要修改的用户信息
    * Method：```GET```
    * Headers：```{Authorization: String}```
    * Response
    ```bash
    e.g.
       {
            "success": Boolean,
            "msg": String,
            "statusCode": Number,
            "data": {
                "user": {  //user info
                    "_id": "uFiV4dLMAfmjZAighdIz",
                    "username": "test",
                    "name": "test",
                    "mobile": "123",
                    "role": "asdasda",
                    "status": "disable",
                    "num": "C0100004"
                },
                "exchanges": [ //exchange bind list
                    {
                        "_id": "0500001",
                        "name": "exchange1"
                    },
                    ...
                ],
                "roles": [ //roles bind list
                    {
                        "_id": "R020001",
                        "name": "超级管理员",
                        "link_exchange": "NO"
                    },
                    ....
                ]
            }
       }
    ```
  * #### `/api/user/:id` 修改用户信息
    * Method：```PUT```
    * Headers：```{Content-Type: application/json, Authorization: String}```
    * Post data：```{modifier : Object}``` e.g. {"modifier": {"name": "test"}}
    * Response
    ```bash
       {
            "success": true,
            "msg": "OK",
            "statusCode": 200,
            "data": Boolean
       }
    ```

  * #### `/api/user/updpwd` 修改密码
    * Method：```POST```
    * Headers：```{Content-Type: application/json, Authorization: String}```
    * Post data：```{password : {digest : String}}```
    * Response
    ```bash
       {
            "success": true,
            "msg": "OK",
            "statusCode": 200,
            "data": {
                "userId": String
            }
       }
    ```