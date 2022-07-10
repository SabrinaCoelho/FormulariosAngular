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
  
  constructor(
    private formBuilder: FormBuilder,
    private http: HttpClient) { }//2° maneira

  ngOnInit(): void {
    //1° maneira -> mais verboso
    /* this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null)
    }); */

    //2° maneira -> forma menos verbosa do modo comentado adima
    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3)]],
      email: [null, [Validators.required, Validators.email]]
    });
  }

  onSubmit(){
    console.log(this.formulario);
    this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
    .subscribe((dados) => {
      //reset form
      console.log(this.formulario);
      //this.resetar();
    },
    (error) => alert("Erro na submissão."));
  }

  resetar(){
    this.formulario.reset();
  }

  verificaValidTouched(campo: any){
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
  aplicaCssErro(campo: any){
    return {
      'is-invalid': this.verificaValidTouched(campo)
    }
  }
}
