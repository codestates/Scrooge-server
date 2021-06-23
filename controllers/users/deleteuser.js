const { user, money, achievement, category, level } = require('../../models');
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
dotenv.config();

module.exports = async (req, res) => {
    const authorization = req.headers['authorization'];

    if (!authorization) { 
        return res.status(401).send({ "message": 'invalid access token'})
    }
    const token = authorization.split(' ')[1];
    const data = jwt.verify(token, process.env.ACCESS_SECRET);

    const joinId = await tag_store.findAll({ where: { storeId: data.storeId }})
    const joinInfo = joinId.map(el => el.dataValues.tagId)

    for(let el of joinInfo){
        await tag.destroy({ where: { id: el }})
    }

    await user.destroy({ where: { id: data.id }})
    await store.destroy({ where: { id: data.storeId }})
    await item.destroy({ where: { storeId: data.storeId }})
    await tag_store.destroy({ where: { storeId: data.storeId }})

    return res.status(205).send({ "message": '회원탈퇴 완료' })
}