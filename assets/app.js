jQuery(function($){
  /* v2.8.52 — remember left sidebar scroll position between ERP views */
  (function(){
    var side=document.querySelector('.bsoerp-side');
    if(!side)return;
    var key='bsoerp_sidebar_scroll_top';
    var saved=0;
    try{saved=parseInt(localStorage.getItem(key)||'0',10)||0;}catch(e){}
    function restore(){if(saved>0)side.scrollTop=saved;}
    requestAnimationFrame(restore);
    setTimeout(restore,80);
    var timer=null;
    side.addEventListener('scroll',function(){
      if(timer)clearTimeout(timer);
      timer=setTimeout(function(){try{localStorage.setItem(key,String(side.scrollTop||0));}catch(e){}},40);
    },{passive:true});
    document.addEventListener('click',function(e){
      var link=e.target.closest&&e.target.closest('.bsoerp-side a[href]');
      if(!link)return;
      try{localStorage.setItem(key,String(side.scrollTop||0));}catch(err){}
    },true);
  })();
  $('.heading').on('click',function(){$(this).parent().toggleClass('open')});
  function bsoerpIsMobileMenu(){return window.matchMedia('(max-width:800px)').matches;}
  function bsoerpSetDesktopSidebar(collapsed){
    var $app=$('.bsoerp-app');
    $app.toggleClass('sidebar-collapsed',!!collapsed);
    $('.bsoerp-toggle').attr('aria-expanded',collapsed?'false':'true').attr('title',collapsed?'Show Menu':'Hide Menu');
    try{localStorage.setItem('bsoerp_sidebar_collapsed',collapsed?'1':'0');}catch(e){}
  }
  if(!bsoerpIsMobileMenu()){
    var savedCollapsed=false;try{savedCollapsed=localStorage.getItem('bsoerp_sidebar_collapsed')==='1';}catch(e){}
    bsoerpSetDesktopSidebar(savedCollapsed);
  }
  $('.bsoerp-toggle').on('click',function(){
    if(bsoerpIsMobileMenu()){
      $('.bsoerp-side').addClass('open');$('.bsoerp-overlay').addClass('show');$(this).attr('aria-expanded','true');
    }else{
      bsoerpSetDesktopSidebar(!$('.bsoerp-app').hasClass('sidebar-collapsed'));
    }
  });
  $('.bsoerp-close,.bsoerp-overlay').on('click',function(){$('.bsoerp-side').removeClass('open');$('.bsoerp-overlay').removeClass('show');$('.bsoerp-toggle').attr('aria-expanded','false')});
  /* v2.9.50 — Do not auto-hide/collapse the left menu when opening a view. */
  (function(){
    try{
      if(localStorage.getItem('bsoerp_no_autohide_v2950')!=='1'){
        localStorage.setItem('bsoerp_sidebar_collapsed','0');
        localStorage.setItem('bsoerp_no_autohide_v2950','1');
        if(!bsoerpIsMobileMenu())bsoerpSetDesktopSidebar(false);
      }
    }catch(e){}
  })();
  $(window).on('resize',function(){
    if(!bsoerpIsMobileMenu()){
      $('.bsoerp-side').removeClass('open');$('.bsoerp-overlay').removeClass('show');
      var c=false;try{c=localStorage.getItem('bsoerp_sidebar_collapsed')==='1';}catch(e){}
      bsoerpSetDesktopSidebar(c);
    }else{
      $('.bsoerp-app').removeClass('sidebar-collapsed');
    }
  });
  setInterval(function(){$('.listing-panel .master-toolbar button[type="submit"]').filter(function(){return $(this).text().trim()==='Filter';}).remove();},100);
  // PDF actions open a preview first; direct download remains available beside the preview icon.
  $('.pdf-download-action').each(function(){
    var $a=$(this),href=$a.attr('href')||'';var lbl=$a.attr('data-pdf-label')||'View PDF';$a.attr('target','_blank').attr('rel','noopener').attr('title',lbl).attr('aria-label',lbl);
    if(!href||$a.next('.pdf-direct-download').length)return;
  });
  $('.add-delivery-form,.order-delivery-form').each(function(){var $form=$(this),$items=$form.find('.order-delivery-items').first();if(!$items.length||$form.find('[name="installation_required"]').length)return;$('<label class="installation-required-field"><input type="checkbox" name="installation_required" value="1"><span>Installation Required</span></label>').insertBefore($items);});

  $(document).on('click','.cancel-order,.cancel-purchase-order',function(e){e.preventDefault();var href=$(this).attr('href');if(!href)return;var isPO=$(this).hasClass('cancel-purchase-order'),name=isPO?'Purchase Order':'Order',destination=isPO?'Canceled PO':'Canceled Orders';$('.erp-confirm-modal').remove();var $modal=$('<div class="erp-confirm-modal" role="dialog" aria-modal="true"><div class="erp-confirm-dialog"><h2>Cancel '+name+'?</h2><p>This '+name.toLowerCase()+' will be moved to '+destination+'. The record and its item history will be retained.</p><div class="erp-confirm-actions"><button type="button" class="btn erp-confirm-cancel">Back</button><a class="btn primary erp-confirm-delete" href="'+href+'">Cancel '+name+'</a></div></div></div>');$('body').append($modal);$modal.on('click',function(event){if(event.target===this)$modal.remove();});$modal.find('.erp-confirm-cancel').on('click',function(){$modal.remove();});});
  $(document).on('click','.cancel-work-order',function(e){e.preventDefault();var href=$(this).attr('href');if(!href)return;$('.erp-confirm-modal').remove();var $modal=$('<div class="erp-confirm-modal" role="dialog" aria-modal="true"><div class="erp-confirm-dialog"><h2>Cancel Work Order?</h2><p>Are you sure you want to cancel this Work Order?</p><div class="erp-confirm-actions"><button type="button" class="btn erp-confirm-cancel">Back</button><a class="btn primary erp-confirm-delete" href="'+href+'">Cancel Work Order</a></div></div></div>');$('body').append($modal);$modal.on('click',function(event){if(event.target===this)$modal.remove();});$modal.find('.erp-confirm-cancel').on('click',function(){$modal.remove();});});
  $(document).on('click','.cancel-quotation',function(e){e.preventDefault();var href=$(this).attr('href');if(!href)return;$('.erp-confirm-modal').remove();var $modal=$('<div class="erp-confirm-modal" role="dialog" aria-modal="true"><div class="erp-confirm-dialog"><h2>Cancel Quotation?</h2><p>The quotation and its item history will be retained with Canceled status.</p><div class="erp-confirm-actions"><button type="button" class="btn erp-confirm-cancel">Back</button><a class="btn primary erp-confirm-delete" href="'+href+'">Cancel Quotation</a></div></div></div>');$('body').append($modal);$modal.on('click',function(event){if(event.target===this)$modal.remove();});$modal.find('.erp-confirm-cancel').on('click',function(){$modal.remove();});});
  $(document).on('click','.delete',function(e){e.preventDefault();var href=$(this).attr('href');if(!href)return;$('.erp-confirm-modal').remove();var $modal=$('<div class="erp-confirm-modal" role="dialog" aria-modal="true"><div class="erp-confirm-dialog"><h2>Delete record?</h2><p>This record will be permanently deleted and cannot be recovered.</p><div class="erp-confirm-actions"><button type="button" class="btn erp-confirm-cancel">Cancel</button><a class="btn primary erp-confirm-delete" href="'+href+'">Delete</a></div></div></div>');$('body').append($modal);$modal.on('click',function(event){if(event.target===this)$modal.remove();});$modal.find('.erp-confirm-cancel').on('click',function(){$modal.remove();});});
  function calcQuotationRow($r){
    var $len=$r.find('.quote-length'),$height=$r.find('.quote-height'),$nos=$r.find('.quote-nos'),$qty=$r.find('.quote-qty');
    if($len.length&&$height.length&&$nos.length){var lv=$.trim($len.val()),hv=$.trim($height.val()),nv=$.trim($nos.val());if(lv!==''&&hv!==''&&nv!==''){var autoQty=(parseFloat(lv)||0)*(parseFloat(hv)||0)*(parseFloat(nv)||0);$qty.val(autoQty.toFixed(3).replace(/\.?0+$/,''));$qty.prop('readonly',true).addClass('erp-readonly');}else{$qty.prop('readonly',false).removeClass('erp-readonly');}}
    var q=parseFloat($r.find('.qty').val())||0, rate=parseFloat($r.find('.rate').val())||0;
    var base=q*rate, dp=Math.max(0,Math.min(100,parseFloat($r.find('.discount-percent').val())||0));
    var discount=base*dp/100, taxable=Math.max(0,base-discount);
    var gp=Math.max(0,parseFloat($r.find('.gst-percent').val())||0), gst=taxable*gp/100, total=taxable+gst;
    $r.find('.discount-amount').val(discount.toFixed(2));
    $r.find('.gst-amount').val(gst.toFixed(2));
    $r.find('.quote-line-amount').val(total.toFixed(2));
  }
  function calcQuotationTotals(){
    var base=0,gst=0,discount=0,total=0;
    $('.quotation-line-row').each(function(){var $r=$(this);var q=parseFloat($r.find('.qty').val())||0,rate=parseFloat($r.find('.rate').val())||0;base+=q*rate;gst+=parseFloat($r.find('.gst-amount').val())||0;discount+=parseFloat($r.find('.discount-amount').val())||0;total+=parseFloat($r.find('.quote-line-amount').val())||0;});
    var roundOff=parseFloat($('[name="quotation_round_off"]').val())||0;
    $('[name="quotation_subtotal"]').val(base.toFixed(2));
    $('[name="quotation_gst"]').val(gst.toFixed(2));
    $('[name="quotation_discount"]').val(discount.toFixed(2));
    $('[name="quotation_total"]').val((total+roundOff).toFixed(2));
  }
  if($('.purchase-order-line-box').length){
    $('.purchase-order-line-box').after('<div class="po-total-footer" aria-live="polite"><span>Total Amount</span><strong class="po-total-amount-value">0.00</strong></div>');
  }
  function calcPurchaseOrderTotal(){
    var total=0;
    $('.purchase-order-line-row .amount').each(function(){total+=parseFloat($(this).val())||0;});
    $('.po-total-amount-value').text(total.toLocaleString(undefined,{minimumFractionDigits:2,maximumFractionDigits:2}));
  }
  function calc($r){
    if($r.hasClass('quotation-line-row')){calcQuotationRow($r);calcQuotationTotals();return;}
    let q=parseFloat($r.find('.qty').val())||0,rate=parseFloat($r.find('.rate').val())||0,p=parseFloat($r.find('.processed-qty').val())||0,rej=parseFloat($r.find('.rejected-qty').val())||0;
    $r.find('.amount').val((q*rate).toFixed(2));
    $r.find('.pending-hint').text('Pending: '+Math.max(0,q-p-rej).toFixed(3).replace(/\.000$/,''));
    if(p+rej>q && q>=0){$r.addClass('qty-error')}else{$r.removeClass('qty-error')}
    if($r.hasClass('purchase-order-line-row'))calcPurchaseOrderTotal();
  }
  $(document).on('input','.qty,.rate,.processed-qty,.rejected-qty,.gst-percent,.discount-percent,.quote-length,.quote-height,.quote-nos',function(){calc($(this).closest('tr'))});
  $(document).on('input','[name="quotation_round_off"]',calcQuotationTotals);
  function applyItemDefaults($select){
    var $s=$($select),$r=$s.closest('tr.quotation-line-row'),$o=$s.find('option:selected');if(!$r.length||!$o.length)return;
    var uom=String($o.attr('data-uom')||''),gst=String($o.attr('data-gst')||'0');
    var $u=$r.find('.quotation-uom-select'),$g=$r.find('.gst-percent');
    $u.val(uom);
    $g.val((parseFloat(gst)||0).toString());calc($r);
  }
  $(document).on('change','.quotation-item-select',function(){applyItemDefaults(this);});
  $(document).on('change','.job-item-select',function(){var $s=$(this),$r=$s.closest('tr'),desc=$s.find('option:selected').attr('data-description')||'';$r.find('.job-description').val(desc);});
  $('.add-line').on('click',function(){let i=$('.line-row').length,html=$('#bsoerp-line-template').html().replaceAll('__INDEX__',i);$('.line-table tbody').append(html);var $r=$('.line-table tbody .line-row:last');calc($r);calcQuotationTotals();calcPurchaseOrderTotal()});
  $(document).on('click','.remove-line',function(){if($('.line-row').length>1)$(this).closest('tr').remove();else $(this).closest('tr').find('input').val('');calcQuotationTotals();calcPurchaseOrderTotal()});
  $('.line-row').each(function(){calc($(this))});calcQuotationTotals();calcPurchaseOrderTotal();
  $(document).on('change','select[name="parent_id"]',function(){
    var id=$(this).val(),$tbody=$('.line-table tbody'),target=$('input[name="module"]').val();if(!id){if(target==='production'){$('input[type="hidden"][name="customer_id"]').val('');$('.job-customer-display').val('');$('input[name="order_taken_id"]').val('');$('.job-order-taken-display').val('');}return;}if(!$tbody.length)return;
    $.get((window.BSOERP&&BSOERP.ajaxurl)||'/wp-admin/admin-ajax.php',{action:'bsoerp_parent_items',parent_id:id,target_module:target,nonce:(window.BSOERP&&BSOERP.nonce)||''},function(resp){
      if(!resp||!resp.success)return;
      var payload=resp.data||{}, rows=Array.isArray(payload)?payload:(payload.items||[]);
      if(target==='grn'&&!Array.isArray(payload)){
        $('input[type="hidden"][name="party_id"]').val(String(payload.supplier_id||''));
        $('.grn-supplier-display').val(payload.supplier_name||'');
      }
      if(target==='production'&&!Array.isArray(payload)){
        if(payload.customer_id){var $customerHidden=$('input[type="hidden"][name="customer_id"]');if($customerHidden.length){$customerHidden.val(String(payload.customer_id));$('.job-customer-display').val(payload.customer_name||'');}else{var $customer=$('select[name="customer_id"]');if($customer.length){$customer.val(String(payload.customer_id)).trigger('change');if($customer[0]._bsoerpRefresh)$customer[0]._bsoerpRefresh();}}}
        if(payload.order_taken_id){$('input[name="order_taken_id"]').val(String(payload.order_taken_id));$('.job-order-taken-display').val(payload.order_taken_name||'');}

        // v2.8.65 — Load the selected Order items into the Work Order Jobs table.
        $tbody.empty();
        if(!rows.length){
          var blankHtml=$('#bsoerp-line-template').html().replace(/__INDEX__/g,0);
          $tbody.append(blankHtml);
          var $blankRow=$tbody.find('tr:last');
          calc($blankRow);
          if(window.bsoerpSyncVendorJobCosts)window.bsoerpSyncVendorJobCosts();
          return;
        }
        rows.forEach(function(row,idx){
          var html=$('#bsoerp-line-template').html().replace(/__INDEX__/g,idx);
          $tbody.append(html);
          var $tr=$tbody.find('tr:last');
          $tr.find('.source-line-id').val(row.source_line_id||0);
          var $li=$tr.find('.job-item-select');
          var itemId=String(row.item_id||0), itemTitle=$.trim(row.item_title||'');
          if(itemId!=='0' && !$li.find('option[value="'+itemId.replace(/"/g,'\\"')+'"]').length){
            $('<option>').val(itemId).text(itemTitle||'Order Item').attr('data-description',row.description||'').appendTo($li);
          }
          if(itemId!=='0')$li.val(itemId);
          else {
            var wanted=itemTitle.toLowerCase(), matched='0';
            $li.find('option').each(function(){if($.trim($(this).text()).toLowerCase()===wanted)matched=String(this.value);});
            $li.val(matched);
          }
          if($li[0]&&$li[0]._bsoerpRefresh)$li[0]._bsoerpRefresh();
          $tr.find('.job-description').val(row.description||'');
          $tr.find('input[name$="[nos]"]').val(row.qty||'');
          if(window.bsoerpCalcVendorJobRow)window.bsoerpCalcVendorJobRow($tr[0]);
        });
        if(window.bsoerpSyncVendorJobCosts)window.bsoerpSyncVendorJobCosts();
        return;
      }
      $tbody.empty();
      if(!rows.length){$tbody.append('<tr><td colspan="10">No pending parent quantity is available.</td></tr>');return;}
      rows.forEach(function(row,idx){
        var html=$('#bsoerp-line-template').html().replace(/__INDEX__/g,idx);$tbody.append(html);var $tr=$tbody.find('tr:last');
        if(target==='grn'){
          $tr.find('.source-line-id').val(row.source_line_id);
          $tr.find('.line-item').val(row.item_id);
          $tr.find('.grn-item-name').text(row.item_title||'—');
          $tr.find('input[name$="[description]"]').val(row.description||'');$tr.find('.grn-description').text(row.description||'—');
          $tr.find('.qty').val(row.pending_qty);$tr.find('input[name$="[uom]"]').val(row.uom||'');$tr.find('.rate').val(row.rate||0);
          $tr.find('.grn-total-qty').text(Number(row.total_qty||0).toLocaleString(undefined,{maximumFractionDigits:3}));
          $tr.find('.grn-already-received').text(Number(row.already_received||0).toLocaleString(undefined,{maximumFractionDigits:3}));
          $tr.find('.grn-pending-qty').text(Number(row.pending_qty||0).toLocaleString(undefined,{maximumFractionDigits:3}));
          $tr.find('.grn-receive-qty').attr('max',row.pending_qty).val('');
          return;
        }
        $tr.find('.source-line-id').val(row.source_line_id);var $li=$tr.find('.line-item');if(target==='production'){var matched='0',wanted=$.trim(row.item_title||'').toLowerCase();$li.find('option').each(function(){if($.trim($(this).text()).toLowerCase()===wanted)matched=String(this.value);});$li.val(matched);var jobDesc=$li.find('option:selected').attr('data-description')||row.description||'';$tr.find('input[name$="[description]"]').val(jobDesc);}else{$li.val(row.item_id);$tr.find('input[name$="[description]"]').val(row.description);}if($li[0]&&$li[0]._bsoerpRefresh)$li[0]._bsoerpRefresh();$tr.find('.qty').val(row.qty);var $uom=$tr.find('[name$="[uom]"]');$uom.val(row.uom);if($uom[0]&&$uom[0]._bsoerpRefresh)$uom[0]._bsoerpRefresh();$tr.find('.rate').val(row.rate);calc($tr);
      });
    });
  });
});

/* GRN form: keep remarks below items and validate received quantities. */
(function(){
  function initGrn(){
    var marker=document.querySelector('form.erp-form[data-save-form="1"] input[name="record_type"][value="grn"]');
    var form=marker&&marker.closest('form');if(!form)return;form.classList.add('grn-form');
    var remarks=form.querySelector('textarea[name="notes"]'),box=form.querySelector('.grn-line-box');
    if(remarks&&box){var label=remarks.closest('label');label.classList.add('grn-remarks-field');box.insertAdjacentElement('afterend',label);}
    var po=form.querySelector('select[name="parent_id"]');if(po&&po.value){setTimeout(function(){if(window.jQuery)window.jQuery(po).trigger('change');else po.dispatchEvent(new Event('change',{bubbles:true}));},0);}
    form.addEventListener('submit',function(e){var inputs=form.querySelectorAll('.grn-receive-qty'),has=false,invalid=null;inputs.forEach(function(input){var qty=Number(input.value||0),max=Number(input.getAttribute('max')||0);if(qty>0)has=true;if(qty<0||qty>max+0.000001)invalid=input;});if(invalid||!has){e.preventDefault();e.stopImmediatePropagation();alert(invalid?'Qty cannot exceed Pending quantity.':'Enter Qty for at least one item.');var focus=invalid||inputs[0];if(focus)focus.focus();}},true);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initGrn);else initGrn();
})();

/* GRN Items view: retain only the received Qty column from quantity tracking. */
(function(){
  function simplifyGrnItems(){
    var heading=document.querySelector('.bsoerp-top h1');if(!heading||heading.textContent.trim()!=='GRN Items')return;
    document.querySelectorAll('.listing-panel table.data').forEach(function(table){
      var headers=[].slice.call(table.querySelectorAll('thead th')),remove=[];
      headers.forEach(function(th,index){if(['Total Qty','Already Received','Pending'].indexOf(th.textContent.trim())!==-1)remove.push(index);});
      remove.sort(function(a,b){return b-a;}).forEach(function(index){table.querySelectorAll('tr').forEach(function(row){var cells=row.children;if(cells[index])cells[index].remove();});});
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',simplifyGrnItems);else simplifyGrnItems();
})();

/* Global Quick Add Master */
jQuery(function($){
  var $modal=$('.quick-add-modal'),$backdrop=$('.quick-add-backdrop'),$form=$('#bsoerp-quick-add-form');
  if(!$modal.length)return;
  var activeType='',activeLabel='', $activeSelect=null;
  function openQuickAdd(btn){
    activeType=$(btn).data('master-type')||'';
    activeLabel=$(btn).data('master-label')||'Master Value';
    $activeSelect=$(btn).siblings('select.quick-add-select');
    if(!$activeSelect.length){
      $activeSelect=$(btn).closest('.select-with-add').find('select.quick-add-select').first();
    }
    $form[0].reset();
    $form.find('input[name="master_type"]').val(activeType);
    $('#quick-add-title').text('Add '+activeLabel);
    $('.quick-add-name-label').text((activeType==='job-items'||activeType==='job-item'?'Job / Particular':activeLabel)+' *');
    var isJobItem=(activeType==='job-items'||activeType==='job-item');
    var isCustomer=(activeType==='customers'||activeType==='customer');
    var isItem=(activeType==='items'||activeType==='item');
    $form.find('.quick-add-standard-fields').prop('hidden',isCustomer);
    $form.find('.quick-add-customer-fields').prop('hidden',!isCustomer);
    $form.find('.quick-add-item-fields').prop('hidden',!isItem);
    $modal.toggleClass('quick-add-customer-mode',isCustomer).toggleClass('quick-add-item-mode',isItem);
    $form.find('.quick-add-description-field').prop('hidden',!isJobItem);
    $form.find('input[name="name"]').prop('required',!isCustomer);
    $form.find('select[name="item_uom"]').prop('required',isItem);
    $form.find('input[name="customer_name"]').prop('required',isCustomer);
    $form.find('textarea[name="description"]').val('');
    $('.quick-add-message').removeClass('error success').text('');
    $modal.removeAttr('hidden');$backdrop.removeAttr('hidden');
    setTimeout(function(){(isCustomer?$form.find('input[name="customer_name"]'):$form.find('input[name="name"]')).trigger('focus')},20);
  }
  function closeQuickAdd(){
    $modal.attr('hidden',true).removeClass('quick-add-customer-mode');$backdrop.attr('hidden',true);$activeSelect=null;
  }
  var $categoryModal=$('.customer-category-inline-modal'),$categoryBackdrop=$('.customer-category-inline-backdrop'),$categoryForm=$('#customer-category-inline-form');
  function openCustomerCategoryModal(){
    if(!$categoryModal.length)return;
    // Keep the nested category modal relative to the browser viewport, not the ERP layout.
    // Moving it to body also prevents transformed/positioned ancestors from changing fixed positioning.
    if(!$categoryBackdrop.parent().is('body'))$categoryBackdrop.appendTo(document.body);
    if(!$categoryModal.parent().is('body'))$categoryModal.appendTo(document.body);
    $categoryForm[0].reset();
    $categoryForm.find('.customer-category-inline-message').removeClass('error success').text('');
    $categoryBackdrop.removeAttr('hidden');$categoryModal.removeAttr('hidden');
    setTimeout(function(){$categoryForm.find('input[name="customer_category_name"]').trigger('focus')},20);
  }
  function closeCustomerCategoryModal(){
    $categoryModal.attr('hidden',true);$categoryBackdrop.attr('hidden',true);
  }
  $(document).on('click','.quick-add-customer-category-btn[data-inline-customer-category-add="1"]',function(e){
    e.preventDefault();e.stopImmediatePropagation();openCustomerCategoryModal();
  });
  $(document).on('click','.customer-category-inline-close,.customer-category-inline-cancel,.customer-category-inline-backdrop',function(e){e.preventDefault();closeCustomerCategoryModal()});
  $categoryForm.on('submit',function(e){
    e.preventDefault();
    var name=$.trim($categoryForm.find('input[name="customer_category_name"]').val());
    var $msg=$categoryForm.find('.customer-category-inline-message');
    if(!name){$msg.removeClass('success').addClass('error').text('Customer Category Name is required.');return;}
    var $save=$categoryForm.find('.customer-category-inline-save'),$select=$form.find('select[name="customer_category_id"]');
    $save.prop('disabled',true).text('Saving…');$msg.removeClass('error success').text('');
    $.ajax({
      url:(window.BSOERP&&BSOERP.ajaxurl)||'/wp-admin/admin-ajax.php',
      method:'POST',dataType:'json',timeout:15000,
      data:{action:'bsoerp_quick_add_master',nonce:(window.BSOERP&&BSOERP.nonce)||'',master_type:'customer-categories',name:name}
    }).done(function(resp){
      if(!resp||!resp.success){var msg=resp&&resp.data&&resp.data.message?resp.data.message:'Unable to save Customer Category.';$msg.addClass('error').text(msg);return;}
      var d=resp.data,val=String(d.id);
      if(!$select.find('option[value="'+val+'"]').length)$select.append($('<option>',{value:val,text:d.title}));
      $select.val(val).trigger('change');
      $('select.quick-add-select[data-master-type="customer-categories"],select.quick-add-select[data-master-type="customer-category"]').each(function(){
        var $s=$(this);if(!$s.find('option[value="'+val+'"]').length)$s.append($('<option>',{value:val,text:d.title}));if(typeof this._bsoerpRefresh==='function')this._bsoerpRefresh();
      });
      closeCustomerCategoryModal();
    }).fail(function(){$msg.addClass('error').text('Unable to save Customer Category. Please try again.');}).always(function(){$save.prop('disabled',false).text('Save');});
  });
  var $itemMetaModal=$('.item-meta-inline-modal'),$itemMetaBackdrop=$('.item-meta-inline-backdrop'),$itemMetaForm=$('#item-meta-inline-form');
  function openItemMetaModal(btn){
    if(!$itemMetaModal.length)return;
    if(!$itemMetaBackdrop.parent().is('body'))$itemMetaBackdrop.appendTo(document.body);
    if(!$itemMetaModal.parent().is('body'))$itemMetaModal.appendTo(document.body);
    var type=$(btn).data('master-type')||'',label=$(btn).data('master-label')||'Value';
    $itemMetaForm[0].reset();
    $itemMetaForm.find('input[name="item_meta_master_type"]').val(type);
    $('#item-meta-inline-title').text('Add '+label);
    $itemMetaForm.find('.item-meta-inline-label').text(label+' Name *');
    $itemMetaForm.find('.item-meta-inline-message').removeClass('error success').text('');
    $itemMetaBackdrop.removeAttr('hidden');$itemMetaModal.removeAttr('hidden');
    setTimeout(function(){$itemMetaForm.find('input[name="item_meta_name"]').trigger('focus')},20);
  }
  function closeItemMetaModal(){$itemMetaModal.attr('hidden',true);$itemMetaBackdrop.attr('hidden',true);}
  $(document).on('click','.quick-add-item-meta-btn[data-inline-item-meta-add="1"]',function(e){e.preventDefault();e.stopImmediatePropagation();openItemMetaModal(this);});
  $(document).on('click','.item-meta-inline-close,.item-meta-inline-cancel,.item-meta-inline-backdrop',function(e){e.preventDefault();closeItemMetaModal();});
  $itemMetaForm.on('submit',function(e){
    e.preventDefault();
    var type=$itemMetaForm.find('input[name="item_meta_master_type"]').val(),name=$.trim($itemMetaForm.find('input[name="item_meta_name"]').val());
    var $msg=$itemMetaForm.find('.item-meta-inline-message');
    if(!name){$msg.removeClass('success').addClass('error').text('Name is required.');return;}
    var $save=$itemMetaForm.find('.item-meta-inline-save');$save.prop('disabled',true).text('Saving…');$msg.removeClass('error success').text('');
    $.ajax({url:(window.BSOERP&&BSOERP.ajaxurl)||'/wp-admin/admin-ajax.php',method:'POST',dataType:'json',timeout:15000,data:{action:'bsoerp_quick_add_master',nonce:(window.BSOERP&&BSOERP.nonce)||'',master_type:type,name:name}})
    .done(function(resp){
      if(!resp||!resp.success){$msg.addClass('error').text(resp&&resp.data&&resp.data.message?resp.data.message:'Unable to save.');return;}
      var d=resp.data;
      if(type==='item-categories'){
        var $s=$form.find('select[name="item_category_id"]'),val=String(d.id);if(!$s.find('option[value="'+val+'"]').length)$s.append($('<option>',{value:val,text:d.title}));$s.val(val).trigger('change');
      }else if(type==='uoms'){
        var $u=$form.find('select[name="item_uom"]'),val=String(d.title);if(!$u.find('option').filter(function(){return String(this.value)===val;}).length)$u.append($('<option>',{value:val,text:d.title}));$u.val(val).trigger('change');
      }
      closeItemMetaModal();
    }).fail(function(){$msg.addClass('error').text('Unable to save. Please try again.');}).always(function(){$save.prop('disabled',false).text('Save');});
  });
  $(document).on('click','.quick-add-btn',function(e){e.preventDefault();openQuickAdd(this)});
  $(document).on('click','.quick-add-close,.quick-add-cancel,.quick-add-backdrop',function(e){e.preventDefault();closeQuickAdd()});
  $(document).on('keydown',function(e){if(e.key!=='Escape')return;if(!$itemMetaModal.is('[hidden]')){closeItemMetaModal();return;}if(!$categoryModal.is('[hidden]')){closeCustomerCategoryModal();return;}if(!$modal.is('[hidden]'))closeQuickAdd()});
  var quickAddBusy=false;
  $form.on('submit',function(e){
    e.preventDefault();
    if(quickAddBusy) return;
    var isCustomer=(activeType==='customers'||activeType==='customer');
    var name=$.trim((isCustomer?$form.find('input[name="customer_name"]'):$form.find('input[name="name"]')).val());
    if(!name){$('.quick-add-message').removeClass('success').addClass('error').text(isCustomer?'Customer Name is required.':'Name is required.');return;}
    if(isCustomer){var mobile=$.trim($form.find('input[name="customer_mobile"]').val()).replace(/\D/g,'');if(mobile&&mobile.length!==10){$('.quick-add-message').removeClass('success').addClass('error').text('Mobile must contain exactly 10 digits.');return;}}
    quickAddBusy=true;
    var $save=$form.find('.quick-add-save');
    $save.prop('disabled',true).text('Saving…');
    $('.quick-add-message').removeClass('error success').text('');

    $.ajax({
      url:(window.BSOERP&&BSOERP.ajaxurl)||'/wp-admin/admin-ajax.php',
      method:'POST',
      dataType:'json',
      timeout:15000,
      data:{
        action:'bsoerp_quick_add_master',
        nonce:(window.BSOERP&&BSOERP.nonce)||'',
        master_type:activeType,
        name:name,
        description:$.trim($form.find('textarea[name="description"]').val()),
        item_category_id:$form.find('select[name="item_category_id"]').val()||0,
        item_uom:$form.find('select[name="item_uom"]').val()||'',
        item_gst_percent:$form.find('input[name="item_gst_percent"]').val()||0,
        customer_name:$.trim($form.find('input[name="customer_name"]').val()),
        customer_category_id:$form.find('select[name="customer_category_id"]').val()||0,
        customer_contact_person:$.trim($form.find('input[name="customer_contact_person"]').val()),
        customer_mobile:$.trim($form.find('input[name="customer_mobile"]').val()),
        customer_email:$.trim($form.find('input[name="customer_email"]').val()),
        customer_gstin:$.trim($form.find('input[name="customer_gstin"]').val()),
        customer_address:$.trim($form.find('textarea[name="customer_address"]').val()),
        customer_status:$form.find('select[name="customer_status"]').val()||'Active'
      }
    }).done(function(resp){
      if(!resp||!resp.success){
        var msg=resp&&resp.data&&resp.data.message?resp.data.message:'Unable to save the value.';
        $('.quick-add-message').removeClass('success').addClass('error').text(msg);
        return;
      }
      var d=resp.data;

      // Update only dropdowns that use this master. Do not rescan or rebuild
      // every enhanced select on the page; that previously caused an OPTION
      // mutation -> refresh -> OPTION mutation loop and froze the browser.
      $('select.quick-add-select[data-master-type="'+activeType+'"]').each(function(){
        var $s=$(this), valueMode=$s.attr('data-value-mode')||'id';
        var optionValue=valueMode==='title'?String(d.title):String(d.id);
        if(!$s.find('option').filter(function(){return String(this.value)===optionValue;}).length){
          var $op=$('<option>',{value:optionValue,text:d.title}).attr('data-description',d.description||'');if(activeType==='items'||activeType==='item')$op.attr('data-uom',d.uom||'').attr('data-gst',d.gst_percent||0);$s.append($op);
        }
        if(typeof this._bsoerpRefresh==='function') this._bsoerpRefresh();
      });

      if($activeSelect&&$activeSelect.length){
        var activeValue=($activeSelect.attr('data-value-mode')||'id')==='title'?String(d.title):String(d.id);
        var $activeOption=$activeSelect.find('option').filter(function(){return String(this.value)===activeValue;}).attr('data-description',d.description||'');if(activeType==='items'||activeType==='item')$activeOption.attr('data-uom',d.uom||'').attr('data-gst',d.gst_percent||0);
        $activeSelect.val(activeValue);
        if($activeSelect[0]){try{$activeSelect[0].dispatchEvent(new Event('change',{bubbles:true}));}catch(e){$activeSelect.trigger('change');}}
      }
      $('.quick-add-message').removeClass('error').addClass('success').text(d.message||'Added successfully.');
      setTimeout(function(){ if(!$modal.is('[hidden]')) closeQuickAdd(); },350);
    }).fail(function(xhr,status){
      var msg=status==='timeout'?'The request took too long. Please try again.':'Unable to save the value.';
      if(xhr.responseJSON&&xhr.responseJSON.data&&xhr.responseJSON.data.message)msg=xhr.responseJSON.data.message;
      $('.quick-add-message').removeClass('success').addClass('error').text(msg);
    }).always(function(){
      quickAddBusy=false;
      $save.prop('disabled',false).text('Save');
    });
  });
});

/* Searchable, consistently sorted dropdowns across forms and filters */
jQuery(function($){
  function sortOptions($select){
    if(String($select.data('alpha'))!=='1') return;
    var $opts=$select.find('option');
    if($opts.length<2) return;

    // Preserve the real selected value before detaching/reordering options.
    // Without this, removing the placeholder temporarily makes the browser
    // auto-select the first real option (for example Corporate), which then
    // appears as the default filter value.
    var selectedValue=String($select.val()==null?'':$select.val());
    var $first=$opts.first(), firstVal=String($first.val()||''), firstText=$.trim($first.text()).toLowerCase();
    var keepFirst=(firstVal===''||firstVal==='0'||firstText.indexOf('select')===0||firstText.indexOf('all ')===0);
    var first=keepFirst?$first.detach():null;
    var rest=$select.find('option').get().sort(function(a,b){
      return $.trim($(a).text()).localeCompare($.trim($(b).text()),undefined,{numeric:true,sensitivity:'base'});
    });
    $select.empty();
    if(first)$select.append(first);
    $select.append(rest);

    // Explicitly restore selection, including empty/0 placeholder values.
    // If the previous value is no longer available, fall back to the first
    // placeholder rather than silently selecting a business value.
    if($select.find('option').filter(function(){return String(this.value)===selectedValue;}).length){
      $select.val(selectedValue);
    }else if(keepFirst){
      $select.val(firstVal);
    }
  }

  function fireNativeChange(el){
    if(!el)return;
    try{el.dispatchEvent(new Event('change',{bubbles:true}));}
    catch(e){var ev=document.createEvent('Event');ev.initEvent('change',true,true);el.dispatchEvent(ev);}
  }

  function enhanceSelect(el){
    var $select=$(el);
    if($select.data('search-ready')) return;
    if($select.prop('multiple')) return;
    $select.data('search-ready',1);
    sortOptions($select);

    var $wrap=$('<div class="erp-search-select"></div>');
    var $input=$select.hasClass('job-order-select')?$('<textarea class="erp-search-select-input job-order-wrap-input" rows="2" autocomplete="off" aria-label="Search options"></textarea>'):$('<input type="search" class="erp-search-select-input" autocomplete="off" aria-label="Search options">');
    var $menu=$('<div class="erp-search-select-menu" hidden></div>');
    $select.wrap($wrap);
    $wrap=$select.parent();
    $select.addClass('erp-native-select');
    $wrap.append($input,$menu);
    $menu.data('owner-wrap',$wrap[0]);

    function selectedText(){
      var $o=$select.find('option:selected');
      return $.trim($o.text());
    }
    function buildMenu(query){
      var q=$.trim(query||'').toLowerCase();
      $menu.empty();
      var count=0;
      $select.find('option').each(function(){
        var val=String(this.value||''),txt=$.trim($(this).text());
        if(q && txt.toLowerCase().indexOf(q)===-1) return;
        var $b=$('<button type="button" class="erp-search-option"></button>').text(txt).attr('data-value',val);
        if(String($select.val()||'')===val)$b.addClass('selected');
        $menu.append($b);count++;
      });
      if(!count)$menu.append('<div class="erp-search-empty">No matching options</div>');
    }
    function positionMenu(){
      if(!$wrap.length||!$menu.length)return;
      var el=$wrap[0],rect=el.getBoundingClientRect();
      var gap=4,viewportH=window.innerHeight||document.documentElement.clientHeight||800;
      var desired=Math.min(280,Math.max(160,viewportH*0.38));
      var roomBelow=viewportH-rect.bottom-gap,roomAbove=rect.top-gap;
      var openUp=roomBelow<160&&roomAbove>roomBelow;
      var maxH=Math.max(120,Math.min(desired,openUp?roomAbove:roomBelow));
      $menu.css({
        position:'fixed',
        left:Math.max(8,rect.left)+'px',
        width:Math.max(180,rect.width)+'px',
        right:'auto',
        top:openUp?'auto':Math.max(8,rect.bottom+gap)+'px',
        bottom:openUp?Math.max(8,viewportH-rect.top+gap)+'px':'auto',
        maxHeight:maxH+'px',
        zIndex:2147483000
      });
    }
    function openMenu(){
      if($select.prop('disabled')){closeMenu();return;}
      // Render the options as a body-level floating layer. This prevents
      // tables, cards, modals and horizontal-scroll wrappers from clipping it.
      var typed=$.trim($input.val()||'');
      var current=$.trim(selectedText()||'');
      buildMenu(typed===current?'':typed);
      if(!$menu.parent().is('body'))$menu.appendTo(document.body);
      positionMenu();
      $menu.removeAttr('hidden');
    }
    function closeMenu(){$menu.attr('hidden',true);}
    function sync(){
      var disabled=!!$select.prop('disabled');
      $input.val(selectedText()).prop('disabled',disabled).attr('aria-disabled',disabled?'true':'false');
      $wrap.toggleClass('erp-search-select-disabled',disabled);
      if(disabled)closeMenu();
      buildMenu('');
    }
    el._bsoerpRefresh=function(){sortOptions($select);sync();};

    sync();
    $input.on('focus',function(){
      openMenu();
      setTimeout(function(){try{$input[0].select();}catch(e){}},0);
    }).on('click',function(){openMenu();}).on('input',function(){
      if($select.prop('disabled')){sync();return;}
      var typed=$.trim($input.val()||'');
      var isFilter=$select.closest('.toolbar,.master-toolbar,.task-log-toolbar').length>0;
      if(isFilter){
        var exact=null;
        $select.find('option').each(function(){
          if($.trim($(this).text()).toLowerCase()===typed.toLowerCase()) exact=this;
        });
        if(exact){
          var next=String(exact.value||'');
          if(String($select.val()||'')!==next){$select.val(next);fireNativeChange(el);}
        }else if(typed==='' && String($select.val()||'')!==''){
          var $empty=$select.find('option').filter(function(){return String(this.value||'')===''||String(this.value||'')==='0';}).first();
          if($empty.length){$select.val(String($empty.val()||''));fireNativeChange(el);}
        }else if(typed!==$.trim(selectedText()||'')){
          // While the user is typing a partial filter query, do not leave a
          // stale hidden selection active behind the visible search text.
          var $blank=$select.find('option').filter(function(){return String(this.value||'')===''||String(this.value||'')==='0';}).first();
          if($blank.length)$select.val(String($blank.val()||''));
        }
      }
      buildMenu($input.val());
      $menu.removeAttr('hidden');
    });
    $menu.on('click','.erp-search-option',function(){
      if($select.prop('disabled')){closeMenu();return;}
      $select.val(String($(this).data('value')));
      fireNativeChange(el);
      sync();closeMenu();
    });
    $select.on('change',sync);
    $input.on('keydown',function(e){
      if(e.key==='Escape'){closeMenu();$input.blur();}
      if(e.key==='Enter'){
        var $first=$menu.find('.erp-search-option:visible').first();
        if($first.length){e.preventDefault();$first.trigger('click');}
      }
    });
    $(window).on('resize scroll',function(){if(!$menu.attr('hidden'))positionMenu();});
  }

  function scan(root){
    // v2.6.60: every single-select dropdown in the ERP is searchable, including
    // filters, forms, inline item rows, popup forms and legacy no-search-select controls.
    $(root).find('select').addBack('select').each(function(){enhanceSelect(this);});
  }
  scan(document);

  var observer=new MutationObserver(function(mutations){
    mutations.forEach(function(m){
      m.addedNodes.forEach(function(node){
        if(node.nodeType!==1) return;
        // OPTION nodes are intentionally ignored here. Enhanced selects can
        // reorder options during refresh; observing those mutations caused
        // recursive refresh loops. Dynamic code that adds an option calls
        // _bsoerpRefresh() explicitly on that one select instead.
        if(node.tagName==='OPTION') return;
        scan(node);
      });
    });
  });
  observer.observe(document.body,{childList:true,subtree:true});

  $(document).on('mousedown',function(e){
    $('.erp-search-select-menu').each(function(){
      var $menu=$(this),owner=$menu.data('owner-wrap');
      var insideMenu=$(e.target).closest($menu).length>0;
      var insideOwner=owner&&$(e.target).closest(owner).length>0;
      if(!insideMenu&&!insideOwner)$menu.attr('hidden',true);
    });
  });
});

// v2.4.3 live UI theme settings preview
(function(){
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }
  ready(function(){
    var form=document.getElementById('bsoerp-settings-form');
    if(!form) return;
    var root=document.documentElement;
    var defaults={theme_color:'#12b8a6',font_color:'#0b1220',secondary_font_color:'#374151',font_weight:'500',font_size:'12',border_color:'#12b8a6',table_header_bg:'#f2f4f7',card_bg:'#ffffff',button_text_color:'#ffffff'};
    var cssMap={theme_color:'--bsoerp-theme',font_color:'--bsoerp-font-color',secondary_font_color:'--bsoerp-secondary-color',font_weight:'--bsoerp-font-weight',font_size:'--bsoerp-font-size',border_color:'--bsoerp-border-color',table_header_bg:'--bsoerp-table-head-bg',card_bg:'--bsoerp-card-bg',button_text_color:'--bsoerp-button-text'};
    function apply(key,value){ if(cssMap[key]) root.style.setProperty(cssMap[key],key==='font_size'?value+'px':value); }
    form.querySelectorAll('[data-theme-key]').forEach(function(el){
      el.addEventListener('input',function(){
        var key=el.getAttribute('data-theme-key'), val=el.value;
        apply(key,val);
        if(el.type==='color'){
          var txt=form.querySelector('[data-color-text="'+key+'"]');
          if(txt) txt.value=val.toUpperCase();
        }
      });
    });
    form.querySelectorAll('[data-color-text]').forEach(function(txt){
      txt.addEventListener('change',function(){
        var key=txt.getAttribute('data-color-text'), val=txt.value.trim();
        if(!/^#[0-9a-fA-F]{6}$/.test(val)) return;
        var picker=form.querySelector('input[type="color"][data-theme-key="'+key+'"]');
        if(picker) picker.value=val;
        apply(key,val);
      });
    });
    form.addEventListener('submit',function(){
      form.querySelectorAll('[data-color-text]').forEach(function(txt){
        var key=txt.getAttribute('data-color-text'), val=txt.value.trim();
        if(/^#[0-9a-fA-F]{6}$/.test(val)){
          var picker=form.querySelector('input[type="color"][data-theme-key="'+key+'"]');
          if(picker) picker.value=val;
        }
      });
    });
    var reset=document.getElementById('bsoerp-theme-reset');
    if(reset) reset.addEventListener('click',function(){
      Object.keys(defaults).forEach(function(key){
        var el=form.querySelector('[data-theme-key="'+key+'"]');
        if(el) el.value=defaults[key];
        var txt=form.querySelector('[data-color-text="'+key+'"]');
        if(txt) txt.value=defaults[key].toUpperCase();
        apply(key,defaults[key]);
      });
    });
  });
})();
/* Task Update Log filters are rendered server-side. Do not inject a second client-side toolbar. */
/* Ensure status is always rendered in the task update form and lock a preselected task. */
(function(){
  function setup(){var heading=document.querySelector('.bsoerp-top h1');if(!heading||heading.textContent.trim()!=='Task Update Log')return;var form=document.querySelector('form[action*="bsoerp_save_task_update"]');if(!form||form.querySelector('select[name="status"]'))return;var task=form.querySelector('select[name="task_id"]'),remarks=form.querySelector('textarea[name="update_text"]');if(!task||!remarks)return;var taskId=new URL(window.location.href).searchParams.get('task_id');if(taskId&&task.value===taskId){var hidden=document.createElement('input');hidden.type='hidden';hidden.name='task_id';hidden.value=taskId;task.name='';task.disabled=true;task.parentNode.appendChild(hidden);}var label=remarks.closest('label');label.querySelector('span').textContent='Remarks';var statusLabel=document.createElement('label');statusLabel.innerHTML='<span>Status *</span><select name="status" required><option value="In Progress">In Progress</option><option value="Completed">Complete</option><option value="Canceled">Cancel</option></select>';label.parentNode.insertBefore(statusLabel,label);var status=statusLabel.querySelector('select');function sync(){var required=status.value==='In Progress';remarks.required=required;label.querySelector('span').textContent=required?'Remarks *':'Remarks';}status.addEventListener('change',sync);sync();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',setup);else setup();
})();

/* The log is read-only; a task update is opened only from an active task. */
(function(){
  function configureTaskUpdate(){
    var heading=document.querySelector('.bsoerp-top h1');
    if(!heading||heading.textContent.trim()!=='Task Update Log')return;
    var params=new URL(window.location.href).searchParams;
    var isUpdate=params.get('add_update')==='1';
    var panel=document.querySelector('.listing-panel');
    if(panel&&!isUpdate){var add=panel.querySelector('.head-actions .primary');if(add)add.remove();}
    if(!isUpdate)return;
    heading.textContent='Update Task';
    var form=document.querySelector('form[action*="bsoerp_save_task_update"]');
    var remarks=form&&form.querySelector('textarea[name="update_text"]');
    if(form&&remarks&&!form.querySelector('select[name="status"]')){var remarksLabel=remarks.closest('label');remarksLabel.querySelector('span').textContent='Remarks *';var statusLabel=document.createElement('label');statusLabel.innerHTML='<span>Status *</span><select name="status" required><option value="In Progress">In Progress</option><option value="Completed">Complete</option><option value="Canceled">Cancel</option></select>';remarksLabel.parentNode.insertBefore(statusLabel,remarksLabel);var status=statusLabel.querySelector('select');function sync(){var required=status.value==='In Progress';remarks.required=required;remarksLabel.querySelector('span').textContent=required?'Remarks *':'Remarks';}status.addEventListener('change',sync);sync();}
    var task=form&&form.querySelector('select[name="task_id"]');
    var taskId=params.get('task_id');
    if(task&&taskId){
      task.value=taskId;
      var hidden=document.createElement('input');hidden.type='hidden';hidden.name='task_id';hidden.value=taskId;
      task.name='';task.disabled=true;task.parentNode.appendChild(hidden);
    }
    if(form&&!form.querySelector('.task-update-status-row')){
      var oldStatus=form.querySelector('select[name="status"]');
      if(oldStatus){var oldLabel=oldStatus.closest('label');if(oldLabel)oldLabel.remove();else oldStatus.remove();}
      var updateRemarks=form.querySelector('textarea[name="update_text"]');
      var updateRemarksLabel=updateRemarks&&updateRemarks.closest('label');
      if(updateRemarksLabel){updateRemarksLabel.querySelector('span').textContent='Remarks *';var row=document.createElement('label');row.className='task-update-status-row';row.innerHTML='<span>Status *</span><select name="status" required><option value="In Progress">In Progress</option><option value="Completed">Complete</option><option value="Canceled">Cancel</option></select>';updateRemarksLabel.parentNode.insertBefore(row,updateRemarksLabel);var updateStatus=row.querySelector('select');function syncUpdateRemarks(){var needed=updateStatus.value==='In Progress';updateRemarks.required=needed;updateRemarksLabel.querySelector('span').textContent=needed?'Remarks *':'Remarks';}updateStatus.addEventListener('change',syncUpdateRemarks);syncUpdateRemarks();}
    }
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',configureTaskUpdate);else configureTaskUpdate();
})();

/* Place account controls in the fixed sidebar footer. */
(function(){
  function moveAccount(){var user=document.querySelector('.bsoerp-user'),side=document.querySelector('.bsoerp-side');if(!user||!side||side.querySelector('.bsoerp-account'))return;var footer=document.createElement('div');footer.className='bsoerp-account';var name=document.createElement('strong');name.textContent=user.textContent.trim();var logout=document.createElement('a');logout.textContent='Log out';logout.href=(window.BSOERP&&BSOERP.logoutUrl)||'/wp-login.php?action=logout';footer.appendChild(name);footer.appendChild(logout);side.appendChild(footer);user.remove();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',moveAccount);else moveAccount();
})();

/* Put every Excel export in the top-right page header. */
(function(){
  function moveExcel(){var title=document.querySelector('.bsoerp-top h1'),taskTitles=['Tasks In Progress','Task Update Log','Completed Tasks','Canceled Tasks','Tasks Master'];if(title&&taskTitles.indexOf(title.textContent.trim())!==-1)return;var top=document.querySelector('.bsoerp-top'),user=top&&top.querySelector('.bsoerp-user');if(!top||!user)return;var existing=document.querySelector('.head-actions .mobile-excel');if(existing){existing.classList.add('top-excel-export');top.insertBefore(existing,user);}var generated=top.querySelector('.universal-excel-export');if(generated){generated.classList.add('top-excel-export');top.insertBefore(generated,user);}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',moveExcel);else moveExcel();
})();

/* The active queue is for execution, not for creating tasks. */
(function(){
  function removeActiveQueueAdd(){var heading=document.querySelector('.bsoerp-top h1');if(heading&&heading.textContent.trim()==='Tasks In Progress'){var add=document.querySelector('.listing-panel .head-actions .primary');if(add)add.remove();}}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',removeActiveQueueAdd);else removeActiveQueueAdd();
})();

/* Client-side live filters for task registers. No Filter button is required. */
(function(){
  function taskFilters(){
    var title=document.querySelector('.bsoerp-top h1');
    if(!title||['Tasks In Progress','Tasks Master','Completed Tasks','Canceled Tasks'].indexOf(title.textContent.trim())===-1)return;
    var form=document.querySelector('.listing-panel .master-toolbar'),table=document.querySelector('.listing-panel table.data');
    if(!form||!table||form.dataset.taskFilters)return;
    if(form.classList.contains('task-server-toolbar'))return;
    form.dataset.taskFilters='1';
    form.classList.add('task-live-toolbar');
    var headers=[].slice.call(table.querySelectorAll('thead th')).map(function(th){return th.textContent.trim();});
    var ci=headers.indexOf('Customer'),oi=headers.indexOf('Assigned By'),ai=headers.indexOf('Assigned To'),di=headers.indexOf('Due Date');
    if(ci<0||oi<0||ai<0||di<0)return;
    var search=form.querySelector('input[name="s"]'),rows=[].slice.call(table.querySelectorAll('tbody tr')),customers={},owners={},assignees={};
    if(!search)return;
    rows.forEach(function(row){if(row.children[ci])customers[row.children[ci].textContent.trim()]=1;if(row.children[oi])owners[row.children[oi].textContent.trim()]=1;if(row.children[ai])assignees[row.children[ai].textContent.trim()]=1;});
    function addControl(el){var anchor=form.querySelector('.mobile-filter-toggle,.task-filter-clear,.filter-clear');if(anchor)form.insertBefore(el,anchor);else form.appendChild(el);return el;}
    function select(name,label,values){var el=document.createElement('select');el.name=name;el.innerHTML='<option value="">'+label+'</option>'+Object.keys(values).filter(function(v){return v&&v!=='—';}).sort().map(function(value){return '<option>'+value+'</option>';}).join('');return addControl(el);}
    function date(name,label){var input=document.createElement('input');input.type='date';input.name=name;input.title=label;input.setAttribute('aria-label',label);return addControl(input);}
    var customer=select('customer','All Customers',customers),from=date('due_from','Due Date From'),to=date('due_to','Due Date To'),owner=select('task_owner','All Owners',owners),assignee=select('assigned_to','All Assignees',assignees);
    function iso(value){var raw=(value||'').trim();if(/^\d{4}-\d{2}-\d{2}$/.test(raw))return raw;var p=raw.split('/');if(p.length!==3)return'';var y=p[2].length===2?'20'+p[2]:p[2];return y+'-'+String(p[1]).padStart(2,'0')+'-'+String(p[0]).padStart(2,'0');}
    function apply(){var q=(search.value||'').toLowerCase(),visible=0;rows.forEach(function(row){var cells=row.children,text=row.textContent.toLowerCase(),due=cells[di]?iso(cells[di].textContent):'',show=(!q||text.indexOf(q)>-1)&&(!customer.value||(cells[ci]&&cells[ci].textContent.trim()===customer.value))&&(!from.value||due>=from.value)&&(!to.value||due<=to.value)&&(!owner.value||(cells[oi]&&cells[oi].textContent.trim()===owner.value))&&(!assignee.value||(cells[ai]&&cells[ai].textContent.trim()===assignee.value));row.style.display=show?'':'none';if(show)visible++;});var info=document.querySelector('.pagination-info');if(info)info.textContent='Showing '+visible+' of '+rows.length;}
    form.addEventListener('submit',function(e){e.preventDefault();apply();});
    [search,customer,from,to,owner,assignee].forEach(function(input){input.addEventListener('input',apply);input.addEventListener('change',apply);});
    apply();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',taskFilters);else taskFilters();
})();

/* Live task filters use a clear action instead of a submit button. */
(function(){
  function refineTaskFilters(){var heading=document.querySelector('.bsoerp-top h1');if(!heading||['Tasks In Progress','Tasks Master','Completed Tasks','Canceled Tasks'].indexOf(heading.textContent.trim())===-1)return;var form=document.querySelector('.listing-panel .master-toolbar');if(!form||form.classList.contains('task-server-toolbar'))return;var filter=form.querySelector('button[type="submit"]');if(filter)filter.remove();if(form.querySelector('.task-filter-clear'))return;var clear=document.createElement('button');clear.type='button';clear.className='btn task-filter-clear';clear.textContent='Clear';clear.addEventListener('click',function(){form.querySelectorAll('input:not(.erp-search-select-input),select').forEach(function(field){if(field.tagName==='SELECT'){var empty=[].slice.call(field.options||[]).find(function(o){return o.value===''||o.value==='0';});field.value=empty?empty.value:'';field.dispatchEvent(new Event('change',{bubbles:true}));}else{field.value='';field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}));}});form.querySelectorAll('.erp-search-select-menu').forEach(function(menu){menu.setAttribute('hidden','hidden');});if(document.activeElement&&document.activeElement.classList&&document.activeElement.classList.contains('erp-search-select-input'))document.activeElement.blur();});form.appendChild(clear);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',refineTaskFilters);else refineTaskFilters();
})();

/* Finalize the task toolbar after all dynamic controls have been added. */
(function(){
  function finalize(){var heading=document.querySelector('.bsoerp-top h1');if(!heading||['Tasks In Progress','Tasks Master','Completed Tasks','Canceled Tasks'].indexOf(heading.textContent.trim())===-1)return;var form=document.querySelector('.listing-panel .master-toolbar');if(!form||form.classList.contains('task-server-toolbar'))return;var submit=form.querySelector('button[type="submit"]');if(submit)submit.remove();['due_from','due_to'].forEach(function(name){var field=form.querySelector('[name="'+name+'"]');if(field){field.style.width='155px';field.style.maxWidth='155px';}});if(form.querySelector('.task-filter-clear'))return;var clear=document.createElement('button');clear.type='button';clear.className='btn task-filter-clear';clear.textContent='Clear';clear.addEventListener('click',function(){form.querySelectorAll('input:not(.erp-search-select-input),select').forEach(function(field){if(field.tagName==='SELECT'){var empty=[].slice.call(field.options||[]).find(function(o){return o.value===''||o.value==='0';});field.value=empty?empty.value:'';field.dispatchEvent(new Event('change',{bubbles:true}));}else{field.value='';field.dispatchEvent(new Event('input',{bubbles:true}));field.dispatchEvent(new Event('change',{bubbles:true}));}});form.querySelectorAll('.erp-search-select-menu').forEach(function(menu){menu.setAttribute('hidden','hidden');});if(document.activeElement&&document.activeElement.classList&&document.activeElement.classList.contains('erp-search-select-input'))document.activeElement.blur();});form.appendChild(clear);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(finalize,100);});else setTimeout(finalize,100);
})();

/* Provide a consistent Excel export for every table view without a server export link. */
(function(){
  function csvCell(value){var text=String(value||'').replace(/\s+/g,' ').trim();return /[",\n]/.test(text)?'"'+text.replace(/"/g,'""')+'"':text;}
  function addExport(){var tables=[].slice.call(document.querySelectorAll('table.data'));if(!tables.length||document.querySelector('.mobile-excel,.top-excel-export'))return;var top=document.querySelector('.bsoerp-top'),heading=top&&top.querySelector('h1');if(!top||!heading||top.querySelector('.universal-excel-export'))return;if(['Add Delivery','Dashboard','Daily Activity'].indexOf(heading.textContent.trim())!==-1)return;var button=document.createElement('button');button.type='button';button.className='btn universal-excel-export';button.textContent='⇩ Excel';button.addEventListener('click',function(){var lines=[];tables.forEach(function(table,index){if(index)lines.push('');table.querySelectorAll('tr').forEach(function(row){lines.push([].slice.call(row.querySelectorAll('th,td')).map(function(cell){return csvCell(cell.innerText);}).join(','));});});var blob=new Blob(['\ufeff'+lines.join('\n')],{type:'text/csv;charset=utf-8;'}),link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download=(heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g,'-')||'export')+'.csv';link.click();URL.revokeObjectURL(link.href);});heading.parentNode.insertBefore(button,heading.nextSibling);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',addExport);else addExport();
})();

/* Page name is rendered only in the top header, never twice in a panel. */
(function(){
  function removeDuplicateTitles(){var top=document.querySelector('.bsoerp-top h1');if(!top)return;var name=top.textContent.trim();document.querySelectorAll('.panel-head h2').forEach(function(title){if(title.textContent.trim()===name){var container=title.parentElement;if(container)container.remove();}});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',removeDuplicateTitles);else removeDuplicateTitles();
})();

/* Task History action removed from task listings. */

/* Task status is changed only through the task update log. */
(function(){
  var heading=document.querySelector('.bsoerp-top h1');
  if(!heading)return;
  if(heading.textContent.trim()==='Task Update Log'){
    var form=document.querySelector('form[action*="bsoerp_save_task_update"]');
    if(form){
      var remarks=form.querySelector('textarea[name="update_text"]');
      if(remarks){
        var remarksLabel=remarks.closest('label');
        if(remarksLabel){
          remarksLabel.querySelector('span').textContent='Remarks';
          var statusLabel=document.createElement('label');
          statusLabel.innerHTML='<span>Status *</span><select class="erp-searchable" data-alpha="1" name="status" required><option value="In Progress">In Progress</option><option value="Completed">Complete</option><option value="Canceled">Cancel</option></select>';
          remarksLabel.parentNode.insertBefore(statusLabel,remarksLabel);
          var status=statusLabel.querySelector('select');
          function syncRemarks(){var needed=status.value==='In Progress';remarks.required=needed;remarksLabel.querySelector('span').textContent=needed?'Remarks *':'Remarks';}
          status.addEventListener('change',syncRemarks);syncRemarks();
        }
      }
    }
  }
  if(heading.textContent.trim()==='Tasks Master'&&window.BSOERP){
    fetch(BSOERP.ajaxurl+'?action=bsoerp_task_summaries&nonce='+encodeURIComponent(BSOERP.nonce)).then(function(r){return r.json();}).then(function(response){
      if(!response.success)return;
      var byTitle={};response.data.forEach(function(task){if(!(task.title in byTitle))byTitle[task.title]=task;});
      var table=document.querySelector('.data');if(!table)return;
      var headers=table.querySelector('thead tr');var actionHeader=headers&&headers.lastElementChild;if(headers&&actionHeader){actionHeader.previousElementSibling.textContent='Task Status';var updateDateHeader=document.createElement('th');updateDateHeader.textContent='Update Date';headers.insertBefore(updateDateHeader,actionHeader);var updateTimeHeader=document.createElement('th');updateTimeHeader.textContent='Update Time';headers.insertBefore(updateTimeHeader,actionHeader);var remarksHeader=document.createElement('th');remarksHeader.textContent='Task Remarks';headers.insertBefore(remarksHeader,actionHeader);}
      table.querySelectorAll('tbody tr').forEach(function(row){var taskCell=row.children[2];var actionCell=row.lastElementChild;var task=taskCell&&byTitle[taskCell.textContent.trim()];var updateDate=document.createElement('td'),updateTime=document.createElement('td'),remarks=document.createElement('td');var dt=task&&task.update_created_at?String(task.update_created_at):'';if(dt){var parts=dt.split(' '),d=(parts[0]||'').split('-'),tm=(parts[1]||'').split(':');updateDate.textContent=d.length===3?(d[2]+'/'+d[1]+'/'+d[0]):'—';if(tm.length>=2){var hh=parseInt(tm[0],10),mm=tm[1],ap=hh>=12?'PM':'AM';hh=hh%12||12;updateTime.textContent=hh+':'+mm+' '+ap;}else updateTime.textContent='—';}else{updateDate.textContent='—';updateTime.textContent='—';}remarks.textContent=task&&task.remarks?task.remarks:'—';row.insertBefore(updateDate,actionCell);row.insertBefore(updateTime,actionCell);row.insertBefore(remarks,actionCell);});
    }).catch(function(){});
  }
})();

/* Pending tasks open directly into their progress-update form. */
(function(){
  var heading=document.querySelector('.bsoerp-top h1');
  if(!heading||heading.textContent.trim()!=='Tasks In Progress')return;
  document.querySelectorAll('.data .actions a[title="Edit"]').forEach(function(link){
    var originalHref=link.href;
    var editLink=link.cloneNode(true);
    editLink.href=originalHref;
    editLink.title='Edit Task';
    editLink.setAttribute('aria-label','Edit Task');
    editLink.classList.add('task-edit-action');
    editLink.textContent='✎';
    link.parentNode.appendChild(editLink);
    var taskId=(new URL(originalHref,window.location.origin)).searchParams.get('edit');
    if(taskId){
      var updateUrl=new URL(window.location.href);
      updateUrl.pathname=updateUrl.pathname.replace('tasks-in-progress','task-update-log');
      updateUrl.search='?add_update=1&task_id='+encodeURIComponent(taskId);
      link.href=updateUrl.toString();
    }
    link.title='Update Task';
    link.setAttribute('aria-label','Update Task');
    link.classList.add('task-update-action','update-icon-action');
    link.textContent='✓';
  });
})();

// v2.4.7 one-time flash notices
(function(){
  function ready(fn){ if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',fn); else fn(); }
  ready(function(){
    var params;
    try { params=new URLSearchParams(window.location.search); } catch(e) { return; }
    if(!params.has('notice')) return;

    // Remove the notice flag immediately so browser refresh does not replay it.
    params.delete('notice');
    var clean=window.location.pathname + (params.toString() ? '?' + params.toString() : '') + window.location.hash;
    try { window.history.replaceState({},document.title,clean); } catch(e) {}

    // Auto-dismiss only redirect/flash notices. Inline validation/system notices remain untouched.
    var notice=document.querySelector('.bsoerp-content > .notice.success');
    if(!notice) return;
    notice.setAttribute('role','status');
    notice.style.transition='opacity .25s ease, transform .25s ease';
    window.setTimeout(function(){
      notice.style.opacity='0';
      notice.style.transform='translateY(-4px)';
      window.setTimeout(function(){ if(notice && notice.parentNode) notice.parentNode.removeChild(notice); },260);
    },3000);
  });
})();

/* v2.4.8 mobile filter funnel */
document.addEventListener('click', function(e){
  var btn=e.target.closest('.mobile-filter-toggle');
  if(!btn) return;
  e.preventDefault();
  var form=btn.closest('.master-toolbar');
  if(!form) return;
  var open=form.classList.toggle('mobile-filters-open');
  btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  btn.setAttribute('aria-label', open ? 'Hide filters' : 'Show filters');
});

/* v2.4.9 compact mobile list header actions */
(function(){
  function iconFilter(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg>';}
  function iconExcel(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M8 8l4 8m0-8l-4 8M14 8h3M14 12h3M14 16h3" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>';}
  function setupMobileListHeader(){
    if(!window.matchMedia || !window.matchMedia('(max-width:600px)').matches) return;
    var top=document.querySelector('.bsoerp-top');
    var panel=document.querySelector('.listing-panel');
    if(!top || !panel || top.querySelector('.mobile-top-actions')) return;
    var actions=document.createElement('div');
    actions.className='mobile-top-actions';

    var toolbar=panel.querySelector('.master-toolbar');
    if(toolbar){
      var filter=document.createElement('button');
      filter.type='button';
      filter.className='mobile-top-action mobile-top-filter';
      filter.setAttribute('aria-label','Filters');
      filter.setAttribute('title','Filters');
      filter.setAttribute('aria-expanded','false');
      filter.innerHTML=iconFilter();
      filter.addEventListener('click',function(){
        var open=toolbar.classList.toggle('mobile-filters-open');
        filter.setAttribute('aria-expanded',open?'true':'false');
      });
      actions.appendChild(filter);
    }

    var excel=panel.querySelector('.head-actions .mobile-excel');
    if(excel){
      var x=document.createElement('a');
      x.className='mobile-top-action mobile-top-excel';
      x.href=excel.href;
      x.setAttribute('aria-label','Export Excel');
      x.setAttribute('title','Export Excel');
      x.innerHTML=iconExcel();
      actions.appendChild(x);
    }

    var pdf=panel.querySelector('.head-actions .task-pdf');
    if(pdf){
      var p=document.createElement('a');
      p.className='mobile-top-action mobile-top-pdf';
      p.href=pdf.href;
      p.target='_blank';
      p.setAttribute('aria-label','Export PDF');
      p.setAttribute('title','Export PDF');
      p.textContent='PDF';
      actions.appendChild(p);
    }

    var add=panel.querySelector('.head-actions .primary');
    if(add){
      var a=document.createElement('a');
      a.className='mobile-top-action mobile-top-add';
      a.href=add.href;
      a.setAttribute('aria-label',add.textContent.trim());
      a.setAttribute('title',add.textContent.trim());
      a.textContent='+';
      actions.appendChild(a);
    }
    if(actions.children.length) top.appendChild(actions);

    var search=panel.querySelector('.master-toolbar input[type="search"]');
    if(search) search.setAttribute('placeholder','Search');
  }
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',setupMobileListHeader);
  else setupMobileListHeader();
})();


/* v2.5.0 reliable Add/Edit form save */
(function(){
  function ready(fn){if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',fn);else fn();}
  ready(function(){
    document.querySelectorAll('form.erp-form[data-save-form="1"]').forEach(function(form){
      if(form.dataset.saveReady==='1')return;
      form.dataset.saveReady='1';
      var btn=form.querySelector('.erp-save-btn');
      var msg=form.querySelector('.erp-save-message');
      var busy=false;
      function showMessage(text){if(!msg)return;msg.textContent=text;msg.hidden=false;msg.classList.add('error');}
      function clearMessage(){if(!msg)return;msg.textContent='';msg.hidden=true;msg.classList.remove('error');}
      function validateCustomSelects(){
        var first=null;
        form.querySelectorAll('select[data-required="1"]').forEach(function(sel){
          var val=String(sel.value==null?'':sel.value).trim();
          var invalid=(val===''||val==='0');
          var wrap=sel.closest('.erp-search-select')||sel.closest('.select-with-add')||sel.parentElement;
          if(wrap)wrap.classList.toggle('erp-field-error',invalid);
          if(invalid&&!first)first=sel;
        });
        if(first){
          var wrap=first.closest('.erp-search-select');
          var visible=wrap&&wrap.querySelector('.erp-search-select-input');
          if(visible){visible.focus();}
          showMessage('Please complete all required dropdown fields.');
          return false;
        }
        return true;
      }
      form.addEventListener('submit',function(e){
        clearMessage();
        if(busy){e.preventDefault();return;}
        if(!form.checkValidity()){return;}
        if(!validateCustomSelects()){e.preventDefault();return;}
        busy=true;
        if(btn){btn.disabled=true;btn.dataset.originalText=btn.textContent;btn.textContent='Saving…';}
      });
      window.addEventListener('pageshow',function(){
        busy=false;
        if(btn){btn.disabled=false;if(btn.dataset.originalText)btn.textContent=btn.dataset.originalText;}
      });
      form.querySelectorAll('input,textarea,select').forEach(function(el){
        el.addEventListener('input',clearMessage);el.addEventListener('change',clearMessage);
      });
    });
  });
})();


/* v2.5.42: keep all filter controls contained and move Excel/PDF beside the view name. */
(function(){
  function normalizeToolbars(){
    document.querySelectorAll('.panel .toolbar,.listing-panel .toolbar,.master-toolbar,.task-log-toolbar').forEach(function(bar){
      bar.classList.add('erp-contained-toolbar');
    });
  }

  function moveViewExports(){
    var top=document.querySelector('.bsoerp-top');
    var heading=top&&top.querySelector('h1');
    if(!top||!heading)return;

    var holder=top.querySelector('.view-export-actions');
    if(!holder){
      holder=document.createElement('div');
      holder.className='view-export-actions';
      top.appendChild(holder);
    }

    var candidates=[];
    document.querySelectorAll('.listing-panel .head-actions .mobile-excel,.listing-panel .head-actions .task-pdf,.panel .head-actions .mobile-excel,.panel .head-actions .task-pdf').forEach(function(el){candidates.push(el);});
    top.querySelectorAll('.universal-excel-export,.top-excel-export').forEach(function(el){if(candidates.indexOf(el)===-1)candidates.push(el);});

    // Orders and Purchase Orders: keep the Add action directly beside Excel.
    var orderHeaderViews=['Orders In Progress','Order Master','Canceled Orders','Pending PO','Purchase Orders','Completed POs','Canceled PO'];
    if(orderHeaderViews.indexOf(heading.textContent.trim())!==-1){
      var orderAdd=document.querySelector('.listing-panel .head-actions .primary');
      if(orderAdd&&candidates.indexOf(orderAdd)===-1){
        orderAdd.classList.add('view-add-action');
        candidates.push(orderAdd);
      }
    }

    candidates.forEach(function(el){
      if(!el||holder.contains(el))return;
      if(el.classList.contains('mobile-excel')||el.classList.contains('universal-excel-export'))el.classList.add('top-excel-export');
      holder.appendChild(el);
    });

    if(!holder.children.length)holder.remove();
  }

  function apply(){normalizeToolbars();moveViewExports();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){apply();setTimeout(apply,150);setTimeout(apply,500);});
  else{apply();setTimeout(apply,150);setTimeout(apply,500);}
  window.addEventListener('load',apply);
})();

/* v2.5.43: visible filter labels + automatic filtering across application. */
(function(){
  function titleCase(value){
    return String(value||'').replace(/[_-]+/g,' ').replace(/\b\w/g,function(c){return c.toUpperCase();}).trim();
  }
  function filterLabel(el){
    var name=(el.getAttribute('name')||'').toLowerCase();
    var map={
      s:'Search',search:'Search',customer:'Customer',customer_id:'Customer',due_from:'Due Date From',due_to:'Due Date To',
      task_owner:'Assigned By',assigned_to:'Assigned To',status:'Status',master_status:'Status',updated_by:'Updated By',
      from:'Date From',to:'Date To',date_from:'Date From',date_to:'Date To',category_id:'Category',industry_id:'Industry',
      role_id:'Role',designation_id:'Designation',department_id:'Department',machine_type_id:'Machine Type'
    };
    if(map[name])return map[name];
    var ph=(el.getAttribute('placeholder')||'').trim();
    if(ph)return ph.replace(/^All\s+/i,'').replace(/^Search\s+/i,'Search ');
    var aria=(el.getAttribute('aria-label')||'').trim();if(aria)return aria;
    var title=(el.getAttribute('title')||'').trim();if(title)return title.replace(/^From date$/i,'Date From').replace(/^To date$/i,'Date To');
    if(el.tagName==='SELECT'){
      var first=el.options&&el.options.length?el.options[0].text.trim():'';
      if(first)return first.replace(/^All\s+/i,'').replace(/^Select\s+/i,'');
    }
    return name?titleCase(name):'Filter';
  }
  function addLabels(toolbar){
    if(!toolbar||toolbar.dataset.filterLabels==='1')return;
    toolbar.dataset.filterLabels='1';
    Array.prototype.slice.call(toolbar.children).forEach(function(child){
      if(child.matches('button,.btn,a,input[type="hidden"],.mobile-filter-toggle'))return;
      if(child.matches('label')){child.classList.add('filter-field');return;}
      var target=child;
      if(child.classList.contains('erp-search-select'))target=child.querySelector('select')||child.querySelector('input');
      if(!target||!target.matches('input,select'))return;
      var wrap=document.createElement('label');wrap.className='filter-field';
      var text=document.createElement('span');text.className='filter-label';text.textContent=filterLabel(target);
      child.parentNode.insertBefore(wrap,child);wrap.appendChild(text);wrap.appendChild(child);
    });
  }
  function scan(){document.querySelectorAll('.bsoerp-app .toolbar,.bsoerp-app .master-toolbar,.bsoerp-app .task-log-toolbar').forEach(addLabels);}
  function autoFilter(form){
    if(!form||form.dataset.autoFilter==='1'||form.classList.contains('task-live-toolbar')||form.classList.contains('task-log-toolbar'))return;
    if(form.tagName!=='FORM')return;
    form.dataset.autoFilter='1';
    var timer;
    function submitNow(){
      if(typeof form.requestSubmit==='function')form.requestSubmit();else form.submit();
    }
    form.addEventListener('change',function(e){
      if(form.dataset.clearing==='1')return;
      if(e.target.matches('select,input[type="date"],input[type="month"]'))submitNow();
    });
    form.addEventListener('input',function(e){
      if(form.dataset.clearing==='1'||!e.target.matches('input[type="search"]'))return;
      clearTimeout(timer);timer=setTimeout(submitNow,450);
    });
    form.querySelectorAll('button[type="submit"]').forEach(function(btn){btn.style.display='none';});
  }
  function init(){
    scan();
    document.querySelectorAll('.bsoerp-app form.toolbar,.bsoerp-app form.master-toolbar').forEach(autoFilter);
    var observer=new MutationObserver(function(){scan();document.querySelectorAll('.bsoerp-app form.toolbar,.bsoerp-app form.master-toolbar').forEach(autoFilter);});
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


/* v2.5.45 — Safe Clear across all filter toolbars: reset values without opening searchable dropdowns. */
(function(){
  function isClearControl(el){
    if(!el)return false;
    if(el.classList&&el.classList.contains('filter-clear'))return true;
    if(el.classList&&el.classList.contains('task-filter-clear'))return true;
    return el.tagName==='BUTTON'&&/^clear$/i.test((el.textContent||'').trim());
  }
  function resetSelect(select){
    var options=[].slice.call(select.options||[]);
    var empty=options.find(function(o){return o.value===''||o.value==='0';});
    if(empty)select.value=empty.value;else if(options.length)select.selectedIndex=0;
  }
  function closeMenus(toolbar){
    toolbar.querySelectorAll('.erp-search-select-menu').forEach(function(menu){menu.setAttribute('hidden','hidden');});
    toolbar.querySelectorAll('.erp-search-select-input').forEach(function(input){
      var wrap=input.closest('.erp-search-select'),native=wrap&&wrap.querySelector('select');
      if(native){var opt=native.options[native.selectedIndex];input.value=opt?opt.text:'';}
    });
    if(document.activeElement&&document.activeElement.classList&&document.activeElement.classList.contains('erp-search-select-input'))document.activeElement.blur();
  }
  document.addEventListener('click',function(e){
    var control=e.target.closest&&e.target.closest('button,a');
    if(!isClearControl(control))return;
    var toolbar=control.closest('.toolbar,.master-toolbar,.task-log-toolbar');
    if(!toolbar)return;
    e.preventDefault();e.stopImmediatePropagation();
    var form=toolbar.tagName==='FORM'?toolbar:null;
    if(form)form.dataset.clearing='1';
    var nativeSelects=[].slice.call(toolbar.querySelectorAll('select'));
    var plainInputs=[].slice.call(toolbar.querySelectorAll('input')).filter(function(input){
      return input.type!=='hidden'&&!input.classList.contains('erp-search-select-input');
    });
    plainInputs.forEach(function(input){input.value='';});
    nativeSelects.forEach(resetSelect);
    // Sync enhanced dropdown display text without firing visible-search input events.
    nativeSelects.forEach(function(select){select.dispatchEvent(new Event('change',{bubbles:true}));});
    plainInputs.forEach(function(input){input.dispatchEvent(new Event('input',{bubbles:true}));input.dispatchEvent(new Event('change',{bubbles:true}));});
    closeMenus(toolbar);
    if(form){
      delete form.dataset.clearing;
      if(form.dataset.autoFilter==='1'){
        if(typeof form.requestSubmit==='function')form.requestSubmit();else form.submit();
      }
    }
  },true);
})();

/* v2.5.46 — robust live filtering after searchable-select / label enhancement. */
(function(){
  function text(el){return el?String(el.textContent||'').trim():'';}
  function isoDate(raw){
    raw=String(raw||'').trim();
    if(/^\d{4}-\d{2}-\d{2}$/.test(raw))return raw;
    var m=raw.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2,4})$/);
    if(!m)return'';
    var y=m[3].length===2?'20'+m[3]:m[3];
    return y+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[1]).padStart(2,'0');
  }
  function tableFor(toolbar){
    var panel=toolbar.closest('.listing-panel,.panel');
    return (panel&&panel.querySelector('table.data'))||document.querySelector('.listing-panel table.data,table.data');
  }
  function headerMap(table){
    var map={};
    [].slice.call(table.querySelectorAll('thead th')).forEach(function(th,i){map[text(th)]=i;});
    return map;
  }
  function field(toolbar,name){return toolbar.querySelector('[name="'+name+'"]');}
  function applyTask(toolbar){
    var table=tableFor(toolbar);if(!table)return;
    var h=headerMap(table),ci=h.Customer,oi=h['Assigned By'],ai=h['Assigned To'],di=h['Due Date'];
    if([ci,oi,ai,di].some(function(v){return typeof v!=='number';}))return;
    var search=field(toolbar,'s'),customer=field(toolbar,'customer'),from=field(toolbar,'due_from'),to=field(toolbar,'due_to'),owner=field(toolbar,'task_owner'),assignee=field(toolbar,'assigned_to');
    var q=search?String(search.value||'').trim().toLowerCase():'',visible=0,rows=[].slice.call(table.querySelectorAll('tbody tr'));
    rows.forEach(function(row){
      var c=row.children,due=c[di]?isoDate(text(c[di])):'';
      var show=(!q||String(row.textContent||'').toLowerCase().indexOf(q)>-1)
        &&(!customer||!customer.value||text(c[ci])===customer.value)
        &&(!from||!from.value||due>=from.value)
        &&(!to||!to.value||due<=to.value)
        &&(!owner||!owner.value||text(c[oi])===owner.value)
        &&(!assignee||!assignee.value||text(c[ai])===assignee.value);
      row.style.display=show?'':'none';if(show)visible++;
    });
    var panel=toolbar.closest('.listing-panel,.panel'),info=panel&&panel.querySelector('.pagination-info');
    if(info)info.textContent='Showing '+visible+' of '+rows.length;
  }
  function normalizeTaskLogNames(toolbar){
    if(!toolbar.classList.contains('task-log-toolbar'))return;
    var search=toolbar.querySelector('input[type="search"]');if(search&&!search.name)search.name='task_log_search';
    var dates=toolbar.querySelectorAll('input[type="date"]');if(dates[0]&&!dates[0].name)dates[0].name='task_log_from';if(dates[1]&&!dates[1].name)dates[1].name='task_log_to';
    var sels=toolbar.querySelectorAll('select');
    if(sels[0]&&!sels[0].name)sels[0].name='task_log_customer';
    if(sels[1]&&!sels[1].name)sels[1].name='task_log_status';
    if(sels[2]&&!sels[2].name)sels[2].name='task_log_user';
  }
  function applyTaskLog(toolbar){
    normalizeTaskLogNames(toolbar);
    var table=tableFor(toolbar);if(!table)return;
    var h=headerMap(table),ci=h.Customer,si=h.Status,ui=h['Updated By'],di=h['Date & Time'];
    if([ci,si,ui,di].some(function(v){return typeof v!=='number';}))return;
    var q=field(toolbar,'task_log_search'),customer=field(toolbar,'task_log_customer'),from=field(toolbar,'task_log_from'),to=field(toolbar,'task_log_to'),status=field(toolbar,'task_log_status'),user=field(toolbar,'task_log_user');
    [].slice.call(table.querySelectorAll('tbody tr')).forEach(function(row){
      var c=row.children,raw=c[di]?(c[di].getAttribute('data-date')||text(c[di])):'',date=isoDate(raw);
      if(!date&&raw){var parsed=new Date(raw);if(!isNaN(parsed))date=parsed.toISOString().slice(0,10);}
      var show=(!q||!q.value||String(row.textContent||'').toLowerCase().indexOf(String(q.value).toLowerCase())>-1)
        &&(!customer||!customer.value||text(c[ci])===customer.value)
        &&(!from||!from.value||date>=from.value)
        &&(!to||!to.value||date<=to.value)
        &&(!status||!status.value||text(c[si])===status.value)
        &&(!user||!user.value||text(c[ui])===user.value);
      row.style.display=show?'':'none';
    });
  }
  function immediateServerFilter(form,e){
    if(!form||form.dataset.clearing==='1'||form.classList.contains('task-live-toolbar'))return;
    if(form.classList.contains('task-log-toolbar'))return;
    if(e.type==='input'&&e.target.type!=='search')return;
    if(e.type==='change'&&!e.target.matches('select,input[type="date"],input[type="month"]'))return;
    clearTimeout(form._bsoerpFilterTimer);
    form._bsoerpFilterTimer=setTimeout(function(){
      if(typeof form.requestSubmit==='function')form.requestSubmit();else form.submit();
    },e.type==='input'?350:0);
  }
  function handle(e){
    var toolbar=e.target.closest&&e.target.closest('.toolbar,.master-toolbar,.task-log-toolbar');if(!toolbar)return;
    if(toolbar.classList.contains('task-live-toolbar')){applyTask(toolbar);return;}
    if(toolbar.classList.contains('task-log-toolbar')){applyTaskLog(toolbar);return;}
    if(toolbar.tagName==='FORM')immediateServerFilter(toolbar,e);
  }
  document.addEventListener('input',handle,true);
  document.addEventListener('change',handle,true);
  function init(){
    document.querySelectorAll('.task-live-toolbar').forEach(applyTask);
    document.querySelectorAll('.task-log-toolbar').forEach(function(bar){normalizeTaskLogNames(bar);applyTaskLog(bar);});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,250);setTimeout(init,800);});else{setTimeout(init,250);setTimeout(init,800);}
})();


/* v2.5.47 — definitive filter synchronization for searchable dropdowns. */
(function(){
  function clean(v){return String(v==null?'':v).replace(/\s+/g,' ').trim();}
  function lower(v){return clean(v).toLowerCase();}
  function headerIndex(table,label){
    var wanted=lower(label),idx=-1;
    Array.prototype.slice.call(table.querySelectorAll('thead th')).some(function(th,i){
      if(lower(th.textContent)===wanted){idx=i;return true;}return false;
    });
    return idx;
  }
  function visibleFilterText(select){
    if(!select)return'';
    var native=clean(select.value);
    if(native && native!=='0')return native;
    var wrap=select.closest('.erp-search-select');
    var input=wrap&&wrap.querySelector('.erp-search-select-input');
    var shown=clean(input&&input.value);
    if(!shown || /^(all|select)\b/i.test(shown))return'';
    return shown;
  }
  function matchesCell(cell,query){
    query=lower(query);if(!query)return true;
    return lower(cell&&cell.textContent).indexOf(query)!==-1;
  }
  function isoDate(raw){
    raw=clean(raw);
    if(/^\d{4}-\d{2}-\d{2}$/.test(raw))return raw;
    var m=raw.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})$/);
    if(!m)return'';
    var y=m[3].length===2?'20'+m[3]:m[3];
    return y+'-'+String(m[2]).padStart(2,'0')+'-'+String(m[1]).padStart(2,'0');
  }
  function applyTaskToolbar(toolbar){
    if(!toolbar||!toolbar.classList.contains('task-live-toolbar'))return;
    var panel=toolbar.closest('.listing-panel,.panel');
    var table=panel&&panel.querySelector('table.data');
    if(!table)return;
    var ci=headerIndex(table,'Customer'),oi=headerIndex(table,'Assigned By'),ai=headerIndex(table,'Assigned To'),di=headerIndex(table,'Due Date');
    if(ci<0||oi<0||ai<0||di<0)return;
    var search=toolbar.querySelector('[name="s"]');
    var customer=toolbar.querySelector('[name="customer"]');
    var owner=toolbar.querySelector('[name="task_owner"]');
    var assignee=toolbar.querySelector('[name="assigned_to"]');
    var from=toolbar.querySelector('[name="due_from"]');
    var to=toolbar.querySelector('[name="due_to"]');
    var q=lower(search&&search.value),cq=visibleFilterText(customer),oq=visibleFilterText(owner),aq=visibleFilterText(assignee);
    var rows=Array.prototype.slice.call(table.querySelectorAll('tbody tr')),visible=0;
    rows.forEach(function(row){
      var cells=row.children,due=isoDate(cells[di]&&cells[di].textContent);
      var ok=(!q||lower(row.textContent).indexOf(q)!==-1)
        && matchesCell(cells[ci],cq)
        && matchesCell(cells[oi],oq)
        && matchesCell(cells[ai],aq)
        && (!from||!from.value||due>=from.value)
        && (!to||!to.value||due<=to.value);
      row.style.display=ok?'':'none';if(ok)visible++;
    });
    var info=panel.querySelector('.pagination-info');
    if(info)info.textContent='Showing '+visible+' of '+rows.length;
  }
  function syncExactFilterSelect(input){
    if(!input||!input.classList.contains('erp-search-select-input'))return;
    var wrap=input.closest('.erp-search-select'),select=wrap&&wrap.querySelector('select');
    var toolbar=input.closest('.toolbar,.master-toolbar,.task-log-toolbar');
    if(!select||!toolbar)return;
    var typed=lower(input.value),exact=null;
    Array.prototype.slice.call(select.options||[]).some(function(opt){
      if(lower(opt.text)===typed){exact=opt;return true;}return false;
    });
    if(exact && String(select.value)!==String(exact.value)){
      select.value=exact.value;
      select.dispatchEvent(new Event('change',{bubbles:true}));
    }
  }
  function rerun(e){
    var toolbar=e.target.closest&&e.target.closest('.task-live-toolbar');
    if(!toolbar)return;
    if(e.target.classList&&e.target.classList.contains('erp-search-select-input'))syncExactFilterSelect(e.target);
    setTimeout(function(){applyTaskToolbar(toolbar);},0);
  }
  document.addEventListener('input',rerun,false);
  document.addEventListener('change',rerun,false);
  document.addEventListener('click',function(e){
    var clear=e.target.closest&&e.target.closest('.task-filter-clear,.filter-clear,button');
    if(!clear||!/^(clear)$/i.test(clean(clear.textContent)))return;
    var toolbar=clear.closest('.task-live-toolbar');
    if(toolbar)setTimeout(function(){applyTaskToolbar(toolbar);},0);
  },false);
  function init(){document.querySelectorAll('.task-live-toolbar').forEach(applyTaskToolbar);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){setTimeout(init,350);setTimeout(init,1000);});
  else{setTimeout(init,350);setTimeout(init,1000);}
})();


/* v2.5.55 — Enquiry Update popup, Updated By, and conditional follow-up */
(function(){
  function syncEnquiryUpdateForm(form){
    if(!form)return;
    var status=form.querySelector('select[name="status"]');
    var field=form.querySelector('.lead-next-follow-up-field');
    var follow=form.querySelector('input[name="next_follow_up"]');
    if(!status||!field||!follow)return;
    var inProgress=status.value==='In Progress';
    field.hidden=!inProgress;
    follow.required=inProgress;
    if(!inProgress)follow.value='';
  }
  function closeModal(modal){
    if(!modal)return;
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden','true');
    document.body.classList.remove('lead-modal-open');
  }
  function openModal(btn){
    var modal=document.getElementById('lead-update-modal');
    if(!modal)return;
    var form=modal.querySelector('.lead-update-form');
    if(!form)return;
    form.reset();
    var id=form.querySelector('input[name="lead_id"]');
    var follow=form.querySelector('input[name="next_follow_up"]');
    var status=form.querySelector('select[name="status"]');
    var title=modal.querySelector('.lead-update-modal-lead');
    if(id)id.value=btn.getAttribute('data-lead-id')||'';
    if(status)status.value=btn.getAttribute('data-lead-status')||'In Progress';
    if(follow)follow.value=btn.getAttribute('data-next-follow-up')||'';
    if(title)title.textContent=btn.getAttribute('data-lead-title')||'';
    syncEnquiryUpdateForm(form);
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden','false');
    document.body.classList.add('lead-modal-open');
    var status=form.querySelector('select[name="status"]');
    if(status)setTimeout(function(){status.focus();},20);
  }
  document.addEventListener('click',function(e){
    var open=e.target.closest&&e.target.closest('.lead-update-open');
    if(open){e.preventDefault();openModal(open);return;}
    var close=e.target.closest&&e.target.closest('[data-lead-update-close]');
    if(close){e.preventDefault();closeModal(close.closest('.lead-update-modal'));}
  });
  document.addEventListener('change',function(e){
    if(e.target.matches&&e.target.matches('.lead-update-form select[name="status"]'))syncEnquiryUpdateForm(e.target.closest('.lead-update-form'));
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape')closeModal(document.querySelector('.lead-update-modal.is-open'));
  });
  function init(){document.querySelectorAll('.lead-update-form').forEach(syncEnquiryUpdateForm);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


/* v2.5.57 — reliable Enquiry Update status visibility */
(function(){
  function apply(form){
    if(!form)return;
    var status=form.querySelector('select[name="status"]');
    var field=form.querySelector('.lead-next-follow-up-field');
    var follow=form.querySelector('input[name="next_follow_up"]');
    if(!status||!field||!follow)return;
    var show=String(status.value||'').trim()==='In Progress';
    field.hidden=!show;
    field.style.display=show?'':'none';
    follow.required=show;
    if(!show)follow.value='';
  }
  document.addEventListener('change',function(e){
    if(e.target.matches&&e.target.matches('.lead-update-form select[name="status"]'))apply(e.target.closest('.lead-update-form'));
  },true);
  document.addEventListener('click',function(e){
    var btn=e.target.closest&&e.target.closest('.lead-update-open');
    if(!btn)return;
    setTimeout(function(){document.querySelectorAll('.lead-update-form').forEach(apply);},0);
  },true);
  function init(){document.querySelectorAll('.lead-update-form').forEach(apply);}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* v2.5.59 — inline form validation and lead queue actions */
(function(){
  function fieldLabel(el){
    var label=el.closest&&el.closest('label');
    if(!label)return 'This field';
    var span=label.querySelector(':scope > span');
    var text=span?span.textContent:'This field';
    return String(text||'This field').replace(/\s*\*\s*$/,'').trim()||'This field';
  }
  function errorNode(el){
    var label=el.closest&&el.closest('label');
    if(!label)return null;
    var n=label.querySelector(':scope > .field-error');
    if(!n){n=document.createElement('small');n.className='field-error';label.appendChild(n);}
    return n;
  }
  function clearError(el){
    var label=el.closest&&el.closest('label');
    if(label)label.classList.remove('has-field-error');
    var n=label&&label.querySelector(':scope > .field-error');
    if(n){n.textContent='';n.hidden=true;}
    var wrap=el.closest&&el.closest('.erp-search-select');if(wrap)wrap.classList.remove('erp-field-error');
  }
  function setError(el,msg){
    var label=el.closest&&el.closest('label');if(label)label.classList.add('has-field-error');
    var n=errorNode(el);if(n){n.textContent=msg;n.hidden=false;}
    var wrap=el.closest&&el.closest('.erp-search-select');if(wrap)wrap.classList.add('erp-field-error');
  }
  function isVisible(el){
    if(el.type==='hidden')return false;
    var label=el.closest&&el.closest('label');
    return !(label&&label.hidden) && !(label&&getComputedStyle(label).display==='none');
  }
  function validate(el){
    var val=String(el.value==null?'':el.value).trim();
    var required=el.required||el.getAttribute('data-required')==='1';
    var selectInvalid=el.tagName==='SELECT'&&(val===''||val==='0');
    if(required&&isVisible(el)&&(val===''||selectInvalid))return fieldLabel(el)+' is required.';
    if(el.name==='mobile'&&val!==''&&!/^\d{10}$/.test(val.replace(/\D/g,'')))return 'Mobile must contain exactly 10 digits.';
    if(el.type==='date'&&val&&el.min&&val<el.min)return fieldLabel(el)+' cannot be earlier than '+el.min.split('-').reverse().join('/')+'.';
    if(el.type==='number'&&val!==''&&el.min!==''&&Number(val)<Number(el.min))return fieldLabel(el)+' must be at least '+el.min+'.';
    return '';
  }
  function validateForm(form){
    var first=null;
    form.querySelectorAll('input,select,textarea').forEach(function(el){
      if(el.type==='hidden')return;
      clearError(el);
      var msg=validate(el);
      if(msg){setError(el,msg);if(!first)first=el;}
    });
    if(first){
      var wrap=first.closest&&first.closest('.erp-search-select');
      var focusEl=wrap&&wrap.querySelector('.erp-search-select-input')||first;
      try{focusEl.focus();}catch(e){}
      return false;
    }
    return true;
  }
  function initForms(){document.querySelectorAll('form.erp-form').forEach(function(f){f.setAttribute('novalidate','novalidate');});}
  document.addEventListener('submit',function(e){
    var form=e.target;if(!form.matches||!form.matches('form.erp-form'))return;
    if(!validateForm(form)){e.preventDefault();e.stopImmediatePropagation();}
  },true);
  document.addEventListener('input',function(e){if(e.target.closest&&e.target.closest('form.erp-form'))clearError(e.target);},true);
  document.addEventListener('change',function(e){if(e.target.closest&&e.target.closest('form.erp-form'))clearError(e.target);},true);

  function closeQueue(modal){if(!modal)return;modal.classList.remove('is-open');modal.setAttribute('aria-hidden','true');document.body.classList.remove('lead-modal-open');}
  function openQueue(btn){
    var modal=document.getElementById('lead-queue-modal');if(!modal)return;
    var form=modal.querySelector('.lead-queue-form');if(!form)return;
    form.reset();form.querySelector('input[name="lead_id"]').value=btn.getAttribute('data-lead-id')||'';
    var type=btn.getAttribute('data-queue')||'';form.querySelector('input[name="queue_type"]').value=type;
    var title=modal.querySelector('.lead-queue-modal-lead');if(title)title.textContent=btn.getAttribute('data-lead-title')||'';
    var heading=modal.querySelector('#lead-queue-modal-title');if(heading)heading.textContent=type==='assignee'?'Update Assigned To':'Update Estimate';
    var a=form.querySelector('.lead-queue-assignee-field'),v=form.querySelector('.lead-queue-estimate-field');
    if(a)a.hidden=type!=='assignee';if(v)v.hidden=type!=='estimate';
    var asel=form.querySelector('select[name="assigned_to"]');if(asel)asel.required=type==='assignee';
    var est=form.querySelector('input[name="expected_value"]');if(est)est.required=type==='estimate';
    form.querySelectorAll('.field-error').forEach(function(n){n.hidden=true;n.textContent='';});
    modal.classList.add('is-open');modal.setAttribute('aria-hidden','false');document.body.classList.add('lead-modal-open');
    setTimeout(function(){var target=type==='assignee'?asel:est;if(target)target.focus();},30);
  }
  document.addEventListener('click',function(e){
    var open=e.target.closest&&e.target.closest('.lead-queue-open');if(open){e.preventDefault();openQueue(open);return;}
    var close=e.target.closest&&e.target.closest('[data-lead-queue-close]');if(close){e.preventDefault();closeQueue(close.closest('.lead-queue-modal'));}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeQueue(document.querySelector('.lead-queue-modal.is-open'));});
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',initForms);else initForms();
})();

/* v2.5.60 — keep header Add actions beside Excel/PDF and queue dropdown native. */
(function(){
  function syncHeaderActions(){
    var top=document.querySelector('.bsoerp-top');
    if(!top)return;
    var holder=top.querySelector('.view-export-actions');
    if(!holder)return;
    var add=holder.querySelector('.view-add-action');
    // Exports may be moved into this holder after page load; keep Add after them.
    if(add)holder.appendChild(add);
  }
  function keepQueueSelectNative(){
    document.querySelectorAll('.lead-queue-modal select[name="assigned_to"]').forEach(function(sel){
      sel.classList.add('no-search-select','lead-queue-user-select');
      var wrap=sel.closest('.erp-search-select');
      if(wrap){
        wrap.parentNode.insertBefore(sel,wrap);
        wrap.remove();
        sel.hidden=false;
        sel.removeAttribute('aria-hidden');
        sel.style.display='block';
      }
    });
  }
  function apply(){syncHeaderActions();keepQueueSelectNative();}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){apply();setTimeout(apply,100);setTimeout(apply,400);});
  else{apply();setTimeout(apply,100);setTimeout(apply,400);}
  window.addEventListener('load',apply);
})();

/* v2.5.65 — Recce total and pending are read-only; pending auto-calculates. */
(function(){
  function modal(){return document.getElementById('recce-update-modal');}
  function closeRecce(){var m=modal();if(!m)return;m.classList.remove('is-open');m.setAttribute('aria-hidden','true');document.body.classList.remove('lead-modal-open');}
  function value(form,name,v){var el=form.querySelector('[name="'+name+'"]');if(el)el.value=v==null?'':v;}
  function clearErrors(form){form.querySelectorAll('.field-error').forEach(function(n){n.hidden=true;n.textContent='';});form.querySelectorAll('.has-field-error').forEach(function(n){n.classList.remove('has-field-error');});}
  function openRecce(btn){
    var m=modal();if(!m)return;var form=m.querySelector('.recce-update-form');if(!form)return;
    form.reset();clearErrors(form);
    value(form,'recce_id',btn.getAttribute('data-recce-id')||'');
    value(form,'no_of_recce',btn.getAttribute('data-total')||'0');
    var openingPending=btn.getAttribute('data-pending')||'0';
    value(form,'pending_recce',openingPending);
    value(form,'opening_pending_recce',openingPending);
    value(form,'completed_recce','');
    value(form,'denied_recce','');
    value(form,'canceled_recce','');
    // Completed / Denied / Cancel are quantities worked from the current Pending balance only.
    ['completed_recce','denied_recce','canceled_recce'].forEach(function(name){
      var input=form.querySelector('[name="'+name+'"]');
      if(input) input.max=String(Math.max(0,Number(openingPending)||0));
    });
    var t=m.querySelector('.recce-update-modal-title');if(t)t.textContent=btn.getAttribute('data-recce-title')||'';
    m.classList.add('is-open');m.setAttribute('aria-hidden','false');document.body.classList.add('lead-modal-open');
    setTimeout(function(){var f=form.querySelector('[name="completed_recce"]');if(f)f.focus();},30);
  }
  function setSumError(form,msg){
    var el=form.querySelector('[name="canceled_recce"]');if(!el)return;
    var label=el.closest('label');if(!label)return;label.classList.add('has-field-error');
    var n=label.querySelector(':scope > .field-error');if(!n){n=document.createElement('small');n.className='field-error';label.appendChild(n);}n.textContent=msg;n.hidden=false;
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.recce-update-open');if(b){e.preventDefault();openRecce(b);return;}
    var c=e.target.closest&&e.target.closest('[data-recce-update-close]');if(c){e.preventDefault();closeRecce();}
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeRecce();});
  document.addEventListener('submit',function(e){
    var form=e.target;if(!form.matches||!form.matches('.recce-update-form'))return;
    clearErrors(form);
    var pending=Number(form.pending_recce.value||0),completed=Number(form.completed_recce.value||0),denied=Number(form.denied_recce.value||0),cancel=Number(form.canceled_recce.value||0);
    // Pending stays fixed while this popup is open. Work entered in this update is always against that opening Pending balance.
    if(completed>pending||denied>pending||cancel>pending||completed+denied+cancel>pending){
      e.preventDefault();e.stopImmediatePropagation();
      setSumError(form,'Completed + Denied + Cancel cannot be greater than the current Pending Recce ('+pending+').');
    }
  },true);
})();


/* v2.5.69 — hard-lock Recce Pending as the opening balance for the popup. */
(function(){
  function form(){return document.querySelector('#recce-update-modal .recce-update-form');}
  function lockPending(f){
    if(!f)return;
    var opening=f.querySelector('[name="opening_pending_recce"]');
    var pending=f.querySelector('[name="pending_recce"]');
    if(opening&&pending){
      pending.value=opening.value||'0';
      pending.readOnly=true;
      pending.setAttribute('readonly','readonly');
      pending.setAttribute('aria-readonly','true');
    }
  }
  function resetWorkFields(f){
    if(!f)return;
    ['completed_recce','denied_recce','canceled_recce'].forEach(function(name){
      var el=f.querySelector('[name="'+name+'"]');
      if(el)el.value='';
    });
  }
  document.addEventListener('click',function(e){
    var btn=e.target.closest&&e.target.closest('.recce-update-open');
    if(!btn)return;
    // Run after the normal modal opener has copied data-pending into opening_pending_recce.
    setTimeout(function(){var f=form();resetWorkFields(f);lockPending(f);},0);
    setTimeout(function(){var f=form();resetWorkFields(f);lockPending(f);},50);
  });
  ['input','change','keyup'].forEach(function(evt){
    document.addEventListener(evt,function(e){
      var f=e.target&&e.target.closest?e.target.closest('.recce-update-form'):null;
      if(!f)return;
      // Completed / Denied / Cancel must never change the displayed opening Pending amount.
      lockPending(f);
    },true);
  });
})();

/* v2.8.32 — Recce Master Action Details opens by clicking the table row. */
(function(){
  function modal(){return document.getElementById('recce-details-modal');}
  function closeModal(){var m=modal();if(!m)return;m.classList.remove('is-open');m.setAttribute('aria-hidden','true');document.body.classList.remove('lead-modal-open');}
  function openDetails(trigger){
    var m=modal();if(!m||!trigger)return;
    var id=trigger.getAttribute('data-recce-id')||'';
    var tpl=document.getElementById('recce-details-template-'+id);
    var body=m.querySelector('.recce-details-modal-body');
    var title=m.querySelector('.recce-details-modal-title');
    var pdf=m.querySelector('.recce-details-pdf-link');
    if(body)body.innerHTML=tpl?tpl.innerHTML:'<div class="empty"><strong>No Recce Worked data</strong></div>';
    if(title){var recceName=trigger.getAttribute('data-recce-title')||'';var recceTotal=trigger.getAttribute('data-recce-total')||'';title.textContent=recceName+(recceTotal!==''?' | No of Recce: '+recceTotal:'');}
    if(pdf)pdf.href=trigger.getAttribute('data-recce-pdf')||'#';
    m.classList.add('is-open');m.setAttribute('aria-hidden','false');document.body.classList.add('lead-modal-open');
  }
  document.addEventListener('click',function(e){
    var close=e.target.closest&&e.target.closest('[data-recce-details-close]');
    if(close){e.preventDefault();closeModal();return;}
    var row=e.target.closest&&e.target.closest('tr.recce-details-row');
    if(!row)return;
    if(e.target.closest&&e.target.closest('a,button,input,select,textarea,label'))return;
    openDetails(row);
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});
})();

/* v2.5.79 — Design Update popup and quantity validation. */
(function(){
  function modal(){return document.getElementById('design-update-modal');}
  function closeDesign(){var m=modal();if(!m)return;m.classList.remove('is-open');m.setAttribute('aria-hidden','true');document.body.classList.remove('lead-modal-open');}
  function value(form,name,v){var el=form.querySelector('[name="'+name+'"]');if(el)el.value=v==null?'':v;}
  function clearErrors(form){form.querySelectorAll('.field-error').forEach(function(n){n.hidden=true;n.textContent='';});form.querySelectorAll('.has-field-error').forEach(function(n){n.classList.remove('has-field-error');});}
  function openDesign(btn){
    var m=modal();if(!m)return;var form=m.querySelector('.design-update-form');if(!form)return;
    form.reset();clearErrors(form);
    value(form,'design_id',btn.getAttribute('data-design-id')||'');
    value(form,'assigned_qty',btn.getAttribute('data-assigned')||'0');
    value(form,'pending_qty',btn.getAttribute('data-pending')||'0');
    value(form,'completed_qty','');value(form,'canceled_qty','');
    value(form,'updated_by_user',btn.getAttribute('data-designer-id')||'0');
    var pending=Math.max(0,Number(btn.getAttribute('data-pending')||0));
    ['completed_qty','canceled_qty'].forEach(function(name){var el=form.querySelector('[name="'+name+'"]');if(el)el.max=String(pending);});
    var t=m.querySelector('.design-update-modal-title');if(t)t.textContent=btn.getAttribute('data-design-title')||'';
    m.classList.add('is-open');m.setAttribute('aria-hidden','false');document.body.classList.add('lead-modal-open');
    setTimeout(function(){var f=form.querySelector('[name="completed_qty"]');if(f)f.focus();},30);
  }
  function setError(form,msg){var el=form.querySelector('[name="canceled_qty"]');if(!el)return;var label=el.closest('label');if(!label)return;label.classList.add('has-field-error');var n=label.querySelector(':scope > .field-error');if(!n){n=document.createElement('small');n.className='field-error';label.appendChild(n);}n.textContent=msg;n.hidden=false;}
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.design-update-open');if(b){e.preventDefault();openDesign(b);return;}var c=e.target.closest&&e.target.closest('[data-design-update-close]');if(c){e.preventDefault();closeDesign();}});
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeDesign();});
  document.addEventListener('submit',function(e){var form=e.target;if(!form.matches||!form.matches('.design-update-form'))return;clearErrors(form);var pending=Number(form.pending_qty.value||0),completed=Number(form.completed_qty.value||0),cancel=Number(form.canceled_qty.value||0);if(completed+cancel>pending){e.preventDefault();e.stopImmediatePropagation();setError(form,'Completed + Cancel cannot be greater than Pending ('+pending+').');}},true);
})();

/* Design Pending Approval v2.5.82 */
(function(){
  function modal(){return document.getElementById('design-approval-modal');}
  function closeModal(){var m=modal();if(!m)return;m.classList.remove('is-open');m.setAttribute('aria-hidden','true');document.body.classList.remove('lead-update-modal-open');}
  function openModal(btn){var m=modal();if(!m)return;var f=m.querySelector('.design-approval-form');if(!f)return;
    f.design_id.value=btn.getAttribute('data-design-id')||'';
    var pending=btn.getAttribute('data-pending-approval')||'0';
    f.pending_approval_qty.value=pending;
    f.pending_approval_display.value=pending;
    f.design_approved.value='';
    f.design_approved.max=pending;
    f.customer_remarks.value=btn.getAttribute('data-remarks')||'';
    var t=m.querySelector('.design-approval-modal-title');if(t)t.textContent=(btn.getAttribute('data-design-title')||'')+' | Pending Approval: '+pending;
    m.classList.add('is-open');m.setAttribute('aria-hidden','false');document.body.classList.add('lead-update-modal-open');
  }
  document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.design-approval-open');if(b){e.preventDefault();openModal(b);return;}var c=e.target.closest&&e.target.closest('[data-design-approval-close]');if(c){e.preventDefault();closeModal();}},true);
  document.addEventListener('submit',function(e){var f=e.target;if(!f.matches||!f.matches('.design-approval-form'))return;var pending=Number(f.pending_approval_qty.value||0),approved=Number(f.design_approved.value||0);if(approved<=0||approved>pending){e.preventDefault();e.stopImmediatePropagation();var input=f.design_approved;var old=f.querySelector('.field-error');if(old)old.remove();var er=document.createElement('div');er.className='field-error';er.textContent=approved<=0?'Design Approved must be greater than 0.':'Design Approved cannot be greater than Pending Approval ('+pending+').';input.insertAdjacentElement('afterend',er);}},true);
})();


/* v2.8.34 — Design Master Action Details opens by clicking the table row. */
(function(){
  function modal(){return document.getElementById('design-details-modal');}
  function closeModal(){var m=modal();if(!m)return;m.classList.remove('is-open');m.setAttribute('aria-hidden','true');document.body.classList.remove('lead-modal-open');}
  function openDetails(row){
    var m=modal();if(!m||!row)return;
    var id=row.getAttribute('data-design-id')||'';
    var tpl=document.getElementById('design-details-template-'+id);
    var body=m.querySelector('.design-details-modal-body');
    var title=m.querySelector('.design-details-modal-title');
    var pdf=m.querySelector('.design-details-pdf-link');
    if(body)body.innerHTML=tpl?tpl.innerHTML:'<div class="empty"><strong>No Design Worked data</strong></div>';
    if(title){var name=row.getAttribute('data-design-title')||'';var assigned=row.getAttribute('data-design-assigned')||'';title.textContent=name+(assigned!==''?' | No of Design: '+assigned:'');}
    if(pdf)pdf.href=row.getAttribute('data-design-pdf')||'#';
    m.classList.add('is-open');m.setAttribute('aria-hidden','false');document.body.classList.add('lead-modal-open');
  }
  document.addEventListener('click',function(e){
    var close=e.target.closest&&e.target.closest('[data-design-details-close]');
    if(close){e.preventDefault();closeModal();return;}
    var row=e.target.closest&&e.target.closest('tr.design-details-row');
    if(!row)return;
    if(e.target.closest('a,button,input,select,textarea,label,.actions'))return;
    e.preventDefault();openDetails(row);
  });
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeModal();});
})();


/* v2.5.99 - Enter must never submit/save a main ERP record form. */
(function(){
  document.addEventListener('keydown',function(e){
    if(e.key!=='Enter')return;
    var target=e.target;
    if(!target||!target.closest)return;
    var form=target.closest('form.erp-form[data-save-form="1"]');
    if(!form)return;
    /* Textareas keep normal Enter/new-line behaviour. */
    if(target.tagName==='TEXTAREA')return;
    /* Explicit buttons keep their normal keyboard activation behaviour. */
    if(target.tagName==='BUTTON'||(target.tagName==='INPUT'&&['submit','button'].indexOf((target.type||'').toLowerCase())!==-1))return;
    e.preventDefault();
    e.stopPropagation();
  },true);
})();

/* v2.6.07 - Blank initial editable numeric zero values across ERP forms. */
(function(){
  function blankZeroNumbers(root){
    (root||document).querySelectorAll('form input[type="number"]:not([readonly]):not([disabled])').forEach(function(input){
      var v=String(input.value==null?'':input.value).trim();
      if(v!=='' && Number(v)===0) input.value='';
    });
  }
  function init(){
    blankZeroNumbers(document);
    var observer=new MutationObserver(function(mutations){
      mutations.forEach(function(m){
        m.addedNodes.forEach(function(node){
          if(node&&node.nodeType===1) blankZeroNumbers(node);
        });
      });
    });
    observer.observe(document.body,{childList:true,subtree:true});
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* v2.6.07 - Reset mandatory Design Update Remarks each time the popup opens. */
(function(){
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.design-update-open');
    if(!b)return;
    setTimeout(function(){
      var m=document.getElementById('design-update-modal');
      if(!m)return;
      var remarks=m.querySelector('[name="update_remarks"]');
      if(remarks)remarks.value='';
    },0);
  },true);
})();


/* v2.6.63 — one canonical filter controller for every server-backed table view.
   Older releases accumulated several live/auto filter handlers.  This capture-phase
   controller is intentionally the final authority: it serializes the real native
   fields and reloads the current view with clean GET parameters. */
(function(){
  function isFilterForm(form){
    if(!form||form.tagName!=='FORM')return false;
    if(!form.closest('.bsoerp-app'))return false;
    return form.classList.contains('toolbar')||form.classList.contains('master-toolbar')||form.classList.contains('task-log-toolbar');
  }
  function baseUrl(form){
    var action=(form.getAttribute('action')||'').trim();
    if(action && action.indexOf('admin-post.php')!==-1)return '';
    if(action){try{return new URL(action,window.location.href).pathname;}catch(e){}}
    return window.location.pathname;
  }
  function cleanParams(form){
    var params=new URLSearchParams();
    new FormData(form).forEach(function(value,key){
      if(!key||key==='pg'||key==='_wpnonce'||key==='_wp_http_referer')return;
      value=String(value==null?'':value).trim();
      if(value===''||value==='0')return;
      if(key==='s')key='erp_search';
      params.append(key,value);
    });
    return params;
  }
  function go(form){
    if(!isFilterForm(form))return;
    var base=baseUrl(form);if(!base)return;
    var qs=cleanParams(form).toString();
    var target=base+(qs?'?'+qs:'');
    if(window.location.pathname+window.location.search!==target)window.location.assign(target);
  }
  function clear(form){
    if(!isFilterForm(form))return;
    var base=baseUrl(form);if(base)window.location.assign(base);
  }
  var timers=new WeakMap();
  function schedule(form,delay){
    var old=timers.get(form);if(old)clearTimeout(old);
    var t=setTimeout(function(){timers.delete(form);go(form);},delay||0);timers.set(form,t);
  }
  document.addEventListener('submit',function(e){
    var form=e.target;if(!isFilterForm(form))return;
    e.preventDefault();e.stopImmediatePropagation();go(form);
  },true);
  document.addEventListener('change',function(e){
    var field=e.target,form=field&&field.form;if(!isFilterForm(form))return;
    if(field.classList&&field.classList.contains('erp-search-select-input'))return;
    if(!field.matches('select,input[type="date"],input[type="month"],input[type="checkbox"],input[type="radio"]'))return;
    e.stopImmediatePropagation();schedule(form,0);
  },true);
  document.addEventListener('input',function(e){
    var field=e.target,form=field&&field.form;if(!isFilterForm(form))return;
    if(field.classList&&field.classList.contains('erp-search-select-input'))return;
    if(!field.matches('input[type="search"][name],input[type="text"][name]'))return;
    e.stopImmediatePropagation();schedule(form,500);
  },true);
  document.addEventListener('click',function(e){
    var c=e.target.closest&&e.target.closest('.filter-clear,.task-filter-clear');if(!c)return;
    var form=c.closest('form');if(!isFilterForm(form))return;
    e.preventDefault();e.stopImmediatePropagation();clear(form);
  },true);
})();

/* v2.7.43 — consistent automatic table search UI on every listing view. */
(function(){
  function tidy(root){
    (root||document).querySelectorAll('.bsoerp-app form.toolbar,.bsoerp-app form.master-toolbar,.bsoerp-app form.task-log-toolbar').forEach(function(form){
      form.querySelectorAll('input[type="search"][name]').forEach(function(input){input.removeAttribute('placeholder');});
      form.querySelectorAll('button[type="submit"]').forEach(function(button){var label=(button.textContent||'').trim().toLowerCase();if(label==='search'||label==='filter')button.remove();});
    });
  }
  function init(){tidy(document);new MutationObserver(function(records){records.forEach(function(record){record.addedNodes.forEach(function(node){if(node.nodeType===1)tidy(node);});});}).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();

/* v2.7.46 — header Filter action and collapsed filters on every table view. */
(function(){
  function filterIcon(){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 5h18l-7 8v5l-4 2v-7L3 5z" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/></svg><span>Filter</span>';}
  function setup(){
    var top=document.querySelector('.bsoerp-top'),panel=document.querySelector('.listing-panel');
    if(!top||!panel)return;
    var app=document.querySelector('.bsoerp-app');
    var isMaster=(app&&app.classList.contains('bsoerp-master-view'))||panel.classList.contains('master-listing-panel');
    if(isMaster){top.querySelectorAll('.bsoerp-header-filter,.mobile-filter-toggle').forEach(function(el){el.remove();});return;}
    var toolbar=panel.querySelector('form.toolbar,form.master-toolbar,form.task-log-toolbar');
    if(!toolbar)return;
    toolbar.classList.add('bsoerp-filter-collapsible');
    var search=toolbar.querySelector('input[type="search"][name]:not(.erp-search-select-input)');
    if(search){var searchControl=search;while(searchControl.parentElement&&searchControl.parentElement!==toolbar)searchControl=searchControl.parentElement;if(searchControl.parentElement===toolbar)searchControl.classList.add('bsoerp-default-search');}
    var holder=top.querySelector('.view-export-actions');
    if(!holder)return;
    var excel=holder.querySelector('.top-excel-export,.universal-excel-export,.mobile-excel');
    if(!excel)return;
    var button=holder.querySelector('.bsoerp-header-filter');
    var params=new URLSearchParams(window.location.search);
    var viewKey=params.get('erp_view')||document.body.getAttribute('data-erp-view')||window.location.pathname;
    var filterStateKey='bsoerp_filter_open_'+viewKey;
    var rememberedOpen=false;
    try{rememberedOpen=sessionStorage.getItem(filterStateKey)==='1';}catch(e){}
    if(rememberedOpen)toolbar.classList.add('bsoerp-filter-open');

    if(!button){
      button=document.createElement('button');button.type='button';button.className='btn bsoerp-header-filter';button.innerHTML=filterIcon();holder.insertBefore(button,excel);
      button.addEventListener('click',function(){
        var open=toolbar.classList.toggle('bsoerp-filter-open');
        button.classList.toggle('primary',open);
        button.setAttribute('aria-expanded',open?'true':'false');
        button.setAttribute('aria-label',open?'Hide filters':'Show filters');
        try{sessionStorage.setItem(filterStateKey,open?'1':'0');}catch(e){}
      });
    }
    var isOpen=toolbar.classList.contains('bsoerp-filter-open');
    button.classList.toggle('primary',isOpen);
    button.setAttribute('aria-expanded',isOpen?'true':'false');
    button.setAttribute('aria-label',isOpen?'Hide filters':'Show filters');
    button.setAttribute('aria-controls','bsoerp-view-filters');toolbar.id='bsoerp-view-filters';
  }
  function init(){setup();setTimeout(setup,150);setTimeout(setup,600);new MutationObserver(setup).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


/* v2.6.65 — searchable-filter bridge hardening.
   Searchable dropdowns are custom UI around native SELECT elements. Always emit
   a real bubbling DOM change event from the native SELECT so the canonical
   server-side filter controller receives the selected id/value. */
(function(){
  document.addEventListener('click',function(e){
    var opt=e.target.closest&&e.target.closest('.erp-search-option');
    if(!opt)return;
    var wrap=opt.closest('.erp-search-select');
    var sel=wrap&&wrap.querySelector('select');
    if(!sel)return;
    var value=String(opt.getAttribute('data-value')||'');
    if(String(sel.value||'')!==value)sel.value=value;
    setTimeout(function(){
      try{sel.dispatchEvent(new Event('change',{bubbles:true}));}
      catch(err){var ev=document.createEvent('Event');ev.initEvent('change',true,true);sel.dispatchEvent(ev);}
    },0);
  },true);
})();


/* Production multi-user checkbox dropdown */
jQuery(function($){
  function refreshMulti($box){var names=[];$box.find('.erp-multiuser-option input[type="checkbox"]').not('[data-select-all]').each(function(){if(this.checked)names.push($(this).siblings('span').text().trim())});$box.find('.erp-multiuser-label').text(names.length?names.join(', '):'Select Users');var total=$box.find('.erp-multiuser-option input[type="checkbox"]').not('[data-select-all]').length, checked=names.length;$box.find('[data-select-all]').prop('checked',total>0&&checked===total).prop('indeterminate',checked>0&&checked<total);}
  $(document).on('click','.erp-multiuser-toggle',function(e){e.preventDefault();var $box=$(this).closest('[data-multiuser]'),$menu=$box.find('.erp-multiuser-menu');$('.erp-multiuser-menu').not($menu).attr('hidden',true);$menu.prop('hidden',!$menu.prop('hidden'));if(!$menu.prop('hidden'))$menu.find('.erp-multiuser-search').trigger('focus');});
  $(document).on('change','.erp-multiuser-option input[type="checkbox"]',function(){var $box=$(this).closest('[data-multiuser]');if($(this).is('[data-select-all]')){$box.find('.erp-multiuser-option input[type="checkbox"]').not('[data-select-all]').prop('checked',this.checked);}refreshMulti($box);});
  $(document).on('input','.erp-multiuser-search',function(){var q=$(this).val().toLowerCase();$(this).siblings('.erp-multiuser-option').not('.erp-multiuser-selectall').each(function(){$(this).toggle($(this).text().toLowerCase().indexOf(q)!==-1)});});
  $(document).on('click',function(e){if(!$(e.target).closest('[data-multiuser]').length)$('.erp-multiuser-menu').attr('hidden',true);});
  $('[data-multiuser]').each(function(){refreshMulti($(this));});
});

/* v2.7.80: Dashboard uses company logo instead of Excel export. */
(function(){function cleanDashboardHeader(){var top=document.querySelector('.bsoerp-top'),h=top&&top.querySelector('h1');if(!top||!h||['Dashboard','Daily Activity'].indexOf(h.textContent.trim())===-1)return;top.querySelectorAll('.universal-excel-export,.top-excel-export,.mobile-excel').forEach(function(el){el.remove();});}if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',cleanDashboardHeader);else cleanDashboardHeader();})();


/* v2.7.94 — global click-to-sort for normal data tables (form grids excluded). */
(function(){
  var state=new WeakMap();
  function clean(v){return String(v==null?'':v).replace(/\u00a0/g,' ').replace(/\s+/g,' ').trim();}
  function label(th){return clean(th&&th.textContent).replace(/\s+/g,' ');}
  function excludedTable(table){
    if(!table||!table.classList.contains('data'))return true;
    if(table.classList.contains('permission-table'))return true;
    if(table.closest('.erp-form,.line-table,form .table-wrap,.quick-add-modal,.erp-modal form,.modal form,[data-form-table]'))return true;
    return false;
  }
  function excludedHeader(th){
    var name=label(th).toLowerCase();
    if(!name)return true;
    if(name==='sl.'||name==='sl'||name==='s.no.'||name==='s.no'||name==='action'||name==='actions')return true;
    if(th.querySelector('input,select,textarea,button'))return true;
    return false;
  }
  function mark(root){
    (root||document).querySelectorAll('table.data').forEach(function(table){
      if(excludedTable(table))return;
      var head=table.tHead&&table.tHead.rows&&table.tHead.rows[table.tHead.rows.length-1];
      if(!head)return;
      Array.prototype.forEach.call(head.cells,function(th){
        if(excludedHeader(th)){th.classList.remove('bsoerp-sortable');return;}
        th.classList.add('bsoerp-sortable');
        th.setAttribute('role','button');
        th.setAttribute('tabindex','0');
        th.setAttribute('title','Click to sort');
      });
    });
  }
  function dateValue(raw){
    var s=clean(raw),m;
    if(!s)return null;
    m=s.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{2,4})(?:\s+(\d{1,2}):(\d{2})(?:\s*([AP]M))?)?$/i);
    if(m){
      var y=Number(m[3]);if(y<100)y+=2000;var h=Number(m[4]||0),mi=Number(m[5]||0),ap=(m[6]||'').toUpperCase();
      if(ap==='PM'&&h<12)h+=12;if(ap==='AM'&&h===12)h=0;
      return new Date(y,Number(m[2])-1,Number(m[1]),h,mi,0,0).getTime();
    }
    m=s.match(/^(\d{4})-(\d{2})-(\d{2})(?:[ T](\d{2}):(\d{2})(?::(\d{2}))?)?$/);
    if(m)return new Date(Number(m[1]),Number(m[2])-1,Number(m[3]),Number(m[4]||0),Number(m[5]||0),Number(m[6]||0)).getTime();
    m=s.match(/^(\d{1,2})\s+([A-Za-z]{3})\s+(\d{4})(?:,?\s+(\d{1,2}):(\d{2})\s*([AP]M))?$/i);
    if(m){var months={jan:0,feb:1,mar:2,apr:3,may:4,jun:5,jul:6,aug:7,sep:8,oct:9,nov:10,dec:11},mo=months[m[2].toLowerCase()];if(mo!=null){var hh=Number(m[4]||0),amp=(m[6]||'').toUpperCase();if(amp==='PM'&&hh<12)hh+=12;if(amp==='AM'&&hh===12)hh=0;return new Date(Number(m[3]),mo,Number(m[1]),hh,Number(m[5]||0)).getTime();}}
    return null;
  }
  function numberValue(raw){
    var s=clean(raw);if(!s)return null;
    var n=s.replace(/[₹$£€,%]/g,'').replace(/,/g,'').trim();
    if(/^[-+]?\d+(?:\.\d+)?$/.test(n))return Number(n);
    return null;
  }
  function value(cell){
    var raw=clean(cell&&cell.textContent),d=dateValue(raw);if(d!==null)return{kind:'date',v:d};
    var n=numberValue(raw);if(n!==null)return{kind:'number',v:n};
    return{kind:'text',v:raw.toLowerCase()};
  }
  function compare(a,b,dir){
    if(a.kind===b.kind){if(a.v<b.v)return-dir;if(a.v>b.v)return dir;return 0;}
    var as=String(a.v),bs=String(b.v);return as.localeCompare(bs,undefined,{numeric:true,sensitivity:'base'})*dir;
  }
  function sort(th){
    var table=th.closest('table.data');if(excludedTable(table)||excludedHeader(th))return;
    var head=th.parentElement,idx=Array.prototype.indexOf.call(head.cells,th),tbody=table.tBodies&&table.tBodies[0];if(idx<0||!tbody)return;
    var old=state.get(table)||{},dir=(old.index===idx&&old.dir===1)?-1:1;
    var rows=Array.prototype.slice.call(tbody.rows).map(function(row,i){return{row:row,i:i,val:value(row.cells[idx])};});
    rows.sort(function(a,b){var c=compare(a.val,b.val,dir);return c||a.i-b.i;});
    var frag=document.createDocumentFragment();rows.forEach(function(x){frag.appendChild(x.row);});tbody.appendChild(frag);
    state.set(table,{index:idx,dir:dir});
    Array.prototype.forEach.call(head.cells,function(h){h.removeAttribute('aria-sort');});
    th.setAttribute('aria-sort',dir===1?'ascending':'descending');
  }
  document.addEventListener('click',function(e){var th=e.target.closest&&e.target.closest('th.bsoerp-sortable');if(th){e.preventDefault();sort(th);}},false);
  document.addEventListener('keydown',function(e){if((e.key==='Enter'||e.key===' ')&&e.target.matches&&e.target.matches('th.bsoerp-sortable')){e.preventDefault();sort(e.target);}},false);
  function init(){mark(document);new MutationObserver(function(records){records.forEach(function(r){Array.prototype.forEach.call(r.addedNodes,function(n){if(n.nodeType===1)mark(n);});});}).observe(document.body,{childList:true,subtree:true});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();


/* v2.8.06 — Master views never show Filter controls; Search remains available. */
(function(){
  function cleanMasterFilters(){
    var panel=document.querySelector('.master-listing-panel');
    if(!panel)return;
    var top=document.querySelector('.bsoerp-top');
    if(top){
      top.querySelectorAll('.bsoerp-header-filter,.mobile-filter-toggle').forEach(function(el){el.remove();});
    }
    var toolbar=panel.querySelector('.master-toolbar');
    if(!toolbar)return;
    toolbar.querySelectorAll('button,a').forEach(function(el){
      var txt=(el.textContent||'').trim().toLowerCase();
      if(txt==='filter'||el.classList.contains('mobile-filter-toggle')||el.classList.contains('filter-clear'))el.remove();
    });
    toolbar.querySelectorAll('label').forEach(function(label){
      if(!label.querySelector('input[name="s"]'))label.remove();
    });
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',function(){cleanMasterFilters();setTimeout(cleanMasterFilters,150);});
  else{cleanMasterFilters();setTimeout(cleanMasterFilters,150);}
})();

/* v2.8.46 — Enquiries Master: click a row to show Enquiry Update details directly below it. */
(function(){
  function closeExisting(except){
    document.querySelectorAll('tr.lead-details-expanded-row').forEach(function(r){if(r!==except)r.remove();});
    document.querySelectorAll('tr.lead-details-row.is-expanded').forEach(function(r){if(!except || r.nextElementSibling!==except)r.classList.remove('is-expanded');});
  }
  document.addEventListener('click',function(e){
    var row=e.target.closest&&e.target.closest('tr.lead-details-row');
    if(!row)return;
    if(e.target.closest('a,button,input,select,textarea,label,.actions'))return;
    e.preventDefault();
    var next=row.nextElementSibling;
    if(next&&next.classList.contains('lead-details-expanded-row')){next.remove();row.classList.remove('is-expanded');return;}
    closeExisting(null);
    var id=row.getAttribute('data-lead-id')||'';
    var tpl=document.getElementById('lead-details-template-'+id);
    var detail=document.createElement('tr');
    detail.className='lead-details-expanded-row';
    var cell=document.createElement('td');
    cell.colSpan=10;
    cell.className='lead-details-expanded-cell';
    cell.innerHTML='<div class="lead-details-expanded-head"><strong>Enquiry Update Details</strong></div>'+(tpl?tpl.innerHTML:'<div class="empty"><strong>No Enquiry Update data</strong></div>');
    detail.appendChild(cell);
    row.insertAdjacentElement('afterend',detail);
    row.classList.add('is-expanded');
  });
})();


/* v2.8.66 — Work Order: each Job row can select its own Order and Particular. */
jQuery(function($){
  function refreshSelect($s){if($s[0]&&$s[0]._bsoerpRefresh)$s[0]._bsoerpRefresh();}
  function resetItem($row,msg){var $item=$row.find('.job-order-item-select');$item.prop('disabled',true).empty().append($('<option>').val('0').text(msg||'Select Order First'));$row.find('.source-line-id').val('');$row.find('.job-description').val('');$row.find('input[name$="[nos]"]').val('');refreshSelect($item);}
  $(document).on('change','.job-order-select-legacy',function(){var $order=$(this),$row=$order.closest('.production-line-row'),id=Number($order.val()||0);if(!id){resetItem($row);return;}var $item=$row.find('.job-order-item-select');$item.prop('disabled',true).empty().append($('<option>').val('0').text('Loading...'));refreshSelect($item);$.get((window.BSOERP&&BSOERP.ajaxurl)||'/wp-admin/admin-ajax.php',{action:'bsoerp_parent_items',parent_id:id,target_module:'production',nonce:(window.BSOERP&&BSOERP.nonce)||''},function(resp){var rows=resp&&resp.success&&resp.data?(resp.data.items||[]):[];$item.empty().append($('<option>').val('0').text(rows.length?'Select Particular':'No Pending Items'));rows.forEach(function(r){$('<option>').val(String(r.item_id||0)).text(r.item_title||'Order Item').attr({'data-source-line-id':String(r.source_line_id||0),'data-description':r.description||'','data-nos':String(r.pending_qty||r.qty||'')}).appendTo($item);});$item.prop('disabled',!rows.length);$row.find('.source-line-id').val('');$row.find('.job-description').val('');$row.find('input[name$="[nos]"]').val('');refreshSelect($item);});});
  $(document).on('change','.job-order-item-select-legacy',function(){var $s=$(this),$row=$s.closest('.production-line-row'),$o=$s.find('option:selected');$row.find('.source-line-id').val($o.attr('data-source-line-id')||'');$row.find('.job-description').val($o.attr('data-description')||'');$row.find('input[name$="[nos]"]').val($o.attr('data-nos')||'');});
});


/* v2.10.71 — Edit Design Action Detail with validated quantities. */
(function(){
  function modal(){return document.getElementById('design-history-edit-modal');}
  function closeModal(){var m=modal();if(!m)return;m.classList.remove('is-open');m.setAttribute('aria-hidden','true');}
  function openModal(btn){
    var m=modal();if(!m)return;var f=m.querySelector('.design-history-edit-form');if(!f)return;
    f.update_id.value=btn.getAttribute('data-update-id')||'';
    f.design_id.value=btn.getAttribute('data-design-id')||'';
    f.assigned_qty.value=btn.getAttribute('data-assigned')||'';
    f.completed_qty.value=btn.getAttribute('data-completed')||'0';
    f.canceled_qty.value=btn.getAttribute('data-cancel')||'0';
    f.approved_qty.value=btn.getAttribute('data-approved')||'0';
    f.updated_by_user.value=btn.getAttribute('data-updated-by')||'0';
    f.update_remarks.value=btn.getAttribute('data-remarks')||'';
    var sub=m.querySelector('.design-history-edit-subtitle');if(sub)sub.textContent=btn.getAttribute('data-design-title')||'';
    m.classList.add('is-open');m.setAttribute('aria-hidden','false');
  }
  document.addEventListener('click',function(e){
    var b=e.target.closest&&e.target.closest('.design-history-edit');if(b){e.preventDefault();e.stopPropagation();openModal(b);return;}
    var c=e.target.closest&&e.target.closest('[data-design-history-edit-close]');if(c){e.preventDefault();closeModal();}
  },true);
  document.addEventListener('submit',function(e){
    var f=e.target;if(!f.matches||!f.matches('.design-history-edit-form'))return;
    var assigned=Number(f.assigned_qty.value||0),completed=Number(f.completed_qty.value||0),cancel=Number(f.canceled_qty.value||0),approved=Number(f.approved_qty.value||0);
    var msg='';if(completed<approved)msg='Design Completed cannot be less than Approved Design ('+approved+').';else if(completed+cancel>assigned)msg='Completed + Cancel cannot be greater than No of Design ('+assigned+').';
    var old=f.querySelector('.field-error');if(old)old.remove();if(msg){e.preventDefault();e.stopImmediatePropagation();var er=document.createElement('div');er.className='field-error';er.textContent=msg;f.querySelector('.form-actions').insertAdjacentElement('beforebegin',er);}
  },true);
  document.addEventListener('DOMContentLoaded',function(){
    try{var q=new URLSearchParams(window.location.search);var id=q.get('open_design_details');if(!id)return;var row=document.querySelector('tr.design-details-row[data-design-id="'+id+'"]');if(row)row.click();}catch(e){}
  });
})();
