# nodejs-course

Code written while studying Node.js at UDemy course: https://www.udemy.com/course/nodejs-the-complete-guide

## How to run MongoDb

1. Create a MongoDb in some cloud provider eg. Mongodb Atlas
2. Create a user to the database
3. Create ".env" file to 1-node-server folder
4. Add variables mongodb_user, mongodb_password, mongodb_cluster_address to the .env file . You can get the values from the user you created and the URL provided during user creation

Example of .env file content:

mongodb_user = user
mongodb_password = password123
mongodb_cluster_address = cluster0.asdasdasda.mongodb.net
express_session_secret = afafsdsfsdfsdfsdsdfsfsd
stripe_api_key = pk_test_dfsdfsdfsdfsdfsdfsdfsdfsdfsfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsdfsfsfsdfsdfsdfsdsdfsdfsdfsdsdfsdfsdfdsfds
stripe_secret_key = sk_test_sdffölodsofhodihoisduhfosidufhsidfhusoidfuhsiodfuhsdiohusdiufhosduhosdiusdhosuhdfiosuhfsidfuhsidu