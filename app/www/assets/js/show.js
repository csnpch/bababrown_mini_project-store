const pathAPI = 'http://localhost:3000/api/';
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



window.onload = async () => {
    await axios.get(`${pathAPI}/check?id=${queryID}`).then((res) => {
        if (res.data.data.msg) {
            document.querySelector('#message').innerHTML = res.data.data.msg;
        } else {
            window.location.href = `./setMsg.html?id=${queryID}`;
        }
    }).catch((err) => { console.log(err); });
}
