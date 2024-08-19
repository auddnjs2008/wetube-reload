import express from "express";
import logger from "morgan";
import rootRouter from './routers/rootRouter';
import videoRouter from './routers/videoRouter';
import userRouter from './routers/userRouter';
import session from 'express-session';
import MongoStore from 'connect-mongo';
import { localsMiddleware } from './middleware';

const app = express();


app.set('view engine',"pug");
app.set('views',process.cwd() + '/src/views');
app.use(logger('dev'));
/**express application이 form의 value들을 이해할 수 있고 우리가 쓸 수 있는
 * 자바스크립트 형식으로 바꿔준다.
 */
app.use(express.urlencoded({extended:true}));
app.use(session({
    secret:process.env.COOKIE_SECRET,
    resave:false,
    saveUninitialized:false,
    store:MongoStore.create({mongoUrl:process.env.DB_URL})
}))

// app.use((req, res, next) => {
//     req.sessionStore.all((error, sessions) => {
//       console.log(sessions);
//       next();
//     });
//   });

app.use(localsMiddleware);
app.use('/uploads', express.static('uploads'));
app.use('/',rootRouter);
app.use('/videos',videoRouter);
app.use('/users',userRouter);


/** next함수를 호출하면 미들웨어의 개념이 된다. */
/** send를 보내게 되면 그건 미들웨어가 아니다.  */

/** 어느 url에도 작동하는 global middleware를 만들어준다. */


export default app;
