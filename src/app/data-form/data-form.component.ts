import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

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
      nome: [null],
      email: [null]
    });
  }

  onSubmit(){
    console.log(this.formulario);
    this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
    .subscribe((dados) => {
      //reset form
      this.resetar();
    },
    (error) => alert("Erro na submissão."));
  }

  resetar(){
    this.formulario.reset();
  }

}
