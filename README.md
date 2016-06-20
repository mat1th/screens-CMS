# MeesterProef CMD screens Content

![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg) ![forthebadge](http://forthebadge.com/images/badges/uses-html.svg) ![forthebadge](http://forthebadge.com/images/badges/uses-css.svg) ![forthebadge](http://forthebadge.com/images/badges/uses-js.svg)

## Live url
[https://posters.dolstra.me](https://posters.dolstra.me)

## Synopsis
A CMS to upload posters of Vimeo movies and show them on a screen.

## Motivation
The university of Amsterdam needs an application for displaying posters on screens. They are using A0 posters now. But there are to less places for all students to show their poster. Now they have asked to create a CMS for uploading the posters and editing them in a slideshow

## Installation

Download: [https://github.com/mat1th/meesterproef.git](https://github.com/mat1th/meesterproef.git)

Go to the project:

```bash
cd path/to/files
```

Install node modules:

```bash
npm install
```

## Setting things up
Before you can start the application you need to connect to the database. And you need to setup the mail part of the application.

### Connect to the database
Please duplicate ```config/config_example.json``` and rename the file to ```config/config.json```. In this file you define all the passwords form the app and the database connections. The variables in the ``all`` section are available in each environment.

An example setting block:
```json
"development": {
    "env": "development",
    "dbOptions": {
        "host": "host",
        "user": "user",
        "password": "ww",
        "database": "database",
        "port": 10000
    }
}
```
You van create as mutch environment as you want. To use a stage duplicate ```config/config_example.js``` and rename the file to ```config/config.js```. This this file will be used for selecting the environment. Replace the string on the first row with the environment you want to use.

```js
var env = process.env.NODE_ENV || 'development'
```

### Add database structure
Now we have got to set up the database structure. In the file ``database/database.sql`` can you find the the database structure. Please add it to your database. Now you can build the app.

## Building

Install Gulp:

```bash
npm install --global gulp-cli
```

Go to the project:

```bash
cd path/to/files
```

Install dev npm modules:

```bash
npm install --dev
```

### For the first time you need to run:

```bash
gulp build
```
This conferts all the images and place the other files from the ```public/src``` to the ```public/dist``` folder. Then you can start the browser-sync task to run browser sync with nodemon to auto refrech the browser.

Start Gulp for browser sync:

```bash
gulp browser-sync
```

### Code structure
In the app.js file you can find the start file from the app. For every route is a file in the route folder. The files are so strucured that the path of the file is the path of the url.

```
/config                //the config of the application
/lib
  /hbsHelper.js        //the hbs template helpers
  /socketConnection.js //connection to the socket
/modules               //all the modules from the app
/public
  /src
    /img               //all the images if the application
    /js
    /css
/routes     
  /admin               //the admin part of the application (for all these routes you need to be logged in)
  /api                 //The api that can be used in the front end
  /display             //the display route that will be shown on a display
  /middleware          //the middleware for the routes
  /users               //to log in and register the users
/sessions              //in this folder the sessions files will be saved
/uploads               //in this folder the uploaded files will be saved
/views                 //all the views of the application. It is structured the same as the routes in the routes folder
app.js                //the root of the application. This file you need to start.

```

## Code syntax

### Css syntax
For css I'm using [cssnext](http://cssnext.io). With this plugin you can use the css syntax that will be supported later by the browsers.

### JS syntax
Im using some new JS functions with Babel this will be converted to code that can be used by older browsers.

## Branch structure
The Master branch is the branch where the final features are pushed to. The [master-v0.5](https://github.com/mat1th/meesterproef/tree/master-v0.5) branch is the old master branch with the old interaction.
If you want to create a new feature please create a 'feature/your-feature' branch.

## NPM packages

Name                 | Version | Description
:------------------- | :------ | :----------
bluebird             | 3.4.1   | Full featured Promises/A+ implementation with exceptionally good performance
cookie-parser        | 1.4.3   | cookie parsing with signatures
emailjs              | 1.0.5   | send text/html emails and attachments (files, streams and strings) from node.js to any smtp server
express              | 4.13.4  | Fast, unopinionated, minimalist web framework
multer               | 1.1.0   | Middleware for handling <code>multipart/form-data</code>.
express-myconnection | 1.0.4   | Connect/Express middleware that auto provides mysql connections.
express-session      | 1.10.1  | Simple session middleware for Express
gsap                 | 1.18.5  | Think of GSAP as the Swiss Army Knife of animation...but better. It animates anything JavaScript can touch (CSS properties, canvas library objects, SVG, generic objects, whatever) and it solves countless browser inconsistencies, all with blazing speed (up
hbs                  | 1.18.2  | Express.js template engine plugin for Handlebars
path                 | 4.0.0   | This is an exact copy of the NodeJS ’path’ module published to the NPM registry.
mysql                | 2.5.4   | A node.js driver for mysql. It is written in JavaScript, does not require compiling, and is 100% MIT licensed.
body-parser          | 1.10.1  | Node.js body parsing middleware
moment               | 2.9.0   | Parse, validate, manipulate, and display dates
session-file-store   | 0.0.2   | Session file store is a provision for storing session data in the session file
socket.io            | 1.4.6   | Node.js realtime framework server

## Contributor
- [Matthias (Mat1th)](https://dolstra.me)

## License

This code is published under Apache License.
