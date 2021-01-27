$(function(){
let form=layui.form

// 初始化富文本编辑器
initEditor()

  // 1. 初始化图片裁剪器
  let $image = $('#image')
  
  // 2. 裁剪选项
  let options = {
    aspectRatio: 400 / 280,
    preview: '.img-preview'
  }
  
  // 3. 初始化裁剪区域
  $image.cropper(options)



  //===================获取分类数据=============================
  axios.get("/my/article/cates").then(function(res){
    //   console.log(res);

      res.data.data.forEach(function(value) {
          $(`<option value="${value.Id}">${value.name}</option>`).appendTo($("#cateSelect"))
      });
      //刷新select选择框渲染
      form.render('select'); 
  })

  //===================================选择封面====================
  $("#chooseImg").click(function(){
      $("#file").click()
  })

  $("#file").on('change',function(){
      let file=this.files[0]
      console.log(file);

      if(!file){
          return
      }

      let  newImgURL = URL.createObjectURL(file)
      $image
        .cropper('destroy')      // 销毁旧的裁剪区域
        .attr('src', newImgURL)  // 重新设置图片路径
        .cropper(options)        // 重新初始化裁剪区域
  })

  //---------文章状态----------
  let state;
    $("#btn1").click(function(){
      state="已发布"
    })
    $("#btn2").click(function(){
      state="草稿"
    })


  //==============================发布文章========================
  $("form").on('submit',function(e){
      e.preventDefault()

      $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 400,
            height: 280
        })
        .toBlob(blob => {       // 将 Canvas 画布上的内容，转化为文件对象
            // 得到文件对象后，进行后续的操作
            let fd=new FormData(this)

            fd.append("cover_img",blob)
            fd.append("state",state)

            // fd.forEach((value,key)=>{
            //     console.log(value,key);
            // })

            pubArt(fd)
        })
  })

  //----------------------封装函数-------------------
  function pubArt(data){
      axios.post('/my/article/add',data).then(function(res){
          // console.log(res);
        
        if(res.data.status!==0){
            return layer.msg(res.data.message)
        }
        layer.msg(res.data.message)

        //跳转页面
        location.href='/article/art_list.html'
      })
  }

})  