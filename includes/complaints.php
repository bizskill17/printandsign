<?php
/** Complaints and repairs: records and immutable update history share the ERP records store. */
if (!defined('ABSPATH')) exit;
trait BSOERP_Complaints {
 function complaint_routes(){return ['add-complaint','complaints-pending','complaints-master','complaints-update-log'];}
 function complaint_manager(){return current_user_can('bsoerp_manage')||current_user_can('manage_options');}
 function complaint_record($id){global $wpdb;return $wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->t('records')} WHERE id=%d AND module='complaints' AND record_type='complaint'",$id));}
 function complaint_can_update($r){return $r&&($this->complaint_manager()||((int)$r->assigned_to===$this->current_master_user_id()&&$this->current_master_user_id()>0))&&($this->can_view_slug('complaints-pending')||$this->can_view_slug('complaints-master'));}
 function complaint_now(){return (new DateTimeImmutable('now',new DateTimeZone('Asia/Kolkata')))->format('Y-m-d H:i:s');}
 function complaint_meta($r){$m=json_decode((string)$r->meta,true);return is_array($m)?$m:[];}
 function complaint_time($value,$date_only=false){$d=DateTimeImmutable::createFromFormat($date_only?'!Y-m-d':'Y-m-d H:i:s',(string)$value,new DateTimeZone('Asia/Kolkata'));return $d?$d->format($date_only?'d/m/Y':'d/m/Y g:i A').' '.($date_only?'':'IST'):'';}
 function complaint_choice($name,$label,$values,$selected){
  echo '<fieldset class="cr-choice"><legend>'.esc_html($label).' *</legend><div class="cr-buttons">';
  foreach($values as $v)echo '<label class="cr-option cr-'.esc_attr(strtolower($v)).'"><input type="radio" name="'.esc_attr($name).'" value="'.esc_attr($v).'" '.checked($v,$selected,false).' required><span>'.($name==='complaint_status'&&$v==='Completed'?'<i aria-hidden="true">✓</i> ':'').esc_html($v).'</span></label>';
  echo '</div></fieldset>';
 }
 function complaint_select($name,$label,$type,$selected=0,$required=true){
  echo '<label><span>'.esc_html($label).($required?' *':'').'</span><select class="erp-searchable" name="'.esc_attr($name).'" '.($required?'required':'').'><option value="">Select '.esc_html(strtolower($label)).'</option>';
  foreach($this->master_options($type) as $r){$m=$this->complaint_meta($r);echo '<option value="'.(int)$r->id.'" data-mobile="'.esc_attr($m['mobile']??'').'" '.selected($selected,$r->id,false).'>'.esc_html($r->title.($type==='customer'&&!empty($m['mobile'])?' | '.$m['mobile']:'')).'</option>';}
  echo '</select></label>';
 }
 function complaint_form_start($action){echo '<form class="erp-form cr-form" method="post" enctype="multipart/form-data" action="'.esc_url(admin_url('admin-post.php')).'">';wp_nonce_field(self::NONCE,'nonce');echo '<input type="hidden" name="action" value="'.esc_attr($action).'">';}
 function complaint_documents($ids){foreach((array)$ids as $id){$url=wp_get_attachment_url(absint($id));if($url)echo '<a class="cr-document" href="'.esc_url($url).'" target="_blank" rel="noopener">📎 '.esc_html(get_the_title($id)?:'Document').'</a> ';}}
 function complaint_summary($r){$m=$this->complaint_meta($r);echo '<div class="cr-summary"><strong>'.esc_html($r->reference_no.' | '.$this->master_name_by_id($r->customer_id).' | '.($m['type']??'')).'</strong><p>'.nl2br(esc_html($r->notes)).'</p><div>'.esc_html($this->complaint_time($r->record_date,true).' | '.($m['mobile']??'').' | '.($m['priority']??'').' | Assigned To: '.$this->task_user_display_name($r->assigned_to).' | '.$r->status).'</div>'; $this->complaint_documents($m['documents']??[]);echo '</div>';}
 function complaint_view($view){
  if($view==='add-complaint')return $this->complaint_add_form();
  if(!empty($_GET['update_complaint'])){$r=$this->complaint_record(absint($_GET['update_complaint']));if(!$this->complaint_can_update($r)) {echo '<div class="notice">You cannot update this record.</div>';return;}return $this->complaint_update_form($r);}
  if(!empty($_GET['complaint'])){$r=$this->complaint_record(absint($_GET['complaint']));if(!$r){echo '<div class="notice">Record not found.</div>';return;}echo '<div class="panel"><h2>Complaint / Repairing Details</h2>';$this->complaint_summary($r);$this->complaint_history($r->id);echo '<a class="btn" href="'.esc_url($this->url($view)).'">Back</a></div>';return;}
  return $this->complaint_listing($view);
 }
 function complaint_upload_field($label,$wide=false){
  echo '<div class="cr-upload-field'.($wide?' cr-wide':'').'"><span class="cr-field-label">'.esc_html($label).'</span><label class="cr-upload"><input type="file" name="documents[]" multiple aria-label="'.esc_attr($label).'"><span class="cr-upload-icon" aria-hidden="true">';
  echo '<svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><path d="M7 17H6a4 4 0 0 1-.5-7.97A6.5 6.5 0 0 1 18 8a4.5 4.5 0 0 1 .5 9H17M12 20V10m-4 4 4-4 4 4"/></svg></span><span class="cr-upload-text">Click to upload photos or documents</span><span class="cr-upload-button">Choose Files</span></label><small class="cr-upload-files" aria-live="polite"></small></div>';
 }
 function complaint_add_form(){
  echo '<div class="panel form-panel cr-panel cr-add-panel">';$this->complaint_form_start('bsoerp_save_complaint');echo '<div class="form-grid cr-grid">';
  echo '<label><span>Complaint Date *</span><input type="date" name="complaint_date" value="'.esc_attr(substr($this->complaint_now(),0,10)).'" required></label>';
  $this->complaint_choice('complaint_type','Type',['Complaint','Repairing'],'Complaint');
  $this->complaint_select('assigned_to','Assigned To','user');
  $this->complaint_select('customer_id','Customer','customer');
  echo '<label><span>Mobile *</span><input type="tel" name="mobile" inputmode="numeric" pattern="[0-9]{10}" minlength="10" maxlength="10" title="Enter a 10-digit mobile number" required></label>';
  $this->complaint_choice('priority','Priority',['Low','Medium','High','Urgent'],'Medium');
  echo '<label class="cr-wide"><span>Complaint Description *</span><textarea name="description" rows="4" placeholder="Enter complaint / repairing details" required></textarea></label>';
  $this->complaint_upload_field('Document',true);
  echo '</div><div class="form-actions"><a class="btn" href="'.esc_url($this->url('complaints-pending')).'">Cancel</a><button class="btn primary" type="submit"><span aria-hidden="true">✓</span> Save</button></div></form></div>';
 }
 function complaint_update_form($r){
  $m=$this->complaint_meta($r);
  echo '<div class="panel form-panel cr-panel cr-update-panel"><div class="cr-update-summary"><div class="cr-update-summary-main"><strong>'.esc_html($r->reference_no).'</strong><span class="cr-summary-type">'.esc_html($m['type']??'').'</span><span>'.esc_html($this->master_name_by_id($r->customer_id)).'</span><span>'.esc_html($m['mobile']??'').'</span></div><div class="cr-update-summary-details"><div><strong>Description:</strong> '.nl2br(esc_html($r->notes)).'</div><div><strong>Assigned To:</strong> '.esc_html($this->task_user_display_name($r->assigned_to)).'</div></div></div>';
  $this->complaint_form_start('bsoerp_update_complaint');
  echo '<input type="hidden" name="complaint_id" value="'.(int)$r->id.'"><input type="hidden" name="expected_updated_at" value="'.esc_attr($r->updated_at).'"><div class="form-grid cr-grid">';
  $this->complaint_choice('complaint_status','Status',['Inprogress','Completed'],$r->status);
  echo '<label class="cr-update-by"><span>Update By</span><div class="cr-locked-input"><input type="text" value="'.esc_attr(wp_get_current_user()->display_name).'" readonly aria-readonly="true"><svg aria-hidden="true" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7"><rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3"/></svg></div></label><label class="cr-wide"><span>Update Remarks *</span><textarea name="remarks" rows="4" placeholder="Enter work done / latest update" required></textarea></label>';
  $this->complaint_upload_field('Update Document',true);
  echo '</div><div class="form-actions"><a class="btn" href="'.esc_url($this->url('complaints-pending')).'">Cancel</a><button class="btn primary" type="submit"><span aria-hidden="true">✓</span> Save Update</button></div></form></div>';
 }
 function complaint_history($id){
  global $wpdb;$rows=$wpdb->get_results($wpdb->prepare("SELECT * FROM {$this->t('records')} WHERE module='complaints' AND record_type='complaint-update' AND parent_id=%d ORDER BY id DESC",$id));echo '<h3>Update History</h3><div class="table-wrap"><table class="data"><thead><tr><th>Update Date & Time</th><th>Status</th><th>Update Remarks</th><th>Update By</th><th>Update Document</th></tr></thead><tbody>';
  foreach($rows as $u){$m=$this->complaint_meta($u);echo '<tr><td>'.esc_html($this->complaint_time($u->created_at)).'</td><td>'.esc_html($u->status).'</td><td class="cr-text">'.nl2br(esc_html($u->notes)).'</td><td>'.esc_html($this->user_display_name($u->created_by)).'</td><td>';$this->complaint_documents($m['documents']??[]);echo '</td></tr>';}
  if(!$rows)echo '<tr><td colspan="5">No updates yet.</td></tr>';echo '</tbody></table></div>';
 }
 function complaint_uploads(){
  $files=$_FILES['documents']??null;$ids=[];if(!$files||empty($files['name']))return $ids;
  require_once ABSPATH.'wp-admin/includes/file.php';require_once ABSPATH.'wp-admin/includes/media.php';require_once ABSPATH.'wp-admin/includes/image.php';
  foreach((array)$files['name'] as $i=>$name){if(($files['error'][$i]??UPLOAD_ERR_NO_FILE)===UPLOAD_ERR_NO_FILE)continue;
   $_FILES['cr_document']=['name'=>$name,'type'=>$files['type'][$i]??'','tmp_name'=>$files['tmp_name'][$i]??'','error'=>$files['error'][$i]??UPLOAD_ERR_NO_FILE,'size'=>$files['size'][$i]??0];
   $id=media_handle_upload('cr_document',0);unset($_FILES['cr_document']);
   if(is_wp_error($id)){foreach($ids as $saved)wp_delete_attachment($saved,true);wp_die('Document upload failed: '.esc_html($id->get_error_message()));}$ids[]=(int)$id;
  }return $ids;
 }
 function complaint_request_guard(){if(!is_user_logged_in()||!current_user_can('bsoerp_access')||!wp_verify_nonce($_POST['nonce']??'',self::NONCE))wp_die('Invalid request.');}
 function complaint_post($key){return sanitize_text_field(wp_unslash($_POST[$key]??''));}
 function save_complaint(){
  $this->complaint_request_guard();if(!$this->can_view_slug('add-complaint'))wp_die('Permission denied.');global $wpdb;
  $date=$this->complaint_post('complaint_date');$d=DateTimeImmutable::createFromFormat('!Y-m-d',$date);if(!$d||$d->format('Y-m-d')!==$date)wp_die('Enter a valid Complaint Date.');
  $type=$this->complaint_post('complaint_type');$priority=$this->complaint_post('priority');$mobile=$this->complaint_post('mobile');$description=sanitize_textarea_field(wp_unslash($_POST['description']??''));$customer=absint($_POST['customer_id']??0);$assigned=absint($_POST['assigned_to']??0);
  if(!in_array($type,['Complaint','Repairing'],true)||!in_array($priority,['Low','Medium','High','Urgent'],true)||!preg_match('/^[0-9]{10}$/',$mobile)||trim($description)==='')wp_die('Complete the required fields; Mobile must have 10 digits.');
  foreach(['customer'=>$customer,'user'=>$assigned] as $kind=>$id){$valid=false;foreach($this->master_options($kind) as $option)if((int)$option->id===$id)$valid=true;if(!$valid)wp_die('Select a valid '.esc_html($kind).'.');}
  $documents=$this->complaint_uploads();$now=$this->complaint_now();$wpdb->query('START TRANSACTION');
  try{
   $ok=$wpdb->insert($this->t('records'),['module'=>'complaints','record_type'=>'complaint','title'=>mb_substr($description,0,200),'customer_id'=>$customer,'assigned_to'=>$assigned,'status'=>'Inprogress','record_date'=>$date,'meta'=>wp_json_encode(['type'=>$type,'priority'=>$priority,'mobile'=>$mobile,'documents'=>$documents]),'notes'=>$description,'created_by'=>get_current_user_id(),'created_at'=>$now,'updated_at'=>$now]);if(!$ok)throw new RuntimeException('Unable to save complaint.');
   $id=(int)$wpdb->insert_id;$ref='CR-'.str_pad((string)$id,5,'0',STR_PAD_LEFT);if($wpdb->update($this->t('records'),['reference_no'=>$ref],['id'=>$id])===false)throw new RuntimeException('Unable to save reference.');$wpdb->query('COMMIT');
  }catch(Throwable $e){$wpdb->query('ROLLBACK');foreach($documents as $doc)wp_delete_attachment($doc,true);wp_die(esc_html($e->getMessage()));}
  $destination=$this->can_view_slug('complaints-pending')?'complaints-pending':'add-complaint';wp_safe_redirect(add_query_arg('notice','saved',$this->url($destination)));exit;
 }
 function update_complaint(){
  $this->complaint_request_guard();global $wpdb;$id=absint($_POST['complaint_id']??0);$r=$this->complaint_record($id);if(!$this->complaint_can_update($r))wp_die('You cannot update this record.');
  $status=$this->complaint_post('complaint_status');$remarks=sanitize_textarea_field(wp_unslash($_POST['remarks']??''));if(!in_array($status,['Inprogress','Completed'],true)||trim($remarks)==='')wp_die('Status and Update Remarks are required.');
  $documents=$this->complaint_uploads();$now=$this->complaint_now();$wpdb->query('START TRANSACTION');
  try{
   $locked=$wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->t('records')} WHERE id=%d FOR UPDATE",$id));
   if(!$this->complaint_can_update($locked))throw new RuntimeException('You cannot update this record.');
   if($locked->updated_at!==$this->complaint_post('expected_updated_at'))throw new RuntimeException('This complaint changed. Reload it before saving your update.');
   // Advance the revision even for two updates within the same second.
   if($now<=$locked->updated_at)$now=(new DateTimeImmutable($locked->updated_at,new DateTimeZone('Asia/Kolkata')))->modify('+1 second')->format('Y-m-d H:i:s');
   $ok=$wpdb->insert($this->t('records'),['module'=>'complaints','record_type'=>'complaint-update','parent_id'=>$id,'reference_no'=>$r->reference_no,'title'=>'Complaint Update','customer_id'=>$r->customer_id,'assigned_to'=>$r->assigned_to,'status'=>$status,'record_date'=>substr($now,0,10),'notes'=>$remarks,'meta'=>wp_json_encode(['documents'=>$documents,'type'=>$this->complaint_meta($r)['type']??'']),'created_by'=>get_current_user_id(),'created_at'=>$now,'updated_at'=>$now]);if(!$ok)throw new RuntimeException('Unable to save update history.');
   if($wpdb->update($this->t('records'),['status'=>$status,'updated_at'=>$now],['id'=>$id])===false)throw new RuntimeException('Unable to update complaint status.');$wpdb->query('COMMIT');
  }catch(Throwable $e){$wpdb->query('ROLLBACK');foreach($documents as $doc)wp_delete_attachment($doc,true);wp_die(esc_html($e->getMessage()));}
  $destination=$status==='Completed'&&$this->can_view_slug('complaints-master')?'complaints-master':($this->can_view_slug('complaints-pending')?'complaints-pending':'complaints-master');wp_safe_redirect(add_query_arg('notice','saved',$this->url($destination)));exit;
 }
 function complaint_delete_button($r,$view){
  echo '<form class="cr-delete-form" method="post" action="'.esc_url(admin_url('admin-post.php')).'">';wp_nonce_field(self::NONCE,'nonce');
  echo '<input type="hidden" name="action" value="bsoerp_delete_complaint"><input type="hidden" name="complaint_id" value="'.(int)$r->id.'"><input type="hidden" name="return_view" value="'.esc_attr($view).'"><button type="submit" class="btn cr-delete-action" title="Delete" aria-label="Delete"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/></svg></button></form>';
 }
 function delete_complaint(){
  $this->complaint_request_guard();if(!$this->complaint_manager())wp_die('Only administrators can delete complaints.');
  $view=$this->complaint_post('return_view');if(!in_array($view,['complaints-pending','complaints-master'],true)||!$this->can_view_slug($view))wp_die('Permission denied.');
  global $wpdb;$id=absint($_POST['complaint_id']??0);$wpdb->query('START TRANSACTION');
  try{
   $r=$wpdb->get_row($wpdb->prepare("SELECT * FROM {$this->t('records')} WHERE id=%d AND module='complaints' AND record_type='complaint' FOR UPDATE",$id));if(!$r)throw new RuntimeException('Complaint not found.');
   if($wpdb->delete($this->t('records'),['parent_id'=>$id,'module'=>'complaints','record_type'=>'complaint-update'])===false)throw new RuntimeException('Unable to delete complaint history.');
   if($wpdb->delete($this->t('records'),['id'=>$id,'module'=>'complaints','record_type'=>'complaint'])!==1)throw new RuntimeException('Unable to delete complaint.');
   $wpdb->query('COMMIT');
  }catch(Throwable $e){$wpdb->query('ROLLBACK');wp_die(esc_html($e->getMessage()));}
  wp_safe_redirect(add_query_arg('notice','deleted',$this->url($view)));exit;
 }
 function complaint_listing($view){
  global $wpdb;$log=$view==='complaints-update-log';$where=["r.module='complaints'","r.record_type='".($log?'complaint-update':'complaint')."'"];$args=[];
  if($view==='complaints-pending')$where[]="r.status='Inprogress'";
  foreach(['customer_id'=>'customer_id','assigned_to'=>'assigned_to','updated_by'=>'created_by'] as $key=>$column){$value=absint($_GET[$key]??0);if($value&&($key!=='updated_by'||$log)){$where[]="r.$column=%d";$args[]=$value;}}
  foreach(['type'=>'type','priority'=>'priority'] as $key=>$meta_key){$value=sanitize_text_field(wp_unslash($_GET[$key]??''));if($value){$where[]='r.meta LIKE %s';$args[]='%'.$wpdb->esc_like('"'.$meta_key.'":"'.$value.'"').'%';}}
  if($view==='complaints-master'&&!empty($_GET['status'])){$where[]='r.status=%s';$args[]=sanitize_text_field(wp_unslash($_GET['status']));}
  foreach(['date_from'=>'>=','date_to'=>'<='] as $key=>$op){$value=sanitize_text_field(wp_unslash($_GET[$key]??''));if(preg_match('/^\d{4}-\d{2}-\d{2}$/',$value)){$where[]="r.record_date $op %s";$args[]=$value;}}
  $search=sanitize_text_field(wp_unslash($_GET['s']??''));if($search!==''){$like='%'.$wpdb->esc_like($search).'%';$where[]='(r.reference_no LIKE %s OR r.notes LIKE %s OR c.title LIKE %s OR r.meta LIKE %s)';array_push($args,$like,$like,$like,$like);}
  $base="FROM {$this->t('records')} r LEFT JOIN {$this->t('records')} c ON c.id=r.customer_id WHERE ".implode(' AND ',$where);$total=(int)$wpdb->get_var($args?$wpdb->prepare("SELECT COUNT(*) $base",$args):"SELECT COUNT(*) $base");$per=$this->pagination_size();$page=min(max(1,absint($_GET['pg']??1)),max(1,(int)ceil($total/$per)));$off=($page-1)*$per;
  $sql="SELECT r.*,c.title AS customer_name $base ORDER BY r.id DESC LIMIT $per OFFSET $off";$rows=$wpdb->get_results($args?$wpdb->prepare($sql,$args):$sql);
  // Fetch the newest update for each visible complaint in one query.
  $latest=[];
  if(!$log&&$rows){
   $ids=array_map('absint',array_column($rows,'id'));$placeholders=implode(',',array_fill(0,count($ids),'%d'));
   $updates=$wpdb->get_results($wpdb->prepare("SELECT u.* FROM {$this->t('records')} u INNER JOIN (SELECT parent_id,MAX(id) AS latest_id FROM {$this->t('records')} WHERE module='complaints' AND record_type='complaint-update' AND parent_id IN ($placeholders) GROUP BY parent_id) newest ON newest.latest_id=u.id",$ids));
   foreach($updates as $update)$latest[(int)$update->parent_id]=$update;
  }
  $filters_open=($_GET['filters_open']??'')==='1';
  echo '<div class="panel listing-panel cr-panel"><div class="cr-list-tools"><button type="button" class="btn cr-filter-toggle" aria-expanded="'.($filters_open?'true':'false').'" aria-controls="cr-filter-panel"><svg aria-hidden="true" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 4h18l-7 8v7l-4 2v-9Z"/></svg> Filter</button>';
  if($this->can_view_slug('add-complaint'))echo '<a class="btn primary" href="'.esc_url($this->url('add-complaint')).'">＋ Add Complaint / Repairing</a>';echo '</div><div id="cr-filter-panel"'.($filters_open?'':' hidden').'>';
  $this->complaint_filters($view,$search);echo '</div>';
  $headers=$log?['Update Date & Time','Reference','Customer','Type','Status','Update Remarks','Update By','Update Document']:['Date','Type','Customer','Mobile','Priority','Description','Assigned To','Document','Status','Update Date','Update Remarks','Update By','Update Document','Action'];
  echo '<div class="table-wrap"><table class="data cr-table'.($log?'':' cr-register-table').'"><thead><tr>';foreach($headers as $h)echo '<th>'.esc_html($h).'</th>';echo '</tr></thead><tbody>';
  foreach($rows as $r){$m=$this->complaint_meta($r);echo '<tr>';
   if($log){
    $cells=[$this->complaint_time($r->created_at),$r->reference_no,$r->customer_name,$m['type']??'',$r->status,$r->notes,$this->user_display_name($r->created_by)];
    foreach($cells as $i=>$cell){$badge=$i===4;echo '<td class="cr-text">'.($badge?'<span class="cr-badge cr-'.esc_attr(strtolower((string)$cell)).'">':'').nl2br(esc_html((string)$cell)).($badge?'</span>':'').'</td>';}
    echo '<td>';$this->complaint_documents($m['documents']??[]);echo '</td>';
   }else{
    $update=$latest[(int)$r->id]??null;$update_meta=$update?$this->complaint_meta($update):[];
    $cells=[$this->complaint_time($r->record_date,true),$m['type']??'',$r->customer_name,$m['mobile']??'',$m['priority']??'',$r->notes,$this->task_user_display_name($r->assigned_to),$m['documents']??[],$r->status,$update?$this->complaint_time($update->created_at):'',$update?$update->notes:'',$update?$this->user_display_name($update->created_by):'',$update_meta['documents']??[]];
    foreach($cells as $i=>$cell){echo '<td class="cr-text">';if(in_array($i,[7,12],true))$this->complaint_documents($cell);else{$badge=in_array($i,[4,8],true);echo ($badge?'<span class="cr-badge cr-'.esc_attr(strtolower((string)$cell)).'">':'').nl2br(esc_html((string)$cell)).($badge?'</span>':'');}echo '</td>';}
    echo '<td><div class="actions"><a class="btn" title="View details and history" aria-label="View details and history" href="'.esc_url(add_query_arg('complaint',(int)$r->id,$this->url($view))).'">◉</a>';if($this->complaint_can_update($r))echo '<a class="btn" title="Update" aria-label="Update" href="'.esc_url(add_query_arg('update_complaint',(int)$r->id,$this->url($view))).'">✓</a>';if($this->complaint_manager())$this->complaint_delete_button($r,$view);echo '</div></td>';
   }
   echo '</tr>';
  }
  if(!$rows)echo '<tr><td colspan="'.count($headers).'">No records found.</td></tr>';echo '</tbody></table></div>';$this->pagination_controls($total,$page,$per,$this->url($view));echo '</div>';
 }
 function complaint_filters($view,$search){
  echo '<form class="cr-filters" method="get" action="'.esc_url($this->url($view)).'"><input type="hidden" name="filters_open" value="1"><label>Search<input type="search" name="erp_search" value="'.esc_attr($search).'" placeholder="Reference, customer, mobile, remarks"></label>';
  foreach(['date_from'=>'From Date','date_to'=>'To Date'] as $key=>$label)echo '<label>'.esc_html($label).'<input type="date" name="'.esc_attr($key).'" value="'.esc_attr(sanitize_text_field(wp_unslash($_GET[$key]??''))).'"></label>';
  $options=['type'=>['Type',['Complaint'=>'Complaint','Repairing'=>'Repairing']],'priority'=>['Priority',array_combine(['Low','Medium','High','Urgent'],['Low','Medium','High','Urgent'])]];
  if($view==='complaints-update-log')unset($options['priority']);
  if($view==='complaints-master')$options['status']=['Status',['Inprogress'=>'Inprogress','Completed'=>'Completed']];
  foreach(['customer_id'=>['Customer','customer'],'assigned_to'=>['Assigned To','user']] as $key=>$spec){$list=[];foreach($this->master_options($spec[1]) as $r)$list[$r->id]=$r->title;$options[$key]=[$spec[0],$list];}
  if($view==='complaints-update-log'){global $wpdb;$list=[];$users=$wpdb->get_col("SELECT DISTINCT created_by FROM {$this->t('records')} WHERE module='complaints' AND record_type='complaint-update'");foreach($users as $id)$list[$id]=$this->user_display_name($id);$options['updated_by']=['Update By',$list];}
  foreach($options as $key=>[$label,$values]){echo '<label>'.esc_html($label).'<select name="'.esc_attr($key).'"><option value="">All</option>';foreach($values as $value=>$text)echo '<option value="'.esc_attr($value).'" '.selected((string)($_GET[$key]??''),(string)$value,false).'>'.esc_html($text).'</option>';echo '</select></label>';}
  echo '<a class="btn" href="'.esc_url($this->url($view)).'">Clear</a></form>';
 }

}
