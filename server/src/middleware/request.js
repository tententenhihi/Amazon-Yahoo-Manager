// const { retrieveToken, isValidToken } = require('../modules/auth/Service')

// module.exports = function(role) {
//     return function (req, res, next) {
//         try {
//             const token = retrieveToken(req.headers)
//             const tokenValid = isValidToken(token)
//             if (tokenValid) {
//                 if(role && tokenValid.role !== role) {
//                     throw new Error('Không có quyền')
//                 }
//                 req.jwtData = {
//                     sub: tokenValid.sub,
//                     email: tokenValid.email,
//                     role: tokenValid.role,
//                 }
//                 return next()
//             }
//             return res.status(403).send({ error: 'Từ chối truy cập' })
//         } catch (error) {
//             return res.status(403).send({ error: error.message || 'Từ chối truy cập' })
//         }
//     }
// }
