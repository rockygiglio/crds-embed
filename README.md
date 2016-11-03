# CrdsEmbed

## Development server
Run `npm run start` for a dev server. The app will automatically reload if you change any of the source files.

## Environment Variables

Copy the `.env.example` file to `.env` and adjust the environment variables to suit your environment.

You can also set the matching keyname values in your OS environment variables if you prefer.

## Build

Run `npm run build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `npm run test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Parameters

Query parameters are used to define the several initial values.  
* `type` - string - REQUIRED - only accepted are [payment, donation]
* `invoice_id` - numeric - REQUIRED if type=payment
* `total_cost` - numeric - REQUIRED if type=payment
* `min_payment` - numeric - REQUIRED if type=payment
* `title` - string - optional
* `url` - string - optional

An example `http://localhost:8080?type=payment&min_payment=123&invoice_id=1234&total_cost=1234`