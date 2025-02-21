# Microservices Structure
Here is the architecture of the project's backend based on its microservices. In this folder we can see the domains into which each of the microservices have been divided and a brief detail of each of them. Domains:

## user_management (REST API)

### Microservices (Developed in JAVA)

* **user-crud:** This microservice handles the creation, editing, deletion and reading of users.
* Port: 8080
* Dockerfile: *Check file for configuration**

* **auth-api:** This microservice validates the authorization for each user's access to the app (Verify the JWT key and the defined times to send to production)
* Port: 8081
* Dockerfile: *Check file for configuration**
* **session-api:** This microservice validates each active session and a certain time for each user (verify port and hosts of REDIS cache database for production)
* Port: 8082
* Dockerfile: *Check file for configuration**
* **language-api:** Verify its use and functionality before sending to production.
* Port: 8083
* Dockerfile: *Check file for configuration**

## device_management (REST API)

### Microservices (Developed in GO)

* **channels-api:** This microservice counts the video input channels that a device has
* Port: 8086
* Dockerfile: *Check file for configuration**

* **devices-crud:** This microservice creates, updates, deletes and reads the devices that are created for each user.
* Port: 8084
* Dockerfile: *Check file for configuration**
* **url-rtsp-api:** This microservice is to create the rtsp url for the connection to the different devices
* Port: 8085
* Dockerfile: *Check file for configuration**
* **image-api:** Takes a screenshot of that instant of the video path that is entered.
* Port: 8087
* Dockerfile: *Check file for configuration**