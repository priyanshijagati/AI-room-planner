import request from 'request';
import fs from 'fs';


let file_list = ['/test_files/sala.png']
const api_url = 'https://api.interiordecorator.ai/v1/interior-image/'
const results_url = 'https://api.interiordecorator.ai/v1/results/'

function convertFiles(file_list) {
    let formData = {
        "room_type": "Living room",
        "style": "Modern",
        "upscale": false,
    };

    for (var i = 0; i < file_list.length; i++) {
        formData['files'] = fs.createReadStream(file_list[i]);
    }

    request({
        url: api_url,
        method: 'post',
        formData: formData,
        headers: {
            "Authorization": "api_key",
            "Content-Type": "multipart/form-data",
        }
    }, function (err, res, body) {
        if (err) {
            console.error(err);
            return err;
        }
        getResults(JSON.parse(body));
    });
}

function getResults(data) {
    if (data.error) {
        console.error(data);
        return data.error;
    }
    request({
        url: results_url,
        method: 'post',
        formData: data
    }, function (e, r, body) {
        response = JSON.parse(body);
        console.log(response);
        if (!response.finished) {
            setTimeout(
                function () {
                    getResults(data);
                }, 1000
            );
        }

        console.log(response);
    })
}

convertFiles(file_list);

