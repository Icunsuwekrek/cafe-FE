import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Modal } from "bootstrap";
import Navbar from "../../components/Navbar";
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import ReactToPrint from "react-to-print";
import { useReactToPrint } from "react-to-print";
import { data } from "jquery";

const baseURL = `http://localhost:8000`
const header = {
  headers: {
    Authorization: `Bearer ${localStorage.getItem('token')}`
  }
}

const Transaksi = () => {
  const [transaksi, setTransaksi] = useState([])
  const [menu, setMenu] = useState([])
  const [meja, setMeja] = useState([])

  //grab data logged user from local storage
  const user = JSON.parse(localStorage.getItem(`user`))

  const [id_user, setIdUser] = useState(user.id_user)
  const [tgl_transaksi, setTglTransaksi] = useState("")
  const [nama_pelanggan, setNamaPelanggan] = useState("")
  const [id_meja, setIdMeja] = useState("")
  const [detail_transaksi, setDetailTransaksi] = useState([])
  const [filteredData, setFilteredData] = useState()
  const [selectedDate, setSelectedDate] = useState(null);
  const [filteredTransaksi, setFilteredTransaksi] = useState(null);
  const [role, setRole] = useState()
  // setiap detail menu harus ada id_menu dan jumlah

  const [id_menu, setIdMenu] = useState("")
  const [jumlah, setJumlah] = useState(0)
  const [modal, setModal] = useState(null)
  const componentPDF = useRef([]);

  // method untuk get all menu
  const getMenu = () => {
    const url = `${baseURL}/menu`
    axios.get(url, header)
      .then(response => { setMenu(response.data.data) })
      .catch(error => console.log(error))
  }

  // method untuk get all menu
  const getMeja = () => {
    const url = `${baseURL}/meja/available`
    axios.get(url, header)
      .then(response => { setMeja(response.data.data) })
      .catch(error => console.log(error))
  }

  const searching = () => {
    const url = `${baseURL}/transaksi/find`
  }

  // method for get all transaksi
  const getTransaksi = () => {
    const url = `${baseURL}/transaksi`
    axios.get(url, header)
      .then(response => { setTransaksi(response.data.data) })
      .catch(error => console.log(error))
  }

  const addMenu = () => {
    // set selected menu
    let selectedMenu = menu.find(item => item.id_menu == id_menu)
    let newItem = { ...selectedMenu, jumlah: jumlah }
    let tempDetail = [...detail_transaksi]

    // insert new item to detail
    tempDetail.push(newItem)

    /// update array detail menu
    setDetailTransaksi(tempDetail)

    // reset option menu dan jumlah
    setIdMenu("")
    setJumlah(0)
  }

  const handleSaveTransaksi = async event => {
    event.preventDefault()
    if (nama_pelanggan === "" || id_meja === "" || tgl_transaksi === "" || detail_transaksi.length == 0) {
      window.alert(`Lengkapi data yang ada`)
    } else {
      const url = `${baseURL}/transaksi`
      const payload = {
        tgl_transaksi, id_meja, id_user, nama_pelanggan, detail_transaksi
      }

      await axios.put(`${baseURL}/meja/${id_meja}`, { status: false }, header)
      axios.post(url, payload, header)
        .then(response => {
          // show a massage 
          window.alert(`Data transaksi berhasil ditambahkan`)

          // close the modal
          modal.hide()

          //reset data inside from
          setTglTransaksi("")
          setIdMeja("")
          setIdMenu("")
          setJumlah(0)
          setNamaPelanggan("")
          setDetailTransaksi([])

          //re-call get transaksi & available meja
          getTransaksi()
          getMeja()
        })
        .catch(error => console.log(error))
    }
  }

  const handleDelete = item => {
    if (window.confirm(`Apakah yakin ingin menghapus data ini?`)) {
      const url = `${baseURL}/transaksi/${item.id_transaksi}`
      axios.delete(url, header)
        .then(response => { getTransaksi() })
        .catch(error => console.log(error))

    }
  }

  const handlePay = async item => {
    if (window.confirm(`Apakah yakin ingin membayar?`)) {
      await axios.put(`${baseURL}/meja/${item.id_meja}`, { status: true }, header)
      const url = `${baseURL}/transaksi/${item.id_transaksi}`
      const payload = { ...item, status: "lunas" }
      axios.put(url, payload, header)
        .then(response => {
          getTransaksi()
          getMeja()
        })
        .catch(error => console.log(error))
    }
  }

  useEffect(() => {
    getTransaksi()
    getMenu()
    getMeja()

    // register modal
    setModal(new Modal(`#modal-transaksi`))


    const user = JSON.parse(localStorage.getItem("user"))
    setRole(user.role);
  }, [])

  useEffect(() => {
    componentPDF.current = componentPDF.current.slice(0, transaksi.length);
  }, [transaksi])
  // const generatePDF= useReactToPrint({
  //   content: ()=>componentPDF.current,
  //   documentTitle:"Userdata"
  // });
  const generatePDF = (index) => {
    // ReactToPrint({
    //   content: () => componentPDF.current[index].current,
    //   documentTitle:"Userdata"
    // })
    console.log(componentPDF);
  }
  // function handlePrint() {
  //   window.print();
  // }
  const handleFilter = (date) => {
    if (date) {
      
      const filteredData = transaksi.filter((t) => {
        const tgl_transaksi = new Date(t.tgl_transaksi);
        return tgl_transaksi.toDateString() === date.toDateString
      });
      setFilteredTransaksi(filteredData);
    }
  }

  console.log(filteredTransaksi);
  return (
    <>
      <Navbar />
      <div className="w-100 dark:bg-stone-400" >

        <h2 className="text-center">Daftar Transaksi</h2>

        <h4 className="text-center mt-2">
          <p><em>Wikusama
            <span className="ms-2 text-danger">
              Cafe
            </span>
          </em></p>
        </h4>
        <div className="w-100 h-32">
        {role === "manajer" && (
            <div className="mt-5 mx-5 flex">
              <div className="flex p-2 bg-gray-100 rounded-md border shadow-sm">
                <span className="flex-none">Tgl. Transaksi : </span>
                <DatePicker className="pl-1 bg-gray-100" selected={selectedDate} onChange={(date) => {
                  setSelectedDate(date);
                  handleFilter(date);
                }} />
              </div>
            </div>
          )}

          {role === "kasir" && (
            <button className="btn btn-primary mx-5 " style={{ opacity: `65%` }}
              onClick={() => modal.show()}>
              Transaksi Baru
            </button>

          )}
        

        </div>
        <ul className="list-group">


          {!filteredData && (
            transaksi.map((item, index) => (
              <li className="list-group-item m-2" key={`trans${index}-${item.id_transaksi}`}
                style={{ borderTop: `3px solid #B7B7B7`, borderBottom: `3px solid #B7B7B7 ` }}
              >
                <div className="row" ref={componentPDF[index]} style={{ width: '100%' }} >
                  <div className="col-md-2">
                    <small className="text-info font-bold text-lg">
                      Tgl.Transaksi
                    </small><br />
                    {item.tgl_transaksi}
                  </div>

                  <div className="col-md-2">
                    <small className="text-info font-bold text-lg">
                      Nama Pelanggan
                    </small><br />
                    {item.nama_pelanggan}
                  </div>

                  <div className="col-md-2">
                    <small className="text-info font-bold text-lg">
                      No.Meja
                    </small><br />
                    {item.meja.nomor_meja}
                  </div>

                  <div className="col-md-2">
                    <small className="text-info font-bold text-lg">
                      Status
                    </small><br />
                    <span className={`badge ${item.status === 'belum_bayar' ? 'bg-danger' : 'bg-#6096B4'}`} style={{ backgroundColor: `#6096B4`, fontSize: `14px ` }} >
                      {item.status}
                    </span> <br />
                    {item.status === 'belum_bayar' ?
                      <>
                        <button className="btn btn-sm btn-info"
                          onClick={() => handlePay(item)}
                        >
                          PAY
                        </button>
                      </>
                      :
                      <></>}

                  </div>

                  <div className="col-md-2">
                    <small className="text-info font-bold text-lg">
                      Total
                    </small> <br />

                    Rp {
                      item
                        .detail_transaksi
                        .reduce((sum, obj) =>
                          Number(sum) + (obj["jumlah"] * obj["harga"])
                          , 0)}

                  </div>
                  <div className="col-md-2 mb-1">
                    <small className="text-info font-bold text-lg">
                      Action
                    </small> <br />
                    <button className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(item)}
                    >
                      &times;
                    </button>


                    <button onClick={() => generatePDF(index)} className="'w-1/2 h-{52px} sm:flex justify-center items-center text-white bg-stone-700 rounded">

                      Cetak
                    </button>
                  </div>



                  {/**list menu yang dipesan */}
                  <div className="row">
                    <b><h5 className="ms-1 p-2" style={{ backgroundColor: "#C4DFDF", width: 'auto' }}>  Detail Pesanan</h5></b>
                    <ul className="list-group" >
                      {item.detail_transaksi.map((detail) => (
                        <li className="list-group-item" key={`detail${item.id_transaksi}`}>
                          <div className="row">
                            {/**nama pesanan */}
                            <div className="col-md-3">
                              <small className="text-success">Menu</small> <br />
                              {detail.menu.nama_menu}
                            </div>
                            {/**jumlah pesanan */}
                            <div className="col-md-3">
                              <small className="text-success">Jumlah</small><br />
                              qty: {detail.jumlah}
                            </div>
                            <div className="col-md-3">
                              <small className="text-success">Harga</small><br />
                              Rp {detail.harga}
                            </div>
                            <div className="col-md-3">
                              <small className="text-s">Total Harga</small><br />
                              Rp {Number(detail.harga) * Number(detail.jumlah)}
                            </div>

                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </li>
            ))
          )}

          {filteredData && (
            filteredData.map((item, index) => (
              <li className="list-group-item m-2" key={`trans${index}-${item.id_transaksi}`}
                style={{ borderTop: `3px solid #B7B7B7`, borderBottom: `3px solid #B7B7B7 ` }}
              >
                <div className="row" >
                  <div className="col-md-2">
                    <small className="text-info font-bold text-lg">
                      Tgl.Transaksi
                    </small><br />
                    {item.tgl_transaksi}
                  </div>

                  <div className="col-md-2">
                    <small className="text-info font-bold text-lg">
                      Nama Pelanggan
                    </small><br />
                    {item.nama_pelanggan}
                  </div>

                  <div className="col-md-2">
                    <small className="text-info font-bold text-lg">
                      No.Meja
                    </small><br />
                    {item.meja.nomor_meja}
                  </div>

                  <div className="col-md-2">
                    <small className="text-info font-bold text-lg">
                      Status
                    </small><br />
                    <span className={`badge ${item.status === 'belum_bayar' ? 'bg-danger' : 'bg-#6096B4'}`} style={{ backgroundColor: `#6096B4`, fontSize: `14px ` }} >
                      {item.status}
                    </span> <br />
                    {item.status === 'belum_bayar' ?
                      <>
                        <button className="btn btn-sm btn-info"
                          onClick={() => handlePay(item)}
                        >
                          PAY
                        </button>
                      </>
                      :
                      <></>}

                  </div>

                  <div className="col-md-2">
                    <small className="text-info font-bold text-lg">
                      Total
                    </small> <br />
                    Rp {
                      item
                        .detail_transaksi
                        .reduce((sum, obj) =>
                          Number(sum) + (obj["jumlah"] * obj["harga"])
                          , 0)}
                  </div>
                  <div className="col-md-2 mb-1">
                    <small className="text-info font-bold text-lg">
                      Action
                    </small> <br />
                    <button className="btn btn-sm btn-danger"
                      onClick={() => handleDelete(item)}
                    >
                      &times;
                    </button>

                    <button onClick={generatePDF} className="'w-1/2 h-{52px} sm:flex justify-center items-center text-white bg-stone-700">

                      Cetak
                    </button>

                  </div>


                </div>
                {/**list menu yang dipesan */}
                <div className="row">
                  <b><h5 className="ms-1 p-2" style={{ backgroundColor: "#C4DFDF", width: 'auto' }}>  Detail Pesanan</h5></b>
                  <ul className="list-group" >
                    {item.detail_transaksi.map((detail) => (
                      <li className="list-group-item" key={`detail${item.id_transaksi}`}>
                        <div className="row">
                          {/**nama pesanan */}
                          <div className="col-md-3">
                            <small className="text-success">Menu</small> <br />
                            {detail.menu.nama_menu}
                          </div>
                          {/**jumlah pesanan */}
                          <div className="col-md-3">
                            <small className="text-success">Jumlah</small><br />
                            qty: {detail.jumlah}
                          </div>
                          <div className="col-md-3">
                            <small className="text-success">Harga</small><br />
                            @ {detail.harga}
                          </div>
                          <div className="col-md-3">
                            <small className="text-s">Total Harga</small><br />
                            Rp {Number(detail.harga) * Number(detail.jumlah)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </li>
            ))
          )}

        </ul>

        {/**modal for form add transaksi */}
        <div className="modal fade" id="modal-transaksi">
          <div className="modal-dialog modal-lg">
            <div className="modal-content">
              <form onSubmit={handleSaveTransaksi}>
                <div className="modal-header">
                  <h4 className="modal-title">
                    Form Transaksi
                  </h4>
                  <small>
                    Tambahkan pesanan anda
                  </small>
                </div>
                <div className="modal-body">
                  {/**fill customer area */}
                  <div className="row">
                    <div className="col-md-4">
                      <small className="text-info">
                        Nama Pelanggan
                      </small>
                      <input type="text"
                        className="form-control mb-2"
                        value={nama_pelanggan}
                        onChange={e => setNamaPelanggan(e.target.value)} />
                    </div>
                    <div className="col-md-4">
                      <small className="text-info">
                        Pilih Meja
                      </small>
                      <select className="form-control mb-2"
                        value={id_meja}
                        onChange={e => setIdMeja(e.target.value)}>
                        <option value="">--Pilih Meja--</option>
                        {meja.map(table => (
                          <option value={table.id_meja}
                            key={`keyMeja${table.id_meja}`}>

                            Nomor Meja {table.nomor_meja}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="col-md-4">
                      <small className="text-info">
                        Tgl Transaksi
                      </small>
                      <input type="date"
                        className="form-control mb-2"
                        value={tgl_transaksi}
                        onChange={e => setTglTransaksi(e.target.value)}
                      />
                    </div>

                  </div>

                  {/**choose menu area */}
                  <div className="row">
                    <div className="col-md-8">
                      <small className="text-info">
                        Pilih Menu
                      </small>
                      <select className="form-control mb-2"
                        value={id_menu}
                        onChange={e => setIdMenu(e.target.value)} >
                        <option value="">Pilih menu</option>
                        {menu.map((item, index) => (
                          <option value={item.id_menu}
                            key={`keyMenu${index}`}>
                            {item.nama_menu}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-2">
                      <small className="text-info">
                        Jumlah
                      </small>
                      <input type="number"
                        className="form-control mb-2"
                        value={jumlah}
                        onChange={e => setJumlah(e.target.value)}
                      />
                    </div>

                    <div className="col-md-2">
                      <small className="text-info">
                        Action
                      </small> <br />
                      <button type="button" className="btn btn-sm btn-success"
                        onClick={() => addMenu()}
                      >
                        ADD
                      </button>
                    </div>

                  </div>
                  {/**details order area */}
                  <div className="row">
                    <ul className="list-group">
                      <h5 className="ms-1 p-2">  Detail Pesanan</h5>
                      <ul className="list-group" >
                        {detail_transaksi.map((detail) => (
                          <li className="list-group-item" key={`detail${detail.id_menu}`}>
                            <div className="row">
                              {/**nama pesanan */}
                              <div className="col-md-3">
                                <small className="text-success">Menu</small> <br />
                                {detail.nama_menu}
                              </div>
                              {/**jumlah pesanan */}
                              <div className="col-md-3">
                                <small className="text-success">Jumlah</small><br />
                                qty: {detail.jumlah}
                              </div>
                              <div className="col-md-3">
                                <small className="text-success">Harga</small><br />
                                @ {detail.harga}
                              </div>
                              <div className="col-md-3">
                                <small className="text-s">Total Harga</small><br />
                                Rp {Number(detail.harga) * Number(detail.jumlah)}
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </ul>
                  </div>
                  <button type="submit" className="w-100 btn btn-success my-2">
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

export default Transaksi