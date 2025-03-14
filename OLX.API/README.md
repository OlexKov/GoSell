# olx-asp
GoSell API  

Project Description  
This project is the backend part of GoSell API, implemented using a multi-tier architecture divided into API, business logic (BLL), and data access (DAL) layers.  

Project Structure  

OLX.API (Presentation Layer)  
This is the API layer responsible for handling HTTP requests.  
- Controllers – Controllers for processing requests.  
- Extensions – Extensions for application configuration.  
- Helpers – Utility classes.  
- Middlewares – Middleware for request handling.  
- Models – Request and response models.  
- Uploading – File uploading.  
- Appsettings.json – Configuration file.  

OLX.BLL (Business Logic Layer)  
This layer contains the core business logic of the application.  
- DTOs – Data Transfer Objects.  
- Entities – Database entities.  
- Exceptions – Exception handling.  
- Extensions – Extensions for business logic configuration.  
- Helpers – Utility classes.  
- Hubs – SignalR hubs.  
- Interfaces – Service interfaces.  
- Mapper – Object mapping.  
- Models – Business models.  
- Pagination – Pagination support.  
- Resources – Localization resources.  
- Services – Service implementations.  
- Specifications – Query filtering and specification patterns.  

OLX.DAL (Data Access Layer)  
This layer is responsible for database interactions.  
- Data – Database context (Entity Framework Core).  
- Migrations – Database migrations.  
- Repositories – Repository layer for database operations.  

Technologies Used  

- .NET 6/7 – Core framework.  
- ASP.NET Core Web API – API development.  
- Entity Framework Core – ORM for database management.  
- MediatR – CQRS pattern.  
- AutoMapper – Object mapping.  
- FluentValidation – Model validation.  
- Swagger (NSwag) – API documentation.  
- SignalR – Real-time WebSocket communication.  
- Serilog – Logging.  
- Docker – Containerization.  
- PostgreSQL / SQL Server – Database solutions.  

Setup Instructions 
1. Clone the repository:  
   git clone https://github.com/OlexKov/OLX_Dyplom
2. Navigate to the project folder and install dependencies.  
3. Configure the database connection in `appsettings.json`.  
4. Start the application:  
   npm run dev
   
API Documentation  
To view the API documentation, open `/swagger` after starting the application.  

Authors
Kovalchuk Oleksandr  
Gumeniuk Diana 
Kravchuk Mykhailo  
Prymak Andriy  

Create docker hub repository - publish
```
docker build -t olx-asp-api . 
docker run -it --rm -p 5817:8080 --name olx-asp_container olx-asp-api
docker run -d --restart=always --name olx-asp_container -p 5817:8080 olx-asp-api
docker run -d --restart=always -v d:/volumes/olx-asp/images:/app/images --name olx-asp_container -p 5817:8080 olx-asp-api
docker run -d --restart=always -v /volumes/olx-asp/images:/app/images --name olx-asp_container -p 5817:8080 olx-asp-api
docker ps -a
docker stop olx-asp_container
docker rm olx-asp_container

docker images --all
docker rmi olx-asp-api

docker login
docker tag olx-asp-api:latest sashok9203/olx-asp-api:latest
docker push sashok9203/olx-asp-api:latest

docker pull sashok9203/olx-asp-api:latest
docker ps -a
docker run -d --restart=always --name olx-asp_container -p 5817:8080 sashok9203/olx-asp-api

docker run -d --restart=always -v /volumes/olx-asp/images:/app/images --name olx-asp_container -p 5817:8080 sashok9203/olx-asp-api


docker pull sashok9203/olx-asp-api:latest
docker images --all
docker ps -a
docker stop olx-asp_container
docker rm olx-asp_container
docker run -d --restart=always --name olx-asp_container -p 5817:8080 sashok9203/olx-asp-api
```

```nginx options /etc/nginx/sites-available/default
server {
    server_name   olxapi.itstep.click *.olxapi.itstep.click;
    client_max_body_size 200M;
    location / {
       proxy_pass         http://localhost:5817;
       proxy_http_version 1.1;
       proxy_set_header   Upgrade $http_upgrade;
       proxy_set_header   Connection keep-alive;
       proxy_set_header   Host $host;
       proxy_cache_bypass $http_upgrade;
       proxy_set_header   X-Forwarded-For $proxy_add_x_forwarded_for;
       proxy_set_header   X-Forwarded-Proto $scheme;
    }
    location /hub {
        proxy_pass http://localhost:5817; # Replace with your SignalR server address
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;

        # Optional headers for better handling of websockets
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;

        # Increase buffer and timeout settings
        proxy_buffering off;
        proxy_read_timeout 60s;
        proxy_send_timeout 60s;
        proxy_connect_timeout 60s;
    }
}


sudo systemctl restart nginx
certbot
```
