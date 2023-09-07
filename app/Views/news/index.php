<head>
    <meta name="csrf-token" content="<?= csrf_hash() ?>">
</head>
<!-- <h2><?= esc($title) ?></h2> -->

<?php if (! empty($news) && is_array($news)): ?>

    <!-- <?php foreach ($news as $news_item): ?>

        <h3><?= esc($news_item['title']) ?></h3>

        <div class="main">
            <?= esc($news_item['body']) ?>
        </div>
        <p><a href="/news/<?= esc($news_item['slug'], 'url') ?>">View article</a></p>

    <?php endforeach ?> -->

    

    <div class="container">
    <button type="button" class="btn btn-info btn-lg" data-toggle="modal" data-target="#myModal">Open Form</button>
  
  <table cellpadding="0" cellspacing="0" border="0" class="dataTable table table-striped" id="example">

  </table>

</div>



<div class="modal fade" id="myModal" role="dialog">
    <div class="modal-dialog">

    <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">JSON Form</h4>
        </div>
        <div class="modal-body">
        <form></form>
        </div>
        <div class="modal-footer">
        </div>
      </div>
      
    </div>
  </div>
  
</div>

<script>
        var newsData = <?php echo $newsData; ?>;
</script>

<?php
  echo "<script>let categoryData = '$categoryData';</script>";
  echo "<script>let columnDefsPassed = '$columnsMeta';</script>";
?>


<?php else: ?>

    <h3>No News</h3>

    <p>Unable to find any news for you.</p>

<?php endif ?>