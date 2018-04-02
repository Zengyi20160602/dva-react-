const config = require('../src/utils/config');
const qs = require('qs');

const { APIV1 } = config;

const EnumRoleType = {
  ADMIN: 'admin',
  DEFAULT: 'guest',
  DEVELOPER: 'developer',
}

const userPermission = {
    DEFAULT: {
      role: EnumRoleType.DEFAULT,
    },
    ADMIN: {
      role: EnumRoleType.ADMIN,
    },
    DEVELOPER: {
      role: EnumRoleType.DEVELOPER,
    },
  }

  const adminUsers = [
    {
      id: 0,
      username: 'admin',
      password: 'admin',
      permissions: userPermission.ADMIN,
    }, {
      id: 1,
      username: 'guest',
      password: 'guest',
      permissions: userPermission.DEFAULT,
    }, {
      id: 2,
      username: 'developer',
      password: '123456',
      permissions: userPermission.DEVELOPER,
    },
  ];

  module.exports = {
      [`POST ${APIV1}/login`] (req, res) {
        const { username, password } = req.body;
        const user = adminUsers.filter(item => item.username === username);
        if(user.length > 0 && user[0].password === password) {
            const now = new Date();
            now.setDate(now.getDate() + 1);
            res.cookie('token', JSON.stringify({ id: user[0].id, deadline: now.getTime() }), {
              maxAge: 900000,
              httpOnly: true,
            });
              res.json({ success: true, message: 'Ok' });
        } else {
            res.status(400).end();
        }
      },

      [`GET ${APIV1}/logout`] (req, res) {
        console.log("mock logout");
          res.clearCookie('token');
          res.status(200).end();
      },

      [`GET ${APIV1}/user`] (req, res) {
        console.log("mock get user");
        const cookie = req.headers.cookie || '';
        const cookies = qs.parse(cookie.replace(/\s/g, ''), { delimiter: ';' });
          const response = {};
          const user = {};
          if (!cookies.token) {
              res.status(200).send({ message: 'Not Login' });
              return;
          }
          const token = JSON.parse(cookies.token);
          console.log("mock user token=" + token);
          if (token) {
            response.success = token.deadline > new Date().getTime();
            console.log("mock user success=" + response.success);
          }
          if (response.success) {
            console.log("mock user id=" + token.id);
            const userItem = adminUsers.filter(_ => _.id === token.id);
            if (userItem.length > 0) {
              user.permissions = userItem[0].permissions;
              user.username = userItem[0].username;
              user.id = userItem[0].id;
            }
          }
          response.user = user;
          res.json(response);
      },
  }