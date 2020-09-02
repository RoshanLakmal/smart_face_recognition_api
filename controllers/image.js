const Clarifai = require('clarifai');

const app = new Clarifai.App({
    apiKey: 'e3033d8032134d6f91f63d8add5c0509'
   });

const handleApiCall = (req,res) => {
    app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => {
        res.json(data);
    })
    .catch(err => res.status(400).json('unable to work with API'))
}


const handleImage = (req, res, db)=>{
    const { id } = req.body;
   db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => {
        if(entries.length){
            res.json(entries[0]);
        }else{
            res.status(400).json('Not found')
        }
    }) 
    .catch(err => res.status(400).json('unable to get entries'))
}

module.exports = {
    handleImage : handleImage,
    handleApiCall: handleApiCall
}