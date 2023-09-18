<?php

namespace App\Controllers;

use App\Models\MetaModel;
use CodeIgniter\Exceptions\PageNotFoundException; // Add this line

class Form extends BaseController
{
    public function index(): string
    {   
        $form = 'Form builder';
        $data['title'] = ucfirst($form);

        $model = model(MetaModel::class);

        $data = [
            'title' => ucfirst($form),
            'metaData' => json_encode($model->getSchema()),
        ];

        return view('templates/header', $data)
            . view('forms/jsonform')
            . view('templates/footer');
    }

    public function getMetaStructure()
    {
        //gets the model
        $model = model(MetaModel::class);

        //gets the data from the database
        $data = $model->getSchema();

        //returns the data in json
        return $data;
    }

    public function createMeta()
    {   
        $data = $_POST['rowdata'];

        $model = model(MetaModel::class);

        $model->save([
            'schema_name' => $data['schema_name'],
            'json_schema'  => $data['json_schema'],
        ]);
    }

    public function editMeta()
    {   
        $data = $_POST['rowdata'];

        $model = model(MetaModel::class);

        $updatedData = [
            'schema_name' => $data['schema_name'],
            'json_schema'  => $data['json_schema'],
        ];

        $model->update($data['id'], $updatedData);
    }

    public function deleteMeta()
    {
        $data = $_POST['rowdata'];

        $model = model(MetaModel::class);

        $model->delete($data['id']);
    }

    public function cloneMeta()
    {
        $data = $_POST['rowdata'];

        $model = model(MetaModel::class);

        $model->save([
            'schema_name' => $data['schema_name'],
            'json_schema'  => $data['json_schema'],
        ]);
    }
}