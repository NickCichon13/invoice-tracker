const express = require("express");
const router = new express.Router();
const db = require("./db");
const ExpressError = require("./expressError");

router.get('/', async (req, res, next) => {
    try{
        const invoQuery = await db.query(`SELECT * FROM invoices`);
        return res.json({invoices: invoQuery.rows});
    
    }   catch(err){
    
        return next(err)
    }
    });
    
    router.get("/:id", async (req, res, next) => {
        try{
            const { amt, paid, add_date, paid_date} = req.body
            const {id} = req.params;
            const invoQuery = await db.query(`SELECT * FROM biztimedb WHERE id=$1, amt=$2, paid=$3, add_date=$4, paid_date=$5`, [id, amt, paid, add_date, paid_date]);
            
            if( compQuery.rows.length ===0){
                let notFoundError = new Error(`There is no company with the name of ${id} in our system`)
                notFoundError.status = 404;
                throw notFoundError;
            }
            return res.json({company: invoQuery.rows[0] });
        } catch (err){
            return next(err);
        }
    });
    
    router.post('/', async (req, res, next) => {
        try{
            const {comp_code, amt, paid, add_date, paid_date} = req.body;
            const createInvo = await db.query(`INSERT INTO biztimedb (comp_code, amt, paid, add_date, paid_date) VALUES ($1, $2, $3, $4, $5) RETURNING comp_code, amt, paid, add_date, paid_date `[comp_code, amt, paid, add_date ,paid_date ])
            return res.status(201).json(createInvo.rows[0])
        } catch(err) {
            return next(err);
        }
    });
    
    router.patch('/:id', async (req, res, next) => {
        try{
            const { comp_code, amt, paid, add_date, paid_date } = req.body;
            const { id } = req.params;
            const updateInvo = await db.query(`UPDATE biztimedb SET comp_code=$1, amt=$2, paid=$3, add_date=$4, paid_date=$5 WHERE id=$6 RETURNING comp_code, amt, paid, add_date, paid_date`, [id, comp_code, amt, paid, add_date, paid_date])
            return res.send(updateInvo.rows[0])
        } catch(err){
            return next(err);
        }
    })
    
    router.delete('/:code', async (req, res, next) => {
        try{
            const deleteComp = await db.query(`DELETE FROM biztimedb WHERE =$1`, [req.params.code])
            return res.send({ msg: "DELETED!" })
        } catch(err){
            return next(err);
        }
    });

    router.get('/:code', async (req, res, next) => {
        try{
        const {name, description} = req.body;
        const {id} = req.params
        const {amt, paid, add_date, paid_date}= req.body;
        const findCompInvo = await db.query(`
        SELECT 
        companies.code=$1, companies.name=$2, companies.description=$3, 
        invoices.amt=$4, invoices.paid=$5, invoices.add_date=$6, invoices.paid_date=$7 
        FROM 
        companies 
        INNER JOIN 
        invoices 
        ON companies.code = invoices.code `,
        [id, name, description, amt, paid, add_date, paid_date]);

        if( findCompInvo.rows.length ===0){
            let notFoundError = new Error(`There is no company with the name of ${name} in our system`)
            notFoundError.status = 404;
            throw notFoundError;
        }
        return res.json({company: findCompInvo.rows[0] });
        } catch(err){
            return next(err);
        }
    });
    
module.exports = router;