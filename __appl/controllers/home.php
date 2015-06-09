<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');

class home extends KSO_Controller {
	
	function __construct(){
		parent::__construct();
		$this->cek_user();		
	}
	
	public function index(){
		
		if($this->auth){
			$this->modul('awal');
		}
	
	}
	
	private function cek_user(){
		
		if(!$this->auth){
			if($this->session->flashdata('error')){
				$this->smarty->assign("error", $this->session->flashdata('error'));
			}
			$this->smarty->display('main-login.html');
		}
	}
	
	function modul($mod,$p2="",$p3="",$p4=""){
		//print_r($this->modeling);exit;
		//echo $this->modeling['id'];exit;
		
		if($this->auth){
			switch($mod){
				case "awal":
					$menu=$this->get_menu();
					$this->smarty->assign('menu',$menu);
					return $this->smarty->display('index.html');
				break;
			}
			$this->smarty->assign('mod',$mod);
			$this->smarty->assign('main',$p2);
			$this->smarty->assign('sub_mod',$p3);
			$temp=$mod.'/'.$p2.'.html';
			//echo $this->config->item('appl').APPPATH.'views/'.$temp;
			if(!file_exists($this->config->item('appl').APPPATH.'views/'.$temp)){$this->smarty->display('konstruksi.html');}
			else{$this->smarty->display($temp);}
			
		}
		else{
			$this->index();
		}
	}
	
	function get_menu(){
		return $menu=$this->mhome->getdata('menu');
	}
	
	function getdata($p1,$p2=""){
		echo $this->mhome->getdata($p1,$p2);
	}
	
	function simpansavedata($type="",$sts=""){
		$post = array();
        foreach($_POST as $k=>$v){
			if($this->input->post($k)!=""){
				$post[$k] = $this->db->escape_str($this->input->post($k));
			}
			
		}
		
		if(isset($post['editstatus'])){$editstatus = $post['editstatus'];unset($post['editstatus']);}
		else $editstatus = $sts;
		echo $this->mhome->simpansavedata($type, $post, $editstatus);
	}
}
