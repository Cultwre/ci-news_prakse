<?php

namespace App\Models;

use CodeIgniter\Model;

class MetaModel extends Model
{
    protected $table = 'meta_schema';
    protected $allowedFields = ['id', 'schema_name', 'json_schema'];

    public function getSchema()
    {
        return $this->findAll();
    }
}