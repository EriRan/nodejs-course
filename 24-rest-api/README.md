Running this application requires a file to be created manually here called ".env". Add following variables there:

mongodb_user = *mongo db user*
mongodb_password = *mongo db password*
mongodb_cluster_address = *mongo db cluster address*
jwt_secret = *some jwt secret*

You can get mongodb variables from a cloud provider like atlas. JWT secret can be any string but it is recommended that it is fairly long