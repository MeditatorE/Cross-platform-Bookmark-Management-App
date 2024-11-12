/*
    * 重组数组key,
    * 标准key--{
    *  value:'',
    *  text:''
    * }
    * */
export const ConvertKey = (array: any, keyMap: any,childKey:any=null) =>{
    //自定义最外层数据的key值
    for (let i = 0; i < array.length; i++) {
        let obj = array[i];
        for (let key in obj) {
            let newKey = keyMap[key];
            if (newKey) {
                obj[newKey] = obj[key];
                delete obj[key];
            }
        }
        //自定义当前对象下的子级数组数据的key值
        if(array[i][childKey] && array[i][childKey]?.length>0){
            for(let j=0;j<array[i][childKey].length;j++){
                let objChild = array[i][childKey][j];
                for (let key1 in objChild) {
                    let newKey = keyMap.children[key1];
                    if (newKey) {
                        objChild[newKey] = objChild[key1];
                        delete objChild[key1];
                    }
                }
            }
        }
    }
    return array;
}


//对调对象的键和值
export const ConvertObj = (obj:any) =>{
    for (let k in obj) {
        let value = obj[k]; //将原来的value赋值给一个变量
        obj[value] = k; // 为obj赋新key，不能直接使用obj = {obj[k] : k},会报语法错误
        delete obj[k]; // 删除原来的属性
    }
    return obj
}
