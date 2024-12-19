const apiString = "https://loadgo.in/loadgo/";

export const post = (payload, type) =>
  new Promise((resolve, reject) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    fetch(apiString + type + ".php", requestOptions)
      .then((response) => {
        if (response.ok) {
          response
            .json()
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              reject(new Error("JSON Parse error=>", error)); // Handle JSON parsing error
            });
        } else {
          // Handle other status codes as needed
          reject(new Error("Unexpected response status: " + response.status));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });

export const patch = (payload, reqType) =>
  new Promise((resolve, reject) => {
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    };
    fetch(apiString + reqType + ".php", requestOptions)
      .then((response) => {
        response
          .json()
          .then((response) => {
            resolve(response);
          })
          .catch((error) => {
            console.log(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });

export const get = (reqType, queryParam) =>
  new Promise((resolve, reject) => {
    let api = apiString + reqType + ".php";
    api = queryParam ? api + queryParam : api;
    fetch(api)
      .then((response) => {
        if (response.ok) {
          // If the response is OK
          response
            .json()
            .then((response) => {
              resolve(response);
            })
            .catch((error) => {
              if (response.status == 204) reject(new Error("Data Not Found")); // Handle JSON parsing error
            });
        } else {
          // Handle other status codes as needed
          reject(new Error("Unexpected response status: " + response.status));
        }
      })
      .catch((error) => {
        reject(error.message);
      });
  });
