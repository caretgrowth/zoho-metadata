require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const { pipeline } = require('stream');

(async () => {
    const reqHeaders = {
        'content-type': 'application/json; charset=utf-8',
        'accept': 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        'x-crm-org': process.env.XCRMORG,
        'x-zcsrf-token': process.env.XZCSRFTOKEN,
        'cookie': process.env.COOKIE
    }

    // Pull Backup URLs from latest backup
    // Example Response: 
    // {
    //     "urls": {
    //         "data_links": [...],
    //         "attachment_links": [...],
    //         "expiry_date": "2021-08-09T18:47:21-04:00"
    //     }
    // }
    const backupUrls = await axios({
        method: 'get',
        url: 'https://crm.zoho.com/crm/bulk/v2/backup/urls',
        headers: reqHeaders
    }).catch(err => {
        console.error(err);
    });

    try {
        fs.mkdir('backups/', { recursive: true }, err => {
            if (err) throw err;
        });
    } catch (err) {
        console.error(err);
    }

    expDate = new Date(backupUrls.data.urls.expiry_date).toISOString().replaceAll('-', '').substring(0, 8);
    urls = [...backupUrls.data.urls.data_links, ...backupUrls.data.urls.attachment_links];
    urls.forEach(async link => {
        const fileName = 'backups/' + expDate + '_' + link.split("/").pop();

        await axios({
            url: link,
            method: 'GET',
            headers: reqHeaders,
            responseType: 'stream'
        }).then(response => {
            pipeline(response.data
                , fs.createWriteStream(`${fileName}`)
                , err => {
                    if (err) {
                        console.error(err);
                    } else {
                        console.log(`${link} > ${fileName}`);
                    }
                });
        }).catch(err => {
            console.error(err);
        });
    });
})();