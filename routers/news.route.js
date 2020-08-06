const express = require('express');
const categoryModel = require('../models/category.model');
const newsModel = require('../models/news.model');
const { ensureAuthenticated, ensureAuthenticatedAdmin } = require('../config/auth');
const router = express.Router();

var getCat = function (listCat, listMenu, listExtra) {
    for (let i = 0; i < listMenu.length; i++) {
        const a = [];
        for (let j = 0; j < listCat.length; j++) {
            if (listMenu[i].CatID === listCat[j].ParentID) {
                a.push(listCat[j].CatName);
            }
        }
        listMenu[i].Descendants = a;
    }

    let countExtra = listMenu.length - 8;
    let isfull;

    if (countExtra == 0) {
        isfull = true;
    } else if (countExtra > 0) {
        isfull = false;
        for (let i = 1; i <= countExtra; i++) {
            let item = listMenu.pop();
            listExtra.push(item);
        }
    }
    return isfull;
}

router.get('/', async function (req, res) {
    const user = req.user;
    const listCat = await categoryModel.all();
    const listMenu = await categoryModel.allWithOnlyFirstNode();
    const listExtra = new Array();
    const isfull = getCat(listCat, listMenu, listExtra);
    const row = await newsModel.single(1);

    res.render('vwNews/news', {
        categories: listMenu,
        isFull: isfull,
        extras: listExtra,
        news: row[0],
        user
    });
})

router.get('/list-by-Cat', async function (req, res) {
    const user = req.user;
    // const listNews = await newsModel.single();
    const listCat = await categoryModel.all();
    const listMenu = await categoryModel.allWithOnlyFirstNode();
    const listExtra = new Array();
    const isfull = getCat(listCat, listMenu, listExtra);

    res.render('list', {
        categories: listMenu,
        isFull: isfull,
        extras: listExtra,
        user,
        // page_items,
        // prev_value: page - 1,
        // next_value: page + 1,
        // can_go_prev: page > 1,
        // can_go_next: page < nPages
    });
})





module.exports = router;