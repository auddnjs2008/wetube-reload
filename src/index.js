import express from "express";
import logger from "morgan";
import globalRouter from './routers/globalRouter';
import videoRouter from './routers/videoRouter';
import userRouter from './routers/userRouter';

const PORT = 4000;
const app = express();



app.set('view engine',"pug");
app.set('views',process.cwd() + '/src/views');
app.use(logger('dev'));
app.use('/',globalRouter);
app.use('/videos',videoRouter);
app.use('/users',userRouter);


/** next함수를 호출하면 미들웨어의 개념이 된다. */
/** send를 보내게 되면 그건 미들웨어가 아니다.  */

/** 어느 url에도 작동하는 global middleware를 만들어준다. */




const handleListening = () => console.log(`Server listening on port http://localhost:${PORT}`);

app.listen(PORT, handleListening)
