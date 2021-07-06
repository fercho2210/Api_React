import React, { useEffect, useState } from "react";
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import {Modal,ModalBody,ModalFooter,ModalHeader} from 'reactstrap';


function App() {
  const baseUrl="https://jsonplaceholder.typicode.com/users/1/todos"; 
  const [data , setData]=useState([]);
  const [modalEliminar, setModalEliminar]=useState(false);
  const [modalInsertar, setModalInsertar]=useState(false);
  const [modalEditar, setModalEditar]=useState(false);
  const [gestorseleccionado , setgestorseleccionado]=useState({ 
    userId: '',
    id: '',
    title: '' ,
    completed: ''
  })


  //metodos 
  const handleChange=e=>{
    const {name, value}=e.target;
    setgestorseleccionado({
      ...gestorseleccionado,
      [name]: value
    })
    console.log(gestorseleccionado);
   };

 
   const abrirCerrarModalInsertar=()=>{
     setModalInsertar(!modalInsertar);
 }

 const abrirCerrarModalEditar=()=>{
  setModalEditar(!modalEditar);
}

const abrirCerrarModalEliminar=()=>{
  setModalEliminar(!modalEliminar);
}



  const peticionGet=async()=>{
    await axios .get(baseUrl)
    .then(response=>{
      setData(response.data);
    }).catch(error=>{

      console.log(error);
    })
  }


  const peticionPost=async()=>{
    delete gestorseleccionado.id;
    await axios.post(baseUrl, gestorseleccionado)
    .then(response=>{
      setData(data.concat(response.data));
      abrirCerrarModalInsertar();
    }).catch(error=>{
   console.log(error);
    })
  }

  const peticionPut=async()=>{
    await axios.put(baseUrl+"/"+gestorseleccionado.id, gestorseleccionado)
    .then(response=>{
     var respuesta =response.data;
     var dataAuxiliar=data;
     dataAuxiliar.map(gestor=>{
      if(gestor.id===gestorseleccionado.id){
        gestor.userId=respuesta.userId;
        gestor.title=respuesta.title;
        gestor.completed=respuesta.completed;
       }
      });
     abrirCerrarModalEditar();
    }).catch(error=>{
   console.log(error);
    })
  }

  const peticionDelete=async()=>{
   await axios.delete(baseUrl+"/"+gestorseleccionado.id)
    .then(response=>{
      setData(data.filter(gestor=>gestor.id!==response.data));
      abrirCerrarModalEliminar();
    }).catch(error=>{
   console.log(error);
    })
  }



  const SeleccionarGestor=(gestor , caso)=>{
    setgestorseleccionado(gestor);
    (caso==="Editar")?
    abrirCerrarModalEditar(): abrirCerrarModalEliminar();
  }


useEffect(()=>{
  peticionGet();
},[])

  return (
    <div className="App">
     <br /> <br /> 
     <button  onClick={()=>abrirCerrarModalInsertar()} className="btn btn-success">Insertar nuevo registro</button>
     <br /> <br />
     <table className="table table-bordered">
      <thead>
        <tr>
          <th>UserId</th>
          <th>id</th>
          <th>title</th>
          <th>completed</th>
          <th>Accciones</th>
         </tr>
      </thead>
      <tbody>
      {data.map(gestor=>(
        <tr key ={gestor.id}>
          <td>{gestor.userId}</td>
          <td>{gestor.id}</td>
          <td>{gestor.title}</td>
          <td>{gestor.completed}</td>
          <td>                               
          <button className="btn btn-primary" onClick={()=>SeleccionarGestor(gestor , "Editar")}>editar</button>{" "}
          <button className="btn btn-danger" onClick={()=>SeleccionarGestor(gestor , "Eliminar")}>eliminar</button>{" "}
          </td>

        </tr>
         ))}
      </tbody>

     </table>


      <Modal isOpen={modalInsertar}>
      <ModalHeader>Insertar Gestor Bd</ModalHeader>
      <ModalBody>
      <div className="form-group">
        <label>UserId</label>
        <br />
        <input type="text" className="form-control" name="UserId" onChange={handleChange} />
        <br />
        <label>id</label>
        <br />
        <input type="text" className="form-control" name="id" onChange={handleChange}/>
        <br />
        <label>title</label>
        <br />
        <input type="text" className="form-control" name="title" onChange={handleChange}/>
        <br />
        <label>completed</label>
        <br />
        <input type="text" className="form-control" name="completed" onChange={handleChange} />
        <br />
      </div>

      </ModalBody>
      <ModalFooter>
      <button className="btn btn-primary" onClick={()=>peticionPost()}>insertar</button>{" "}
      <button className="btn btn-danger" onClick={()=>abrirCerrarModalInsertar()}>cancelar</button>{" "}
      </ModalFooter>
     </Modal>

     <Modal isOpen={modalEditar}>
      <ModalHeader>editar Gestor</ModalHeader>
      <ModalBody>
      <div className="form-group">
        <label>UserId</label>
        <br />
        <input type="text" className="form-control"  name="UserId" onChange={handleChange}   value={gestorseleccionado && gestorseleccionado.userId}/>
        <br />
        <label>id</label>
        <br />
        <input type="text" className="form-control" readOnly  name="id" onChange={handleChange}   value={gestorseleccionado && gestorseleccionado.id}/>
        <br />
        <label>title</label>
        <br />
        <input type="text" className="form-control" name="title" onChange={handleChange}   value={gestorseleccionado && gestorseleccionado.title}/>
        <br />
        <label>completed</label>
        <br />
        <input type="text" className="form-control" name="completed" onChange={handleChange}   value={gestorseleccionado && gestorseleccionado.completed}/>
        <br />
      </div>

      </ModalBody>
      <ModalFooter>

      <button className="btn btn-primary" onClick={()=>peticionPut()} >guardar</button>{" "}
      <button className="btn btn-danger" onClick={()=>abrirCerrarModalEditar()}>cancelar</button>{" "}
      </ModalFooter>
     </Modal>

        <Modal isOpen={modalEliminar}>
        <ModalBody>
          esta seguro que desea eliminar este registro {gestorseleccionado && gestorseleccionado.userId}?
        <ModalFooter>

        <button className="btn btn-danger" onClick={()=>peticionDelete()}>si</button>
        <button className="btn btn-secondary" onClick={()=>abrirCerrarModalEliminar()}>no</button>

        </ModalFooter>

        </ModalBody>

        </Modal>

     </div>
  );
}

export default App;

