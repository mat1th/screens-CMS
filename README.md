# MeesterProef CMD digitale Content

![forthebadge](http://forthebadge.com/images/badges/built-with-love.svg) ![forthebadge](http://forthebadge.com/images/badges/uses-html.svg) ![forthebadge](http://forthebadge.com/images/badges/uses-css.svg) ![forthebadge](http://forthebadge.com/images/badges/uses-js.svg)

## Synopsis

The university of Amsterdam needs an application.

## Motivation

## Installation

Download: <https://github.com/mat1th/meesterproef.git>

Go to the project:

```bash
cd path/to/files
```

Install node modules:

```bash
npm install
```

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

Start Gulp for style and js:

```bash
gulp
```
Start Gulp for browser sync:

```bash
gulp browser-sync
```

Start Gulp to build for server:

```bash
gulp build
```

##Branch structure
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

#Contributor
[Matthias](https://dolstra.me)

#License
This code is published under Apache License.
