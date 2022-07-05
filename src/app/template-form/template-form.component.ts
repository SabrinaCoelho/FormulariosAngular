import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

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
  constructor(private http: HttpClient) { }

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
  consultaCEP(cep: any){
    var cep = cep.value.replace(/\D/g, '');
    var validaCep = /^[0-9]{8}$/;
    
    if(validaCep.test(cep)){
      this.http.get<JSON>(`//viacep.com.br/ws/${cep}/json/`)
      .subscribe(dados => console.log(dados));
    }
  }
}
