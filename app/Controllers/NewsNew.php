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

                if (property_exists($referenceObject, 'reference_parent_id') && property_exists($referenceObject, 'reference_subcolumn')) {

                    $data = $this->db->query("SELECT $referenceObject->reference_id, $referenceObject->reference_parent_id, $referenceObject->reference_value from $referenceObject->reference_table WHERE $referenceObject->reference_parent_id is NOT NULL")->getResult();
        
                    $arrayOfDropDowns[] = [$referenceObject->reference_subcolumn => $data];
                } else {

                    return null;
                    
                }  
           };  
           
           return $arrayOfDropDowns;
    } else {
        return null;
    }
}

public function createRecord()
    {   

        $segment_value = $this->uri->getSegment(2);

        $data = $_POST['rowdata'];

        $columns = implode(', ', array_keys($data));
        $values = implode("', '", $data);

        $sql = "INSERT INTO $segment_value ($columns) VALUES ('$values')";

        $query = $this->db->query($sql);
    }

    public function createFilesRecord()
    {   
        $segment_value = $this->uri->getSegment(2);

        $fileData = [];

        if($files = $this->request->getFiles('files')){
        foreach ($files["files"] as $file) {
            
            if($file->isValid() && !$file->hasMoved()) {
                $newName = $file->getRandomName();
                $file->move(FCPATH.'uploads',$newName);

                $filePath = base_url('uploads/' . $newName);

                $fileInfo = [
                    'file_clientName' => $file->getClientName(),
                    'file_name' => $newName,
                    'file_url' => $filePath, 
                ];

                $fileData[] = $fileInfo;

            } else {
                log_message('error', $file->getErrorString());
            }
        }
    }

        $jsonData = $_POST['rowdata'];

        $data = json_decode($jsonData);

        $fileColumn = $data->column_files;
        unset($data->column_files);

        $data->{$fileColumn} = $fileData;

        $jsonDataEncoded = json_encode($data->{$fileColumn});

        $data->{$fileColumn} = $jsonDataEncoded;

        $dataArray = (array)$data;

        $columns = implode(', ', array_keys($dataArray));
        $values = implode("', '", $dataArray);

        $sql = "INSERT INTO $segment_value ($columns) VALUES ('$values')";

        $query = $this->db->query($sql);
    }

    public function editFilesRecord()
    {

        $segment_value = $this->uri->getSegment(2);

        $fileData = [];

        if($files = $this->request->getFiles('files')){
        foreach ($files["files"] as $file) {
            
            if($file->isValid() && !$file->hasMoved()) {
                $newName = $file->getRandomName();
                $file->move(FCPATH.'uploads',$newName);

                $filePath = base_url('uploads/' . $newName);

                $fileInfo = [
                    'file_clientName' => $file->getClientName(),
                    'file_name' => $newName,
                    'file_url' => $filePath, 
                ];

                $fileData[] = $fileInfo;

            } else {
                log_message('error', $file->getErrorString());
            }
        }
    }

        $jsonData = $_POST['rowdata'];

        $data = json_decode($jsonData);

        $fileColumn = $data->column_files;
        unset($data->column_files);

        $data->{$fileColumn} = $fileData;

        $folderPath = FCPATH.'uploads/';
        
        if(property_exists($data, 'old_files')) {
        foreach($data->old_files as $file) {
            if (file_exists($folderPath . $file->file_name)) {
                unlink($folderPath . $file->file_name);
            }
        };
    };
    if(property_exists($data, 'saved_files')) {
        foreach ($data->{$fileColumn} as $array) {
            $newObject = (object)$array;
            
            $data->saved_files[] = $newObject;
        }
        
        $jsonDataEncoded = json_encode($data->saved_files);

        $data->{$fileColumn} = $jsonDataEncoded;

        $dataArray = (array)$data;

        unset($dataArray["saved_files"]);
        unset($dataArray["old_files"]);

        $id = $dataArray['id'];
        unset($dataArray['id']);

        $sql = "UPDATE $segment_value SET ";
        $updates = [];
        foreach ($dataArray as $column => $value) {
            $updates[] = "$column = " . $this->db->escape($value);
        }
        $sql .= implode(', ', $updates);
        $sql .= " WHERE id = " . $this->db->escape($id);
        
        $this->db->query($sql);
    } else {
        $jsonDataEncoded = json_encode($data->{$fileColumn});

        $data->{$fileColumn} = $jsonDataEncoded;

        $dataArray = (array)$data;

        unset($dataArray["saved_files"]);
        unset($dataArray["old_files"]);

        $id = $dataArray['id'];
        unset($dataArray['id']);

        $sql = "UPDATE $segment_value SET ";
        $updates = [];
        foreach ($dataArray as $column => $value) {
            $updates[] = "$column = " . $this->db->escape($value);
        }
        $sql .= implode(', ', $updates);
        $sql .= " WHERE id = " . $this->db->escape($id);
        
        $this->db->query($sql);
    }  
    }

    public function editRecord()
    {   

        $segment_value = $this->uri->getSegment(2);

        $data = $_POST['rowdata'];

        $id = $data['id'];
        unset($data['id']);

        $sql = "UPDATE $segment_value SET ";
        $updates = [];
        foreach ($data as $column => $value) {
            $updates[] = "$column = " . $this->db->escape($value);
        }
        $sql .= implode(', ', $updates);
        $sql .= " WHERE id = " . $this->db->escape($id);
        
        $this->db->query($sql);
    }

    public function deleteRecord()
    {

        $segment_value = $this->uri->getSegment(2);
        $data = $_POST['rowdata'];

        $folderPath = FCPATH.'uploads/';

        if(isset($data['file_names'])) {
            foreach($data['file_names'] as $file) {
                if (file_exists($folderPath . $file)) {
                    unlink($folderPath . $file);
                }
            };
        };

        $sql = "DELETE FROM $segment_value WHERE id = " . $data['id'];
        $this->db->query($sql);
    }

    public function deleteMultipleRecords()
    {   
        $segment_value = $this->uri->getSegment(2);
        $data = $_POST['rowdata'];

        $folderPath = FCPATH.'uploads/';
        
        if(isset($data['file_names'])) {
            foreach($data['file_names'] as $file) {
                if (file_exists($folderPath . $file)) {
                    unlink($folderPath . $file);
                }
            };
        };

        if (!empty($data['id']) && is_array($data['id'])) {
            $idList = implode(',', $data['id']);

            $sql = "DELETE FROM $segment_value WHERE id IN ($idList)";
            $this->db->query($sql);
    }

}
}