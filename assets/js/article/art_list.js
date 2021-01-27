$(function(){
    let form=layui.form
    let laypage = layui.laypage;
    
    //查询参数
    const query={
        pagenum:1,	//页码值
        pagesize:5,	//每页显示多少条数据
        cate_id:"",	//否文章分类的 Id
        state:""	//文章的状态，""表示所有状态,可选值有：已发布、草稿
    }

    //-----------------处理时间----------------
    const zero = (n) => (n < 10 ? "0" + n : n);

    template.defaults.imports.formatTime=function(time){
        let d =new Date(time)

        let year=d.getFullYear()
        let month=zero(d.getMonth()+1)
        let day= zero(d.getDate())

        let h = zero(d.getHours())
        let m= zero(d.getMinutes())
        let s= zero(d.getSeconds())

        return `${year}/${month}/${day}  ${h}:${m}:${s}`
    }

    function getList(){
        axios.get('/my/article/list',{params:query}).then(function(res){
            // console.log(res);
    
            let htmlStr=template('formTpl',res.data)
            $('#tb').html(htmlStr)

            //-----------处理分页----------
            renderPage(res.data.total)
        })
    }
    getList()


    //==================获取分类数据================
    axios.get('/my/article/cates').then(function(res){
        // console.log(res);

        res.data.data.forEach(function(value) {
            $(`<option value="${value.Id}">${value.name}</option>`).appendTo($("#cateSelect"))
        });

        //更新表单全部内容
        form.render(); 
    })

    

    //========================筛选=====================
    $("#form").on('submit',function(e){
        e.preventDefault()
        // console.log(1);

        //发送请求前,需要修改查询参数里面的cate_id和state的值
        query.state=$("#stateSelect").val()
        query.cate_id=$("#cateSelect").val()

        //发送请求
        getList()
    })

    //========================删除===================
    $("#tb").on('click',".delBtn",function(){
        // console.log(1);
        
        let id=$(this).attr('data-id')
        layer.confirm('确定删除?', {icon: 3, title:'提示'}, function(index){
            //do something
            if($('.delBtn').length===1){
                // if(query.pagenum===1){
                //     query.pagenum=1
                // }else{
                //     query.pagenum=query.pagenum-1
                // }
                //简化:
                query.pagenum=query.pagenum===1?1:query.pagenum-1
            }
            // console.log(id);
            //点击确认后,发送请求,重新渲染列表
            axios.get('/my/article/delete/'+id).then(function(res){
                // console.log(res);
                if(res.data.status!==0){
                    return layer.msg(res.data.message)
                }
                layer.msg(res.data.message)
                getList()
            })

            layer.close(index);
          });
    })


    //========================编辑==================
    $("#tb").on('click',".editBtn",function(){
        // console.log(2);
        location.href="/article/art_pub.html"
    })


    //-------------------分页处理函数---------------
    function renderPage(total){
        // console.log(total);

        //执行一个laypage实例
        laypage.render({
            elem: 'pageBox', //注意，这里的 test1 是 ID，不用加 # 号
            count: total, //数据总数，从服务端得到
            curr:query.pagenum,//起始页
            limit:query.pagesize,//每页条数
            limits:[2,4,5,10],//每页条数的选择项
            layout:["count","limit",'prev', 'page', 'next',"skip"],//自定义排版
            jump: function(obj, first){
                //obj包含了当前分页的所有参数，比如：
                // console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
                // console.log(obj.limit); //得到每页显示的条数
                //jump回调函数触发时机:
                //1.laypage.render初始化渲染分页的时候  first的结果是true
                //2.点击分页进行切换的时候  first结果是undefined

                //加载所点击的分页的数据,然后发送请求
                query.pagenum=obj.curr
                query.pagesize=obj.limit
                
                //首次不执行
                //first====>是不是第一页
                if(!first){
                  //点击分页才会执行
                  getList()
                }
               
            }
        });
    }
})