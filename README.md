# DockerTest
Testing Docker and making it mine

## First steps

Two services: One that is your app (index.js) and another one that's gonna be mongoDB downloaded from an image in Docker Hub

### MONGO

- docker pull mongo. That's gonna download the image
- docker run -p27017:27017 --name mongoBaseDatos mongo. That's gonna create a container based on the image.

Great, you have the container with mongo. If you take a look at the app you're gonna see the connection to the database but maybe if you try to connect to the url it won't let you... why could it be?

DOCUMENTATION!!!

Take a look into docs, when you asign user and pw to the db in mongo, in order to run the container you have to asign the environments variables.

So...

- docker run -p27017:27017 --name mongoBaseDatos -e MONGO_INITDB_ROOT_USERNAME=oliver -e MONGO_INITDB_ROOT_PASSWORD=password mongo . Don't worry if you don't have the image locally, it will download for you.

Ok great, let's take a look into the app

### APP

RUN THE PROGRAM!!! node index.js and go to the URL and fetch the endpoints to see if it works. Oh it works, nice.

Great man, you're using a container based on mongo to connect your app. What if you wanted to now containER your app?

## Second steps

