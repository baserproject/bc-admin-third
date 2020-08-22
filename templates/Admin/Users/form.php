<?php
/**
 * baserCMS :  Based Website Development Project <https://basercms.net>
 * Copyright (c) baserCMS User Community <https://basercms.net/community/>
 *
 * @copyright     Copyright (c) baserCMS User Community
 * @link          https://basercms.net baserCMS Project
 * @since         5.0.0
 * @license       http://basercms.net/license/index.html MIT License
 */

/**
 * Users form
 * @var \BaserCore\View\AppView $this
 * @var bool $selfUpdate
 * @var array $user
 */

$this->BcBaser->i18nScript([
	'alertMessage1' => __d('baser', '処理に失敗しました。'),
	'alertMessage2' => __d('baser', '送信先のプログラムが見つかりません。'),
	'confirmMessage1' => __d('baser', '更新内容をログイン情報に反映する為、一旦ログアウトします。よろしいですか？'),
	'confirmMessage2' => __d('baser', '登録されている「よく使う項目」を、このユーザーが所属するユーザーグループの初期設定として登録します。よろしいですか？'),
	'infoMessage1' => __d('baser', '登録されている「よく使う項目」を所属するユーザーグループの初期値として設定しました。'),
]);
$this->BcBaser->js('admin/users/edit', false);
?>

<div id="SelfUpdate" style="display: none"><?php echo $selfUpdate ?></div>
<div id="AlertMessage" style="display: none"></div>
<div id="UserGroupSetDefaultFavoritesUrl" style="display:none"><?php $this->BcBaser->url(['plugin' => null, 'controller' => 'user_groups', 'action' => 'set_default_favorites', @$this->request->getData('UserGroup.id')]) ?></div>

<?php echo  $this->BcAdminForm->create($user) ?>

<?php echo $this->BcFormTable->dispatchBefore() ?>

<div class="section">
    <table id="FormTable" class="form-table bca-form-table">
        <?php if ($this->request->getParam('action') == 'edit'): ?>
            <tr>
                <th class="col-head bca-form-table__label"><?php echo $this->BcAdminForm->label('id', 'No') ?></th>
                <td class="col-input bca-form-table__input">
                    <?php echo $user->id ?>
                    <?php echo $this->BcAdminForm->control('id', ['type' => 'hidden']) ?>
                </td>
            </tr>
        <?php endif ?>
        <tr>
            <th class="col-head bca-form-table__label"><?php echo $this->BcAdminForm->label('name', __d('baser', 'アカウント名')) ?>&nbsp;<span class="bca-label" data-bca-label-type="required"><?php echo __d('baser', '必須') ?></span></th>
            <td class="col-input bca-form-table__input">
                <?php echo $this->BcAdminForm->control('name', ['type' => 'text', 'size' => 20, 'maxlength' => 255, 'autofocus' => true]) ?>
                <i class="bca-icon--question-circle btn help bca-help"></i>
                <?php echo $this->BcAdminForm->error('name') ?>
                <div id="helptextName" class="helptext"><?php echo __d('baser', '半角英数字とハイフン、アンダースコアのみで入力してください。') ?></div>
            </td>
        </tr>
        <tr>
            <th class="col-head bca-form-table__label"><?php echo $this->BcAdminForm->label('real_name_1', __d('baser', '名前')) ?>&nbsp;<span class="bca-label" data-bca-label-type="required"><?php echo __d('baser', '必須') ?></span></th>
            <td class="col-input bca-form-table__input">
                <small>[<?php echo __d('baser', '姓') ?>]</small> <?php echo $this->BcAdminForm->control('real_name_1', ['type' => 'text', 'size' => 12, 'maxlength' => 255]) ?>
                <small>[<?php echo __d('baser', '名') ?>]</small> <?php echo $this->BcAdminForm->control('real_name_2', ['type' => 'text', 'size' => 12, 'maxlength' => 255]) ?>
                <i class="bca-icon--question-circle btn help bca-help"></i>
                <?php echo $this->BcAdminForm->error('real_name_1', __d('baser', '姓を入力してください')) ?>
                <?php echo $this->BcAdminForm->error('real_name_2', __d('baser', '名を入力してください')) ?>
                <div id="helptextRealName1" class="helptext"><?php echo __d('baser', '「名」は省略する事ができます。') ?></div>
            </td>
        </tr>
        <tr>
            <th class="col-head bca-form-table__label"><?php echo $this->BcAdminForm->label('nickname', __d('baser', 'ニックネーム')) ?></th>
            <td class="col-input bca-form-table__input">
                <?php echo $this->BcAdminForm->control('nickname', ['type' => 'text', 'size' => 40, 'maxlength' => 255]) ?>
                <i class="bca-icon--question-circle btn help bca-help"></i>
                <?php echo $this->BcAdminForm->error('nickname') ?>
                <div id="helptextNickname" class="helptext"><?php echo __d('baser', 'ニックネームを設定している場合は全ての表示にニックネームが利用されます。') ?></div>
            </td>
        </tr>
        <tr>
            <th class="col-head bca-form-table__label"><?php echo $this->BcAdminForm->label('user_group_id', __d('baser', 'グループ')) ?>&nbsp;<span class="bca-label" data-bca-label-type="required"><?php echo __d('baser', '必須') ?></span></th>
            <td class="col-input bca-form-table__input">
                <?php if ($editable): ?>
                    <?php echo $this->BcAdminForm->control('user_groups._ids', ['type' => 'multiCheckbox', 'options' => $userGroups]); ?>

                    <i class="bca-icon--question-circle btn help bca-help"></i>
                    <?php echo $this->BcAdminForm->error('user_group_id', __d('baser', 'グループを選択してください')) ?>
                    <div id="helptextUserGroupId" class="helptext"><?php echo sprintf(__d('baser', 'ユーザーグループごとにコンテンツへのアクセス制限をかける場合などには%sより新しいグループを追加しアクセス制限の設定をおこないます。'), $this->BcBaser->getLink(__d('baser', 'ユーザーグループ管理'), ['controller' => 'user_groups', 'action' => 'index']))?></div>
                <?php else: ?>
                    <?php echo $this->BcText->arrayValue($this->request->getData('user_group_id'), $userGroups) ?>
                    <?php echo $this->BcAdminForm->control('user_group_id', ['type' => 'hidden']) ?>
                <?php endif ?>
            </td>
        </tr>
        <tr>
            <th class="col-head bca-form-table__label"><?php echo $this->BcAdminForm->label('email', __d('baser', 'Eメール')) ?></th>
            <td class="col-input bca-form-table__input">
                <input type="text" name="dumy-email" style="top:-100px;left:-100px;position:fixed;">
                <?php echo $this->BcAdminForm->control('email', ['type' => 'text', 'size' => 40, 'maxlength' => 255]) ?>
                <i class="bca-icon--question-circle btn help bca-help"></i>
                <?php echo $this->BcAdminForm->error('email') ?>
                <div id="helptextEmail" class="helptext">
                    <?php echo __d('baser', '連絡用メールアドレスを入力します。') ?>
                    <br><small>※ <?php echo __d('baser', 'パスワードを忘れた場合の新パスワードの通知先等') ?></small>
                </div>
            </td>
        </tr>
        <tr>
            <th class="col-head bca-form-table__label">
                <?php if ($this->request->getParam('action') == 'add'): ?>
                    <span class="bca-label" data-bca-label-type="required"><?php echo __d('baser', '必須') ?></span>&nbsp;
                <?php endif; ?>
                <?php echo $this->BcAdminForm->label('password_1', __d('baser', 'パスワード')) ?>
            </th>
            <td class="col-input bca-form-table__input">
                <?php if ($this->request->getParam('action') == 'edit'): ?><small>[<?php echo __d('baser', 'パスワードは変更する場合のみ入力してください') ?>]</small><br /><?php endif ?>
                <!-- ↓↓↓自動入力を防止する為のダミーフィールド↓↓↓ -->
                <input type="password" name="dummy-pass" style="top:-100px;left:-100px;position:fixed;">
                <?php echo $this->BcAdminForm->control('password_1', ['type' => 'password', 'size' => 20, 'maxlength' => 255]) ?>
                <?php echo $this->BcAdminForm->control('password_2', ['type' => 'password', 'size' => 20, 'maxlength' => 255]) ?>
                <i class="bca-icon--question-circle btn help bca-help"></i>
                <?php echo $this->BcAdminForm->error('password') ?>
                <div id="helptextPassword" class="helptext">
                    <ul>
                        <li>
                            <?php if ($this->request->getParam('action') == 'edit'): ?>
                                <?php echo __d('baser', 'パスワードの変更をする場合は、') ?>
                            <?php endif; ?>
                            <?php echo __d('baser', '確認の為２回入力してください。') ?></li>
                        <li><?php echo __d('baser', '半角英数字(英字は大文字小文字を区別)とスペース、記号(._-:/()#,@[]+=&;{}!$*)のみで入力してください') ?></li>
                        <li><?php echo __d('baser', '最低６文字以上で入力してください') ?></li>
                    </ul>
                </div>
            </td>
        </tr>
        <?php echo $this->BcAdminForm->dispatchAfterForm() ?>
    </table>
</div>

<?php echo $this->BcFormTable->dispatchAfter() ?>

<div class="submit section bca-actions">
    <div class="bca-actions__main">
        <?= $this->BcAdminForm->button(
                __d('baser', '保存'),
                 ['div' => false,
                 'class' => 'button bca-btn bca-actions__item',
                 'data-bca-btn-type' => 'save',
                 'data-bca-btn-size' => 'lg',
                 'data-bca-btn-width' => 'lg',
                 'id' => 'BtnSave']
            ) ?>
    </div>
<?php if ($editable): ?>
    <div class="bca-actions__sub">
        <?php if ($this->request->getParam('action') == 'edit' && $deletable): ?>
            <?= $this->BcAdminForm->postLink(
                    __d('baser', '削除'),
                    ['action' => 'delete', $user->id],
                    ['block' => true,
                    'confirm' => __d('baser', '{0} を本当に削除してもいいですか？', $user->name),
                    'class' => 'submit-token button bca-btn bca-actions__item',
                    'data-bca-btn-type' => 'delete',
                    'data-bca-btn-size' => 'sm']
                ) ?>
        <?php endif; ?>
    </div>
<?php endif; ?>
</div>

<?php echo $this->BcAdminForm->end() ?>

<?= $this->fetch('postLink') ?>

<?php // TODO: よく使うメニュー関連 ?>
<?php /* if ($this->request->action == 'admin_edit'): ?>
	<div class="panel-box bca-panel-box corner10">
		<h2><?php echo __d('baser', '登録されている「よく使う項目」') ?></h2>
		<?php if ($this->request->data['Favorite']): ?>
			<ul class="bca-list" data-bca-list-layout="horizon" id="DefaultFavorites">
				<?php foreach ($this->request->data['Favorite'] as $key => $favorite): ?>
					<li class="bca-list__item">
						<?php $this->BcBaser->link($favorite['name'], $favorite['url']) ?>
						<?php echo $this->BcAdminForm->control('Favorite.name.' . $key, ['type' => 'hidden', 'value' => $favorite['name'], 'class' => 'favorite-name']) ?>
						<?php echo $this->BcAdminForm->control('Favorite.url.' . $key, ['type' => 'hidden', 'value' => $favorite['url'], 'class' => 'favorite-url']) ?>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php endif ?>
		<?php if ($this->Session->check('AuthAgent') || $this->BcBaser->isAdminUser()): ?>
			<div class="submit"><?php echo $this->BcAdminForm->button($this->request->data['UserGroup']['title'] . 'グループの初期値に設定', ['label' => __d('baser', 'グループ初期データに設定'), 'id' => 'btnSetUserGroupDefault', 'class' => 'button bca-btn']) ?></div>
		<?php endif ?>
	</div>
<?php endif*/ ?>