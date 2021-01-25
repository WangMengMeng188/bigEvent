// ==========================获取用户信息======================
function getUserInfo(){
    axios.get('/my/userinfo',
    // {headers:{
    //         Authorization:localStorage.getItem('token')
    // }}
        ).then(res=>{
        // console.log(localStorage.getItem('token'));
        // console.log(res)
        if(res.data.status!==0){
            return layer.msg(`用户信息获取失败`)
        }
        avatar(res.data)
    })

    
}
getUserInfo()

//--------------------------------处理头像和昵称-----------------
function avatar(res){
    // console.log(1);
    let name =res.data.nickname || res.data.username
    // console.log(name);

    $('#welcome').text('欢迎'+name)
    
    if(res.data.user_pic){
        $('.layui-nav-img').attr('src',res.data.user_pic).show()
        $('.text_avatar').hide()
        // console.log(2);
    }else{
        $('.layui-nav-img').hide()
        //名字的这个字符串可以看做是个数组,然后用索引来获取它的第一个字母
        $('.text_avatar').text(name[0].toUpperCase()).show()
    }
    

}

//===================================退出===========================
$("#logoutBtn").on('click',function(){
    layer.confirm('确定退出吗?', {icon: 3, title:'提示'}, function(index){
        //do something
        // console.log('退出?');
        localStorage.removeItem("token")
        location.href='/home/login.html'
        layer.close(index);
      });
})