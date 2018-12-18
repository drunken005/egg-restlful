# egg restful api

## deploy
### Production env

```bash
    1. Set ./dockerfile MONGO_URL value
    docker build ...
    docker run ...
```

### Local env

```bash
    .\startup.bat
```

### API

#### [accounts api](https://github.com/drunken005/egg-restlful/tree/master/.documents/user.md)
#### [roles api](https://github.com/drunken005/egg-restlful/blob/master/.documents/role.md)

NOTE
The path contains `/api` and requires token authentication for request



### Init database

```bash
var docs = [
               {
                   "_id" : "user",
                   "generator" : {
                       "_id" : 10000
                   }
               },
               {
                   "_id" : "role",
                   "generator" : {
                       "_id" : 20001
                   }
               },
               {
                   "_id" : "menus",
                   "generator" : {
                       "_id" : 30001
                   }
               }
           ]
db.unique_code.insert(docs)


var roleDocs = [
                   {
                       "_id" : "M30000",
                       "name" : "admin",
                       "desc" : "超级管理员",
                       "root" : true
                   },
                   {
                      "_id" : "M30001",
                      "name" : "settings",
                      "desc" : "系统设置",
                      "root" : true
                  }
               ]
db.roles.menus.insert(roleDocs);


var roleDocs2 = [
                    {
                        "_id" : "M30000-00",
                        "name" : "admin",
                        "desc" : "超级管理员",
                        "group" : "M30000"
                    },
                    {
                        "_id" : "M30001-01",
                        "name" : "role",
                        "desc" : "角色&权限",
                        "group" : "M30001"
                    },
                    {
                        "_id" : "M30001-00",
                        "name" : "account",
                        "desc" : "账号管理",
                        "group" : "M30001"
                    },
                    {
                        "_id" : "M30001-02",
                        "name" : "logs",
                        "desc" : "操作日志",
                        "group" : "M30001"
                    },
                    {
                        "_id" : "M30001-03",
                        "name" : "createAccount",
                        "desc" : "创建系统账号",
                        "group" : "M30001"
                    },
                    {
                        "_id" : "M30001-04",
                        "name" : "setStatus",
                        "desc" : "账号状态管理",
                        "group" : "M30001"
                    },
                    {
                        "_id" : "M30001-05",
                        "name" : "roleSettings",
                        "desc" : "系统角色设置",
                        "group" : "M30001"
                    },
                    {
                        "_id" : "M30001-06",
                        "name" : "roleMenus",
                        "desc" : "菜单与权限管理",
                        "group" : "M30001"
                    },
                    {
                        "_id" : "M30001-07",
                        "name" : "oplog",
                        "desc" : "操作日志查询",
                        "group" : "M30001"
                    },
                    {
                        "_id" : "M30001-08",
                        "name" : "initializePassword",
                        "desc" : "初始化密码",
                        "group" : "M30001"
                    }
                ]
db.roles.menus.insert(roleDocs2);


var docs3 = {
                "_id" : "R020001",
                "name" : "超级管理员",
                "desc" : "包含所有权限的系统管理员",
                "roles" : [
                    "M30000-00"
                ]
            }
db.roles.insert(docs3)


var admin = {
                "_id" : "Eh2FT8pLv3ilWjQHsz90",
                "services" : {
                    "password" : {
                        "bcrypt" : "$2b$10$ImePYtmuPuPTqDYw.OWW0.g7498NL5DyY6rHMNg4Qk6Q7xraNwnRG"
                    },
                    "resume" : {
                    }
                },
                "username" : "admin",
                "name" : "admin",
                "mobile" : "21312321",
                "status" : "normal",
                "num" : "C10000",
                "__v" : 0,
                "role" : "R020001"
            }

db.users.insert(admin)
```

