import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import React, { Component } from 'react';
import '../css/Formulario.css';
import axios from 'axios';
import Cookies from 'universal-cookie';
import swal from 'sweetalert';
import ExportExcel from 'react-export-excel-fixed-xlsx';
import Jquery from 'jquery';

const url = 'https://localhost:5001/api/Personas/Get/';
const cookies = new Cookies();
const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelColumn;

class Formulario extends Component{

  state ={
    data: [],
    error : {},
    campo : {},
    enviado: false,
    valBtn: false,
    busqueda: '',
    modalInsertar: false,
    modalEditar: false,
    modalEliminar: false,
    tipomodal: '',
    array: {
      id_persona: 0, 
      Nombres: '',
      Cédula: 0,
      Dirección: '',
      Teléfono: '',
      fecha_registro: '',
    }
  }
    
  Getpeticion=()=>{
    axios.get(url+'0')
    .then(response => {
      this.setState({data: response.data});
    })
  }

  mostrarAlerta=()=>{
    swal({
        title:"Datos guardados correctamente",
        text:`Datos correctos del Sr(a) ${[this.state.array.Nombres]}`,
        icon: "success",
        timer: "10000"
    });
  }

  mostrarAlertaX=()=>{
    swal({
        title:"Datos incorrectos",
        text:"Intentelo de nuevo, los datos en los campos son incorrectos",
        icon: "warning",
        button: "Regresar",
        timer: "10000"
    });
  }
    
  submitHandler = async e =>{
    try{
      let guardar ={
        method: 'POST',
          headers: {
              'Accept': 'application/json',
              'Content-Type':'application/json'
          },
          body: JSON.stringify({
            Nombres: this.state.array.Nombres,
            Cédula: parseInt(this.state.array.Cédula),
            Dirección: this.state.array.Dirección,
            Teléfono: this.state.array.Teléfono,
            fecha_registro: this.state.array.fecha_registro
          })
      };
      let res = await fetch('https://localhost:5001/api/Personas/Post/', guardar)
      let json = res.json();
      this.modalInsertar();
      //
      this.camposPost();
      this.validarCampos();
    }catch{
      console.error();
    }
  }

  camposPost = ()=>{
    if(!this.state.array.Nombres || !this.state.array.Cédula || 
      !this.state.array.Dirección || !this.state.array.Teléfono || !this.state.array.fecha_registro){
      this.mostrarAlertaX();
      this.modalInsertar();
    }else{
      this.mostrarAlerta();
      this.Getpeticion();
    }
  }

  camposPut = ()=>{
    if(!this.state.array.Nombres || !this.state.array.Cédula || 
      !this.state.array.Dirección || !this.state.array.Teléfono || !this.state.array.fecha_registro){
      this.mostrarAlertaX();
      this.modalEditar();
    }else{
      this.mostrarAlerta();
      this.Getpeticion();
    }
  }
    
  Putpeticion=()=>{
    axios.put('https://localhost:5001/api/Personas/Put/'+this.state.array.id_persona, this.state.array)
    .then(response=> {
      this.modalEditar();
      this.camposPut();
      this.validarCampos()
    }).catch(error =>{
      console.log(error);
    })
  }
    
  Deletepeticion=()=>{
    axios.delete('https://localhost:5001/api/Personas/Delete/'+this.state.array.id_persona)
    .then(response=>{
      this.setState({modalEliminar: false});
      this.Getpeticion();
    }).catch(error =>{
    console.log(error);
    })
  }
    
  modalInsertar=() =>{
    this.setState({modalInsertar: !this.state.modalInsertar});
  }

  modalEditar=() =>{
    this.setState({modalEditar: !this.state.modalEditar});
  }

  componentDidMount=()=>{
    this.Getpeticion();
  }

  filtro=()=>{
    var search = Array.from(this.state.data).filter(item =>{
      if(item.nombres.toLowerCase().includes(this.state.busqueda) || 
        item.dirección.toLowerCase().includes(this.state.busqueda)){
        return item
      }
    });
    this.setState({data: search});
    console.log(search);
  }
    
  onChange = async e =>{
    e.persist();
    await this.setState({busqueda: e.target.value});
    this.filtro();
    console.log(this.state.busqueda);
  }
      
  handleChange= async e =>{
    e.persist();
    await this.setState({
      array:{
        ...this.state.array,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.array);
  }

  validarCampos =()=>{
    let campo = this.state.campo;
    let error ={};
    let formuVali = true;

    if(!campo["Nombres"]){
      formuVali = false;
      error["Nombres"] = "Por favor, ingrese los Nombres completos";
    }

    if(!campo["Cédula"]){
      formuVali = false;
      error["Cédula"] = "Por favor, ingrese el número de cédula";
    }

    if(!campo["Dirección"]){
      formuVali = false;
      error["Dirección"] = "Por favor, ingrese la Dirección";
    }

    if(!campo["Teléfono"]){
      formuVali = false;
      error["Teléfono"] = "Por favor, ingrese el número de Teléfono";
    }

    if(!campo["fecha_registro"]){
      formuVali = false;
      error["fecha_registro"] = "Por favor, ingrese la Fecha";
    }

    this.setState({
      error : error
    });
    return formuVali;
  }
  
  envFormu = (e)=>{
    e.preventDefault();
    if(this.validarCampos()){
      this.setState({
        enviado: true
      });
      return this.mensaEnvi();
    }
  }

  resetCampos =()=>{
    this.setState({
      array: {
        Nombres: '',
        Cédula: '',
        Dirección: '',
        Teléfono: ''
      }
    });
  }

  resetCamposE=()=>{
    this.setState({
      error: ''
    })
  }

  mensaEnvi = (state)=>{
    const enviado = this.state.enviado;
    if(enviado === true){
      return {
        __html : '<div class="alert alert-success mt-3" role="alert"> Mensaje Correcto </div>'
      };
    }
  }

  deteCambio = (cam, e)=>{
    let campo = this.state.campo;
    campo[cam] = e.target.value;
    this.setState({
      campo
    });
  }

  seleccionOp=(g)=>{
    this.setState({
      modalEditar: true,
      array: {
        id_persona: g.id_persona, 
        Nombres: g.nombres,
        Cédula: parseInt(g.cédula),
        Dirección: g.dirección,
        Teléfono: g.teléfono,
        fecha_registro: g.fecha_registro.split('T')[0]
      }
    });
  }

  cerrarSesion=()=>{
    cookies.remove('id_usua', {path: "/"});
    cookies.remove('usua_nombre', {path: "/"});
    window.location.href="./";
  }

  validarBtn=()=>{
    if(cookies.get('id_rol') === '1'){
      this.modalInsertar();
    }else{
    }
  }

  modalSector = ()=>{
    window.location.href="./tablaSector";
    /*<ExcelFile element={<button type="submit" className="btn btn-success">Excel</button>} filename="Export-Excel" fileExtension="xlsxs">
        <ExcelSheet data={this.state.data} name="Citas">
          <ExcelColumn label="id_persona" value="id_persona"/>
          <ExcelColumn label="Nombres" value="nombres"/>
          <ExcelColumn label="Dirección" value="dirección"/>
          <ExcelColumn label="Fecha y Hora" value="fecha_registro"/>
        </ExcelSheet>
    </ExcelFile>*/
  }

  render(){
    const {array}= this.state;
    /*console.log('id_usua: '+ cookies.get('id_usua'));
    console.log('usua_nombre: '+ cookies.get('usua_nombre'));
    console.log('id_rol: '+ cookies.get('id_rol'));*/
    return(
      <div className="Routes">
        <br></br>
        <div className="container-buttons">
        <button type="button" className= "btn btn-success float-left" onClick={()=>{this.validarBtn(); this.resetCampos()}}>Insertar nueva cita </button>
        <div className="Barra-busqueda">
          <input type="text" placeholder="Buscar" className="textField"  name="busqueda" value={this.state.busqueda} onChange={this.onChange} ></input>
          <button type="button" className="btnBuscar" onClick={()=> this.componentDidMount()}> {""}<FontAwesomeIcon icon={faSyncAlt}/></button>
        </div>  
        <button type="button" className="btn btn-dark float-right" id="salir" onClick={()=> this.cerrarSesion()}>Cerrar Sesión</button>
        </div>
        <div className="title bg-dark m-4 text-white text-center">
          <h1>LISTADO DE CITAS</h1>
        </div>
        <div className="container-buttons"><button type="button" className="btn btn-primary float-left" id="informe" onClick={()=> this.modalSector()}>Informe</button></div>
        
        <table className = "table table/border text-center" >
          <thead>
            <tr>
              <th>id_persona</th>
              <th>Nombres</th>
              <th>Cédula</th>
              <th>Dirección</th>
              <th>Teléfono</th>
              <th>Fecha y Hora</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {this.state.data.map((g) =>(
              <tr key={g.id_persona}>
                <td>{g.id_persona}</td>
                <td>{g.nombres}</td>
                <td>{g.cédula}</td>
                <td>{g.dirección}</td>
                <td>{g.teléfono}</td>
                <td>{g.fecha_registro.split('T')[0]}</td>
                <td>
                    <button  className="btn btn-primary" onClick={()=> {this.seleccionOp(g); this.modalEditar(); this.resetCamposE()}}>Editar</button> 
                    <button  className="btn btn-danger" onClick={()=> {this.seleccionOp(g); this.setState({modalEliminar: true});}}>Eliminar</button>
                </td>
              </tr>
              ))
            }
          </tbody>
        </table>
        <Modal isOpen= {this.state.modalInsertar}> 
        <ModalHeader> Gestor de Base de datos</ModalHeader>
        <ModalBody onChange={this.handleChange} onSubmit={this.envFormu.bind(this)}>
          <h3 className="modal-title text-center">Ingresar Cita</h3>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="id_persona">id_persona: </label>
            <div className="col-sm-8">
                  <input type="text" className="form-control"  name="id_persona" id="id_persona" readOnly value={this.state.data.length+1}/>
            </div>
          </div>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label" htmlFor="nombre">Nombres: </label>
              <div className="col-sm-8">
                <input type="text" className="form-control" name="Nombres" id="Nombres" placeholder="Ingrese Nombre" required 
                onChange= {this.deteCambio.bind(this, "Nombres")} value={this.state.array.Nombres ||''}/>
                <span style={{color: "red"}}>{this.state.error["Nombres"]}</span>
              </div>
            </div> 

            <div className="form-group row">
              <label className="col-sm-4 col-form-label" htmlFor="cedula">Cédula: </label>
              <div className="col-sm-8">
                <input type="number" className="form-control" name="Cédula" id="Cédula" placeholder="Ingrese Cédula" required 
                onChange= {this.deteCambio.bind(this, "Cédula")} value={this.state.array.Cédula ||''} min="1" max="9"/>
                <span style={{color: "red"}}>{this.state.error["Cédula"]}</span>
              </div>
            </div>

          <div className="form-group row">
              <label className="col-sm-4 col-form-label" htmlFor="direccion">Dirección: </label>
              <div className="col-sm-8">
                <input type="text" className="form-control" name="Dirección" id="Dirección" placeholder="Ingrese Dirección" required 
                onChange= {this.deteCambio.bind(this, "Dirección")} value={this.state.array.Dirección ||''}/>
                <span style={{color: "red"}}>{this.state.error["Dirección"]}</span>
              </div>
          </div>

          <div className="form-group row">
              <label className="col-sm-4 col-form-label" htmlFor="telefono">Teléfono: </label>
              <div className="col-sm-8">
                <input type="number" className="form-control" name="Teléfono" id="Teléfono" placeholder="Ingrese Teléfono" required 
                onChange= {this.deteCambio.bind(this, "Teléfono")} value={this.state.array.Teléfono ||''} min="1" max="9"/>
                <span style={{color: "red"}}>{this.state.error["Teléfono"]}</span>
              </div>
          </div>

          <div className="form-group row">
              <label className="col-sm-4 col-form-label" htmlFor="fecha">Fecha y hora: </label>
              <div className="col-sm-4">
                <input type="date" className="form-control" name="fecha_registro" id="fecha_registro" required 
                onChange= {this.deteCambio.bind(this, "fecha_registro")} value={this.state.array.fecha_registro ||''}/>
                <span style={{color: "red"}}>{this.state.error["fecha_registro"]}</span>
              </div>
          </div>
        </ModalBody>
          <ModalFooter>
          <button type="submit" id="insertar" className="btn btn-success" onClick= {() => this.submitHandler()}>Guardar</button>
          <button type="button" id="regresar" className="btn btn-danger" onClick={()=> {this.modalInsertar(); this.resetCampos()}}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen= {this.state.modalEditar}> 
        <ModalHeader> Gestor de Base de datos</ModalHeader>
        <ModalBody onChange={this.handleChange} onSubmit={this.envFormu.bind(this)}>
          <h3 className="modal-title text-center">Editar Cita</h3>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="id_persona">id_persona: </label>
            <div className="col-sm-8">
                  <input type="text" className="form-control"  name="id_persona" id="id_persona" readOnly value={this.state.array.id_persona}/>
            </div>
          </div>
            <div className="form-group row">
              <label className="col-sm-4 col-form-label" htmlFor="nombre">Nombres: </label>
              <div className="col-sm-8">
                <input type="text" className="form-control" name="Nombres" id="Nombres" placeholder="Ingrese Nombre"
                onChange= {this.deteCambio.bind(this, "Nombres")} value={(this.state.array.Nombres ||'')}/>
                <span style={{color: "red"}}>{this.state.error["Nombres"]}</span>
              </div>
            </div> 

            <div className="form-group row">
              <label className="col-sm-4 col-form-label" htmlFor="cedula">Cédula: </label>
              <div className="col-sm-8">
                <input type="number" className="form-control" name="Cédula" id="Cédula" placeholder="Ingrese Cédula"
                onChange= {this.deteCambio.bind(this, "Cédula")} value={ (this.state.array.Cédula ||'')} min="1" max="9"/>
                <span style={{color: "red"}}>{this.state.error["Cédula"]}</span>
              </div>
            </div>

          <div className="form-group row">
              <label className="col-sm-4 col-form-label" htmlFor="direccion">Dirección: </label>
              <div className="col-sm-8">
                <input type="text" className="form-control" name="Dirección" id="Dirección" placeholder="Ingrese Dirección"
                onChange= {this.deteCambio.bind(this, "Dirección")} value={(this.state.array.Dirección ||'')}/>
                <span style={{color: "red"}}>{this.state.error["Dirección"]}</span>
              </div>
          </div>

          <div className="form-group row">
              <label className="col-sm-4 col-form-label" htmlFor="telefono">Teléfono: </label>
              <div className="col-sm-8">
                <input type="number" className="form-control" name="Teléfono" id="Teléfono" placeholder="Ingrese Teléfono" 
                onChange= {this.deteCambio.bind(this, "Teléfono")} value={(this.state.array.Teléfono ||'')} min="1" max="9"/>
                <span style={{color: "red"}}>{this.state.error["Teléfono"]}</span>
              </div>
          </div>

          <div className="form-group row">
              <label className="col-sm-4 col-form-label" htmlFor="fecha">Fecha y hora: </label>
              <div className="col-sm-4">
                <input type="date" className="form-control" name="fecha_registro" id="fecha_registro"
                onChange= {this.deteCambio.bind(this, "fecha_registro")} value={(this.state.array.fecha_registro ||'')}/>
                <span style={{color: "red"}}>{this.state.error["fecha_registro"]}</span>
              </div>
          </div>
        </ModalBody>
          <ModalFooter>
          <button type="button" id="actualizar" className="btn btn-primary" onClick= {() => {this.Putpeticion()}}>Actualizar</button>
          <button type="button" id="regresar" className="btn btn-danger" onClick={()=> {this.setState({modalEditar: false}); this.resetCamposE()}}>Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen = {this.state.modalEliminar}>
        <ModalBody>
          Estas seguro de eliminar el registro {array && array.Nombres}
        </ModalBody>
        <ModalFooter>
        <button type="button" id="si" className="btn btn-danger" onClick= {() => this.Deletepeticion()}>Si</button>
        <button type="button" id="no" className="btn btn-secundary" onClick={()=> this.setState({modalEliminar: false})}>No</button>
        </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default Formulario;