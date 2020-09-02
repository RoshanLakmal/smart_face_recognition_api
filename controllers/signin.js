const handleSignIn = (req, res, db, bcrypt)=>{
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if(isValid){
                return db.select('*').from('users')
                    .where('email', '=', req.body.email)
                    .then(user => {
                        res.json(user[0])
                    })
                    .catch(err => res.status(400).json('unable to get user'))
            }else{
                res.status(400).json('wrong credentials')
            }
        })
        .catch(err => res.status(400).json('wrong credentials'))
    // bcrypt.compare("cookiesa", "$2a$10$4EWfkp1VD1jVqnlv/oDL/O/WkDOzdAfwShNGEze9WxfBea.zZPOqS", function(err, res) {
    //     // res == true
    //     console.log(res);
    // });
    // if(req.body.email === database.users[0].email && req.body.password === database.users[0].password){
    //     res.json(database.users[0]);
    //     //res.json('success');
    // }else{
    //     res.status(400).json('error logging in');
    // }
   
}
module.exports = {
    handleSignIn : handleSignIn
}