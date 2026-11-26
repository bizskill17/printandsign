<?php
/** Run: php tests/complaints-test.php. No WordPress installation required. */
define('ABSPATH', __DIR__.'/');
require dirname(__DIR__).'/includes/complaints.php';
class RequestStopped extends RuntimeException {}
class Redirected extends RuntimeException {}
function wp_die($message){throw new RequestStopped($message);}
function wp_safe_redirect($url){throw new Redirected($url);}
function is_user_logged_in(){return true;}
function current_user_can($cap){return $cap==='bsoerp_access'||($GLOBALS['manager']??false);}
function get_current_user_id(){return 5;}
function wp_verify_nonce($nonce,$action){return $nonce==='valid';}
function wp_unslash($value){return $value;}
function sanitize_text_field($value){return trim(strip_tags($value));}
function sanitize_textarea_field($value){return trim(strip_tags($value));}
function absint($value){return abs((int)$value);}
function esc_html($value){return htmlspecialchars((string)$value,ENT_QUOTES);}
function esc_attr($value){return esc_html($value);}
function esc_url($value){return $value;}
function wp_json_encode($value){return json_encode($value);}
function add_query_arg($key,$value,$url){return $url.'?'.$key.'='.$value;}
function selected($a,$b,$echo=true){return $a==$b?'selected':'';}
function checked($a,$b,$echo=true){return $a==$b?'checked':'';}
function wp_get_current_user(){return (object)['display_name'=>'Test User'];}
function admin_url($path){return '/'.$path;}
function wp_nonce_field($action,$key){echo '<input name="nonce" value="valid">';}
function wp_get_attachment_url($id){return '';}
class MemoryDB {
 public $rows=[],$insert_id=0,$fail_update=false,$queries=[];private $snapshot;
 function prepare($sql,...$args){if(count($args)===1&&is_array($args[0]))$args=$args[0];foreach($args as $arg)$sql=preg_replace('/%[ds]/',is_int($arg)?(string)$arg:"'".str_replace("'","''",$arg)."'",$sql,1);return $sql;}
 function insert($table,$data){$this->insert_id=count($this->rows)+1;$this->rows[$this->insert_id]=(object)array_merge(['id'=>$this->insert_id,'parent_id'=>0,'reference_no'=>''],$data);return 1;}
 function update($table,$data,$where){if($this->fail_update)return false;foreach($data as $k=>$v)$this->rows[$where['id']]->$k=$v;return 1;}
 function get_row($sql){preg_match('/id=(\d+)/',$sql,$m);$r=$this->rows[(int)($m[1]??0)]??null;if(str_contains($sql,"record_type='complaint'")&&$r&&$r->record_type!=='complaint')return null;return $r?clone $r:null;}
 function query($sql){$this->queries[]=$sql;if($sql==='START TRANSACTION')$this->snapshot=unserialize(serialize($this->rows));if($sql==='ROLLBACK')$this->rows=$this->snapshot;return 1;}
 function get_results($sql){$this->queries[]=$sql;return [];}
 function get_var($sql){$this->queries[]=$sql;return 0;}
 function get_col($sql){return [];}
 function esc_like($value){return addcslashes($value,'_%\\');}
}
class TestERP {
 use BSOERP_Complaints;
 const NONCE='test';public $allowed=true,$master_id=7;
 function t($name){return 'erp_'.$name;}
 function can_view_slug($view){return $this->allowed;}
 function current_master_user_id(){return $this->master_id;}
 function master_options($type){return [(object)['id'=>$type==='customer'?3:7,'title'=>'Sample','meta'=>'{"mobile":"9876543210"}']];}
 function url($view){return '/'.$view;}
 function master_name_by_id($id){return 'Customer';}
 function task_user_display_name($id){return 'Assignee';}
 function user_display_name($id){return 'User '.$id;}
 function pagination_size(){return 25;}
 function pagination_controls(...$args){}
 function flat(){return ['complaints-pending'=>'Pending','complaints-master'=>'Master','complaints-update-log'=>'Update Log'];}
}
function assert_true($value,$message){if(!$value)throw new RuntimeException('FAIL: '.$message);echo 'PASS: '.$message."\n";}
function request($call,$expected){try{$call();throw new RuntimeException('Request did not stop');}catch(RequestStopped|Redirected $e){assert_true(str_contains($e->getMessage(),$expected),$expected);}}
$wpdb=new MemoryDB();$erp=new TestERP();
$base=['nonce'=>'valid','complaint_date'=>'2026-11-26','complaint_type'=>'Repairing','priority'=>'High','mobile'=>'9876543210','description'=>'Light not working','customer_id'=>3,'assigned_to'=>7];
$_POST=$base;$_POST['mobile']='123';request(fn()=>$erp->save_complaint(),'10 digits');assert_true(count($wpdb->rows)===0,'Invalid add does not write');
$_POST=$base;$_POST['complaint_date']='2026-02-30';request(fn()=>$erp->save_complaint(),'valid Complaint Date');
$_POST=$base;$_POST['assigned_to']=999;request(fn()=>$erp->save_complaint(),'valid user');
$_POST=$base;request(fn()=>$erp->save_complaint(),'/complaints-pending');$r=$wpdb->rows[1];assert_true($r->status==='Inprogress'&&$r->reference_no==='CR-00001','New record has Inprogress status and reference');
assert_true($erp->complaint_meta($r)['type']==='Repairing','Type saved');
$_POST=['nonce'=>'valid','complaint_id'=>1,'complaint_status'=>'Inprogress','remarks'=>'Inspected site','expected_updated_at'=>$r->updated_at,'updated_by'=>999];request(fn()=>$erp->update_complaint(),'/complaints-pending');
assert_true(count($wpdb->rows)===2&&$wpdb->rows[2]->created_by===5,'Update appends history with authenticated user');
$first=$wpdb->rows[2]->notes;$_POST['expected_updated_at']=$wpdb->rows[1]->updated_at;$_POST['complaint_status']='Completed';$_POST['remarks']='Replaced lighting';request(fn()=>$erp->update_complaint(),'/complaints-master');assert_true($wpdb->rows[1]->status==='Completed'&&$wpdb->rows[2]->notes===$first&&count($wpdb->rows)===3,'Completed keeps earlier history');
$_POST['expected_updated_at']='2000-01-01 00:00:00';request(fn()=>$erp->update_complaint(),'changed');assert_true(count($wpdb->rows)===3,'Stale update does not append history');
$erp->master_id=99;request(fn()=>$erp->update_complaint(),'cannot update');$erp->master_id=7;
$erp->allowed=false;request(fn()=>$erp->update_complaint(),'cannot update');$erp->allowed=true;
$_POST['expected_updated_at']=$wpdb->rows[1]->updated_at;$wpdb->fail_update=true;request(fn()=>$erp->update_complaint(),'Unable to update');assert_true(count($wpdb->rows)===3,'Failed parent status write rolls back history');$wpdb->fail_update=false;
$_POST['nonce']='bad';request(fn()=>$erp->update_complaint(),'Invalid request');
$_GET=[];ob_start();$erp->complaint_listing('complaints-pending');ob_end_clean();assert_true((bool)array_filter($wpdb->queries,fn($q)=>str_contains($q,"r.status='Inprogress'")),'Pending excludes Completed');
ob_start();$erp->complaint_listing('complaints-update-log');ob_end_clean();assert_true((bool)array_filter($wpdb->queries,fn($q)=>str_contains($q,"r.record_type='complaint-update'")),'Update Log uses history records');
ob_start();$erp->complaint_add_form();$html=ob_get_clean();assert_true(str_contains($html,'value="Complaint"')&&str_contains($html,'value="Repairing"')&&!str_contains($html,'Warranty'),'Add form contains approved Type buttons without removed fields');
echo "All complaint checks passed.\n";
