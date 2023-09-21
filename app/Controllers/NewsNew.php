<?php

namespace App\Controllers;

use App\Models\NewsModel;
use App\Models\ColumnsModel;
use App\Models\CategoryModel;
use App\Models\DataModel;
use App\Models\MetaModel;
use CodeIgniter\Exceptions\PageNotFoundException;
use CodeIgniter\HTTP\URI;

class NewsNew extends BaseController
{
    protected $uri;

    public function __construct() {
        $this->db = \Config\Database::connect();

        $this->uri = service('uri');
    }

    public function index()
    {   
        $segment_value = $this->uri->getSegment(2);

        $model = model(NewsModel::class);
        $categoryModel = model(CategoryModel::class);
        $dataModel = model(DataModel::class);
        $metaModel = model(MetaModel::class);

        $data = [
            'userInput' => $segment_value,
            'dbData' => json_encode($this->getData($segment_value)),
            'title' => 'News archive',
            'metaAttributes' => json_encode($dataModel->getAttributes()),
            'metaSchema' => json_encode($metaModel->getSchema()),
            'dropdownValues' => json_encode($this->getDropdown()),
            'subDropdownValues' => json_encode($this->getSubDropdown()),
        ];

        return view('templates/header', $data)
            . view('news2/newsIndex')
            . view('templates/footer');
    }

    public function getData($table) {
        $data = $this->db->query("SELECT * from $table")->getResult();

        return $data;
    }   

    public function getDropdown() {
        $segment_value = $this->uri->getSegment(2);
        $dataModel = model(DataModel::class);

        $filteredArrays = array_filter($dataModel->getAttributes(), function ($item) use ($segment_value) {
            return isset($item['table_name']) && $item['table_name'] === $segment_value && $item['form_part'] === 'Reference';
        });

        if (!empty($filteredArrays)) {

            $arrayOfDropDowns = [];

            forEach($filteredArrays as $arr) {
                $referenceObject = json_decode($arr["attributes_json"])[0];

                if (property_exists($referenceObject, 'reference_parent_id')) {

                    $data = $this->db->query("SELECT $referenceObject->reference_id, $referenceObject->reference_value from $referenceObject->reference_table WHERE $referenceObject->reference_parent_id is NULL")->getResult();
        
                    $arrayOfDropDowns[] = [$referenceObject->reference_column => $data];
                } else {
                    $data = $this->db->query("SELECT $referenceObject->reference_id, $referenceObject->reference_value from $referenceObject->reference_table")->getResult();
        
                    $arrayOfDropDowns[] = [$referenceObject->reference_column => $data];
                    
                }  
           };  
           
           return $arrayOfDropDowns;
    } else {
        return null;
    }
}

    public function getSubDropdown() {
        $segment_value = $this->uri->getSegment(2);
        $dataModel = model(DataModel::class);

        $filteredArrays = array_filter($dataModel->getAttributes(), function ($item) use ($segment_value) {
            return isset($item['table_name']) && $item['table_name'] === $segment_value && $item['form_part'] === 'Reference';
        });

        if (!empty($filteredArrays)) {
            $arrayOfDropDowns = [];

            forEach($filteredArrays as $arr) {
                $referenceObject = json_decode($arr["attributes_json"])[0];

                if (property_exists($referenceObject, 'reference_parent_id')) {

                    $data = $this->db->query("SELECT $referenceObject->reference_id, $referenceObject->reference_parent_id, $referenceObject->reference_value from $referenceObject->reference_table WHERE $referenceObject->reference_parent_id is NOT NULL")->getResult();
        
                    $arrayOfDropDowns[] = [$referenceObject->reference_column => $data];
                } else {
                    $data = $this->db->query("SELECT $referenceObject->reference_id, $referenceObject->reference_value from $referenceObject->reference_table")->getResult();
        
                    $arrayOfDropDowns[] = [$referenceObject->reference_column => $data];
                    
                }  
           };  
           
           return $arrayOfDropDowns;
    } else {
        return null;
    }
}
}