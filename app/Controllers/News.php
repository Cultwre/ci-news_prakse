<?php

namespace App\Controllers;

use App\Models\NewsModel;
use App\Models\ColumnsModel;
use App\Models\CategoryModel;
use CodeIgniter\Exceptions\PageNotFoundException;

class News extends BaseController
{
    public function index()
    {
        $model = model(NewsModel::class);

        $data = [
            'news'  => $model->getNews(),
            'title' => 'News archive',
            'columnsMeta' => $this->getMetaColumns("news"),
            'categoryData' => $this->getCategories(),
            'newsData' => json_encode($model->getNews()),
        ];

        return view('templates/header', $data)
            . view('news/index')
            . view('templates/footer');
    }

    public function show($slug = null)
    {
        $model = model(NewsModel::class);

        $data['news'] = $model->getNews($slug);

        if (empty($data['news'])) {
            throw new PageNotFoundException('Cannot find the news item: ' . $slug);
        }

        $data['title'] = $data['news']['title'];

        return view('templates/header', $data)
            . view('news/view')
            . view('templates/footer');
    }

    public function new()
    {
        helper('form');

        return view('templates/header', ['title' => 'Create a news item'])
            . view('news/create')
            . view('templates/footer');
    }

    public function create()
    {
        helper('form');

        // Checks whether the submitted data passed the validation rules.
        if (! $this->validate([
            'title' => 'required|max_length[255]|min_length[3]',
            'body'  => 'required|max_length[5000]|min_length[10]',
        ])) {
            // The validation fails, so returns the form.
            return $this->new();
        }

        // Gets the validated data.
        $post = $this->validator->getValidated();

        $model = model(NewsModel::class);

        $model->save([
            'title' => $post['title'],
            'slug'  => url_title($post['title'], '-', true),
            'body'  => $post['body'],
            'category_id'  => $post['category_id'],
            'subcategory_id' => $data['subcategory_id'],
        ]);

        return view('templates/header', ['title' => 'Create a news item'])
            . view('news/success')
            . view('templates/footer');
    }

    public function getData()
    {
        //gets the model
        $model = model(NewsModel::class);

        //gets the data from the database
        $data = $model->getNews();

        //returns the data in json
        return json_encode($data);
    }
    
    public function createNews()
    {
        $data = $_POST['rowdata'];

        $model = model(NewsModel::class);

        $model->save([
            'title' => $data['title'],
            'slug'  => url_title($data['title'], '-', true),
            'body'  => $data['body'],
            'category_id' => $data['category_id'],
            'subcategory_id' => $data['subcategory_id'],
        ]);
    }

    public function editNews()
    {
        $data = $_POST['rowdata'];

        $model = model(NewsModel::class);

        $updatedData = [
            'title' => $data['title'],
            'slug'  => url_title($data['title'], '-', true),
            'body'  => $data['body'],
            'category_id'  => $data['category_id'],
            'subcategory_id' => $data['subcategory_id'],
        ];

        $model->update($data['id'], $updatedData);
    }

    public function deleteNews()
    {
        $data = $_POST['rowdata'];

        $model = model(NewsModel::class);

        $model->delete($data['id']);
    }

    public function deleteMultipleNews()
    {
        $data = $_POST['rowdata'];

        $model = model(NewsModel::class);

        $model->whereIn('id', $data['id']);

        $model->delete();
    }

    public function getMetaColumns($metaTableName){

        $model = model(ColumnsModel::class);

        $data = $model->getMeta($metaTableName);

        foreach($data as &$e){
            unset($e['id']);
            unset($e['meta_table_name']);
            unset($e['reference_table_name']);
            unset($e['reference_column_name']);
            unset($e['reference_value']);
        }

        return json_encode($data);
    }

    public function getCategories() {
        $model = model(CategoryModel::class);

        $data = $model->getCategory();

        return json_encode($data);
    }
}