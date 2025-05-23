/**
 * baserCMS :  Based Website Development Project <https://basercms.net>
 * Copyright (c) NPO baser foundation <https://baserfoundation.org/>
 *
 * @copyright     Copyright (c) NPO baser foundation
 * @link          https://basercms.net baserCMS Project
 * @since         5.0.0
 * @license       https://basercms.net/license/index.html MIT License
 */

import Modal from '../../../../js/common/modal.vue';
import axios from '../../../../../../../node_modules/axios'

/**
 * Custom Links Vue
 *
 * @type {Vue}
 */
let customLinks = new Vue({

    /**
     * Element
     */
    el: '#AdminCustomTable',

    /**
     * data
     * @returns Object
     */
    data: function () {
        const script = $("#AdminCustomTablesFormScript");
        return {
            settings: JSON.parse(script.attr('data-setting')),
            links: JSON.parse(script.attr('data-links')),
            link: {},
            field: {},
            showPreview: {},
            parentList: {},
            enabledUseLoop: true,
            enabledGroupValid: true,
            currentParentId: null,
            tableId: script.attr('data-tableId'),
            displayPreview: true,
            isAdd: script.attr('data-isAdd')
        }
    },

    /**
     * Components
     */
    components: {
        Modal
    },

    /**
     * Mounted
     */
    mounted: function () {
        // テンプレート内のツールチップがリセットされてしまうため再度ヘルプのツールチップを設定
        if(!this.isAdd) {
            $.bcUtil.initTooltip();
        }
    },

    /**
     * Computed
     */
    computed: {
        /**
         * 現在の関連フィールドがグループかどうか
         *
         * @returns {boolean}
         */
        isGroupLink: function () {
            if (this.link.custom_field === undefined) return false;
            return this.link.custom_field.type === 'group'
        },

        /**
         * 現在の関連フィールドのタイプのタイトルを取得
         *
         * @returns {boolean|*}
         */
        linkTypeTitle: function () {
            if (this.link.custom_field === undefined) return false;
            return this.settings[this.link.custom_field.type].label
        },

        /**
         * 現在の関連フィールドのフィールドタイトルを取得
         *
         * @returns {boolean|*}
         */
        linkFieldTitle: function () {
            if (this.link.custom_field === undefined) return false;
            return this.link.custom_field.title
        },

        /**
         * 配列の選択リストを取得
         *
         * @returns {{length}|*|*[]}
         */
        arraySource: function () {
            if (!this.field.source) return [];
            let arraySource = this.field.source.split("\n").map(function (v) {
                return v.replace('\r', '');
            });
            if (arraySource.length && arraySource[0] === '') {
                return [];
            }
            return arraySource;
        },

        /**
         * 関連リンクの説明文にて改行タグに変換したものを取得
         *
         * @returns {string|*}
         */
        linkHtmlDescription: function () {
            if (!this.link.description) return '';
            return this.link.description.replace('\n', '<br>');
        },

        /**
         * カスタムフィールドの編集画面へのリンクを取得
         *
         * @returns {string}
         */
        editFieldLinkUrl: function () {
            if (!this.field) return '';
            return $.bcUtil.adminBaseUrl + 'bc-custom-content/custom_fields/edit/' + this.field.id;
        },

        /**
         * 関連フィールドの ID より関連フィールドのタイトルを取得する
         *
         * @returns {(function(*): (*|string))|*}
         */
        linkTitleById() {
            return (id) => {
                if (this.links[id]) {
                    return this.links[id].title;
                } else {
                    return '';
                }
            }
        },

        /**
         * 関連フィールドの ID よりカスタムフィールドのタイトルを取得する
         *
         * @returns {(function(*): (*|string))|*}
         */
        linkFieldTitleById() {
            return (id) => {
                if (this.links[id]) {
                    return this.links[id].custom_field.title;
                } else {
                    return '';
                }
            }
        },

        /**
         * グループが利用可能かどうか
         *
         * @returns {boolean}
         */
        isEnabledParent: function() {
            if(!Object.keys(this.parentList).length) return false;
            return this.field.type !== 'group';
        }
    },

    /**
     * Methods
     */
    methods: {

        /**
         * テーブルを保存する
         * 保存ボタン部分が Vue.js で制御されていないため、ここで制御
         */
        saveTable: function () {
            $.bcUtil.showLoader();
        },

        /**
         * 関連リンク詳細を開く
         *
         * @param index
         * @returns {boolean}
         */
        openLinkDetail: function (index) {
            this.$refs.modalCustomLinkDetail.openModal(index);
            return false;
        },

        /**
         * 関連リンク詳細を開いた時
         *
         * @param index
         */
        linkDetailOpened: function (index) {
            this.link = Object.assign({}, this.links[index]);
            this.field = this.link.custom_field;
            this.currentParentId = this.link.parent_id;
            const setting = this.settings[this.field.type];
            this.initPreview(this.link.id, setting);
            this.loadParentList();
            this.changeGroupFunction();

            $.bcUtil.initTooltip({
                target: '.modal-content .bca-help',
                content: '.modal-content .bca-helptext',
            });

            let $preview = $("#CustomLinkPreview");
            let $modelWindow = $(".modal-window");
            let $modalFooter = $(".modal-footer");

            // modal-window の幅が確定するまで少し待ってから フッターとプレビューの横幅を設定する
            $modalFooter.hide();
            $preview.hide();
            this.hideError();

            // wysiwygエディタが modal の中だと 正常動作しないという理由で、プレビューは外でレンダリングさせているため、
            // レンダリングが終わってから modal の中に移動させる
            $preview.appendTo(".modal-content");

            setTimeout(function () {
                $(".modal-footer")
                    .css('position', 'fixed')
                    .css('bottom', 0)
                    .css('width', $modelWindow.width());
                $preview.css('width', $modelWindow.width());
                $modalFooter.show();
                $preview.show();
            }, 500);

            // 一番下までスクロールしたらプレビューを非表示にする
            $modelWindow.on('scroll', function () {
                var bottom = $('.modal-content').innerHeight() - $modelWindow.innerHeight();
                if (bottom <= $modelWindow.scrollTop()) {
                    $preview.fadeOut(500);
                } else {
                    if (customLinks.displayPreview && $preview.css('display') === 'none') {
                        $preview.fadeIn(500);
                    }
                }
            });
        },

        hidePreview() {
            this.displayPreview = false;
            $("#CustomLinkPreview").fadeOut(500);
        },

        loadParentList: function() {
            let url = $.bcUtil.apiAdminBaseUrl + 'bc-custom-content/custom_links/get_parent_list/' + this.link.custom_table_id + '.json';
            axios.get(url)
                .then(response => {
                    if(response.data.parentList) {
                        this.parentList = response.data.parentList;
                    } else {
                        this.parentList = {};
                    }
                });
        },

        /**
         * 関連リンクモーダルを閉じる
         */
        closeLinkDetail: function () {
            this.displayPreview = false;
            // プレビューを modal の外から持ってきているため、 modal を閉じるとなくなってしまうので、一旦、外部に退避
            $("#CustomLinkPreview").hide().appendTo('body');
        },

        /**
         * プレビューを初期化する
         *
         * @param id
         * @param setting
         */
        initPreview: function (id, setting) {
            this.displayPreview = true;
            this.showPreview['NonSupport'] = false;
            Object.keys(this.showPreview).forEach(function (key) {
                this.showPreview[key] = false;
            }, this);
            if (id && setting.preview && this.links[id].custom_field.type !== 'group') {
                this.showPreview[id] = true;
            } else {
                this.showPreview['NonSupport'] = true;
            }
        },

        /**
         * 関連リンクを保存する
         */
        saveLink: function () {
            if(this.currentParentId !== this.link.parent_id) {
                const message = bcI18n.confirmMessageOnSaveLink;
                if(!confirm(message)) {
                    return;
                }
            }
            this.hideError();
            $.bcUtil.showLoader();
            let url = $.bcUtil.apiAdminBaseUrl + 'bc-custom-content/custom_links/edit/' + this.link.id + '.json';
            const $this = this;
            $.bcToken.check(function(){
                axios.post(url, $this.link, {
                        headers: {
                            'X-CSRF-Token': $.bcToken.key
                        }
                    })
                    .then(response => {
                        $.bcUtil.hideLoader();
                        $this.links[$this.link.id] = $this.link;
                        $this.$refs.modalCustomLinkDetail.closeModal();
                    })
                    .catch(error => {
                        $.bcUtil.hideLoader();
                        const errors = error.response.data.errors;
                        if (error.response.status === 400) {
                            $('.modal-content #MessageBox .alert-message').html(error.response.data.message);
                            Object.keys(errors).forEach(function (name) {
                                Object.keys(errors[name]).forEach(function (detail) {
                                    $('.error-' + name).append(errors[name][detail]).show();
                                });
                            });
                        } else if (error.response.status === 500) {
                            $('.modal-content #MessageBox .alert-message').html(error.response.data.message);
                        } else {
                            $('.modal-content #MessageBox .alert-message').html('予期せぬエラーが発生しました。システム管理者に連絡してください。');
                        }
                        $('.modal-content #MessageBox').show();
                    });
            });
        },

        /**
         * エラーを非表示にする
         */
        hideError: function () {
            $('.modal-content .error-message').html('').hide();
            $('.modal-content #MessageBox').hide();
        },

        /**
         * グループ機能の状態を変更する
         */
        changeGroupFunction()
        {
            if(this.link.group_valid) {
                this.enabledUseLoop = false;
                this.link.use_loop = false;
            } else {
                this.enabledUseLoop = true;
            }
            if(this.link.use_loop) {
                this.enabledGroupValid = false;
                this.link.group_valid = false;
            } else {
                this.enabledGroupValid = true;
            }
            // right - lft が 1を超える場合は、子がいるとみなし、強制的にループ機能の変更を不可とする
            if((this.link.rght - this.link.lft) > 1) {
                this.enabledUseLoop = false;
            }
        },

        /**
         * 削除する
         *
         * レイアウト上の問題にて、vue.js のアプリケーション内に削除ボタンを配置する必要があるが、
         * アプリケーション内では、FormHelper::postLink() の JS が無効化されてしまうため、vue.js 内で実装。
         * API を利用していない理由は次の課題をクリアするため
         * - 削除してそのまま一覧に画面遷移する
         * - 遷移後、フラッシュメッセージを表示する
         * _Token フィールドの生成が JS上で難しいため、コントローラーにて validatePost を false にしている
         * @see Admin/CustomTablesController::beforeFilter
         */
        deleteTable() {
            if(!confirm(bcI18n.confirmDeleteMessage)) return;
            $.bcUtil.showLoader();
            const $form = $('<form method="post"/>');
            const $input = $('<input name="_csrfToken"/>');
            $form.attr('action', $.bcUtil.adminBaseUrl + 'bc-custom-content/custom_tables/delete/' + this.tableId);
            $form.append($input);
            $.bcToken.check(function (){
                $input.val($.bcToken.key);
                $("body").append($form);
                $form.submit();
            }, {hideLoader: false});
        }

    }

});

$(function () {
    init();
    changeType();
    registerEventToInUseField();
    /**
     * 初期化
     */
    function init() {

        // 階層構造を持つの表示切り替え
        $("input[name='type']").click(changeType);

        // 利用できるフィールドを利用中のフィールドへドラッグ
        $("#CustomFieldSettingSource .draggable").draggable({
            scroll: true,
            helper: 'clone',
            opacity: 0.80,
            revert: 'invalid',
            cursor: 'move',
            connectToSortable: '#CustomFieldSettingTarget',
            containment: '#CustomFieldSetting',
            start: function (event, ui) {
                jQuery(ui.helper).css({
                    'width': jQuery(this).width()
                });
                const currentType = $(this).find("input.custom-field-type").val();
                if(currentType.length > 0){
                    const fieldTypes = $("#AdminCustomTablesFormScript").data('setting');
                    const onlyOneOnTable = fieldTypes[currentType].onlyOneOnTable;
                    if(onlyOneOnTable && isTargetDeployed(currentType)) {
                        event.preventDefault();
                    }
                }
            },
        });
        // 利用中のフィールドを並べ替える
        $("#CustomFieldSettingTarget").sortable({
            placeholder: 'custom-field-content placeholder',
            cursor: 'move',
            revert: true,
            distance: 5,
            containment: '#CustomFieldSetting',
            zIndex: 55,
            scroll: true,
            // items を除外すると、update 実行時に、prevObject を参照できないくなるので注意
            // items: 'div.sortable',
            update: function (event, ui) {
                if ($(ui.item).attr("id") !== undefined && $(ui.item).attr("id").match(/^InUseField/i)) {
                    updateSort();
                    return;
                }

                // テンプレートのクラスを取得
                // "template-field-recruit_category" のようなクラス名
                let templateClass = 'template-field-' + $(ui.item).attr('class').split(' ').filter(value => {
                    return (value.indexOf('available-field-') !== -1);
                })[0].replace('available-field-', '');

                let baseId = getNewBaseId();
                let inUseFieldId = 'InUseField' + (baseId);

                // テンプレートをクローンし、id を付与してクラスを処理
                let template = $(`.${templateClass}`).clone()
                    .attr('id', inUseFieldId)
                    .addClass('in-use-field')
                    .removeClass('template ' + templateClass);
                // ドロップ対象の後に追加しドロップ対象は削除
                ui.item.after(template).remove();

                $(`#${inUseFieldId} input[name='template[name]']`).attr('name', `custom_links[new-${baseId}][name]`);
                $(`#${inUseFieldId} input[name='template[custom_field_id]']`).attr('name', `custom_links[new-${baseId}][custom_field_id]`);
                $(`#${inUseFieldId} input[name='template[sort]']`).attr('name', `custom_links[new-${baseId}][sort]`);
                $(`#${inUseFieldId} input[name='template[type]']`).attr('name', `custom_links[new-${baseId}][type]`);
                $(`#${inUseFieldId} input[name='template[title]']`).attr('name', `custom_links[new-${baseId}][title]`);
                $(`#${inUseFieldId} input[name='template[display_front]']`).attr('name', `custom_links[new-${baseId}][display_front]`);
                $(`#${inUseFieldId} input[name='template[use_api]']`).attr('name', `custom_links[new-${baseId}][use_api]`);
                $(`#${inUseFieldId} input[name='template[status]']`).attr('name', `custom_links[new-${baseId}][status]`);

                const $nameInput = $(`#${inUseFieldId} input[name='custom_links[new-${baseId}][name]']`);
                if($nameInput.val() === 'group') {
                    $nameInput.val('group_field');
                }

                registerEventToInUseField(inUseFieldId);
                updateSort();
                checkDeployedOnlyOneOnTableTypes();
            },
        });
        // 利用中のフィールドを並べ替える
        $(".custom-field-group__inner").sortable({
            placeholder: 'custom-field-content placeholder',
            cursor: 'move',
            revert: true,
            distance: 5,
            containment: '#CustomFieldSetting',
            zIndex: 55,
            scroll: true,
            update: function (event, ui) {
                updateSort();
            },
        });
        checkDeployedOnlyOneOnTableTypes();
    }

    /**
     * 利用中のフィールドに対してOnlyOneOnTableのタイプが配置されているかチェックを行い、
     * 配置されている場合は利用できるフィールドの対象のタイプにis-deployedクラスを付与する
     */
    function checkDeployedOnlyOneOnTableTypes() {
        let deployedTypes = getDeployedOnlyOneOnTableTypes();
        $("#CustomFieldSettingSource .custom-field-type").each(function(){
            if(deployedTypes.indexOf($(this).val()) !== -1) {
                $(this).parent().addClass('is-deployed');
            }
        });
    }

    /**
     * ターゲットに配置済のOnlyOneOnTableのタイプを取得
     */
    function getDeployedOnlyOneOnTableTypes() {
        let types = [];
        Object.keys(customLinks.settings).forEach(key => {
            if(customLinks.settings[key].onlyOneOnTable && isTargetDeployed(key)) {
                types.push(key);
            }
        });
        return types;
    }

    /**
     * ターゲットに配置済かどうか
     * @param targetType
     * @returns {boolean}
     */
    function isTargetDeployed(targetType) {
        let isDeployed = false;
        $("#CustomFieldSettingTarget").find("[id*='InUseField']").each(function(){
            var type = $(this).find("input.custom-field-type").val();
            if(targetType === type){
                isDeployed = true;
                return true;
            }
        });
        return isDeployed;
    }

    /**
     * テーブルタイプに伴う表示調整
     */
    function changeType() {
        if ($("input[name='type']:checked").val() === '1') {
            $('#SpanHasChild').hide();
            $('#has-child').prop('checked', false);
            $('#RowDisplayField').show();
        } else {
            $('#SpanHasChild').show();
            $('#RowDisplayField').hide();
            $('#display-field').val('title');
        }
    }

    /**
     * 利用中のフィールドにイベントを登録する
     *
     * @param id
     */
    function registerEventToInUseField(id) {
        if (id !== undefined) {
            id = '#' + id + ' ';
        } else {
            id = '';
        }
        // 見出し名変更
        $(id + ".custom-field-setting__name").keyup(function () {
            $(this).parent().parent().prev().find('.custom-field-content__head-text').html($(this).val());
        });

        // 利用中のフィールドのボックスの開閉
        $(id + ".custom-field-content__head-setting").click(function () {
            let $next = $(this).parent().next();
            if ($next.is(':hidden')) {
                $next.slideDown('fast');
            } else {
                $next.slideUp('fast');
            }
        });

        $(id + ".custom-field-content__head-delete").click(function () {
            $(this).parent().parent().slideUp('fast', function () {
                $(this).remove();
                updateSort();
            })
            // onlyOneOnTable のタイプが削除された場合は、利用できるフィールドの対象のタイプにis-deployedクラスを削除する
            let deletedFieldType = $(this).parent().parent().find("input.custom-field-type").val();
            //deletedFieldTypeがonlyOneOnTableのタイプであるかチェック
            if(customLinks.settings[deletedFieldType].onlyOneOnTable === true) {
                $("#CustomFieldSettingSource .custom-field-type").each(function(){
                    if($(this).val() === deletedFieldType && $(this).parent().hasClass('is-deployed')) {
                        $(this).parent().removeClass('is-deployed');
                    }
                });
            };
        });
    }

    /**
     * 新しいベースIDを取得する
     *
     * @returns {number}
     */
    function getNewBaseId() {
        let max = 0;
        $("#CustomFieldSettingTarget .custom-field-sort").each(function () {
            const sort = Number($(this).val());
            if (sort > max) max = sort;
        });
        return max + 1;
    }

    /**
     * 並び順を更新する
     *
     * グループが存在する場合は各グループごとに採番する
     */
    function updateSort() {
        let i = 1;
        $("#CustomFieldSettingTarget .custom-field-sort").each(function () {
            $(this).val(i);
            i++;
        });
        $(".custom-field-group").each(function () {
            i = 1;
            $(this).find('.custom-field-child-sort').each(function () {
                $(this).val(i);
                i++;
            });
        });
    }

});

