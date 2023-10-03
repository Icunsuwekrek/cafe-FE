import React from 'react'
import MenuItem from './MenuItem'
import { useState, useEffect } from 'react'
import Navbar from '../../components/Navbar'

import axios from 'axios'
import { Modal } from 'bootstrap'
const baseURL = "http://localhost:8000"
const header ={
  headers: {
      Authorization: `Bearer ${localStorage.getItem(`token`)}`
  }
}

export default function Menu() {
  /**define state for store menu */
  const [menus, setMenus] = useState([])

  /**define state to store prop menu */
  const [id_menu, setIDMenu] = useState(0)
  const [nama_menu, setNamaMenu] = useState("")
  const [jenis, setJenis] = useState("")
  const [deskripsi, setDeskripsi] = useState("")
  const [harga, setHarga] = useState(0)
  const [gambar, setGambar] = useState(undefined)

  /**define state to store modal */
  const [modal, setModal] = useState(undefined)

  /**state to store status of edit */
  const [isEdit, setIsEdit] = useState(true)
  const [keyword, setKeyword] = useState("")

  async function getMenu() {
    try {
      let url = `${baseURL}/menu`
      let { data } = await axios.get(url, header)
      setMenus(data.data)

    } catch (error) {
      console.log(error)
    }
  }
  async function searching(e) {
    try {
     if (e.keyCode == 13) {
      let url = `${baseURL}/menu/find`
      let dataSearch = {
        keyword: keyword
      }
      let { data } = await axios.post(url, dataSearch, header)
      setMenus(data.data)
     }
 
    } catch (error) {
      console.log(error)
    }
  }
  async function addMenu() {
    /**show modal */
    modal.show()
    /**reset state of menu */
    setIDMenu(0)
    setNamaMenu("")
    setDeskripsi("")
    setHarga(0)
    setJenis("")
    setGambar(undefined)
    setIsEdit(false)
  }
  async function edit(menu) {
    //open modal
    modal.show()
    setIsEdit(true)
    setIDMenu(menu.id_menu)
    setNamaMenu(menu.nama_menu)
    setDeskripsi(menu.deskripsi)
    setHarga(menu.harga)
    setJenis(menu.jenis)
    setGambar(undefined)
  }
  async function drop(menu){
    try {
      if (window.confirm(`Apakah anda yakin ingin menghapus ${menu.nama_menu}?`)) {
        let url = `${baseURL}/menu/${menu.id_menu}`
        axios.delete(url, header)
        .then(result =>{
          if (result.data.status == true) {
            window.alert(result.data.message)
          }
          /**refresh data */
          getMenu()
        })
        .catch(error => {
          console.log(error)
        })
      }
    } catch (error) {
      console.log(error)
    }
  }



  async function saveMenu(e) {
    try {
      e.preventDefault()
      /**close the modal */
      modal.hide()
      if (isEdit) {
        //ini untuk edit
        let form = new FormData()
        form.append("nama_menu", nama_menu)
        form.append("jenis", jenis)
        form.append("deskripsi", deskripsi)
        form.append("harga", harga)
        if (gambar != undefined) {
          form.append("gambar", gambar)
        }

        /**send to backend */
        let url = `${baseURL}/menu/${id_menu}`
        let result = await axios.put(
          url, form, header
        )
        if (result.data.status == true) {
          /**refresh data menu */
          getMenu()
        }
        window.alert(result.data.message)
      } else {
        //ini untuk tambah
        let form = new FormData()
        form.append("nama_menu", nama_menu)
        form.append("jenis", jenis)
        form.append("deskripsi", deskripsi)
        form.append("harga", harga)
        form.append("gambar", gambar)

        /**send to backend */
        let url = `${baseURL}/menu`
        let result = await axios.post(
          url, form, header
        )
        if (result.data.status == true) {
          /**refresh data menu */
          getMenu()
        }
        window.alert(result.data.message)
      }
    } catch (error) {
      console.log(error)
    }
  }
  //useEffect menjalankan aksi saat komponen ini dimuat
  useEffect(() => {
    /**define modal */
    setModal(new Modal('#modalMenu'))
    getMenu()
  }, [])
  return (
  <>
  <Navbar/>
  <div className='container-fluid bg-zinc-200'
    style={{fontFamily:'bakso sapi'}}>
      <h2 className="text-center text-green-900 font-bold font-serif pt-3">Daftar Menu</h2>
      <hr />

      <button className='btn'
        onClick={() => addMenu()}
        style={{backgroundColor:'#97DECE'}}>
        Tambah Menu
      </button>
      <input type="text"
        className='form-control my-2'
        value={keyword}
        onChange={e => setKeyword(e.target.value)}
        onKeyUp={e => searching(e)}
      />
      <div className="row">
        {menus.map(menu => (
          <div key={`menu${menu.id_menu}`}
            className="col-md-6 col-lg-4 text-xl">
            <MenuItem
              img={`${baseURL}/menu_image/${menu.gambar}`}
              nama_menu={menu.nama_menu}
              deskripsi={menu.deskripsi}
              harga={menu.harga}
              jenis={menu.jenis}
              onEdit={() => edit(menu)}
              onDelete={() => drop(menu)} />
          </div>
        ))}
      </div>

      {/* craete div of modal */}
      <div className='modal fade' id='modalMenu'>
        <div className='modal-dialog modal-md'>
          <div className='modal-content'>
            <form onSubmit={e => saveMenu(e)}>
              <div className='modal-heder h-10' style={{ background: '#DDFFBB' }}>
                <h4 class='text-center'>Form Menu</h4>
              </div>
              <div className='modal-body'>
                <small>Nama Menu</small>
                <input
                  required={true}
                  type="text"
                  className='form-control mb-2'
                  value={nama_menu}
                  onChange={e => setNamaMenu(e.target.value)}
                />

                <small>Deskripsi</small>
                <input
                  required={true}
                  type="text"
                  className='form-control mb-2'
                  value={deskripsi}
                  onChange={e => setDeskripsi(e.target.value)}
                />
                <small>Harga</small>
                <input
                  required={true}
                  type="number"
                  className='form-control mb-2'
                  value={harga}
                  onChange={e => setHarga(e.target.value)}
                />
                <small>Gambar</small>
                <input
                  type="file"
                  accept='image/*'
                  className='form-control mb-2'
                  onChange={e => setGambar(e.target.files[0])}
                />
                <small>Jenis Menu</small>
                <select
                  required={true}
                  value={jenis}
                  className='form-control mb-2'
                  onChange={e => setJenis(e.target.value)}>
                  <option value="">--Pilih Jenis Makanan--</option>
                  <option value="makanan">Makanan</option>
                  <option value="minuman">Minuman</option>
                </select>
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

    </div>
  </>
  )
}
