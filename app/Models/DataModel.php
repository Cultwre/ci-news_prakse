<?php

namespace App\Models;

use CodeIgniter\Model;

class DataModel extends Model
{
    protected $table = 'attributes_schema';
    protected $allowedFields = ['id', 'table_name', 'column_name', 'attributes_json', 'schema_id'];

    public function getAttributes()
    {
        return $this->findAll();
    }
}