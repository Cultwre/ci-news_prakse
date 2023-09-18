<!doctype html>
<html>
<head>
    <title>CodeIgniter Tutorial</title>

    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.css" />
  <link rel="stylesheet" href="https://cdn.datatables.net/1.10.21/css/jquery.dataTables.css" />
  <link rel="stylesheet" href="https://cdn.datatables.net/buttons/1.6.2/css/buttons.dataTables.css" />
  <link rel="stylesheet" href="https://cdn.datatables.net/select/1.3.1/css/select.dataTables.css" />
  <link rel="stylesheet" href="https://cdn.datatables.net/responsive/2.2.5/css/responsive.dataTables.css" />
  <link rel="stylesheet" style="text/css" href="<?= base_url('deps/opt/bootstrap.css') ?>" />
  <link rel="stylesheet" style="text/css" href="<?= base_url('css/style.css') ?>" />
  <script src="https://kit.fontawesome.com/5af936ddc4.js" crossorigin="anonymous"></script>
  <script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/js/bootstrap.min.js"></script>
  <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">

  <meta name="csrf-token" content="<?= csrf_hash() ?>">
</head>
<body>

    <h1><?= esc($title) ?></h1>