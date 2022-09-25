# Product Service

[Swagger with API description](https://09tjnjfro4.execute-api.eu-west-1.amazonaws.com/dev/swagger)

Temporary I've changed `fetchAvailableProducts` to `fetchProducts` to see all products on main page with images.

[FE main page](https://d31qwwzbuo55t9.cloudfront.net/) 

The original pages for which the product service is intended also work with API:

[FE admin/products](https://d31qwwzbuo55t9.cloudfront.net/admin/products) - you can click `manage` button of any product to go to form.

[FE admin/product-form/1](https://d31qwwzbuo55t9.cloudfront.net/admin/product-form/1) - just example of form for edit first product.

# Run tests

There are tests for every lambda function. To run all test run `npm run test` command.

# Serverless - AWS Node.js Typescript

This project has been generated using the `aws-nodejs-typescript` template from the [Serverless framework](https://www.serverless.com/).

For detailed instructions, please refer to the [documentation](https://www.serverless.com/framework/docs/providers/aws/).

## Installation/deployment instructions

Depending on your preferred package manager, follow the instructions below to deploy your project.

> **Requirements**: NodeJS `lts/fermium (v.14.15.0)`. If you're using [nvm](https://github.com/nvm-sh/nvm), run `nvm use` to ensure you're using the same Node version in local and in your lambda's runtime.

### Using NPM

- Run `npm i` to install the project dependencies
- Run `npx sls deploy` to deploy this stack to AWS

### Using Yarn

- Run `yarn` to install the project dependencies
- Run `yarn sls deploy` to deploy this stack to AWS
