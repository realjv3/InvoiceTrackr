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
use FPDF;
use Illuminate\Database\Eloquent\Collection;

class InvoiceMaker implements PdfMaker
{
    /**
     * @var Collection CustTrx[]
     */
    private $trxs;

    /**
     * @var FPDF - library that makes pdfs
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

        $this->pdfLib->AddPage();
        $this->pdfLib->SetFillColor(239, 240, 242);

        /**
         * Invoice header
         */
        $this->pdfLib->SetFont('Arial', '', 10);
        $this->pdfLib->Cell(40, 4, 'Invoice number: ' . $this->invoice->invno, 0, 3);
        $this->pdfLib->Cell(70, 4, 'Invoice Date: ' . $this->invoice->invdt, 0, 3);
        $this->pdfLib->Cell(70, 4, 'Due Date: ' . $this->invoice->duedt, 0, 3);
        $this->pdfLib->Ln();

        $this->pdfLib->SetFont('Arial', '', 14);
        $name = $this->userProfile->first . ' ' . $this->userProfile->last;
        $this->pdfLib->Cell(200, 8, $name, 0, 3);
        if ($this->userProfile->company != $name) {
            $this->pdfLib->Cell(200, 4, $this->userProfile->company, 0, 3);
        }

        $this->pdfLib->SetFont('Arial', '', 8);
        if (!empty($this->userProfile->addr1)) {
            $this->pdfLib->Cell(200, 4, $this->userProfile->addr1, 0, 3);
        }
        if (!empty($this->userProfile->addr2)) {
            $this->pdfLib->Cell(200, 4, $this->userProfile->addr2, 0, 3);
        }
        if (!empty($this->userProfile->city) || !empty($this->userProfile->state) || !empty($this->userProfile->zip)) {
            $this->pdfLib->Cell(200, 4, $this->userProfile->city . ', ' . $this->userProfile->state . ' ' . $this->userProfile->zip, 0, 3);
        }
        if (!empty($this->userProfile->office) && $this->userProfile->office != $this->userProfile->cell) {
            $this->pdfLib->Cell(200, 4, $this->userProfile->office, 0, 3);
        }
        if (!empty($this->userProfile->cell)) {
            $this->pdfLib->Cell(200, 4, $this->userProfile->cell, 0, 3);
        }
        $this->pdfLib->Cell(200, 4, $this->user->email, 0, 3);

        $this->pdfLib->SetFont('Arial', '', 14);
        $this->pdfLib->Cell(200, 8, 'Bill to:', 0, 3);

        $this->pdfLib->SetFont('Arial', '', 10);
        if ( ! empty($this->cust->first) && ! empty($this->cust->last)) {
            $this->pdfLib->Cell(200, 4, $this->cust->first . ' ' . $this->cust->last, 0, 3);
        }
        if ( ! empty($this->cust->company)) {
            $this->pdfLib->Cell(200, 4, $this->cust->company, 0, 3);
        }
        $this->pdfLib->SetFont('Arial', '', 8);
        if ( ! empty($this->custProfile->addr1)) {
            $this->pdfLib->Cell(200, 4, $this->custProfile->addr1, 0, 3);
        }
        if ( ! empty($this->custProfile->addr2)) {
            $this->pdfLib->Cell(200, 4, $this->custProfile->addr2, 0, 3);
        }
        if ( ! empty($this->custProfile->city) || ! empty($this->custProfile->state) || ! empty($this->custProfile->zip)) {
            $this->pdfLib->Cell(200, 4, $this->custProfile->city . ', ' . $this->custProfile->state . ' ' . $this->custProfile->zip, 0, 3);
        }
        if ( ! empty($this->cust->email)) {
            $this->pdfLib->Cell(200, 4, $this->cust->email, 0, 3);
        }
        /**
         * Invoice line items
         */
        $this->pdfLib->Ln();
        $this->pdfLib->SetFont('Arial', 'B', 10);
        $this->pdfLib->Cell(25, 10, 'Trx Date', 0, 0, 'L', true);
        $this->pdfLib->Cell(30, 10, 'Billable', 0, 0, 'L', true);
        $this->pdfLib->Cell(85, 10, 'Description', 0, 0, 'L', true);
        $this->pdfLib->Cell(35, 10, 'Quantity', 0, 0, 'L', true);
        $this->pdfLib->Cell(20, 10, 'Amount', 0, 0, 'C', true);
        $this->pdfLib->Ln();

        $this->pdfLib->SetFont('Arial', '', 10);
        $this->trxs->each(function ($trx, $i) {
            $billable = Billable::find($trx->item);
            $this->pdfLib->Cell(25, 8, $trx->trxdt);
            $this->pdfLib->Cell(30, 8, substr($billable->descr, 0, 20));
            $y = $this->pdfLib->GetY();
            $x = $this->pdfLib->GetX();
            $this->pdfLib->MultiCell(85, 8, $trx->descr);
            $lineBroke = ($this->pdfLib->GetY() != $y + 8) ? true : false;
            $this->pdfLib->SetXY($x + 85, $y);
            $this->pdfLib->Cell(35, 8, number_format($trx->amt / $billable->price, 2) . ' x $' . $billable->price . '/' . $billable->unit);
            $this->pdfLib->Cell(20, 8, '$' . $trx->amt, 0, 0, 'C');
            $this->pdfLib->Ln();
            if ($lineBroke) {
                $this->pdfLib->Ln();
            }
        });
        $this->pdfLib->SetFont('Arial', 'B', 12);
        $this->pdfLib->Ln();
        $this->pdfLib->Cell(80, 12, 'Total $' . $this->invoice->amt, 1);
        return $this->pdfLib->Output();
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