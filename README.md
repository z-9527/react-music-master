github地址：[基于React的音乐播放器](https://github.com/zhangZhiHao1996/react-music-master)  
预览地址：
接口地址：[网易云音乐 API](https://github.com/Binaryify/NeteaseCloudMusicApi)
<hr/>

### 技术栈
 - react 
 - react-router
 - mobx
 - fetch
 - antd-mobile
 - better-scroll
 - ES6
 - less

项目由`create-react-app`脚手架搭建，并用`react-app-rewired`进行扩展了配置（`react-app-rewired`高版本的配置方法会改变，所以我用的是`react-app-rewired@2.0.2-next.0`）

<br/>

### 项目截图
<table>
	 <tr>
        <td><img src='https://img-blog.csdnimg.cn/20190308124144379.gif'></img></td>
        <td><img src='https://img-blog.csdnimg.cn/20190308124247852.gif'></img></td>
        <td><img src='https://img-blog.csdnimg.cn/20190308134737187.gif'></img></td>
         <td><img src='https://img-blog.csdnimg.cn/20190308134901875.gif'></img></td>
    </tr>
</table>
<table>
	 <tr>
        <td><img src='https://img-blog.csdnimg.cn/2019030813592034.png'></img></td>
        <td><img src='https://img-blog.csdnimg.cn/20190308140452717.gif'></img></td>
        <td><img src='https://img-blog.csdnimg.cn/20190308141114131.gif'></img></td>
        <td><img src='https://img-blog.csdnimg.cn/20190308140526928.gif'></img></td>
    </tr>
</table>

`注：点击图片可放大;gif图可能有些失帧`
<br/>


### 实现的功能
- [x] 歌单页、推荐页、歌手页、排行榜
- [x] 搜索功能
- [x] 播放器（前进、后退、暂停、播放、喜欢）
- [x] 歌词功能
- [x] 视频播放功能
- [x] 上拉加载更多功能
 ...
<br/>

### 目录结构（src）

```javascript
├── assets                                     # 资源文件，包括icon、less公共文件                     
├── components                                 # 自定义组件
├── home                                       # 首页、包括侧边栏和主页面
├── pages                                      # 路由跳转的页面
├── store                                      # 全局store
├── utils                                      # 工具函数                          
```

<br/>

### 问题
**暂未实现的功能：**
 - 路由的过渡效果（本来想用react-transition-group，但没能成功）
 - 路由组件缓存（路由后退时，会重新请求页面，滚动条的位置没有保存，页面刷新）  
 - 图片懒加载（没有实现图片懒加载）

上面的功能在react中实现或许有点麻烦，但是在vue中都可以很好的实现，比如vue自带了过渡组件，路由keep-alive，和 vue-lazyload 。

`react-transition-group`动画效果没有vue的过渡组件方便。vue在组件的显示和隐藏是自动添加类名，而`react-transition-group`需要自己控制组件的状态

第一次用了less，和css其实区别不大。主要是用了less的嵌套（真的很方便），样式的层级更清楚，避免了重复去写父级标签。

通过插件`react-app-rewire-less-modules`来实现less模块化（一个大坑），开发没问题，最后打包时失败，一直不知道原因，切换了node版本、脚手架版本、react-app-rewired版本都没用，打包还是失败，最后没办将别人使用过react-app-rewire-less-modules并打包成功的项目的packjson拷贝，还是有问题，只能将自己的项目复制到别人的项目中进行打包。
![在这里插入图片描述](https://img-blog.csdnimg.cn/20190308112858285.png?x-oss-process=image/watermark,type_ZmFuZ3poZW5naGVpdGk,shadow_10,text_aHR0cHM6Ly9ibG9nLmNzZG4ubmV0L3FxXzM3ODYwOTMw,size_16,color_FFFFFF,t_70)
<br/>



<br/>


### 总结

以前用vue写过[音乐播放器](https://github.com/zhangZhiHao1996/vue-music-master)，vue实现了很多功能如v-for就可以遍历数组生成标签，watch、计算属性、样式模块化等等。react没有那些功能，组件只有props、state，所有功能都是靠自己去实现，虽然写的多一点，但是写法更统一，js搞定即可。

这个项目其实不难，功能稍微复杂的就是播放器，状态管理使用的是mobx，原本想用redux（边学边用），但是觉得redux没必要，redux编写了过多的模板代码，这对于大型项目有很好的可维护性，但是对于这个项目可能有点不合适，最后还是选择了mobx（mobx很简单，30分钟上手）。

对于数组和对象的操作基本使用的是ES6提供的新方法，简单强大，另外对于引用类型的赋值一定要注意，地址赋值后改变一个会影响另一个，所以一般都是深拷贝对象来赋值。

项目有点遗憾的就是没有使用过渡效果，路由的过渡，组件的过渡。vue通过v-show或者v-if切换组件的显示和隐藏过渡组件自动添加类名，但是react没有这些标签指令，我只能通过display或者js判断来实现组件的显示和隐藏，而`react-transition-group`是根据in来实现组件状态的改变，当组件离开时动画效果还没完成display就变成了none，导致离开的动画没有。

因为此项目需要后台提供API，所以我购买了阿里云ESC，搭建LNMP、node环境部署了项目（都是傻瓜式命令），其中遇见过一些问题，最后都一一解决了，主要是了解了一点前后端的流程
