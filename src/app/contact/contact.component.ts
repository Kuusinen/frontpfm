import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ContactService } from '../service/contact.service';
import Swal from 'sweetalert2';
import { Email } from '../model/email';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent implements OnInit {

  formData: FormGroup;

  overlay: boolean = false;

  private productInvolve: String = "";

  nameProduct: String = "";

  constructor(private formBuilder: FormBuilder, private contact: ContactService, private route: ActivatedRoute) {
    this.formData = this.formBuilder.group({
      EmailAddress: ['', [Validators.compose([Validators.required, Validators.email])]],
      Body: ['', [Validators.required]],
      Name: [''],
      FirstName: ['']
    })

    const pathProduct = this.route.snapshot.paramMap.get('pathProduct');
    const nameProduct = this.route.snapshot.paramMap.get('nameProduct');

    if (pathProduct != null && pathProduct.length != 0 && nameProduct != null && nameProduct.length != 0) {
      this.nameProduct = nameProduct;
      this.productInvolve = "produit concerné : <a href=" + pathProduct + ">" + nameProduct + "</a> <br/><br/>"
    } else {
      this.nameProduct = "";
      this.productInvolve = "";
    }
  }

  ngOnInit(): void {
  }

  onSubmit(formValue: FormGroup) {
    const email: Email = new Email();
    email.adresses = formValue.get("EmailAddress")?.value;
    email.body = "Message envoyé par : " + formValue.get("Name")?.value + " " + formValue.get("FirstName")?.value + "<br/> Adresse mail : " + formValue.get("EmailAddress")?.value + "<br/><br/>";

    if (this.productInvolve.length != 0) {
      email.body = email.body + this.productInvolve;
    }

    email.body = email.body + formValue.get("Body")?.value;


    this.overlay = true;
    this.contact.sendEmail(email).subscribe({
      next: response => {
        this.overlay = false;
        if (response.ok) {
          Swal.fire({ title: 'Message envoyé', html: "Le message a été envoyé avec succès, à la créatrice!", icon: 'success', confirmButtonColor: "rgb(194, 208, 185)", color: "rgb(255, 255, 255)", background: "rgb(156, 153, 144)" });
        } else {
          Swal.fire({ title: "Impossible d'envoyer le message", html: "Une erreur est survenue. Impossible d'envoyer le message à la créatrice. Veuillez réessayer", icon: 'error', confirmButtonColor: "rgb(194, 208, 185)", color: "rgb(255, 255, 255)", background: "rgb(156, 153, 144)" });
        }
      },
      error: err =>  {
        this.overlay = false;
        Swal.fire({ title: "Impossible d'envoyer le message", html: "Une erreur est survenue. Impossible d'envoyer le message à la créatrice. Veuillez réessayer", icon: 'error', confirmButtonColor: "rgb(194, 208, 185)", color: "rgb(255, 255, 255)", background: "rgb(156, 153, 144)" });
      },
    })
  }
}
