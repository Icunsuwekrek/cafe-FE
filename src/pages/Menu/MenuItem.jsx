import React from 'react'

export default function MenuItem(props) {
    return (
        <div className="w-100 m-2"
        style={{border:'2px solid black',borderRadius:'10px'}}
        >
            <img src={props.img} alt="img-menu" className='w-100 img-fluid rounded-2'
                style={{ height: '430px', aspectRatio: 4/4 }} />

            <div className='w-100 mt-2 p-2 text-center'>
                <h5 className='text-success mb-1 text-2xl'>
                    {props.nama_menu}
                </h5>

                <h6 className='fw-normal mb-1 text-xl'>
                    {props.jenis}
                </h6>
                <p>
                    {props.deskripsi}
                </p>
                <h5 className='text-success'>
                    Rp {props.harga}
                </h5>
            </div>
            <div className="w-100 p-2">
                <button className='btn'
                    style={{ backgroundColor: '#C8B6A6', fontFamily: 'monospace' }}
                    onClick={() => props.onEdit()}>
                    Edit
                </button>
                <button className="btn btn-danger mx-3"
                    onClick={() => props.onDelete()}
                    style={{fontFamily: 'monospace'}}
                    >
                    Hapus
                </button>
            </div>
        </div>
    )
}
