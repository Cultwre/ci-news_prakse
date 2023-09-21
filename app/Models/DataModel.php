<?php

namespace App\Models;

use CodeIgniter\Model;

class DataModel extends Model
{
    protected $table = 'attributes_schema';
    protected $allowedFields = ['id', 'table_name', 'column_name','show_in_list', 'form_part', 'attributes_json', 'schema_id'];

    public function getAttributes()
    {
        return $this->findAll();
    }
}