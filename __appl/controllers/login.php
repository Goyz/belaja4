<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class Login extends KSO_Controller {
	
	function __construct(){
		parent::__construct();
		$this->load->library('encrypt');
	}
	
	public function index(){
		
		$user=$this->db->escape_str($this->input->post('user'));
		$pass=$this->db->escape_str($this->input->post('pwd'));
		$error=false;
		if($user && $pass){
			$cek_user=$this->mhome->getdata('data_login',$user);
			if(count($cek_user)>0){
				if(isset($cek_user['status']) && $cek_user['status']==1){
					//if($pass==$this->encrypt->decode($cek_user['password'])){
						if($cek_user['is_login'] == 1){
							if((float)( time() - $cek_user['last_activity']) <= (float)$this->config->item('sess_expiration')){
								$error=true;
								$this->session->set_flashdata('error', 'USER Sudah Login Di Komputer Lain');
								return header("Location: {$this->host}");
							}
							else{
								$this->db->query("UPDATE tbl_user set is_login=0 where id='".$cek_user['id']."'");
							}
						}
						
						$this->db->query("UPDATE tbl_user set is_login=1,last_login=".time().",last_activity=".time()." where id='".$cek_user['id']."'");
						$this->db->query("INSERT INTO tbl_user_history (tbl_user_id,login_date) values (".$cek_user['id'].",'".date('Y-m-d H:i:s')."')");
						$cek_user['id_his']=$this->db->insert_id();
						unset($cek_user['password']);
						$this->session->set_userdata($this->config->item('user_data'), base64_encode(serialize($cek_user)));
					//}
					//else{
					//	$error=true;
					//	$this->session->set_flashdata('error', 'Password Invalid');
					//}
				}
				else{
					$error=true;
					$this->session->set_flashdata('error', 'USER Sudah Tidak Aktif Lagi');
				}
			}
			else{
				$error=true;
				$this->session->set_flashdata('error', 'User Tidak Terdaftar');
			}
			//if(isset($cek_u))
		}
		else{
			$error=true;
			$this->session->set_flashdata('error', 'Isi User Dan Password');
		}
		header("Location: {$this->host}");
	
		
	}
	
	function logout(){
		
		$this->session->unset_userdata($this->config->item('user_data'), 'limit');
		//$this->session->unset_userdata($this->config->item('modeling'), 'limit');
		$this->session->sess_destroy();
		$this->db->query("UPDATE tbl_user set is_login=0 where id='".$this->auth['id']."'");
		$this->db->query("UPDATE tbl_user_history set last_login='".date('Y-m-d H:i:s')."' where id='".$this->auth['id_his']."'");
		header("Location: " . $this->host);
	}

}
