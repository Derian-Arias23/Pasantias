import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import '../css/Formulario.css';
import {Modal, ModalBody, ModalFooter, ModalHeader} from 'reactstrap';
import { TableContainer, Table, TableHead, TableBody, TableCell, TableRow } from '@material-ui/core';
import ExportExcel from 'react-export-excel-fixed-xlsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

const url = 'https://localhost:5001/api/Personas/Get/';
const ExcelFile = ExportExcel.ExcelFile;
const ExcelSheet = ExportExcel.ExcelSheet;
const ExcelColumn = ExportExcel.ExcelColumn;

class TablaSector extends Component{

  state={
    data:[],
    campo: '',
    busqueda: '',
    form:{
      id_persona: 0,
      Nombres: '',
      Dirección: '',
      fecha_registro: ''
    },
    modalTabla: false,
    modalSector: true, 
    showMe: true
  };

  Getpeticion=()=>{
    axios.get(url+'0')
    .then(response => {
      this.setState({data: response.data});
    })
  }

  componentDidMount=()=>{
    this.Getpeticion();
  }

  /*validarCampos =()=>{
    let campo = this.state.campo;
    let formuVali = true;

    if(campo["Nombres"]){
      formuVali = false;
      <div className="form-group row">
        <label className="col-sm-4 col-form-label" htmlFor="nombre">Nombre: </label>
        <div className="col-sm-8">
          <input type="text" className="form-control" name="Nombres" id="Nombres" placeholder="Ingrese Nombre" onChange={this.handleChange}
          value={this.state.form.Nombres}/>
        </div>
      </div> 
    }

    if(campo["Dirección"]){
      formuVali = false;
      <div className="form-group row">
    <label className="col-sm-4 col-form-label" htmlFor="sector">Sector: </label>
    <div className="col-sm-8">
      <input type="text" className="form-control" name="Dirección" id="Dirección" placeholder="Ingrese Sector" onChange={this.handleChange}
      value={this.state.form.Dirección}/>
    </div>
  </div>
    }

    this.setState({
      campo : campo
    });
    return formuVali;
  }
  }*/

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

  handleChange= async e =>{
    e.persist();
    await this.setState({
      form:{
        ...this.state.form,
        [e.target.name]: e.target.value
      }
    });
    console.log(this.state.form);
  }

  onChange = async e =>{
    e.persist();
    await this.setState({busqueda: e.target.value});
    this.filtro();
    console.log(this.state.busqueda);
  }

  modalTabla=() =>{
    this.setState({modalTabla: !this.state.modalTabla});
  }

  modalSector=() =>{
    this.setState({modalSector: !this.state.modalSector});
  }

  cerrarModal=()=>{
    window.location.href="./formulario";
  }

  render(){
    const {form} = this.state;
    return (
      <div className="Routes">
        <Modal isOpen ={this.state.modalTabla}>
          <ModalBody>
            <div className="title bg-primary text-white m-4 text-center">
              <h2>LISTADO DE CITAS</h2>
            </div>
            <TableContainer>
            <Table className = "table table/border text-center" id="Tabla-Sector">
              <TableHead>
                <TableRow>
                  <TableCell><th>id_persona</th></TableCell>
                  <TableCell><th>Nombres</th></TableCell>
                  <TableCell><th>Dirección</th></TableCell>
                  <TableCell><th>Fecha y Hora</th></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {this.state.data.map(g =>(
                <TableRow key={g.id_persona}>
                  <TableCell><td>{g.id_persona}</td></TableCell>
                  <TableCell><td>{g.nombres}</td></TableCell>
                  <TableCell><td>{g.dirección}</td></TableCell>
                  <TableCell><td>{g.fecha_registro.split('T')[0]}</td></TableCell>
                </TableRow>
                ))}
              </TableBody>
            </Table>
            </TableContainer>
          </ModalBody>
          <ModalFooter>
            <ExcelFile element={<button type="submit" className="btn btn-success">Excel</button>} filename="Export-Excel" fileExtension="xlsxs">
                <ExcelSheet data={this.state.data} name="Citas">
                  <ExcelColumn label="id_persona" value="id_persona"/>
                  <ExcelColumn label="Nombres" value="nombres"/>
                  <ExcelColumn label="Dirección" value="dirección"/>
                  <ExcelColumn label="Fecha y Hora" value="fecha_registro"/>
                </ExcelSheet>
            </ExcelFile>
              <button type="button" id="regresar" className="btn btn-danger float-right" onClick={()=> this.setState({modalTabla: false})} >Cancelar</button>
          </ModalFooter>
        </Modal>

        <Modal isOpen= {this.state.modalSector}> 
        <ModalHeader> Gestor de Base de datos</ModalHeader>
        <ModalBody>
          <h3 className="modal-title text-center">Detalle</h3>
          <br></br>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label" htmlFor="nombre">Buscar por: </label>
            <select className="col-sm-7" id="select" name="select" onChange={this.handleChange}>
              <option className="col-sm-7 col-form-label" value="" >Seleccione</option>
              <option name="Nombres" key={this.state.form.Nombres} value="nombres" className="col-sm-8">Nombres</option>
              <option name="Dirección" value="dirección" className="col-sm-8" >Dirección</option>
            </select>
          </div>
          <br></br>
          <div className="Barra-busqueda">
          <label className="col-sm-4 col-form-label" htmlFor="nombre"></label>
            <input type="text" placeholder="Buscar" className="textField col-sm-6 col-form-label"  name="busqueda" value={this.state.busqueda} onChange={this.onChange} ></input>
            <button type="button" className="btnBuscar" onClick={()=> this.componentDidMount()}> {""}<FontAwesomeIcon icon={faSyncAlt}/></button>
          </div>
 
        </ModalBody>
          <ModalFooter>
            <button type="submit" id="buscar" className="btn btn-primary" onClick={()=> {this.modalTabla(); this.filtro()}}>Buscar</button>
            <button type="button" id="regresar" className="btn btn-danger" onClick={()=> this.cerrarModal()}>Cancelar</button>
            </ModalFooter>
        </Modal>
      </div>    
    );
  }
}
export default TablaSector;