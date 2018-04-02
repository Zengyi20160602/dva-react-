import dva from 'dva';
import { message } from 'antd';
import createLoading from 'dva-loading';
import createHistory from 'history/createBrowserHistory';
import 'babel-polyfill';
import './index.css';

 /* 1. Initialize 创建dva 实例 */
const app = dva({
  ...createLoading({
    effects: true,
  }),
  history: createHistory(),
  onError (error) {
    message.error(error.message)
  },
});
 /* 2. Plugins  装载插件 （可选） */
 //app.use(createLoading());

 /* 3. Model  注册Model */
 app.model(require('./models/app').default);

/* 4. Router  配置路由 */ 
app.router(require('./router').default);

 /* 5. Start  启动应用 */
 app.start('#root');
