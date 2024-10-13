/**
 * baserCMS :  Based Website Development Project <https://basercms.net>
 * Copyright (c) NPO baser foundation <https://baserfoundation.org/>
 *
 * @copyright     Copyright (c) NPO baser foundation
 * @link          https://basercms.net baserCMS Project
 * @since         5.0.0
 * @license       https://basercms.net/license/index.html MIT License
 */
$((function(){!function(e){var t=$("input[name='ViewSetting[list_type]']:checked").val(),n=$("#viewsetting-mode").val();void 0!==t&&"trash"!==n||(t="1");var i,a=$("#GrpChangeTreeOpenClose");switch(t){case"1":i=$("#AdminContentsIndexScript"),$.bcTree.init({isAdmin:i.attr("data-isAdmin"),isUseMoveContents:i.attr("data-isUseMoveContents"),adminPrefix:i.attr("data-adminPrefix"),baserCorePrefix:i.attr("data-baserCorePrefix"),editInIndexDisabled:i.attr("data-editInIndexDisabled")}),$(window).bind("mousedown",$.bcTree.updateShiftAndCtrlOnAnchor),$("#BtnOpenTree").click((function(){$.bcTree.jsTree.open_all()})),$("#BtnCloseTree").click((function(){$.bcTree.jsTree.close_all(),$.bcTree.jsTree.open_node($.bcTree.jsTree.get_json(),!1,!1)})),$("#BtnAddContent").click($.bcTree.showMenuByOuter),$(document).on("dnd_stop.vakata",$.bcTree.orderContent),$(document).on("dnd_start.vakata",$.bcTree.changeDnDCursor),$.bcUtil.disabledHideMessage=!0,$($.bcTree).bind("loaded",(function(){$.bcUtil.disabledHideMessage=!1})),$.bcTree.load(),a.show();break;case"2":$.bcBatch.init({batchUrl:$.bcUtil.apiAdminBaseUrl+"baser-core/contents/batch.json"}),a.hide()}$("#BtnSearchSubmit").click((function(){return $("#list-type").val(2),!0})),$("input[name='ViewSetting[list_type]']").change((function(){switch($.bcUtil.showLoader(),$("input[name='ViewSetting[list_type]']:checked").val()){case"1":location.href=$.bcUtil.adminBaseUrl+"baser-core/contents/index?list_type=1";break;case"2":e=$.bcUtil.adminBaseUrl+"baser-core/contents/index?",$("#list-type").val(2),location.href=e+decodeURI($("#ContentIndexForm").serialize())}var e}))}()}));
//# sourceMappingURL=index.bundle.js.map