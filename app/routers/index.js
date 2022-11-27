const router = require('express').Router();
const fs = require('fs');
var data = null;

const readJSON = (filePath, cb) => {
    fs.readFile(filePath, (err, fileData) => {
      if (err) {
        return cb && cb(err);
      }
      try {
        const object = JSON.parse(fileData);
        return cb && cb(null, object);
      } catch (err) {6
        return cb && cb(err);
      }
    });
}



// const generateID = async () => {
//     let genID = Math.floor(Math.random() * 1000000);
//     let idExists = data.find(x => x.id === genID);
//     while (idExists) {
//         genID = Math.floor(Math.random() * 1000000);
//         idExists = data.find(x => x.id === genID);
//     }
//     return genID;
// }




(async () => {
    
    readJSON('./app/data/QRcode.json', (err, object) => { if (err) { throw err }
        data = object;
    });

})();




router.get('/read', async (req, res) => {
    
    try {
        
        readJSON('./app/data/QRcode.json', (err, object) => { if (err) { throw err }
        data = object;
            return res.json(data);
        });
    
    } catch (err) { res.status(500).json({status: false, err: err}) }

});


router.get('/check', async (req, res) => {

    try {
        console.log('check working!', new Date());
        let itemCheck = data.find(x => parseInt(x.id) === parseInt(req.query.id));

        if (itemCheck) {
            if (itemCheck.msg !== '') {
                res.status(200).send({
                    data: itemCheck,
                    step: 1,
                    message: 'Item already'
                });
            } else {
                res.status(200).send({
                    data: itemCheck,
                    step: 0,
                    message: 'Item no message'
                });
            }
        } else {

            if (req.query.id.length !== 6) {
                res.status(400).send({
                    message: 'ID must be 6 digits'
                });
                return;
            }
            
            let dataPush = {
                id: parseInt(req.query.id),
                msg: req.body.msg || '',
                modify: new Date()
            }
            
            data.push(dataPush);

            fs.writeFile('./app/data/QRcode.json', JSON.stringify(data), (err) => {
                if (err) throw err;
                res.status(200).send({
                    data: dataPush,
                    step: 0,
                    message: 'Item new & no message'
                });
            });
    
        }

    } catch (err) { res.status(500).json({status: false, err: err}) }
    
});


router.get('/setMessage', async (req, res) => {
    
    try {
        
        const itemIndex = data.findIndex(x => x.id === parseInt(req.query.id));

        if (itemIndex === -1) {
            res.status(400).send({ message: 'Item not found' }); return;
        }
        data[itemIndex].msg = req.query.msg;
        data[itemIndex].modify = new Date();

        console.log(data[itemIndex])

        fs.writeFile('./app/data/QRcode.json', JSON.stringify(data), (err) => {
            if (err) throw err;
            res.status(200).send({
                data: data[itemIndex],
                step: 1,
                message: 'Item updated'
            });
        });

        
    } catch (err) { console.log(err) }

})


module.exports = router;