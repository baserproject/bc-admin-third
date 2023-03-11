<?php
/**
 * baserCMS :  Based Website Development Project <https://basercms.net>
 * Copyright (c) NPO baser foundation <https://baserfoundation.org/>
 *
 * @copyright     Copyright (c) NPO baser foundation
 * @link          https://basercms.net baserCMS Project
 * @since         5.0.0
 * @license       https://basercms.net/license/index.html MIT License
 */
/**
 * [ADMIN] ブログカテゴリー一覧ウィジェット設定
 * @var \BaserCore\View\BcAdminAppView $this
 * @var string $key
 * @checked
 * @noTodo
 * @unitTest
 */
$title = __d('baser_core', 'カテゴリ一覧');
$description = __d('baser_core', 'カテゴリ一覧を表示します。');
?>


<script type="text/javascript">
  $(function () {
    var key = "<?php echo $key ?>";
    $("#" + key + "ByYear").click(function () {
      if ($("#" + key + "ByYear").prop('checked')) {
        $("#" + key + "Depth").val(1);
        $("#Span" + key + "Depth").slideUp(200);
      } else {
        $("#Span" + key + "Depth").slideDown(200);
      }
    });
    if ($("#" + key + "ByYear").prop('checked')) {
      $("#" + key + "Depth").val(1);
      $("#Span" + key + "Depth").hide();
    }
  });
</script>


<?php echo $this->BcAdminForm->label($key . '.limit', __d('baser_core', '表示数')) ?>&nbsp;
<?php echo $this->BcAdminForm->control($key . '.limit', [
  'type' => 'text',
  'size' => 6
]) ?>&nbsp;件
<br>
<?php echo $this->BcAdminForm->label($key . '.view_count', __d('baser_core', '記事数表示')) ?>&nbsp;
<?php echo $this->BcAdminForm->control($key . '.view_count', [
  'type' => 'radio',
  'options' => $this->BcText->booleanDoList(''),
  'legend' => false,
  'default' => 0
]) ?>
<br>
<?php echo $this->BcAdminForm->control($key . '.by_year', [
  'type' => 'checkbox',
  'label' => __d('baser_core', '年別に表示する')
]) ?>
<br>
<p id="Span<?php echo $key ?>Depth"><?php echo $this->BcAdminForm->label($key . '.depth', __d('baser_core', '深さ')) ?>&nbsp;
  <?php echo $this->BcAdminForm->control($key . '.depth', ['type' => 'text', 'size' => 6, 'default' => 1]) ?>
  &nbsp;<?php echo __d('baser_core', '階層') ?></p>
<?php echo $this->BcAdminForm->label($key . '.blog_content_id', __d('baser_core', 'ブログ')) ?>&nbsp;
<?php echo $this->BcAdminForm->control($key . '.blog_content_id', [
  'type' => 'select',
  'options' => $this->BcAdminForm->getControlSource('BcBlog.BlogContents.id')
]) ?>
<br>
<small>
  <?php echo __d('baser_core', 'ブログページを表示している場合は、上記の設定に関係なく、<br>対象ブログのカテゴリ一覧を表示します。') ?>
</small>
