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
    nome: null,
    email: null
  }
  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }
  onSubmit(formulario: any):void{
    console.log(formulario);
    this.http.post('https://httpbin.org/post', JSON.stringify(formulario.value))
    .subscribe(dados => {
      console.log(dados);
      formulario.form.reset();
    },
    (error) => alert("Erro na submissão."));
  }
  verificaValidTouched(campo: any){
    return !campo.valid && campo.touched;
  }
  aplicaCssErro(campo: any){
    return {
      'is-invalid': this.verificaValidTouched(campo)
    }
  }
  consultaCEP(cep: any, form: any){
    var cep = cep.value.replace(/\D/g, '');//filtra os numeros
    var validaCep = /^[0-9]{8}$/;//expressao regular para validar o cep
    
    if(validaCep.test(cep)){
      this.resetaDadosForm(form);

      this.http.get<JSON>(`//viacep.com.br/ws/${cep}/json/`)
      .subscribe(dados => this.populaDadosForm(dados,form));
    }
  }
  populaDadosForm(dados: any, formulario: any){
    /*seta valores para todos os campos do form
    * formulario é uma instancia do NgForm e o setValue é um método deste
    */
    /* formulario.setValue({
      nome: formulario.value.nome,
      email: formulario.value.email,
      endereco: {
        cep: dados.cep,
        numero: "",
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    }); */

    /*
    * Abaixo, seta valores em campos especificos do form.
    * Acessamos a propriedade "form" (instancia de FormGroup) e esta tem o método patchValue
    */
    formulario.form.patchValue({
      endereco: {
        cep: dados.cep,
        numero: "",
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf
      }
    });
  }
  resetaDadosForm(formulario: any){
    formulario.form.patchValue({
      endereco: {
        complemento: null,
        rua: null,
        bairro: null,
        cidade: null,
        estado:null
      }
    });
  }

  resetar(formulario: any){
    formulario.reset();
  }
}
