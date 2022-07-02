import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {
  usuario: any = {
    nome: "Dummy J",
    email: "dummy@email.com"
  }
  constructor() { }

  ngOnInit(): void {
  }
  onSubmit(form: any):void{
    console.log(form);
    //console.log(this.usuario);
  }
  verificaValidTouched(campo: any){
    return !campo.valid && campo.touched;
  }
  aplicaCssErro(campo: any){
    return {
      'is-invalid': this.verificaValidTouched(campo)
    }
  }
}
