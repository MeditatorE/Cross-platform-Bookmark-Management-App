NaIconTextNum组件配置说明
types：图标类型(类型为字符串),可选值:img(图片)/icon(字体图标),默认值为:img
imgHost：图片域名(类型为字符串),types=img时且图片地址不含http/https前缀下生效
column：几列排布(类型为数组),可选值:1/2/3/4/5,默认值为:3；当值大于5时为实际宽度,单位px
iconStyles：图标样式(类型为对象),如:{width:'30px',height:'30px'}
list：初始默认数据json类型(类型为数组对象),默认格式为:[{icon:'',text:'',path:'',num:'''}]
 ——icon:图片路径；text:文字说明；path:点击跳转地址
initKey：内容自定义转换的数据格式(类型为对象),如:{url:'icon',name:'text',path:'route',num:'value'}
cell：是否为宫格模式(类型为布尔值)，可选值：true/false，默认值为false(非宫格)
jump：是否开启点击跳转(类型为布尔值)，可选值：true/false，默认值为true(开启)
colors：配置各个模块的背景色和文字色(类型为对象数组),如:[{background:'',color:''}]
url：初始获取数据请求地址(类型为字符串),值存在时默认请求后端数据覆盖list
way：初始获取数据请求方式(类型为字符串),默认值为post
args：初始获取数据请求参数(类型为对象)
onSuccess：数据请求成功的回调函数，回传数据数组对象集合
onFail：数据请求失败的回调函数，回传异常信息

数据集合案例如下：
list:[ { icon:'group1/M00/00/D3/rBQUjGJXl3aAQkybAAAR3wzrmLs672.png', text:'待办事项',path:'pages/admin/role/index',num:10 },
       { icon:'group1/M00/00/D6/rBQUjGJnuCCAA2jfAAAS_22ixnA879.png', text:'申请事项', path:'pages/admin/apps/index',num:5 }
]

调用组件传参方式参考如下：
常规调用时——
<na-icon-text-num :list="list" :types="'img'" :imgHost="imgHost"></na-icon-text-num>
<na-icon-text-num :url="url" :args="args" :onSuccess="getNaIconTextNumSuccess" :onFail="getNaIconTextNumFail"></na-icon-text-num>
         
父组件获取子组件数据，调用函数如下：
const getNaIconTextNumSuccess = (data) =>{}
const getNaIconTextNumFail = (data) =>{}
     
##################################################################
   