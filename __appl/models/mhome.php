<?php if (!defined('BASEPATH')) {exit('No direct script access allowed');}

class mhome extends CI_Model{
	function __construct(){
		parent::__construct();
		$this->auth = unserialize(base64_decode($this->session->userdata($this->config->item('user_data'))));
	}
	
	function getdata($type="", $p1="", $p2="",$p3="",$p4=""){
		$where = " WHERE 1=1 ";
		switch($type){
			case "data_login":
				$sql = "
					SELECT A.nama_user,A.is_login,A.last_activity,A.last_login,A.status,A.cl_user_group_id,E.group_user,B.*,D.jabatan
					FROM tbl_user A 
					LEFT JOIN cl_karyawan B ON B.tbl_user_id=A.nama_user
					LEFT JOIN tbl_karyawan_status C ON B.NIK=C.NIK
					LEFT JOIN cl_jabatan D ON C.jabatan=D.kode 
					LEFT JOIN cl_user_group E ON A.cl_user_group_id=E.id
					WHERE A.nama_user= '".$p1."'
				";
				return $this->result_query($sql,'row_array');
			break;
			case "menu":
				$sql="SELECT a.tbl_menu_id,b.nama_menu,b.deskripsi 
						FROM tbl_prev_group a
						LEFT JOIN tbl_menu b ON a.tbl_menu_id = b.id 
						WHERE a.cl_user_group_id=".$this->auth['cl_user_group_id']." AND b.type_menu='P' AND b.status=1";
				$parent=$this->result_query($sql);
				$menu=array();
				foreach($parent as $v){
					$menu[$v['tbl_menu_id']]=array();
					$menu[$v['tbl_menu_id']]['parent']=$v['nama_menu'];
					$menu[$v['tbl_menu_id']]['child']=array();
					$sql="SELECT a.tbl_menu_id,b.nama_menu,b.url,b.icon_menu,b.deskripsi 
						FROM tbl_prev_group a
						LEFT JOIN tbl_menu b ON a.tbl_menu_id = b.id 
						WHERE a.cl_user_group_id=".$this->auth['cl_user_group_id']." AND b.status=1 AND b.parent_id=".$v['tbl_menu_id'];
					$child=$this->result_query($sql);
						foreach($child as $x){
							$menu[$v['tbl_menu_id']]['child'][$x['tbl_menu_id']]=array();
							$menu[$v['tbl_menu_id']]['child'][$x['tbl_menu_id']]['menu']=$x['nama_menu'];
							$menu[$v['tbl_menu_id']]['child'][$x['tbl_menu_id']]['url']=$x['url'];
							$menu[$v['tbl_menu_id']]['child'][$x['tbl_menu_id']]['icon_menu']=$x['icon_menu'];
							$menu[$v['tbl_menu_id']]['child'][$x['tbl_menu_id']]['deskripsi']=$x['deskripsi'];
						}
					
				}
				
				return $menu;	
				
			break;
			case "tbl_kursus":
				$sql="SELECT ROW_NUMBER() OVER (ORDER BY A.id DESC) as rowID,A.*,B.kategori_kursus 
						FROM tbl_kursus A
						LEFT JOIN cl_kategori_kursus B ON A.cl_kategori_kursus_id=B.id 
						".$where." AND A.create_by='".$this->auth['nama_user']."'";
			break;
		}
		return $this->result_query($sql,'json');
	}
	
	
	
	
	function result_query($sql,$type="",$table=""){
		switch($type){
			case "json":
				/*$page = (integer) (($this->input->post('page')) ? $this->input->post('page') : "1");
				$limit = (integer) (($this->input->post('rows')) ? $this->input->post('rows') : "10");
				$count = $this->db->query($sql)->num_rows();
				
				if( $count >0 ) { $total_pages = ceil($count/$limit); } else { $total_pages = 0; } 
				if ($page > $total_pages) $page=$total_pages; 
				$start = $limit*$page - $limit; // do not put $limit*($page - 1)
				if($start<0) $start=0;
				 
				if($table == 'tbl_loc'){
					$sql .= " ORDER BY A.costcenter ASC ";
				}
				$sql = $sql . " LIMIT $start,$limit";
				*/
				$page = (integer) (($this->input->post('page')) ? $this->input->post('page') : "1");
				$limit = (integer) (($this->input->post('rows')) ? $this->input->post('rows') : "10");
				$count = $this->db->query($sql)->num_rows();

				if( $count > 0) {$total_pages = ceil($count/$limit); } else { $total_pages = 0; } 
				if ($page > $total_pages) $page = $total_pages; 
				 
				$end = $page * $limit; 
				$start = $end - $limit + 1;
				if($start < 0) $start = 0;
				$sql = "
					SELECT * FROM (
							".$sql."
					) AS X WHERE X.rowID BETWEEN $start AND $end
				";
					
				$data=$this->db->query($sql)->result_array();  
						
				if($data){
				   $responce = new stdClass();
				   $responce->rows= $data;
				   $responce->total =$count;
				   return json_encode($responce);
				}else{ 
				   $responce = new stdClass();
				   $responce->rows = 0;
				   $responce->total = 0;
				   return json_encode($responce);
				} 
			break;
			case "row_obj":return $this->db->query($sql)->row();break;
			case "row_array":return $this->db->query($sql)->row_array();break;
			default:return $this->db->query($sql)->result_array();break;
		}
	}
	
	function simpansavedata($table,$data,$sts_crud){ //$sts_crud --> STATUS NYEE INSERT, UPDATE, DELETE
		$this->db->trans_begin();
		if(isset($data['id']))unset($data['id']);
		switch ($table){
			
		}
		
		switch ($sts_crud){
			case "add":
				$this->db->insert($table,$data);
			break;
			case "edit":
				$this->db->where($array_where);
				$this->db->update($table,$data);
			break;
			case "delete":
				$this->db->where('id',$this->input->post('id'));
				$this->db->delete($table);
			break;
		}
		
		if($this->db->trans_status() == false){
			$this->db->trans_rollback();
			return 0;
		} else{
			return $this->db->trans_commit();
		}
		
	}	
}