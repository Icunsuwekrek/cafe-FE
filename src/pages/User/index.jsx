import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
import { Modal } from "bootstrap";
import { json } from "react-router-dom";
const baseURL = "http://localhost:8000"
const header = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem(`token`)}`
  }
}

const User = () => {
  const [id_user, setIdUser] = useState(0)
  const [nama_user, setNamaUser] = useState("")
  const [role, setRole] = useState(true)
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [isEdit, setIsEdit] = useState(true)
  const [modal, setModal] = useState(null)
  const [user, setUser] = useState([])


  const getUser = () => {
    const url = `${baseURL}/user`
    axios.get(url, header)
      .then(response => {
        setUser(response.data.data)
      })
      .catch(error => console.log(error))
  }
  const addUser = () => {
    setIdUser(0)
    setNamaUser("")
    setRole(true)
    setUsername("")
    setPassword("")
    setIsEdit(false)
    modal.show()
  }
  const editUser = item => {
    setIdUser(item.id_user)
    setNamaUser(item.nama_user)
    setRole(item.role)
    setUsername(item.username)
    setPassword(item.password)
    setIsEdit(true)
    modal.show()
  }
  const saveUser = event=>{
    event.preventDefault()
    modal.hide()
    
    let payLoad={nama_user, role, username, password}
    if(isEdit){
        //proses edit
        let url=`${baseURL}/user/${id_user}`
        axios.put(url, payLoad, header)
        .then(response=>{
            window.alert(`data user berhasil diubah`)
            //recall 
            getUser()
        })
        .catch(error=>console.log(error)) 

    }else{
         //proses edit
         let url=`${baseURL}/user`
         axios.post(url, payLoad, header)
         .then(response=>{
             window.alert(`data user berhasil ditambah`)
             //recall 
             getUser()
         })
         .catch(error=>console.log(error)) 
       

    }
}

const dropUser =(item)=>{
  if(window.confirm(`Apakah anda yakin`)){
      const url =`${baseURL}/user/${item.id_user}`
      axios.delete(url, header)
      .then(response=>{
          window.alert(`data berhasil diapus`)
          //recall
          getUser()
      })
      .catch(error=>console.log(error))

  }

}

  useEffect(() => {
    getUser()
    setModal(new Modal('#modalUser'))
  }, [])

  return (
    <>
      <Navbar />
      <div className="container mx-auto my-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
            <thead>
              <tr>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  ID
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Nama User
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Role
                </th>
                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Username
                </th>

                <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
                  Aksi
                </th>
                <th className="px-4 py-2"></th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {user.map((item) => {
                return (
                  <tr>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {item.id_user}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
                      {item.nama_user}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {item.role}
                    </td>
                    <td className="whitespace-nowrap px-4 py-2 text-gray-700">
                      {item.username}
                    </td>

                    <td className="whitespace-nowrap px-4 py-2">
                      <div class="inline-flex rounded-lg border border-gray-100 bg-gray-100 p-1">
                        <button class="inline-block rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative"
                        onClick={() => editUser(item)}
                        >
                          Edit
                        </button>

                        <button class="inline-block rounded-md px-4 py-2 text-sm text-gray-500 hover:text-gray-700 focus:relative">
                          View
                        </button>

                        <button class="inline-block rounded-md bg-white px-4 py-2 text-sm text-blue-500 shadow-sm focus:relative"
                        onClick={() => dropUser(item)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <a
          class="inline-block rounded border border-indigo-600 bg-indigo-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-indigo-600 focus:outline-none focus:ring active:text-indigo-500"
          onClick={() => addUser()}
        >
          Add User
        </a>
      </div>
      <div className='modal fade' id='modalUser'>
        <div className='modal-dialog modal-md'>
          <div className='modal-content'>
            <form onSubmit={saveUser}>
              <div className='modal-heder h-10' style={{ background: '#DDFFBB' }}>
                <h4 class='text-center'>Form User</h4>
              </div>
              <div className='modal-body'>
                <small>Nama User</small>
                <input
                  required={true}
                  type="text"
                  className='form-control mb-2'
                  value={nama_user}
                  onChange={e => setNamaUser(e.target.value)}
                />
                <small>Role</small>
                <select
                  required={true}
                  value={role}
                  className='form-control mb-2'
                  onChange={e => setRole(e.target.value)}>
                  <option value="">--Pilih Role--</option>
                  <option value="manajer">Manajer</option>
                  <option value="kasir">Kasir</option>
                  <option value="admin">Admin</option>
                </select>
                <small>Username</small>
                <input
                  required={true}
                  type="text"
                  className='form-control mb-2'
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                />
                <small>Password</small>
                <input
                  required={true}
                  type="number"
                  className='form-control mb-2'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />

              </div>
              <div className="modal-footer">
                <button type='submit' className='w-100 btn btn-success'>
                  Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  

    </>
  )
}
export default User;