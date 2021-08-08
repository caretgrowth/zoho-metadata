# zoho-metadata

## Purpose

A set of scripts used to work with the unofficial, unpublished, and unsupported Zoho Metadata APIs. Use at your own risk, you have been warned!

## Setup

After you clone the repo, install the required packages using yarn
```
yarn install
```

The unofficial api does have any authentication method that we can leverage, so we need to authenticate via the web application and use the credentials from the browser to run the scripts. The bad news is that you need to manually capture the values from the javascript console. The good news is that these credentials are not hard to get and rarely expire. As a reminder, it is not a good security practice to keep these types of credentials stored on your machine.

This is one of many ways to get these credentials, these instructions are for Firefox, but should work with Chrome as well:

  1) Create a .env file in the root directory of the project and add these variables: 
```
    XZCSRFTOKEN=
    XCRMORG=
    COOKIE=
```
  2) Login to Zoho CRM
  2) Open the Javascript Console (right click > inspect is quick way)
  3) Navigate to Setup > Developer Space > Functions in Zoho CRM
  4) Go the the Network tab of the console and search for https://crm.zoho.com/crm/v2/settings/functions
  5) Right Click on the request and go to Copy > Copy Request Headers
  6) Paste the headers into a new text file
  7) Copy paste the corresponding values from the Request Headers to the .env file
```
    XZCSRFTOKEN=<X-ZCSRF-TOKEN> (crmcsrfparam=234j534lds...)
    XCRMORG=<X-CRM-ORG> (987654321)
    COOKIE=<Cookie> (_iamadt=cdc9c6b1b2e...)
```

You can test your setup steps using:
```
yarn run crm:test:auth
```

## CRM Commands

### Fetch All Functions
```
yarn run crm:functions:fetch
```
Creates **_AllFunctions.json** with all functions and metadata. Also generates a file for each function with the name **\<Module Name\>-\<function name\>.ds** along with comments containing some useful metadata values.

All files stored in the *functions* directory which is created when first run.