const fs = require("fs");
const path1 = require("./my.json");
//const path2 = path1.toString();
//TU MASZ MODUŁ KTÓRY POBIERZE OBIEKT JAVASCRIPT I ZAMIENI GO NA JSON
const myObj = {//obiekt Javascript
    name: 'Skip',
    age: 2222222,
    favoriteFood: 'Steak'
};
const storeData = (data, path) => {
    try {
        fs.writeFileSync(path, JSON.stringify(data));
        // fs.writeFileSync(path, JSON.parse(data));
    } catch (err) {
        console.error(err)
    }
}
console.log(storeData(myObj, "./my.json"));
//JSON.parse()pobiera ciąg JSON i przekształca go w obiekt JavaScript. 
//JSON.stringify()pobiera obiekt JavaScript i przekształca go w ciąg JSON.

const jjj = (data, path) => {
    try {
        // fs.writeFileSync(path, JSON.stringify(data));
        fs.readFileSync(path, JSON.parse(data));
    } catch (err) {
        console.error(err)
    }
}
const json = '{"name":"Skip","age":2222222,"favoriteFood":"Steak"}'
const hhh = JSON.parse(JSON.stringify(path1));
console.log('jaki typ',typeof(hhh));
console.log('parse', hhh);
// https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=78iwh10gzmnfxw&redirect_uri=https://www.linkedin.com/company/76865959/admin/&scope=r_liteprofile%20r_emailaddress%20w_member_social

// {
//     "access_token": "AQU56JkzHtuUlgHITZ_J55SKNmKoaBgQDtNWij6vVcRRiL_ygRPeWl4ucNRAVI_ia8T5ExZcora892np6fUhWrRZFI1r4NONWi6zRumy50kTiT687kRtzGxb5fx65Bzo3p1u7KyJL97V4HWoKx8EDh5wczdabIv2lpJZzUJ9fBdLn019bT29AM9ZOG24BhRcjEMyUasefGVwmlf0JXuLVsy61lXUJAi_YQZ34fjLbShag3LIvEklZAR7EvFaH6c-ljs4pgoB6C6sObXpIxEARWJq_oj4Uz0OKvyGg0ZkOtrwByg2DhNxtF9s8YfTvEHhosDx2ROM6Eg-7Hx3jXsGZHOL72c_CQ",
//     "expires_in": 5183999
// }