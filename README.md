# Lemontours

Application Built on Nest js ,A type script based node js we b framework
##  Run with docker



```bash
docker-compose up --build -d 
```


### This project is organized using a domain-driven design (DDD) architecture, with the following layers:

`Domain Layer`
`Application Layer`
`Infrastructure Layer`


# Domain Layer
The Domain Layer contains the core business entities and interfaces for the project. In this layer, we have the following folders:

### ports
This folder contains the interfaces for all ,remember to define interface first then use that interface as dependency in controller ,controller should nt interact direct with class
## adapter
Concrete implementation of all the repositories defined in ports


## Cognito API Service
`Cognito API Service`: This file contains the implementation of the service for calling the AWS Cognito API.

``This project structure provides a clear and maintainable organization for your code, making it easy to find and work with the relevant files for each entity``.

### Further files can be added accordingly in the respective folders



## A Note For Using Hexagonal Design Architecture 

 `If you need to switch to a different database in the future, you would need to change the concrete implementation of the repository interface (i.e., RoleRepositoryImpl) to an implementation that works with the new database.

However, because we've used the repository interface (RoleRepository) as a type in the RoleService, we won't need to change any of the code in the RoleService or any other parts of our application that depend on the RoleRepository. As long as the new implementation conforms to the RoleRepository interface, it can be used as a drop-in replacement for the old implementation.

This is one of the benefits of using the Hexagonal Architecture and dependency injection: it allows you to swap out concrete implementations without affecting the rest of the application, making it easier to change or update the underlying technology as needed.`


## Docker commands for building

Depending on the environment, set `--target` modifier accordingly to the environment to build:

`docker build --target staging -t api:staging .`

`docker build --target production -t api:production .`