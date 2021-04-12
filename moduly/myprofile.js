const https = require('https');
const accessToken = 'AQU56JkzHtuUlgHITZ_J55SKNmKoaBgQDtNWij6vVcRRiL_ygRPeWl4ucNRAVI_ia8T5ExZcora892np6fUhWrRZFI1r4NONWi6zRumy50kTiT687kRtzGxb5fx65Bzo3p1u7KyJL97V4HWoKx8EDh5wczdabIv2lpJZzUJ9fBdLn019bT29AM9ZOG24BhRcjEMyUasefGVwmlf0JXuLVsy61lXUJAi_YQZ34fjLbShag3LIvEklZAR7EvFaH6c-ljs4pgoB6C6sObXpIxEARWJq_oj4Uz0OKvyGg0ZkOtrwByg2DhNxtF9s8YfTvEHhosDx2ROM6Eg-7Hx3jXsGZHOL72c_CQ';

const optionsMe = {
  host: 'api.linkedin.com',
  path: '/v2/me',//pobranie mojego profilu
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'cache-control': 'no-cache',
    'X-Restli-Protocol-Version': '2.0.0'
  }
};
//export funkcji aby była dostępna w innych plikach
exports.profileRequest = https.request(optionsMe, function(res) {
  let data = '';
  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const profileData = JSON.parse(data);
    
    console.log(profileData);
    profileData.localizedLastName = "Zmodyfikowany";//modyfikowanie istniejącej wartosci
    profileData.kkk = "nowa wartosc k";//dodawanie nowego obiektu do obiektu javascript
    console.log(JSON.stringify(profileData, 0, 2));
  });
});

