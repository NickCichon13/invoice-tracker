const express = require("express");
const router = new express.Router();
const db = require("./db");
const ExpressError = require("./expressError");


router.get('/', async (req, res, next) => {
try{
    const compQuery = await db.query(`SELECT id, name FROM companies`);
    return res.json({companies: compQuery.rows});

}   catch(err){

    return next(err)
}
});

router.get("/:code", async (req, res, next) => {
    try{
        const {code, name, description} = req.body
        const compQuery = await db.query(`SELECT * FROM biztimeed WHERE id=$1, name=$2, description=$3`, [code, name, description]);
        
        if( compQuery.rows.length ===0){
            let notFoundError = new Error(`There is no company with the name of ${name} in our system`)
            notFoundError.status = 404;
            throw notFoundError;
        }
        return res.json({company: compQuery.rows[0] });
    } catch (err){
        return next(err);
    }
});

router.post('/', async (req, res, next) => {
    try{
        const {name, description} = req.body;
        const createComp = await db.query(`INSERT INTO biztimedb (name, description) VALUES ($1, $2) RETURNING code, name, description `[name, description])
        return res.status(201).json(createComp.rows[0])
    } catch(err) {
        return next(err);
    }
});

router.patch('/:code', async (req, res, next) => {
    try{
        const { name, description } = req.body;
        const {code} = req.params;
        const updateComp = await db.query(`UPDATE biztimedb SET name=$1, description=$2 WHERE code=$3 RETURNING code, name, description`, [name, description, code])
        return res.send(updateComp.rows[0])
    } catch(err){
        return next(err);
    }
})

router.delete('/:code', async (req, res, next) => {
    try{
        const deleteComp = await db.query(`DELETE FROM biztimedb WHERE code=$1`, [req.params.code])
        return res.send({ msg: "DELETED!" })
    } catch(err){
        return next(err);
    }
});




module.exports = router;