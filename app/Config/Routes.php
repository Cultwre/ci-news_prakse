<?php

use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

use App\Controllers\News;
use App\Controllers\Pages;

$routes->get('news', [News::class, 'index']);
$routes->get('news/getData', [News::class, 'getData']);
$routes->post('news/createNews', [News::class, 'createNews']);
$routes->get('news/new', [News::class, 'new']); 
$routes->post('news', [News::class, 'create']); 
$routes->get('news/(:segment)', [News::class, 'show']);
$routes->post('news/editNews', [News::class, 'editNews']);
$routes->post('news/deleteNews', [News::class, 'deleteNews']);
$routes->get('news', [News::class, 'getMetaColumns']);

$routes->get('pages', [Pages::class, 'index']);
$routes->get('(:segment)', [Pages::class, 'view']);
