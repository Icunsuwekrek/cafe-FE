import { useState, useEffect } from "react"
import { Modal } from "bootstrap"
import axios from "axios"
import Navbar from "../../components/Navbar"

const baseURL = `http://localhost:8000`
const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

const Meja = () => {
    const [id_meja, setIDMeja] = useState(0)
    const [nomor_meja, setNomorMeja] = useState("")
    const [status, setStatus] = useState(true)
    const [isEdit, setIsEdit] = useState(true)
    const [modal, setModal] = useState(null)
    const [meja, setMeja] = useState([])

    const getMeja = () => {
        const url = `${baseURL}/meja`
        axios.get(url, header)
        .then(response => {
            setMeja(response.data.data)
        })
        .catch(error => console.log(error))
    }

    const addMeja = () => {
        setIDMeja(0)
        setNomorMeja("")
        setStatus(true)
        setIsEdit(false)
        modal.show()
    }

    const editMeja = item => {
        setIDMeja(item.id_meja)
        setNomorMeja(item.nomor_meja)
        setStatus(item.status)
        setIsEdit(true)
        modal.show()
    }

    const saveMeja = event=>{
        event.preventDefault()
        modal.hide()
        
        let payLoad={id_meja,nomor_meja,status}
        if(isEdit){
            //proses edit
            let url=`${baseURL}/meja/${id_meja}`
            axios.put(url, payLoad, header)
            .then(response=>{
                window.alert(`data meja berhasil diubah`)
                //recall 
                getMeja()
            })
            .catch(error=>console.log(error)) 

        }else{
             //proses edit
             let url=`${baseURL}/meja`
             axios.post(url, payLoad, header)
             .then(response=>{
                 window.alert(`data meja berhasil ditambah`)
                 //recall 
                 getMeja()
             })
             .catch(error=>console.log(error)) 
           

        }
    }
    const dropMeja =(item)=>{
        if(window.confirm(`Apakah anda yakin`)){
            const url =`${baseURL}/meja/${item.id_meja}`
            axios.delete(url, header)
            .then(response=>{
                window.alert(`data berhasil diapus`)
                //recall
                getMeja()
            })
            .catch(error=>console.log(error))

        }

    }

    useEffect(() => {
        getMeja()
        setModal(new Modal(`#modal-meja`))
    }, [])

    return (
      <>
      <Navbar/>
      <div className="container w-100">
            <div className="col-md-12">
            <h4 className=" text-center" >Daftar Meja</h4>
            <button className="btn btn-success"
            onClick={() => addMeja()}>
                Tambah Meja
            </button>
            </div>
            <ul className="list-group">
                {meja.map(table => (
                    <li className="list-group-item mb-2" 
                    key={`keyMeja${table.id_meja}`}>
                        <div className="row">
                            <div className="col-md-4">
                                <small className="text-success ">
                                    Nomor Meja
                                </small><br />
                                {table.nomor_meja}
                            </div>

                            <div className="col-md-4">
                                <small className="text-success">
                                    Status
                                </small><br />
                                {table.status ? 'available' : 'in use' }
                            </div>

                            <div className="col-md-4">
                                <small className="text-success">
                                    Action
                                </small><br />
                                <button className="btn btn-sm btn-info"
                                onClick={() => editMeja(table)}>
                                    <i className="bi bi-pencil"></i>
                                </button>
                                <button className="btn btn-sm btn-info"
                                onClick={() => dropMeja(table)}>
                                    <i className="bi bi-trash"></i>
                                </button>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>

            {/* modal meja */}
            <div className="modal fade" id="modal-meja">
                <div className="modal-dialog modal-md">
                    <div className="modal-content">
                        <form onSubmit={saveMeja}>
                            <div className="modal-header">
                                <h4 className="modal-title">
                                    Form Meja
                                </h4>
                            </div>

                            <div className="modal-body">
                                <small>Nomor Meja</small>
                                <input type="text" className="form-control mb-2" value={nomor_meja} 
                                onChange={e => setNomorMeja(e.target.value)} />
                                <small>
                                    Status
                                </small>

                                <select className="form-control mb-2"
                                value={status}
                                onChange={e => setStatus(e.target.value)}>
                                    <option value="">--Pilih Status--</option>
                                    <option value={true}>Available</option>
                                    <option value={false}>In Use</option>
                                </select>

                                <button type="submit" className="btn btn-info w-100">
                                    Simpan
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
      </>
    )

}
    


export default Meja