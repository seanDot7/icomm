var orders = {
  method: '',
  flag: false, // TODO
  eid: '',
  uid: '',
  temparea: [],
  areatemp: [],
  curOrderData: null,
  curOrderId: null,
  isEditingOrderInfo: false,
  
  isAddedElder:false,
  isAddedRelative:false,
  addedElderId:'',
  addedRelativeId:'',

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
  getOrderRate: function(value) {
    if (value >=1 && value <= 5)
      return value;
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
            result.rows[i].operation = '<button onclick="orders.onOperationClick.call(this)">操作</button>';
            result.rows[i].order_status_name = orders.getOrderStatusNameByStatusId(result.rows[i].order_status);
            result.rows[i].rate = orders.getOrderRate(result.rows[i].rate);
            result.rows[i].order_time = getDatetimeByMsDatetime(result.rows[i].order_time);
          }
        return result;
      },
      toolbar: [{text: '添加', iconCls: 'icon-add', 
        handler: function() { 
          orders.openAddOrderDialog();
        } 
      }]
    }); 
    var pager = $('#orders_page').datagrid('getPager'); // get the pager of datagrid
    pager.pagination({
      displayMsg: '当前显示 {from} - {to} 条记录   共 {total} 条记录', 
    });

  },
  onClickOrderDialogNext: function() {
    var buttonNext = $('#order_dialog_next');
    var orderStatusId = Number(buttonNext.data('orderStatusId'));
    var nextStatusId = orderStatusId + 1;
    if (nextStatusId === 4)
      ++nextStatusId;
    $('#order_dialog_order_status').val(nextStatusId);
    orders.onEditConfirm();
  },
  openOrderInfoDialog: function() {
    $("#orders_dialog_form").dialog("open");
    $("#orders_dialog_form").dialog("center");
  },
  closeOrderInfoDialog: function() {
    $("#orders_dialog_form").dialog("close");
  },
  drawOrderInfoDialog: function(orderId, isEditable) {
    if (!orderId)
      orderId = orders.curOrderId;

    var renderOrder = function(data) {
      var disabledAttr = ' disabled="disabled" ';
      if (isEditable)
        disabledAttr = ''; 

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
      var rate = data.rate;
      var itemId = data.item_id;
      var carerId = data.carer_id;
      // console.log(orderId);
      $('#order_dialog_username').val(elderName);
      $('#order_dialog_username').data('elderId', elderId);
      $('#order_dialog_phone_number').val(elderPhoneNumber);
      $('#order_dialog_order_time').val(orderTime);
      $('#order_dialog_order_rate').val(rate);
      var buttonNext = $('#order_dialog_next');
      buttonNext.data('orderStatusId', orderStatusId);
      if (orderStatusId === 1) {
        buttonNext.text('派单');
      } else if (orderStatusId === 2) {
        buttonNext.text('确认订单');
      } else if (orderStatusId === 3 || orderStatusId === 4) {
        buttonNext.text('评价');
      } else if (orderStatusId >= 5) {
        buttonNext.text('已评价');
        buttonNext.attr('disabled', 'disabled');
      }
      
      var selectOrderStatus = $('#order_dialog_order_status');
      selectOrderStatus.find('option').remove();
      for (var i=1; i<=orders.orderStatusLength; ++i) {
        selectOrderStatus.append('<option value="' + i + '">' + orders.orderStatus[i] + '</option>');
      }
      if (orderStatusId >= 1 && orderStatusId <= orders.orderStatusLength) {
        selectOrderStatus.attr('value', orderStatusId);
      }

      var selectOrderRate = $('#order_dialog_order_rate');
      selectOrderRate.find('option').remove();
      selectOrderRate.append('<option value="-1">---</option>');
      for (var i=1; i<=5; ++i) {
        selectOrderRate.append('<option value="' + i + '">' + i + '</option>');
      }
      if (rate >= 1 && rate <= 5) {
        selectOrderRate.attr('value', rate);
      }

      $.ajax({
        url: rhurl.origin+'/gero/' + communityId + '/care_item?page=1&rows=65536&sort=ID&order=asc',
        type: 'GET',
        timeout: deadtime,
        success: function(data) {
          var entities = leftTop.dealdata(data);

          var selectItem = $('#order_dialog_item');
          selectItem.find('option').remove();
          selectItem.append('<option value="-1">---</option>');
          for (var i=0; i<entities.length; ++i) {
            selectItem.append('<option value="' + entities[i].id + '">' + entities[i].name + '</option>');
          }
          if (itemId >= 0) {
            selectItem.attr('value', itemId);
          }

        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
          leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
      });

      $('#orders_dialog_order_id').text(orderId);
      $('#order_dialog_address').textbox('setValue', address);
      $('#order_dialog_detail').textbox('setValue', detail);

      $('#orders_dialog_carers_table').datagrid({ 
        fit: false,//自动大小 
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
        pageSize: 5,//每页显示的记录条数，默认为20 
        pageList: [5,10,20,35,50],//可以设置每页记录条数的列表 
        loadFilter: function(data){
          var result = {"total":0,"rows":0};
          leftTop.dealdata(data);
          result.total = data.total;
          result.rows = data.entities;
          for (var i in result.rows) {
            result.rows[i].order_status_name = orders.getOrderStatusNameByStatusId(result.rows[i].order_status);
            if (carerId > 0 && Number(result.rows[i].id) === carerId)
              result.rows[i].selected = '<input type="radio" name="selectedCarer" value="' + result.rows[i].id + '"' + disabledAttr + ' checked="checked" />';
            else
              result.rows[i].selected = '<input type="radio" name="selectedCarer" value="' + result.rows[i].id + '"' + disabledAttr + ' />';
          }
          return result;
        },
      });
      
    }

    $.ajax({
      url: rhurl.origin+'/orders/' + orderId,
      type: 'GET',
      timeout: deadtime,
      success: function(data) {
        var entities = leftTop.dealdata(data);
        var order = entities[0];
        renderOrder(order);
      },
      error:function(XMLHttpRequest, textStatus, errorThrown){
        leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
      }
    }); 

    $('#order_dialog_order_status').attr('disabled', 'disabled');
    $('#order_dialog_order_rate').attr('disabled', 'disabled');
    $('#order_dialog_item').attr('disabled', 'disabled');
    $('#order_dialog_address').textbox('disable');
    $('#order_dialog_detail').textbox('disable');
    $('#order_dialog_dispatch').attr('disabled', 'disabled');
    $('tr input[name=selectedCarer]').attr('disabled', 'disabled');
    orders.isEditingOrderInfo = false;

  },

  addElderInfo: function(){
      // elder.eid="";
      // elder.method='post';
      // elder.flag=false;
      // $("#elder-dialog-form").dialog("open");
      // $("#elder-dialog-form").dialog("center");
      // $('#elder-Info-card-a input').attr('value',null).removeAttr('disabled');
      // $('#elder-Info-card-a select').attr('value',null).removeAttr('disabled');
      // $('#elder-Info-card-a .input-group-addon').removeClass('hide');
      // $('#elder-Info-card-a').find('.validatebox-text').validatebox('disableValidation');
      // var radios = document.getElementsByName("egender");
      //     for (var i = 0; i < radios.length; i++) {
      //         radios[i].checked=null;
      //     }
      // $('#epic').addClass('hide');
      // $('#epnote').removeClass('hide');
      // //$('#elder-Info-card-a').find('.easyui-validatebox').validatebox('enableValidation').validatebox('validate');
      // $('#elder-Info-card-b img').attr("src",rhurl.staticurl+"/images/p_2.jpg").attr("width","178px").attr("height","220px");
  },

  editOrderInfo: function(){
    orders.isEditingOrderInfo = true;

    // $('#order_dialog_order_status').removeAttr('disabled');
    $('#order_dialog_next').removeAttr('disabled');
    // $('#order_dialog_order_rate').removeAttr('disabled');
    // $('#order_dialog_item').removeAttr('disabled');
    // $('#order_dialog_address').textbox('enable');
    // $('#order_dialog_detail').textbox('enable');
    // $('#order_dialog_dispatch').removeAttr('disabled');
    // $('tr input[name=selectedCarer]').removeAttr('disabled');
    // orders.onOrderDialogSelectStatusChange();
    var orderStatusId = $('#order_dialog_order_status').val();
    orders.changeEditableArea(orderStatusId); 

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
  onEditConfirm: function() {
    if (orders.isEditingOrderInfo) {
      var obj = {};
      obj.status = Number($('#order_dialog_order_status').attr('value'));
      obj.rate = Number($('#order_dialog_order_rate').attr('value'));
      if (obj.rate === -1)
        delete obj.rate;
      // obj.address = $('#order_dialog_address').textbox('getText');
      obj.item_detail = $('#order_dialog_detail').textbox('getText');
      obj.care_item_id = Number($('#order_dialog_item').attr('value'));
      if (obj.care_item_id === -1)
        delete obj.care_item_id;

      obj.carer_id = Number($('input:radio[name="selectedCarer"]:checked').val());
      if (!obj.carer_id)
        delete obj.carer_id;

      // console.log(obj);

      $.ajax({
          url: rhurl.origin + '/orders/' + orders.curOrderId, 
          type: 'PUT', 
          data: JSON.stringify(obj), 
          dataType: 'json', 
          contentType: "application/json;charset=utf-8",
          timeout: deadtime, 
          error: function(XMLHttpRequest, textStatus, errorThrown){
            leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
          }, 
          success: function(msg){
            orders.drawOrderInfoDialog();
            orders.drawOrdersList();
          } 
      }); 
    }
  },
  addOrder: function() {

  },
  openAddOrderDialog: function() {
    $("#orders_dialog_add_order").dialog("open");
    $("#orders_dialog_add_order").dialog("center"); 
  },
  // delElderInfo: function(){
  //     var eldert = $('#elderpage').datagrid('getSelected');
  //     if(eldert){
  //         infoUrl=rhurl.origin+"/gero/"+gid+"/elder/" + eldert.elder_id;
  //         if (confirm('确定要删除？')) {
  //             $.ajax({
  //                 url: infoUrl,
  //                 type: 'DELETE',
  //                 timeout:deadtime,
  //                 success:function(){
  //                     elder.drawElderList();
  //                 },
  //                 error:function(XMLHttpRequest, textStatus, errorThrown){
  //                     leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
  //                 }
  //             })
  //         }
  //     }
  // },
  // searchitem:function(){
  //     var eldert = $('#elderpage').datagrid('getSelected');
  //     if(eldert){
  //         infoUrl=rhurl.origin+"/gero/"+gid+"/elder/" + eldert.elder_id+"/care_item";
  //         $.ajax({
  //             url: infoUrl,
  //             data:{page:1,rows:65535,sort:'ID'},
  //             type: 'get',
  //             timeout:deadtime,
  //             success:function(){
  //                 alert(1);
  //             },
  //             error:function(XMLHttpRequest, textStatus, errorThrown){
  //                 leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
  //             }
  //         })
  //     }
  // },

  onOrdersDblClickRow: function(index) {
    var orderSelected = $('#orders_page').datagrid('getSelected');
    orders.curOrderId = orderSelected.order_id;
    orders.openOrderInfoDialog();
    orders.drawOrderInfoDialog(orders.curOrderId);
  },
  onOperationClick: function() {
    var row = $(this).closest('tr');
    var id = row.attr('datagrid-row-index');
    $('#orders_page').datagrid('selectRow', id);
    orders.onOrdersDblClickRow(id);
  },
  onSearchElderInfo: function() {
    
  },
  // buttonclk: function(){
  //     $('#elder-Info-card-a').find('.validatebox-text').validatebox('enableValidation').validatebox('validate');
  //     if($('#ename').validatebox('isValid') && $('#ephone_no').validatebox('isValid') && $('#eidentity_no').validatebox('isValid') && $('#earea_fullname').validatebox('isValid') && $('#ebirthday').validatebox('isValid'))
  //     {
  //     var sexc;
  //     var radios = document.getElementsByName("egender");
  //         for (var i = 0; i < radios.length; i++) {
  //             if (radios[i].checked) sexc=i;
  //         }
  //     var obj={
  //         name:document.getElementById("ename").value,
  //         gender:sexc,
  //         address:document.getElementById("eaddress").value,
  //         identity_no:document.getElementById("eidentity_no").value,
  //         phone_no:document.getElementById("ephone_no").value,
  //         nssf_id:document.getElementById("enssf_id").value,
  //         archive_id:document.getElementById("earchive_id").value,
  //         area_id:parseInt(document.getElementById("earea_id").value),
  //         care_level:document.getElementById("ecare_level").value,
  //         nationality:document.getElementById("enationality").value,
  //         native_place:document.getElementById("enative_place").value,
  //         birthday:document.getElementById("ebirthday").value,
  //         political_status:document.getElementById("epolitical_status").value,
  //         education:document.getElementById("eeducation").value,
  //         residence:document.getElementById("eresidence").value,
  //         checkin_date:document.getElementById("echeckin_date").value,
  //         checkout_date:document.getElementById("echeckout_date").value,
  //         marriage:document.getElementById("emarriage").value,
  //     }
  //     var infoUrl=rhurl.origin+'/gero/'+gid+'/elder'+elder.eid;
  //     $.ajax({
  //         url: infoUrl, 
  //         type: elder.method, 
  //         data:JSON.stringify(obj), 
  //         dataType: 'json', 
  //         contentType: "application/json;charset=utf-8",
  //         timeout: deadtime, 
  //         error: function(XMLHttpRequest, textStatus, errorThrown){leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);}, 
  //         success: function(msg){
  //             elder.drawElderList();
  //             // if (elder.method==='post'){
  //             //     elder.method='put';
  //             //     var data=leftTop.dealdata(msg);
  //             //         elder.drawElderInfo(data[0]);
  //             // }
  //         } 
  //     }); 
  //     }
  //     else(alert('请确保输入正确'));
  // },
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
  onOrderDialogSelectStatusChange: function() {
    var status = Number($('#order_dialog_order_status').attr('value'));
    // if (status == 2) {
    //   $('#order_dialog_item').removeAttr('disabled');
    //   $('tr input[name=selectedCarer]').removeAttr('disabled');
    //   $('#order_dialog_detail').textbox('enable');
    //   $('#order_dialog_dispatch').removeAttr('disabled');
    // } else {
    //   $('#order_dialog_item').attr('disabled', 'disabled');
    //   $('tr input[name=selectedCarer]').attr('disabled', 'disabled');
    //   $('#order_dialog_detail').textbox('disable');
    //   $('#order_dialog_dispatch').attr('disabled', 'disabled');
    // }
    // if (status == 4) {
    //   $('#order_dialog_order_rate').removeAttr('disabled');
    // } else {
    //   $('#order_dialog_order_rate').attr('disabled', 'disabled');
    // }
  },
  changeEditableArea: function(orderStatusId) {
    orderStatusId = Number(orderStatusId)
    if (orderStatusId === 1) {
      $('#order_dialog_item').removeAttr('disabled');
      $('tr input[name=selectedCarer]').removeAttr('disabled');
      $('#order_dialog_detail').textbox('enable');
      $('#order_dialog_dispatch').removeAttr('disabled');
    } else {
      $('#order_dialog_item').attr('disabled', 'disabled');
      $('tr input[name=selectedCarer]').attr('disabled', 'disabled');
      $('#order_dialog_detail').textbox('disable');
      $('#order_dialog_dispatch').attr('disabled', 'disabled');
    }
    if (orderStatusId === 3) {
      $('#order_dialog_order_rate').removeAttr('disabled');
    } else {
      $('#order_dialog_order_rate').attr('disabled', 'disabled');
    }
  },

  drawPaneOrderAdd: function() {
    $('.inf').addClass('hide');
    $('#order_add').removeClass('hide');

    var dateNow = new Date();
    var strNow = (dateNow.getMonth()+1) + '/' + dateNow.getDate() + '/' + dateNow.getFullYear() + ' ' + dateNow.getHours() + ':' + dateNow.getMinutes() + ':' + dateNow.getSeconds();
    $("#order_add_phonebegin").datetimebox('setValue', strNow); 
    
  },
  fillBasicInfo:function(basicEntity){
    orders.isAddedElder = true;
    orders.addedElderId = basicEntity.id;
    $("#order_add_name").val(basicEntity.name);
    $("#order_add_phoneno").val(basicEntity.phone_no);
    $('input:radio[name="egenderxxx"][value="'+ basicEntity.gender+'"]').attr("checked",true);
    $("#order_add_address").val(basicEntity.residence_address);
    $("#order_add_IDno").val(basicEntity.identity_no);
    $("#order_add_search_name").val(basicEntity.name);
    $("#order_add_search_phoneno").val(basicEntity.phone_no);
    $.ajax({
      url: rhurl.origin+'/gero',
      data: {page: 1, rows: 65535, sort: 'ID'},
      type: 'GET',
      timeout: deadtime,
      success:function(data){
        var entities = leftTop.dealdata(data);

        var selectCommunity = $('#order_add_community');
        selectCommunity.find('option').remove();
        selectCommunity.append('<option value=""></option>');
        for (var i=0; i<entities.length; ++i) {
          var community = entities[i];
          selectCommunity.append('<option value="' + community.id + '">' + community.name + '</option>');
        }
        $('#order_add_community').val(String(basicEntity.gero_id));

      },
      error:function(XMLHttpRequest, textStatus, errorThrown){
          leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
      }
    });
    // $.ajax({
    //   url: rhurl.origin+'/gero',
    //   data: {page: 1, rows: 65535, sort: 'ID'},
    //   type: 'GET',
    //   timeout: deadtime,
    //   success:function(data){
    //     var entities = leftTop.dealdata(data);

    //     var selectCommunity = $('#order_add_community');
        
    //     for (var i=0; i<entities.length; ++i) {
    //       var community = entities[i];
    //       if(community.id==basicEntity.gero_id){
    //         selectCommunity.val(community.name);
    //       }
    //     }
    //   },
    //   error:function(XMLHttpRequest, textStatus, errorThrown){
    //       leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
    //   }
    // });
    $.ajax({
        url: rhurl.origin+'/gero/' + basicEntity.gero_id + '/care_item?page=1&rows=65536&sort=ID&order=asc',
        type: 'GET',
        timeout: deadtime,
        success: function(data) {
          var entities = leftTop.dealdata(data);

          var selectItem = $('#order_add_order_type');
          selectItem.find('option').remove();
          selectItem.append('<option value="-1">---</option>');
          for (var i=0; i<entities.length; ++i) {
            selectItem.append('<option value="' + entities[i].id + '">' + entities[i].name + '</option>');
          }
          // if (itemId >= 0) {
          //   selectItem.attr('value', itemId);
          // }

        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
          leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
      });

  },
  fillDetailInfo:function(userId){
    $.ajax({
        url: rhurl.origin+'/gero/2/relative?page=1&rows=35&sort=ID&order=asc&elder_id='+userId,
        type: 'GET',
        timeout: deadtime,
        success: function(data) {
          var entities = leftTop.dealdata(data);

          if(entities.length>=1){
            orders.isAddedRelative = true;
            orders.addedRelativeId = entities[0].id;
            $("#order_add_emergename").val(entities[0].name);
            $("#order_add_emergephoneno").val(entities[0].phone_no);

          }else{
            alert("未找到相关【家属】信息，请重新搜索");
          }          
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
          leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
      });

  },
  doAddSearch:function(){
    var searchAddName=$("#order_add_search_name").val();
    var searchAddPhoneno=$("#order_add_search_phoneno").val();
    

    $.ajax({
        url: rhurl.origin+'/gero/2/elder?page=1&rows=3&sort=ID&order=asc&name='+searchAddName+'&phone_number='+searchAddPhoneno ,
        type: 'GET',
        timeout: deadtime,
        success: function(data) {
          var entities = leftTop.dealdata(data);

          if(entities.length===1){
            orders.fillBasicInfo(entities[0]);
            orders.fillDetailInfo(entities[0].id);
          }else if(entities.length>1){
            alert("相关【老人】信息有重复，请重新搜索");

          }else{
            orders.doAddReset();
            alert("未找到相关【老人】信息，请重新搜索");
          }          
        },
        error:function(XMLHttpRequest, textStatus, errorThrown){
          leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
        }
      });

  },
  doAddReset:function(){
    $("#order_add_search_name").val("");
    $("#order_add_search_phoneno").val("");
    $("#order_add_name").val("");
    $("#order_add_phoneno").val("");
    $('input:radio[name="egenderxxx"]').attr("checked",false);
    $("#order_add_address").val("");
    $("#order_add_IDno").val("");
    $("#order_add_SSNno").val("");
    $("#order_add_community").val("");
    $("#order_add_emergename").val("");
    $("#order_add_emergephoneno").val("");
    $("#order_add_order_type").attr('value','');
    //$("#order_add_phonebegin").val("");
    $("#order_add_phoneend").datetimebox('setValue', '');
    $("#order_add_phonetype").attr('value','');
    $("#order_add_order_description").val("");
    $("#order_add_remark").val("");
    orders.addedRelativeId = '';
    orders.addedElderId = '';
    orders.isAddedElder = false;
    orders.isAddedRelative= false;
  },
  doAddSave:function(){
    // alert($("#order_add_name").val()=='');
    // alert($("#order_add_order_type").attr('value'));
    if($("#order_add_name").val()==''){
      alert("请填写【真实姓名】");
    }else if($("#order_add_phoneno").val()==''){
      alert("请填写【手机号】");

    }else if($('input:radio[name="egenderxxx"]:checked').val()==null||$('input:radio[name="egenderxxx"]:checked').val()==undefined){
      alert("请填写【性别】");

    }else if($("#order_add_community").val()==''){
      alert("请填写【小区】");

    }else if($("#order_add_address").val()==''){
      alert("请填写【详细地址】");

    // }else if($("#order_add_SSNno").val()==null||$("#order_add_SSNno").val()==undefined){
    //   alert("请填写【社保卡号】");

    }else if($("#order_add_IDno").val()==''){
      alert("请填写【身份证号】");

    }else if($("#order_add_emergename").val()==''){
      alert("请填写【紧急联系人姓名】");

    }else if($("#order_add_emergephoneno").val()==''){
      alert("请填写【紧急联系人电话】");

    }else if($("#order_add_order_type").attr('value')==''){
      alert("请填写【情况分类】");

    }else if($("#order_add_phonebegin").datetimebox('getValue')==''){
      alert("请填写【通话开始时间】");

    }else if($("#order_add_phoneend").datetimebox('getValue')==''){
      alert("请填写【通话结束时间】");

    }else if($("#order_add_phonetype").attr('value')==''){
      alert("请填写【通话类型】");

    }else{
      orders.fillObject();
    }

    
  },

  fillObject:function(){
    var orderEntity = {};//POST数据Object


    orderEntity.orderType        = $("#order_add_order_type").attr('value');/*<option value='0'>洗衣</option>
                                                                                 <option value='1'>理发</option>
                                                                                 <option value='2'>做饭</option>
                                                                                 <option value='3'>按摩</option>*/
    orderEntity.orderDescription = $("#order_add_order_description").val();  
    orderEntity.phoneBegin       = $("#order_add_phonebegin").val();
    orderEntity.phoneEnd         = $("#order_add_phoneend").val();
    orderEntity.phoneType        = $("#order_add_phonetype").attr('value');/*<option value='0'>本地通话</option>
                                                                              <option value='1'>国内长途</option>
                                                                              <option value='2'>国际漫游</option>*/
    orderEntity.remark           = $("#order_add_remark").val();

    if(orders.isAddedRelative){
      orderEntity.elderId          = orders.addedElderId;
      orderEntity.relativeId       = orders.addedRelativeId;
                                                   
    }else if(orders.isAddedElder){
      orderEntity.elderId          = orders.addedElderId;
      orderEntity.relativeName     = $("#order_add_emergename").val();
      orderEntity.relativePhone    = $("#order_add_emergephoneno").val();
      
    }else{
      orderEntity.elderName        = $("#order_add_name").val();
      orderEntity.elderPhoneNumber = $("#order_add_phoneno").val();
      orderEntity.elderGender      = $('input:radio[name="egenderxxx"]:checked').val();
      orderEntity.elderAddress     = $("#order_add_address").val();
      orderEntity.elderIdentityNo  = $("#order_add_IDno").val();
      orderEntity.elderSSNno       = $("#order_add_SSNno").val();
      orderEntity.elderCommunity   = $("#order_add_community").attr("value");
      orderEntity.relativeName     = $("#order_add_emergename").val();
      orderEntity.relativePhone    = $("#order_add_emergephoneno").val();
      
    }

    orders.objectPost(orderEntity);
  },
  objectPost:function(orderEntity){
    $.ajax({
          url: rhurl.origin + '/orders', 
          type: 'POST', 
          data: JSON.stringify(orderEntity), 
          dataType: 'json', 
          contentType: "application/json;charset=utf-8",
          timeout: deadtime, 
          error: function(XMLHttpRequest, textStatus, errorThrown){
            leftTop.dealerror(XMLHttpRequest, textStatus, errorThrown);
          }, 
          success: function(msg){
            alert("下单成功！");
            orders.doAddReset();
          } 
      }); 


  },  
  
}
