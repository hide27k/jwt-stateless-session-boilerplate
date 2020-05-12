//Auth0 Client ID
const clientId = "R5GOtU5wzG74ql7eft9TrSlEudfBMUpJ";
//Auth0 Domain
const domain = "flatt-training.auth0.com";

const auth0 = new window.auth0.WebAuth({
  domain: domain,
  clientID: clientId,
  audience: '/protected',
  scope: 'openid profile purchase',
  responseType: 'id_token token',
  redirectUri: 'http://localhost:8000/auth/',
  responseMode: 'form_post'
});

function loggedIn() {
  $('#btn-login').hide();

  const name = jwt_decode(Cookies.get('id_token')).name;
  console.log(name);
}

function loggedOut() {
  $('#btn-login').show();
}

$('#btn-login').on('click', function (event) {
  auth0.authorize();
});

$('#btn-logout').on('click', function (event) {
  window.location.replace('/logout');
});

if (Cookies.get('id_token')) {
  loggedIn();
} else {
  loggedOut();
}