$(function () {
    // 去注册账号
    $("#gotoRegi").click(function () {
      // 显示注册界面
      $(".regiBox").show();
      // 隐藏登录界面
      $(".loginBox").hide();
    });
  
    // 去登录
    $("#gotoLogin").click(function () {
      // 隐藏注册界面
      $(".regiBox").hide();
      // 显示登录界面
      $(".loginBox").show();
    })

    //提示框
    let form=layui.form
    form.verify({
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
          ],
        pwd:function(value,item){
            //value是输入框的值,iten是输入框的html结构
            // console.log(value);
            let count=$(".regiBox [name=password]").val()
            if(value!==count){
                return '两次密码不一致'
            }
        }
    })
})

//-----------------------------------------注册------------------------

$(".regiBox form").on("submit",function(e){
    e.preventDefault()
    let data =$(this).serialize()

    axios.post('/api/reguser',data).then(function(res){
        // console.log(res);
        if(res.data.status!==0){
            layer.msg(res.data.message)
        }
        layer.msg(res.data.message)
        $("#gotoLogin").click()
    })
     
})

//-----------------------------------------登录--------------------------------------
$(".loginBox form").on("submit",function(e){
    e.preventDefault()
    let data =$(this).serialize()

    axios.post('/api/login',data).then(function(res){
        // console.log(res);
        if(res.data.status!==0){
            layer.msg(res.data.message)
        }
        layer.msg("登录成功，即将跳转去首页！", function () {
            // 关闭后 do something
            // 跳转页面
            location.href = "/home/index.html";
            localStorage.setItem('token',res.data.token)
        });
        
    })
     
})
