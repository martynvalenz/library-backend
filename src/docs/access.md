## Start repo
```
heroku login
git init
heroku git:remote -a library-loans
```
### Commit
```
git status
git add .
git commit -am "make it better"
git push heroku master
```
### Config env
```
heroku config:set VARIABLE=VALUE
heroku config
heroku config:get VARIABLE
heroku config:unset VARIABLE
```
### Config Mongo Compass DB
```
heroku config:set DB_CONNECTION="mongodb+srv://<user>:<password>@cluster0.sy2bp.mongodb.net/<dataBase>?retryWrites=true&w=majority"
```