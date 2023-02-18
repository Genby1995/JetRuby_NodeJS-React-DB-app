# JetRuby - API

https://jetruby.onrender.com/ - hosting deployment.

## Installation and expluatation:

<b style="color: yellow"> Development:</b> <b>"npm run dev"</b> or <b>"npm run start"</b> (for hot refresh).

<p>
<b style="color: green">Production:</b> <b>"npm run build"</b>, then run index.html in <b>"./dist"</b>

<b style="color: red">Note:</b> To use with other UI change of environment variables <b>.ENV {PORT=..., MONGO_URL = "mongodb+srv://...", CLIENT_URLS = "http://localhost:3000, https://.../, https://.../"}</b> is needed.

## About

### API

API_URL = https://jetruby.onrender.com/api:

-   GET API_URL/trending - returns an array with recordings from the database.
-   GET API_URL/trending/:id - returns an object with recordings from the database with ID from request parameters.
-   GET API_URL/config - returns an object with actual server config.
-   PUT API_URL/update - takes an object { repoMaxAge, timerPeriod, repoCount } and returns an array with recordings from the database, synchronized with the GitHub API.

### Choice of Data Base

In our case, we need to quickly assemble a database in which there is one data array without references.

Choise was between MySQL, PostgreSQL and MongoDB:

-   MySQL - easy to build and configure, works well with a small amount of data.
-   PostgreSQL is more difficult to configure than MySQL, suitable for a highly scalable project.
-   MongoDB has simple setup and good performance if no references needed.

Summing up, MySQL and MongoDB are most suited for solving the task, but as MySQL is sensitive to server instability and the tast doesn't need references, MongoDB is accepted. The decision is good enougth while we don't references while scaling the project.

<p>

## Stack

-   Node.JS
-   Express
-   DoteENV
-   MongoDB + Mongoose
