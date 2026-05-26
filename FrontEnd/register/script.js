const createBtn = document.getElementById("submit");
const errMsg = document.getElementById("error");
const nameRegex = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '+'];
const dialog = document.getElementById("modal");
const confirmBtn = document.getElementById("confrimBtn");
const closedialog = document.getElementById("closemodal");
const unlockPass = document.querySelector(".unlock-pass")
const lockPass = document.querySelector(".lock-pass")
/* let userData = {}; */

const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

lockPass.addEventListener("click", () => {
    const typePass = document.getElementById("password")
    const newtype = typePass.getAttribute("type") === "password" ? "text" : "password";
    typePass.setAttribute("type", newtype);
    if (newtype === "text") {
        unlockPass.style.display = "block";
        lockPass.style.display = "none";
    } else {
        unlockPass.style.display = "none";
        lockPass.style.display = "block";
    }
})

unlockPass.addEventListener("click", () => {
    const typePass = document.getElementById("password")
    const newtype = typePass.getAttribute("type") === "password" ? "text" : "password";
    typePass.setAttribute("type", newtype);
    if (newtype === "text") {
        unlockPass.style.display = "none";
        lockPass.style.display = "block";
    } else {
        unlockPass.style.display = "none";
        lockPass.style.display = "block";
    }
})

createBtn.addEventListener("click", async() => {
    try {
        const {nameInput, passInput, emailInput} = {
            nameInput: document.getElementById("name"),
            passInput: document.getElementById("password"),
            emailInput: document.getElementById("email")
        }

        const user = {
            name: nameInput.value.trim(),
            pass: passInput.value.trim(),
            email: emailInput.value.trim()
        }

        const hasBanned = nameRegex.some(item => user.name.includes(item));

        if (hasBanned) {
            errMsg.innerText = "ชื่อไม่ควรมีอักขระพิเศษจร้าา"
        } else if (user.name === "" && user.pass === "" && user.email === "") { 
            errMsg.innerText = "มึงก็ใส่ชื่อรหัสและอีเมลสิครับ"
        } else if (user.name === "" ) {
            errMsg.innerText = "ใส่ชื่อมาเหอะไม่อ่านหรอก"
        } else if (user.name.length < 3) {
            errMsg.innerText = "ชื่อสั้นไปป่าวววว"
        } else if (user.email === "") {
            errMsg.innerText = "ใส่อีเมลสิครับ"
        } else if (!validateEmail(user.email)) {
            errMsg.innerText = "เมลจริงปะเนี่ยหรือมั่วเอา?"
        } else if (user.pass === "" ) {
            errMsg.innerText = "ใส่รหัสสิครับ"
        } else if (user.pass.length < 8) {
            errMsg.innerText = "รหัสต้องมากกว่า 8 ครับท่าน"
        } else {
            /* loadingOverlay.style.display = "flex"; */
            const res = await fetch("https://kuaitunv3.onrender.com/user/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify( { name: user.name ,email: user.email, pass: user.pass } )
            });
        
        const data = await res.json();
        /* loadingOverlay.style.display = "none"; */
        
        if (data.success) {
            /* userData = user */
            alert(data.msg)
            /* dialog.showModal(); */
        } else {
            alert(data.msg);
        }
    }
    } catch (error) {
        console.error(error);
    }
});

/* confirmBtn.addEventListener("click", async () => {
    try {
        const inputOtp = document.getElementById("otp").value.trim();
        
        const res = await fetch("https://kuaitunv3.onrender.com/user/register", {
            method: "POST",
            headers: {
                    "Content-Type": "application/json"
                },
            body: JSON.stringify( { ...userData, otp: inputOtp } )
        });
        const data = await res.json();

        if(data.success) {
            createBtn.innerText = "Create account"
            dialog.close();
            alert("สมัครบัญชีเรียบร้อย");
        } else {
            alert(data.msg)
        }

    } catch (error) {
        console.error(error);
    }
 */

/* closedialog.addEventListener("click", () => {
    dialog;dialog.classList.add("closing");
    
    dialog.addEventListener("animationend",  handleClose = ()  => {
        dialog.classList.remove("closing");
        dialog.close();
        dialog.removeEventListener("animationend", handleClose);
    }, { once: true });
})

document.getElementById("lnw").addEventListener("click", () => {
    dialog.showModal();
}) */

window.clearMsg = () => {
    errMsg.innerText = ""
}