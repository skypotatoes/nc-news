# Northcoders News API

The live version is hosted at: https://project-news-server.herokuapp.com/

This is a News Service API which allows the posting of articles and comments to those articles.

To clone this repo, use the following terminal command:
`git clone https://github.com/skypotatoes/be-nc-news.git`

You will also need to install dotenv, express and postgreSQL dependencies with the following terminal commands:

```
npm i dotenv
```

```
npm i express
```

```
npm i pg
```

To connect to the databases, you will need to add .env.development and .env.test files

In .env.development PGDATABASE=nc_news
In .env.test PGDATABASE=nc_news_test
