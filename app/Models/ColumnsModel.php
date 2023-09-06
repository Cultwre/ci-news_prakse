<?php

namespace App\Models;

use CodeIgniter\Model;

class ColumnsModel extends Model
{
    protected $table = 'column_defs_meta';
    protected $allowedFields = ['meta_table_name', 'meta_column_name','meta_title', 'meta_type', 'meta_required'];

    public function getMeta($metaTableName = false)
    {
        if ($metaTableName === false) {
            return $this->findAll();
        }

        return $this->where(['meta_table_name' => $metaTableName])->findAll();
    }
}

