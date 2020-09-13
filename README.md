# Klimaatraad web app

## Prerequisites

You'll need the following:
- Angular CLI v10
- NPM v12
- The Heroku CLI
- MongoDB

## Developing

Run the following command:

    npm run dev:ssr

This will boot up an Angular Universal build with SSR, hosting from `server.ts`. It will detect changes to any file and update automatically.

To boot up the French version, run:

    npm run dev:ssr:fr

## Deploying

To deploy the NL version:

    git push heroku-nl master

To deploy the FR version, first merge to the `heroku-fr` branch:

    git checkout fr
    git merge master

and then push that `fr` branch to the french app on Heroku's `master` (it can only build from master):

    git push heroku-fr fr:master
