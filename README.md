# JB Dashboard
An upgraded dashboard for the Big Change Apps platform.

## Installation
1. Install Node.js from [https://nodejs.org/en/](https://nodejs.org/en/)
2. Install Git from [https://git-scm.com/downloads](https://git-scm.com/downloads)
3. Clone Git repository
```
   git clone https://github.com/mcsquaredw/jb-dashboard
```
4. Install dependencies
```
   cd jb-dashboard && npm i
```
5. Create config.js file
```
   module.exports = {
     username: "<YOUR BIG CHANGE APPS USERNAME>",
     password: "<YOUR BIG CHANGE APPS PASSWORD>",
     api_key: "<YOUR BIG CHANGE APPS API KEY>"
   }
```
6. Start app
### Development
```
   npm run start-development
```
### Production
```
   npm run start-production
```
7. Go to site
```
   http://<hostname>:3000
```
