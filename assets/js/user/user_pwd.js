$(function(){
    let form=layui.form

    //=========================校验规则===================
    form.verify({

        pass: [/^[\S]{6,12}$/,'密码必须6到12位，且不能出现空格'],

        //-------------新密码校验-----------
        newPwd:function(value){
            let oldPwd= $('[name=oldPwd').val()
            // console.log(oldPwd,value);
            if(oldPwd===value){
                return '新旧密码不能相同'
            }
        },
        //-------------确认密码校验-----------
        reNewPwd:function(value){
            let newPwd= $('[name=newPwd').val()
            // console.log(newPwd,value);
            if(newPwd!==value){
                return '两次输入的密码不一致'
            }
        }

    })

   //=========================实现修改-发送ajax请求==========================
   $("#form").on('submit',function(e){
    e.preventDefault()
    let data= $(this).serialize()
    // console.log(data);
    axios.post('/my/updatepwd',data).then(function(res){
        // console.log(res);
        if(res.data.status !==0){
            return layer.msg(res.data.message)
        }
        layer.msg(res.data.message)

        //表单重置
        $('#form')[0].reset()
    })
   })
})