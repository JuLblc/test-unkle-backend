# UNKLE | Test Backend

## Introduction

API Creation with Node.JS, PostgreSQL and Sequelize

## Setup

- Clone this repo

```shell
$ cd test-unkle-backend
$ npm install
```

- .env file exemple

```
PORT=YOUR_SERVER_PORT_NUMBER
PGUSER=YOUR_PG_USER
PGHOST=YOUR_PG_HOST
PGPASSWORD=YOUR_PG_PASSWORD
PGDATABASE=YOUR_PG_DATABASE
PGPORT=YOUR_PG_PORT
SESS_SECRET=YOUR_SECRET
```
- Initializing Database

```
node bin/createDB.js
```

Admin user will be created 
```
email: admin@admin.fr
password: admin
```

5 contract options will also be created

- Run API

```
npm run dev
```

or

```
npm start
```

## Instructions

Format for the request body

- **email**, type String,
- **password**, type String,
- **role**, type String. Possible values: `admin`, `user`
- **start**, type String. Format: `dd/MM/YYYY`,
- **end**, type String. Format: `dd/MM/YYYY`,
- **options**, type String[]. Possible values: 'Incendie', 'Inondation', 'Seisme', 'Tornade', 'Tsunamie'.
- **client**, type String[] of email

The app will need the following routes:

| Method | Endpoint         | Parameters                              | Return Value            |
| ------ | ---------------- | --------------------------------------- | ----------------------- |
| POST   | `/sessions`      | email, password                         | User logged             |
| DELETE | `/session`       |                                         | Logout Message          |
| POST   | `/user`          | email, password, role                   | User created            |
| DELETE | `/user`          | email                                   | Delete Message          |
| GET    | `/users`         |                                         | All users and details   |
| GET    | `/user`          |                                         | User logged and details |
| POST   | `/contract`      | start, end (optional), options, clients | Contract created        |
| PUT    | `/contract/:id`  | end, clientId (if admin)                | Update Message          |
| GET    | `/contract`      |                                         | Contracts User logged   |
| GET    | `/contracts`     |                                         | All Contracts           |
