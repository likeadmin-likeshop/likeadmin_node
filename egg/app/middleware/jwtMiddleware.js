// const EggMiddleware = require('egg-middleware');

// class JwtMiddleware extends EggMiddleware {
//     async process(req, res) {
//         const { ctx } = this;
//         const token = ctx.request.header['token'];

//         console.log('xxxxxxxx')

//         if (!token) {
//             return ctx.body = { message: 'Missing token', status: 401 };
//         }

//         try {
//             // const decoded = await ctx.app.jwt.verify(token);
//             // ctx.state.user = decoded;
//         } catch (error) {
//             return ctx.body = { message: 'Invalid token', status: 401 };
//         }

//         // 使用中间件
//         await this.app.use(ctx.request, ctx.response);
//     }
// }

// module.exports = JwtMiddleware;