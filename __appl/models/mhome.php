<?php if (!defined('BASEPATH')) {exit('No direct script access allowed');}

class mhome extends CI_Model{
	function __construct(){
		parent::__construct();
		$this->load->library('encrypt');
		$this->auth = unserialize(base64_decode($this->session->userdata($this->config->item('user_data'))));
	}
	
	function getdata($type="", $p1="", $p2="",$p3="",$p4=""){
		$where = " WHERE 1=1 ";
		switch($type){
			case "data_login":
				$sql = "
					SELECT A.nama_user,A.pwd,A.is_login,A.last_activity,A.last_login,A.status,A.cl_user_group_id,E.group_user,B.*,D.jabatan
					FROM tbl_user A 
					LEFT JOIN cl_karyawan B ON B.tbl_user_id=A.nama_user
					LEFT JOIN tbl_karyawan_status C ON B.NIK=C.NIK
					LEFT JOIN cl_jabatan D ON C.jabatan=D.kode 
					LEFT JOIN cl_user_group E ON A.cl_user_group_id=E.id
					WHERE A.nama_user= '".$p1."' OR B.NIK='".$p1."' AND A.status=1
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
						WHERE a.cl_user_group_id=".$this->auth['cl_user_group_id']." AND b.status=1 AND b.parent_id=".$v['tbl_menu_id']." 
						ORDER BY B.sort_na ";
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
			case "cl_karyawan":
				$status=$this->input->post('editstatus');
				$key=$this->input->post('key');
				if($key){$where .=" AND A.Nama like '%".$key."%' OR A.NIK like '%".$key."%' ";}
				$sql="SELECT ROW_NUMBER() OVER (ORDER BY A.NIK DESC) as rowID, 
						A.*,B.jabatan,C.nama_user,C.pwd,C.cl_user_group_id,C.status 
						FROM cl_karyawan A
						LEFT JOIN cl_jabatan B ON A.cl_jabatan_kode=B.kode
						LEFT JOIN tbl_user C ON A.tbl_user_id=C.nama_user ".$where;
						
				if($status=='edit'){
					$sql .=" AND A.NIK='".$p1."'";
					return  $this->result_query($sql,'row_array');
				}		
				
			break;
			case "tbl_user_2":
				$status=$this->input->post('editstatus');
				
			
				$sql="SELECT ROW_NUMBER() OVER (ORDER BY A.NIK DESC) as rowID,A.*,B.jabatan 
						FROM cl_karyawan A
						LEFT JOIN cl_jabatan B ON A.cl_jabatan_kode=B.kode ".$where;
						
				if($status=='edit'){
					$sql .=" AND A.NIK='".$p1."'";
					return  $this->result_query($sql,'row_array');
				}		
				
			break;
			case "tbl_user":
				$select="";
				$join="";
				$group=$this->input->post('cl_user_group_id');
				$where .=" AND A.cl_user_group_id=".$group;
				switch($group){
					case 1:
					case 3:
					case 4:
						$select .=",B.Nama,B.Alamat,B.Email,B.NIK,B.TempatLahir,B.Tgl_Lahir";
						$join .="LEFT JOIN cl_karyawan B ON B.tbl_user_id=A.nama_user";
						
					break;
					case 2:
						$select .=",B.nama_lengkap,B.alamat,B.email,B.foto,B.telp";
						$join .="LEFT JOIN cl_instruktur B ON B.tbl_user_id=A.nama_user";
					break;
				}
				
				
				$sql="SELECT A.*,ROW_NUMBER() OVER (ORDER BY A.nama_user DESC) as rowID ".$select."
						FROM tbl_user A	".$join.$where;
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
			case "cl_karyawan":
				//print_r($data);exit;
				if($sts_crud!='delete'){
					$status_user=$this->input->post('status');
					$pwd=$this->encrypt->encode($this->input->post('pwd'));
					$userName=$data['nama_user'];
					$data_user=array('nama_user'=>$data['nama_user'],
									'pwd'=>$pwd,
									'cl_user_group_id'=>$data['cl_user_group_id']
					);
					if($status_user){
						$data_user['status']=1;
					}
					
						$get_user=$this->db->get_where('tbl_user',array('nama_user'=>$data['nama_user']))->row('nama_user');
						if($get_user){
							unset($data_user['nama_user']);
							$this->db->where('nama_user',$data['nama_user']);
							$this->db->update('tbl_user',$data_user);
						}else{
							$this->db->insert('tbl_user',$data_user);
						}
					if($sts_crud=='edit'){
						unset($data['NIK']);
						$array_where=array('NIK'=>$this->input->post('NIK'));
					}
					$data['tbl_user_id']=$data['nama_user'];
					unset($data['nama_user']);unset($data['pwd']);unset($data['cl_user_group_id']);unset($data['status']);
				}
				else{
						$user=$this->db->get_where('cl_karyawan',array('NIK'=>$this->input->post('id')))->row('tbl_user_id');
						//echo $this->db->last_query();exit;
						//echo $user;exit;
						if(isset($user)){
							$this->db->where('nama_user',$user);
							$this->db->delete('tbl_user');
							
						}
						$array_where=array('NIK'=>$this->input->post('id'));
				}
				
			break;
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
				if($table=='cl_karyawan'){
					$this->db->where($array_where);
				}
				else{
					$this->db->where('id',$this->input->post('id'));
				}
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