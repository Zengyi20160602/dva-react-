const APIV1 = '/api/v1'
const APIV2 = '/api/v2'

module.exports = {
  name: 'SupCon',
  prefix: 'supcon',
  footerText: 'SupCon  © 2018',
  logo: '/logo.png',
  enterPage: ['/login'],
  APIV1,
  APIV2,
  api: {
    userLogin: `${APIV1}/login`,
    userLogout: `${APIV1}/logout`,
    user: `${APIV1}/user`,
  },
}