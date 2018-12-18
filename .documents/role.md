# ROLE and menus rest api
### API
  * #### `/api/role` 获取系统角色列表
    * Method：```GET```
    * Headers：```{Authorization: String}```
    * QueryParams：```condition={}&option={"page":1,"pageSize":15,"sort":{"createdAt":-1}}```
    * Response
    ```bash
    e.g
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
                        "roles": [ //角色对应的权限列表
                            "M30000-00"
                        ],
                        "_id": "R020001", //角色ID
                        "name": "超级管理员",
                        "desc": "包含所有权限的系统管理员",
                        "link_exchange": "NO" //是否关联交易所
                    },
                    ...
                ]
            }
       }
    ```
  * #### `/api/role` 创建角色
    * Method：```POST```
    * Headers：```{Content-Type: application/json, Authorization: String}```
    * Post data：```{"name" : String , "desc" : String, "link_exchange" : String}``` e.g: {"name" : "Test" , "desc" : "test", "link_exchange" : "NO"}
    * Response
    ```bash
    e.g
       {
            "success": true,
            "msg": "OK",
            "statusCode": 200,
            "data": {
                "roles": [],
                "_id": "R020006",
                "name": "Test",
                "desc": "test",
                "link_exchange": "NO"
            }
       }
    ```

  * #### `/api/role/:id` 设置角色权限时，加载权限列表
    * Method：```GET```
    * Headers：```{Authorization: String}```
    * Response
    ```bash
       {
            "success": true,
            "msg": "OK",
            "statusCode": 200,
            "data": {
                "roles": [], //当前拥有权限
                "_id": "R020006",
                "name": "Test",
                "menus": [ //权限列表
                    {
                        "_id": "M30000",
                        "name": "admin",
                        "desc": "超级管理员",
                        "sub_menus": [
                            {
                                "_id": "M30000-00",
                                "name": "admin",
                                "value": "M30000-00",
                                "label": "超级管理员"
                            }
                        ]
                    },
                    ....
                ]
            }
       }
    ```
  * #### `/api/role/:id/edit` 获取要修改的角色
    * Method：```GET```
    * Headers：```{Authorization: String}```
    * Response
    ```bash
    e.g
       {
            "success": true,
            "msg": "OK",
            "statusCode": 200,
            "data": {
                "roles": [],
                "_id": "R020006",
                "name": "Test",
                "desc": "test",
                "link_exchange": "NO"
            }
       }
    ```
  * #### `/api/role/:id` 修改角色
    * Method：```PUT```
    * Headers：```{Content-Type: application/json, Authorization: String}```
    * Post data：```{"modifier": Object}``` e.g {"modifier": {"name" : "Test1"}}
    * Response
    ```bash
       {
            "success": true,
            "msg": "OK",
            "statusCode": 200,
            "data": true
       }
    ```
  * #### `/api/role/menus` 获取权限列表
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
                "count": 15,
                "page": 1,
                "total": 35,
                "list": [
                    {
                        "_id": "M30005-01",
                        "createdAt": "2018-11-30 10:13:56",
                        "name": "opinion",
                        "desc": "意见反馈",
                        "group": "M30005"
                    }
                    ....
            }
       }
    ```
  * #### `/api/role/menus` 新增权限
    * Method：```POST```
    * Headers：```{Content-Type: application/json, Authorization: String}```
    * Post data：```{name: String, desc: String, group: String}``` e.g: {"name" : "test", "desc" : "test" , "group" : "M30006"} group--权限组
    * Response
    ```bash
       {
            "success": true,
            "msg": "OK",
            "statusCode": 200,
            "data": {
                "_id": "M30006-00",
                "createdAt": "2018-11-30 15:38:03",
                "name": "test",
                "desc": "test",
                "group": "M30006"
            }
       }
    ```
  * #### `/api/role/menus/:id/edit` 获取要修改的权限
    * Method：```GET```
    * Headers：```{Authorization: String}```
    * Response
    ```bash
    e.g: /api/role/menus/M30006-04/edit
       {
            "success": true,
            "msg": "OK",
            "statusCode": 200,
            "data": {
                "_id": "M30006-04",
                "createdAt": "2018-11-30 15:44:01",
                "name": "test",
                "desc": "test",
                "group": "M30006"
            }
       }
    ```
  * #### `/api/role/menus/:id` 修改权限
    * Method：```PUT```
    * Headers：```{Content-Type: application/json, Authorization: String}```
    * Post data：```{modifier: Object}```   e.g {"modifier":{"name" : "test1"}}
    * Response
    ```bash
       {
            "success": true,
            "msg": "OK",
            "statusCode": 200,
            "data": true
       }
    ```
  * #### `/api/role/menus/:id` 删除权限
    * Method：```DELETE```
    * Headers：```{Content-Type: application/json, Authorization: String}```
    * Response
    ```bash
    e.g /api/role/menus/M3000621-00
       {
            "success": true,
            "msg": "OK",
            "statusCode": 200,
            "data": true
       }
    ```