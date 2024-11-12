NaDealtList组件配置说明
types：列表类型(类型字符串),可选值:news(消息)/dealt(待办),默认值为空
unread：types=news下的默认未读项(类型数值),-1:全部数据,默认值为-1
maxLen：初始最多显示几条数据(类型数值),-1:全部数据,默认值为-1
initDetail：是否自定义具体详情(类型为布尔值)，可选值：true/false，默认值为false(否)
initAction：是否自定义操作状态(类型为布尔值)，可选值：true/false，默认值为false(否)
list：初始默认数据json类型(类型为数组对象),默认格式为:[{id:'',title:'',path:'',date:'',status:'',detail:'',user:''}]
 ——id:唯一编号(必须)；title:标题(必须)；path:点击跳转地址；date:日期；status:状态；detail:详情；user:用户
initKey：内容自定义转换的数据格式(类型为对象),
  如:{listId:'id',listTitle:'title',listPath:'path',listDate:'date',listStatus:'status',detail:'',user:''}
jump：是否开启点击跳转(类型为布尔值)，可选值：true/false，默认值为true(开启)
url：初始获取数据请求地址(类型为字符串),值存在时默认请求后端数据覆盖list
way：初始获取数据请求方式(类型为字符串),默认值为post
args：初始获取数据请求参数(类型为对象)
onSuccess：数据请求成功的回调函数，回传数据数组对象集合
onFail：数据请求失败的回调函数，回传异常信息
onJump：点击跳转时的回调函数，回传当前项对象数据

数据集合案例如下：
list:[ { id:'1', title:'张三的休假申请', date:'2022-12-20', user:'申请人：刘小燕', status:'待审批', detail:'内容详情', path:''},
        { id:'2', title:'财务共享系统用户操作手册', date:'', user:'', status:'', detail:'', path:''}]

调用组件传参方式参考如下：
常规调用时——
<na-dealt-list :list="list" :types="'news'" :unread="-1" :maxLen="3" :onJump="jumpNaDealtList"></na-dealt-list>
<na-dealt-list :url="url" :args="args" :onSuccess="getNaDealtListSuccess" :onFail="getNaDealtListFail">
    <template v-slot:detail="lItem"><view>这是自定义详情{{lItem.listItem}}</view></template>
    <template v-slot:action="lItem"><view>自定义操作{{lItem.listItem}}</view></template>
</na-dealt-list>    
父组件获取子组件数据，调用函数如下：
const jumpNaDealtList = (data) =>{}
const getNaDealtListSuccess = (data) =>{}
const getNaDealtListFail = (data) =>{}
     
##################################################################
   
