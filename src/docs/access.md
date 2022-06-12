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
mongodb+srv://<user>:<password>@cluster0.sy2bp.mongodb.net/?retryWrites=true&w=majority
```