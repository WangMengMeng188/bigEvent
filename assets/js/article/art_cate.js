let form=layui.form
// =====================================获取数据=====================================
function getArtCate(){
    axios.get('/my/article/cates').then(function(res){
    // console.log(res);

    let htmlStr=template("trTpl",res.data)
    $('tbody').html(htmlStr)
})
}
getArtCate()


// =====================================添加分类=====================================
//存储弹出层的索引,便于后面关闭弹出层
let index;

$("#addBtn").on('click',function(){
    //拿到的index是一个重要的凭据，它是诸如layer.close(index)等方法的必传参数。   
    index = layer.open({
        type:1,//页面层,没有确定和取消按钮
        title:'添加分类信息',
        content: $('#addFormTpl').html(),//内容,可是识别html标签
        area: '500px'//确定宽度,要定义宽高的话,写数组area: ['500px', '300px']
      });
})

// 注意这里的form是动态添加的,随着弹出层的出现而出现,所以需要使用事件委托(函数递归)
//父元素结构复杂,但确实存在body中可考虑用body
$('body').on('submit','#addForm',function(e){
    e.preventDefault()
    // console.log(1);

    let data=$(this).serialize()
    // console.log(data);

    axios.post('/my/article/addcates',data).then(function(res){
        console.log(res);
        if(res.data.status!==0){
            return layer.msg(res.data.message)
        }
        layer.msg(res.data.message)
        //关闭添加分类的弹出层
        layer.close(index)
        //重新发送ajax,获取分类数据
        getArtCate()
    })
})


// ===============================编辑分类=========================
//编辑按钮在tr中,tr又在tbody中
let editIndex;
$("tbody").on("click",".editBtn",function(){
    // console.log(2);

    let id=$(this).attr("data-id")
    // console.log(id);

    editIndex = layer.open({
        type:1,//页面层,没有确定和取消按钮
        title:'编辑分类信息',
        content: $('#editFormTpl').html(),//内容,可是识别html标签
        area: '500px'//确定宽度,要定义宽高的话,写数组area: ['500px', '300px']
      });


    axios.get("/my/article/cates/"+id).then(function(res){
        // console.log(res);
        
        form.val("editForm",res.data.data)
    })
})

$("body").on('submit','#editForm',function(e){
    e.preventDefault()

    let data =$(this).serialize()

    axios.post('/my/article/updatecate',data).then(function(res){
        // console.log(res);

        if(res.data.status!==0){
            return layer.msg(res.data.message)
        }
        layer.msg(res.data.message)

        layer.close(editIndex)

        getArtCate()
    })
})


//===============================删除分类====================
$("tbody").on("click",".delBtn",function(){

    let id=$(this).attr('data-id')
    // console.log(id);

    layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
        //do something
        
        axios.get('/my/article/deletecate/'+id).then(function(res){
            // console.log(res);

            if(res.data.status!==0){
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)

            layer.close(index);

            getArtCate()
        })

    });

})