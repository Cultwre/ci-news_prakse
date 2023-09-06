<?php

namespace App\Models;

use CodeIgniter\Model;

class CategoryModel extends Model
{
    protected $table = 'news_category';
    protected $allowedFields = ['id', 'news_category'];

    public function getCategory()
    {
            return $this->findAll();
    }
}

