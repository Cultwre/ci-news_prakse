<?php

namespace App\Controllers;

use App\Models\DataModel;
use App\Models\MetaModel;
use CodeIgniter\Exceptions\PageNotFoundException; // Add this line

class Attributes extends BaseController
{
    public function index(): string
    {   
        $form = 'Attributes Filler';
        $data['title'] = ucfirst($form);

        $model = model(DataModel::class);
        $modelMeta = model(MetaModel::class);

        $data = [
            'title' => ucfirst($form),
            'attributesData' => json_encode($model->getAttributes()),
            'metaValue' => json_encode($modelMeta->getSchema()),
        ];

        return view('templates/header', $data)
            . view('forms/jsonAttributes')
            . view('templates/footer');
    }

    public function createColumn()
    {   
        $data = $_POST['rowdata'];

        $model = model(DataModel::class);

        $model->save([
            'table_name' => $data['table_name'],
            'column_name'  => $data['column_name'],
            'attributes_json'  => $data['attributes_json'],
            'schema_id'  => $data['schema_id'],
        ]);
    }

    public function editColumn()
    {   
        $data = $_POST['rowdata'];

        $model = model(DataModel::class);

        $updatedData = [
            'table_name' => $data['table_name'],
            'column_name'  => $data['column_name'],
            'attributes_json'  => $data['attributes_json'],
            'schema_id'  => $data['schema_id'],
        ];

        $model->update($data['id'], $updatedData);
    }

    public function deleteColumn()
    {
        $data = $_POST['rowdata'];

        $model = model(DataModel::class);

        $model->delete($data['id']);
    }

    public function cloneColumn()
    {
        $data = $_POST['rowdata'];

        $model = model(DataModel::class);

        $model->save([
            'table_name' => $data['table_name'],
            'column_name'  => $data['column_name'],
            'attributes_json'  => $data['attributes_json'],
            'schema_id'  => $data['schema_id'],
        ]);
    }
}