# Be the Docker

*Please note this is a tutorial of mine, if it's helpful for you I will be happy but if it doesn't go and google out there*

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

Ok folks, now it's time. If you want to dockerize your app you have to create a Dockerfile. Just that, no extension

### Dockerfile

FROM node:18 //Base image and version you want, maybe latest

WORKDIR /app //Creates the folder that's gonna contain the source code. It doesn't point to your local machine

COPY package*.json ./

COPY . .

RUN npm install //Install the dependencies

EXPOSE 3000 //Number of port in which we want to run the app

CMD [ "node","index.js" ] //Command to run the program first (node) and then the route to the program

Ok, now we just should save the file and docker build. BUT WAIT!!

### Problem with communications

Our nodeJS and MongoDB containers shouldn't communicate between them just because we want to. We can access a container from the outside but in the inside we have to create an intern network.

- docker network create miRed

Nice, now I have a network that is going to be used to communicate each container. But wait, didn't the APP pointed to localhost in the connection to the database? Welp, yes. You must take a look into that and change localhost to the database container name!

BEFORE mongoose.connect('mongodb://oliver:password@localhost:27017/mi_base_de_datos?authSource=admin')
AFTER mongoose.connect('mongodb://oliver:mongoBaseDatos@localhost:27017/mi_base_de_datos?authSource=admin')

Wait wait wait, but the mongo container didn't have a network associated. That's right, remove that container and create a new one linking the new red

- docker create -p27017:27017 --name mongoBaseDatos --network miRed -e MONGO_INITDB_ROOT_USERNAME=oliver -e MONGO_INITDB_ROOT_PASSWORD=password mongo

YES!!! Now I totally have it. Hey, weren't we supposed to be doing a image and container of our app?

### Creating the image and container of our app

docker build is gonna create a image based in our Dockerfile! And our Dockerfile was for our app!

- docker build -t imageName:version pathRoute // for example docker build -t miapp:1 .

Try docker images and see the magic. Nah, don't thank me.

Hey but no container at all! Really? Do I need to tell you? 

Ok... 

- docker create -p3000:3000 --name miAppContainer --network miRed miapp:1 //Remember last argument is the name of your created image

WOHO!! I can feel the power!! I know, I know...

## Summary until now

Ok, so if I had to make this again I need to:

1. Download an image
2. Create a network
3. Create a container: Asign the ports,name,environment variables, asign the network, asign the image:tag...

Feels like a lot, honestly. What if we could automatize this?

### Docker compose

Ok I need you focused on this. It'll be a lot more helpful if I just post you a photo of the indexed code (trust me, I learned my lesson)

 ![indexedCode](images/indexedCode.png)

 Ok let me tell you a few things in here

 - CONTAINER'S NAMES MUST BE LOWERCASE!!!!!
 - LINKS, PORTS AND ENVIRONMENTS MUST BE A LIST, DON'T FORGET ABOUT THE SPACE BETWEEN - AND THE DATA
 - If you can, omit the version (it's not mandatory)

 Ok you're gonna be fine with that tips.

 Now...

 - docker compose up . It's like magic
 
 To stop the execution CTRL+C

Hey, but you didn't specify the network here!

That's true, and it's because of Docker intelligence. When we're making a docker-compose.yml Docker immediately knows that they're gonna be related and create a network asigning it to each container.

 - docker compose down to clean the containers and images that Docker compose made

Nice... HEY! What happens if I remove a container that contained tons of data in the database? Do I lost it?

Yes, but you should't lost more data thanks to...

### Volumes

Ok, we need to configure a folder into our host machine in order to store and keep that data. We have 3 kinds of volumes:

1. Anonymous: We only specify the path but can't point to them.
2. Host: You decide the folder and where.
3. Named: Anonymous but can point it.

Now that we got the concept, we need to configure.

![volumes](images/volumes.png)

We configured the volumes: mongo-data: that is an anonymous volume.

Then, in the mongo container configuration we need to put it

- mongo-data will be the volume name you're creating (could be anyone but they need to match)
- /data/db is the path route where MongoDB store data. You could google that, also I made sure you have the route for MySQL and Postgres

Now make sure, docker compose up and create two persons with the endpoints. Stop the execution and docker compose down the whole thing. Make sure to store the ids of the objects. Go back to docker compose up and see if they match

Spoiler: It will.

But what if we have a container that it's gonna be used in development and anytime we change our app we immediately want to update the app??

### Context and hot reload

First things first, we need to create a new Dockerfile. This time it'll be Dockerfile.dev

We need to install nodemon to hot reload the app, it's gonna be the same as the previous Dockerfile but with nodemon and changing the CMD to nodemon too. I've made a screenshoot for you. Follow the order.

![newDockerfile](images/dockerfile-dev.png)

Now we also need a new docker-compose-dev.yml

It'll be the same as previous docker-compose but we'll add context (path to the code) and the dockerfile that we want to use.

We also need to tell the volumes. We're gonna tell that our actual route (. in this case) is going to be mounted into the destiny path

Don't worry, here's your screenshoot.

![newDockerCompose](images/docker-compose-dev.png)

You using Windows? You surely are gonna have one BIG problem

## Problem with hot reload in Windows