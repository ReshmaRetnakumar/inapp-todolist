to run the program
npm start or node index.js

to change production mode or production in windows
set NODE_ENV=production&&npm start
ubuntu: NODE_ENV=production npm start

### Regarding task,

1. For login, hardcoded users are created.
2. Cannot delete any node which is not completed.
3. Node dictionary is defined in global scope, no database or any advanced feature not used
4. JWT based authentication is used. Token should be passed in the authentication header while sending request.
5. Postman collection is also shared in the repo