# Backend

This implementation is for NodeJS based on [Express](https://expressjs.com/) and [MongoDB](https://www.mongodb.com/) and uses [mongoose](https://mongoosejs.com/) as the ODM.

## Project setup
```
npm install
```

### Before startup 
Setup a .env file with the following variables, e.g.:

```
MONGO_URL = mongodb+srv://<username>:<password>@cluster0.abcdc.mongodb.net/dbname
```

### Compiles and hot-reloads for development
```
npm start
```

### API Documentation
https://documenter.getpostman.com/view/17743273/2s83zfR64K

### References

For MongoDB Documentation:
https://www.mongodb.com/docs/manual/introduction/

For Mongoose documentation:
https://mongoosejs.com/docs/guide.html

For JavaScript Documentation:
https://www.w3schools.com/js/

For error status codes:
https://metamug.com/article/status-codes-for-rest-api.html#:~:text=409%20Conflict%20%2D%20Client%20attempting%20to,without%20the%20Content%2DLength%20Header.

Method to check for element in array:
https://stackoverflow.com/questions/37202585/check-if-value-exists-in-array-field-in-mongodb

How to use an aggregate pipeline:
https://medium.com/fasal-engineering/fetching-data-from-different-collections-via-mongodb-aggregation-operations-with-examples-a273f24bfff0
