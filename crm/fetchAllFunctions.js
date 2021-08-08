require('dotenv').config();
const fs = require('fs');
const axios = require('axios');
const beautify = require('js-beautify').js;

(async () => {
    const reqHeaders = {
        'content-type': 'application/json; charset=utf-8',
        'accept': 'application/json',
        'accept-language': 'en-US,en;q=0.9',
        'x-crm-org': process.env.XCRMORG,
        'x-zcsrf-token': process.env.XZCSRFTOKEN,
        'cookie': process.env.COOKIE
    }

    // Pull Fill List of Functions (assumes 200 or less)
    const delugeFunctions = await axios({
        method: 'get',
        url: 'https://crm.zoho.com/crm/v2/settings/functions?type=org&start=1&limit=200',
        headers: reqHeaders
    });

    // Excludes extension functions as they are always empty
    const funcs = delugeFunctions.data.functions.map((f) => {
        return axios({
            method: 'get',
            url: `https://crm.zoho.com/crm/v2/settings/functions/${f.id}?source=crm&language=deluge`,
            headers: reqHeaders
        }).then(resp => {
            if (resp.data.functions[0].nameSpace !== "ExtensionAction") {
                return resp.data.functions[0];
            } else {
                return "";
            }
        }).catch(err => {
            return "error";
        });
    });

    Promise.all(funcs)
        .then(fns => {
            outFuncs = beautify(JSON.stringify(fns));
            try {
                fs.mkdir('functions/', { recursive: true }, err => {
                    if (err) throw err;
                });
                const fileName = 'functions/_AllFunctions.json'
                fs.writeFileSync(fileName, outFuncs);
                console.log(`All Functions > ${fileName}`);
            } catch (err) {
                console.log(err);
            }

            fns.forEach(f => {
                if (f.display_name && f.script.length > 0) {
                    let fileName = `functions/`;
                    const moduleName = f.associated_place ? f.associated_place[0].module : null;
                    if (moduleName) {
                        fileName = fileName + `${moduleName}-${f.name}.ds`;
                    } else {
                        fileName = fileName + `Standalone-${f.name}.ds`;
                    }
                    try {
                        const fileBody = '/*\n'
                            + `    Name: ${f.display_name}\n`
                            + `    ID: ${f.id}\n`
                            + `    Last Modified: ${f.modified_on}\n`
                            + `    Last Modified By: ${f.modified_by}\n`
                            + `    Language: ${f.language}\n`
                            + `    Module: ${moduleName}\n`
                            + '*/\n'
                            + f.script;
                        fs.writeFileSync(fileName, fileBody);
                        console.log(`${f['display_name']} > ${fileName}`);
                    } catch (err) {
                        console.log(err);
                    }
                }
            })
        })
})();