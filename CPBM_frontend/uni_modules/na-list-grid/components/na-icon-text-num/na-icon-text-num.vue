<template>
    <view class="init-tabs-panel">
        <view class="tabs-panel-content"
              :class="props.column && `tabs-panel-${props.column}`"
              :style="{width:props.column>5?`${props.column}px`:''}"
              v-for="(item,index) in listArr" :key="index">
            <view class="panel-box tabs-panel-item"
                  :style="{background:props.colors[index]?.background,color:props.colors[index]?.color}"
                  @click="targetJump(item)">
                <view class="icon-text-content">
                    <view class="icon-text-item icon-text-item-l">
                        <i v-if="props.types == 'icon'" class="iconfont" :class="item.icon" :style="props.iconStyles"></i>
                        <image v-else class="icon-text-img" :style="props.iconStyles" :src="handleImgSrc(item.icon)"></image>
                    </view>
                    <view class="icon-text-item icon-text-item-r">
                        <view class="icon-text-title" :style="{color:props.colors[index]?.color}">{{item.text}}</view>
                        <view class="icon-text-number">{{item.num}}</view>
                    </view>
                </view>
            </view>
        </view>
    </view>
</template>

<script setup lang="ts">
    import service from "../na-utils/service"
    import { ConvertKey } from "../na-utils/format"
    import {ref, onMounted,defineEmits, defineExpose} from 'vue'
    const props = defineProps({
        types:{
            type: String,
            default: 'img'
        },
        imgHost:{
            type: String,
            default: ''
        },
        column: {//几列排布,支持1/2/3/4/5
            type: Number,
            default: 4,
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
        *   path:'path',
        *   value:'num'
        * }
        * 标准key--{
        *  icon:'',
        *  text:'',
        *  path:'',
        *  num:''
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
        colors:{//各个模块的背景色和文字色
            type: Array,
            default(){
                return [
                    {
                        background:'',
                        color:''
                    }
                ]
            }
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

    const emits = defineEmits(['na-icon-text-num'])

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
        emits('na-icon-text-num',item);
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
    .panel-box{
        width: 100%;
        padding: 20px;
        background: #FFFFFF;
        border-radius: 3px;
        box-sizing: border-box;
        box-shadow: 0 0 3px #eeeeee;
    }
    .init-tabs-panel{
        width: 100%;
        overflow: hidden;
        .tabs-panel-content{
            float: left;
            width: 25%;
            padding: 8px 8px;
            box-sizing: border-box;
        }
        .tabs-panel-1{
            width: 100%;
        }
        .tabs-panel-2{
            width: 50%;
        }
        .tabs-panel-3{
            width: 33.3%;
        }
        .tabs-panel-4{
            width: 25%;
        }
        .tabs-panel-5{
            width: 20%;
        }
    }
    .icon-text-content{
        width: 100%;
        display: flex;
        cursor: pointer;
        .icon-text-item{
            flex: 1;
            text-align: center;
            .icon-text-img{
                display: inline-block;
                width: 60px;
                height: 60px;
            }
            .img-mobile{
                width: 30px;
                height: 30px;
            }
            .icon-text-title{
                letter-spacing: 2px;
                font-size: 14px;
                color: #333333;
                margin-bottom: 10px;
            }
            .icon-text-number{
                font-size: 18px;
                font-weight: bolder;
            }
        }
        .icon-text-item-l{
            text-align: right;
            max-width: 70px;
        }
        .item-l-mobile{
            text-align: center;
            max-width: 40px;
            padding-top: 15px;
            box-sizing: border-box;
        }
    }
</style>
