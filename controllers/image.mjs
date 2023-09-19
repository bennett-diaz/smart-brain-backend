import fetch from 'node-fetch';
import * as dotenv from 'dotenv'
dotenv.config()

const MODEL_ID = process.env.MODEL_ID;
const MODEL_VERSION_ID = process.env.MODEL_VERSION_ID;

const returnClarifaiRequestOptions = (imageUrl) => {
    const PAT = process.env.PAT;
    const USER_ID = process.env.USER_ID;
    const APP_ID = process.env.APP_ID;
    const raw = JSON.stringify({
        "user_app_id": {
            "user_id": USER_ID,
            "app_id": APP_ID
        },
        "inputs": [
            {
                "data": {
                    "image": {
                        "url": imageUrl
                    }
                }
            }
        ]
    });

    const requestOptions = {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Authorization': 'Key ' + PAT
        },
        body: raw
    }
    return requestOptions;
}


export const handleFaceBox = ((req, res) => {
    fetch("https://api.clarifai.com/v2/models/" + MODEL_ID + "/versions/" + MODEL_VERSION_ID + "/outputs", returnClarifaiRequestOptions(req.body.imageUrl))
        .then(response => response.json())
        .then(data => {
            const clarifaiFaceBox = data.outputs[0].data.regions[0].region_info.bounding_box;
            res.json(clarifaiFaceBox);
        })
        .catch(err => res.status(400).json('unable to work with API'))
})

export const handleImage = (req, res, db) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
        .increment('entries', 1)
        .returning('entries')
        .then(entries => {
            res.json(entries[0]);
        })
        .catch(err => res.status(400).json('unable to get entries'));
}

export const test = (req, res, db) => {
    // res.json('this is a test');
    // return db.select('*').from('users')
    return db('users')
    .then(user => {
        res.json(user[0])
    })
    .catch(err => res.status(400).json('unable to get user'))
}
