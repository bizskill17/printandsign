* v2.10.106: Order Master PDF icons renamed: first icon "Order Pdf", second icon "Internal Pdf" (was "View PDF" for both).
* v2.10.105: Release workflow now sends a second deploy webhook after 90 seconds so the live site always receives the new version. No functional changes.
* v2.10.104: Test release to confirm instant automatic updates (GitHub webhook → Deployer for Git). No functional changes.
* v2.10.103: Restored built-in automatic updates from GitHub Releases (bizskill17/printandsign). Enable auto-updates for this plugin on the Plugins page; WordPress then installs new versions by itself. Deployer for Git is no longer needed.
* v2.10.102: Switched updates to the Deployer for Git plugin (tracks the release branch). Removed the built-in GitHub update checker to avoid two updaters.
* v2.10.101: Added automatic updates from GitHub (bizskill17/printandsign). New GitHub Releases appear as normal WordPress plugin updates and install automatically when auto-updates are enabled. Optional BSOERP_GITHUB_TOKEN constant in wp-config.php for a private repository.
* v2.10.100: Removed Backup from ERP Settings. Backup is now available only under WordPress Settings → BizSkill ERP Backup.
* v2.10.99: Added BizSkill ERP Backup under native WordPress Settings, with Daily Backup, Backup Time, Email To, Download Backup and Upload Backup/Restore.
* v2.10.98: Added full BizSkill ERP backup and restore: daily full ZIP emailed at the configured time, manual Download Backup, and Upload Backup restore from Settings.
* v2.10.97: Reduced Quotation PDF logo size and moved it slightly upward for better spacing above Customer Details.
* v2.10.96: Reduced and repositioned Order/Work Order PDF logos so they do not overlap document numbers or header text.
* v2.10.95: Order PDF and Work Order PDF now display the configured company logo while remaining A5.
* v2.10.94: Standardized PDF sizes: Quotation and Daily Activity remain A4; all other transactional PDFs use A5 portrait and wide report/detail PDFs use A5 landscape.
* v2.10.93: Daily Activity WhatsApp PDF URL now uses a cache-busting query so Meta fetches the newly generated grouped PDF instead of a previously cached employee-wise PDF.
* v2.10.92: Daily Activity PDF now uses a single grouped table with Date, Employee and Activity columns instead of one employee per page.
* v2.10.91: Pending Orders and Pending Work Orders now show Next Follow Up Date after Follow Up Remarks.
* v2.10.90: Quotation Authorized Signatory is fixed at the bottom-right of the final PDF page.
* v2.10.89: Quotation PDF uses remaining page-one space for Notes before breaking; continuation pages no longer repeat the logo or QUOTATION header.
* v2.10.88: Quotation PDF now uses remaining space below the item table for Terms/Bank first, then page-breaks before Notes/Contact only when needed, reducing large blank areas.
* v2.10.73: Editing a Design from Design Master now returns to Design Master after save.
* v2.10.68: Pending Design Approval now shows one consolidated row per Design No. with aggregated quantities.
* v2.10.67: Show Design No. in Design Activity and Pending Design Approval views.
* v2.10.65: Removed the explanatory Daily Activity Report note from Settings.
* v2.10.63: Daily Activity now shows visible Date From, Date To, and Employee filters (Admin) with Filter/Clear controls.
* v2.10.61: Daily Activity now opens as a list-first view. Added a bottom + Add Activity button; the entry form opens only after clicking Add Activity (or Edit).
* v2.10.60: Added Time Sheet → Daily Activity with auto date, employee auto-user, Admin user dropdown/all-user visibility, Admin edit/delete actions, employee own-data restriction, and India Date & Time display.
* v2.10.56: Reduced Quotation PDF logo size while preserving the uploaded logo aspect ratio to avoid crowding the customer details block.
* v2.10.54: Date column creation times now explicitly convert stored UTC timestamps to India Standard Time (Asia/Kolkata) and display inline as DD/MM/YYYY HH:MM.
* v2.10.55: Quotation PDF company logo now preserves the uploaded logo's actual aspect ratio and uses a larger 120 x 100 pt fit area instead of a stretched fixed 92 x 48 box.
* v2.10.53: Date columns in Pending Tasks/Tasks Master, Pending Recce/Recce Master, and Design Pending/Design Master now show date and creation time on one line in DD/MM/YYYY HH:MM format.
* v2.10.52: Date columns in Pending Tasks/Tasks Master, Pending Recce/Recce Master, and Design Pending/Design Master now show the record time beneath the date.
* v2.10.51: Recce/Design Activity move Date & Time after Sl.; Design Activity adds missing Pending Approval header.
* v2.10.49: Keep auto-filled UOM blank until an Item is selected in Quotation and Order forms; remove the “Select UOM” placeholder from transaction rows.
* v2.10.48: Fix Recce Activity navigation so the view is visible under the Recce section.
* v2.10.47: Due/target date validation; Recce Activity and Design Activity views; Item GST % master with UOM/GST auto-fill in Quotation/Order; PDF logo keeps original size without upscaling; Pending Order Items view; PDF preview-first with separate download action.
* v2.10.46: Add Item quick popup now includes Category and UOM, each with a + button to create a new Item Category or UOM inline; new values auto-select and save into Item Master.
* v2.10.45: Added quick + button beside Particulars in Add Quotation and Add Order item rows so new Items can be created and auto-selected without leaving the form.
* v2.10.44: Disabled browser/page caching on ERP frontend pages so Design Pending and other live views always show current database data consistently across devices.
- v2.10.43: On first install/upgrade only, seeds Customer Categories (BNI, Retail Shop, Dealer, Agency, Office) and Sources (WhatsApp, Facebook, Instagram, Referral, Existing Customer). These are normal master records and can be deleted; deleted defaults are not recreated on later upgrades.
- v2.10.42: Fixed Customer Quick Add modal caching and layout by synchronizing the internal asset version, applying an explicit customer-mode class, and making Email/GSTIN structurally full-width.
- v2.10.40: Fixed Quick Add Customer styling in the actually enqueued stylesheet. The modal now uses the approved single-column mockup layout with full-width Customer Name, Contact Person, Mobile, Email, GSTIN and Address fields, plus Customer Category with a fixed + button.
- v2.10.39: Updated Quick Add Customer modal to match the approved mockup: all fields use the same full width, Email and GSTIN are stacked full width, Customer Category keeps a separate + button, and Address remains full width with a taller textarea.
- v2.10.37: Replaced the browser Customer Category prompt with a centered ERP-styled modal; Save creates, refreshes, and auto-selects the new category.
- v2.10.36: Refined Quick Add Customer UI into a clean single-column layout, removed in-field hints, and added a + button beside Customer Category to create/select a new category without leaving the Customer popup.
- v2.10.35: Removed Status from all Master Add forms and the Quick Add Customer form. New master records are automatically saved as Active. Status remains available on Edit forms so records can still be activated/inactivated later.
- v2.10.34: Enforced a global WhatsApp fallback across every template/message: any blank, whitespace-only, null, missing, or unresolved template variable is sent/displayed as a hyphen (-). This applies to Task, Enquiry/Lead, Recce, Design, and all current WhatsApp templates.
- v2.10.33: WhatsApp template variables now send a hyphen (-) for any missing/blank value across all messages. Updated the existing Lead Updated template body to the Meta-approved Enquiry wording.
- v2.10.32: Renamed the user-facing Leads module to Enquiry, removed Lead Category from the Enquiry UI, added ENQ-YY/YY-00001 numbering, auto-fills editable Contact Person/Mobile from Customer, updated Enquiry table/export headers, and updated the existing Lead Assigned/Lead Updated WhatsApp template bodies while keeping their existing template names/codes.
- v2.10.31: Task Assigned WhatsApp now keeps the Description: line visually blank when Task Description is empty instead of showing a dash.
- v2.10.30: Fixed Task Update Date/Time to use India Standard Time (Asia/Kolkata), so the Update Task form and saved task update timestamp no longer show UTC time.
- v2.10.29: Task Assigned WhatsApp message now includes Description using {{description}}, populated from the Task Details field.
- v2.10.28: Added document numbers immediately after Sl. in Lead, Recce and Design listing tables: Lead No., Recce No. and Design No.
- v2.10.27: Updated new Recce and Design numbering to financial-year format without spaces: Recce R-26/27-0001 and Design D-26/27-0001. Sequence continues within each financial year.
- v2.10.26: Aligned all WhatsApp named parameters and template bodies with the approved Meta templates shown by the user: Task Assigned/Updated, Lead Assigned/Updated, Recce Assigned, and Design Assigned. Also forces approved code/body at send time so stale saved template settings cannot reintroduce old placeholder names.
- v2.10.25: Fixed Recce WhatsApp named parameter to match the approved Meta template exactly: {{recce_no}} instead of {{reference_no}}. Kept language code en and preserved Design fix.
- v2.10.22: Fixed Design WhatsApp template variable mapping to match the approved Meta template exactly (assigned_to_name, customer_name, reference_no, target_date, no_of_design, remarks).
- v2.10.21: Fixed Recce WhatsApp template mapping so {{recce_no}} is populated from the Recce reference number; {{reference_no}} remains supported for compatibility.
- v2.10.20: Reverted WhatsApp templates from numbered variables back to the original named-variable formats and wording.
- v2.10.18: Updated all six WhatsApp templates to the approved final formats and variable names; blank values send as -, while blank Task Assigned time is visually omitted.
- v2.10.17: Task Update WhatsApp message now uses Task, Updated By, Status, Remarks and Time, ending with Kindly Check., with no Dear line. Existing saved Task Update template is migrated automatically.
- v2.10.16: New Lead numbers use FY format L : 25-26/0001 and reset to 0001 each April. Existing Lead references remain unchanged.
- v2.10.15: Edit User now shows Change Password (Optional) without a required marker; leaving it blank keeps the existing password.
- v2.10.14: User edit now allows blank Password to keep the existing password; User validation errors are shown back inside the User form instead of the WordPress error page.
- v2.10.13: Removed duplicate “Back to Users” text link from User Details; right-side Back button remains.
- v2.10.12: When Length, Height and Nos are all blank in a quotation, the PDF hides those dimension columns and gives Particulars and Description equal width.
- v2.10.11: Quotation PDF Amount values no longer wrap; Amount column widened and all numeric values use a consistent 8pt font.
- v2.10.10: Rate is now mandatory for every Quotation item row in the form and server-side save validation.
- v2.10.09: Widened Add Quotation Amount column and kept amount values right-aligned on one line for clear visibility.
- v2.10.08: Widened Add Quotation UOM column and reduced adjacent quick-add button so selected UOM values display clearly.
- v2.10.07: Quotation PDF summary amounts are forced to a single line, with dynamic font sizing to keep full values visible without wrapping or clipping.
- v2.10.06: Renamed left-menu Tasks heading from Delegation Sheet to Delegation. All internal task logic remains unchanged.
- v2.10.05: Renamed left-menu Tasks heading to Delegation Sheet and Leads heading to Enquiry Capture Sheet. Internal modules, URLs and workflows unchanged.
- v2.10.04: Quotation PDF now draws a clearer single divider line between item rows for better print readability.
- v2.10.03: Quotation PDF summary now shows GST instead of GST (rate%).
- v2.10.02: Quotation PDF item cells now wrap all field values inside their columns, including long unbroken text; row height expands automatically to prevent overlap.
- v2.10.01: Renamed Quotation dimension label "Size Hight" to "Height" in the app and quotation PDF.
- v2.10.00: Improved quotation PDF summary clarity using fixed label, colon and right-aligned value columns.
- v2.9.99: Fixed quotation summary colon spacing so the colon is visible on Round Off and all summary rows.
- v2.9.98: Improved quotation PDF summary alignment with right-aligned labels, fixed colon position, fixed divider, and right-aligned values.
- v2.9.97: Improved Quotation PDF alignment: dimensions, Qty and Unit centered; Rate/Amount right-aligned; summary aligned under Rate + Amount.
- v2.9.96: Increased Quotation PDF Height column width and adjusted its header sizing to prevent overlap with adjacent columns.
- v2.9.95: Renamed Quotation dimension label Height in app and quotation PDF.
- v2.9.94: Fixed Add Quotation UOM column width after Length/Height/Nos fields were added, so selected UOM is clearly visible.
- v2.9.93: Quotation items now support Length, Height and Nos before Qty. Qty auto-calculates as Length × Height × Nos when all three are entered; otherwise Qty stays editable. PDF conditionally shows dimension columns only when used.
- v2.9.92: User rows open a User Details view with information, documents, bank/payment details, previews, Back and Edit User actions.
- v2.9.91: Added Address field in Users documents/personal details and moved Driving Licence No. before Driving Licence.
- v2.9.90: Adjusted quotation PDF item table width so left and right margins match more evenly.
- v2.9.89: Removed User Document Types from Master menu. Added User document/personal/bank fields: PAN, Driving Licence, Aadhaar, Parent/Guardian, bank/IFSC/account/UPI/GPay and Photo, with upload support.
- v2.9.88: Quotation PDF summary values and numeric amount cells are right-aligned consistently.
- v2.9.87: Removed remaining bottom decorative accent from Quotation PDF.
- v2.9.86: Removed decorative top and bottom graphic bands from the Quotation PDF; all other monochrome quotation styling remains unchanged.
- v2.9.85: Quotation PDF redesigned in black/white/gray; uses the logo uploaded in Company Settings; compact summary matches Rate+Amount width; Terms/Bank/Notes/Contact positions updated.
- v2.9.84: Aligned Quotation PDF table left edge with Customer Details, aligned totals with table right edge, and strengthened divider lines between item rows.
- v2.9.83: Added Download PDF action to Pending Installation and Installation Master, with installation details, item status and update history.
- v2.9.82: Aligned Quotation PDF Amount/GST/Round Off/Total summary labels, colons and values into fixed columns.
- v2.9.81: Authorized Signatory in Quotation PDF is now dark and bold for clearer print visibility.
- v2.9.79: Corrected Quotation PDF top layout: logo fully separated from Customer Details, customer block aligned below logo, and spacing matched to approved reference.
- v2.9.78: Matched Quotation PDF more closely to approved reference with angled header/footer accents, larger logo, revised quotation title block, customer spacing, and table positioning.
- v2.9.77: Removed the background fill behind Customer Details in the Quotation PDF while preserving the rest of the design.
- v2.9.76: Repositioned and resized the Quotation PDF company logo so it is fully visible above the Customer Details card.
- v2.9.75: Fixed Quotation PDF company logo rendering by correcting the logo image resource reference in the PDF output.
- v2.9.74: Fixed invisible Quotation PDF table text by explicitly setting white header text and black row text after background fills.
- v2.9.73: Fixed Quotation PDF item rows by restoring robust line-item field/meta mapping so Particulars, Description, Qty, Unit, Rate and Amount populate correctly.
- v2.9.72: Reworked Quotation PDF layout to match approved mockup with customer card, teal table, totals panel, boxed Terms/Notes/Contact/Bank sections, closing text, and signatory area.
- v2.9.70: Added GSTIN after Logo in Company Settings and show GSTIN before Website in Contact preview and Quotation PDF.
- v2.9.69: Quotation PDF Terms/Notes spacing is dynamic and Contact always pulls fresh Company Settings values.
- v2.9.67: Added Test Token diagnostics showing saved token length/preview and direct Meta phone-number authentication result.
- v2.9.66: Added WhatsApp Send Test, configurable Meta API version, and full Meta/HTTP error diagnostics.
- v2.9.65: Added real Meta WhatsApp Cloud API sending for Task Add/Update, Lead Add/Update, Recce Add and Design Add; added last-send diagnostics.
- v2.9.64: Fixed Lead Category quick-add validation so it can be created directly from the Add Lead popup.
- v2.9.63: Lead Category can now be quick-added directly from the Add Lead popup and selected immediately.
- v2.9.62: Added No of Recce and No of Design to WhatsApp templates. All blank WhatsApp variables use '-' fallback.
- v2.9.61: Lead Assigned WhatsApp template now includes Lead Description via {{description}}.
- v2.9.60: Added Lead Category master, Lead Category field to Lead form, and Lead Category in Lead tables.
- v2.9.59: Lead Assigned WhatsApp template now includes Lead Remarks; blank remarks display as '-'.
- v2.9.58: Task Assigned WhatsApp template updated with Time variable, Priority removed, and Due Date specified as DD/MM/YYYY.
- v2.9.57: Removed the Regards/company-name ending from all six WhatsApp templates and added fixed closing text to Task Update and Lead Update.
- v2.9.56: Removed duplicate WhatsApp Message Templates heading in Settings > Template.
- v2.9.55: WhatsApp Template Code is now shown below Template Name instead of as a separate field.
- v2.9.54: Simplified WhatsApp Template tab to show only Template Name, Template Code, Active, and Message Body.
- v2.9.52: Added Settings tabs for WhatsApp Templates and Meta / WhatsApp Business configuration.
- v2.9.51: Keep the filter panel open after applying/changing filters while remaining in the same view.
- v2.9.27: Installation Item is now manual text (not linked to Item Master). Assigned To/Vendor mutual exclusion now restores the other field immediately when the selected field is cleared.
- v2.9.25: Added standalone Installation module with Add Installation, Pending Installation, Installation Master, item-level partial updates, conditional certificate upload, and row-click update history.
- v2.9.24: Removed Installation completely from Delivery UI/workflow, Delivered Orders, exports, permissions/menu, and daily activity while preserving historical installation metadata in existing records.
- v2.9.13: Rebuilt Dashboard in a Power BI-style executive layout with live KPI cards, Leads/Quotation/Order trend, Lead Source donut, Recce Status, Design Pipeline, Quotation-to-Order funnel, PO vs GRN, Top Customers, Tasks/Alerts and Recent Activities, with date filters.
- v2.9.12: Added an Add GRN action to Pending PO using the provided cart icon. The action opens Add GRN with that PO preselected and loads its pending items automatically.
- v2.9.11: Quotation Master now hides Update Client Approval for Approved and Rejected quotations; the action is available only while status is Pending Approval.
- v2.9.10: Settings Logo preview is now integrated inside the same upload field as the Choose File control.
- v2.9.09: Moved the Company Logo field to appear after Email in Company Settings.
- v2.9.08: Reorganized Settings into Company, Theme and Quotation tabs with a compact responsive layout while preserving existing saved settings.
- v2.9.07: Add Order UOM column widened and searchable UOM field adjusted so the selected value remains clearly visible.
- v2.9.06: Removed the explanatory Application Theme note from Settings.
- v2.9.05: Fixed Settings PHP warning for older installations where theme_style did not yet exist; defaults safely to Theme Color.
- v2.9.04: Added Application Theme settings with Theme Color and Black & White modes. Theme Color includes a color picker; Black & White applies a monochrome UI globally while preserving company logos and PDF branding.
- v2.9.03: Purchase Orders and GRN Master rows are now clickable; each opens its item table directly below the selected row while action buttons remain independent.
- v2.9.02: Pending PO now hides fully received item rows where Qty equals GRN Qty, and POs with no remaining pending quantity are excluded from the Pending PO view.
- v2.9.01: Pending PO row item details now show GRN Qty immediately after Qty, calculated from linked non-canceled GRNs.
- v2.9.00: Pending PO rows are clickable and show the Purchase Order item table directly below the selected PO row. Action buttons remain independent.
- v2.8.99: Renamed PO In Progress to Pending PO across the Purchase Orders module and dashboard wording. Existing route remains unchanged.
- v2.8.98: Add GRN Purchase Order dropdown now excludes POs with no pending quantity available for receipt.
- v2.8.97: Increased Add PO Qty column/input width so larger quantities remain fully visible.
- v2.8.96: Add PO UOM selector widened and custom searchable input fixed so the selected UOM remains fully visible; Item and Description widths retained/increased.
- v2.8.95: Increased the Item, Description and UOM column widths in Add PO for clearer entry.
- v2.8.94: Work Order Date of Delivery renamed to Target Date. Vendor and Target Date are now required in Add/Edit Work Order, and labels updated across Work Order views, filters, exports and PDF.
- v2.8.92: Reduced Qty, UOM, Rate and Amount column widths in Add PO and gave more space to Item and Description.
- v2.8.91: Purchase Orders menu simplified to Add PO, PO In Progress, and Purchase Orders only. Purchase Order Items, Completed POs, and Canceled PO are hidden from the left menu while data remains intact.
- v2.8.90: Left menu now auto-hides after opening any view. The hamburger button remains available to reopen the sidebar.
- v2.8.89: Add Work Order renamed Pending Order to Order and long Order values now wrap in the searchable Order field and dropdown options.
- v2.8.88: Renamed Vendor Job Updates to Work Order Update and added Order No. and Customer Name columns derived from each job row's linked Order.
- v2.8.87: Add Work Order now uses a Pending Order dropdown independent of Particular. Particular uses the full Item Master and supports quick Add Item from the row.
- v2.8.86: Hidden Delivery Items from the Delivery left menu while preserving the underlying route and historical data.
- v2.8.85: Reduced L, B, Nos, Rate and Amount column widths in Add Work Order so Particular, Description and Order No. have more usable space.
- v2.8.84: Fixed Vendor Job Updates Jobs filter so it lists only actual job/particular values present in Vendor Job Update records, instead of unrelated job master entries.
- v2.8.83: Renamed Job Worked Items to Vendor Job Updates throughout the Third Party Vendor module while keeping the existing route and data intact.
- v2.8.82: Removed the In House/Vendor toggle buttons and production-mode filtering from Pending Work Orders and Work Orders Master. Both views now show all Work Orders together.
- v2.8.81: Removed Time of Delivery completely from Work Order forms, Work Order views, exports, and Work Order PDF.
- v2.8.80: Add Work Order Order No. dropdown now shows only Pending/In Progress Orders that still have pending production items; selecting an Order shows only its pending Particulars.
- v2.8.79: Pending Work Orders and Work Orders Master now display Pending status as In Progress, without changing the underlying workflow status. Work Order exports use the same display label.
- v2.8.78: Job Worked Items now removes Customer and Department and shows Vendor instead; filter updated to Vendor.
- v2.8.77: Job Worked Items now shows Update Date immediately after Sl. in the table.
- v2.8.76: Added Job Worked Items back under Third Party Vendor while keeping other auxiliary Work Order views hidden.
- v2.8.75: Simplified the Cancel Work Order confirmation message to "Are you sure you want to cancel this Work Order?"
- v2.8.74: Update Job popup now hides job rows whose Pending quantity is zero, showing only rows that still require completion updates.
- v2.8.73: Simplified Third Party Vendor menu to Add Work Order, Pending Work Orders and Work Orders Master only. Removed Work Order Items Master, Completed Work Orders, Canceled Work Orders, Job Worked and Job Worked Items from active menu; completed/canceled updates return to Work Orders Master. Historical data and internal records are preserved.
- v2.8.72: Fixed Pending Work Orders row click behavior so clicking anywhere on a row opens its item details directly below the selected row; action controls remain independent.
- v2.8.71: Removed Order No. from the Work Order PDF item table. Pending Work Orders rows are now clickable and show their item details directly below the selected row, matching Work Orders Master.
- v2.8.70: Added Customer Name to each Work Order item detail row, derived from the linked Order; aligned Work Order Items Master export.
- v2.8.69: Work Orders Master now always inserts the expanded item-detail row immediately below the clicked Work Order row, even after table sorting/reflow.
- v2.8.68: Simplified Work Order registers and PDF for the multi-order vendor workflow. Work Orders In Progress is now Pending Work Orders; obsolete Customer/single-Order/Department/Assigned To/Designer/Order Taken By header fields are removed; Work Order Master rows show multi-order item details; Work Order Items Master and exports now use Order No., Vendor, Particular, L/B, Nos., Rate, Amount and Status.
- v2.8.67: Added Rate and Amount columns to Add/Edit Work Order Jobs table. Amount auto-calculates as Nos × Rate and both values are saved per job row.
- v2.8.66: Work Orders now support multiple Orders in one Work Order. Each Job row has Particular, Description, Order No., L, B and Nos; selecting an Order loads its pending items and each row keeps its own source Order/item link.
- v2.8.65: Selecting an Order in Add Work Order now automatically loads that Order's item rows into the Jobs table, including Particular, Description and Qty/Nos.
- v2.8.64: Simplified Add/Edit Work Order by removing Customer, Department, Assigned To, Designer, and Order Taken By fields. Customer is now derived automatically from the selected Order.
- v2.8.63: Removed the underline below ORDER and JOB ORDER headings in both PDF formats.
- v2.8.62: Job Order PDF header now matches the Order PDF style with company name, centered underlined JOB ORDER title, Order No., Date and Customer above the simplified item table.
- v2.8.61: Added Download Job Order beside Download Order PDF in Order Master. Job Order PDF contains only Sl., Item, Description, Qty and UOM columns.
- v2.8.60: Approved Quotations automatically create one linked Order. Pending Orders and Order Master now show Quotation No. immediately after Order No.; the auto-created Order carries the Quotation Made By user as Order Taken By. Duplicate Orders are prevented by quotation parent linkage.
- v2.8.59: Renamed the left-menu Production section to Third Party Vendor; internal production routes and workflows remain unchanged.
- v2.8.58: Removed Quotation No. from Pending Orders and Order Master views, order filters, and Order exports. Add Order remains independent with no Quotation No. field. Existing historical references remain untouched internally.
- v2.8.57: Removed the “Accepted: Image or PDF.” helper text from the Update Installation popup.
- v2.8.56: Order Master Update Delivery action now shows only the truck icon; removed the generic green update tick overlay.
- v2.8.55: Added Update Delivery vehicle-icon action to Order Master for orders with pending dispatch, matching Pending Orders.
- v2.8.54: Simplified Orders menu to Add Order, Pending Orders, and Order Master. Renamed Orders In Progress to Pending Orders; Order Items Master and Canceled Orders are no longer shown in the left menu.
- v2.8.53: Removed Delivery Mode from the active ERP interface, Master menu, delivery forms, delivery tables, filters/quick-add paths, exports, and dispatch PDF output. Historical stored values are left untouched only for data safety.
- v2.8.52: Left sidebar now remembers its scroll position when switching ERP views, so the menu stays at the same location instead of jumping to the top.
- v2.8.51: Removed the UOM dropdown arrow icon in Add Quotation for a cleaner display and more visible selected text.
- v2.8.50: Increased usable UOM selector width in Add Quotation so the complete selected UOM value remains visible beside the compact + button.
- v2.8.49: Replaced the Quotation Master Update Client Approval check icon with the provided client-approval image icon.
- v2.8.48: Add Quotation UOM column widened so selected UOM is clearly visible while keeping the remove column compact.
- v2.8.47: Add Quotation item table now uses a compact Remove column so the delete button takes only the space it needs.
- v2.8.46: Leads Master now includes a permanent Delete action. Deleting a Lead removes the Lead record, Lead Update history, related line items, and Lead activity records after confirmation.
- v2.8.46: Leads Master rows are now clickable and show the Lead Update Details table directly below the selected row. Action buttons remain independent.
- v2.8.41: Design Action Details now shows Date & Time immediately after Sl. in the popup and PDF.
- v2.8.40: Design Master shows Pending Approval as its own table column; Design Action Details remains without Pending Approval.
- v2.8.39: Design Action Details popup/PDF no longer shows Pending Approval; increased table row padding and readability.
- v2.8.38: Design Action Details popup now expands to the available screen width on desktop and compacts/wraps its table columns to minimize horizontal scrolling; mobile retains controlled horizontal scrolling for readability.
- v2.8.37: Fixed Design Master Update Client Approval modal cache/version mismatch. Asset version now matches plugin version so browsers load the new Pending Approval JavaScript instead of the cached v2.8.33 script.
- v2.8.36: Design Master Update Client Approval now works against the total Pending Approval quantity. The popup shows Pending Approval, approval quantity is validated against it, and partial approvals reduce Pending Approval across design updates.
- v2.8.35: Removed Owner from the Design module Add/Edit form, Design Pending/Design Master tables and Design exports; Designer remains the responsible user field.
- v2.8.34: Removed Design Master Action Details icon; clicking a Design Master table row now opens the same Action Details popup, while action buttons/links continue to work normally.
- v2.8.32: Removed Recce Master Action Details icon; clicking a Recce Master table row now opens the same Action Details popup, while action buttons/links continue to work normally.
- v2.8.31: Simplified Recce menu to Add Recce, Pending Recce and Recce Master; renamed Recce In Progress to Pending Recce; added Date immediately after Sl. in Pending Recce/Recce Master tables and Recce exports.
- v2.8.30: Removed Send Mode from Master and removed the obsolete quotation sending-stage UI/routes so quotations continue directly through Pending Client Approval. Existing historical send-mode data is preserved but no longer used by the active workflow.
- v2.8.22: Task Owner renamed to Assigned By throughout the Task module, forms, tables and exports; underlying task owner behavior remains unchanged.
- v2.8.21: Lead Status display now shows Success instead of Completed and Lead Lost instead of Canceled across Lead tables and exports.
- v2.8.20: Moved Date immediately after Sl. in Pending Leads and Leads Master, including lead exports.
- v2.8.19: Fixed Tasks Master latest update mapping after Date column was moved after Sl.; Update Date, Update Time and Task Remarks now populate correctly.
- v2.8.18: Simplified Leads menu to Add Lead, Pending Leads and Leads Master; removed Expected Value and obsolete lead queue/history/status views; Assigned To is required; Next Follow-up hidden on Add Lead; update status labels changed to Success and Lead Lost.
- v2.8.13: Removed Task History action; Update Task defaults Status to Complete; added Update Date and Update Time before Task Remarks.
- v2.8.12: Task menu reordered to Add Task, Pending Tasks, Tasks Master only; Task Owner auto-fills from logged-in ERP user; Customer removed from Tasks; optional Time added after Due Date; Update action added to Pending Tasks and Tasks Master.
v2.7.89
- Daily Activity labels no longer include the word Today.
- Each Daily Activity row/count is clickable and opens the corresponding module filtered to today's records/actions.

= 2.7.86 =
- Removed the Excel button from the Daily Activity view.
- Replaced Today Summary cards with a table showing Sl., Activity and Count for the 10 requested daily metrics.

= 2.7.80 =
- Removed the Excel export button from the Dashboard header only.
- Added the Company Logo from Company Settings to the right side of the Dashboard header.

= 2.7.75 =
- Renamed Pending Installation to Installation Certificate Pending.
- Renamed Installation Photo to Installation Certificate.
- Changed Update Installation to a compact icon action.
- Added Edit Order action to Delivered Orders.

- v2.7.55: Added consistent spacing between consecutive dashboard table panels on desktop and mobile.
- v2.7.54: Simplified Settings to Company Name, Logo, Bank Details, Notes, Company Info and Company Address while preserving hidden application configuration.
- v2.7.53: Simplified Recce and Design table file links to a clickable Document label.
- v2.7.52: Removed the document file-type helper sentence from Recce and Design forms.
- v2.7.51: Added Design Document and Update Document uploads with downloadable links in Design tables.
- v2.7.50: Added Recce Document and Update Document uploads with downloadable links in Recce tables.
- v2.6.68: Global searchable dropdown menus now render as top-level floating layers so they stay fully visible above forms, tables, cards, modals and scroll containers across the ERP.
- v2.6.61: Replaced all remaining generic Print action icons with the standard PDF document icon across ERP record views; existing action behavior is preserved.
- v2.6.29: Order Master now shows Order No. and Customer Name, and removes the old Name / Title column.
- v2.6.28: Approved Quotations now automatically create one linked Order Master record and copy all quotation items into Order Items Master; duplicate Order creation is prevented and previously approved quotations without Orders are backfilled during upgrade.
- v2.5.79: Design Assigned and Owner are mandatory on Add/Edit Design Job, with existing inline field validation.
- v2.5.47: Fixed searchable filter synchronization so visible dropdown text and the real filter value cannot diverge; task filters now react to typed or selected Customer/Owner/Assignee values reliably.
- v2.5.46: Restored reliable automatic filters across the application with delegated events that survive searchable dropdown and label enhancement; Clear still resets values without opening dropdowns.
- v2.5.45: Clear now resets filter values across the application without opening searchable dropdown menus; automatic filtering remains active.
- v2.5.41: Added Customer filter to all five Task views and kept Excel/PDF exports together on the right side of each Task view title.
BizSkill Operations ERP
Version 2.4.8

Changes in 2.4.8
- Fixed Quick Add browser freeze caused by recursive searchable-dropdown option refresh.
- Quick Add now refreshes only affected dropdowns, prevents duplicate submissions, and has 15-second timeout recovery.
- Save button always recovers after failed/slow AJAX requests.
- Added configurable global Font Size under Settings > UI Theme (11px to 16px).
- Fixed Secondary Font Color persistence after saving settings.
- Made all typed HEX theme values persist reliably, not only color-picker selections.
- Live preview now applies Font Size immediately.
- Existing theme colors, font weight, borders and application data remain compatible.


Changes in 2.4.0
- Added visible theme-colour borders around every table header and data cell.
- Added clear vertical column separators and horizontal row separators across all list and line-item tables.
- Applied globally to Master views and operational registers.
- Preserved responsive table behavior.


Changes in 2.3.8
- Fixed enhanced searchable filter controls overlapping adjacent filters.
- Added a consistent 12px desktop gap between Search, dropdown filters, Filter and Clear.
- Reset inherited minimum widths inside searchable-select wrappers so Filter/Clear remain fully visible.
- Applied the spacing fix globally to Master list views.


Changes in 2.3.5
- Standardized all Master filter bars into one compact desktop row: Search, Status, relevant Master filters, Filter, Clear.
- Searchable filter controls now visibly show All Status / All Category / All Industry / similar default selections.
- Clear button is always available on Master list views.
- Enhanced searchable-select wrappers no longer force filters onto separate desktop rows.
- Responsive behavior preserved: filters wrap cleanly on tablet and stack on mobile.
- Applied globally to Customers, Users, Items, Machines and every other Master list view.

Changes in 2.3.4
- Added Industries as a full Master.
- Added Industry dropdown to Customer Add/Edit with Quick Add support.
- Added Industry filter to Customers.
- Expanded Customer register columns: Name, Category, Industry, Contact Person, Mobile, Email, GSTIN, Status and Action.
- Expanded useful columns in Users, Items, Suppliers, Vendors, Machines and Transporter/Courier registers.
- Master search now searches across visible detail fields stored in record metadata, not only Name.
- All form and filter dropdowns are searchable.
- Master, user and other relevant dropdown values are alphabetically sorted.
- Transaction reference dropdowns are sorted by record title while keeping their reference visible.
- Quick Add continues to work with searchable dropdowns and immediately selects the new value.
- Excel exports now use the same expanded Master columns and respect Customer Industry filters.
- Existing records and backend-generated internal codes remain compatible.

- Fixed searchable filter dropdowns so opening a placeholder such as All Category displays the full option list while typed text still filters options.
Version 2.5.0: hardened Add/Edit save validation, double-submit protection, database error handling and transaction rollback.

2.5.1
- Repairs master-data visibility after save by normalizing legacy/plural record types and querying compatible aliases.
- Corrects master redirect slugs after save.


2.5.2
- Replaced substring-based tab routing with exact menu/master route resolution.
- Fixed User Designations being treated as Designs, Delivery Modes as Deliveries, and Work Order Types as Production.
- Existing affected master records are repaired to module=master during upgrade and become visible in their correct lists.
- Correct Add buttons, counts, filters, forms and save redirects are restored for every Master tab.

= 2.5.39 =
- Task registers now show Customer, Task Owner and Assigned To consistently.
- Task Update Log now shows Customer, Task Owner, Assigned To and Status, with searchable/date/status/user filters.
- Added Excel and PDF/print export options to Tasks In Progress, Task Update Log, Completed Tasks, Canceled Tasks and Tasks Master.
- Add Task prevents a Due Date earlier than today with browser and server-side validation.
- Mobile fields in Master forms accept exactly 10 digits, enforced in browser and server-side validation.
- Task Owner and Assigned To on Task forms now use active names from Master > Users, with fallback display support for older WordPress-user based task records.

= 2.5.50 =
- Removed the duplicate client-side Task Update Log filter toolbar; only the server-side filter block remains.


= 2.5.51 =
* Upgraded Leads workflow: Lead Description, Lead Source Master and inline quick-add, Lead Owner/Assigned To from ERP Users, automatic In Progress status, Lead Update Log, server-side filters across lead registers, and Excel/PDF exports.


= 2.5.56 =
* Unified filter spacing, label typography, and control text across the ERP.

= 2.5.59 =
* Added inline red field-level validation across ERP forms.
* Removed Reference No. from the Leads form and Lead exports.
* Added Pending Assignee lead queue with direct Assigned To update.
* Added Pending Estimate lead queue with direct Estimate update.
* Added filters to both new Lead queues and excluded canceled leads.

= 2.5.58 =
* Fixed Lead Update Next Follow-up visibility for Completed/Canceled status.
* Added definitive physical spacing between adjacent filter fields application-wide.
* Unified filter label typography across native and generated filter controls.

= 2.5.62 =
* Removed Title / Name completely from Add Recce and Edit Recce.
* Made No of Recce mandatory and enforced a value greater than 0.
* Made Target Date mandatory.
* Existing Recce titles are preserved on edit; new Recce records receive an automatic internal title.

= 2.5.60 =
* Assigned By is mandatory on Add/Edit Lead.
* Pending Assignee popup uses a clear native Users dropdown.
* Add Lead appears beside Excel/PDF in all Lead list headers.
* Add Task appears beside Excel/PDF in Completed Tasks, Canceled Tasks and Tasks Master.

* v2.5.65: Made No of Recce and Pending Recce non-editable in Recce Update. Pending Recce recalculates automatically from Completed, Denied and Cancel counts.

* v2.5.66: Recce update inputs now start blank and Pending stays unchanged while entering an update. Recce In Progress and Completed Recce now show cumulative Completed, Denied, Cancel and Pending totals.

* v2.5.67: Recce Update now treats the displayed Pending Recce as a fixed opening balance for the update. Completed, Denied and Cancel are validated only against that current Pending balance, not against the original No of Recce.

* v2.5.68: Recce In Progress and Completed Recce now keep a single Excel download in the page header, with Add Recce beside it; duplicate panel Excel/Add actions removed.

* v2.5.70: Recce Update hard-locks Pending Recce to the opening pending balance for the entire popup session. Completed, Denied and Cancel always open blank and cannot alter the displayed Pending value before Save.

* v2.5.71: Added Action Details in Recce Master. It opens a centered popup showing only the selected Recce's Recce Worked history with Pending, Completed, Denied, Cancel, Remarks, Update By and Date & Time.

* v2.5.72: Recce Master Action Details now shows Pending Recce after Cancel, with column order Completed, Denied, Cancel, Pending Recce.

* v2.5.73: Recce Master Action Details action is now shown as an icon-only history button while keeping the same popup and tooltip.

* v2.5.74: Recce Action Details now shows No of Recce beside the Recce/customer name.

* v2.5.76: Recce Action Details history is now ascending (oldest first/current update last) and includes a PDF action on the right side of the popup header.

* v2.5.86: Added Action Details history icon in Design Master. The popup shows the selected design's worked and approval history with Assigned, Completed, Design Approved, Cancel, Pending, Customer Remarks, Update By and Date & Time.

* v2.5.87: Added PDF download to Design Master Action Details. The PDF contains the selected design's complete worked and approval history in ascending order.

* v2.5.88: Renamed Designs Pending Approval filter labels from Worked Date From/To to Update Date From/To. Filtering logic is unchanged.

* v2.5.89: Added Designer to Design Worked/history tables and exports. Update Design now auto-fills Update By with the Design's Designer while keeping the Users Master dropdown editable.

* v2.6.04: Removed Processed, Rejected and Pending columns from Quotation Items Master. Increased Update Checking and Update Sending popup field sizes.

* v2.6.05: Added Status filter to Quotation Master. Moved Add Quotation into the top page header beside Excel for Pending Checking, Pending Sending, Quotations Pending Approval and Quotation Master, removing duplicate in-panel Add buttons.

* v2.6.06: Compacted Quotation item-entry rows, reduced item input heights/padding/font sizes, tightened numeric columns and action buttons, added sticky item-table headers with internal scrolling for long quotations, and reduced Terms textarea height so more item rows remain visible at once.

* v2.6.07: Renamed Design Assigned to No of Design across Design forms/tables/exports; added Approval Required checkbox to Design forms and routed only approval-required completed work to pending client approval; added mandatory Update Remarks to Update Design and Design Worked/history; blanked initial editable numeric zero values across ERP forms; standardized grey backgrounds for read-only/calculated fields.

* v2.6.09: Standardized Design quantity columns to No of Design, Design Completed, Design Pending, Approved Design, Pending Approval, Cancel across Design tables/history/exports; renamed Designs Pending Approval view to Pending Client Approval.

* v2.6.10: Removed the redundant inner fieldset border/card from ERP forms so the outer panel is the single clean form container.


= 2.6.78 =
* Added per-user View Permissions table in Users with Select All. Left-menu visibility and direct view access now follow each logged-in ERP user's selected views.

= 2.6.84 =
* Production Jobs: added inline + Add New beside Particular to quick-add Job Items directly from the Work Order form.

= 2.6.83 =
* Production: Department now links to Master > Department; added Master > Job Items with Particular and Description.
* Work Order Jobs now select Particular from Job Items and auto-fill editable Description.
* Production Customer no longer has an inline Add Customer button; Designer uses ERP Users Master.
* Production Remarks moved below the Jobs table.

* v2.6.98: Converted all operational Update action buttons (Task, Lead, Assigned To, Estimate, Recce, Design, Approval, Checking, Sending, Quotation Status, Delivery and Job) to compact icon-only actions with descriptive tooltips and accessibility labels.

* v2.7.00: Removed duplicate in-panel Add Quotation button from quotation workflow views; top header Add Quotation remains beside Excel.


= 2.7.05 =
* Added optional Vendor to Work Orders with quick-add Vendor support.
* Changed Work Order header to four-column compact layout.
* Simplified Order dropdown labels to Order No. - Customer Name.

= 2.7.16 =
* Work Order PDF: widened Address cell, enabled multi-line wrapping, and kept Vendor clearly visible.


= 2.7.22 =
* Vendor Work Order Amount is now read-only and automatically calculated as Nos × Rate on screen and again during save.

* v2.7.25: Add PO now shows live Total Amount beside + Add Item, summing all item Amount values.

* v2.7.49: Made Assigned To optional in the Add/Edit Lead form so unassigned leads can enter the Pending Assignee workflow.
* v2.7.48: Made Inv No., Inv Date and Inv Amount optional on Add/Edit GRN while retaining the fields for available invoice details.
* v2.7.47: Kept the main Search field visible by default while the Filter action controls all additional filters and Clear.
* v2.7.46: Added a Filter action beside Excel on every filtered table view and kept each filter section collapsed until requested.
* v2.7.45: Moved Add Purchase Order beside Excel in the top header for PO In Progress, Purchase Orders, Completed POs and Canceled PO.
* v2.7.44: Added Edit and direct GRN PDF download actions to every GRN Master row, with a dedicated Goods Receipt Note PDF layout.
* v2.7.43: Removed search hints and manual Search/Filter buttons from every listing, expanded all-column searching, and added relevant GRN and Purchase Order field filters.
* v2.7.42: Fixed row-level GRN Items searching and standardized every listing search on a WordPress-safe query parameter, including pagination and row-count changes.
* v2.7.41: Removed the GRN search hint and expanded automatic search across all GRN table data, including dates, users, items, descriptions and quantities.
* v2.7.40: Removed the manual Search button from GRN Master and GRN Items, enabled automatic search while typing, and avoided WordPress's reserved search parameter.
* v2.7.39: Removed Total Qty, Already Received and Pending columns from the GRN Items view while retaining Qty.
* v2.7.38: Updated the Add GRN desktop header layout to show four fields per row, with responsive two-column and one-column layouts on smaller screens.
* v2.7.37: Updated the Add GRN Purchase Order dropdown to use PO In Progress records and display PO Number with Supplier Name.
* v2.7.36: Added FY-based GRN numbering, a GRN Master view above GRN Items, and GRN-form-aligned columns in both GRN views.
* v2.7.35: Simplified Add GRN to Date, Purchase Order, Supplier, invoice details, Receive By, the six requested item quantity columns, and GRN Remarks below the item table.
* v2.7.34: Corrected the Add Work Order Assigned To dropdown layout so its search, Select All option, checkboxes and user names display as clean aligned rows.
* v2.7.33: Replaced the Dashboard Pending Approvals and Delayed / Overdue tables with linked live tables for Tasks, Leads, Recce, Designs, Design Client Approval, the three Quotation queues, Orders and Purchase Orders in progress.
* v2.7.32: Purchase Orders now use Cancel instead of Delete, retain PO history, download the PO PDF directly, and omit Status from the PDF.
* v2.7.31: Removed Reports, Notifications and the complete Admin section from the ERP sidebar and registered ERP views.
* v2.7.30: PO In Progress now shows every open Purchase Order, including Draft, Pending Approval, Approved and In Progress records, while excluding Completed, Canceled and Rejected POs.
* v2.7.29: New Purchase Orders now redirect to PO In Progress after save; Purchase Orders and Purchase Order Items show GRN Qty from linked non-cancelled GRNs.
* v2.7.28: Positioned the live Add PO Total Amount immediately below the item table and above Remarks, aligned to the right.
* v2.7.27: Moved the live Add PO Total Amount below the Remarks field and aligned it to the bottom-right with clear label/value spacing.
* v2.7.26: Add PO Total Amount and + Add Item are locked to the same horizontal line on desktop; responsive wrapping remains for small screens.
- v2.7.56: Replaced the Quotation Master Delete action with a non-destructive Cancel action that retains quotation and item data.
- v2.7.57: Updated the Quotation PDF to use the Settings logo and added Settings Notes, Bank Details, and Company Info to the footer.
- v2.7.58: Refined the Quotation PDF with a smaller logo, unlabeled customer name/address/mobile details, Quotation By from Made By, and Company Info beside Terms.
- v2.7.59: Removed Total Qty and GRN Qty from the PO In Progress table while retaining them in other Purchase Order views.
- v2.7.60: Added Installation Required to delivery, a Pending Installation view, and installation updates with photo, date, and user, plus spacing above delivery item tables.
- v2.7.61: Reworked the Quotation PDF item table with Particular, Unit, base and discounted amounts, GST rate and total, plus conditional discount and common GST-rate summaries.
- v2.7.62: Changed the Quotation PDF Disc column from discount percentage to calculated discount amount.
- v2.7.63: Simplified the Quotation PDF to seven item columns, used discounted amounts, applied the common-versus-mixed GST summary rule, and renamed Terms & Conditions.
- v2.7.64: Added company phone, website and email settings, automatic Company Info, and editable quotation Terms & Conditions and Notes prefilled from Settings.
- v2.7.65: Quotation PDF summary now shows original Amount and conditionally shows Discounted Amount when a discount exists.
- v2.7.66: Removed quotation discounts, renamed Particulars and Contact, improved PDF wrapping and column widths, bolded contact labels, and removed the Rs. prefix.
- v2.7.67: Split Settings into Company Settings and Quotation Settings, with Notes and Quotation Terms grouped under Quotation Settings.
- v2.7.68: Increased the Quotation PDF title to 18 pt and recentered its underline.
- v2.7.69: Aligned the company logo and Quotation heading on the same horizontal row in the PDF.
- v2.7.70: Reduced the gap below the logo by moving Customer Details upward in the Quotation PDF.
- v2.7.71: Reduced the gap between Customer Details and the quotation item table.
- v2.7.72: Added an editable Quotation Round Off field, included it in the final total, and displayed it before Total in the PDF summary when used.
- v2.7.73: Moved Round Off before Total Amount in the Quotation form and gave the editable field a white background.
- v2.7.74: Added independent 10-row pagination to every Dashboard table.

- v2.7.77: Kept Order Amount, Discount, GST, Round Off and Total Amount on one line on desktop.

- v2.7.78: Fixed Order amount summary so Amount, Discount, GST, Round Off and Total Amount remain on one desktop row.

- v2.7.79: Added a consistent right-side down arrow to all searchable dropdown fields and custom multi-user dropdowns across the ERP.

- v2.7.81: Dashboard summary cards now show each count on the right side of its label and remove the 'Needs attention' helper line.

- v2.7.82: Added a Daily Activity panel at the bottom of Dashboard showing today's ERP activity with time, module, work/reference, action and worked-by user.

- v2.7.83: Moved Daily Activity out of the main Dashboard and added it as a separate view under the Dashboard menu.


- v2.7.84: Added a Today Summary below Daily Activity with counts for tasks/leads added, recce/design updates, quotation creation/sending, order creation/delivery, PO creation and installations completed today.

- v2.10.74: Add Work Order now uses Item Master terminology in the row (Item / Select Item / Add Item); Job Items is removed from the Master menu while historical data remains intact.

- v2.10.75: Fixed Add Work Order Item dropdown to load Active Items Master records instead of the legacy Job Items source.
