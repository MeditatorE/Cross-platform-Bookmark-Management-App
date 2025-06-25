<template>
    <view class="dealt-list" v-if="listArr?.length>0">
        <block v-for="(item,index) in listArr" :key="index">
            <view class="dealt-content"  v-if="index<listLen">
                <view class="dealt-item dealt-item-l" @click="doJumpList(item)">
                    <view class="dealt-item-title ellipsis-title">
                        <text class="news-status" v-if="props.types=='news'" :class="index>newsLen-1?'status-gray':''"></text>{{item.title}}
                    </view>
                    <slot v-if="props.initDetail" name="detail" :list-item="item" />
                    <view v-else>
                        <view class="dealt-item-detail" v-if="item.detail">{{item.detail}}</view>
                        <view v-if="props.types=='dealt'">
                            <text class="dealt-item-text dealt-item-time">{{item.date}}</text>
                            <text class="dealt-item-text dealt-item-user">{{item.user}}</text>
                        </view>
                    </view>
                </view>
                <view class="dealt-item dealt-item-r">
                    <slot v-if="props.initAction" name="action" :list-item="item" />
                    <text v-else class="dealt-item-status" v-if="item.date || item.status">{{ props.types=='news'?item.date:item.status}}</text>
                </view>
            </view>
        </block>
    </view>
</template>

<script setup lang="ts">
    import service from "../na-utils/service"
    import { ConvertKey } from "../na-utils/format"
    import {ref, onMounted, defineEmits, defineExpose} from "vue";
    const props = defineProps({
        types:{//news:消息,dealt:待办
            type:String,
            default:''
        },
        unread:{//types=news下的默认未读项,-1:全部数据
            type:Number,
            default:-1
        },
        maxLen:{//初始最多显示几条数据,-1:全部数据
            type:Number,
            default:-1
        },
        initDetail:{
            type:Boolean,
            default:false
        },
        initAction:{
            type:Boolean,
            default:false
        },
        list:{
            type: Array,
            default(){
                return []
            }
        },
        /*
        * 重组的key格式，如
        * {
        *   listId:'id',
        *   listTitle:'title',
        *   listPath:'path',
        *   listDate:'date',
        *   listStatus:'status',
        *   listDetail:'detail',
        *   listUser:'user'
        * }
        * 标准key--{
        *  id:'',
        *  title:'',
        *  path:'',
        *  date:'',
        *  status:'',
        *  detail:'',
        *  user:''
        * }
        * */
        initKey:{
            type: Object,
            default(){
                return {}
            }
        },
        jump:{//是否点击跳转
            type: Boolean,
            default: true
        },
        url:{
            type: String,
            default: ''
        },
        way:{
            type: String,
            default: 'post'
        },
        args:{
            type: Object,
            default(){
                return {}
            }
        },
        onSuccess:{
            type: Function,
            default() {
                return Promise.resolve()
            }
        },
        onFail:{
            type: Function,
            default() {
                return Promise.resolve()
            }
        },
        onJump:{
            type: Function,
            default() {
                return Promise.resolve()
            }
        }
    })

    const emits = defineEmits(['na-dealt-list'])

    let listArr = ref()
    let listLen = ref()
    let newsLen = ref()

    onMounted(()=>{
        if(props.url !=''){
            getNaDealtList()
        }else{
            listArr.value = props.list;
            if(!(Object.keys(props.initKey).length==0)){
                let newList = ConvertKey(listArr.value,props.initKey);
                listArr.value = newList;
            }
        }
        if(props.maxLen<0){
            listLen.value = listArr.value.length;
        }else{
            listLen.value = props.maxLen;
        }
        if(props.unread<0){
            newsLen.value = listArr.value.length;
        }else{
            newsLen.value = props.unread;
        }
    })

    const getNaDealtList = () =>{
        service({
            url:props.url,
            method:props.way,
            data:props.args,
        }).then((res:any)=>{
            if(res?.length>0){
                listArr.value = res;
                if(!(Object.keys(props.initKey).length==0)){
                    let newList = ConvertKey(res,props.initKey);
                    listArr.value = newList;
                }
            }
            if(props.onSuccess){
                props.onSuccess(res)
            }
        }).catch((err:any)=>{
            if(props.onFail){
                props.onFail(err)
            }
        })
    }

    const doJumpList = (item:any) =>{
        emits('na-dealt-list',item);
        if(props.onJump){
            props.onJump(item)
        }
    }

    defineExpose({
        listArr,
        getNaDealtList
    });

</script>

<style lang="scss" scoped>
    .dealt-list{
        width: 100%;
        .dealt-content{
            width: 100%;
            display: flex;
            margin: 10px 0;
            box-sizing: border-box;
            cursor: pointer;
            .dealt-item{
                flex: 1;
            }
            .dealt-item-r{
                max-width: 100px;
                text-align: right;
            }
            .dealt-item-title{
                width: 100%;
                font-size: 13px;
                color: #333333;
            }
            .dealt-item-detail{
                font-size: 12px;
                color: #666666;
                padding: 3px 0;
                box-sizing: border-box;
                word-break: break-all;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 2;
                overflow: hidden;
            }
            .dealt-item-text{
                display: inline-block;
                font-size: 12px;
                color: #666666;
                margin-right: 10px;
            }
            .dealt-item-status{
                display: inline-block;
                font-size: 13px;
                color: #444444;
            }
        }
        .dealt-content:hover{
            .dealt-item-title,.dealt-item-status{
                font-weight: bold;
            }
        }
        .ellipsis-title{
            width: 100%;
            overflow:hidden;
            text-overflow:ellipsis;
            white-space: normal;
            display:-webkit-box;
            -webkit-box-orient:vertical;
            -webkit-line-clamp:1;
        }
        .news-status{
            display: inline-block;
            width: 6px;
            height: 6px;
            background: red;
            border-radius: 50%;
            margin-right: 5px;
            vertical-align: top;
        }
        .status-gray{
            background: #eeeeee;
        }
    }
</style>
