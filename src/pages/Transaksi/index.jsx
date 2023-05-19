import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../../components/Navbar";
const baseURL = `http://localhost:8000`

const header = {
    headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
    }
}

const Transaksi = () => {
    const [transaksi, setTransaksi] = useState([])

    /**method for get all transaksi */
    const getTransaksi = () => {
        const url = `${baseURL}/transaksi`
        axios.get(url, header)
            .then(response => {
                
                setTransaksi(response.data.data)
            })
            .catch(error => console.log(error))
    }

    useEffect(() => {
        getTransaksi()
    }, [])
    return (
    
        // <div className="w-100">
        //     <h3>Data Transaksi</h3>
        //     <ul className="list-group">
        //         {transaksi.map((item, index) => (
        //             <li className="list-group-item"
        //                 key={`trans${index}`}>
        //                 <div className="row">
        //                     <div className="col-md-3">
        //                         <small className="text-info">
        //                             Tgl. Transaksi
        //                         </small> <br />
        //                         {item.tgl_transaksi}
        //                     </div>
        //                     <div className="col-md-3">
        //                         <small className="text-info">
        //                             Nama pelanggan
        //                         </small> <br />
        //                         {item.nama_pelanggan}
        //                     </div>
        //                     <div className="col-md-2">
        //                         <small className="text-info">
        //                             No. Meja
        //                         </small> <br />
        //                         {item.meja.nomor_meja}
        //                     </div>
        //                     <div className="col-md-3">
        //                         <small className="text-info">
        //                             Status
        //                         </small> <br />
        //                         {item.status}
        //                     </div>
        //                 </div>

        //             </li>
        //         ))}
        //     </ul>
        // </div>
<>
<Navbar/>
<div className="container mx-auto my-12">
<div className="overflow-x-auto">
  <table className="min-w-full divide-y-2 divide-gray-200 text-sm">
    <thead>
      <tr>
        <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
          tgl_transaksi
        </th>
        <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
        Nama pelanggan
        </th>
        <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
        No. Meja
        </th>
        <th className="whitespace-nowrap px-4 py-2 text-left font-medium text-gray-900">
        Status
        </th>
       
      </tr>
    </thead>

    <tbody className="divide-y divide-gray-200">
      {transaksi.map((item) => {
        return (
          <tr>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              {item.tgl_transaksi}
            </td>
            <td className="whitespace-nowrap px-4 py-2 font-medium text-gray-900">
              {item.nama_pelanggan}
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
              {item.meja.nomor_meja}
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
              {item.status}
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
              {item.address}
            </td>
            <td className="whitespace-nowrap px-4 py-2 text-gray-700">
              {item.profile}
            </td>
         
          </tr>
        );
      })}
    </tbody>
  </table>
</div>

</div></>

    )
}
export default Transaksi