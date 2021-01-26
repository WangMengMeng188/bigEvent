$(function(){
    let form=layui.form
    // =======================发送ajax请求,获取用户信息============================
    function getUserInfo(){
        axios.get('/my/userinfo').then(res=>{
            // console.log(res);
    
            //给表单赋值
            //form 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
            form.val("form",res.data.data);
            // console.log(res.data.data);
        })
    }
    getUserInfo()


    // ======================= 表单校验 ============================
    form.verify({
        nickname:function(value){
            // console.log(value);
            if(value.length>6){
                return `名称字符需要控制在1-6个字符`
            }
        }
    })


    // ======================= 修改用户信息 ============================
    $('#form').on('submit',function(e){
        e.preventDefault()

        //此时data数据还是缺少id数据的(id是后端要求的参数之一)
       let data = $(this).serialize()

        // console.log(data);

       axios.post('/my/userinfo',data).then(function(res){
        //    console.log (res);
        if(res.data.status !==0){
            return layer.msg('修改信息失败!')
        }
        layer.msg('修改信息成功!')

        //子页面无法获取.修改父页面的内容.因此,这里需要使用特殊的方法-----------window.parent
        window.parent.getUserInfo()
       }) 
    })


    // ======================= 重置 ============================
    $("#resetBtn").click(function(e){
        e.preventDefault()

        //再次发送ajax请求,获取信息后重新填充到表单中
        getUserInfo()
    })

})