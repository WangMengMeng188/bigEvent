$(function(){
    //================== 实现文件的裁剪=================
    // 1.1 获取裁剪区域的 DOM 元素
    let $image = $('#image')
    // 1.2 配置选项
    const options = {
        // 纵横比(长宽比)
        aspectRatio: 1,
        // 指定预览区域
        preview: '.img-preview'
    }
 
    // 1.3 创建裁剪区域
    $image.cropper(options)

    //==================选择上传图片====================
    $("#chooseBtn").on('click',function(){
        $("#file").click()
    })

    //==================图片选中后展示到页面=================
    $("#file").on('change',function(){
        //拿到图片
        let file=this.files[0]

        //如果用户没有选择图片的话
        if(!file){
            return
        }

        //图片展示到裁剪区域(预览区和裁剪大小跟着改变)
        let newImgURL = URL.createObjectURL(file)

        $image
            .cropper('destroy')      // 销毁旧的裁剪区域
            .attr('src', newImgURL)  // 重新设置图片路径
            .cropper(options)        // 重新初始化裁剪区域

        
    })

    //==================实现上传头像================
    $("#sureBtn").on('click',function(){
        let dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串


        axios.post('/my/update/avatar',"avatar="+encodeURIComponent(dataURL) ).then(function(res){
            // console.log(res);
            if(res.data.status!==0){
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)

            //---------页面头像发生变化---------
            window.parent.getUserInfo()
        })
    })
})