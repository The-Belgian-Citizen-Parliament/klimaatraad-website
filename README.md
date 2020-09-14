# Klimaatraad web app

## Prerequisites

You'll need the following:
- Angular CLI v10
- NPM v12
- The Heroku CLI and an account
- [MongoDB Community Server](https://www.mongodb.com/try/download/community)

After cloning, first install the dependencies:

    npm install

Add the remotes for the NL and FR heroku repositories:

    git remote add heroku-nl https://git.heroku.com/klimaatraad.git
    git remote add heroku-fr https://git.heroku.com/conseilclimat.git

## Developing

Run the following command:

    npm run dev:ssr

This will boot up an Angular Universal build with SSR, hosting from `server.ts`. It will detect changes to any file and update automatically.

To boot up the French version, run:

    npm run dev:ssr:fr

## Deploying

In order to deploy to Heroku, you'll need to be added to the team. Contact the DI circle responsible.

To deploy the NL version:

    git push heroku-nl master

To deploy the FR version, first merge to the `heroku-fr` branch:

    git checkout fr
    git merge master

and then push that `fr` branch to the french app on Heroku's `master` (it can only build from master):

    git push heroku-fr fr:master
