

const apiString='https://loadgo.in/loadgo/'


export const post = (payload,type) => new Promise((resolve, reject) => {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    fetch(apiString+type+'.php',requestOptions)
    .then(response => {
        response.json()
            .then(response => {
                resolve(response);
            });
    }).catch(error => {
        reject(error);
    });
});

export const patch = (payload,reqType) => new Promise((resolve, reject) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    fetch(apiString+reqType+'.php',requestOptions)
    .then(response => {
        response.json()
            .then(response => {
                resolve(response);
            });
    }).catch(error => {
        reject(error);
    });
});


export const get = (id) => new Promise((resolve, reject) => {
    const requestOptions = {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
    };
    fetch(apiString+reqType+'.php')
    .then(response => {
        response.json()
            .then(data => {
                resolve(data);
            });
    }).catch(error => {
        reject(error);
    });
});