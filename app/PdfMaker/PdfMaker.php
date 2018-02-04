<?php
/**
 * Author: John
 * Date: 2/1/2018
 * Time: 6:58 PM
 */

namespace App\PdfMaker;


interface PdfMaker
{
    public function create();

    public function setPdfLib($pdfLib);
}