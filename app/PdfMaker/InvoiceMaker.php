<?php
/**
 * Author: John
 * Date: 2/1/2018
 * Time: 7:02 PM
 */

namespace App\PdfMaker;

use App\Billable;
use App\Cust_profile;
use App\Customer;
use App\Invoice;
use App\Profile;
use App\User;
use Mpdf\Mpdf;
use Illuminate\Database\Eloquent\Collection;

class InvoiceMaker implements PdfMaker
{
    /**
     * @var Collection CustTrx[]
     */
    private $trxs;

    /**
     * @var Mpdf - library that makes pdfs
     */
    private $pdfLib;

    /**
     * @var User
     */
    private $user;

    /**
     * @var Customer
     */
    private $cust;

    /**
     * @var Profile
     */
    private $userProfile;

    /**
     * @var Cust_profile
     */
    private $custProfile;

    /**
     * @var Invoice
     */
    private $invoice;

    public function create() {

        $seller = $this->userProfile->first . ' ' . $this->userProfile->last;
        $title = ($this->userProfile->company == $seller) ? $this->userProfile->company : ' ' . $seller;
        $sellerAddr1 = empty($this->userProfile->addr1) ? '' : '<br />' . $this->userProfile->addr1;
        $sellerAddr2 = empty($this->userProfile->addr2) ? '' : '<br />' . $this->userProfile->addr2;
        $sellerCity = empty($this->userProfile->city) ? '<br />' : '<br />' . $this->userProfile->city;
        $sellerState = empty($this->userProfile->state) ? '' : $this->userProfile->state;
        $sellerZip = $this->userProfile->zip;
        $sellerCell = empty($this->userProfile->cell) ? '' : $this->userProfile->cell;
        $buyer = $this->cust->first . ' ' . $this->cust->last;
        $contact = $this->custProfile->cell . ' ' . $this->cust->email;
        $buyerCo = $this->cust->company;
        $addr1 = $this->custProfile->addr1;
        $addr2 = $this->custProfile->addr2;
        $city = $this->custProfile->city;
        $state = $this->custProfile->state;
        $zip = $this->custProfile->zip;
        $invno = $this->invoice->invno;
        $amt = number_format((float)$this->invoice->amt, 2, '.', '');
        $trxs = '';

        foreach ($this->trxs as $trx) {

            $billable = Billable::find($trx->item);
            $qty = number_format($trx->amt / $billable->price, 2)
                . ' x $' . $billable->price . '/' . $billable->unit;

            $trxs .= "<tr>
                    <td align=\"center\">$trx->trxdt</td>
                    <td align=\"center\">$billable->descr</td>
                    <td>$trx->descr</td>
                    <td class=\"cost\">$qty</td>
                    <td class=\"cost\">$trx->amt</td>
                </tr>";
        }

        $html = <<<EOD
<html>
<head>
    <style>
        body {font-family: sans-serif;
            font-size: 10pt;
        }
        p {	margin: 0pt; }
        table.items {
            border: 0.1mm solid #000000;
        }
        td { vertical-align: top; }
        .items td {
            border-left: 0.1mm solid #000000;
            border-right: 0.1mm solid #000000;
        }
        table thead td { background-color: #EEEEEE;
            text-align: center;
            border: 0.1mm solid #000000;
            font-variant: small-caps;
        }
        .items td.blanktotal {
            background-color: #EEEEEE;
            border: 0.1mm solid #000000;
            background-color: #FFFFFF;
            border: 0mm none #000000;
            border-top: 0.1mm solid #000000;
            border-right: 0.1mm solid #000000;
        }
        .items td.totals {
            text-align: right;
            border: 0.1mm solid #000000;
        }
        .items td.cost {
            text-align: center;
        }
    </style>
</head>
<body>

<!--mpdf
    <htmlpageheader name="myheader">
        <table width="100%">
            <tr>
                <td width="50%" style="color:#0000BB; ">
                    <span style="font-weight: bold; font-size: 14pt;">$title</span>
                    $sellerAddr1
                    $sellerAddr2
                    $sellerCity $sellerState $sellerZip
                    <br /><span style="font-family:dejavusanscondensed;">&#9742;</span> $sellerCell
                </td>
                <td width="50%" style="text-align: right;">
                    Invoice No.
                    <br /><span style="font-weight: bold; font-size: 12pt;">$invno</span>
                </td>
            </tr>
        </table>
    </htmlpageheader>
    
    <htmlpagefooter name="myfooter">
        <div style="border-top: 1px solid #000000; font-size: 9pt; text-align: center; padding-top: 3mm; ">
            Page {PAGENO} of {nb}
        </div>
    </htmlpagefooter>
    
    <sethtmlpageheader name="myheader" value="on" show-this-page="1" />
    <sethtmlpagefooter name="myfooter" value="on" />
    mpdf-->
    
    <table width="100%" style="font-family: serif;" cellpadding="10">
        <tr>
            <td width="45%" style="border: 0.1mm solid #888888; ">
                <span style="font-size: 7pt; color: #555555; font-family: sans;">To:</span>
                <br />$buyer
                <br />$buyerCo
                <br /><br />$addr1
                <br />$addr2
                <br />$city, $state $zip
                <br />$contact
            </td>
        </tr>
    </table>
        
    <br />
    
    <table class="items" width="100%" style="font-size: 9pt; border-collapse: collapse; " cellpadding="8">
        <thead>
            <tr>
            <td width="15%">Trx Date</td>
            <td width="10%">Billable</td>
            <td width="45%">Description</td>
            <td width="15%">Quantity</td>
            <td width="15%">Amount</td>
            </tr>
        </thead>
        
        <tbody>
        <!-- ITEMS HERE -->
        $trxs
        <!-- END ITEMS HERE -->
        <tr>
        <td class="blanktotal" colspan="3" rowspan="6"></td>
        <td class="totals">Subtotal:</td>
        <td class="totals cost">$$amt</td>
        </tr>
        
        <tr>
        <td class="totals">Tax:</td>
        <td class="totals cost">$0.00</td>
        </tr>
        
        <tr>
        <td class="totals"><b>TOTAL:</b></td>
        <td class="totals cost"><b>$$amt</b></td>
        </tr>
        
        <tr>
        <td class="totals">Deposit:</td>
        <td class="totals cost">$0.00</td>
        </tr>
        
        <tr>
        <td class="totals"><b>Balance due:</b></td>
        <td class="totals cost"><b>$$amt</b></td>
        </tr>
        </tbody>
    </table>
    
    <div style="text-align: center; font-style: italic;">Payment terms: payment due in 30 days</div>
</body>
</html>
EOD;
        $mpdf = $this->pdfLib;

        $mpdf->SetProtection(['print']);
        $mpdf->SetTitle("$title - Invoice");
        $mpdf->SetAuthor("$title");
        $mpdf->SetWatermarkText("Paid");
//        $mpdf->showWatermarkText = true;
        $mpdf->watermark_font = 'DejaVuSansCondensed';
        $mpdf->watermarkTextAlpha = 0.1;
        $mpdf->SetDisplayMode('fullpage');

        $mpdf->WriteHTML($html);

        return $mpdf->Output();
    }

    /**
     * @param mixed $pdfLib
     * @return InvoiceMaker
     */
    public function setPdfLib($pdfLib) : InvoiceMaker {
        $this->pdfLib = $pdfLib;
        return $this;
    }

    /**
     * @param Collection $trxs
     * @return InvoiceMaker
     */
    public function setTrxs(Collection $trxs) : InvoiceMaker {
        $this->trxs = $trxs;
        $custId = $trxs->toArray()[0]['custid'];
        $this->setCust(Customer::find($custId))
            ->setCustProfile(Cust_profile::find($custId))
            ->setUser(User::find($this->cust->user_id))
            ->setUserProfile(Profile::find($this->user->id));
        return $this;
    }

    /**
     * @param User $user
     * @return InvoiceMaker
     */
    public function setUser(User $user) : InvoiceMaker {
        $this->user = $user;
        return $this;
    }

    /**
     * @param Customer $cust
     * @return InvoiceMaker
     */
    private function setCust(Customer $cust) : InvoiceMaker {
        $this->cust = $cust;
        return $this;
    }

    /**
     * @param Profile $userProfile
     * @return InvoiceMaker
     */
    private function setUserProfile(Profile $userProfile) : InvoiceMaker {
        $this->userProfile = $userProfile;
        return $this;
    }

    /**
     * @param Cust_profile $custProfile
     * @return InvoiceMaker
     */
    private function setCustProfile(Cust_profile $custProfile) : InvoiceMaker {
        $this->custProfile = $custProfile;
        return $this;
    }

    /**
     * @param Invoice $invoice
     * @return InvoiceMaker
     */
    public function setInvoice(Invoice $invoice) : InvoiceMaker {
        $this->invoice = $invoice;
        return $this;
    }


}