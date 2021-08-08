require('dotenv').config();
const axios = require('axios');


(async () => {
    const reqHeaders = {
        'content-type': 'application/json; charset=utf-8',
        'accept': 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        'x-crm-org': process.env.XCRMORG,
        'x-zcsrf-token': process.env.XZCSRFTOKEN,
        'cookie': process.env.COOKIE
    }

    axios({
        method: 'get',
        url: 'https://crm.zoho.com/crm/v2/settings/functions?type=org&start=1&limit=200',
        headers: reqHeaders
    }).then(res => {
        console.log("Authentication Successful");
    }).catch(res => {
        console.log("Authentication Failed", res.response.data);
    });
})();