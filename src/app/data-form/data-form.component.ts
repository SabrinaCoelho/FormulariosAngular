import { ConsultaCepService } from './../shared/services/consulta-cep.service';
import { EstadoBr } from './../shared/models/estado-br';
import { DropdownService } from './../shared/services/dropdown.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: FormGroup;//1° maneira
  estados: EstadoBr[];
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient,
    private dropdownService: DropdownService,
    private cepService: ConsultaCepService) { }//2° maneira

  ngOnInit(): void {
    //1° maneira -> mais verboso
    /* this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    }); */

    //2° maneira -> forma menos verbosa do modo comentado adima
    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, [Validators.required]],
        numero: [null, [Validators.required]],
        complemento: [null],
        rua: [null, [Validators.required]],
        bairro: [null, [Validators.required]],
        cidade: [null, [Validators.required]],
        estado: [null, [Validators.required]]
      })
    });
    this.dropdownService.getEstadosBr()
    .subscribe((dados)=> {
      console.log(dados);
      this.estados = dados;
    },
    (error) => {
      console.log(error);
    })
  }

  onSubmit(){
    if(this.formulario.valid){
      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
        .subscribe((dados) => {
          //reset form
          console.log(this.formulario);
          this.resetar();
      },
      (error) => alert("Erro na submissão."));
    }
    else{
      console.log("Inválido.");
      this.verificaValidacoesForm(this.formulario);
    }
    
  }
  verificaValidacoesForm(formGroup: FormGroup){
    Object.keys(formGroup.controls).forEach(campo => {
      //console.log(campo);
      const controle = formGroup.get(campo);
      controle.markAsTouched();
      if(controle instanceof FormGroup){
        this.verificaValidacoesForm(controle);
      }
    })
    
  }

  resetar(){
    this.formulario.reset();
  }

  verificaValidTouched(campo: string){
    return !this.formulario.get(campo).valid && this.formulario.get(campo).touched;
  }
  verificaEmailValid(){
    let campoEmail = this.formulario.get('email');
    if(campoEmail.errors){
      //console.log(campoEmail.errors['email'] , campoEmail.touched);
      return campoEmail.errors['email'] && campoEmail.touched;
    }
    return false;
  }
  aplicaCssErro(campo: string){
    return {
      'is-invalid': this.verificaValidTouched(campo)
    }
  }

  consultaCEP(){
    let cep = this.formulario.get('endereco.cep').value;
    //cep = cep.replace(/\D/g, '');//filtra os numeros

    if(cep != null && cep !== ''){
      this.cepService.consultaCEP(cep)
        .subscribe(dados => this.populaDadosForm(dados));
    }
    
  }
  populaDadosForm(dados: any){

    this.formulario.patchValue({//seta valores campos especificos do form de uma vez
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

    this.formulario.get("nome").setValue("Dummy");//Exemplo de comportamento do setValue aqui no Data Driven
    /*no Data Driven o setValue tem um comportamento diferente e permite essa ação
    * (de setar um valor para apenas um) porque estamos acessando o diretamente controle (instancia de FormControl)
    */
  }
  resetaDadosForm(){
    this.formulario.patchValue({
      endereco: {
        complemento: null,
        rua: null,
        bairro: null,
        cidade: null,
        estado:null
      }
    });
  }
}
