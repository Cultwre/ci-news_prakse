<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

use App\Controllers\News;
use App\Controllers\Pages;
use App\Controllers\Form;

$routes->get('form', [Form::class, 'index']);

$routes->get('news', [News::class, 'index']);
$routes->get('news/getData', [News::class, 'getData']);
$routes->get('form/getMetaStructure', [Form::class, 'getMetaStructure']);
$routes->get('news/getCategories', [News::class, 'getCategories']);
$routes->get('news/getFiles', [News::class, 'getFiles']);
$routes->post('news/createNews', [News::class, 'createNews']);
$routes->post('form/createMeta', [Form::class, 'createMeta']);
$routes->post('form/editMeta', [Form::class, 'editMeta']);
$routes->post('form/cloneMeta', [Form::class, 'cloneMeta']);
$routes->get('news/new', [News::class, 'new']); 
$routes->post('news', [News::class, 'create']); 
$routes->get('news/(:segment)', [News::class, 'show']);
$routes->post('news/editNews', [News::class, 'editNews']);
$routes->post('news/deleteNews', [News::class, 'deleteNews']);
$routes->post('form/deleteMeta', [Form::class, 'deleteMeta']);
$routes->post('news/deleteMultipleNews', [News::class, 'deleteMultipleNews']);
$routes->get('news', [News::class, 'getMetaColumns']);
$routes->post('news/upload', [News::class, 'upload']);

$routes->get('pages', [Pages::class, 'index']);
$routes->get('(:segment)', [Pages::class, 'view']);


