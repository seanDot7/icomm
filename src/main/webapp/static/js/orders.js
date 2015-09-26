var orders = {
  method: '',
  flag: false, // TODO
  eid: '',
  uid: '',
  temparea: [],
  areatemp: [],
  // 订单状态常量，order_status对应的解释
  orderStatus: {
    1: '未处理',
    2: '已派单',
    3: '已确认',
    4: '完成未评价',
    5: '完成已评价',
    6: '订单关闭',
  },
  orderStatusLength: 6,
  getOrderStatusNameByStatusId: function(id) {
    if (id in orders.orderStatus)
      return orders.orderStatus[id];
    else
      return '---';
  },
  drawOrdersList: function() {
    $('.inf').addClass('hide');
    $('#orders_show').removeClass('hide');
    var dateNow = new Date();
    var strNow = (dateNow.getMonth()+1) + '/' + dateNow.getDate() + '/' + dateNow.getFullYear() + ' ' + dateNow.getHours() + ':' + dateNow.getMinutes() + ':' + dateNow.getSeconds();
    $('#orders_search_time').datetimebox('setValue', strNow); 

    // 社区选项绘制
    $.ajax({
      url: rhurl.origin+'/gero',
      data: {page: 1, rows: 65535, sort: 'ID'},
      type: 'GET',
      timeout: deadtime,
      success:function(data){
        var entities = leftTop.dealdata(data);

        var selectCommunity = $('#orders_search_community');
        selectCommunity.find('option').remove();
        selectCommunity.append('<option value=""></option>');
        for (var i=0; i<entities.length; ++i) {
          var community = entities[i];
          selectCommunity.append('<option value="' + community.id + '">' + community.name + '</option>');
        }
      },
      error:function(XMLHttpRequest, textStatus, errorThrown){
          leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
      }
    });

    // 订单状态绘制
    var selectOrdersStatus = $('#orders_search_status');
    selectOrdersStatus.find('option').remove();
    selectOrdersStatus.append('<option value=""></option>');
    for (var i=1; i<=orders.orderStatusLength; ++i) {
      selectOrdersStatus.append('<option value="' + i + '">' + orders.orderStatus[i] + '</option>');
    }

    $('#orders_page').datagrid({ 
      title: '订单信息列表', 
      iconCls: 'icon-edit',//图标 
      fit: true,//自动大小 
      nowrap: false, 
      loadMsg: "正在加载，请稍等...", 
      striped: true, 
      border: true, 
      collapsible: false,//是否可折叠的 
      url: rhurl.origin+'/orders',  
      method: 'get',
      remoteSort: true,  
      sortName: 'ID',
      singleSelect: true,//是否单选 
      pagination: true,//分页控件 
      rownumbers: true,//行号
      pageNumber: 1,
      pagePosition: 'bottom',
      pageSize: 35,//每页显示的记录条数，默认为20 
      pageList: [20,35,50],//可以设置每页记录条数的列表 
      loadFilter: function(data){
        var result = {"total":0,"rows":0};
        leftTop.dealdata(data);
        result.total = data.total;
        result.rows = data.entities;
          for (var i in result.rows) {
              // 增加操作一栏的链接
              result.rows[i].operation = '<a href="" onclick="order.onOrdersDblClickRow()">操作</a>';
              result.rows[i].order_status_name = orders.getOrderStatusNameByStatusId(result.rows[i].order_status);
          }
        return result;
      },
      toolbar: [{text: '添加', iconCls: 'icon-add', 
          handler: function() { 
            // TODO
            // orders.addOrder();
          } 
      }, '-',{text: '删除', iconCls: 'icon-remove', 
          handler: function(){ 
            // TODO
            // elder.delElderInfo(); 
          }
      },'-',{text: '查看项目', iconCls: 'icon-search', 
          handler: function(){ 
            // TODO
            // elder.searchitem(); 
          }
      }]
    }); 
    var pager = $('#orders_page').datagrid('getPager'); // get the pager of datagrid
    pager.pagination({
      displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录', 
    });

  },

  drawOrderInfoDialog: function(data){
      var communityId = data.community_id;
      var elderName = data.elder_name;
      var elderId = data.elder_id;
      var elderPhoneNumber = data.phone_no;
      var orderTime = getDatetimeByMsDatetime(data.order_time);
      var orderStatusId = data.order_status;
      var orderStatusName = data.order_status_name;
      var address = data.address;
      var detail = data.item_detail;
      var orderId = data.order_id;

      // console.log(orderId);
      $('#order_dialog_username').val(elderName);
      $('#order_dialog_username').data('elderId', elderId);
      $('#order_dialog_phone_number').val(elderPhoneNumber);
      $('#order_dialog_order_time').val(orderTime);
      
      var selectOrdersStatus = $('#order_dialog_order_status');
      selectOrdersStatus.find('option').remove();
      selectOrdersStatus.append('<option value=""></option>');
      for (var i=1; i<=orders.orderStatusLength; ++i) {
        if (i === orderStatusId) 
          selectOrdersStatus.append('<option selected="selected" value="' + i + '">' + orders.orderStatus[i] + '</option>');
        else
          selectOrdersStatus.append('<option value="' + i + '">' + orders.orderStatus[i] + '</option>');
      }

      $('#orders_dialog_order_id').text(orderId);
      $('#order_dialog_address').textbox('setValue', address);
      $('#order_dialog_detail').textbox('setValue', detail);



      $("#orders_dialog_form").dialog("open");
      $("#orders_dialog_form").dialog("center");
      $('#orders_dialog_carers_table').datagrid({ 
        fit: true,//自动大小 
        nowrap: false, 
        loadMsg: "正在加载，请稍等...", 
        striped: true, 
        border: true, 
        collapsible: false,//是否可折叠的 
        url: rhurl.origin+'/gero/' + communityId + '/staff?role=护工',
        method: 'get',
        remoteSort: true,  
        sortName: 'ID',
        singleSelect: true,//是否单选 
        pagination: true,//分页控件 
        rownumbers: false,//行号
        pageNumber: 1,
        pagePosition: 'bottom',
        pageSize: 10,//每页显示的记录条数，默认为20 
        pageList: [10,20,35,50],//可以设置每页记录条数的列表 
        loadFilter: function(data){
          var result = {"total":0,"rows":0};
          leftTop.dealdata(data);
          result.total = data.total;
          result.rows = data.entities;
            for (var i in result.rows) {
                // 增加操作一栏的链接
                result.rows[i].operation = '<a href="" onclick="orders.onOrdersDblClickRow()">操作</a>';
                result.rows[i].order_status_name = orders.getOrderStatusNameByStatusId(result.rows[i].order_status);
                result.rows[i].selected = '<input type="radio" name="selectedCarer" value="' + result.rows[i].carer_id + '" />'
            }
          return result;
        },
      }); 
      // $('#elder-Info-card-a input').attr('disabled','disabled');
      // $('#elder-Info-card-a select').attr('disabled','disabled');
      // $('#elder-Info-card-a .input-group-addon').addClass('hide');
      // $('#epic').removeClass('hide');
      // $('#epnote').addClass('hide');
      // $('#elder-Info-card-a').find('.validatebox-text').validatebox('disableValidation');
      // $('#ename').attr('value',data.name);
      // $('#ebirthday').attr('value',data.birthday);
      // var radios = document.getElementsByName("egender");
      //     for (var i = 0; i < radios.length; i++) {
      //         if (i==parseInt(data.gender)) radios[i].checked="checked";
      //     }
      // $('#eaddress').attr('value',data.address);
      // $('#enative_place').attr('value',data.native_place);
      // $('#earea_id').attr('value',data.area_id);
      // $('#earea_fullname').attr('value',data.area_fullname);
      // $('#ecare_level').attr('value',data.care_level);
      // $('#enssf_id').attr('value',data.nssf_id);
      // $('#earchive_id').attr('value',data.archive_id);
      // $('#enationality').attr('value',data.nationality);
      // $('#eeducation').attr('value',data.education);
      // $('#eresidence').attr('value',data.residence);
      // $('#epolitical_status').attr('value',data.political_status);
      // $('#echeckin_date').attr('value',data.checkin_date);
      // $('#echeckout_date').attr('value',data.checkout_date);
      // $('#emarriage').attr('value',data.marriage);
      // $('#eidentity_no').attr('value',data.identity_no);

      // if(data.photo_url!==undefined) $('#elder-Info-card-b img').attr("src",data.photo_src).attr("width","178px").attr("height","220px");
      // else $('#elder-Info-card-b img').attr("src",rhurl.staticurl+"/images/p_2.jpg").attr("width","178px").attr("height","220px");
  },

  addElderInfo: function(){
      elder.eid="";
      elder.method='post';
      elder.flag=false;
      $("#elder-dialog-form").dialog("open");
      $("#elder-dialog-form").dialog("center");
      $('#elder-Info-card-a input').attr('value',null).removeAttr('disabled');
      $('#elder-Info-card-a select').attr('value',null).removeAttr('disabled');
      $('#elder-Info-card-a .input-group-addon').removeClass('hide');
      $('#elder-Info-card-a').find('.validatebox-text').validatebox('disableValidation');
      var radios = document.getElementsByName("egender");
          for (var i = 0; i < radios.length; i++) {
              radios[i].checked=null;
          }
      $('#epic').addClass('hide');
      $('#epnote').removeClass('hide');
      //$('#elder-Info-card-a').find('.easyui-validatebox').validatebox('enableValidation').validatebox('validate');
      $('#elder-Info-card-b img').attr("src",rhurl.staticurl+"/images/p_2.jpg").attr("width","178px").attr("height","220px");
  },

  editOrderInfo: function(){
    alert("edit order info")
      // elder.flag=true;
      // $("#elder-dialog-form").dialog("open");
      // $("#elder-dialog-form").dialog("center");
      // $('#elder-Info-card-a input').removeAttr('disabled');
      // $('#elder-Info-card-a select').removeAttr('disabled');
      // $('#elder-Info-card-a .input-group-addon').removeClass('hide');
      // $('#elder-Info-card-a').find('.validatebox-text').validatebox('disableValidation');
      // $('#epnote').removeClass('hide');
      //$('#elder-Info-card-a').find('.validatebox-text').validatebox('enableValidation').validatebox('validate');
  },
  delElderInfo: function(){
      var eldert = $('#elderpage').datagrid('getSelected');
      if(eldert){
          infoUrl=rhurl.origin+"/gero/"+gid+"/elder/" + eldert.elder_id;
          if (confirm('确定要删除？')) {
              $.ajax({
                  url: infoUrl,
                  type: 'DELETE',
                  timeout:deadtime,
                  success:function(){
                      elder.drawElderList();
                  },
                  error:function(XMLHttpRequest, textStatus, errorThrown){
                      leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
                  }
              })
          }
      }
  },
  searchitem:function(){
      var eldert = $('#elderpage').datagrid('getSelected');
      if(eldert){
          infoUrl=rhurl.origin+"/gero/"+gid+"/elder/" + eldert.elder_id+"/care_item";
          $.ajax({
              url: infoUrl,
              data:{page:1,rows:65535,sort:'ID'},
              type: 'get',
              timeout:deadtime,
              success:function(){
                  alert(1);
              },
              error:function(XMLHttpRequest, textStatus, errorThrown){
                  leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
              }
          })
      }
  },

  onOrdersDblClickRow: function(index) {
    // elder.method='put';
    // elder.flag=false;
    var orderSelected = $('#orders_page').datagrid('getSelected');
    // console.log(orderSelected);
    orders.drawOrderInfoDialog(orderSelected);
    // elder.eid='/'+eldert.elder_id;
    // elder.uid='/'+eldert.id;
    // infoUrl=rhurl.origin+"/gero/"+gid+"/elder" + elder.eid;
    // $.ajax({
    //   type: "get",
    //   dataType: "json",
    //   contentType: "application/json;charset=utf-8",
    //   url: infoUrl,
    //         timeout:deadtime,
    //   success: function (msg) {
    //             var data=leftTop.dealdata(msg);
    //             elder.drawElderInfo(data[0]);
    //   },
    //   error: function(XMLHttpRequest, textStatus, errorThrown) {
    //       leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
    //   }
    // });
  },
  buttonclk: function(){
      $('#elder-Info-card-a').find('.validatebox-text').validatebox('enableValidation').validatebox('validate');
      if($('#ename').validatebox('isValid') && $('#ephone_no').validatebox('isValid') && $('#eidentity_no').validatebox('isValid') && $('#earea_fullname').validatebox('isValid') && $('#ebirthday').validatebox('isValid'))
      {
      var sexc;
      var radios = document.getElementsByName("egender");
          for (var i = 0; i < radios.length; i++) {
              if (radios[i].checked) sexc=i;
          }
      var obj={
          name:document.getElementById("ename").value,
          gender:sexc,
          address:document.getElementById("eaddress").value,
          identity_no:document.getElementById("eidentity_no").value,
          phone_no:document.getElementById("ephone_no").value,
          nssf_id:document.getElementById("enssf_id").value,
          archive_id:document.getElementById("earchive_id").value,
          area_id:parseInt(document.getElementById("earea_id").value),
          care_level:document.getElementById("ecare_level").value,
          nationality:document.getElementById("enationality").value,
          native_place:document.getElementById("enative_place").value,
          birthday:document.getElementById("ebirthday").value,
          political_status:document.getElementById("epolitical_status").value,
          education:document.getElementById("eeducation").value,
          residence:document.getElementById("eresidence").value,
          checkin_date:document.getElementById("echeckin_date").value,
          checkout_date:document.getElementById("echeckout_date").value,
          marriage:document.getElementById("emarriage").value,
      }
      var infoUrl=rhurl.origin+'/gero/'+gid+'/elder'+elder.eid;
      $.ajax({
          url: infoUrl, 
          type: elder.method, 
          data:JSON.stringify(obj), 
          dataType: 'json', 
          contentType: "application/json;charset=utf-8",
          timeout: deadtime, 
          error: function(XMLHttpRequest, textStatus, errorThrown){leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);}, 
          success: function(msg){
              elder.drawElderList();
              // if (elder.method==='post'){
              //     elder.method='put';
              //     var data=leftTop.dealdata(msg);
              //         elder.drawElderInfo(data[0]);
              // }
          } 
      }); 
      }
      else(alert('请确保输入正确'));
  },
  doSearch:function(){
    $('#orders_page').datagrid('load', {
      community_id: $('#orders_search_community').val(), 
      order_status: $('#orders_search_status').val(),
      datetime_before: (function(strDatetimebox) {
        var strDatetime = strDatetimebox.split(' ');
        var arrDate = strDatetime[0].split('/');
        var newDate = arrDate[2] + '-' + arrDate[0] + '-' + arrDate[1];
        var newTime = strDatetime[1] + ':00';
        return newDate + ' ' + newTime;
      })($('#orders_search_time').datetimebox('getValue')),
      fuzzy_query_params: (function(strFuzzyQueryParams) {
        if (strFuzzyQueryParams === '订单号/用户姓名/手机号码') {
          return '';
        } else {
          return strFuzzyQueryParams;
        }
      })($('#orders_search_fuzzy_query').val()),

      
    });

    // TODO
      // $('#elderpage').datagrid('load',{           
      //             name: $('#elder_name').val(),
      //             area_id: $('#elder_areaid').val(),
      //             care_level: $('#elder_care_level').val(),
      //         });
  },
  reset:function(){
      $('#elder_name').attr('value',null);
      $('#elder_areaid').attr('value',null);
      $('#elder_areafullname').attr('value',null);
      $('#elder_care_level').attr('value',null);
  },


  createTreeNode:function(node){
      this.id=node.id;
      this.text=node.name;
      this.children=[];
      iconCls='icon-blank';
      this.attributes={"type":node.type,"level":node.level,'fullname':node.full_name}
  },
  findTreeChildren:function(id){
      var result=[];
      for(var i in elder.temparea){
          if(elder.temparea[i].parent_id===id){
              result.push(elder.temparea[i]);
          }
      }
      return result;
  },
  createTreeData:function(node){
      var result=[];
      var childs= elder.findTreeChildren(node.id);
      if (childs.length!==0){
          for(var i in childs){
              var temp= new elder.createTreeNode(childs[i]);
              if (elder.findTreeChildren(childs[i].id).length!==0){
                  temp.children=elder.createTreeData(childs[i]);
              }
              result.push(temp);
          }
      }
      return result;
  },
  area_idclick:function(){
      $('#area-dialog-form').dialog('open');
      $("#area-dialog-form").dialog("center");
      $('#areachoosetree li').remove();
      $('#areachoosetree ul').remove();
      $.ajax({
          type: "get",
          data:{page:1,rows:65535,sort:'ID'},
          dataType: "json",
          contentType: "application/json;charset=utf-8",
          url:rhurl.origin+'/gero/'+gid+'/area',
          timeout:deadtime,
          success: function (msg) {
              elder.temparea=msg.entities;
              elder.areatemp=elder.createTreeData({"id":0,"types":0});
              $("#areachoosetree").tree("loadData",elder.areatemp);
              areavalue="#earea_id";
              areanamevalue="#earea_fullname";
              var node=$("#areachoosetree").tree('find',parseInt($('#earea_id').val()));
              if(node)$("#areachoosetree").tree("check",node.target);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
              leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
          }
      });
  },
  searcharea_id:function(){
      $('#area-dialog-form').dialog('open');
      $("#area-dialog-form").dialog("center");
      $('#areachoosetree li').remove();
      $('#areachoosetree ul').remove();
      $.ajax({
          type: "get",
          data:{page:1,rows:65535,sort:'ID'},
          dataType: "json",
          contentType: "application/json;charset=utf-8",
          url:rhurl.origin+'/gero/'+gid+'/area',
          timeout:deadtime,
          success: function (msg) {
              elder.temparea=msg.entities;
              elder.areatemp=elder.createTreeData({"id":0,"types":0});
              $("#areachoosetree").tree("loadData",elder.areatemp);
              areavalue="#elder_areaid";
              areanamevalue="#elder_areafullname";
              var node=$("#areachoosetree").tree('find',parseInt($('#elder_areaid').val()));
              if(node)$("#areachoosetree").tree("check",node.target);
          },
          error: function(XMLHttpRequest, textStatus, errorThrown) {
              leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
          }
      });
  }
}