/*var myVar = setInterval(function(){
	d = new Date();
    t = d.toLocaleString();
	$('#waktu').html(d.toLocaleString());
},1000);



$(document).ready(function(){
    frmWidth = getClientWidth();
    frmHeight = getClientHeight();
	
	$('#bodyHt').layout();
	$('#bodyHt').layout('panel','west').panel({
		collapsible:false
	});
	$("#mainContainer").css('height',getClientHeight()-91);
	
	$('#accordionMenu').accordion({  
		height: getClientHeight()-178
	});
	
	

});
*/

function loadUrl(urls){
	//$('.btn-highlight').removeClass("btn-highlight");
	//obj.className += " btn-highlight";	
	
    $("#isi_nya").html("").addClass("loading");
	$.get(urls,function (html){
	    $("#isi_nya").html(html).removeClass("loading");
    });
}

function getClientHeight(){
	var theHeight;
	if (window.innerHeight)
		theHeight=window.innerHeight;
	else if (document.documentElement && document.documentElement.clientHeight) 
		theHeight=document.documentElement.clientHeight;
	else if (document.body) 
		theHeight=document.body.clientHeight;
	
	return theHeight;
}

var divcontainer;
function windowFormPanel(html,judul,width,height){
	divcontainer = $('#jendela');
	$(divcontainer).unbind();
	$('#isiJendela').html(html);
    $(divcontainer).window({
		title:judul,
		width:width,
		height:height,
		autoOpen:false,
		top: Math.round(frmHeight/2)-(height/2),
		left: Math.round(frmWidth/2)-(width/2),
		modal:true,
		maximizable:false,
		minimizable: false,
		collapsible: false,
		closable: true,
		resizable: false,
	    onBeforeClose:function(){	   
			$(divcontainer).window("close",true);
			//$(divcontainer).window("destroy",true);
			$(divcontainer).window('refresh');
			return true;
	    }		
    });
    $(divcontainer).window('open');       
}
function windowFormClosePanel(){
    $(divcontainer).window('close');
	$(divcontainer).window('refresh');
}

var container;
function windowForm(html,judul,width,height){
    container = "win"+Math.floor(Math.random()*9999);
    $("<div id="+container+"></div>").appendTo("body");
    container = "#"+container;
    $(container).html(html);
    $(container).css('padding','5px');
    $(container).window({
       title:judul,
       width:width,
       height:height,
       autoOpen:false,
       maximizable:false,
       minimizable: false,
	   collapsible: false,
       resizable: false,
       closable:true,
       modal:true,
	   onBeforeClose:function(){	   
			$(container).window("close",true);
			$(container).window("destroy",true);
			return true;
	   }
    });
    $(container).window('open');        
}
function closeWindow(){
    $(container).window('close');
    $(container).html("");
}


function getClientWidth(){
	var theWidth;
	if (window.innerWidth) 
		theWidth=window.innerWidth;
	else if (document.documentElement && document.documentElement.clientWidth) 
		theWidth=document.documentElement.clientWidth;
	else if (document.body) 
		theWidth=document.body.clientWidth;

	return theWidth;
}
function genGridEditable(modnya, divnya, lebarnya, tingginya,crud_table){
	var data_dumi=[{"id":'fixed',"text":"fixed"}];
	if(lebarnya == undefined){
		lebarnya = getClientWidth-250;
	}
	if(tingginya == undefined){
		tingginya = getClientHeight-300
	}
	
	var kolom ={};
	var frozen ={};
	var judulnya;
	var urlnya;
	var param={};
	var url_crud=host+"home/simpansavedata/"+crud_table;
	var fitnya;
	switch (modnya){
		case "tbl_employees":
			judulnya = "";
			urlnya = "tbl_emp_act";
			fitnya = true;
			kolom[modnya] = [	
				{field:'costcenter_desc',title:'Cost Center',width:100, halign:'center',align:'left',
					editor:{type:'validatebox',options:{}}
				},
				{field:'employee_id',title:'Emp. ID',width:80, halign:'center',align:'center'},
				{field:'name_na',title:'Employee Name',width:180, halign:'center',align:'left'},
				{field:'cost_nbr',title:'Cost',width:100, halign:'center',align:'right'},
				{field:'percent',title:'%',width:50, halign:'center',align:'right',
					
					editor:{type:'numberbox',options:{precision:1,value:0,min:0,max:100}}
				},
				{field:'quantity',title:'Quantity',width:100, halign:'center',align:'right',
					editor:{type:'numberbox',options:{ value:0 }}
				},
				{field:'cost_type',title:'Cost Type',width:100, halign:'center',align:'right',
					editor:{
                       type:'combobox',
                       options:{
                           valueField:'id',
                           textField:'value',
						   data: [{
								id: 'Fixed',
								value: 'Fixed'
							}]
              
                       }
                    }
				},
				{field:'budget_type',title:'Budget',width:100, halign:'center',align:'right',
					editor:{
                       type:'combobox',
                       options:{
                           valueField:'id',
                           textField:'value',
						   data: [{
								id: 'Fixed',
								value: 'Fixed'
							}]
                          // method:'get',
                          // url:'products.json',
                          // required:true
                       }
                    }
				},
				{field:'input_rate',title:'Input Rate',width:80, halign:'center',align:'right',
					editor:{type:'numberbox',options:{value:0}}
				},
				{field:'output_rate',title:'Output Rate',width:80, halign:'center',align:'right',
					editor:{type:'numberbox',options:{value:0}}
				},
			]
		break;
	}
	
	$("#"+divnya).edatagrid({
		title:judulnya,
        height:tingginya,
        width:lebarnya,
		rownumbers:true,
		iconCls:'database',
        fit:fitnya,
        striped:true,
        pagination:true,
        remoteSort: false,
        url: host+"home/getdata/"+urlnya,
		saveUrl: url_crud+'/add',
        updateUrl: url_crud+'/edit',
        destroyUrl: url_crud+'/delete',
		nowrap: true,
        singleSelect:true,
		queryParams:param,
		columns:[
            kolom[modnya]
        ],
		toolbar: [{
				id:'btnadd',
				text:'Save',
				iconCls:'icon-save',
				handler:function(){
					var sts;
					$("#"+divnya).edatagrid('saveRow');
					$("#"+divnya).edatagrid('reload');
				}
			},'-'
		],
	});
}
function genGrid(modnya, divnya, lebarnya, tingginya){
	if(lebarnya == undefined){
		lebarnya = getClientWidth-250;
	}
	if(tingginya == undefined){
		tingginya = getClientHeight-300
	}

	var kolom ={};
	var frozen ={};
	var judulnya;
	var urlnya;
	var urlglobal="";
	var fitnya;
	var pagesizeboy = 10;
	
	switch(modnya){
		case "201":
			judulnya = "Data Materi Yang Akan Disampaikan";
			urlnya = "tbl_kursus";
			fitnya = true;
			kolom[modnya] = [	
				{field:'judul',title:'Judul',width:150, halign:'center',align:'left'},
				{field:'deskripsi',title:'Deskripsi',width:250, halign:'center',align:'left'},
				{field:'tgl_mulai',title:'Tgl. Mulai',width:120, halign:'center',align:'center'},
				{field:'tgl_akhir',title:'Tgl. Akhir',width:120, halign:'center',align:'center'}
			];
		break;
		
	}
	
	$("#"+divnya).datagrid({
		title:judulnya,
        height:tingginya,
        width:lebarnya,
		rownumbers:true,
		iconCls:'database',
        fit:fitnya,
        striped:true,
        pagination:true,
        remoteSort: false,
        url: (urlglobal == "" ? host+"home/getdata/"+urlnya : urlglobal),		
		nowrap: true,
        singleSelect:true,
		pageSize:pagesizeboy,
		pageList:[10,20,30,40,50,75,100,200],
		columns:[
            kolom[modnya]
        ],
		onLoadSuccess:function(d){
			
			$('.yes').linkbutton({  
					iconCls: 'icon-cancel'  
			});
			$('.no').linkbutton({  
					iconCls: 'icon-ok'  
			});
			
			
		},
		onClickRow:function(rowIndex,rowData){
          if(modnya=='list_act'){
			  $('#id').val(rowData.id);
			  $('#activity_code').val(rowData.activity_code);
			  $('#descript').val(rowData.descript);
			  $('#editstatus').val('edit');
		  }
        },
		toolbar: '#tb_'+modnya,
	});
}


function genform(type, modulnya, submodulnya, stswindow, tabel){
	var urlpost = host+'home/modul/'+modulnya+'/form_'+submodulnya;
	var urldelete = host+'home/simpansavedata/'+tabel;
	switch(submodulnya){
		case "201":
			var lebar = getClientWidth()-990;
			var tinggi = getClientHeight()-535;
			var judulwindow = 'Form Data Provinsi';
			var table="cl_provinsi";
		break;
		
		//Setting
		case "701":
			var lebar = getClientWidth()-800;
			var tinggi = getClientHeight()-270;
			var judulwindow = 'Form User Management';
			var table="tbl_user";
			urlpost = host+'homex/modul/'+modulnya+'/form_'+submodulnya;
			urldelete = host+'homex/simpansavedata/'+tabel;
		break;
		case "702":
			var lebar = getClientWidth()-800;
			var tinggi = getClientHeight()-400;
			var judulwindow = 'Form User Group';
			var table="cl_user_group";
			urlpost = host+'homex/modul/'+modulnya+'/form_'+submodulnya;
			urldelete = host+'homex/simpansavedata/'+tabel;
		break;
		//End Setting
		
		//Data Reference
		case "ref_employee":
			var lebar = getClientWidth()-500;
			var tinggi = getClientHeight()-200;
			var judulwindow = 'Form Data Employee';
			var table="tbl_emp";
			urlpost = host+'homex/modul/'+modulnya+'/form_'+submodulnya;
		break;
		case "ref_expense":
			var lebar = getClientWidth()-500;
			var tinggi = getClientHeight()-300;
			var judulwindow = 'Form Data Expense';
			var table="tbl_exp";
			urlpost = host+'homex/modul/'+modulnya+'/form_'+submodulnya;
		break;
		case "ref_allocation":
			var lebar = getClientWidth()-800;
			var tinggi = getClientHeight()-400;
			var judulwindow = 'Form Data Allocation';
			var table="tbl_loc";
			urlpost = host+'homex/modul/'+modulnya+'/form_'+submodulnya;
		break;
		case "100":
			var lebar = getClientWidth()-800;
			var tinggi = getClientHeight()-380;
			var judulwindow = 'Form Data Model';
			var table="tbl_model";
			urlpost = host+'home/modul/'+modulnya+'/form_'+submodulnya;
		break;
		//Data Reference
		
	}
	
	switch(type){
		case "add":
			if(stswindow == undefined){
				$('#grid_nya_'+submodulnya).hide();
				$('#detil_nya_'+submodulnya).show();
			}
			$.post(urlpost, {'editstatus':'add'}, function(resp){
				if(stswindow == 'windowform'){
					windowForm(resp, judulwindow, lebar, tinggi);
				}else if(stswindow == 'windowpanel'){
					windowFormPanel(resp, judulwindow, lebar, tinggi);
				}else{
					$('#detil_nya_'+submodulnya).show();
					$('#detil_nya_'+submodulnya).html(resp);
				}
			});
		break;
		case "edit":
		case "delete":
			var row = $("#grid_"+submodulnya).datagrid('getSelected');
			if(row){
				if(type=='edit'){
					if(stswindow == undefined){
						$('#grid_nya_'+submodulnya).hide();
						$('#detil_nya_'+submodulnya).show();
					}
					$.post(urlpost, {'editstatus':'edit',id:row.id, 'tabel':table}, function(resp){
						if(stswindow == 'windowform'){
							windowForm(resp, judulwindow, lebar, tinggi);
						}else if(stswindow == 'windowpanel'){
							windowFormPanel(resp, judulwindow, lebar, tinggi);
						}else{
							$('#detil_nya_'+submodulnya).show();
							$('#detil_nya_'+submodulnya).html(resp);
						}
					});
				}
				else{
					if(confirm("Do You Want To Delete This Data ?")){
						loadingna();
						$.post(urldelete, {id:row.id,'editstatus':'delete'}, function(r){
							if(r==1){
								winLoadingClose();
								$.messager.alert('ABC System',"Row Data Was Deleted",'info');
								$('#grid_'+submodulnya).datagrid('reload');
							}
							else{
								winLoadingClose();
								console.log(r)
								$.messager.alert('ABC System',"Failed",'error');
							}
						});	
					}
				}
			}
			else{
				$.messager.alert('ABC System',"Select Row In Grid",'error');
			}
		break;
	}
}

function submit_form(frm,func){
	var url = jQuery('#'+frm).attr("url");
    jQuery('#'+frm).form('submit',{
            url:url,
            onSubmit: function(){
                  return $(this).form('validate');
            },
            success:function(data){
				//$.unblockUI();
                if (func == undefined ){
                     if (data == "1"){
                        pesan('Data Sudah Disimpan ','Sukses');
                    }else{
                         pesan(data,'Result');
                    }
                }else{
                    func(data);
                }
            },
            error:function(data){
				//$.unblockUI();
                 if (func == undefined ){
                     pesan(data,'Error');
                }else{
                    func(data);
                }
            }
    });
}
function genTab(div,mod,sub_mod,tab_array,div_panel,judul_panel,mod_num, height_panel, height_tab){
	var id_sub_mod=sub_mod.split("_");
	$(div_panel).panel({
		width:getClientWidth()-268,
		height:(typeof(height_panel) == "undefined" ? getClientHeight()-100 : height_panel),
		title:judul_panel,
		tools:[{
				iconCls:'icon-cancel',
				handler:function(){
					$('#grid_nya_'+id_sub_mod[1]).show();
					$('#detil_nya_'+id_sub_mod[1]).hide();
					$('#grid_'+id_sub_mod[1]).datagrid('reload');
				}
		}]
	}); 
	
	$(div).tabs({
		title:'AA',
		//height: getClientHeight()-190,
		height: (typeof(height_tab) == "undefined" ? getClientHeight()-190 : height_tab),
		width: getClientWidth()-280,
		plain: false,
		selected:0
	});
	
	if(tab_array.length > 0){
		for(var x in tab_array){
			var isi_tab=tab_array[x].replace(/ /g,"_");
			$(div).tabs('add',{
					title:tab_array[x],
					iconCls:'database',
					content:'<div style="padding: 5px;"><div id="'+isi_tab.toLowerCase()+'" style="height: 200px;">'+isi_tab.toLowerCase()+'</div></div>'
			});
		}
		$(div).tabs({
			onSelect: function(title){
				var isi_tab=title.replace(/ /g,"_");
				var par={};
				$('#'+isi_tab.toLowerCase()).html('').addClass('loading');
				urlnya = host+'home/modul/'+mod+'/'+isi_tab.toLowerCase();
				switch(mod){
					case "activity_master":
						par['par_1']=$('#par_1').val();
						par['par_2']=$('#par_2').val();
						par['par_3']=$('#par_3').val();
					break;
					case "model":
						par['par_1']=$('#id_activity').val();
					break;
					case "process_master":
						par['par_1']=$('#par_1').val();
						par['par_2']=$('#par_2').val();
					break;
					case "reference":
						urlnya = host+'homex/modul/'+mod+'/'+isi_tab.toLowerCase();
					break;
					//default:urlnya = host+'home/modul/'+mod+'/'+isi_tab.toLowerCase();
				}
				console.log(par);
					$.post(urlnya,par,function(r){
						//$('#'+isi_tab).html(isi_tab+' -> '+title);
						$('#'+isi_tab.toLowerCase()).removeClass('loading').html(r);
						//$('#'+isi_tab.toLowerCase()).html(r);
					});
				//console.log(title);
			}
		});
		var tab = $(div).tabs('select',0);
		
		
	}
	
}
function fillCombo(url, SelID, value, value2, value3, value4){
	
	if (value == undefined) value = "";
	if (value2 == undefined) value2 = "";
	if (value3 == undefined) value3 = "";
	if (value4 == undefined) value4 = "";
	
	$('#'+SelID).empty();
	$.post(url, {"v": value, "v2": value2, "v3": value3, "v4": value4},function(data){
		$('#'+SelID).append(data);
	});

}
function formatDate(date) {
	var bulan=date.getMonth() +1;
	var tgl=date.getDate();
	if(bulan < 10){
		bulan='0'+bulan;
	}
	
	if(tgl < 10){
		tgl='0'+tgl;
	}
	return date.getFullYear() + "-" + bulan + "-" + tgl;
}

function kumpulAction(type, p1, p2, p3){
	switch(type){
		case 'changemodul':
			var param = $('#modul_reference').val();
			if(param == ""){
				$('#template').html("");
			}else{
				var textnya = $('#modul_reference option:selected').text();
				var htmlnya = "<a style='text-decoration:none;' href='"+host+"homex/download/"+param+"' target='_blank' >Template "+textnya+"</a>";
				$('#template').html(htmlnya);
			}
		break;
		case "userrole":
			$.post(host+'homex/modul/setting/form_user_role', {'id':p1, 'editstatus':'add'}, function(resp){
				var lebar = getClientWidth()-500;
				var tinggi = getClientHeight()-200;
				windowForm(resp, "User Group Role Privilleges", lebar, tinggi);
			});
		break;
	}
}		

function clear_form(id){
	$('#'+id).find("input[type=text], textarea,select").val("");
	$('.angka').numberbox('setValue',0);
}

var divcontainerz;
function windowLoading(html,judul,width,height){
    divcontainerz = "win"+Math.floor(Math.random()*9999);
    $("<div id="+divcontainerz+"></div>").appendTo("body");
    divcontainerz = "#"+divcontainerz;
    $(divcontainerz).html(html);
    $(divcontainerz).css('padding','5px');
    $(divcontainerz).window({
       title:judul,
       width:width,
       height:height,
       autoOpen:false,
       modal:true,
       maximizable:false,
       resizable:false,
       minimizable:false,
       closable:false,
       collapsible:false,  
    });
    $(divcontainerz).window('open');        
}
function winLoadingClose(){
    $(divcontainerz).window('close');
    //$(divcontainer).html('');
}
function loadingna(){
	windowLoading("<img src='"+host+"__assets/images/loading.gif' style='position: fixed;top: 50%;left: 50%;margin-top: -10px;margin-left: -25px;'/>","Please Wait",200,100);
}

function transfer_data(from,to,grid_id_from,grid_id_to){
	var row=$('#'+grid_id_from).datagrid('getSelected');
	var post={};
		
		if(row){
			//console.log(row_emp.id);
			loadingna();
			switch(to){
				case "tbl_emp_act":
					post['editstatus']='add';
					post['tbl_emp_id']=row.id;
				break;
				case "tbl_are":
					post['editstatus']='add';
					post['tbl_emp_id']=row.id;
					post['tbl_acm_id']=$('#id_activity').val();
					post['bulan']=$('#bulan_emp').val();
					post['tahun']=$('#tahun_emp').val();
				break;
				case "tbl_emp":
					to="tbl_emp_act";
					post['editstatus']='delete';
					post['id']=row.id;
				break;
				case "tbl_are_emp":
					to="tbl_are";
					post['editstatus']='delete';
					post['id']=row.id;
				break;
				case "tbl_efx":
					post['editstatus']='add';
					post['tbl_exp_id']=row.id;
				break;
				case "tbl_exp":
					to="tbl_efx";
					post['editstatus']='delete';
					post['id']=row.id;
				break;
				case "tbl_acm":
					to="tbl_bpd";
					post['editstatus']='delete';
					post['id']=row.id;
				break;
				case "tbl_bpd":
					post['editstatus']='add';
					post['tbl_acm_id']=row.id;
				break;
			}
			
			$.post(host+'home/simpansavedata/'+to,post,function(r){
				if(r==1){
					winLoadingClose();
					$('#'+grid_id_to).edatagrid('reload');
				}
				else{
					winLoadingClose();
					$.messager.alert('ABC System',"Transfer Data Failed",'error');
					console.log(r);
				}
			});
		}
		else{
			$.messager.alert('ABC System',"Please Select List",'error');
		}
	
}
function aktif_non(id,sts){
	loadingna();
		$.post(host+'home/set_model',{id:id,status:sts},function(r){
			var resp=JSON.parse(r);
			//if(r==1){
					$("#grid_100").datagrid('reload');
					//console.log(resp.id);
					$('#model_na').html(resp.nama_model.toUpperCase());
					winLoadingClose();
			//}
			//else{
				//alert(r);winLoadingClose();	
			//}
		});
}
