const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(bodyParser.raw({limit:  '10mb'}))

const PORT = process.env.PORT || 8080;
let responseObj = {}, referenceData = {};


app.post('/codingtest1',(req,res) => {
    const inputPayload = req.body ? JSON.parse(JSON.stringify(req.body)) : null;
    try{

        if(inputPayload != null){
            referenceData = inputPayload.referenceData;
            responseObj = inputPayload.payload;
            responseObj.value = updateResponse(responseObj.value, referenceData);
            res.json(responseObj);
        }
        else {
            res.send("Please provide a request body.")
        }
    }
    catch (err) {
        console.log("error")
        res.send("An error occurred. Please check the input body.");
    }


});

function updateResponse(items, data){
    items.forEach((item, index) => {
        if(item.valueType == 'array'){
            return updateResponse(item.value , data);
        }
        if(item.value.includes('{REF_MSISDN}')){
            items[index].value = items[index].value.replace('{REF_MSISDN}', data.REF_MSISDN)
        }
        if(item.value.includes('{REF_IMSI}')){
            items[index].value = items[index].value.replace('{REF_IMSI}', data.REF_IMSI)
        }
        if(item.value.includes('{REF_SERVPROFID}')){
            items[index].value = items[index].value.replace('{REF_SERVPROFID}', data.REF_SERVPROFID)
        }
        
    });
    return items;
}

app.listen(PORT, () => console.log(`Listening to server on PORT ${PORT} `))