const pathAPI = 'http://bababrown.ddns.net:3000/api/';
const PORT = 3000;
var queryID = window.location.search.split('=')[1];
if (queryID.includes('&')) {
    queryID = queryID.split('&')[0];
}
console.log(queryID)

const swalSuccess = (msg) => {
    Swal.fire({
        icon: 'success',
        title: msg,
        showConfirmButton: false,
        timer: 1000
    })
}


const swalError = (msg) => {
    Swal.fire({
        icon: 'error',
        title: msg,
        showConfirmButton: false,
        timer: 1000
    })
}


document.querySelector('#btnUpdateMessage').addEventListener('click', async () => {
    const message = document.querySelector('#textAreaMessage').value;

    if (message === '') {
        swalError('ไม่สามารถตั้งข้อความว่างเปล่าได้');
    } else {
        await axios.get(`${pathAPI}/setMessage?id=${queryID}&msg=${message}`)
            .then((res) => {
                swalSuccess('เพิ่มข้อความสำเร็จ');
                setTimeout(() => {
                    window.location.reload();
                }, 1600);
            }).catch((err) => {
                swalError('เกิดข้อผิดพลาด');
            })
    }
});


document.querySelector('#btnDelMsg').addEventListener('click', () => {
    Swal.fire({
        title: 'ลบข้อความ',
        text: 'คุณต้องการที่จะดำเนินการต่อใช่หรือไม่',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            axios.get(`${pathAPI}/setMessage?id=${queryID}&msg=`)
                .then((res) => {
                    swalSuccess('ลบข้อความสำเร็จ');
                    setTimeout(() => {
                        window.location.reload();
                    }, 1600);
                }).catch((err) => {
                    swalError('เกิดข้อผิดพลาด');
                })
        }
    });
});


const toggleAreaShow = (status) => {
    if (status !== -1) {
        let areaShow = document.querySelector('#area_show');
        let areaNoMsg = document.querySelector('#area_noMsg');
        (status ? areaShow.classList.remove('hidden') : areaShow.classList.add('hidden'));
        (status ? areaNoMsg.classList.add('hidden') : areaNoMsg.classList.remove('hidden'));
    }
}


const checkMsgID = async () => {
    // get msg id from url
    const msgID = queryID;
    if (msgID.length === 6) {
        document.querySelector('#qr_error').classList.add('hidden');
        await axios.get(`${pathAPI}/check?id=${msgID}`).then((res) => {
            if (res.data.data.msg) {
                toggleAreaShow(1);
                document.querySelector('#message').innerHTML = res.data.data.msg;
            } else {
                toggleAreaShow(0);
            }
        }).catch((err) => { console.log(err); });
    } else {
        toggleAreaShow(-1);
        swalError('QRcode Invalid!');
    }
} 


window.onload = () => {
    checkMsgID();
}
