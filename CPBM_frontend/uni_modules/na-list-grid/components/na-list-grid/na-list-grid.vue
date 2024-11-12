<template>
    <view class="text-tabs-content" >
        <view class="text-tabs-item"
              :class="props.column && `tabs-item-${props.column}`"
              :style="{marginBottom:props.cell?'':'10px',width:props.column>5?`${props.column}px`:''}"
              v-for="(item,index) in listArr" :key="index">
            <view :class="props.cell && 'text-tabs-cell'" @click="targetJump(item)">
                <view class="tabs-cell-content">
                    <view v-if="item.icon"><image class="tabs-cell-img" :style="props.iconStyles" :src="handleImgSrc(item.icon)"></image></view>
                    <view class="tabs-cell-title" v-if="item.text">{{item.text}}</view>
                    <view class="tabs-cell-detail" v-if="item.detail">{{item.detail}}</view>
                    <slot />
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import service from "../na-utils/service"
    import { ConvertKey } from "../na-utils/format"
    import {ref,onMounted,defineEmits, defineExpose } from "vue";
    const props = defineProps({
        imgHost:{
            type: String,
            default: ''
        },
        column: {//几列排布,支持1/2/3/4/5
            type: Number,
            default: 3,
        },
        iconStyles:{
            type: Object,
            default(){
                return {}
            }
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
        *   url:'icon',
        *   name:'text',
        *   path:'path'
        * }
        * 标准key--{
        *  icon:'',
        *  text:'',
        *  path:''
        * }
        * */
        initKey:{
            type: Object,
            default(){
                return {}
            }
        },
        cell:{
            type: Boolean,
            default: false
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

    const emits = defineEmits(['na-icon-text'])

    let listArr = ref()

    onMounted(()=>{
        if(props.url !=''){
            getIconTextList()
        }else{
            listArr.value = props.list;
            if(!(Object.keys(props.initKey).length==0)){
                let newList = ConvertKey(listArr.value,props.initKey);
                listArr.value = newList;
            }
        }
    })

    const getIconTextList = () =>{
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

    const handleImgSrc = (icon:string) =>{
        if(icon?.indexOf('http') !== -1 || icon?.indexOf('https') !== -1){
            return icon;
        }else{
            return `${props.imgHost}/${icon}`
        }
    }

    const targetJump = (item:any) =>{
        emits('na-icon-text',item);
        if(props.onJump){
            props.onJump(item)
        }
    }

    defineExpose({
        listArr,
        getIconTextList
    });

</script>

<style lang="scss" scoped>
    .text-tabs-content{
        width: 100%;
        overflow: hidden;
        .text-tabs-item{
            float: left;
            width: 50%;
            text-align: center;
            cursor: pointer;
            padding: 8px;
            font-size: 12px;
            box-sizing: border-box;
            .iconfont{
                font-size: 26px;
                color: #666666;
            }
            /*.text-tabs-img{*/
            /*    display: inline-block;*/
            /*    width: 30px;*/
            /*    height: 30px;*/
            /*    background-size: cover;*/
            /*    margin-bottom: 10px;*/
            /*    box-sizing: border-box;*/
            /*}*/
            /*.text-tabs-text{*/
            /*    color: #333333;*/
            /*    overflow : hidden;*/
            /*    text-overflow: ellipsis;*/
            /*    display: -webkit-box;*/
            /*    -webkit-line-clamp: 1; !* 限制在一个块元素显示的文本的行数 *!*/
            /*    -webkit-box-orient: vertical; !* 垂直排列 *!*/
            /*    word-break: break-all;  !* 内容自动换行 *!*/
            /*}*/
        }
        .tabs-item-1{
            width: 100%;
        }
        .tabs-item-2{
            width: 50%;
        }
        .tabs-item-3{
            width: 33.3%;
        }
        .tabs-item-4{
            width: 25%;
        }
        .tabs-item-5{
            width: 20%;
        }
        .tabs-item-100{
            width: 100px;
        }
    }
    .text-tabs-cell{
        background: #FFFFFF;
        padding: 20px 0;
        box-sizing: border-box;
    }
    .tabs-cell-content{
        width: 100%;
        padding:0 12px;
        box-sizing: border-box;
        .tabs-cell-img{
            display: block;
            background-size: cover;
        }
        .tabs-cell-title{
            width: 100%;
            text-align: left;
            font-size: 14px;
            font-weight: bolder;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 1;
            -webkit-box-orient: vertical;
        }
        .tabs-cell-detail{
            text-align: left;
            font-size: 12px;
            color: #333333;
            margin-top: 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            display: -webkit-box;
            -webkit-line-clamp: 2;
            -webkit-box-orient: vertical;
        }
        .tabs-cell-detail:hover{
            font-weight: normal;
        }
    }
</style>
