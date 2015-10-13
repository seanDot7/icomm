var toptree=[];
var lefttree=[];
var righttemp;
var temptree;
var temptree2;
var deadtime=10000;
var hrefTable=[];
var sex=["男","女"];
var Searchdate = new Date();
var Sundate = new Date();
var Mondate = new Date();
var Tuedate = new Date();
var Weddate = new Date();
var Thudate = new Date();
var Fridate = new Date();
var Satdate = new Date();
var weekstr=[];
var isFirst1=true;
var isFirst2=true;
var todayms=Sundate.getTime();
var temparea;
var temparea2;
var timeline;
var timeline2;
var min = new Date(); // 1 april
var max = new Date(2017,3,1); // 30 april
var container;
var options;
var gid=getUser().gero_id;
var uid=getUser().id;
var areavalue;
var areanamevalue;
var eldervalue;
var eldernamevalue;
var elderchoosename='';
var clevellist=['专护','1级','2级','3级'];
var levellistre=[];
levellistre['专护']=0;
levellistre['1级']=1;
levellistre['2级']=2;
levellistre['3级']=3;
Sundate.setTime(Sundate.getTime()-Sundate.getDay()*24*60*60*1000);
hrefTable['/gero/1/elder']='elder.drawElderList()';
hrefTable['/gero/1/staff']='staff.drawStaffList()';
hrefTable['/gero/1/schedule']='staff.drawScheduleList()';
hrefTable['/item']='item.drawItemList()';
hrefTable['/gero/1/care_item']='geroItem.drawGeroCareItemList()';
hrefTable['/gero/1/area_item']='geroItem.drawGeroAreaItemList()';
hrefTable['/gero/1/role']='role.drawGeroRoleList()';
hrefTable['/superp']='authority.drawAuthorityList()';
hrefTable['/gero/1/schedule']='arrange.drawArrangeList()';
hrefTable['/area']='area.drawAreaList()';
hrefTable['/eldercareduty']='eldercare.drawElderCareList()';
hrefTable['/areacareduty']='areacare.drawAreaCareList()';
hrefTable['/relative']='relative.drawRelativeList()';
hrefTable['/elder_care_item']='care_item.drawItemList()';
hrefTable['/orders']='orders.drawOrdersList()';
hrefTable['/orders/add']='orders.drawPaneOrderAdd()';


var getDatetimeByMsDatetime = function(originalTime) {
  // if (format === 'YY-MM-DD HH:mm:ss.S') {
  var arrTemp = originalTime.split(':');
  var ss = arrTemp[2].split('.');
  var ss = ss[0];
  return arrTemp[0] + ':' + arrTemp[1];
  // }
}


var leftTop = {
    removeLefttree:function (){
     $("#lefttree li").remove();
    },
    
    dealdata:function(msg){
    if(msg.status===200)
        {
            return msg.entities;
        }
    else{
        leftTop.dealerr(msg);
    }
    },
    dealerr:function(e){
        $.messager.show({
                title:'错误提示',
                msg:e.status+e.error,
                showType:'fade',
                style:{
                    right:'',
                    bottom:''
                }
            });
    },
    dealerror:function(XMLHttpRequest, textStatus, errorThrown){
        $.messager.show({
                title:'错误提示',
                msg:textStatus+XMLHttpRequest.status+errorThrown,
                showType:'fade',
                style:{
                    right:'',
                    bottom:''
                }
            });
    },

    findTreeChildrenEx:function(id){
        var result=[];
        for(var i in temptree){
            if(temptree[i].parent_id===id && temptree[i].href!=='no'){
                result.push(temptree[i]);
            }
        }
        return result;
    },
    findTreeChildren:function(id){
        var result=[];
        for(var i in temptree){
            if(temptree[i].parent_id===id){
                result.push(temptree[i]);
            }
        }
        return result;
    },

    createTreeNode:function(node){
        this.id=node.id;
        this.text=node.name;
        this.children=[];
        this.attributes={"href":node.href,"permission":node.permission,"notes":node.notes,'api':node.api}
        this.iconCls=node.icon;
    },

    createTreeData:function(node){
        var result=[];
        var childs= leftTop.findTreeChildrenEx(node.id);
        if (childs.length!==0){
            for(var i in childs){
                var temp= new leftTop.createTreeNode(childs[i]);
                if (leftTop.findTreeChildrenEx(childs[i].id).length!==0){
                    temp.children=leftTop.createTreeData(childs[i]);
                    result.push(temp);
                }
                else if(childs[i].href!=="")
                {
                    result.push(temp);
                }
            }
        }
        return result;
    },

    createTreeData2:function(node){
        var result=[];
        var childs= leftTop.findTreeChildren(node.id);
        if (childs.length!==0){
            for(var i in childs){
                var temp= new leftTop.createTreeNode(childs[i]);
                if (leftTop.findTreeChildren(childs[i].id).length!==0){
                    temp.children=leftTop.createTreeData2(childs[i]);
                }
                result.push(temp);
            }
        }
        return result;
    },

    dealtree:function(msg){
        toptree = leftTop.findTreeChildren(0);
        var k=-1;
        for(var i in toptree){
            // alert(toptree[i].href)
            // alert(toptree[i].name)
            if(toptree[i].href!=='no'){
                if(k==-1) {k=i;$("#topNavi").append('<li class="navli" ><a href="#">'+toptree[i].name+'<a></li>');}
                else $("#topNavi").append('<li class="navli-a" ><a href="#">'+toptree[i].name+'<a></li>');
            }
        }
        temptree2=[{"id":1,"text":"权限列表","children":[]}]
        temptree2[0].children=leftTop.createTreeData2(temptree2[0]);
        return leftTop.createTreeData(toptree[k]);
    },

    findTopNode:function(name){
        for(var i in toptree){
            if (toptree[i].name===name){
                return toptree[i];
            }
        }
    },

    findNode:function(id){
        for(var i in temptree){
            if (temptree[i].id===id){
                return temptree[i];
            }
        }
    }
};

//初始化运行所有js的地方
$(function(){
    $("#lefttree").tree({
        onClick:function(node){
            var url=leftTop.findNode(node.id).href;
            if (url!==""){              
                eval(hrefTable[url]);
            }
        }
    })
    $.ajax({
        type: "get",
        dataType: "json",
        contentType: "application/json;charset=utf-8",
        url:rhurl.origin+"/user/"+uid,
        timeout:deadtime,
        success: function (msg) {
            temptree=msg.entities[0].privilege_list;
            leftTop.removeLefttree;
            var str=leftTop.dealtree(temptree);
            $("#lefttree").tree("loadData",str);
            $("#welcome").text("欢迎 "+msg.entities[0].name+" 登录resthouse系统");
            $('#uusername').text(msg.entities[0].username);
            $('#uname').text(msg.entities[0].name);
        },
        error: function(XMLHttpRequest, textStatus, errorThrown) {
            leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
    });
    eldercare.init();
    areacare.init();
    $('#button-allow').toggleClass("fc-state-default1");
    elder.drawElderList();
    user.drawinfo();
    //上面两句是为了解决一个无可奈何的显示bug
});

$('.navli-a').live('click',function(){
    $('.navli').addClass('navli-a');
    $('.navli').removeClass('navli');
    $(this).addClass('navli');
    $(this).removeClass('navli-a');
    var str=leftTop.createTreeData(leftTop.findTopNode($(this).text()));
    $("#lefttree").tree("loadData",str);
});

$(".arrange-work").live('click',function(){
    if(arrange.allow){
        $(this).toggleClass("workday");
        if ($(this).hasClass("workday")){
            arrange.addsubres(parseInt($(this).attr("pid")),$(this).attr("num"));
        }else{
            arrange.delsubres(parseInt($(this).attr("pid")),$(this).attr("num"));
        }
    }
})
$('.fc-prev-button').live('click',function(){arrange.prev()});
$('.fc-next-button').live('click',function(){arrange.next()});
$('.fc-today-button').live('click',function(){arrange.today()});
$('.fc-allow-button').live('click',function(){arrange.allowchange()});
$('.fc-submit-button').live('click',function(){arrange.putarrange()});
$('#areacarercont li').live('click',function(){     
    areacare.getList(parseInt($(this).attr("pid")),$(this).text());
});
$('.form_time').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 1,
        minView: 0,
        maxView: 1,
        forceParse: 0
    });
$('.form_date').datetimepicker({
        language:  'zh-CN',
        weekStart: 1,
        todayBtn:  1,
        autoclose: 1,
        todayHighlight: 1,
        startView: 2,
        minView: 2,
        forceParse: 0
    });