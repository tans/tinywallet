var getAxiosErrorMessage = function (err) {
    let message = err ? "unknow error" : JSON.stringify(err);
    if (err.message) {
        message = err.message;
    }
    if (err.response && err.response.data) {
        message = err.response.data;
    }
    return message;
};
